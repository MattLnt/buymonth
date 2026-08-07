import Link from 'next/link'
import { calculMensualite } from '@/lib/calcul'
import { BienGallery } from '@/app/components/public/BienGallery'
import { SimulateurModal } from '@/app/components/public/SimulateurModal'
import Mensualite from '@/app/components/Mensualite'
import PublicNav from '@/app/components/PublicNav'
import PublicFooter from '@/app/components/PublicFooter'

const specIcon = {
  type: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
  bed: <><path d="M2 4v16M2 8h18a2 2 0 012 2v10M2 17h20M6 8V6a2 2 0 012-2h8" /></>,
  ruler: <><path d="M21.3 8.7L8.7 21.3a1 1 0 01-1.4 0l-4.6-4.6a1 1 0 010-1.4L15.3 2.7a1 1 0 011.4 0l4.6 4.6a1 1 0 010 1.4z" /></>,
  pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></>,
}

const STATUT_LABEL = { HORS_LIGNE: 'Hors-ligne', VENDU: 'Vendu', OPTION: 'Sous option', ACTIF: 'Actif' }

/*
 * Rendu complet d'une fiche bien. Réutilisé par :
 *   - la page publique /biens/[id] (apercu = false)
 *   - la page preview /dashboard/client/biens/[id]/apercu (apercu = true)
 */
export function BienFiche({ bien, apercu = false }) {
  const mensualite = bien.mensualite || calculMensualite(bien.prixTotal)

  const specs = [
    bien.type && { icon: 'type', label: 'Type', value: bien.type },
    bien.chambres != null && { icon: 'bed', label: 'Chambres', value: bien.chambres },
    bien.surface != null && { icon: 'ruler', label: 'Surface', value: `${bien.surface} m²` },
    (bien.ville || bien.province) && { icon: 'pin', label: 'Localisation', value: [bien.ville, bien.province].filter(Boolean).join(', ') },
  ].filter(Boolean)

  const simBien = { id: bien.id, titre: bien.titre, prixTotal: bien.prixTotal, mensualite }

  const WRAP = { maxWidth: 1240, margin: '0 auto', padding: '0 24px' }
  const card = { background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 28 }

  return (
    <div style={{ minHeight: '100vh', background: '#EEF1F6' }}>
      <PublicNav />

      {/* Bandeau aperçu privé (page preview uniquement) */}
      {apercu && (
        <div style={{ background: '#FFF7ED', borderBottom: '1px solid #FED7AA', padding: '10px 0' }}>
          <div style={{ ...WRAP, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#C2620C' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
              Aperçu privé — ce bien ({STATUT_LABEL[bien.statut] || bien.statut}) {bien.published ? 'est visible publiquement.' : "n'est pas visible publiquement."}
            </span>
            <Link href="/dashboard/client/biens" style={{ fontSize: 13, fontWeight: 700, color: '#C2620C', textDecoration: 'underline' }}>
              Retour à Mes biens
            </Link>
          </div>
        </div>
      )}

      {/* Bandeau navy pour lisibilité de la nav + breadcrumb */}
      <div style={{ background: 'linear-gradient(150deg, #16324F 0%, #1D4267 100%)', padding: apercu ? '40px 0 28px' : '96px 0 28px' }}>
        <div style={{ ...WRAP }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
            <Link href="/biens" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Catalogue</Link>
            <span>→</span>
            <span style={{ color: '#7CB8A8', fontWeight: 600 }}>{bien.titre}</span>
          </div>
        </div>
      </div>

      <div style={{ ...WRAP, padding: '28px 24px 64px' }}>

        {/* Galerie pleine largeur */}
        <BienGallery images={bien.images} titre={bien.titre} />

        <div className="bien-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28, marginTop: 28, alignItems: 'start' }}>
          <style>{`@media (max-width: 1024px){ .bien-detail-grid { grid-template-columns: 1fr !important; } }`}</style>

          {/* COLONNE PRINCIPALE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
            <div style={card}>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: '#193B5E', margin: '0 0 6px', letterSpacing: '-0.02em' }}>{bien.titre}</h1>
              <div style={{ fontSize: 15, color: '#8A92A6', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                {[bien.ville, bien.province].filter(Boolean).join(', ') || 'Belgique'}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
                {specs.map((s) => (
                  <div key={s.label} style={{ background: '#FAFDFD', border: '1px solid #EEF2F7', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(124,184,168,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{specIcon[s.icon]}</svg>
                    </span>
                    <div>
                      <div style={{ fontSize: 11.5, color: '#8A92A6' }}>{s.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#193B5E' }}>{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {bien.description && (
              <div style={card}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: '#193B5E', margin: '0 0 12px' }}>Description</h2>
                <p style={{ fontSize: 14.5, color: '#3D4759', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>{bien.description}</p>
              </div>
            )}
          </div>

          {/* SIDEBAR DROITE */}
          <div style={{ position: 'sticky', top: 88, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'linear-gradient(150deg, #16324F 0%, #1D4267 100%)', borderRadius: 16, padding: 26, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -40, right: -30, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,184,168,0.2) 0%, transparent 65%)' }} />
              <div style={{ position: 'relative' }}>
                <Mensualite prix={bien.prixTotal} variant="hero" tone="dark" prefix="Propriétaire dès" />
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  Prix du bien : <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{bien.prixTotal.toLocaleString('fr-BE')} €</strong>
                </div>
              </div>
            </div>

            <div style={{ ...card, padding: 22 }}>
              <SimulateurModal bien={simBien} />
              {bien.urlClient && (
                <a href={bien.urlClient} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', background: '#fff', color: '#193B5E', padding: '13px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', border: '1.5px solid #E8EDF2', marginTop: 10 }}>
                  Voir l'annonce complète
                </a>
              )}
            </div>

            {bien.client?.societe && (
              <div style={{ ...card, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: bien.client.telephone ? 16 : 0 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#16324F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7CB8A8', fontWeight: 700, fontSize: 17, flexShrink: 0, overflow: 'hidden' }}>
                    {bien.client.logoUrl ? <img src={bien.client.logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : bien.client.societe[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#8A92A6' }}>Proposé par</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#193B5E' }}>{bien.client.societe}</div>
                  </div>
                </div>
                {bien.client.telephone && (
                  <div style={{ fontSize: 13, color: '#5A6275', paddingTop: 14, borderTop: '1px solid #F2F5FA' }}>
                    <span style={{ color: '#8A92A6' }}>Téléphone : </span>{bien.client.telephone}
                  </div>
                )}
              </div>
            )}

            <p style={{ fontSize: 10.5, color: '#A9B0BE', margin: 0, lineHeight: 1.5, textAlign: 'center', padding: '0 8px' }}>
              Sous réserve d'acceptation du crédit. Étude réalisée par BuyMonth Finance, intermédiaire en crédit agréé FSMA n° 1021.366.349.
            </p>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}