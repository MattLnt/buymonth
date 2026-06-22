import { prisma } from '@/lib/prisma'
import { PageHeader, Card } from '@/app/components/dashboard/Ui'

export const dynamic = 'force-dynamic'

const planLabel = {
  CLASSIC: { label: 'Classic', color: '#5A6275', bg: '#F2F5FA' },
  PREMIUM: { label: 'Premium', color: '#7CB8A8', bg: 'rgba(124,184,168,0.14)' },
}

export default async function AdminClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { email: true } },
      _count: { select: { biens: true } },
    },
  })

  return (
    <>
      <PageHeader title="Clients" subtitle={`${clients.length} promoteur${clients.length > 1 ? 's' : ''} inscrit${clients.length > 1 ? 's' : ''}.`} />

      {clients.length === 0 ? (
        <Card>
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#8A92A6', fontSize: 14 }}>Aucun client inscrit.</div>
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
              <thead>
                <tr style={{ background: '#FAFBFE', borderBottom: '1px solid #EEF2F7' }}>
                  {['Société', 'Contact', 'Biens', 'Plan', 'Inscrit le'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '13px 18px', fontSize: 11.5, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => {
                  const plan = planLabel[c.plan] || planLabel.CLASSIC
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid #F4F7FB' }}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#16324F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7CB8A8', fontWeight: 700, fontSize: 15, flexShrink: 0, overflow: 'hidden' }}>
                            {c.logoUrl ? <img src={c.logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (c.societe?.[0]?.toUpperCase() || '?')}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#193B5E' }}>{c.societe || 'Sans nom'}</div>
                            {c.telephone && <div style={{ fontSize: 12, color: '#A9B0BE' }}>{c.telephone}</div>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: '#5A6275' }}>{c.user?.email || '—'}</td>
                      <td style={{ padding: '14px 18px', fontSize: 14, fontWeight: 600, color: '#193B5E' }}>{c._count.biens}</td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, color: plan.color, background: plan.bg }}>{plan.label}</span>
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 12.5, color: '#A9B0BE', whiteSpace: 'nowrap' }}>
                        {new Date(c.createdAt).toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  )
}