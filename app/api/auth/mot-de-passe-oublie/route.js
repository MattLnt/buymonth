import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendResetPassword } from "@/lib/email";
import { getT } from "@/lib/i18n/server";
import { withLang } from "@/lib/i18n/config";

export async function POST(req) {
  const { t, lang } = await getT();
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: t("Email requis", "E-mail verplicht") }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // On répond toujours pareil, que le compte existe ou non,
    // pour ne pas permettre de deviner quels emails sont inscrits
    if (user) {
      // Invalide les anciens tokens non utilisés
      await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id, usedAt: null },
      });

      const token = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 heure
        },
      });

      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const resetUrl = withLang(`${baseUrl}/reinitialiser-mot-de-passe?token=${token}`, lang);

      try {
        await sendResetPassword(user.email, resetUrl, lang);
      } catch (e) {
        console.error("Erreur email reset:", e);
      }
    }

    return NextResponse.json({
      message: t(
        "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
        "Als er een account bestaat met dit e-mailadres, is er een link verstuurd om uw wachtwoord opnieuw in te stellen."
      ),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: t("Erreur serveur", "Serverfout") }, { status: 500 });
  }
}