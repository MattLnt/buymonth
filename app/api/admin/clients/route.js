import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { genererSlugUnique } from '@/lib/slug'
import bcrypt from 'bcryptjs'

const FORMULES = ['PRO', 'PRO_PLUS']

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })
    }

    const b = await req.json()

    const societe = (b.societe || '').trim()
    const email = (b.email || '').trim().toLowerCase()
    const password = b.password || ''

    if (!societe) return NextResponse.json({ error: 'La société est obligatoire.' }, { status: 400 })
    if (!email) return NextResponse.json({ error: "L'email de connexion est obligatoire." }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: 'Le mot de passe doit faire au moins 8 caractères.' }, { status: 400 })

    // Email déjà pris ?
    const existe = await prisma.user.findUnique({ where: { email } })
    if (existe) return NextResponse.json({ error: 'Cet email est déjà utilisé.' }, { status: 409 })

    const hash = await bcrypt.hash(password, 10)

    // Slug unique dérivé de la société (pour la page publique /agences/[slug])
    const slug = await genererSlugUnique(societe)

    // Création User (role CLIENT) + Client en une transaction
    const client = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, password: hash, role: 'CLIENT' },
      })
      return tx.client.create({
        data: {
          userId: user.id,
          societe,
          slug,
          contactNom: b.contactNom || null,
          contactOpe: b.contactOpe || null,
          contactFacturation: b.contactFacturation || null,
          telephone: b.telephone || null,
          numeroTva: b.numeroTva || null,
          adresse: b.adresse || null,
          adresseAdmin: b.adresseAdmin || null,
          formule: FORMULES.includes(b.formule) ? b.formule : 'PRO',
        },
      })
    })

    return NextResponse.json({ ok: true, id: client.id })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}