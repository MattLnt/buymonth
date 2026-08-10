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
  bath: <><path d="M4 12V5a2 2 0 012-2 2 2 0 012 2M4 12h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3zM6 20l-1 2M18 20l1 2" /></>,
  ruler: <><path d="M21.3 8.7L8.7 21.3a1 1 0 01-1.4 0l-4.6-4.6a1 1 0 010-1.4L15.3 2.7a1 1 0 011.4 0l4.6 4.6a1 1 0 010 1.4z" /></>,
  terrasse: <><path d="M3 21h18M5 21V11l7-5 7 5v10M9 21v-6h6v6" /></>,
  jardin: <><path d="M12 22V12M12 12c0-3 2-5 5-5 0 3-2 5-5 5zM12 12c0-3-2-5-5-5 0 3 2 5 5 5zM12 8c0-2 1.5-4 4-4M8 4c2.5 0 4 2 4 4" /></>,
  peb: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>,
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
    bien.type && { icon: 'type', label: 'Type de bien', value: bien.type },
    bien.chambres != null && { icon: 'bed', label: 'Chambres', value: bien.chambres },
    bien.sallesDeBain != null && { icon: 'bath', label: 'Salles de bain', value: bien.sallesDeBain },
    bien.surface != null && { icon: 'ruler', label: 'Surface habitable', value: `${bien.surface} m²` },
    bien.terrasse != null && bien.terrasse > 0 && { icon: 'terrasse', label: 'Terrasse', value: `${bien.terrasse} m²` },
    bien.jardin != null && bien.jardin > 0 && { icon: 'jardin', label: 'Jardin', value: `${bien.jardin} m²` },
    bien.pebClasse && { icon: 'peb', label: 'Classe PEB', value: bien.pebClasse + (bien.pebKwh ? ` · ${bien.pebKwh} kWh/m²·an` : '') },
    (bien.ville || bien.province) && { icon: 'pin', label: 'Localisation', value: [bien.ville, bien.province].filter(Boolean).join(', ') },
  ].filter(Boolean)

  const simBien = { id: bien.id, titre: bien.titre, prixTotal: bien.prixTotal, mensualite }

  const WRAP = { maxWidth: 1240, margin: '0 auto', padding: '0 24px' }
  const card = { background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 28 }

  // La carte agence est cliquable vers /agences/[slug] uniquement en public (pas en aperçu) et si un slug existe
  const agenceHref = !apercu && bien.client?.slug ? `/agences/${bien.client.slug}` : null

  const estVisible = bien.published
  const statutLabel = STATUT_LABEL[bien.statut] || bien.statut

  const agenceInner = bien.client?.societe ? (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: bien.client.telephone ? 16 : 0 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#16324F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7CB8A8', fontWeight: 700, fontSize: 17, flexShrink: 0, overflow: 'hidden' }}>
          {bien.client.logoUrl ? <img src={bien.client.logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : bien.client.societe[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: '#8A92A6' }}>Proposé par</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#193B5E', display: 'flex', alignItems: 'center', gap: 6 }}>
            {bien.client.societe}
            {agenceHref && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2" style={{ flexShrink: 0 }}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>}
          </div>
        </div>
      </div>
      {bien.client.telephone && (
        <div style={{ fontSize: 13, color: '#5A6275', paddingTop: 14, borderTop: '1px solid #F2F5FA' }}>
          <span style={{ color: '#8A92A6' }}>Téléphone : </span>{bien.client.telephone}
        </div>
      )}
      {agenceHref && (
        <div style={{ fontSize: 12.5, color: '#7CB8A8', fontWeight: 600, marginTop: bien.client.telephone ? 12 : 14, paddingTop: bien.client.telephone ? 12 : 14, borderTop: '1px solid #F2F5FA' }}>
          Voir tous les biens de cette agence →
        </div>
      )}
    </>
  ) : null

  return (
    <div style={{ minHeight: '100vh', background: '#EEF1F6' }}>
      <PublicNav />

      {/* Bandeau aperçu privé premium (page preview uniquement) */}
      {apercu && (
        <div style={{ background: 'linear-gradient(120deg, #16324F 0%, #1D4267 55%, #234E79 100%)', padding: '96px 0 0' }}>
          <div style={{ ...WRAP }}>
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, border: '1px solid rgba(124,184,168,0.3)', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(4px)', padding: '18px 22px' }}>
              <div style={{ position: 'absolute', top: -30, right: -20, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,184,168,0.22) 0%, transparent 65%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(124,184,168,0.16)', border: '1px solid rgba(124,184,168,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
                </span>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15.5, fontWeight: 700, color: '#fff' }}>Aperçu privé</span>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', color: estVisible ? '#7CB8A8' : '#F4B063', background: estVisible ? 'rgba(124,184,168,0.16)' : 'rgba(244,176,99,0.14)', border: `1px solid ${estVisible ? 'rgba(124,184,168,0.35)' : 'rgba(244,176,99,0.35)'}`, padding: '3px 10px', borderRadius: 20 }}>{statutLabel}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                    {estVisible
                      ? 'Voici le rendu public de ce bien, tel que le verront les acheteurs.'
                      : "Voici le rendu tel qu'il apparaîtra en public. Ce bien n'est pas diffusé actuellement."}
                  </div>
                </div>
                <Link href="/dashboard/client/biens" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 700, color: '#16324F', background: '#fff', padding: '11px 18px', borderRadius: 10, textDecoration: 'none', flexShrink: 0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                  Retour à Mes biens
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bandeau navy pour lisibilité de la nav + breadcrumb */}
      <div style={{ background: 'linear-gradient(150deg, #16324F 0%, #1D4267 100%)', padding: apercu ? '22px 0 28px' : '96px 0 28px' }}>
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
          <style>{`
            @media (max-width: 1024px){ .bien-detail-grid { grid-template-columns: 1fr !important; } }
            @media (max-width: 560px){ .bien-specs-grid { grid-template-columns: 1fr !important; } }
          `}</style>

          {/* COLONNE PRINCIPALE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
            <div style={card}>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: '#193B5E', margin: '0 0 6px', letterSpacing: '-0.02em' }}>{bien.titre}</h1>
              <div style={{ fontSize: 15, color: '#8A92A6', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                {[bien.ville, bien.province].filter(Boolean).join(', ') || 'Belgique'}
              </div>
            </div>

            <div style={card}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#193B5E', margin: '0 0 18px' }}>Caractéristiques</h2>
              <div className="bien-specs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {specs.map((s) => (
                  <div key={s.label} style={{ background: '#FAFDFD', border: '1px solid #EEF2F7', borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(124,184,168,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{specIcon[s.icon]}</svg>
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 11.5, color: '#8A92A6', marginBottom: 2 }}>{s.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#193B5E', lineHeight: 1.3 }}>{s.value}</div>
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

            {agenceInner && (
              agenceHref ? (
                <Link href={agenceHref} style={{ ...card, padding: 20, textDecoration: 'none', display: 'block', transition: 'border-color 0.15s ease' }}>
                  {agenceInner}
                </Link>
              ) : (
                <div style={{ ...card, padding: 20 }}>
                  {agenceInner}
                </div>
              )
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