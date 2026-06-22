import { prisma } from '@/lib/prisma'
import { BiensFilters } from '@/app/components/public/BiensFilters'
import { BienPublicCard } from '@/app/components/public/BienPublicCard'

export const dynamic = 'force-dynamic'

export default async function BiensPublicPage({ searchParams }) {
  const sp = await searchParams
  const q = sp.q || ''
  const type = sp.type || ''
  const province = sp.province || ''
  const min = sp.min ? parseInt(sp.min, 10) : null
  const max = sp.max ? parseInt(sp.max, 10) : null
  const chambres = sp.chambres ? parseInt(sp.chambres, 10) : null

  const where = { published: true }
  if (type) where.type = type
  if (province) where.province = province
  if (chambres) where.chambres = { gte: chambres }
  if (min || max) {
    where.mensualite = {}
    if (min) where.mensualite.gte = min
    if (max) where.mensualite.lte = max
  }
  if (q) {
    where.OR = [
      { titre: { contains: q, mode: 'insensitive' } },
      { ville: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }

  const biens = await prisma.bien.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: { id: true, titre: true, mensualite: true, prixTotal: true, type: true, ville: true, province: true, chambres: true, surface: true, images: true },
  })

  const [totalBiens, totalClients, agg] = await Promise.all([
    prisma.bien.count({ where: { published: true } }),
    prisma.client.count(),
    prisma.bien.aggregate({ where: { published: true }, _avg: { mensualite: true } }),
  ])
  const mensualiteMoy = agg._avg.mensualite ? Math.round(agg._avg.mensualite) : 0

  const stats = [
    { label: 'Biens disponibles', value: totalBiens, icon: 'home' },
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
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 28, alignItems: 'start' }} className="biens-layout">
          <style>{`@media (max-width: 900px){ .biens-layout { grid-template-columns: 1fr !important; } }`}</style>

          <BiensFilters initial={{ q, type, province, min: min || '', max: max || '', chambres: chambres || '' }} />

          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, color: '#5A6275', marginBottom: 18, fontWeight: 500 }}>
              {biens.length} bien{biens.length > 1 ? 's' : ''} dans le réseau
            </div>

            {biens.length === 0 ? (
              <div style={{ background: '#fff', border: '1px dashed #D8DFE9', borderRadius: 16, padding: '64px 24px', textAlign: 'center' }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#193B5E', margin: '0 0 6px' }}>Aucun bien trouvé</h3>
                <p style={{ fontSize: 14, color: '#5A6275', margin: 0 }}>Essayez d'élargir vos critères de recherche.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 22 }}>
                {biens.map((bien) => (
                  <BienPublicCard key={bien.id} bien={bien} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}