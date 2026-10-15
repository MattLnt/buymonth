import { stripe } from './stripe'
import { prisma } from './prisma'

/*
 * Résolution du client Stripe d'un promoteur.
 *
 * Un customer créé en mode test n'existe pas en mode live. Après la bascule, son
 * identifiant reste en base et le moindre appel répond « No such customer » :
 * l'espace promoteur affichait alors « Impossible de charger vos informations de
 * facturation » sans que rien ne soit réellement cassé. (Constaté le 15/10/2026
 * sur le compte de démonstration.)
 *
 * On traite donc un identifiant périmé comme une absence d'identifiant : on
 * l'efface, et on recrée un customer à la demande. L'ancien scripts/reset-abo.mjs
 * faisait ce ménage à la main, compte par compte.
 *
 * @param client          le Client Prisma (idéalement avec .user.email)
 * @param options.creer   false pour une simple lecture : renvoie null au lieu de créer
 * @returns le customer Stripe, ou null
 */
export async function resoudreCustomer(client, { creer = true } = {}) {
  if (!stripe || !client) return null

  const enBase = client.stripeCustomerId && client.stripeCustomerId !== 'NULL'
    ? client.stripeCustomerId
    : null

  if (enBase) {
    try {
      const customer = await stripe.customers.retrieve(enBase)
      // Un customer supprimé chez Stripe revient avec deleted: true au lieu de lever.
      if (!customer?.deleted) return customer
    } catch (e) {
      // resource_missing est définitif : l'identifiant ne vaut rien dans ce mode.
      // Toute autre erreur (réseau, clé invalide) doit remonter telle quelle.
      if (e?.code !== 'resource_missing') throw e
    }

    // Identifiant périmé : on le retire, ainsi que l'abonnement qui n'existe pas
    // davantage dans ce mode, pour ne pas y retomber à chaque appel.
    await prisma.client.update({
      where: { id: client.id },
      data: {
        stripeCustomerId: null,
        stripeSubId: null,
        subStatus: null,
        subEndsAt: null,
        trialEndsAt: null,
      },
    })
  }

  if (!creer) return null

  let email = client.user?.email
  if (!email) {
    const user = await prisma.user.findUnique({
      where: { id: client.userId },
      select: { email: true },
    })
    email = user?.email
  }

  const customer = await stripe.customers.create({
    email: email || undefined,
    name: client.societe || undefined,
    metadata: { clientId: client.id },
  })
  await prisma.client.update({
    where: { id: client.id },
    data: { stripeCustomerId: customer.id },
  })
  return customer
}
