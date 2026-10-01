import crypto from 'crypto'

/**
 * Compare deux chaînes en temps constant pour éviter les attaques par timing.
 * Retourne false si l'une est absente ou si les longueurs diffèrent.
 */
export function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

/**
 * Vérifie une clé API reçue contre la/les clé(s) autorisée(s).
 * Supporte plusieurs clés séparées par des virgules dans VIZION_API_KEY.
 */
export function verifyApiKey(received) {
  if (!received) return false
  const raw = process.env.VIZION_API_KEY || ''
  if (!raw) return false
  const keys = raw.split(',').map((k) => k.trim()).filter(Boolean)
  return keys.some((k) => safeCompare(received, k))
}

/**
 * Renvoie l'origine si elle est autorisée, sinon null.
 * VIZION_ALLOWED_ORIGINS = liste d'origines séparées par des virgules (ex. https://www.vizion.be).
 * Si non défini, toute origine navigateur est acceptée ('*') : la clé API et la limitation
 * de débit restent les vraies protections. Dès que le domaine du configurateur Vizion est
 * connu, le renseigner pour restreindre.
 */
export function getAllowedOrigin(requestOrigin) {
  const raw = process.env.VIZION_ALLOWED_ORIGINS || ''
  if (!raw) return '*'
  const allowed = raw.split(',').map((o) => o.trim()).filter(Boolean)
  if (allowed.includes('*')) return '*'
  if (requestOrigin && allowed.includes(requestOrigin)) return requestOrigin
  return null
}

/**
 * Extrait l'IP du client depuis les en-têtes (Vercel/proxy).
 */
export function getClientIp(req) {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}