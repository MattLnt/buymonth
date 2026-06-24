import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const STATUTS_ACTIFS = ['active', 'trialing']

function aAcces(token) {
  // Abonnement Stripe actif
  if (token.subStatus && STATUTS_ACTIFS.includes(token.subStatus)) return true
  // OU essai gratuit admin en cours
  if (token.trialEndsAt && new Date(token.trialEndsAt).getTime() > Date.now()) return true
  return false
}

export async function middleware(req) {
  const { pathname } = req.nextUrl

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
    return NextResponse.next()
  }

  // ── Espace client ──
  if (pathname.startsWith('/dashboard/client')) {
    if (!token) return NextResponse.redirect(new URL('/login', req.url))

    // Blocage abonnement (uniquement si l'interrupteur est activé)
    if (process.env.BLOCAGE_ABONNEMENT === 'true') {
      // La page abonnement reste toujours accessible (sinon boucle de redirection)
      if (pathname.startsWith('/dashboard/client/abonnement')) {
        return NextResponse.next()
      }
      // Admin jamais bloqué
      if (token.role !== 'ADMIN') {
        if (!aAcces(token)) {
          return NextResponse.redirect(new URL('/dashboard/client/abonnement', req.url))
        }
      }
    }
    return NextResponse.next()
  }

  // ── /dashboard nu → laisse le routeur de rôle gérer ──
  if (pathname === '/dashboard') {
    if (!token) return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}