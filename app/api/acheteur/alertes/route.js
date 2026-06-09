import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACHETEUR") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const { alertesEmail, alerteProvinces, alerteTypeDeals, alerteCaMin, alerteCaMax } = await req.json();

    await prisma.acheteur.update({
      where: { userId: session.user.id },
      data: {
        alertesEmail: alertesEmail ?? true,
        alerteProvinces: alerteProvinces || [],
        alerteTypeDeals: alerteTypeDeals || [],
        alerteCaMin: alerteCaMin ?? null,
        alerteCaMax: alerteCaMax ?? null,
      },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}