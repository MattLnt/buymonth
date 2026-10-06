import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe, priceForFormule } from '@/lib/stripe'
import { STATUTS_FACTURABLES, prochainPremierDuMois } from '@/lib/facturation'
import { getSettings } from '@/lib/settings'

export async function POST(req) {
  try {
    if (!stripe) return NextResponse.json({ error: 'Stripe non configuré.' }, { status: 500 })

    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    const { paymentMethodId } = await req.json()
    if (!paymentMethodId) return NextResponse.json({ error: 'Moyen de paiement manquant.' }, { status: 400 })

    const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
    if (!client?.stripeCustomerId) return NextResponse.json({ error: 'Client Stripe introuvable.' }, { status: 404 })

    const customerId = client.stripeCustomerId

    // Décompte : on facture les biens ACTIF + OPTION (« bien actif » au sens contractuel)
    const quantite = await prisma.bien.count({
      where: { clientId: client.id, statut: { in: STATUTS_FACTURABLES } },
    })
    if (quantite < 1) {
      return NextResponse.json({ error: 'Ajoutez au moins un bien actif (ou en option) avant de vous abonner.' }, { status: 400 })
    }

    const price = priceForFormule(client.formule)
    if (!price) return NextResponse.json({ error: 'Tarif de la formule non configuré.' }, { status: 500 })

    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    })

    const settings = await getSettings()
    const avecEssai = settings.essaiActif && settings.essaiJours > 0

    // « L'abonnement se paie le 1er du mois pour tout le monde » (dossier V9,
    // partie 8.1). Rien n'est donc preleve a l'inscription, carte comprise : on
    // ouvre une periode sans facturation jusqu'au prochain 1er, et le mois partiel
    // est ajoute en ligne separee sur la facture de ce 1er.
    let finPeriodeSansFacture = prochainPremierDuMois()
    if (avecEssai) {
      // Essai accorde par l'admin : on repousse jusqu'au 1er qui laisse au moins
      // le nombre de jours prevu, pour que le prelevement tombe toujours un 1er.
      const minimum = Date.now() + settings.essaiJours * 24 * 60 * 60 * 1000
      while (finPeriodeSansFacture * 1000 < minimum) {
        finPeriodeSansFacture = prochainPremierDuMois(new Date(finPeriodeSansFacture * 1000))
      }
    }

    // Prorata du mois partiel, pose en element de facture : Stripe le joint
    // automatiquement a la prochaine facture, donc a celle du 1er. Un essai
    // accorde par l'admin est gratuit, on ne facture alors pas le partiel.
    if (!avecEssai) {
      const maintenant = new Date()
      const joursDuMois = new Date(maintenant.getFullYear(), maintenant.getMonth() + 1, 0).getDate()
      const joursRestants = Math.max(0, Math.ceil((finPeriodeSansFacture * 1000 - Date.now()) / 86400000))
      // Montant unitaire lu chez Stripe, et non dans le code : c'est le prix
      // reellement facture qui doit servir de base au prorata.
      const prixStripe = await stripe.prices.retrieve(price)
      const unitaire = prixStripe?.unit_amount || 0
      const montant = Math.round((unitaire * quantite * joursRestants) / joursDuMois)
      if (montant > 0 && joursRestants > 0) {
        await stripe.invoiceItems.create({
          customer: customerId,
          amount: montant,
          currency: prixStripe?.currency || 'eur',
          description: `Abonnement du ${maintenant.toLocaleDateString('fr-BE')} au 1er du mois suivant — ${quantite} bien${quantite > 1 ? 's' : ''} au prorata (${joursRestants} jour${joursRestants > 1 ? 's' : ''})`,
        })
      }
    }

    const subData = {
      customer: customerId,
      items: [{ price, quantity: quantite }],
      default_payment_method: paymentMethodId,
      payment_settings: { payment_method_types: ['card'] },
      metadata: { clientId: client.id, formule: client.formule },
      trial_end: finPeriodeSansFacture,
      proration_behavior: 'none',
    }

    const sub = await stripe.subscriptions.create(subData)

    // Date de fin de période : sur l'item dans les versions récentes de l'API
    const periodEnd = sub.current_period_end || sub.items?.data?.[0]?.current_period_end || null

    await prisma.client.update({
      where: { id: client.id },
      data: {
        stripeSubId: sub.id,
        subStatus: sub.status,
        subEndsAt: periodEnd ? new Date(periodEnd * 1000) : null,
        trialEndsAt: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
      },
    })

    return NextResponse.json({ ok: true, status: sub.status })
  } catch (e) {
    console.error('[CREER-ABO]', e?.message)
    return NextResponse.json({ error: e?.message || 'Erreur serveur.' }, { status: 500 })
  }
}