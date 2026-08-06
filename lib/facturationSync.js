import { stripe } from './stripe'
import { prisma } from './prisma'

/*
 * Répercute le nombre de biens ACTIFS sur l'abonnement Stripe du client.
 * Appelé après toute création / modification de statut / suppression de bien.
 *
 * - >= 1 bien actif  : on cale la quantité de l'abonnement (proration) et on
 *                      réactive la facturation si elle était suspendue.
 * - 0 bien actif     : on suspend la facturation (aucun débit) — Stripe
 *                      n'autorise pas une quantité 0 sur un prix par unité.
 *
 * Sans effet si le client n'a pas d'abonnement actif (rien à synchroniser).
 */
export async function syncQuantiteAbonnement(clientId) {
  if (!stripe) return
  const client = await prisma.client.findUnique({ where: { id: clientId } })
  if (!client?.stripeSubId) return
  if (!['active', 'trialing', 'past_due'].includes(client.subStatus || '')) return

  const quantite = await prisma.bien.count({ where: { clientId, statut: 'ACTIF' } })

  try {
    const sub = await stripe.subscriptions.retrieve(client.stripeSubId)
    const item = sub.items?.data?.[0]
    if (!item) return

    // Aucun bien actif → on suspend la facturation (aucun débit)
    if (quantite <= 0) {
      if (!sub.pause_collection) {
        await stripe.subscriptions.update(client.stripeSubId, {
          pause_collection: { behavior: 'void' },
        })
      }
      return
    }

    // Au moins un bien actif → réactiver si suspendu + caler la quantité
    const updates = {}
    if (sub.pause_collection) updates.pause_collection = ''
    if (item.quantity !== quantite) {
      updates.items = [{ id: item.id, quantity: quantite }]
      updates.proration_behavior = 'create_prorations'
    }
    if (Object.keys(updates).length) {
      await stripe.subscriptions.update(client.stripeSubId, updates)
    }
  } catch (e) {
    console.error('[SYNC-QTE]', e?.message)
  }
}