import { prisma } from '@/lib/prisma'
import { Icon } from '@/app/components/dashboard/Icon'
import { RevenusArea } from '@/app/components/dashboard/AdminCharts'

export const dynamic = 'force-dynamic'

const MOIS_COURTS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
const ABO_MENSUEL = 500

export default async function RevenusPage() {
  const [clients, widgetPayments, biens] = await Promise.all([
    prisma.client.findMany({ select: { id: true, societe: true, subStatus: true } }),
    prisma.widgetPayment.findMany({
      orderBy: { createdAt: 'desc' },
      include: { client: { select: { societe: true } } },
    }),
    prisma.bien.findMany({ select: { id: true, titre: true } }),
  ])

  // Map bienId -> titre (pas de relation Prisma sur WidgetPayment)
  const titreParBien = {}
  biens.forEach((b) => { titreParBien[b.id] = b.titre })

  const now = new Date()

  const nbAbonnes = clients.filter((c) => c.subStatus === 'active').length
  const revenusMensuelsRecurrents = nbAbonnes * ABO_MENSUEL

  const widgetsPayants = widgetPayments.filter((w) => (w.montant || 0) > 0)
  const totalWidgets = widgetsPayants.reduce((s, w) => s + (w.montant || 0), 0)
  const nbWidgetsPayes = widgetsPayants.length
  const nbWidgetsGratuits = widgetPayments.length - widgetsPayants.length

  const revenusParMois = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const montant = widgetsPayants
      .filter((w) => {
        const wd = new Date(w.createdAt)
        return wd.getFullYear() === d.getFullYear() && wd.getMonth() === d.getMonth()
      })
      .reduce((s, w) => s + (w.montant || 0), 0)
    revenusParMois.push({ mois: MOIS_COURTS[d.getMonth()], revenus: montant + revenusMensuelsRecurrents })
  }

  const totalGlobal = revenusMensuelsRecurrents + totalWidgets

  const kpis = [
    { label: 'Revenus récurrents', value: `${revenusMensuelsRecurrents.toLocaleString('fr-BE')} €`, sub: `${nbAbonnes} abonnement${nbAbonnes > 1 ? 's' : ''} × 500 €/mois`, icon: 'card', grad: 'linear-gradient(135deg, #16324F 0%, #2E6388 100%)' },
    { label: 'Revenus widgets', value: `${totalWidgets.toLocaleString('fr-BE')} €`, sub: `${nbWidgetsPayes} widget${nbWidgetsPayes > 1 ? 's' : ''} payé${nbWidgetsPayes > 1 ? 's' : ''}`, icon: 'code', grad: 'linear-gradient(135deg, #1D7A5E 0%, #7CB8A8 100%)' },
    { label: 'Total estimé', value: `${totalGlobal.toLocaleString('fr-BE')} €`, sub: 'Récurrent + ponctuel', icon: 'euro', grad: 'linear-gradient(135deg, #193B5E 0%, #1D4267 100%)' },
  ]

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 14.5, color: '#5A6275', margin: 0 }}>Suivi financier de la plateforme. Les abonnements sont estimés à 500 €/mois par compte actif.</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: k.grad, borderRadius: 16, padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{k.label}</span>
                <span style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={k.icon} size={18} color="#fff" />
                </span>
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 8 }}>{k.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{k.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Graphique évolution */}
      <div style={{ marginBottom: 16 }}>
        <RevenusArea data={revenusParMois} />
      </div>

      {/* Tableau des paiements widgets */}
      <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #F2F5FA' }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#193B5E', margin: '0 0 2px' }}>Paiements de widgets</h2>
            <p style={{ fontSize: 12.5, color: '#9AA2B4', margin: 0 }}>
              {nbWidgetsPayes} payé{nbWidgetsPayes > 1 ? 's' : ''}{nbWidgetsGratuits > 0 ? ` · ${nbWidgetsGratuits} offert${nbWidgetsGratuits > 1 ? 's' : ''}` : ''}
            </p>
          </div>
        </div>

        {widgetPayments.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: '#8A92A6', fontSize: 14 }}>Aucun paiement pour l'instant.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead>
                <tr style={{ textAlign: 'left', fontSize: 11, color: '#9AA2B4', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px 24px', fontWeight: 700 }}>Promoteur</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Bien</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Montant</th>
                  <th style={{ padding: '12px 24px', fontWeight: 700 }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {widgetPayments.map((w) => (
                  <tr key={w.id} style={{ borderTop: '1px solid #F4F6FA' }}>
                    <td style={{ padding: '14px 24px', fontSize: 13.5, fontWeight: 600, color: '#193B5E' }}>{w.client?.societe || '—'}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#5A6275' }}>{w.bienId ? (titreParBien[w.bienId] || 'Bien supprimé') : '—'}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13.5, fontWeight: 700 }}>
                      {(w.montant || 0) > 0
                        ? <span style={{ color: '#249E7C' }}>{w.montant} €</span>
                        : <span style={{ color: '#A9B0BE', fontWeight: 600 }}>Offert</span>}
                    </td>
                    <td style={{ padding: '14px 24px', fontSize: 12.5, color: '#A9B0BE' }}>{new Date(w.createdAt).toLocaleDateString('fr-BE', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}