import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file')
    if (!file) return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'comptabilité/messages',
      resource_type: 'auto',
      public_id: `msg_${Date.now()}`,
    })

    return NextResponse.json({
      url: result.secure_url,
      name: file.name,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur upload' }, { status: 500 })
  }
}