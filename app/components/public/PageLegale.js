/*
 * Mise en page commune aux pages légales (confidentialité, conditions générales).
 * Reprend le bandeau des mentions légales pour que les trois pages se ressemblent.
 */

import PublicNav from '@/app/components/PublicNav'
import PublicFooter from '@/app/components/PublicFooter'

export const carte = {
  background: '#fff',
  border: '1px solid #EEF2F7',
  borderRadius: 18,
  padding: '32px 36px',
  marginBottom: 20,
}

export const H2 = ({ children }) => (
  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#193B5E', margin: '0 0 14px', letterSpacing: '-0.01em' }}>
    {children}
  </h2>
)

export const P = ({ children, style }) => (
  <p style={{ fontSize: 14, color: '#5A6275', lineHeight: 1.75, margin: '0 0 12px', ...style }}>{children}</p>
)

export const Liste = ({ children }) => (
  <ul style={{ margin: '0 0 12px', paddingLeft: 20, fontSize: 14, color: '#5A6275', lineHeight: 1.75 }}>
    {children}
  </ul>
)

export const Fort = ({ children }) => <strong style={{ color: '#193B5E' }}>{children}</strong>

export const Lien = ({ href, children, externe }) => (
  <a
    href={href}
    {...(externe ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    style={{ color: '#249E7C', fontWeight: 600 }}
  >
    {children}
  </a>
)

// Tableau à en-têtes, qui passe en blocs empilés sous 680 px
export const Tableau = ({ entetes, lignes }) => (
  <div style={{ margin: '0 0 12px' }}>
    <div className="lg-tab" style={{ border: '1px solid #EEF2F7', borderRadius: 12, overflow: 'hidden' }}>
      <div
        className="lg-tab-head"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${entetes.length}, 1fr)`,
          background: '#F7FAFC',
          borderBottom: '1px solid #EEF2F7',
        }}
      >
        {entetes.map((e) => (
          <div key={e} style={{ padding: '11px 14px', fontSize: 12, fontWeight: 700, color: '#193B5E' }}>
            {e}
          </div>
        ))}
      </div>
      {lignes.map((ligne, i) => (
        <div
          key={i}
          className="lg-tab-row"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${entetes.length}, 1fr)`,
            borderBottom: i < lignes.length - 1 ? '1px solid #F2F5FA' : 'none',
          }}
        >
          {ligne.map((cellule, j) => (
            <div
              key={j}
              className="lg-tab-cell"
              data-label={entetes[j]}
              style={{ padding: '12px 14px', fontSize: 13.5, color: '#5A6275', lineHeight: 1.6 }}
            >
              {cellule}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
)

export default function PageLegale({ titre, maj, children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#EEF1F6' }}>
      <PublicNav />

      <style>{`
        @media (max-width: 680px) {
          .lg-card { padding: 24px 20px !important; }
          .lg-tab-head { display: none !important; }
          .lg-tab-row { grid-template-columns: 1fr !important; padding: 6px 0; border-bottom: 8px solid #F7FAFC !important; }
          .lg-tab-cell::before { content: attr(data-label); display: block; font-size: 10.5px; font-weight: 700; color: #A9B0BE; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; }
          .lg-tab-cell { padding: 8px 14px !important; }
        }
        @media (max-width: 560px) {
          .lg-hero h1 { font-size: 30px !important; }
        }
      `}</style>

      <div style={{ paddingTop: 64 }}>
        <div
          className="lg-hero"
          style={{
            background: 'linear-gradient(150deg, #16324F 0%, #1D4267 100%)',
            padding: '72px 24px 60px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              right: '-5%',
              width: 420,
              height: 420,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124,184,168,0.16) 0%, transparent 65%)',
              pointerEvents: 'none',
            }}
          />
          <p style={{ fontSize: 11, fontWeight: 700, color: '#7CB8A8', letterSpacing: '0.1em', margin: '0 0 14px', position: 'relative' }}>
            LÉGAL
          </p>
          <h1 style={{ fontSize: 40, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.025em', position: 'relative' }}>
            {titre}
          </h1>
          {maj && (
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: '14px 0 0', position: 'relative' }}>
              Dernière mise à jour : {maj}
            </p>
          )}
        </div>

        <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 80px' }}>{children}</div>

        <PublicFooter />
      </div>
    </div>
  )
}
