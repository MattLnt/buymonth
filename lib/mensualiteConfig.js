import { calculMensualite } from "./calcul";

/*
 * Hypothèses de simulation — fournies et validées par BuyMonth Finance.
 * ⚠️ Le TAEG est un PLACEHOLDER : à confirmer par écrit par BuyMonth Finance
 *    avant toute mise en production.
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
  "Estimation indicative hors frais (hors TVA, droits et frais de notaire). Hypothèses fournies par BuyMonth Finance, nom commercial de JG Management SRL, intermédiaire de crédit.";

/*
 * Identification du partenaire crédit — SEULE mention autorisée à côté d'un montant.
 * Art. VII.65 §2 et VII.123 §2 CDE : la publicité pour un crédit ne peut faire référence
 * à l'inscription de l'intermédiaire (numéro FSMA, « agréé », « inscrit »…).
 * Le numéro FSMA figure uniquement sur /mentions-legales, /confidentialite et
 * l'écran précontractuel du tunnel.
 */
export const IDENTIFICATION_FINANCE =
  "Hypothèses fournies par BuyMonth Finance, nom commercial de JG Management SRL, intermédiaire de crédit.";

// Version courte pour les pieds de page / copyright
export const IDENTIFICATION_FINANCE_COURTE =
  "BuyMonth Finance, nom commercial de JG Management SRL, intermédiaire de crédit";

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
