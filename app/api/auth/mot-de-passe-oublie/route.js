import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendResetPassword } from "@/lib/emails";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
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

      const baseUrl = process.env.NEXTAUTH_URL || "https://courtier-tawny.vercel.app";
      const resetUrl = `${baseUrl}/reinitialiser-mot-de-passe?token=${token}`;

      try {
        await sendResetPassword(user.email, resetUrl);
      } catch (e) {
        console.error("Erreur email reset:", e);
      }
    }

    return NextResponse.json({
      message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}