import { getCurrentClient } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { PageHeader, Card } from '@/app/components/dashboard/Ui'
import { MesLeadsClient } from '@/app/components/dashboard/MesLeadsClient'
import { getT } from '@/lib/i18n/server'

export const dynamic = 'force-dynamic'

export default async function ClientLeadsPage() {
  const client = await getCurrentClient()
  const { t } = await getT()

  // Conformité : on ne requête JAMAIS revenu/apport côté promoteur (réservés à l'admin).
  // Et un lead n'est visible par le promoteur que si le visiteur a coché la case
  // autorisant la transmission de ses coordonnées (annexe 1 du dossier du 05/10/2026).
  const leads = await prisma.lead.findMany({
    where: { bien: { clientId: client.id }, deletedAt: null, consentPromoteur: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      nom: true,
      email: true,
      telephone: true,
      statutPromoteur: true,
      createdAt: true,
      bien: { select: { id: true, titre: true, ville: true, projet: true, unite: true } },
    },
  })

  return (
    <>
      <PageHeader title={t('Mes leads', 'Mijn leads')} subtitle={t('Les demandes reçues sur vos biens via le simulateur.', 'De aanvragen voor uw panden via de simulator.')} />

      {leads.length === 0 ? (
        <Card>
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#193B5E', margin: '0 0 6px' }}>{t("Aucun lead pour l'instant", 'Nog geen leads')}</p>
            <p style={{ fontSize: 13.5, color: '#8A92A6', margin: 0 }}>{t('Les visiteurs qui simulent leur capacité sur vos biens apparaîtront ici.', 'Bezoekers die hun leencapaciteit berekenen voor uw panden, verschijnen hier.')}</p>
          </div>
        </Card>
      ) : (
        <MesLeadsClient leads={leads} />
      )}
    </>
  )
}