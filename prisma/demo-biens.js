// Script one-shot : transforme les biens de test en biens fictifs de démonstration présentables
// (point 8 de la note du 21/09/2026). Idempotent : peut être relancé sans effet de bord.
//
//   node prisma/demo-biens.js
//
// - Le promoteur de test « Promoteur Test Edited v2 » devient « Delvaux Promotions » (comme sur /pro).
// - Chaque bien de test reçoit un nom de résidence plausible, une ville cohérente avec le prix,
//   une description courte, et le flag demo = true (mention « Bien fictif, à titre d'illustration »).
// - Les photos déjà uploadées sont conservées.

require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const DELVAUX = {
  societe: 'Delvaux Promotions',
  slug: 'delvaux-promotions',
  contactNom: 'Delvaux Promotions',
  telephone: '+32 (0)474 27 26 49',
  adresse: 'Rue Lucien Poncelet 58, 4520 Wanze',
}

// id du bien → nouvelles données (prix inchangés, sauf arrondi de la villa)
const BIENS = {
  // ACTIF — 285.000 € — 2 ch — reprend le bien vedette de /pro
  cmtlh2ovm0001dm5wjbg7r0ul: {
    titre: 'Résidence Les Tilleuls — App. B2.03',
    type: 'Appartement',
    projet: 'Résidence Les Tilleuls',
    unite: 'B2.03',
    chambres: 2,
    sallesDeBain: 1,
    surface: 94,
    terrasse: 12,
    ville: 'Huy',
    province: 'Liège',
    description:
      "Appartement neuf de 2 chambres au deuxième étage d'une résidence à taille humaine, à deux pas du centre de Huy. Séjour lumineux ouvert sur une terrasse plein sud de 12 m², cuisine équipée, salle de bain avec douche à l'italienne. Chauffage par pompe à chaleur, ventilation double flux, PEB A.",
    pebClasse: 'A',
  },
  // ACTIF — 265.000 € — 3 ch — maison 3 façades
  cmsmqlbbm0001gjw2u3thty4y: {
    titre: 'Clos du Verger — Maison 3 façades',
    type: 'Maison',
    projet: 'Clos du Verger',
    unite: 'Lot 7',
    chambres: 3,
    sallesDeBain: 1,
    surface: 142,
    terrasse: 18,
    jardin: 180,
    ville: 'Wanze',
    province: 'Liège',
    description:
      "Maison neuve 3 façades dans un clos calme de 12 habitations, à 5 minutes de Huy. Rez-de-chaussée avec séjour de 38 m² et cuisine ouverte, 3 chambres à l'étage, jardin orienté sud-ouest avec terrasse. Deux emplacements de parking. Livraison clé sur porte.",
    pebClasse: 'A',
  },
  // ACTIF — 670.000 € — 5 ch — villa
  cmsnywnpj0001womeh0ahvi22: {
    titre: 'Domaine des Chênes — Villa 4 façades',
    type: 'Villa',
    projet: 'Domaine des Chênes',
    unite: 'Lot 3',
    prixTotal: 670000,
    chambres: 5,
    sallesDeBain: 2,
    surface: 268,
    terrasse: 45,
    jardin: 900,
    ville: 'Grez-Doiceau',
    province: 'Brabant wallon',
    description:
      "Villa contemporaine 4 façades sur un terrain de 12 ares, dans un domaine résidentiel arboré du Brabant wallon. Vaste pièce de vie de 70 m² avec cuisine ouverte, bureau, 5 chambres dont une suite parentale, 2 salles de bain, garage double. Panneaux photovoltaïques et pompe à chaleur.",
    pebClasse: 'A',
  },
  // HORS_LIGNE — 740.000 € — 4 ch — penthouse
  cmsmj89o400017rqpf7ujj3sv: {
    titre: 'Résidence Le Zoute — Penthouse 4 chambres',
    type: 'Appartement',
    projet: 'Résidence Le Zoute',
    unite: 'P5.01',
    chambres: 4,
    sallesDeBain: 2,
    surface: 150,
    terrasse: 60,
    ville: 'Knokke-Heist',
    province: 'Flandre-Occidentale',
    description:
      "Penthouse de 150 m² au dernier étage d'une résidence neuve à 300 m de la digue. Terrasse panoramique de 60 m² avec vue mer, 4 chambres, 2 salles de bain, cave et double emplacement en sous-sol. Finitions haut de gamme.",
    pebClasse: 'A',
  },
  // HORS_LIGNE — 265.000 € — 2 ch — appartement (copie)
  cmsmrinop0001463h99pehlc8: {
    titre: 'Résidence Les Tilleuls — App. A1.02',
    type: 'Appartement',
    projet: 'Résidence Les Tilleuls',
    unite: 'A1.02',
    chambres: 2,
    sallesDeBain: 1,
    surface: 85,
    terrasse: 8,
    ville: 'Huy',
    province: 'Liège',
    description:
      "Appartement neuf de 2 chambres au premier étage, séjour avec cuisine ouverte donnant sur une terrasse de 8 m², salle de bain, buanderie. Emplacement de parking en sous-sol. PEB A.",
    pebClasse: 'A',
  },
}

async function main() {
  // 1. Promoteur fictif
  const promoTest = await prisma.client.findFirst({
    where: { OR: [{ slug: 'promoteur-test-edited-v2' }, { slug: DELVAUX.slug }] },
  })
  if (!promoTest) throw new Error('Promoteur de test introuvable.')
  await prisma.client.update({ where: { id: promoTest.id }, data: DELVAUX })
  console.log('Promoteur →', DELVAUX.societe)

  // 2. Biens fictifs, tous rattachés à Delvaux Promotions
  for (const [id, data] of Object.entries(BIENS)) {
    const bien = await prisma.bien.findUnique({ where: { id }, select: { id: true, titre: true } })
    if (!bien) { console.warn('Bien absent, ignoré :', id); continue }
    await prisma.bien.update({ where: { id }, data: { ...data, clientId: promoTest.id, demo: true } })
    console.log(`${bien.titre} → ${data.titre}`)
  }

  // 3. Tout bien encore non flaggé est listé (à vérifier manuellement)
  const reels = await prisma.bien.findMany({ where: { demo: false }, select: { id: true, titre: true } })
  if (reels.length) console.log('Biens non démo restants :', reels)
  else console.log('Tous les biens sont flaggés démo.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
