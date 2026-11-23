import { calculMensualite } from "./calcul";
import { prixDecaisse, phraseRegime } from "./regime";

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
 * Le numéro FSMA figure uniquement sur /mentions-legales et /confidentialite
 * (retiré de l'écran du tunnel le 19/11/2026, test Vizion point 4).
 */
export const IDENTIFICATION_FINANCE =
  "Hypothèses fournies par BuyMonth Finance, nom commercial de JG Management SRL, intermédiaire de crédit.";

// Version courte pour les pieds de page / copyright
export const IDENTIFICATION_FINANCE_COURTE =
  "BuyMonth Finance, nom commercial de JG Management SRL, intermédiaire de crédit";

// Mêmes textes dans la langue voulue (les constantes FR ci-dessus restent pour les appelants existants)
export const avertissementLegal = (lang = "fr") =>
  lang === "nl" ? "Let op, geld lenen kost ook geld." : AVERTISSEMENT_LEGAL;
export const noteEstimation = (lang = "fr") =>
  lang === "nl" ? "Indicatieve raming, exclusief registratierechten en notariskosten." : NOTE_ESTIMATION;
export const identificationFinance = (lang = "fr") =>
  lang === "nl"
    ? "Hypotheses aangeleverd door BuyMonth Finance, handelsnaam van JG Management SRL, kredietbemiddelaar."
    : IDENTIFICATION_FINANCE;
export const identificationFinanceCourte = (lang = "fr") =>
  lang === "nl"
    ? "BuyMonth Finance, handelsnaam van JG Management SRL, kredietbemiddelaar"
    : IDENTIFICATION_FINANCE_COURTE;

// Montants : même rendu en FR et en NL (point comme séparateur de milliers)
const fmtEur = (n) => new Intl.NumberFormat("fr-BE", { maximumFractionDigits: 0 }).format(n).replace(/\u202f|\u00a0/g, ".") + " €";
const fmtPct = (t) => new Intl.NumberFormat("fr-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(t * 100) + " %";

/*
 * Texte de l'exemple représentatif (niveau 2 du système de textes du 19/08, section D),
 * affiché en permanence sous chaque montant. Produit par le même calcul que le montant.
 */
export function texteExempleRepresentatif(prixTotal, regime = null, cfg = MENSUALITE_CONFIG, lang = "fr") {
  const ex = exempleRepresentatif(prixTotal, regime, cfg);
  const phrase = phraseRegime(regime, lang);
  const apport = Math.round((cfg.apportPct ?? MENSUALITE_CONFIG.apportPct) * 100);
  if (lang === "nl") {
    const pand = `pand van ${fmtEur(ex.prixDecaisse)}${phrase ? ` ${phrase}` : ""}`;
    return `Representatief voorbeeld: ${pand}, eigen inbreng van ${apport} %, looptijd van ${ex.dureeAns} jaar, debetrentevoet van ${fmtPct(ex.tauxAnnuel)}, JKP van ${fmtPct(ex.taegAnnuel)}, maandbedrag van ${fmtEur(ex.mensualite)}. Onder voorbehoud van aanvaarding van het dossier.`;
  }
  const bien = `bien de ${fmtEur(ex.prixDecaisse)}${phrase ? ` ${phrase}` : ""}`;
  return `Exemple représentatif : ${bien}, apport de ${apport} %, durée de ${ex.dureeAns} ans, taux débiteur de ${fmtPct(ex.tauxAnnuel)}, TAEG de ${fmtPct(ex.taegAnnuel)}, mensualité de ${fmtEur(ex.mensualite)}. Sous réserve d'acceptation du dossier.`;
}

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
