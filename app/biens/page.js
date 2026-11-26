import { prisma } from '@/lib/prisma'
import { BiensExplorer } from '@/app/components/public/BiensExplorer'
import PublicNav from '@/app/components/PublicNav'
import PublicFooter from '@/app/components/PublicFooter'
import { filtreClientDiffusable } from '@/lib/facturation'
import { getConfigMensualite } from '@/lib/settings'
import { getT } from '@/lib/i18n/server'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const { t } = await getT()
  return {
    title: t('Les biens en mensualités — BuyMonth', 'Panden in maandbedragen — BuyMonth'),
    description: t(
      "Découvrez une sélection de biens immobiliers proposés par nos partenaires, affichés en budget mensuel clair plutôt qu'en prix total.",
      'Ontdek een selectie vastgoed van onze partners, weergegeven als een duidelijk maandbudget in plaats van een totaalprijs.'
    ),
    alternates: { canonical: '/biens' },
  }
}

export default async function BiensPublicPage() {
  // On charge les biens publiés DONT le promoteur a un abonnement actif.
  // Sans abonnement (subStatus hors active/trialing), les biens ne sont pas diffusés.
  const tous = await prisma.bien.findMany({
    where: {
      published: true,
      // Abonnement actif, ou impaye encore dans le delai de grace
      OR: filtreClientDiffusable(),
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, titre: true, mensualite: true, prixTotal: true, type: true,
      ville: true, province: true, chambres: true, sallesDeBain: true,
      surface: true, terrasse: true, jardin: true, statut: true, images: true, description: true,
      demo: true, regime: true,
    },
  })
  const cfg = await getConfigMensualite()
  const { t } = await getT()

  // Biens de démonstration (fictifs) : affichés tant qu'aucun vrai bien n'est en ligne.
  // Dès qu'un vrai bien est publié, les démos sortent de la vitrine (leur URL reste accessible).
  const aDesVraisBiens = tous.some((b) => !b.demo)
  const biens = aDesVraisBiens ? tous.filter((b) => !b.demo) : tous

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
              {t('Votre futur bien en ', 'Uw toekomstige woning in ')}<span style={{ color: '#7CB8A8' }}>{t('mensualités', 'maandbedragen')}</span>
            </h1>
            <p style={{ fontSize: 16.5, color: 'rgba(255,255,255,0.75)', margin: 0, maxWidth: 620, lineHeight: 1.6 }}>
              {t(
                "Découvrez une sélection de biens immobiliers proposés par nos partenaires, affichés en budget mensuel clair plutôt qu'en prix total.",
                'Ontdek een selectie vastgoed van onze partners, weergegeven als een duidelijk maandbudget in plaats van een totaalprijs.'
              )}
            </p>
          </div>
        </div>

        {/* CONTENU */}
        <div style={{ ...WRAP, padding: '32px 24px 64px' }}>
          <BiensExplorer biens={biens} cfg={cfg} />
        </div>

        <PublicFooter />
      </div>
    </div>
  )
}