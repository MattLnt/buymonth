// Script one-shot : passage au régime fiscal (lot « TVA simplifiée + 30 ans », 30/09/2026). Idempotent.
//
//   node prisma/regime-fiscal.js
//
// 1. Paramètres admin : durée 30 ans, taux débiteur 3,95 %, TAEG 4,25 % (valeurs du Dossier
//    développeur, Partie 7 — « à confirmer par BuyMonth Finance », modifiables dans l'admin).
// 2. Biens fictifs de démonstration : régime TVA 21 % (projets neufs). Le bien vedette
//    « Résidence Les Tilleuls — App. B2.03 » passe à 250.000 € HTVA pour coller à la maquette /pro
//    (302.500 € TVAC → 1.290 €/mois).
// 3. Recalcul de toutes les mensualités sur le prix décaissé.

require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function prixDecaisse(prixTotal, regime) {
  const coef = { TVA_21: 1.21, TVA_6: 1.06, ENREGISTREMENT: 1 }[regime] ?? 1
  return Math.round(prixTotal * coef)
}
function calculMensualite(prix, { apportPct, tauxAnnuel, dureeMois }) {
  const capital = prix * (1 - apportPct)
  const i = Math.pow(1 + tauxAnnuel, 1 / 12) - 1
  const m = capital * i / (1 - Math.pow(1 + i, -dureeMois))
  return Math.ceil(m / 10) * 10
}

async function main() {
  // 1. Paramètres
  const s = await prisma.settings.upsert({
    where: { id: 'default' },
    create: { id: 'default', apportPct: 0.10, tauxAnnuel: 0.0395, taegAnnuel: 0.0425, dureeMois: 360 },
    update: { tauxAnnuel: 0.0395, taegAnnuel: 0.0425, dureeMois: 360 },
  })
  console.log('Paramètres :', `apport ${s.apportPct * 100} %`, `taux ${s.tauxAnnuel * 100} %`, `TAEG ${s.taegAnnuel * 100} %`, `${s.dureeMois / 12} ans`)

  // 2. Régime des biens de démonstration + prix du bien vedette
  const demos = await prisma.bien.updateMany({ where: { demo: true, regime: null }, data: { regime: 'TVA_21' } })
  console.log(`Régime TVA 21 % appliqué à ${demos.count} bien(s) de démonstration`)
  await prisma.bien.updateMany({ where: { id: 'cmtlh2ovm0001dm5wjbg7r0ul' }, data: { prixTotal: 250000 } })

  // 3. Recalcul
  const cfg = { apportPct: s.apportPct, tauxAnnuel: s.tauxAnnuel, dureeMois: s.dureeMois }
  const biens = await prisma.bien.findMany({ select: { id: true, titre: true, prixTotal: true, regime: true } })
  for (const b of biens) {
    const mensualite = calculMensualite(prixDecaisse(b.prixTotal, b.regime), cfg)
    await prisma.bien.update({ where: { id: b.id }, data: { mensualite } })
    console.log(`${b.titre} — ${b.prixTotal.toLocaleString('fr-BE')} € (${b.regime || 'sans régime'}) → ${prixDecaisse(b.prixTotal, b.regime).toLocaleString('fr-BE')} € → ${mensualite} €/mois`)
  }
  const sansRegime = biens.filter((b) => !b.regime)
  if (sansRegime.length) console.log('Biens sans régime (à compléter par le promoteur) :', sansRegime.map((b) => b.titre))
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
