'use client'

import { useLang } from './LangProvider'

// Sélecteur FR | NL. color = couleur du texte selon le fond (clair ou foncé).
export default function LangSwitcher({ color = '#fff', size = 13, style }) {
  const { lang, setLang } = useLang()
  const btn = (code) => (
    <button
      type="button"
      onClick={() => lang !== code && setLang(code)}
      aria-pressed={lang === code}
      aria-label={code === 'fr' ? 'Français' : 'Nederlands'}
      style={{
        background: 'none', border: 'none', padding: '4px 2px', cursor: lang === code ? 'default' : 'pointer',
        color, opacity: lang === code ? 1 : 0.55, fontWeight: lang === code ? 800 : 600,
        fontSize: size, letterSpacing: '0.04em', fontFamily: 'inherit',
      }}
    >
      {code.toUpperCase()}
    </button>
  )
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, ...style }}>
      {btn('fr')}
      <span style={{ color, opacity: 0.35, fontSize: size }}>|</span>
      {btn('nl')}
    </span>
  )
}
