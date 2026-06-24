// Rate limiter simple en mémoire (par IP).
// Note : en environnement serverless multi-instance (Vercel), le compteur
// n'est pas partagé entre instances. Pour un rate limiting strict en prod,
// utiliser Upstash Redis. Ceci protège déjà contre le spam basique.

const hits = new Map() // ip -> { count, resetAt }

// Nettoyage périodique pour éviter que la Map grossisse indéfiniment
let lastCleanup = Date.now()
function cleanup(now) {
  if (now - lastCleanup < 60_000) return
  lastCleanup = now
  for (const [ip, data] of hits.entries()) {
    if (data.resetAt < now) hits.delete(ip)
  }
}

/**
 * Vérifie et incrémente le compteur pour une IP.
 * @param {string} ip
 * @param {number} limit  nombre max de requêtes par fenêtre
 * @param {number} windowMs durée de la fenêtre en ms
 * @returns {{ ok: boolean, remaining: number, retryAfter: number }}
 */
export function rateLimit(ip, limit = 30, windowMs = 60_000) {
  const now = Date.now()
  cleanup(now)

  const entry = hits.get(ip)

  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1, retryAfter: 0 }
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count++
  return { ok: true, remaining: limit - entry.count, retryAfter: 0 }
}