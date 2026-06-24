import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import 'dotenv/config'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const email = process.argv[2]
if (!email) {
  console.error('❌ Donne un email : node scripts/reset-abo.mjs email@exemple.com')
  process.exit(1)
}

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: { client: true },
  })

  if (!user?.client) {
    console.error('❌ Aucun client trouvé pour', email)
    process.exit(1)
  }

  const client = user.client
  console.log('→ Client trouvé :', client.societe, '| customer Stripe :', client.stripeCustomerId)

  if (client.stripeCustomerId && client.stripeCustomerId !== 'NULL') {
    const subs = await stripe.subscriptions.list({ customer: client.stripeCustomerId, status: 'all', limit: 100 })
    console.log(`→ ${subs.data.length} subscription(s) trouvée(s)`)
    for (const sub of subs.data) {
      if (sub.status === 'canceled') continue
      try {
        await stripe.subscriptions.cancel(sub.id)
        console.log('  ✓ Annulée :', sub.id, `(était ${sub.status})`)
      } catch (e) {
        console.log('  – Ignorée :', sub.id, '—', e.message)
      }
    }
  }

  await prisma.client.update({
    where: { id: client.id },
    data: {
      subStatus: null,
      stripeSubId: null,
      subEndsAt: null,
      trialEndsAt: null,
      plan: 'CLASSIC',
    },
  })
  console.log('✓ Compte remis à zéro en base.')
  console.log('\n✅ Terminé. Déconnecte-toi puis reconnecte-toi, et refais un paiement propre.')
}

main()
  .catch((e) => { console.error('Erreur :', e.message) })
  .finally(() => prisma.$disconnect())