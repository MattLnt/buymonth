import Link from 'next/link'

export const metadata = {
  title: 'BuyMonth — Votre futur bien en mensualités',
  description: "Découvrez des biens immobiliers affichés en budget mensuel clair. Acheteurs : trouvez un bien à votre budget. Professionnels de l'immobilier : vendez en mensualités.",
  alternates: { canonical: '/' },
  openGraph: {
    title: 'BuyMonth — Votre futur bien en mensualités',
    description: 'Des biens immobiliers affichés en budget mensuel clair, plutôt qu\'en prix total.',
    type: 'website',
  },
}

const NAVY = '#16324F'
const TEAL = '#7CB8A8'

export default function HomeChoicePage() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #16324F 0%, #1D4267 55%, #16324F 100%)', display: 'flex', flexDirection: 'column', fontFamily: "'Montserrat', system-ui, sans-serif" }}>
      {/* Header simple */}
      <header style={{ padding: '26px 24px', display: 'flex', justifyContent: 'center' }}>
        <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, fontWeight: 700, color: '#fff' }}>
          Buy<span style={{ color: TEAL }}>Month</span>
        </span>
      </header>

      {/* Corps centré */}
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 24px 60px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 'clamp(1.9rem, 5vw, 3.2rem)', fontWeight: 700, color: '#fff', margin: '0 0 14px', letterSpacing: '-0.02em', lineHeight: 1.1, maxWidth: 780 }}>
          Votre futur bien, <span style={{ color: TEAL }}>en mensualités</span>
        </h1>
        <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', color: 'rgba(255,255,255,0.7)', margin: '0 0 48px', maxWidth: 560, lineHeight: 1.6 }}>
          Des biens immobiliers affichés en budget mensuel clair, plutôt qu'en prix total. Que cherchez-vous&nbsp;?
        </p>

        {/* Deux cartes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22, width: '100%', maxWidth: 820 }}>

          {/* Particulier */}
          <Link href="/biens" style={{ textDecoration: 'none' }}>
            <div className="choice-card" style={{ background: '#fff', borderRadius: 20, padding: '38px 30px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxSizing: 'border-box' }}>
              <span style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(124,184,168,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
              </span>
              <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: NAVY, margin: '0 0 10px' }}>Je cherche un bien</h2>
              <p style={{ fontSize: 14.5, color: '#5A6B7D', margin: '0 0 26px', lineHeight: 1.6, flex: 1 }}>
                Parcourez les biens disponibles et visualisez le budget mensuel nécessaire pour devenir propriétaire.
              </p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', borderRadius: 12, background: NAVY, color: '#fff', fontSize: 14.5, fontWeight: 700 }}>
                Voir les biens
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </span>
            </div>
          </Link>

          {/* Professionnel */}
          <Link href="/pro" style={{ textDecoration: 'none' }}>
            <div className="choice-card" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 20, padding: '38px 30px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxSizing: 'border-box' }}>
              <span style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(124,184,168,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="1.8"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" /><line x1="9" y1="9" x2="9" y2="9.01" /><line x1="9" y1="12" x2="9" y2="12.01" /><line x1="9" y1="15" x2="9" y2="15.01" /></svg>
              </span>
              <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 10px' }}>Je suis un professionnel</h2>
              <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.65)', margin: '0 0 26px', lineHeight: 1.6, flex: 1 }}>
                Promoteur ou agence&nbsp;? Affichez vos biens en mensualités et transformez vos visiteurs en acheteurs qualifiés.
              </p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', borderRadius: 12, background: TEAL, color: '#0F2A22', fontSize: 14.5, fontWeight: 700 }}>
                Découvrir la plateforme
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </span>
            </div>
          </Link>
        </div>

        {/* Lien discret pages légales */}
        <div style={{ marginTop: 40, display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/mentions-legales" style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Mentions légales</Link>
          <Link href="/confidentialite" style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Confidentialité</Link>
          <Link href="/cgv" style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>CGV</Link>
        </div>
      </section>

      <style>{`
        .choice-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .choice-card:hover { transform: translateY(-4px); box-shadow: 0 18px 44px rgba(0,0,0,0.22); }
      `}</style>
    </main>
  )
}