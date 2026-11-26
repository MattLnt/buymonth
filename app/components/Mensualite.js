"use client";

import { useState } from "react";
import {
  MENSUALITE_CONFIG,
  avertissementLegal,
  noteEstimation,
  identificationFinance,
  exempleRepresentatif,
  texteExempleRepresentatif,
} from "@/lib/mensualiteConfig";
import { phraseRegime } from "@/lib/regime";
import { locale } from "@/lib/i18n/config";
import { useLang } from "@/app/components/i18n/LangProvider";

const eur = (n, lang) =>
  new Intl.NumberFormat(locale(lang), { maximumFractionDigits: 0 }).format(n) + " €";
const pct = (v, lang) =>
  new Intl.NumberFormat(locale(lang), { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    v * 100
  ) + " %";

/*
 * <Mensualite> — affichage réutilisable d'un montant en €/mois.
 * L'avertissement légal est INDISSOCIABLE du montant (jamais l'un sans l'autre).
 * Le montant et sa mention sortent du même calcul (exempleRepresentatif).
 *
 * props :
 *   prixTotal   (number, requis) — prix ENCODÉ par le promoteur (HTVA pour le neuf)
 *   regime      "TVA_21" | "TVA_6" | "ENREGISTREMENT" | null — régime fiscal du bien
 *   cfg         hypothèses venant des paramètres admin (apportPct, tauxAnnuel, taegAnnuel, dureeMois)
 *   variant     "inline" | "card" | "badge" | "hero"   (défaut "inline")
 *   tone        "light" | "dark"   (défaut "light" ; "dark" = sur fond sombre)
 *   prefix      texte avant le montant (défaut "À partir de" / "Vanaf")
 *   showExemple bool — affiche l'icône i + détail des hypothèses (défaut true)
 *   exempleVisible bool — bloc « Exemple représentatif » toujours visible sous le montant (défaut true)
 *                    Obligatoire dès qu'un €/mois apparaît (SPF Économie : « le renvoi ne suffit pas »).
 */
export default function Mensualite({
  prixTotal,
  regime = null,
  cfg = MENSUALITE_CONFIG,
  variant = "inline",
  tone = "light",
  prefix,
  showExemple = true,
  exempleVisible = true,
  avertissement = true,
}) {
  const [open, setOpen] = useState(false);
  const { lang, t } = useLang();
  const prefixTxt = prefix === undefined ? t("À partir de", "Vanaf") : prefix;

  if (!prixTotal || prixTotal <= 0) return null;

  const ex = exempleRepresentatif(prixTotal, regime, cfg);
  const phrase = phraseRegime(regime, lang);
  const texteExemple = texteExempleRepresentatif(prixTotal, regime, cfg, lang);

  return (
    <span className={`mens mens--${variant} mens--${tone}`}>
      <span className="mens-line">
        {prefixTxt && <small className="mens-prefix">{prefixTxt}</small>}
        <b className="mens-amount">
          {eur(ex.mensualite, lang)}
          <span className="mens-unit">{t("/mois*", "/maand*")}</span>
        </b>

        {showExemple && (
          <button
            type="button"
            className="mens-info"
            aria-label={t("Voir l'exemple représentatif", "Representatief voorbeeld bekijken")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            i
          </button>
        )}
      </span>

      {/* Avertissement légal affiché avec le montant (retiré sur /simulateur à la demande du client, test Vizion du 16/11, point 4) */}
      <span className="mens-warn">
        * {avertissement && `${avertissementLegal(lang)} `}{noteEstimation(lang)}
      </span>

      {/* Exemple représentatif — bloc distinct, visible en permanence (ordinateur et mobile) */}
      {exempleVisible && (
        <span className="mens-exemple-visible" role="note">
          {texteExemple} {identificationFinance(lang)}
        </span>
      )}

      {showExemple && open && (
        <span className="mens-exemple" role="note">
          <b>{t("Exemple représentatif", "Representatief voorbeeld")}</b>
          <span className="mens-ex-row">
            <span>{t("Prix du bien", "Prijs van het pand")}{phrase ? ` (${phrase})` : ""}</span>
            <span>{eur(ex.prixDecaisse, lang)}</span>
          </span>
          <span className="mens-ex-row">
            <span>{t("Apport pris en compte", "Eigen inbreng in rekening gebracht")}</span>
            <span>{eur(ex.apport, lang)}</span>
          </span>
          <span className="mens-ex-row">
            <span>{t("Capital emprunté", "Geleend kapitaal")}</span>
            <span>{eur(ex.capital, lang)}</span>
          </span>
          <span className="mens-ex-row">
            <span>{t("Durée", "Looptijd")}</span>
            <span>
              {t(`${ex.dureeMois} mois (${ex.dureeAns} ans)`, `${ex.dureeMois} maanden (${ex.dureeAns} jaar)`)}
            </span>
          </span>
          <span className="mens-ex-row">
            <span>{t("Taux débiteur annuel fixe", "Vaste jaarlijkse debetrentevoet")}</span>
            <span>{pct(ex.tauxAnnuel, lang)}</span>
          </span>
          <span className="mens-ex-row">
            <span>{t("TAEG", "JKP")}</span>
            <span>{pct(ex.taegAnnuel, lang)}</span>
          </span>
          <span className="mens-ex-row">
            <span>{t(`Mensualité (${ex.dureeMois} mensualités)`, `Maandbedrag (${ex.dureeMois} maandbedragen)`)}</span>
            <span>{eur(ex.mensualite, lang)}</span>
          </span>
          <span className="mens-ex-row">
            <span>{t("Montant total dû", "Totaal verschuldigd bedrag")}</span>
            <span>{eur(ex.montantTotalDu, lang)}</span>
          </span>
          <span className="mens-ex-note">
            {t(
              "Sous réserve d'acceptation du dossier. Les hypothèses ne constituent pas une offre de crédit.",
              "Onder voorbehoud van aanvaarding van het dossier. De hypotheses vormen geen kredietaanbod."
            )}
          </span>
        </span>
      )}

      <style jsx>{`
        .mens {
          display: inline-flex;
          flex-direction: column;
          gap: 4px;
          position: relative;
          font-family: var(--font-texte);
        }
        .mens-line {
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          flex-wrap: wrap;
        }
        .mens-prefix {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--green-d);
        }
        .mens-amount {
          font-weight: 800;
          color: var(--navy);
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .mens-unit {
          font-size: 0.62em;
          font-weight: 600;
          color: var(--muted);
        }
        .mens-info {
          flex: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid var(--green);
          background: transparent;
          color: var(--green-d);
          font-size: 0.62rem;
          font-weight: 700;
          font-style: italic;
          line-height: 1;
          cursor: pointer;
          align-self: center;
        }
        .mens-info:hover {
          background: var(--green);
          color: #fff;
        }
        .mens-warn {
          font-size: 0.6rem;
          line-height: 1.35;
          color: #8b98a3;
          max-width: 44ch;
        }
        .mens-exemple-visible {
          display: block;
          margin-top: 2px;
          padding: 8px 10px;
          border-radius: 8px;
          background: rgba(25, 59, 94, 0.05);
          border: 1px solid rgba(25, 59, 94, 0.1);
          font-size: 0.64rem;
          line-height: 1.45;
          color: #5a6b7d;
          max-width: 44ch;
        }
        .mens-exemple {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-top: 6px;
          padding: 12px 14px;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 10px;
          box-shadow: var(--shadow);
          font-size: 0.74rem;
          color: var(--ink);
          max-width: 320px;
        }
        .mens-exemple > b {
          color: var(--navy);
          font-size: 0.78rem;
          margin-bottom: 2px;
        }
        .mens-ex-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: var(--muted);
        }
        .mens-ex-row span:last-child {
          color: var(--ink);
          font-weight: 600;
          white-space: nowrap;
        }
        .mens-ex-note {
          margin-top: 4px;
          font-size: 0.66rem;
          line-height: 1.35;
          color: #8b98a3;
        }

        /* tailles selon le contexte */
        .mens--inline .mens-amount {
          font-size: 1.1rem;
        }
        .mens--card .mens-amount {
          font-size: 1.6rem;
        }
        .mens--badge .mens-amount {
          font-size: 1.5rem;
        }
        .mens--hero .mens-amount {
          font-size: 2.2rem;
        }

        /* fond sombre */
        .mens--dark .mens-prefix {
          color: var(--green);
        }
        .mens--dark .mens-amount {
          color: var(--green);
        }
        .mens--dark .mens-unit {
          color: rgba(255, 255, 255, 0.6);
        }
        .mens--dark .mens-warn {
          color: rgba(255, 255, 255, 0.55);
        }
        .mens--dark .mens-exemple-visible {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.14);
          color: rgba(255, 255, 255, 0.72);
        }
        .mens--dark .mens-info {
          border-color: rgba(255, 255, 255, 0.4);
          color: #fff;
        }
        .mens--dark .mens-info:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
        }
      `}</style>
    </span>
  );
}
