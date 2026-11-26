"use client";
import { useLang } from "@/app/components/i18n/LangProvider";

export default function Tarif() {
  const { t } = useLang();
  return (
    <section className="pad tint" id="tarif">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">{t("Modèle tarifaire", "Tariefmodel")}</span>
          <h2>{t("Deux formules, un tarif qui suit votre portefeuille.", "Twee formules, een tarief dat uw portefeuille volgt.")}</h2>
          <p className="lead">
            {t("Vous ne payez que vos biens actifs — soit à partir de ", "U betaalt enkel voor uw actieve panden — al vanaf ")}
            <b style={{ color: "var(--navy)" }}>{t("1,30 € par jour et par bien", "1,30 € per dag per pand")}</b>
            {t(". Et aucune commission sur vos ventes.", ". En geen commissie op uw verkopen.")}
          </p>
        </div>
        <div className="equation reveal">
          <div className="eq-card setup">
            <span className="num">1</span>
            <div className="lbl">{t("Mise en service — une seule fois", "Opstart — eenmalig")}</div>
            <div className="amt">
              1.490 € <small>{t("HTVA", "excl. btw")}</small>
            </div>
            <p>
              {t(
                "Paramétrage du compte, personnalisation, formation et accompagnement — identique pour les deux formules.",
                "Instellen van de account, personalisatie, opleiding en begeleiding — identiek voor beide formules."
              )}
            </p>
          </div>
          <div className="eq-plus">+</div>
          <div className="eq-card abo">
            <span className="num">2</span>
            <div className="lbl">{t("Abonnement mensuel", "Maandabonnement")}</div>
            <div className="amt">
              39 € <small>{t("ou", "of")}</small> 45 € <small>{t("/ bien actif / mois", "/ actief pand / maand")}</small>
            </div>
            <p>
              {t(
                "Selon la formule choisie, Pro ou Pro+. Le décompte des biens actifs est revu chaque mois.",
                "Volgens de gekozen formule, Pro of Pro+. Het aantal actieve panden wordt elke maand herbekeken."
              )}
            </p>
          </div>
        </div>
        <div className="plans">
          <div className="plan reveal">
            <h3>BuyMonth Pro</h3>
            <p className="pdesc">
              {t(
                "L'essentiel pour une présence efficace : intégration, visibilité et suivi des leads.",
                "De basis voor een doeltreffende aanwezigheid: integratie, zichtbaarheid en opvolging van leads."
              )}
            </p>
            <div className="price">
              <b>39 €</b> <span>{t("HTVA / bien actif / mois", "excl. btw / actief pand / maand")}</span>
            </div>
            <ul>
              <li>{t("Plateforme de gestion du portefeuille", "Platform voor portefeuillebeheer")}</li>
              <li>{t("Badges, widgets & QR codes illimités", "Onbeperkt badges, widgets & QR-codes")}</li>
              <li>{t("Pages de simulation dédiées", "Eigen simulatiepagina's")}</li>
              <li>{t("Tableau de bord & statistiques", "Dashboard & statistieken")}</li>
              <li>{t("Diffusion sur la vitrine publique", "Publicatie op de publieke etalage")}</li>
              <li>{t("Hébergement, maintenance & support", "Hosting, onderhoud & support")}</li>
            </ul>
          </div>
          <div className="plan plus reveal">
            <h3>BuyMonth Pro+</h3>
            <p className="pdesc">
              {t(
                "Tout Pro, plus la personnalisation et la délégation complète de la gestion.",
                "Alles van Pro, plus personalisatie en volledige uitbesteding van het beheer."
              )}
            </p>
            <div className="price">
              <b>45 €</b> <span>{t("HTVA / bien actif / mois", "excl. btw / actief pand / maand")}</span>
            </div>
            <ul>
              <li>{t("Tous les services BuyMonth Pro", "Alle diensten van BuyMonth Pro")}</li>
              <li className="hl">{t("Marque blanche : badges & widgets à vos couleurs", "White label: badges & widgets in uw kleuren")}</li>
              <li className="hl">{t("Encodage et mises à jour pris en charge par BuyMonth", "Invoer en updates verzorgd door BuyMonth")}</li>
              <li className="hl">{t("Mise en avant prioritaire sur la vitrine", "Voorrangsplaats op de etalage")}</li>
            </ul>
          </div>
        </div>
        <div className="pnote pnote-full reveal">
          <b>{t("Vous ne payez que vos biens actifs", "U betaalt enkel voor uw actieve panden")}</b>
          {t(
            "Le décompte est revu chaque mois : la facturation suit votre portefeuille, et un bien vendu sort automatiquement du décompte. Portefeuilles de plus de 125 biens : offre sur mesure. Abonnement souscrit pour 12 mois, avec une facturation mensuelle minimale garantie définie au contrat.",
            "De telling wordt elke maand herbekeken: de facturatie volgt uw portefeuille, en een verkocht pand valt automatisch uit de telling. Portefeuilles van meer dan 125 panden: offerte op maat. Abonnement voor 12 maanden, met een gegarandeerde minimale maandelijkse facturatie zoals bepaald in het contract."
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <a className="btn btn-primary" href="/calculateur" target="_blank" rel="noopener noreferrer">
            {t("Calculer votre retour sur investissement", "Bereken uw return on investment")}
          </a>
        </div>
      </div>
    </section>
  );
}
