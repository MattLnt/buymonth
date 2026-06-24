import { prisma } from '@/lib/prisma'
import { BiensExplorer } from '@/app/components/public/BiensExplorer'

export const dynamic = 'force-dynamic'

export default async function BiensPublicPage() {
  // On charge TOUS les biens publiés (le filtrage se fait côté client, instantané)
  const biens = await prisma.bien.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, titre: true, mensualite: true, prixTotal: true, type: true, ville: true, province: true, chambres: true, surface: true, images: true, description: true },
  })

  const [totalClients, agg] = await Promise.all([
    prisma.client.count(),
    prisma.bien.aggregate({ where: { published: true }, _avg: { mensualite: true } }),
  ])
  const mensualiteMoy = agg._avg.mensualite ? Math.round(agg._avg.mensualite) : 0

  const stats = [
    { label: 'Biens disponibles', value: biens.length, icon: 'home' },
    { label: 'Partenaires', value: totalClients, icon: 'users' },
    { label: 'Mensualité moyenne', value: `${mensualiteMoy.toLocaleString('fr-BE')} €`, icon: 'euro' },
    { label: 'Apport requis', value: '10 %', icon: 'check' },
  ]

  const statIcon = {
    home: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
    users: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></>,
    euro: <><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></>,
    check: <><circle cx="12" cy="12" r="10" /><polyline points="8 12 11 15 16 9" /></>,
  }

  const WRAP = { maxWidth: 1240, margin: '0 auto', padding: '0 24px' }

  return (
    <div style={{ minHeight: '100vh', background: '#EEF1F6' }}>
      {/* HERO */}
      <div style={{ background: 'linear-gradient(150deg, #16324F 0%, #1D4267 55%, #245479 100%)', padding: '52px 0 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-25%', right: '-5%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,184,168,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '44px 44px', pointerEvents: 'none' }} />

        <div style={{ ...WRAP, position: 'relative' }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.025em' }}>
            Votre futur bien en <span style={{ color: '#7CB8A8' }}>mensualités</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', margin: '0 0 32px', maxWidth: 560, lineHeight: 1.6 }}>
            Des biens immobiliers affichés en budget mensuel clair, plutôt qu'en prix total.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            {stats.map((s) => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '16px 18px', backdropFilter: 'blur(8px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{s.label}</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>{s.value}</div>
                  </div>
                  <span style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(124,184,168,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{statIcon[s.icon]}</svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENU */}
      <div style={{ ...WRAP, padding: '32px 24px 64px' }}>
        <BiensExplorer biens={biens} />
      </div>
    </div>
  )
}