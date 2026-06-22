import { prisma } from '@/lib/prisma'
import { PageHeader, Card } from '@/app/components/dashboard/Ui'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminBiensPage() {
  const biens = await prisma.bien.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      client: { select: { societe: true } },
      _count: { select: { leads: true } },
    },
  })

  return (
    <>
      <PageHeader title="Tous les biens" subtitle={`${biens.length} bien${biens.length > 1 ? 's' : ''} sur la plateforme.`} />

      {biens.length === 0 ? (
        <Card>
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#8A92A6', fontSize: 14 }}>Aucun bien publié.</div>
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
              <thead>
                <tr style={{ background: '#FAFBFE', borderBottom: '1px solid #EEF2F7' }}>
                  {['Bien', 'Promoteur', 'Mensualité', 'Prix', 'Leads', 'Statut', ''].map((h, i) => (
                    <th key={i} style={{ textAlign: 'left', padding: '13px 18px', fontSize: 11.5, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {biens.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #F4F7FB' }}>
                    <td style={{ padding: '12px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 48, height: 40, borderRadius: 8, background: b.images?.[0] ? `url(${b.images[0]}) center/cover` : '#EEF3FA', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#193B5E' }}>{b.titre}</div>
                          <div style={{ fontSize: 12, color: '#A9B0BE' }}>{[b.ville, b.type].filter(Boolean).join(' · ') || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 18px', fontSize: 13, color: '#5A6275' }}>{b.client?.societe || '—'}</td>
                    <td style={{ padding: '12px 18px', fontSize: 14, fontWeight: 700, color: '#7CB8A8' }}>{b.mensualite?.toLocaleString('fr-BE')} €</td>
                    <td style={{ padding: '12px 18px', fontSize: 13, color: '#5A6275' }}>{b.prixTotal?.toLocaleString('fr-BE')} €</td>
                    <td style={{ padding: '12px 18px', fontSize: 14, fontWeight: 600, color: '#193B5E' }}>{b._count.leads}</td>
                    <td style={{ padding: '12px 18px' }}>
                      <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, color: b.published ? '#249E7C' : '#A9B0BE', background: b.published ? 'rgba(36,158,124,0.12)' : '#F2F5FA' }}>
                        {b.published ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <Link href={`/biens/${b.id}`} target="_blank" style={{ fontSize: 12.5, color: '#7CB8A8', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>Voir →</Link>
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