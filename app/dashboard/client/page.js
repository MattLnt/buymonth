import { getCurrentClient } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { Icon } from '@/app/components/dashboard/Icon'
import { LeadsLineChart, TypeDonut, VuesBarChart } from '@/app/components/dashboard/ClientCharts'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const MOIS_COURTS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']

export default async function ClientDashboard() {
  const client = await getCurrentClient()

  // Charge tout ce dont on a besoin
  const [biens, leads, nbWidgets] = await Promise.all([
    prisma.bien.findMany({
      where: { clientId: client.id },
      select: { id: true, titre: true, type: true, vues: true, mensualite: true, published: true },
    }),
    prisma.lead.findMany({
      where: { bien: { clientId: client.id } },
      select: { id: true, nom: true, email: true, source: true, createdAt: true, bien: { select: { titre: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.widgetPayment.count({ where: { clientId: client.id } }),
  ])

  // KPIs
  const nbBiens = biens.length
  const nbBiensActifs = biens.filter((b) => b.published).length
  const nbLeads = leads.length
  const totalVues = biens.reduce((s, b) => s + (b.vues || 0), 0)
  const mensualiteMoy = nbBiens > 0 ? Math.round(biens.reduce((s, b) => s + (b.mensualite || 0), 0) / nbBiens) : 0
  const tauxConversion = totalVues > 0 ? ((nbLeads / totalVues) * 100).toFixed(1) : '0'

  // Leads par mois (6 derniers mois)
  const now = new Date()
  const leadsParMois = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const count = leads.filter((l) => {
      const ld = new Date(l.createdAt)
      return ld.getFullYear() === d.getFullYear() && ld.getMonth() === d.getMonth()
    }).length
    leadsParMois.push({ mois: MOIS_COURTS[d.getMonth()], leads: count })
  }

  // Répartition par type
  const typeMap = {}
  biens.forEach((b) => {
    const t = b.type || 'Autre'
    typeMap[t] = (typeMap[t] || 0) + 1
  })
  const repartitionType = Object.entries(typeMap).map(([name, value]) => ({ name, value }))

  // Top 5 biens par vues
  const topVues = [...biens]
    .filter((b) => (b.vues || 0) > 0)
    .sort((a, b) => (b.vues || 0) - (a.vues || 0))
    .slice(0, 5)
    .map((b) => ({ nom: b.titre.length > 14 ? b.titre.slice(0, 14) + '…' : b.titre, vues: b.vues || 0 }))

  // Derniers leads
  const derniersLeads = leads.slice(0, 6)

  const WRAP_TITLE = { fontSize: 26, fontWeight: 700, color: '#193B5E', margin: 0, letterSpacing: '-0.02em' }

  // Cartes KPI à dégradés
  const kpis = [
    { label: 'Biens actifs', value: nbBiensActifs, sub: `${nbBiens} au total`, icon: 'building', grad: 'linear-gradient(135deg, #16324F 0%, #2E6388 100%)' },
    { label: 'Leads reçus', value: nbLeads, sub: `${tauxConversion}% de conversion`, icon: 'users', grad: 'linear-gradient(135deg, #1D7A5E 0%, #7CB8A8 100%)' },
    { label: 'Vues totales', value: totalVues.toLocaleString('fr-BE'), sub: 'Sur tous vos biens', icon: 'eye', grad: 'linear-gradient(135deg, #2E6388 0%, #4A7DA8 100%)' },
    { label: 'Widgets générés', value: nbWidgets, sub: 'Badges mensualité', icon: 'code', grad: 'linear-gradient(135deg, #193B5E 0%, #1D4267 100%)' },
  ]

  return (
    <>
      {/* Accueil discret */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 14.5, color: '#5A6275', margin: 0 }}>
          Bonjour <strong style={{ color: '#193B5E' }}>{client.contactNom || client.societe || ''}</strong>, voici l'activité de votre portefeuille en temps réel.
        </p>
      </div>

      {/* KPI cards à dégradés */}
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
              <div style={{ fontSize: 32, fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 8 }}>{k.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{k.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Ligne graphiques 1 : courbe leads + donut type */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, marginBottom: 16 }} className="dash-grid-2">
        <style>{`@media (max-width: 900px){ .dash-grid-2 { grid-template-columns: 1fr !important; } }`}</style>
        <LeadsLineChart data={leadsParMois} />
        <TypeDonut data={repartitionType} />
      </div>

      {/* Ligne graphiques 2 : barres vues + derniers leads */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16, marginBottom: 16 }} className="dash-grid-2b">
        <style>{`@media (max-width: 900px){ .dash-grid-2b { grid-template-columns: 1fr !important; } }`}</style>
        <VuesBarChart data={topVues} />

        {/* Derniers leads */}
        <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#193B5E', margin: '0 0 2px' }}>Derniers leads</h3>
              <p style={{ fontSize: 12.5, color: '#9AA2B4', margin: 0 }}>Vos prospects les plus récents</p>
            </div>
            <Link href="/dashboard/client/leads" style={{ fontSize: 12.5, color: '#7CB8A8', fontWeight: 600, textDecoration: 'none' }}>Tout voir →</Link>
          </div>

          {derniersLeads.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: '#9AA2B4', fontSize: 13 }}>Aucun lead reçu pour l'instant.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {derniersLeads.map((l) => (
                <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid #F4F6FA' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #16324F, #2E6388)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                    {(l.nom || l.email || '?')[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: '#193B5E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.nom || l.email || 'Prospect'}</div>
                    <div style={{ fontSize: 12, color: '#9AA2B4', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.bien?.titre || 'Bien supprimé'}</div>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#A9B0BE', flexShrink: 0 }}>
                    {new Date(l.createdAt).toLocaleDateString('fr-BE', { day: '2-digit', month: 'short' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ligne mini-stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(124,184,168,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="euro" size={22} color="#7CB8A8" />
          </span>
          <div>
            <div style={{ fontSize: 13, color: '#8A92A6', marginBottom: 4 }}>Mensualité moyenne</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#193B5E', lineHeight: 1 }}>{mensualiteMoy.toLocaleString('fr-BE')} €<span style={{ fontSize: 13, color: '#9AA2B4', fontWeight: 500 }}>/mois</span></div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(124,184,168,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="trending" size={22} color="#7CB8A8" />
          </span>
          <div>
            <div style={{ fontSize: 13, color: '#8A92A6', marginBottom: 4 }}>Taux de conversion</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#193B5E', lineHeight: 1 }}>{tauxConversion} %<span style={{ fontSize: 13, color: '#9AA2B4', fontWeight: 500 }}> vues → leads</span></div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(124,184,168,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="eye" size={22} color="#7CB8A8" />
          </span>
          <div>
            <div style={{ fontSize: 13, color: '#8A92A6', marginBottom: 4 }}>Vues moyennes / bien</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#193B5E', lineHeight: 1 }}>{nbBiens > 0 ? Math.round(totalVues / nbBiens) : 0}</div>
          </div>
        </div>
      </div>
    </>
  )
}