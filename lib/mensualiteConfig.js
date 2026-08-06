import { calculMensualite } from "./calcul";

/*
 * Hypothèses de simulation — fournies et validées par BuyMonth Finance (agréé FSMA).
 * ⚠️ Le TAEG est un PLACEHOLDER : à confirmer par écrit par BuyMonth Finance
 *    avant toute mise en production (obligation FSMA).
 *
 * V1 : estimation « hors frais » (hors TVA, frais de notaire, etc.).
 *      Le moteur régime fiscal (TVA 21/6/existant) est prévu en phase 2.
 */
export const MENSUALITE_CONFIG = {
  apportPct: 0.10, // 10 %
  tauxAnnuel: 0.0345, // taux débiteur annuel fixe
  taegAnnuel: 0.0425, // TAEG — À CONFIRMER par BuyMonth Finance
  dureeMois: 300, // 25 ans
  horsFrais: true,
};

export const AVERTISSEMENT_LEGAL =
  "Attention, emprunter de l'argent coûte aussi de l'argent.";

export const NOTE_HORS_FRAIS =
  "Estimation indicative hors frais (hors TVA, droits et frais de notaire), sur base d'hypothèses validées par BuyMonth Finance.";

/* Construit l'exemple représentatif légal pour un bien donné */
export function exempleRepresentatif(prix, cfg = MENSUALITE_CONFIG) {
  const apport = Math.round(prix * cfg.apportPct);
  const capital = Math.round(prix - apport);
  const mensualite = calculMensualite(prix, cfg);
  const montantTotalDu = mensualite * cfg.dureeMois;
  return {
    apport,
    capital,
    dureeMois: cfg.dureeMois,
    dureeAns: Math.round(cfg.dureeMois / 12),
    tauxAnnuel: cfg.tauxAnnuel,
    taegAnnuel: cfg.taegAnnuel,
    mensualite,
    montantTotalDu,
  };
}