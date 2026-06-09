import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendWelcomeVendeur, sendWelcomeAcheteur } from '@/lib/emails'

export async function POST(req) {
  try {
    const { email, password, role, nomBureau, nomCEO, telephone, adresse } = await req.json()

    if (!email || !password || !role) {
      return NextResponse.json({ message: 'Tous les champs sont requis' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ message: 'Le mot de passe doit faire au moins 8 caractères' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ message: 'Cet email est déjà utilisé' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    if (role === 'VENDEUR') {
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'VENDEUR',
          vendeur: {
            create: {
              nomBureau: nomBureau || '',
              nomCEO: nomCEO || '',
              telephone: telephone || '',
              adresse: adresse || '',
              emailContact: email,
            },
          },
        },
      })
      try { await sendWelcomeVendeur(email) } catch (e) { console.error('Email vendeur:', e) }
    }

    if (role === 'ACHETEUR') {
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'ACHETEUR',
          acheteur: { create: {} },
        },
      })
      try { await sendWelcomeAcheteur(email) } catch (e) { console.error('Email acheteur:', e) }
    }

    return NextResponse.json({ message: 'Compte créé avec succès' }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}