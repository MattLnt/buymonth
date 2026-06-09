import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "VENDEUR") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const vendeur = await prisma.vendeur.findUnique({
      where: { userId: session.user.id },
      select: { nomBureau: true, nomCEO: true, telephone: true, adresse: true, emailContact: true, numeroBce: true },
    });
    return NextResponse.json(vendeur);
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "VENDEUR") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const body = await req.json();

    // Validation BCE
    if (body.numeroBce && !/^\d{10}$/.test(body.numeroBce)) {
      return NextResponse.json({ error: "Numéro BCE invalide — 10 chiffres requis" }, { status: 400 });
    }

    const updated = await prisma.vendeur.update({
      where: { userId: session.user.id },
      data: {
        nomBureau: body.nomBureau || "",
        nomCEO: body.nomCEO || "",
        telephone: body.telephone || "",
        adresse: body.adresse || "",
        numeroBce: body.numeroBce || null,
      },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}