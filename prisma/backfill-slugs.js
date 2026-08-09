const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function slugify(str) {
  return (str || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

async function main() {
  const clients = await prisma.client.findMany({
    where: { slug: null },
    select: { id: true, societe: true },
  })

  if (clients.length === 0) {
    console.log('Aucun promoteur sans slug. Rien a faire.')
    return
  }

  for (const c of clients) {
    const base = slugify(c.societe) || 'agence'
    let slug = base
    let n = 1

    // Garantit l'unicite (ajoute -2, -3... si collision)
    while (true) {
      const existant = await prisma.client.findUnique({ where: { slug } })
      if (!existant) break
      n += 1
      slug = `${base}-${n}`
    }

    await prisma.client.update({ where: { id: c.id }, data: { slug } })
    console.log(`${c.societe} -> ${slug}`)
  }

  console.log(`\n${clients.length} promoteur(s) mis a jour.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())