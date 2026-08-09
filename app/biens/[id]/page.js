import { prisma } from '@/lib/prisma'
import { calculMensualite } from '@/lib/calcul'
import { notFound } from 'next/navigation'
import { BienFiche } from '@/app/components/public/BienFiche'

export const dynamic = 'force-dynamic'

export default async function BienDetailPage({ params }) {
  const { id } = await params

  const bien = await prisma.bien.findUnique({
    where: { id },
    include: { client: { select: { id: true, societe: true, slug: true, logoUrl: true, telephone: true } } },
  })

  if (!bien || !bien.published) notFound()

  prisma.bien.update({ where: { id }, data: { vues: { increment: 1 } } }).catch(() => {})

  return <BienFiche bien={bien} />
}