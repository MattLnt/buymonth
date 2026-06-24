import { prisma } from '@/lib/prisma'
import { BiensExplorer } from '@/app/components/public/BiensExplorer'
import PublicNav from '@/app/components/PublicNav'
import PublicFooter from '@/app/components/PublicFooter'

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
  const HERO_IMG = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=80'

  return (
    <div style={{ minHeight: '100vh', background: '#EEF1F6' }}>
      <PublicNav />

      <div>
        {/* HERO */}
        <div style={{ position: 'relative', padding: '128px 0 48px', overflow: 'hidden' }}>
          {/* Image de fond */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${HERO_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center', pointerEvents: 'none' }} />
          {/* Overlay dégradé premium navy */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(150deg, rgba(15,33,52,0.94) 0%, rgba(22,50,79,0.88) 45%, rgba(29,66,103,0.82) 100%)', pointerEvents: 'none' }} />
          {/* Halo teal */}
          <div style={{ position: 'absolute', top: '-25%', right: '-5%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,184,168,0.20) 0%, transparent 65%)', pointerEvents: 'none' }} />
          {/* Grille subtile */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '44px 44px', pointerEvents: 'none' }} />

          <div style={{ ...WRAP, position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,184,168,0.12)', border: '1px solid rgba(124,184,168,0.25)', borderRadius: 20, padding: '6px 14px', marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7CB8A8' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#7CB8A8', letterSpacing: '0.07em' }}>RÉSEAU IMMOBILIER BUYMONTH</span>
            </div>
            <h1 style={{ fontSize: 40, fontWeight: 700, color: '#fff', margin: '0 0 12px', letterSpacing: '-0.025em', lineHeight: 1.1, textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>
              Votre futur bien en <span style={{ color: '#7CB8A8' }}>mensualités</span>
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.72)', margin: '0 0 32px', maxWidth: 560, lineHeight: 1.6 }}>
              Des biens immobiliers affichés en budget mensuel clair, plutôt qu'en prix total.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
              {stats.map((s) => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 14, padding: '16px 18px', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{s.label}</div>
                      <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>{s.value}</div>
                    </div>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(124,184,168,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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

        <PublicFooter />
      </div>
    </div>
  )
}