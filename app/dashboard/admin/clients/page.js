import { prisma } from '@/lib/prisma'
import { PageHeader, Card } from '@/app/components/dashboard/Ui'
import { ClientsTable } from './ClientsTable'
import Link from 'next/link'

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
    formule: c.formule,
    nbBiens: c._count.biens,
    trialEndsAt: c.trialEndsAt,
    createdAt: c.createdAt,
  }))

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <PageHeader title="Clients" subtitle={`${clients.length} promoteur${clients.length > 1 ? 's' : ''} inscrit${clients.length > 1 ? 's' : ''}.`} />
        <Link href="/dashboard/admin/clients/nouveau" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 18px', borderRadius: 10, background: '#193B5E', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', marginTop: 4 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Nouveau promoteur
        </Link>
      </div>

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