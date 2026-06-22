import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const email = (body.email || "").toLowerCase().trim();
    const { password, societe, contactNom, telephone } = body;

    if (!email || !password || !societe) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }

    const strong =
      password.length >= 10 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password);
    if (!strong) {
      return NextResponse.json({ error: "Mot de passe trop faible." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        email,
        password: hash,
        role: "CLIENT",
        client: {
          create: { societe, contactNom: contactNom || null, telephone: telephone || null },
        },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}