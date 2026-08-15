import { getCurrentClient } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { PageHeader, Card } from '@/app/components/dashboard/Ui'
import { MesLeadsClient } from '@/app/components/dashboard/MesLeadsClient'

export const dynamic = 'force-dynamic'

export default async function ClientLeadsPage() {
  const client = await getCurrentClient()

  // Conformité : on ne requête JAMAIS revenu/apport côté promoteur (réservés à l'admin)
  const leads = await prisma.lead.findMany({
    where: { bien: { clientId: client.id }, deletedAt: null },
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
      <PageHeader title="Mes leads" subtitle="Les demandes reçues sur vos biens via le simulateur." />

      {leads.length === 0 ? (
        <Card>
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#193B5E', margin: '0 0 6px' }}>Aucun lead pour l'instant</p>
            <p style={{ fontSize: 13.5, color: '#8A92A6', margin: 0 }}>Les visiteurs qui simulent leur capacité sur vos biens apparaîtront ici.</p>
          </div>
        </Card>
      ) : (
        <MesLeadsClient leads={leads} />
      )}
    </>
  )
}