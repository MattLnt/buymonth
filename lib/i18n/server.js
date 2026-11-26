import { cookies, headers } from 'next/headers'
import { LANG_COOKIE, LANG_HEADER, makeT, normLang } from './config'

// Langue de la requête en cours (composants serveur et routes API).
// Ordre : ?lang= (posé en en-tête par le middleware), puis le cookie, puis FR.
export async function getLang() {
  const h = await headers()
  const forced = h.get(LANG_HEADER)
  if (forced) return normLang(forced)
  const c = await cookies()
  return normLang(c.get(LANG_COOKIE)?.value)
}

export async function getT() {
  const lang = await getLang()
  return { lang, t: makeT(lang) }
}
