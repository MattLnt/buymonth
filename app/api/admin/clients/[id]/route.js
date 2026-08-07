import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const FORMULES = ['PRO', 'PRO_PLUS']

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 })
    }

    const { id } = await params
    const b = await req.json()

    const client = await prisma.client.findUnique({
      where: { id },
      include: { user: { select: { id: true, email: true } } },
    })
    if (!client) return NextResponse.json({ error: 'Client introuvable.' }, { status: 404 })

    if (!b.societe?.trim()) {
      return NextResponse.json({ error: 'La société est obligatoire.' }, { status: 400 })
    }

    // Email de connexion : on ne touche au User que si l'email change
    const nouvelEmail = (b.email || '').trim().toLowerCase()
    if (nouvelEmail && nouvelEmail !== client.user.email) {
      const existe = await prisma.user.findUnique({ where: { email: nouvelEmail } })
      if (existe && existe.id !== client.user.id) {
        return NextResponse.json({ error: 'Cet email est déjà utilisé par un autre compte.' }, { status: 409 })
      }
      await prisma.user.update({ where: { id: client.user.id }, data: { email: nouvelEmail } })
    }

    await prisma.client.update({
      where: { id },
      data: {
        societe: b.societe.trim(),
        contactNom: b.contactNom || null,
        contactOpe: b.contactOpe || null,
        contactFacturation: b.contactFacturation || null,
        telephone: b.telephone || null,
        numeroTva: b.numeroTva || null,
        adresse: b.adresse || null,
        adresseAdmin: b.adresseAdmin || null,
        formule: FORMULES.includes(b.formule) ? b.formule : client.formule,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}