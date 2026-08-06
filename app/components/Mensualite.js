"use client";

import { useState } from "react";
import { calculMensualite } from "@/lib/calcul";
import {
  MENSUALITE_CONFIG,
  AVERTISSEMENT_LEGAL,
  NOTE_HORS_FRAIS,
  exempleRepresentatif,
} from "@/lib/mensualiteConfig";

const eur = (n) =>
  new Intl.NumberFormat("fr-BE", { maximumFractionDigits: 0 }).format(n) + " €";
const pct = (t) =>
  new Intl.NumberFormat("fr-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    t * 100
  ) + " %";

/*
 * <Mensualite> — affichage réutilisable d'un montant en €/mois.
 * L'avertissement légal est INDISSOCIABLE du montant (jamais l'un sans l'autre).
 *
 * props :
 *   prix        (number, requis) — prix du bien servant au calcul
 *   variant     "inline" | "card" | "badge" | "hero"   (défaut "inline")
 *   tone        "light" | "dark"   (défaut "light" ; "dark" = sur fond sombre)
 *   prefix      texte avant le montant (défaut "À partir de")
 *   showExemple bool — affiche l'icône i + infobulle (défaut true)
 *   cfg         hypothèses (défaut MENSUALITE_CONFIG)
 */
export default function Mensualite({
  prix,
  variant = "inline",
  tone = "light",
  prefix = "À partir de",
  showExemple = true,
  cfg = MENSUALITE_CONFIG,
}) {
  const [open, setOpen] = useState(false);

  if (!prix || prix <= 0) return null;

  const mensualite = calculMensualite(prix, cfg);
  const ex = exempleRepresentatif(prix, cfg);

  return (
    <span className={`mens mens--${variant} mens--${tone}`}>
      <span className="mens-line">
        {prefix && <small className="mens-prefix">{prefix}</small>}
        <b className="mens-amount">
          {eur(mensualite)}
          <span className="mens-unit">/mois*</span>
        </b>

        {showExemple && (
          <button
            type="button"
            className="mens-info"
            aria-label="Voir l'exemple représentatif"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            i
          </button>
        )}
      </span>

      {/* Avertissement légal — toujours affiché avec le montant */}
      <span className="mens-warn">
        * {AVERTISSEMENT_LEGAL} {NOTE_HORS_FRAIS}
      </span>

      {showExemple && open && (
        <span className="mens-exemple" role="note">
          <b>Exemple représentatif</b>
          <span className="mens-ex-row">
            <span>Capital emprunté</span>
            <span>{eur(ex.capital)}</span>
          </span>
          <span className="mens-ex-row">
            <span>Apport pris en compte</span>
            <span>{eur(ex.apport)}</span>
          </span>
          <span className="mens-ex-row">
            <span>Durée</span>
            <span>
              {ex.dureeMois} mois ({ex.dureeAns} ans)
            </span>
          </span>
          <span className="mens-ex-row">
            <span>Taux débiteur annuel fixe</span>
            <span>{pct(ex.tauxAnnuel)}</span>
          </span>
          <span className="mens-ex-row">
            <span>TAEG</span>
            <span>{pct(ex.taegAnnuel)}</span>
          </span>
          <span className="mens-ex-row">
            <span>Mensualité</span>
            <span>{eur(ex.mensualite)}</span>
          </span>
          <span className="mens-ex-row">
            <span>Montant total dû</span>
            <span>{eur(ex.montantTotalDu)}</span>
          </span>
          <span className="mens-ex-note">
            Estimation indicative. Le crédit est étudié par BuyMonth Finance (agréé FSMA). Les
            hypothèses ne constituent pas une offre de crédit.
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