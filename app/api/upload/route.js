import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const MAX_BYTES = 10 * 1024 * 1024 // 10 Mo

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    // La config Cloudinary est-elle bien présente ? (cause n°1 d'un upload « impossible »)
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('[UPLOAD] Config Cloudinary manquante (vérifier le .env)')
      return NextResponse.json({ error: "Service d'upload non configuré (Cloudinary)." }, { status: 500 })
    }

    const formData = await req.formData()
    const file = formData.get('file')
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Aucun fichier reçu.' }, { status: 400 })
    }

    // Validation type + taille (messages clairs plutôt qu'une erreur muette)
    if (!file.type?.startsWith('image/')) {
      return NextResponse.json({ error: 'Le fichier doit être une image.' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Image trop lourde (10 Mo maximum).' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // upload_stream : plus robuste que le base64 pour les photos volumineuses
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'buymonth', resource_type: 'image' },
        (error, res) => (error ? reject(error) : resolve(res))
      )
      stream.end(buffer)
    })

    return NextResponse.json({ url: result.secure_url })
  } catch (e) {
    // On loggue ET on renvoie la vraie cause pour pouvoir diagnostiquer
    console.error('[UPLOAD]', e?.message || e)
    return NextResponse.json({ error: e?.message || "Erreur lors de l'upload." }, { status: 500 })
  }
}