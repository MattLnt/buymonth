import { calculMensualite } from "./calcul";
import { prixDecaisse } from "./regime";

/*
 * Hypothèses de simulation.
 * La SOURCE DE VÉRITÉ est la table Settings, modifiable dans l'admin (Paramètres) sans redéploiement :
 * apport, taux débiteur, TAEG, durée par défaut. Les écrans reçoivent ces valeurs du serveur
 * (getConfigMensualite dans lib/settings.js). Les valeurs ci-dessous ne servent que de repli.
 */
export const MENSUALITE_CONFIG = {
  apportPct: 0.10, // 10 %
  tauxAnnuel: 0.0395, // taux débiteur annuel fixe — à confirmer par BuyMonth Finance
  taegAnnuel: 0.0425, // TAEG — à confirmer par BuyMonth Finance
  dureeMois: 360, // 30 ans (référence des badges)
};

export const AVERTISSEMENT_LEGAL =
  "Attention, emprunter de l'argent coûte aussi de l'argent.";

// Mention imposée depuis l'intégration de la TVA dans le calcul (note du 21/09/2026, point 4)
export const NOTE_ESTIMATION =
  "Estimation indicative, hors droits d'enregistrement et frais de notaire.";

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

/* Construit l'exemple représentatif légal pour un bien donné (prix encodé + régime) */
export function exempleRepresentatif(prixTotal, regime = null, cfg = MENSUALITE_CONFIG) {
  const c = { ...MENSUALITE_CONFIG, ...cfg };
  const prix = prixDecaisse(prixTotal, regime);
  const apport = Math.round(prix * c.apportPct);
  const capital = Math.round(prix - apport);
  const mensualite = calculMensualite(prix, c);
  const montantTotalDu = mensualite * c.dureeMois;
  return {
    prixDecaisse: prix,
    apport,
    capital,
    dureeMois: c.dureeMois,
    dureeAns: Math.round(c.dureeMois / 12),
    tauxAnnuel: c.tauxAnnuel,
    taegAnnuel: c.taegAnnuel,
    mensualite,
    montantTotalDu,
  };
}
