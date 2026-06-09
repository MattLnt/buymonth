import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendResetPassword } from "@/lib/emails";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const { action, userId, email } = await req.json();
    if (!userId) return NextResponse.json({ error: "userId requis" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

    if (action === "update-email") {
      const clean = (email || "").trim().toLowerCase();
      if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
        return NextResponse.json({ error: "Email invalide" }, { status: 400 });
      }
      const existing = await prisma.user.findUnique({ where: { email: clean } });
      if (existing && existing.id !== userId) {
        return NextResponse.json({ error: "Cet email est déjà utilisé par un autre compte" }, { status: 400 });
      }
      await prisma.user.update({ where: { id: userId }, data: { email: clean } });
      return NextResponse.json({ message: "Email mis à jour." });
    }

    if (action === "send-reset") {
      await prisma.passwordResetToken.deleteMany({ where: { userId, usedAt: null } });
      const token = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      await prisma.passwordResetToken.create({
        data: { userId, tokenHash, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
      });
      const baseUrl = process.env.NEXTAUTH_URL || "https://courtier-tawny.vercel.app";
      const resetUrl = `${baseUrl}/reinitialiser-mot-de-passe?token=${token}`;
      await sendResetPassword(user.email, resetUrl);
      return NextResponse.json({ message: "Lien de réinitialisation envoyé." });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}