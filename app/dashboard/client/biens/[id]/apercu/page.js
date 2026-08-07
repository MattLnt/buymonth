import { getCurrentClient } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { BienFiche } from '@/app/components/public/BienFiche'

export const dynamic = 'force-dynamic'

export default async function ApercuBienPage({ params }) {
  const { id } = await params
  const client = await getCurrentClient()

  const bien = await prisma.bien.findUnique({
    where: { id },
    include: { client: { select: { id: true, societe: true, logoUrl: true, telephone: true } } },
  })

  // Réservé au propriétaire du bien
  if (!bien || bien.client?.id !== client?.id) {
    redirect('/dashboard/client/biens')
  }

  return <BienFiche bien={bien} apercu />
}