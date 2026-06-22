// Composant badge pur (présentation). Utilisé par /embed/badge ET la preview du générateur.

export function Badge({
  mensualite,
  premium = false,
  theme = 'light',
  couleurPrimaire = '#16324F',
  couleurAccent = '#7CB8A8',
  logoUrl = null,
  width = 320,
}) {
  const dark = theme === 'dark'
  const bg = dark ? '#16324F' : '#FFFFFF'
  const headerBg = couleurPrimaire
  const textMain = dark ? '#FFFFFF' : '#16324F'
  const textMuted = dark ? 'rgba(255,255,255,0.6)' : '#8A92A6'
  const border = dark ? 'rgba(255,255,255,0.1)' : '#EEF2F7'

  return (
    <div style={{ width, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', borderRadius: 16, overflow: 'hidden', border: `1px solid ${border}`, background: bg, boxShadow: '0 8px 28px rgba(22,50,79,0.12)' }}>
      {/* Header */}
      <div style={{ background: headerBg, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 56 }}>
        {premium && logoUrl ? (
          <img src={logoUrl} alt="Logo" style={{ maxHeight: 32, maxWidth: 180, objectFit: 'contain' }} />
        ) : premium && !logoUrl ? (
          <span style={{ width: 30, height: 30, borderRadius: 8, background: couleurAccent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={couleurPrimaire} strokeWidth="2.2"><path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V9.5z" /></svg>
          </span>
        ) : (
          <div style={{ fontSize: 19, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
            Buy<span style={{ color: couleurAccent }}>Month</span>
          </div>
        )}
      </div>

      {/* Corps */}
      <div style={{ padding: '22px 20px 18px', textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: textMain, marginBottom: 10 }}>Propriétaire de ce bien dès</div>
        <div style={{ fontSize: 40, fontWeight: 700, color: couleurAccent, letterSpacing: '-0.02em', lineHeight: 1 }}>
          {mensualite ? mensualite.toLocaleString('fr-BE') : '—'} €<span style={{ fontSize: 19 }}>/mois</span>
        </div>

        <div style={{ fontSize: 9.5, color: textMuted, marginTop: 16, lineHeight: 1.5, borderTop: `1px solid ${border}`, paddingTop: 12 }}>
          Simulation indicative sur base d'un exemple représentatif (apport 10 %, durée 25 ans, taux 3,45 %, TAEG 3,45 % hors assurances). Sous réserve d'acceptation du crédit par l'organisme prêteur.
          <div style={{ marginTop: 6, fontWeight: 600 }}>JG Management — FSMA 1021.366.349</div>
        </div>
      </div>
    </div>
  )
}