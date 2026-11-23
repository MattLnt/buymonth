import { getCurrentClient } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/app/components/dashboard/Ui'
import { BienForm } from '@/app/components/dashboard/BienForm'
import { getConfigMensualite } from '@/lib/settings'
import { getT } from '@/lib/i18n/server'

export const dynamic = 'force-dynamic'

export default async function NouveauBienPage() {
  const client = await getCurrentClient()
  const { t } = await getT()
  const cfg = await getConfigMensualite()

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
      <PageHeader title={t('Nouveau bien', 'Nieuw pand')} subtitle={t('Encodez votre bien, la mensualité est calculée automatiquement.', 'Voer uw pand in, het maandbedrag wordt automatisch berekend.')} />
      <BienForm mode="create" projets={projets} cfg={cfg} />
    </>
  )
}