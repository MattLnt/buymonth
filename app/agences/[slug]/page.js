import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { BienPublicCard } from '@/app/components/public/BienPublicCard'
import PublicNav from '@/app/components/PublicNav'
import PublicFooter from '@/app/components/PublicFooter'
import { estPromoteurActif } from '@/lib/facturation'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const client = await prisma.client.findUnique({ where: { slug }, select: { societe: true, subStatus: true } })
  if (!client || !estPromoteurActif(client)) return { title: 'Agence introuvable — BuyMonth' }
  return {
    title: `${client.societe} — Biens en mensualités | BuyMonth`,
    description: `Découvrez les biens proposés par ${client.societe}, affichés en budget mensuel clair.`,
    alternates: { canonical: `/agences/${slug}` },
  }
}

export default async function AgencePage({ params }) {
  const { slug } = await params

  const client = await prisma.client.findUnique({
    where: { slug },
    select: {
      id: true,
      societe: true,
      logoUrl: true,
      telephone: true,
      adresse: true,
      subStatus: true,
      biens: {
        where: { statut: { in: ['ACTIF', 'OPTION'] } },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, titre: true, mensualite: true, prixTotal: true, type: true,
          ville: true, province: true, chambres: true, sallesDeBain: true,
          surface: true, terrasse: true, jardin: true, statut: true, images: true, description: true,
        },
      },
    },
  })

  // 404 si l'agence n'existe pas ou si le promoteur n'est pas abonné
  if (!client || !estPromoteurActif(client)) notFound()

  const WRAP = { maxWidth: 1240, margin: '0 auto', padding: '0 24px' }
  const nbBiens = client.biens.length

  return (
    <div style={{ minHeight: '100vh', background: '#EEF1F6' }}>
      <PublicNav />

      {/* HERO AGENCE */}
      <div style={{ position: 'relative', padding: '112px 0 40px', overflow: 'hidden', background: 'linear-gradient(150deg, #16324F 0%, #1D4267 100%)' }}>
        <div style={{ position: 'absolute', top: '-25%', right: '-5%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,184,168,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ ...WRAP, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            {/* Logo ou initiale */}
            <div style={{ width: 76, height: 76, borderRadius: 18, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
              {client.logoUrl ? (
                <img src={client.logoUrl} alt={client.societe} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} />
              ) : (
                <span style={{ fontSize: 32, fontWeight: 800, color: '#16324F' }}>{client.societe[0]?.toUpperCase()}</span>
              )}
            </div>

            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,184,168,0.14)', border: '1px solid rgba(124,184,168,0.25)', borderRadius: 20, padding: '5px 12px', marginBottom: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7CB8A8' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#7CB8A8', letterSpacing: '0.06em' }}>PARTENAIRE BUYMONTH</span>
              </div>
              <h1 style={{ fontSize: 34, fontWeight: 700, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{client.societe}</h1>
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                <span>{nbBiens} bien{nbBiens > 1 ? 's' : ''} disponible{nbBiens > 1 ? 's' : ''}</span>
                {client.adresse && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    {client.adresse}
                  </span>
                )}
                {client.telephone && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0122 16.92z" /></svg>
                    {client.telephone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BIENS DE L'AGENCE */}
      <div style={{ ...WRAP, padding: '32px 24px 64px' }}>
        {nbBiens === 0 ? (
          <div style={{ background: '#fff', border: '1px dashed #D8DFE9', borderRadius: 16, padding: '64px 24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#193B5E', margin: '0 0 6px' }}>Aucun bien disponible pour le moment</h2>
            <p style={{ fontSize: 14, color: '#5A6275', margin: 0 }}>Cette agence n'a pas de bien en ligne actuellement.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 22 }}>
            {client.biens.map((bien) => (
              <BienPublicCard key={bien.id} bien={bien} />
            ))}
          </div>
        )}
      </div>

      <PublicFooter />
    </div>
  )
}