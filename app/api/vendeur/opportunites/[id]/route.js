import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "VENDEUR") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const { id } = await params;
    const vendeur = await prisma.vendeur.findUnique({ where: { userId: session.user.id } });
    const opportunite = await prisma.opportunite.findUnique({ where: { id } });
    if (!opportunite || opportunite.vendeurId !== vendeur.id) {
      return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
    }
    return NextResponse.json(opportunite);
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "VENDEUR") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const vendeur = await prisma.vendeur.findUnique({ where: { userId: session.user.id } });
    const opportunite = await prisma.opportunite.findUnique({ where: { id } });
    if (!opportunite || opportunite.vendeurId !== vendeur.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    const data = {};
    if (body.status !== undefined) data.status = body.status;
    if (body.province !== undefined) data.province = body.province;
    if (body.chiffreAffaires !== undefined) data.chiffreAffaires = body.chiffreAffaires;
    if (body.nombreClients !== undefined) data.nombreClients = body.nombreClients;
    if (body.nombreCollaborateurs !== undefined) data.nombreCollaborateurs = body.nombreCollaborateurs;
    if (body.activites !== undefined) data.activites = body.activites;
    if (body.typeDeal !== undefined) data.typeDeal = body.typeDeal;
    if (body.presenceDirigeant !== undefined) data.presenceDirigeant = body.presenceDirigeant;
    if (body.description !== undefined) data.description = body.description;
    if (body.utiliseBrio !== undefined) data.utiliseBrio = body.utiliseBrio;
    if (body.exclusiviteCompagnie !== undefined) data.exclusiviteCompagnie = body.exclusiviteCompagnie;
    if (body.nomCompagnie !== undefined) data.nomCompagnie = body.nomCompagnie;
    if (body.venteImmeuble !== undefined) data.venteImmeuble = body.venteImmeuble;
    if (body.valeurImmeuble !== undefined) data.valeurImmeuble = body.valeurImmeuble;
    if (body.dossierDigitalise !== undefined) data.dossierDigitalise = body.dossierDigitalise;
    if (body.logiciels !== undefined) data.logiciels = body.logiciels;
    if (body.caIard !== undefined) data.caIard = body.caIard;
    if (body.caVie !== undefined) data.caVie = body.caVie;
    if (body.caCreditImmo !== undefined) data.caCreditImmo = body.caCreditImmo;
    if (body.caCreditTempo !== undefined) data.caCreditTempo = body.caCreditTempo;
    if (body.caPlacement !== undefined) data.caPlacement = body.caPlacement;
    if (body.caBanque !== undefined) data.caBanque = body.caBanque;
    if (body.adressesComplementaires !== undefined) data.adressesComplementaires = body.adressesComplementaires;
    const updated = await prisma.opportunite.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "VENDEUR") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const { id } = await params;
    const vendeur = await prisma.vendeur.findUnique({ where: { userId: session.user.id } });
    const opportunite = await prisma.opportunite.findUnique({ where: { id } });
    if (!opportunite || opportunite.vendeurId !== vendeur.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    await prisma.opportunite.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}