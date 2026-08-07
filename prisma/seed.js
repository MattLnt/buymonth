const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@buymonth.be'
  const adminPassword = 'admin1234'
  const adminHash = await bcrypt.hash(adminPassword, 12)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: adminHash, role: 'ADMIN' },
    create: { email: adminEmail, password: adminHash, role: 'ADMIN' },
  })
  console.log('Admin : ' + adminEmail + ' / ' + adminPassword)

  const promoEmail = 'promo@buymonth.be'
  const promoPassword = 'promo1234'
  const promoHash = await bcrypt.hash(promoPassword, 12)

  const promoUser = await prisma.user.upsert({
    where: { email: promoEmail },
    update: { password: promoHash, role: 'CLIENT' },
    create: { email: promoEmail, password: promoHash, role: 'CLIENT' },
  })

  const existingClient = await prisma.client.findUnique({ where: { userId: promoUser.id } })
  if (!existingClient) {
    await prisma.client.create({
      data: {
        userId: promoUser.id,
        societe: 'Promoteur Test',
        contactNom: 'Jean Test',
        telephone: '+32 470 00 00 00',
        formule: 'PRO',
      },
    })
  }
  console.log('Promoteur : ' + promoEmail + ' / ' + promoPassword)
  console.log('Seed BuyMonth termine')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())