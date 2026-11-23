import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { normLang } from '@/lib/i18n/config'

// Mémorise la langue choisie sur le compte connecté (langue de ses e-mails).
export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ ok: true })
  const body = await req.json().catch(() => ({}))
  await prisma.user.update({ where: { id: session.user.id }, data: { langue: normLang(body.lang) } }).catch(() => {})
  return NextResponse.json({ ok: true })
}
