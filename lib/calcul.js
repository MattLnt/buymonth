// Paramètres par défaut BuyMonth (apport 10%, taux 3,45%, 25 ans)
// Validés sur le badge officiel : 215 000 € => 963 €/mois
const DEFAUTS = { apportPct: 0.10, tauxAnnuel: 0.0345, dureeMois: 300 };

export function calculMensualite(prixTotal, params = DEFAUTS) {
  const { apportPct, tauxAnnuel, dureeMois } = { ...DEFAUTS, ...params };
  const tauxMensuel = tauxAnnuel / 12;
  const capital = prixTotal * (1 - apportPct);
  const m = capital * tauxMensuel / (1 - Math.pow(1 + tauxMensuel, -dureeMois));
  return Math.round(m);
}