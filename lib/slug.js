import { prisma } from './prisma'

// Transforme une chaîne en slug URL : minuscules, sans accents, tirets.
export function slugify(str) {
  return (str || '')
    .toString()
    .normalize('NFD')                   // décompose les accents
    .replace(/[\u0300-\u036f]/g, '')    // retire les diacritiques
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')        // tout ce qui n'est pas alphanumérique → tiret
    .replace(/^-+|-+$/g, '')            // retire les tirets en début/fin
    .slice(0, 60)                       // longueur raisonnable
}

// Génère un slug UNIQUE pour un client (ajoute -2, -3… en cas de collision).
// excludeId : id du client courant (en édition, pour ne pas se compter soi-même).
export async function genererSlugUnique(societe, excludeId = null) {
  const base = slugify(societe) || 'agence'
  let slug = base
  let n = 1

  while (true) {
    const existant = await prisma.client.findUnique({ where: { slug } })
    if (!existant || existant.id === excludeId) return slug
    n += 1
    slug = `${base}-${n}`
  }
}