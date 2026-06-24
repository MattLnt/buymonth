import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/settings'
import { calculMensualite } from '@/lib/calcul'
import { verifyApiKey, getAllowedOrigin, getClientIp } from '@/lib/apiSecurity'
import { rateLimit } from '@/lib/rateLimit'

// Bornes réalistes pour le prix d'un bien (anti-valeurs absurdes)
const PRIX_MIN = 1000
const PRIX_MAX = 100_000_000

// Limites de débit
const RL_LIMIT = 30        // 30 requêtes
const RL_WINDOW = 60_000   // par minute et par IP

function corsHeaders(origin) {
  const allowed = getAllowedOrigin(origin)
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    'Vary': 'Origin',
  }
  if (allowed) headers['Access-Control-Allow-Origin'] = allowed
  return headers
}

// Pré-vol CORS
export async function OPTIONS(req) {
  const origin = req.headers.get('origin')
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
}

export async function POST(req) {
  const origin = req.headers.get('origin')
  const headers = corsHeaders(origin)

  try {
    // ── 1. Rate limiting par IP ──
    const ip = getClientIp(req)
    const rl = rateLimit(ip, RL_LIMIT, RL_WINDOW)
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Réessayez plus tard.' },
        { status: 429, headers: { ...headers, 'Retry-After': String(rl.retryAfter) } }
      )
    }

    // ── 2. API configurée ? ──
    if (!process.env.VIZION_API_KEY) {
      return NextResponse.json({ error: 'API non configurée.' }, { status: 500, headers })
    }

    // ── 3. Authentification (comparaison en temps constant) ──
    const apiKey = req.headers.get('x-api-key')
    if (!verifyApiKey(apiKey)) {
      console.warn(`[VIZION] Tentative non autorisée — IP: ${ip} — origin: ${origin || 'n/a'}`)
      return NextResponse.json({ error: 'Clé API invalide ou manquante.' }, { status: 401, headers })
    }

    // ── 4. Origine autorisée (si l'appel vient d'un navigateur) ──
    // Si une origine est présente mais non autorisée, on refuse.
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

    const prix = Number(body?.prix)
    if (!Number.isFinite(prix) || prix <= 0) {
      return NextResponse.json({ error: 'Le champ "prix" est requis et doit être un nombre positif.' }, { status: 400, headers })
    }
    if (prix < PRIX_MIN || prix > PRIX_MAX) {
      return NextResponse.json({ error: `Le prix doit être compris entre ${PRIX_MIN} et ${PRIX_MAX} €.` }, { status: 400, headers })
    }

    // ── 6. Calcul ──
    const s = await getSettings()
    const mensualite = calculMensualite(prix, {
      apportPct: s.apportPct,
      tauxAnnuel: s.tauxAnnuel,
      dureeMois: s.dureeMois,
    })

    const apport = Math.round(prix * s.apportPct)
    const tauxPct = (s.tauxAnnuel * 100).toFixed(2).replace('.', ',')
    const dureeAns = Math.round(s.dureeMois / 12)

    return NextResponse.json({
      mensualite,
      prixTotal: prix,
      apport,
      apportPct: s.apportPct,
      dureeMois: s.dureeMois,
      tauxAnnuel: s.tauxAnnuel,
      devise: 'EUR',
      mention: `Simulation indicative (apport ${Math.round(s.apportPct * 100)} %, ${dureeAns} ans, TAEG ${tauxPct} % hors assurances). Sous réserve d'acceptation du crédit par l'organisme prêteur. JG Management — FSMA 1021.366.349`,
    }, { headers })
  } catch (e) {
    console.error('[VIZION] Erreur serveur :', e?.message)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500, headers })
  }
}

// Rejette explicitement les autres méthodes
export async function GET(req) {
  return NextResponse.json({ error: 'Méthode non autorisée.' }, { status: 405, headers: corsHeaders(req.headers.get('origin')) })
}