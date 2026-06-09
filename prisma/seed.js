const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const plans = [
    {
      name: 'Basic',
      stripePriceId: 'price_1THlZqQBtAFkvLsuIMSQSF9T',
      price: 2900,
      jobLimit: 0,
      canAccessCandidates: false,
      canFeatureJobs: false,
    },
    {
      name: 'Superior',
      stripePriceId: 'price_1THlaBQBtAFkvLsumE2c7utv',
      price: 19900,
      jobLimit: 1,
      canAccessCandidates: false,
      canFeatureJobs: false,
    },
    {
      name: 'Premium',
      stripePriceId: 'price_1THlaRQBtAFkvLsuw5qPZjW9',
      price: 49900,
      jobLimit: 1,
      canAccessCandidates: true,
      canFeatureJobs: true,
    },
  ]

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { stripePriceId: plan.stripePriceId },
      update: plan,
      create: plan,
    })
    console.log(`✓ Plan ${plan.name} créé`)
  }

  console.log('✅ Plans insérés en base')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())