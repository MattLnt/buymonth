import Link from 'next/link'

export function BienPublicCard({ bien }) {
  return (
    <Link href={`/biens/${bien.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s', height: '100%', display: 'flex', flexDirection: 'column' }}
        className="bien-pub-card">
        {/* image */}
        <div style={{ height: 180, background: bien.images?.[0] ? `url(${bien.images[0]}) center/cover` : 'linear-gradient(135deg, #EEF3FA, #E3ECF5)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!bien.images?.[0] && (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B7C4D6" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          )}
          {bien.type && (
            <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.95)', color: '#193B5E', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
              {bien.type}
            </span>
          )}
        </div>

        {/* contenu */}
        <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#193B5E', margin: '0 0 4px', lineHeight: 1.3 }}>{bien.titre}</h3>
          <div style={{ fontSize: 13, color: '#8A92A6', marginBottom: 14 }}>
            {[bien.ville, bien.province].filter(Boolean).join(', ') || 'Belgique'}
          </div>

          <div style={{ marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#7CB8A8', letterSpacing: '-0.02em' }}>{bien.mensualite} €<span style={{ fontSize: 14 }}>/mois</span></span>
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 12.5, color: '#5A6275', flexWrap: 'wrap' }}>
              {bien.chambres != null && <span>{bien.chambres} ch.</span>}
              {bien.surface != null && <span>{bien.surface} m²</span>}
              <span style={{ marginLeft: 'auto', color: '#A9B0BE' }}>{bien.prixTotal.toLocaleString('fr-BE')} €</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}