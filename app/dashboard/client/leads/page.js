import { getCurrentClient } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { PageHeader, Card, StatCard } from '@/app/components/dashboard/Ui'

export const dynamic = 'force-dynamic'

export default async function ClientLeadsPage() {
  const client = await getCurrentClient()

  const leads = await prisma.lead.findMany({
    where: { bien: { clientId: client.id } },
    orderBy: { createdAt: 'desc' },
    include: { bien: { select: { titre: true, ville: true } } },
  })

  // leads ce mois-ci
  const debutMois = new Date()
  debutMois.setDate(1)
  debutMois.setHours(0, 0, 0, 0)
  const ceMois = leads.filter((l) => new Date(l.createdAt) >= debutMois).length

  return (
    <>
      <PageHeader title="Mes leads" subtitle="Les demandes reçues sur vos biens via le simulateur." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total leads" value={leads.length} icon="inbox" />
        <StatCard label="Ce mois-ci" value={ceMois} icon="users" />
      </div>

      {leads.length === 0 ? (
        <Card>
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#193B5E', margin: '0 0 6px' }}>Aucun lead pour l'instant</p>
            <p style={{ fontSize: 13.5, color: '#8A92A6', margin: 0 }}>Les visiteurs qui simulent leur capacité sur vos biens apparaîtront ici.</p>
          </div>
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr style={{ background: '#FAFBFE', borderBottom: '1px solid #EEF2F7' }}>
                  {['Contact', 'Bien', 'Revenus', 'Apport', 'Date'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '13px 18px', fontSize: 11.5, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid #F4F7FB' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#193B5E', marginBottom: 2 }}>{lead.nom || 'Sans nom'}</div>
                      <div style={{ fontSize: 12.5, color: '#7A8499' }}>{lead.email || '—'}</div>
                      {lead.telephone && <div style={{ fontSize: 12.5, color: '#7A8499' }}>{lead.telephone}</div>}
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: 13, color: '#3D4759' }}>
                      {lead.bien ? (
                        <>
                          <div style={{ fontWeight: 600 }}>{lead.bien.titre}</div>
                          {lead.bien.ville && <div style={{ fontSize: 12, color: '#A9B0BE' }}>{lead.bien.ville}</div>}
                        </>
                      ) : <span style={{ color: '#C2C8D4' }}>—</span>}
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: 13.5, color: '#3D4759' }}>{lead.revenu ? `${lead.revenu.toLocaleString('fr-BE')} €` : '—'}</td>
                    <td style={{ padding: '14px 18px', fontSize: 13.5, color: '#3D4759' }}>{lead.apport ? `${lead.apport.toLocaleString('fr-BE')} €` : '—'}</td>
                    <td style={{ padding: '14px 18px', fontSize: 12.5, color: '#A9B0BE', whiteSpace: 'nowrap' }}>
                      {new Date(lead.createdAt).toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  )
}