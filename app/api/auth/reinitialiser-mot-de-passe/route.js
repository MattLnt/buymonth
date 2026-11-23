import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getT } from "@/lib/i18n/server";

export async function POST(req) {
  const { t } = await getT();
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: t("Données manquantes", "Ontbrekende gegevens") }, { status: 400 });
    }

    // Mêmes critères que l'inscription
    const valide =
      password.length >= 9 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password);
    if (!valide) {
      return NextResponse.json(
        { error: t("Le mot de passe ne respecte pas les critères de sécurité.", "Het wachtwoord voldoet niet aan de veiligheidsvoorwaarden.") },
        { status: 400 }
      );
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: t("Ce lien est invalide ou a expiré. Refaites une demande.", "Deze link is ongeldig of verlopen. Vraag een nieuwe link aan.") },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ message: t("Mot de passe modifié avec succès.", "Wachtwoord met succes gewijzigd.") });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: t("Erreur serveur", "Serverfout") }, { status: 500 });
  }
}