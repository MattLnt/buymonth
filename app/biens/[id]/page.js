import { prisma } from '@/lib/prisma'
import { calculMensualite } from '@/lib/calcul'
import { notFound } from 'next/navigation'
import { BienFiche } from '@/app/components/public/BienFiche'
import { estPromoteurActif } from '@/lib/facturation'

export const dynamic = 'force-dynamic'

export default async function BienDetailPage({ params }) {
  const { id } = await params

  const bien = await prisma.bien.findUnique({
    where: { id },
    include: { client: { select: { id: true, societe: true, slug: true, logoUrl: true, telephone: true, subStatus: true } } },
  })

  // 404 si le bien n'existe pas, n'est pas publié, ou si son promoteur n'est pas abonné
  if (!bien || !bien.published || !estPromoteurActif(bien.client)) notFound()

  prisma.bien.update({ where: { id }, data: { vues: { increment: 1 } } }).catch(() => {})

  return <BienFiche bien={bien} />
}