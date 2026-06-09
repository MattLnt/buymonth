import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACHETEUR") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const acheteur = await prisma.acheteur.findUnique({
      where: { userId: session.user.id },
      select: {
        nomBureau: true, nomCEO: true, telephone: true, adresse: true,
        siteInternet: true, chiffreAffaires: true, nombreClients: true,
        nombreCollaborateurs: true, activites: true, alertesEmail: true,
        subStatus: true,
      },
    });
    return NextResponse.json(acheteur);
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACHETEUR") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const body = await req.json();
    const updated = await prisma.acheteur.update({
      where: { userId: session.user.id },
      data: {
        nomBureau: body.nomBureau || null,
        nomCEO: body.nomCEO || null,
        telephone: body.telephone || null,
        adresse: body.adresse || null,
        siteInternet: body.siteInternet || null,
        chiffreAffaires: body.chiffreAffaires ?? null,
        nombreClients: body.nombreClients ?? null,
        nombreCollaborateurs: body.nombreCollaborateurs ?? null,
        activites: body.activites || [],
      },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}