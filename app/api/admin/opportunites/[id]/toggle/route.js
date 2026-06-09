import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { envoyerAlertesNouvelleOpportunite } from "@/lib/emails";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    const current = await prisma.opportunite.findUnique({
      where: { id },
      select: { status: true },
    });
    if (!current) {
      return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
    }

    const opportunite = await prisma.opportunite.update({
      where: { id },
      data: { status },
    });

    // Cas rare : un dossier encore jamais publié activé via l'admin
    if (current.status === "PENDING" && status === "ACTIVE") {
      try {
        await envoyerAlertesNouvelleOpportunite(opportunite);
      } catch (e) {
        console.error("Erreur envoi alertes:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}