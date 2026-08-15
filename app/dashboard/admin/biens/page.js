import { prisma } from '@/lib/prisma'
import { AdminBiensExplorer } from '@/app/components/dashboard/AdminBiensExplorer'

export const dynamic = 'force-dynamic'

export default async function AdminBiensPage() {
  const biensRaw = await prisma.bien.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      client: { select: { societe: true } },
      _count: { select: { leads: true } },
    },
  })

  // On aplatit pour l'explorer (client component)
  const biens = biensRaw.map((b) => ({
    id: b.id,
    titre: b.titre,
    ville: b.ville,
    province: b.province,
    type: b.type,
    mensualite: b.mensualite,
    prixTotal: b.prixTotal,
    published: b.published,
    images: b.images,
    societe: b.client?.societe || null,
    nbLeads: b._count?.leads || 0,
  }))

  return <AdminBiensExplorer biens={biens} />
}