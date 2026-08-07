import { getCurrentClient } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/app/components/dashboard/Ui'
import { BienForm } from '@/app/components/dashboard/BienForm'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditBienPage({ params }) {
  const { id } = await params
  const client = await getCurrentClient()

  const bien = await prisma.bien.findUnique({ where: { id } })
  if (!bien || bien.clientId !== client?.id) redirect('/dashboard/client/biens')

  // Projets existants du client pour l'autocomplétion
  const rows = await prisma.bien.findMany({
    where: { clientId: client.id, projet: { not: null } },
    select: { projet: true },
    distinct: ['projet'],
    orderBy: { projet: 'asc' },
  })
  const projets = rows.map((r) => r.projet).filter((p) => p && p !== 'Hors projet')

  return (
    <>
      <PageHeader title="Éditer le bien" subtitle={bien.titre} />
      <BienForm mode="edit" initial={bien} projets={projets} />
    </>
  )
}