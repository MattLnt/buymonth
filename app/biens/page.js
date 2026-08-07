import { prisma } from '@/lib/prisma'
import { BiensExplorer } from '@/app/components/public/BiensExplorer'
import PublicNav from '@/app/components/PublicNav'
import PublicFooter from '@/app/components/PublicFooter'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Les biens en mensualités — BuyMonth',
  description: "Découvrez une sélection de biens immobiliers proposés par nos partenaires, affichés en budget mensuel clair plutôt qu'en prix total.",
  alternates: { canonical: '/biens' },
}

export default async function BiensPublicPage() {
  // On charge TOUS les biens publiés (le filtrage se fait côté client, instantané)
  const biens = await prisma.bien.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, titre: true, mensualite: true, prixTotal: true, type: true,
      ville: true, province: true, chambres: true, sallesDeBain: true,
      surface: true, terrasse: true, jardin: true, statut: true, images: true, description: true,
    },
  })

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
            <h1 style={{ fontSize: 40, fontWeight: 700, color: '#fff', margin: '0 0 14px', letterSpacing: '-0.025em', lineHeight: 1.1, textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>
              Votre futur bien en <span style={{ color: '#7CB8A8' }}>mensualités</span>
            </h1>
            <p style={{ fontSize: 16.5, color: 'rgba(255,255,255,0.75)', margin: 0, maxWidth: 620, lineHeight: 1.6 }}>
              Découvrez une sélection de biens immobiliers proposés par nos partenaires, affichés en budget mensuel clair plutôt qu'en prix total.
            </p>
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