import { prisma } from '@/lib/prisma'
import { calculMensualite } from '@/lib/calcul'
import { Simulateur } from '@/app/components/public/Simulateur'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function SimulateurPage({ searchParams }) {
  const sp = await searchParams
  const bienId = sp.bien || null

  let bien = null
  if (bienId) {
    bien = await prisma.bien.findUnique({
      where: { id: bienId },
      select: { id: true, titre: true, prixTotal: true, mensualite: true, ville: true, province: true, images: true },
    })
  }

  const WRAP = { maxWidth: 1040, margin: '0 auto', padding: '0 24px' }
  const card = { background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 28 }

  return (
    <div style={{ minHeight: '100vh', background: '#EEF1F6' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(150deg, #16324F 0%, #1D4267 100%)', padding: '48px 0 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-25%', right: '-5%', width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,184,168,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ ...WRAP, position: 'relative' }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Simulez votre <span style={{ color: '#7CB8A8' }}>capacité d'emprunt</span>
          </h1>
          <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,0.65)', margin: 0, maxWidth: 520, lineHeight: 1.6 }}>
            En quelques secondes, découvrez si ce bien correspond à votre budget — gratuitement et sans engagement.
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ ...WRAP, padding: '32px 24px 64px' }}>
        <div className="sim-grid" style={{ display: 'grid', gridTemplateColumns: bien ? '1fr 340px' : '1fr', gap: 28, alignItems: 'start' }}>
          <style>{`@media (max-width: 880px){ .sim-grid { grid-template-columns: 1fr !important; } }`}</style>

          {/* Formulaire */}
          <div style={card}>
            <Simulateur bien={bien} />
          </div>

          {/* Récap du bien */}
          {bien && (
            <div style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Link href={`/biens/${bien.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ height: 150, background: bien.images?.[0] ? `url(${bien.images[0]}) center/cover` : 'linear-gradient(135deg, #EEF3FA, #E3ECF5)' }} />
                  <div style={{ padding: 18 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#193B5E', margin: '0 0 4px' }}>{bien.titre}</h3>
                    <div style={{ fontSize: 13, color: '#8A92A6', marginBottom: 12 }}>{[bien.ville, bien.province].filter(Boolean).join(', ') || 'Belgique'}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#7CB8A8' }}>
                      {(bien.mensualite || calculMensualite(bien.prixTotal)).toLocaleString('fr-BE')} €<span style={{ fontSize: 13 }}>/mois</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#A9B0BE', marginTop: 2 }}>{bien.prixTotal.toLocaleString('fr-BE')} €</div>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}