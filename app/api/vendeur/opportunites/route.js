import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { envoyerAlertesNouvelleOpportunite } from "@/lib/emails";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "VENDEUR") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const vendeur = await prisma.vendeur.findUnique({ where: { userId: session.user.id } });

    if (!vendeur) {
      return NextResponse.json({ error: "Vendeur introuvable" }, { status: 404 });
    }

    const opportunite = await prisma.opportunite.create({
      data: {
        vendeurId: vendeur.id,
        province: body.province,
        chiffreAffaires: body.chiffreAffaires,
        nombreClients: body.nombreClients,
        nombreCollaborateurs: body.nombreCollaborateurs,
        activites: body.activites,
        typeDeal: body.typeDeal,
        presenceDirigeant: body.presenceDirigeant,
        description: body.description || null,
        utiliseBrio: body.utiliseBrio ?? null,
        exclusiviteCompagnie: body.exclusiviteCompagnie ?? null,
        nomCompagnie: body.nomCompagnie || null,
        venteImmeuble: body.venteImmeuble ?? null,
        valeurImmeuble: body.valeurImmeuble ?? null,
        dossierDigitalise: body.dossierDigitalise ?? null,
        logiciels: body.logiciels || null,
        caIard: body.caIard ?? null,
        caVie: body.caVie ?? null,
        caCreditImmo: body.caCreditImmo ?? null,
        caCreditTempo: body.caCreditTempo ?? null,
        caPlacement: body.caPlacement ?? null,
        caBanque: body.caBanque ?? null,
        adressesComplementaires: body.adressesComplementaires || [],
      },
    });

    // Le dossier est publié immédiatement (status ACTIVE par défaut)
    // -> alerte email aux acheteurs abonnés concernés
    if (opportunite.status === "ACTIVE") {
      try {
        await envoyerAlertesNouvelleOpportunite(opportunite);
      } catch (e) {
        console.error("Erreur envoi alertes:", e);
      }
    }

    return NextResponse.json(opportunite);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}