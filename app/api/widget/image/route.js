import { prisma } from '@/lib/prisma'
import { calculMensualite } from '@/lib/calcul'
import { MENSUALITE_CONFIG } from '@/lib/mensualiteConfig'
import { estPromoteurActif } from '@/lib/facturation'

export const dynamic = 'force-dynamic'

const pct = (t) => new Intl.NumberFormat('fr-BE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(t * 100) + ' %'

function buildSVG({ mensualite, premium, theme, primaire, accent, fond, cTitre, cMentions, cCredit }) {
  const dark = theme === 'dark'
  const bg = fond || (dark ? '#16324F' : '#FFFFFF')
  const textMain = cTitre || (dark ? '#FFFFFF' : '#16324F')
  const textMuted = cMentions || (dark ? '#9FB0C4' : '#8A92A6')
  const textCredit = cCredit || (dark ? '#9FB0C4' : '#8A92A6')
  const w = 320, h = 288
  const header = premium
    ? `<rect x="137" y="20" width="46" height="46" rx="10" fill="${accent}"/>`
    : `<text x="160" y="50" font-family="system-ui,Arial,sans-serif" font-size="22" font-weight="700" text-anchor="middle"><tspan fill="#FFFFFF">Buy</tspan><tspan fill="${accent}">Month</tspan></text>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="16" fill="${bg}" stroke="#EEF2F7"/>
  <path d="M0 16 Q0 0 16 0 H304 Q320 0 320 16 V84 H0 Z" fill="${primaire}"/>
  ${header}
  <text x="160" y="128" font-family="system-ui,Arial,sans-serif" font-size="14" font-weight="600" fill="${textMain}" text-anchor="middle">Propriétaire de ce bien dès</text>
  <text x="160" y="178" font-family="system-ui,Arial,sans-serif" font-size="40" font-weight="700" fill="${accent}" text-anchor="middle">${mensualite ? mensualite.toLocaleString('fr-BE') : '—'} €<tspan font-size="19">/mois*</tspan></text>
  <line x1="24" y1="200" x2="296" y2="200" stroke="#EEF2F7"/>
  <text x="160" y="220" font-family="system-ui,Arial,sans-serif" font-size="8.5" fill="${textMuted}" text-anchor="middle">* Emprunter de l'argent coûte aussi de l'argent. Estimation indicative hors frais</text>
  <text x="160" y="233" font-family="system-ui,Arial,sans-serif" font-size="8.5" fill="${textMuted}" text-anchor="middle">(apport ${Math.round(MENSUALITE_CONFIG.apportPct * 100)} %, ${Math.round(MENSUALITE_CONFIG.dureeMois / 12)} ans, taux ${pct(MENSUALITE_CONFIG.tauxAnnuel)}, TAEG ${pct(MENSUALITE_CONFIG.taegAnnuel)}).</text>
  <text x="160" y="246" font-family="system-ui,Arial,sans-serif" font-size="8.5" fill="${textMuted}" text-anchor="middle">Sous réserve d'acceptation du crédit.</text>
  <text x="160" y="264" font-family="system-ui,Arial,sans-serif" font-size="9" font-weight="600" fill="${textCredit}" text-anchor="middle">Crédit : BuyMonth Finance — FSMA 1021.366.349</text>
</svg>`
}

// Badge neutre affiché quand le bien n'est pas diffusable (promoteur non abonné, bien retiré…)
function buildSVGIndisponible({ theme, primaire, fond }) {
  const dark = theme === 'dark'
  const bg = fond || (dark ? '#16324F' : '#FFFFFF')
  const textMain = dark ? '#FFFFFF' : '#16324F'
  const textMuted = dark ? '#9FB0C4' : '#8A92A6'
  const w = 320, h = 160
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="16" fill="${bg}" stroke="#EEF2F7"/>
  <path d="M0 16 Q0 0 16 0 H304 Q320 0 320 16 V70 H0 Z" fill="${primaire}"/>
  <text x="160" y="46" font-family="system-ui,Arial,sans-serif" font-size="22" font-weight="700" text-anchor="middle"><tspan fill="#FFFFFF">Buy</tspan><tspan fill="#7CB8A8">Month</tspan></text>
  <text x="160" y="112" font-family="system-ui,Arial,sans-serif" font-size="14" font-weight="600" fill="${textMain}" text-anchor="middle">Bien non disponible</text>
  <text x="160" y="134" font-family="system-ui,Arial,sans-serif" font-size="10" fill="${textMuted}" text-anchor="middle">Cette annonce n'est plus diffusée.</text>
</svg>`
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const bienId = searchParams.get('bien')
  const premium = searchParams.get('premium') === '1'
  const theme = searchParams.get('theme') === 'dark' ? 'dark' : 'light'
  const primaire = searchParams.get('primaire') ? `#${searchParams.get('primaire')}` : '#16324F'
  const accent = searchParams.get('accent') ? `#${searchParams.get('accent')}` : '#7CB8A8'
  const fond = searchParams.get('fond') ? `#${searchParams.get('fond')}` : null
  const cTitre = searchParams.get('ctitre') ? `#${searchParams.get('ctitre')}` : null
  const cMentions = searchParams.get('cmentions') ? `#${searchParams.get('cmentions')}` : null
  const cCredit = searchParams.get('ccredit') ? `#${searchParams.get('ccredit')}` : null

  let mensualite = null
  let diffusable = false

  if (bienId) {
    const bien = await prisma.bien.findUnique({
      where: { id: bienId },
      include: { client: { select: { subStatus: true } } },
    })
    // Diffusable seulement si le bien est visible ET son promoteur abonné
    if (bien && bien.published && estPromoteurActif(bien.client)) {
      diffusable = true
      mensualite = bien.mensualite || calculMensualite(bien.prixTotal)
    }
  }

  const svg = diffusable
    ? buildSVG({ mensualite, premium, theme, primaire, accent, fond, cTitre, cMentions, cCredit })
    : buildSVGIndisponible({ theme, primaire, fond })

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      // Cache court quand indisponible : le badge doit se réactiver vite dès que le promoteur s'abonne
      'Cache-Control': diffusable ? 'public, max-age=3600' : 'public, max-age=60',
    },
  })
}