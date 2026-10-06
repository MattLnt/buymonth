import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

/*
 * GET /api/abonnement/facturation
 *
 * Tout ce que le portail Stripe affichait, mais en données brutes, pour que
 * l'espace promoteur le présente lui-même : moyen de paiement en cours et
 * dernières factures. Le promoteur ne quitte plus le site.
 *
 * On ne renvoie jamais autre chose que ce qui est affichable : quatre derniers
 * chiffres, mois et année d'expiration. Aucun numéro complet, aucun IBAN entier.
 */

function moyenLisible(pm) {
  if (!pm) return null
  if (pm.type === 'card' && pm.card) {
    return {
      type: 'card',
      libelle: 'Carte bancaire',
      marque: pm.card.brand || null,
      fin: pm.card.last4 || null,
      expireLe: pm.card.exp_month && pm.card.exp_year
        ? `${String(pm.card.exp_month).padStart(2, '0')}/${pm.card.exp_year}`
        : null,
    }
  }
  if (pm.type === 'sepa_debit' && pm.sepa_debit) {
    return {
      type: 'sepa_debit',
      libelle: 'Prélèvement SEPA',
      marque: pm.sepa_debit.bank_code || null,
      fin: pm.sepa_debit.last4 || null,
      expireLe: null,
    }
  }
  return { type: pm.type, libelle: 'Moyen de paiement', marque: null, fin: null, expireLe: null }
}

const STATUT_FACTURE = {
  paid: 'Payée',
  open: 'En attente',
  draft: 'Brouillon',
  uncollectible: 'Irrécouvrable',
  void: 'Annulée',
}

export async function GET() {
  try {
    if (!stripe) return NextResponse.json({ error: 'Stripe non configuré.' }, { status: 500 })

    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
    if (!client?.stripeCustomerId || client.stripeCustomerId === 'NULL') {
      return NextResponse.json({ moyen: null, factures: [], resiliation: null })
    }

    const customer = await stripe.customers.retrieve(client.stripeCustomerId)
    const defautId = customer?.invoice_settings?.default_payment_method || null

    let moyen = null
    if (defautId) {
      const pm = await stripe.paymentMethods.retrieve(
        typeof defautId === 'string' ? defautId : defautId.id
      )
      moyen = moyenLisible(pm)
    }

    const liste = await stripe.invoices.list({ customer: client.stripeCustomerId, limit: 24 })
    const factures = (liste?.data || [])
      // Les brouillons ne concernent pas le promoteur : ils ne sont pas encore dus.
      .filter((f) => f.status !== 'draft')
      .map((f) => ({
        id: f.id,
        numero: f.number || null,
        date: (f.status_transitions?.paid_at || f.created) * 1000,
        montant: f.total,
        devise: f.currency,
        statut: f.status,
        statutLabel: STATUT_FACTURE[f.status] || f.status,
        pdf: f.invoice_pdf || null,
        aRegler: f.status === 'open' ? f.hosted_invoice_url || null : null,
      }))

    // Résiliation programmée : Stripe l'exprime soit par cancel_at_period_end,
    // soit par une date precise dans cancel_at (c'est le cas du portail client).
    let resiliation = null
    if (client.stripeSubId) {
      try {
        const sub = await stripe.subscriptions.retrieve(client.stripeSubId)
        if (sub.cancel_at || sub.cancel_at_period_end) {
          const fin = sub.cancel_at || sub.current_period_end || sub.items?.data?.[0]?.current_period_end
          resiliation = { le: fin ? fin * 1000 : null }
        }
      } catch {
        // abonnement introuvable cote Stripe : on n'affiche simplement rien
      }
    }

    return NextResponse.json({ moyen, factures, resiliation })
  } catch (e) {
    console.error('[FACTURATION]', e?.message)
    return NextResponse.json({ error: 'Impossible de charger vos informations de facturation.' }, { status: 500 })
  }
}
