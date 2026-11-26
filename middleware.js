import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { LANG_COOKIE, LANG_HEADER } from '@/lib/i18n/config'

const STATUTS_ACTIFS = ['active', 'trialing']

function aAcces(token) {
  // Abonnement Stripe actif
  if (token.subStatus && STATUTS_ACTIFS.includes(token.subStatus)) return true
  // OU essai gratuit admin en cours
  if (token.trialEndsAt && new Date(token.trialEndsAt).getTime() > Date.now()) return true
  return false
}

// ?lang=nl ou ?lang=fr dans l'URL : force la langue de la page (liens partagés, e-mails,
// widgets) et la mémorise dans un cookie, sauf dans un widget embarqué.
function avecLangue(req, res) {
  const l = req.nextUrl.searchParams.get('lang')
  if (l !== 'fr' && l !== 'nl') return res
  if (!req.nextUrl.pathname.startsWith('/embed')) {
    res.cookies.set(LANG_COOKIE, l, { path: '/', maxAge: 31536000, sameSite: 'lax' })
  }
  return res
}

function suite(req) {
  const l = req.nextUrl.searchParams.get('lang')
  if (l !== 'fr' && l !== 'nl') return NextResponse.next()
  const headers = new Headers(req.headers)
  headers.set(LANG_HEADER, l)
  return avecLangue(req, NextResponse.next({ request: { headers } }))
}

export async function middleware(req) {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith('/dashboard')) return suite(req)

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: process.env.NODE_ENV === 'production'
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token',
  })

  // ── Protection des routes admin ──
  if (pathname.startsWith('/dashboard/admin')) {
    if (!token) return NextResponse.redirect(new URL('/login', req.url))
    if (token.role !== 'ADMIN') return NextResponse.redirect(new URL('/', req.url))
    return suite(req)
  }

  // ── Espace client ──
  if (pathname.startsWith('/dashboard/client')) {
    if (!token) return NextResponse.redirect(new URL('/login', req.url))

    // Blocage abonnement (uniquement si l'interrupteur est activé)
    if (process.env.BLOCAGE_ABONNEMENT === 'true') {
      // La page abonnement reste toujours accessible (sinon boucle de redirection)
      if (pathname.startsWith('/dashboard/client/abonnement')) {
        return suite(req)
      }
      // Admin jamais bloqué
      if (token.role !== 'ADMIN') {
        if (!aAcces(token)) {
          return NextResponse.redirect(new URL('/dashboard/client/abonnement', req.url))
        }
      }
    }
    return suite(req)
  }

  // ── /dashboard nu → laisse le routeur de rôle gérer ──
  if (pathname === '/dashboard') {
    if (!token) return NextResponse.redirect(new URL('/login', req.url))
  }

  return suite(req)
}

export const config = {
  // Tout sauf les fichiers statiques et l'API
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\.[a-zA-Z0-9]+$).*)'],
}