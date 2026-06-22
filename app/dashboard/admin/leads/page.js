import { prisma } from '@/lib/prisma'
import { PageHeader, Card } from '@/app/components/dashboard/Ui'

export const dynamic = 'force-dynamic'

const sourceLabel = {
  SIMULATEUR: { label: 'Simulateur', color: '#7CB8A8', bg: 'rgba(124,184,168,0.14)' },
  WIDGET: { label: 'Widget', color: '#5B8DEF', bg: 'rgba(91,141,239,0.12)' },
  CONTACT: { label: 'Contact', color: '#E89923', bg: 'rgba(232,153,35,0.12)' },
}

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: { bien: { select: { titre: true, ville: true } } },
  })

  return (
    <>
      <PageHeader title="Tous les leads" subtitle={`${leads.length} demande${leads.length > 1 ? 's' : ''} reçue${leads.length > 1 ? 's' : ''} via la plateforme.`} />

      {leads.length === 0 ? (
        <Card>
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#8A92A6', fontSize: 14 }}>Aucun lead pour l'instant.</div>
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
              <thead>
                <tr style={{ background: '#FAFBFE', borderBottom: '1px solid #EEF2F7' }}>
                  {['Contact', 'Bien', 'Revenus', 'Apport', 'Source', 'Date'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '13px 18px', fontSize: 11.5, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const src = sourceLabel[lead.source] || { label: lead.source, color: '#8A92A6', bg: '#F2F5FA' }
                  return (
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
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, color: src.color, background: src.bg }}>{src.label}</span>
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 12.5, color: '#A9B0BE', whiteSpace: 'nowrap' }}>
                        {new Date(lead.createdAt).toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
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