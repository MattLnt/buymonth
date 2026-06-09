import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    const opportunite = await prisma.opportunite.findUnique({ where: { id } });
    if (!opportunite) return NextResponse.json({ error: "Non trouvé" }, { status: 404 });

    let isAbonne = false;
    if (session?.user?.role === "ACHETEUR") {
      const acheteur = await prisma.acheteur.findUnique({
        where: { userId: session.user.id },
        select: { subStatus: true },
      });
      isAbonne = acheteur?.subStatus === "active";
    }

    const type = isAbonne ? "abonne" : "publique";

    // Log la vue + incrément compteur
    await prisma.$transaction([
      prisma.vueOpportunite.create({
        data: { opportuniteId: id, type },
      }),
      prisma.opportunite.update({
        where: { id },
        data: isAbonne
          ? { vuesAbonnes: { increment: 1 } }
          : { vuesPubliques: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}