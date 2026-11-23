import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getT } from "@/lib/i18n/server";

export async function POST(req) {
  const { lang, t } = await getT();
  try {
    const body = await req.json();
    const email = (body.email || "").toLowerCase().trim();
    const { password, societe, contactNom, telephone } = body;

    if (!email || !password || !societe) {
      return NextResponse.json({ error: t("Champs requis manquants.", "Verplichte velden ontbreken.") }, { status: 400 });
    }

    const strong =
      password.length >= 10 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password);
    if (!strong) {
      return NextResponse.json({ error: t("Mot de passe trop faible.", "Wachtwoord te zwak.") }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: t("Cet email est déjà utilisé.", "Dit e-mailadres is al in gebruik.") }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        email,
        password: hash,
        role: "CLIENT",
        langue: lang,
        client: {
          create: { societe, contactNom: contactNom || null, telephone: telephone || null },
        },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: t("Erreur serveur.", "Serverfout.") }, { status: 500 });
  }
}