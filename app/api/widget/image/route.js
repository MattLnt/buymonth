import { prisma } from '@/lib/prisma'
import { calculMensualite } from '@/lib/calcul'

export const dynamic = 'force-dynamic'

function buildSVG({ mensualite, premium, theme, primaire, accent }) {
  const dark = theme === 'dark'
  const bg = dark ? '#16324F' : '#FFFFFF'
  const textMain = dark ? '#FFFFFF' : '#16324F'
  const textMuted = dark ? '#9FB0C4' : '#8A92A6'
  const w = 320, h = 280
  const header = premium
    ? `<rect x="137" y="20" width="46" height="46" rx="10" fill="${accent}"/>`
    : `<text x="160" y="50" font-family="system-ui,Arial,sans-serif" font-size="22" font-weight="700" text-anchor="middle"><tspan fill="#FFFFFF">Buy</tspan><tspan fill="${accent}">Month</tspan></text>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="16" fill="${bg}" stroke="#EEF2F7"/>
  <path d="M0 16 Q0 0 16 0 H304 Q320 0 320 16 V84 H0 Z" fill="${primaire}"/>
  ${header}
  <text x="160" y="128" font-family="system-ui,Arial,sans-serif" font-size="14" font-weight="600" fill="${textMain}" text-anchor="middle">Propriétaire de ce bien dès</text>
  <text x="160" y="178" font-family="system-ui,Arial,sans-serif" font-size="40" font-weight="700" fill="${accent}" text-anchor="middle">${mensualite ? mensualite.toLocaleString('fr-BE') : '—'} €<tspan font-size="19">/mois</tspan></text>
  <line x1="24" y1="200" x2="296" y2="200" stroke="#EEF2F7"/>
  <text x="160" y="222" font-family="system-ui,Arial,sans-serif" font-size="9" fill="${textMuted}" text-anchor="middle">Simulation indicative (apport 10 %, 25 ans, TAEG 3,45 % hors assurances).</text>
  <text x="160" y="236" font-family="system-ui,Arial,sans-serif" font-size="9" fill="${textMuted}" text-anchor="middle">Sous réserve d'acceptation du crédit par l'organisme prêteur.</text>
  <text x="160" y="256" font-family="system-ui,Arial,sans-serif" font-size="9" font-weight="600" fill="${textMuted}" text-anchor="middle">JG Management — FSMA 1021.366.349</text>
</svg>`
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const bienId = searchParams.get('bien')
  const premium = searchParams.get('premium') === '1'
  const theme = searchParams.get('theme') === 'dark' ? 'dark' : 'light'
  const primaire = searchParams.get('primaire') ? `#${searchParams.get('primaire')}` : '#16324F'
  const accent = searchParams.get('accent') ? `#${searchParams.get('accent')}` : '#7CB8A8'

  let mensualite = null
  if (bienId) {
    const bien = await prisma.bien.findUnique({ where: { id: bienId } })
    if (bien) mensualite = bien.mensualite || calculMensualite(bien.prixTotal)
  }

  const svg = buildSVG({ mensualite, premium, theme, primaire, accent })

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}