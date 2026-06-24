import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email.toLowerCase().trim()
        const password = credentials.password

        if (password.length > 72) return null
        if (email.length > 254) return null

        const user = await prisma.user.findUnique({ where: { email } })

        const fakeHash = '$2a$12$fakehashfakehashfakehashfakehashfakehashfakehashfakeha'
        const passwordMatch = await bcrypt.compare(password, user?.password || fakeHash)

        if (!user || !passwordMatch) return null

        return { id: user.id, email: user.email, role: user.role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      // À chaque renouvellement (ou refresh forcé), on relit rôle + statut d'abo + essai
      if (token?.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: {
            role: true,
            client: { select: { subStatus: true, trialEndsAt: true } },
          },
        })
        if (!dbUser) return null // user supprimé → token invalide
        token.role = dbUser.role
        token.subStatus = dbUser.client?.subStatus || null
        token.trialEndsAt = dbUser.client?.trialEndsAt ? dbUser.client.trialEndsAt.toISOString() : null
      }
      return token
    },
    async session({ session, token }) {
      if (!token) return null
      session.user.id = token.id
      session.user.role = token.role
      session.user.subStatus = token.subStatus || null
      session.user.trialEndsAt = token.trialEndsAt || null
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
}