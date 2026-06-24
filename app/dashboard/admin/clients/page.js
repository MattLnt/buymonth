import { prisma } from '@/lib/prisma'
import { PageHeader, Card } from '@/app/components/dashboard/Ui'
import { ClientsTable } from './ClientsTable'

export const dynamic = 'force-dynamic'

export default async function AdminClientsPage() {
  const clientsRaw = await prisma.client.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { email: true } },
      _count: { select: { biens: true } },
    },
  })

  // On aplatit les données pour le composant client
  const clients = clientsRaw.map((c) => ({
    id: c.id,
    societe: c.societe,
    telephone: c.telephone,
    logoUrl: c.logoUrl,
    email: c.user?.email || null,
    plan: c.plan,
    nbBiens: c._count.biens,
    trialEndsAt: c.trialEndsAt,
    createdAt: c.createdAt,
  }))

  return (
    <>
      <PageHeader title="Clients" subtitle={`${clients.length} promoteur${clients.length > 1 ? 's' : ''} inscrit${clients.length > 1 ? 's' : ''}.`} />

      {clients.length === 0 ? (
        <Card>
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#8A92A6', fontSize: 14 }}>Aucun client inscrit.</div>
        </Card>
      ) : (
        <ClientsTable clients={clients} />
      )}
    </>
  )
}