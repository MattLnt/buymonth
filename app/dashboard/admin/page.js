import { prisma } from '@/lib/prisma'
import { PageHeader, StatCard, Card } from '@/app/components/dashboard/Ui'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [nbClients, nbBiens, nbLeads, nbWidgets, agg, derniersLeads] = await Promise.all([
    prisma.client.count(),
    prisma.bien.count(),
    prisma.lead.count(),
    prisma.widget.count(),
    prisma.bien.aggregate({ _avg: { mensualite: true } }),
    prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { bien: { select: { titre: true } } },
    }),
  ])

  const mensualiteMoy = agg._avg.mensualite ? Math.round(agg._avg.mensualite) : 0

  return (
    <>
      <PageHeader title="Vue d'ensemble" subtitle="Activité globale de la plateforme BuyMonth." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Promoteurs" value={nbClients} icon="users" />
        <StatCard label="Biens" value={nbBiens} icon="building" />
        <StatCard label="Leads" value={nbLeads} icon="inbox" />
        <StatCard label="Mensualité moyenne" value={`${mensualiteMoy.toLocaleString('fr-BE')} €`} icon="card" />
      </div>

      <Card style={{ padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #F2F5FA' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#193B5E', margin: 0 }}>Derniers leads</h2>
          <Link href="/dashboard/admin/leads" style={{ fontSize: 13, color: '#7CB8A8', textDecoration: 'none', fontWeight: 600 }}>Voir tout →</Link>
        </div>

        {derniersLeads.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: '#8A92A6', fontSize: 14 }}>Aucun lead pour l'instant.</div>
        ) : (
          <div>
            {derniersLeads.map((lead) => (
              <div key={lead.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px', borderBottom: '1px solid #F7F9FC' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(124,184,168,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7CB8A8', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                  {(lead.nom || lead.email || '?')[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#193B5E' }}>{lead.nom || 'Sans nom'}</div>
                  <div style={{ fontSize: 12.5, color: '#8A92A6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lead.email || lead.telephone || '—'}{lead.bien ? ` · ${lead.bien.titre}` : ''}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#A9B0BE', flexShrink: 0 }}>
                  {new Date(lead.createdAt).toLocaleDateString('fr-BE', { day: '2-digit', month: 'short' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  )
}