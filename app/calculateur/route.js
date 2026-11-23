import { readFile } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-static'

// Sert le calculateur HTML autonome (public/calculateur-rentabilite.html) à l'URL propre /calculateur
export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'calculateur-rentabilite.html')
  const html = await readFile(filePath, 'utf-8')
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}