// Bilingue FR / NL. Le français est la langue par défaut.
// Usage : const t = makeT(lang); t('Les biens', 'Het aanbod')
// Le texte FR et le texte NL sont écrits côte à côte, à l'endroit où ils s'affichent.

export const LANGS = ['fr', 'nl']
export const DEFAULT_LANG = 'fr'
export const LANG_COOKIE = 'bm_lang'
export const LANG_HEADER = 'x-bm-lang'

export function normLang(v) {
  return v === 'nl' ? 'nl' : 'fr'
}

// Locale pour Intl / toLocaleString
export function locale(lang) {
  return lang === 'nl' ? 'nl-BE' : 'fr-BE'
}

export function makeT(lang) {
  const l = normLang(lang)
  return (fr, nl) => (l === 'nl' ? nl : fr)
}

// Lien avec la langue forcée (ex. e-mails) : /biens/1 → /biens/1?lang=nl
export function withLang(url, lang) {
  if (normLang(lang) === DEFAULT_LANG) return url
  const [base, hash] = String(url).split('#')
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}lang=nl${hash !== undefined ? '#' + hash : ''}`
}
