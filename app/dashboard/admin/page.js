import { prisma } from '@/lib/prisma'
import { Icon } from '@/app/components/dashboard/Icon'
import { InscriptionsArea, StatutDonut, LeadsBarChart } from '@/app/components/dashboard/AdminCharts'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const MOIS_COURTS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
const ABO_MENSUEL = 500 // € / mois par abonné actif

export default async function AdminDashboard() {
  const [clients, biens, leads, widgetPayments, derniersLeads] = await Promise.all([
    prisma.client.findMany({
      select: { id: true, societe: true, subStatus: true, trialEndsAt: true, createdAt: true, _count: { select: { biens: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.bien.count(),
    prisma.lead.findMany({ select: { id: true, nom: true, email: true, telephone: true, createdAt: true, bien: { select: { titre: true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.widgetPayment.findMany({ select: { montant: true, createdAt: true } }),
    prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 6, include: { bien: { select: { titre: true } } } }),
  ])

  const now = new Date()

  // KPIs
  const nbClients = clients.length
  const nbBiens = biens
  const nbLeads = leads.length

  // Statut des clients
  let nbAbonnes = 0, nbEssai = 0, nbSans = 0
  clients.forEach((c) => {
    if (c.subStatus === 'active') nbAbonnes++
    else if (c.subStatus === 'trialing' || (c.trialEndsAt && new Date(c.trialEndsAt) > now)) nbEssai++
    else nbSans++
  })

  // Revenus estimés : abonnés actifs × 500 + total des paiements widgets
  const revenusWidgets = widgetPayments.reduce((s, w) => s + (w.montant || 0), 0)
  const revenusMensuels = nbAbonnes * ABO_MENSUEL
  const revenusTotal = revenusMensuels + revenusWidgets

  // Inscriptions clients par mois (6 derniers mois)
  const inscriptionsParMois = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const count = clients.filter((c) => {
      const cd = new Date(c.createdAt)
      return cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth()
    }).length
    inscriptionsParMois.push({ mois: MOIS_COURTS[d.getMonth()], clients: count })
  }

  // Leads par mois
  const leadsParMois = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const count = leads.filter((l) => {
      const ld = new Date(l.createdAt)
      return ld.getFullYear() === d.getFullYear() && ld.getMonth() === d.getMonth()
    }).length
    leadsParMois.push({ mois: MOIS_COURTS[d.getMonth()], leads: count })
  }

  // Donut statuts
  const statutData = [
    { name: 'Abonnés', value: nbAbonnes },
    { name: 'En essai', value: nbEssai },
    { name: 'Sans abonnement', value: nbSans },
  ].filter((d) => d.value > 0)

  // Top clients par nombre de biens
  const topClients = [...clients]
    .sort((a, b) => (b._count?.biens || 0) - (a._count?.biens || 0))
    .slice(0, 5)

  // KPI cards
  const kpis = [
    { label: 'Promoteurs', value: nbClients, sub: `${nbAbonnes} abonné${nbAbonnes > 1 ? 's' : ''}`, icon: 'users', grad: 'linear-gradient(135deg, #16324F 0%, #2E6388 100%)' },
    { label: 'Biens publiés', value: nbBiens, sub: 'Sur la plateforme', icon: 'building', grad: 'linear-gradient(135deg, #1D7A5E 0%, #7CB8A8 100%)' },
    { label: 'Leads générés', value: nbLeads, sub: 'Toutes agences', icon: 'inbox', grad: 'linear-gradient(135deg, #2E6388 0%, #4A7DA8 100%)' },
    { label: 'Revenus estimés', value: `${revenusTotal.toLocaleString('fr-BE')} €`, sub: `${revenusMensuels.toLocaleString('fr-BE')} €/mois récurrent`, icon: 'euro', grad: 'linear-gradient(135deg, #193B5E 0%, #1D4267 100%)' },
  ]

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 14.5, color: '#5A6275', margin: 0 }}>Activité globale de la plateforme <strong style={{ color: '#193B5E' }}>BuyMonth</strong>.</p>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: k.grad, borderRadius: 16, padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
            <div style={{ position: 'absolute', bottom: -40, right: 10, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
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

      {/* Ligne 1 : inscriptions + donut statuts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, marginBottom: 16 }} className="adm-grid">
        <style>{`@media (max-width: 900px){ .adm-grid { grid-template-columns: 1fr !important; } }`}</style>
        <InscriptionsArea data={inscriptionsParMois} />
        <StatutDonut data={statutData} />
      </div>

      {/* Ligne 2 : leads/mois + top clients */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, marginBottom: 16 }} className="adm-grid2">
        <style>{`@media (max-width: 900px){ .adm-grid2 { grid-template-columns: 1fr !important; } }`}</style>
        <LeadsBarChart data={leadsParMois} />

        {/* Top clients */}
        <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#193B5E', margin: '0 0 2px' }}>Top promoteurs</h3>
              <p style={{ fontSize: 12.5, color: '#9AA2B4', margin: 0 }}>Par nombre de biens</p>
            </div>
            <Link href="/dashboard/admin/clients" style={{ fontSize: 12.5, color: '#7CB8A8', fontWeight: 600, textDecoration: 'none' }}>Tout voir →</Link>
          </div>

          {topClients.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: '#9AA2B4', fontSize: 13 }}>Aucun promoteur inscrit.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {topClients.map((c, i) => (
                <Link key={c.id} href={`/dashboard/admin/clients/${c.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid #F4F6FA', textDecoration: 'none' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#A9B0BE', width: 16, flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #16324F, #2E6388)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                    {(c.societe || '?')[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: '#193B5E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.societe || 'Sans nom'}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#7CB8A8', flexShrink: 0 }}>{c._count?.biens || 0} bien{(c._count?.biens || 0) > 1 ? 's' : ''}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Derniers leads globaux */}
      <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #F2F5FA' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#193B5E', margin: 0 }}>Derniers leads de la plateforme</h2>
          <Link href="/dashboard/admin/leads" style={{ fontSize: 12.5, color: '#7CB8A8', textDecoration: 'none', fontWeight: 600 }}>Voir tout →</Link>
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
      </div>
    </>
  )
}