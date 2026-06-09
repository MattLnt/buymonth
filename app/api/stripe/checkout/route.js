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

    const acheteur = await prisma.acheteur.findUnique({
      where: { userId: session.user.id },
    });

    // Créer ou récupérer le customer Stripe
    let customerId = acheteur.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: { acheteurId: acheteur.id },
      });
      customerId = customer.id;
      await prisma.acheteur.update({
        where: { id: acheteur.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{
        price: process.env.STRIPE_PRICE_ABONNEMENT,
        quantity: 1,
      }],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/acheteur?abonnement=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/acheteur/forfait`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}