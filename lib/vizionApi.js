import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/settings'
import { calculMensualite } from '@/lib/calcul'
import { verifyApiKey, getAllowedOrigin, getClientIp } from '@/lib/apiSecurity'
import { rateLimit } from '@/lib/rateLimit'
import { IDENTIFICATION_FINANCE } from '@/lib/mensualiteConfig'
import { prixDecaisse, estRegimeValide } from '@/lib/regime'

/*
 * API Vizion — calcul de la mensualité en temps réel (brief « Spécification API BuyMonth », docs/).
 *
 * Deux routes partagent ce handler :
 *   POST /api/calculate-monthly   format du brief  : { price } → { monthlyPrice, totalPrice, duration, rate, … }
 *   POST /api/vizion/mensualite   format historique : { prix }  → { mensualite, prixTotal, … }
 *
 * Les deux acceptent indifféremment `price` ou `prix`, et un `regime` optionnel
 * (TVA_21 | TVA_6 | ENREGISTREMENT) pour calculer sur le prix TVAC.
 * Sécurité : clé dans l'en-tête x-api-key (VIZION_API_KEY), limitation de débit par IP,
 * contrôle d'origine navigateur (VIZION_ALLOWED_ORIGINS).
 */

// Bornes réalistes pour le prix d'un bien (anti-valeurs absurdes)
const PRIX_MIN = 1000
const PRIX_MAX = 100_000_000

// Limites de débit — le configurateur recalcule à chaque modification du visiteur
const RL_LIMIT = 120       // 120 requêtes
const RL_WINDOW = 60_000   // par minute et par IP

// Les paramètres (apport, taux, durée) changent rarement : cache court pour tenir
// l'objectif « réponse en moins d'une seconde » sans requête base à chaque appel.
const SETTINGS_TTL = 60_000
let settingsCache = { value: null, expiresAt: 0 }

async function getSettingsCached() {
  const now = Date.now()
  if (settingsCache.value && settingsCache.expiresAt > now) return settingsCache.value
  const s = await getSettings()
  settingsCache = { value: s, expiresAt: now + SETTINGS_TTL }
  return s
}

function corsHeaders(origin) {
  const allowed = getAllowedOrigin(origin)
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-store',
    'Vary': 'Origin',
  }
  if (allowed) headers['Access-Control-Allow-Origin'] = allowed
  return headers
}

const fmtPct = (t) => (t * 100).toFixed(2).replace('.', ',')

/**
 * Traite un appel POST.
 * @param {Request} req
 * @param {'brief'|'fr'} format  'brief' = clés du brief Vizion, 'fr' = clés historiques
 */
export async function postMensualite(req, format = 'brief') {
  const origin = req.headers.get('origin')
  const headers = corsHeaders(origin)
  const ip = getClientIp(req)

  try {
    // ── 1. Rate limiting par IP ──
    const rl = rateLimit(ip, RL_LIMIT, RL_WINDOW)
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Réessayez plus tard.' },
        { status: 429, headers: { ...headers, 'Retry-After': String(rl.retryAfter) } }
      )
    }

    // ── 2. API configurée ? ──
    if (!process.env.VIZION_API_KEY) {
      console.error('[VIZION] VIZION_API_KEY absente : API non configurée.')
      return NextResponse.json({ error: 'API non configurée.' }, { status: 500, headers })
    }

    // ── 3. Authentification (comparaison en temps constant) ──
    if (!verifyApiKey(req.headers.get('x-api-key'))) {
      console.warn(`[VIZION] Tentative non autorisée — IP: ${ip} — origin: ${origin || 'n/a'}`)
      return NextResponse.json({ error: 'Clé API invalide ou manquante.' }, { status: 401, headers })
    }

    // ── 4. Origine autorisée (si l'appel vient d'un navigateur) ──
    if (origin && !getAllowedOrigin(origin)) {
      console.warn(`[VIZION] Origine refusée — IP: ${ip} — origin: ${origin}`)
      return NextResponse.json({ error: 'Origine non autorisée.' }, { status: 403, headers })
    }

    // ── 5. Lecture et validation du corps ──
    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Corps de requête invalide (JSON attendu).' }, { status: 400, headers })
    }

    const brut = body?.price ?? body?.prix
    const prix = Number(brut)
    if (!Number.isFinite(prix) || prix <= 0) {
      return NextResponse.json({ error: 'Le champ "price" est requis et doit être un nombre positif.' }, { status: 400, headers })
    }
    if (prix < PRIX_MIN || prix > PRIX_MAX) {
      return NextResponse.json({ error: `Le prix doit être compris entre ${PRIX_MIN} et ${PRIX_MAX} €.` }, { status: 400, headers })
    }

    // Régime fiscal optionnel. Sans régime, le prix reçu est pris tel quel (prix TVAC côté Vizion).
    const regime = body?.regime ?? null
    if (regime !== null && !estRegimeValide(regime)) {
      return NextResponse.json({ error: 'Le champ "regime" doit valoir TVA_21, TVA_6 ou ENREGISTREMENT.' }, { status: 400, headers })
    }

    // ── 6. Calcul sur le prix décaissé ──
    const s = await getSettingsCached()
    const prixBase = prixDecaisse(prix, regime)
    const mensualite = calculMensualite(prixBase, {
      apportPct: s.apportPct,
      tauxAnnuel: s.tauxAnnuel,
      dureeMois: s.dureeMois,
    })
    const apport = Math.round(prixBase * s.apportPct)
    const dureeAns = Math.round(s.dureeMois / 12)
    const mention = `Estimation indicative, hors droits d'enregistrement et frais de notaire (apport ${Math.round(s.apportPct * 100)} %, ${dureeAns} ans, taux débiteur ${fmtPct(s.tauxAnnuel)} %, TAEG ${fmtPct(s.taegAnnuel)} %). Sous réserve d'acceptation du dossier. ${IDENTIFICATION_FINANCE}`

    if (format === 'fr') {
      return NextResponse.json({
        mensualite,
        prixTotal: prix,
        regime,
        prixDecaisse: prixBase,
        apport,
        apportPct: s.apportPct,
        dureeMois: s.dureeMois,
        tauxAnnuel: s.tauxAnnuel,
        devise: 'EUR',
        mention,
      }, { headers })
    }

    // Format du brief : monthlyPrice / totalPrice / duration (années) / rate (% débiteur)
    return NextResponse.json({
      monthlyPrice: mensualite,
      totalPrice: prix,
      duration: dureeAns,
      rate: Number((s.tauxAnnuel * 100).toFixed(2)),
      // Compléments (obligatoires pour l'affichage légal à côté du montant)
      aprc: Number((s.taegAnnuel * 100).toFixed(2)),
      downPayment: apport,
      downPaymentPct: Math.round(s.apportPct * 100),
      financedPrice: prixBase,
      regime,
      currency: 'EUR',
      legalNotice: mention,
    }, { headers })
  } catch (e) {
    console.error('[VIZION] Erreur serveur :', e?.message)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500, headers })
  }
}

// Pré-vol CORS
export async function optionsMensualite(req) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get('origin')) })
}

// Rejette explicitement les autres méthodes
export async function getMensualite(req) {
  return NextResponse.json(
    { error: 'Méthode non autorisée. Utilisez POST avec { "price": 315000 }.' },
    { status: 405, headers: corsHeaders(req.headers.get('origin')) }
  )
}
