import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ subStatus: null });

    const acheteur = await prisma.acheteur.findUnique({
      where: { userId: session.user.id },
      select: { id: true, subStatus: true, alertesEmail: true, stripeSubId: true, stripeCustomerId: true },
    });

    let stripeSubId = acheteur?.stripeSubId || null;

    // Auto-réparation : abonné actif mais stripeSubId manquant en DB
    if (!stripeSubId && acheteur?.stripeCustomerId && acheteur?.subStatus === "active") {
      try {
        const subs = await stripe.subscriptions.list({
          customer: acheteur.stripeCustomerId,
          status: "active",
          limit: 1,
        });
        if (subs.data.length > 0) {
          stripeSubId = subs.data[0].id;
          await prisma.acheteur.update({
            where: { id: acheteur.id },
            data: { stripeSubId },
          });
        }
      } catch (e) {
        console.error("Backfill stripeSubId error:", e);
      }
    }

    let subEndsAt = null;
    let cancelAtPeriodEnd = false;

    if (stripeSubId && acheteur?.subStatus === "active") {
      try {
        const subscription = await stripe.subscriptions.retrieve(stripeSubId);
        const periodEnd = subscription.current_period_end ?? subscription.items?.data?.[0]?.current_period_end;
        if (periodEnd) subEndsAt = new Date(periodEnd * 1000).toISOString();
        cancelAtPeriodEnd = subscription.cancel_at_period_end === true;
      } catch (e) {
        // abonnement introuvable côté Stripe — on renvoie juste le statut DB
      }
    }

    return NextResponse.json({
      subStatus: acheteur?.subStatus || null,
      alertesEmail: acheteur?.alertesEmail ?? true,
      subEndsAt,
      cancelAtPeriodEnd,
    });
  } catch (e) {
    return NextResponse.json({ subStatus: null });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { action } = await req.json();

    const acheteur = await prisma.acheteur.findUnique({
      where: { userId: session.user.id },
      select: { stripeSubId: true, subStatus: true },
    });

    if (!acheteur?.stripeSubId || acheteur.subStatus !== "active") {
      return NextResponse.json({ error: "Aucun abonnement actif" }, { status: 400 });
    }

    if (action === "cancel") {
      const subscription = await stripe.subscriptions.update(acheteur.stripeSubId, {
        cancel_at_period_end: true,
      });
      const periodEnd = subscription.current_period_end ?? subscription.items?.data?.[0]?.current_period_end;
      return NextResponse.json({
        success: true,
        subEndsAt: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      });
    }

    if (action === "reactivate") {
      await stripe.subscriptions.update(acheteur.stripeSubId, {
        cancel_at_period_end: false,
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}