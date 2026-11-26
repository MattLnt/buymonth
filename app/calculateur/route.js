import { readFile } from 'fs/promises'
import path from 'path'
import { getLang } from '@/lib/i18n/server'

// La langue dépend de la requête (cookie / ?lang=) : plus de rendu statique
export const dynamic = 'force-dynamic'

// Sert le calculateur HTML autonome à l'URL propre /calculateur
// FR : public/calculateur-rentabilite.html — NL : public/calculateur-rentabilite-nl.html
export async function GET() {
  const lang = await getLang()
  const fichier = lang === 'nl' ? 'calculateur-rentabilite-nl.html' : 'calculateur-rentabilite.html'
  const filePath = path.join(process.cwd(), 'public', fichier)
  const html = await readFile(filePath, 'utf-8')
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', Vary: 'Cookie' },
  })
}
