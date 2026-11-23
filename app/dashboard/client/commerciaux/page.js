import { redirect } from 'next/navigation'
import { getCurrentClient } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/app/components/dashboard/Ui'
import { RoutageLeadsForm } from '@/app/components/dashboard/RoutageLeadsForm'
import { getT } from '@/lib/i18n/server'

export const dynamic = 'force-dynamic'

// Le promoteur gere les adresses de ses commerciaux, si BuyMonth a ouvert la
// fonction sur son compte (lot Matexi du 03/11/2026).
export default async function ClientCommerciauxPage() {
  const client = await getCurrentClient()
  const { t } = await getT()
  if (!client.routageActif) redirect('/dashboard/client')

  const [regles, biens] = await Promise.all([
    prisma.routageLead.findMany({
      where: { clientId: client.id },
      orderBy: [{ projet: 'asc' }, { createdAt: 'asc' }],
    }),
    prisma.bien.findMany({ where: { clientId: client.id }, select: { projet: true } }),
  ])

  const projets = [...new Set(biens.map((b) => b.projet).filter((p) => p && p !== 'Hors projet'))].sort()

  return (
    <>
      <PageHeader
        title={t('Mes commerciaux', 'Mijn verkopers')}
        subtitle={t('Qui reçoit les demandes des acheteurs sur vos biens.', 'Wie de aanvragen van kopers voor uw panden ontvangt.')}
      />

      <RoutageLeadsForm
        endpoint="/api/client/routage"
        regles={regles.map((r) => ({ projet: r.projet, emails: r.emails, actif: r.actif }))}
        projets={projets}
      />
    </>
  )
}
