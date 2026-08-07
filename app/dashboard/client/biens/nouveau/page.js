import { getCurrentClient } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/app/components/dashboard/Ui'
import { BienForm } from '@/app/components/dashboard/BienForm'

export const dynamic = 'force-dynamic'

export default async function NouveauBienPage() {
  const client = await getCurrentClient()

  // Liste des projets existants du client (pour l'autocomplétion), sans doublon ni vide
  const rows = await prisma.bien.findMany({
    where: { clientId: client.id, projet: { not: null } },
    select: { projet: true },
    distinct: ['projet'],
    orderBy: { projet: 'asc' },
  })
  const projets = rows.map((r) => r.projet).filter((p) => p && p !== 'Hors projet')

  return (
    <>
      <PageHeader title="Nouveau bien" subtitle="Encodez votre bien, la mensualité est calculée automatiquement." />
      <BienForm mode="create" projets={projets} />
    </>
  )
}