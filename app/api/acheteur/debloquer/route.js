import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ACHETEUR") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { opportuniteId, packCommission } = await req.json();

    const acheteur = await prisma.acheteur.findUnique({
      where: { userId: session.user.id },
    });

    if (!acheteur || acheteur.subStatus !== "active") {
      return NextResponse.json({ error: "Abonnement requis" }, { status: 403 });
    }

    const opportunite = await prisma.opportunite.findUnique({
      where: { id: opportuniteId },
    });

    if (!opportunite) {
      return NextResponse.json({ error: "Opportunité introuvable" }, { status: 404 });
    }

    // Vérifier si déjà débloqué
    const existing = await prisma.deblocage.findUnique({
      where: { acheteurId_opportuniteId: { acheteurId: acheteur.id, opportuniteId } },
    });
    if (existing?.paidAt) {
      return NextResponse.json({ error: "Déjà débloqué" }, { status: 400 });
    }

    // Créer le deblocage en attente
    await prisma.deblocage.upsert({
      where: { acheteurId_opportuniteId: { acheteurId: acheteur.id, opportuniteId } },
      create: { acheteurId: acheteur.id, opportuniteId, packCommission },
      update: { packCommission },
    });

    // Créer session Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: acheteur.stripeCustomerId,
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: {
            name: `Déblocage dossier — ${opportunite.province} · Pack ${packCommission}`,
            description: `CA : ${opportunite.chiffreAffaires.toLocaleString("fr-BE")} € · Commission : ${packCommission === 1 ? "1,5%" : packCommission === 2 ? "3,5%" : packCommission === 3 ? "3,5%" : "5%"}`,
          },
          unit_amount: 69900,
        },
        quantity: 1,
      }],
      metadata: {
        acheteurId: acheteur.id,
        opportuniteId,
        packCommission: String(packCommission),
        type: "deblocage",
      },
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/acheteur/opportunites/${opportuniteId}?success=1`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/acheteur/opportunites/${opportuniteId}`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}