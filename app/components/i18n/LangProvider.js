'use client'

import { createContext, useContext, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { LANG_COOKIE, makeT, normLang } from '@/lib/i18n/config'

const LangContext = createContext({ lang: 'fr', t: makeT('fr'), setLang: () => {} })

export function LangProvider({ lang: initial, children }) {
  const router = useRouter()
  const lang = normLang(initial)

  const value = useMemo(() => {
    const setLang = (next) => {
      const l = normLang(next)
      document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`
      // Mémorise la langue du compte connecté (langue de ses e-mails). Sans effet si déconnecté.
      fetch('/api/langue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang: l }),
      }).catch(() => {})
      // Retire un éventuel ?lang= de l'URL, sinon il reprendrait le dessus
      const url = new URL(window.location.href)
      if (url.searchParams.has('lang')) {
        url.searchParams.delete('lang')
        window.history.replaceState(null, '', url.pathname + url.search + url.hash)
      }
      router.refresh()
    }
    return { lang, t: makeT(lang), setLang }
  }, [lang, router])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

// const { lang, t } = useLang();  t('Bonjour', 'Hallo')
export function useLang() {
  return useContext(LangContext)
}
