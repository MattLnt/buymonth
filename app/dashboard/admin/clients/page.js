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
      <style>{`
        .admin-clients-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 26px;
        }
        .admin-clients-add {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 11px;
          background: #193B5E;
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 6px 18px rgba(25, 59, 94, 0.18);
          transition: transform .15s ease, box-shadow .15s ease;
        }
        .admin-clients-add:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 26px rgba(25, 59, 94, 0.26);
        }
        @media (max-width: 640px) {
          .admin-clients-head {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
            margin-bottom: 22px;
          }
          .admin-clients-add {
            width: 100%;
            padding: 14px 20px;
          }
        }
      `}</style>

      <div className="admin-clients-head">
        <PageHeader title="Clients" subtitle={`${clients.length} promoteur${clients.length > 1 ? 's' : ''} inscrit${clients.length > 1 ? 's' : ''}.`} />
        <Link href="/dashboard/admin/clients/nouveau" className="admin-clients-add">
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