"use client";
import Link from "next/link";
import { useLang } from "@/app/components/i18n/LangProvider";

export default function Hero() {
  const { t } = useLang();
  return (
    <header className="hero">
      <span className="blob b1" />
      <span className="blob b2" />
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow">{t("Plateforme marketing pour promoteurs", "Marketingplatform voor projectontwikkelaars")}</span>
          <h1>
            {t("Présentez vos biens en ", "Toon uw panden in ")}
            <span className="hl">{t("mensualités", "maandbedragen")}</span>
            {t(", pas en prix globaux.", ", niet in totaalprijzen.")}
          </h1>
          <p>
            {t(
              "BuyMonth transforme chaque prix de vente en une estimation mensuelle claire, affichée sur vos supports — badges, widgets, QR codes — et amène à vos équipes des visiteurs qui ne se demandent plus s'ils peuvent se le permettre.",
              "BuyMonth zet elke verkoopprijs om in een duidelijke maandelijkse raming, getoond op uw eigen kanalen — badges, widgets, QR-codes — en brengt uw team bezoekers die zich niet langer afvragen of ze het zich kunnen veroorloven."
            )}
          </p>
          <div className="hero-cta">
            <Link className="btn btn-primary" href="/register">
              {t("Commencer →", "Starten →")}
            </Link>
            <Link className="btn btn-ghost" href="/pro/contact">
              {t("Réserver une démo", "Demo aanvragen")}
            </Link>
          </div>
          <p className="aud">
            {t("Pensé pour : ", "Bedoeld voor: ")}
            <b>{t("Promoteurs", "Projectontwikkelaars")}</b>
            {t(" · Constructeurs · Agences · Notaires · Courtiers immobiliers", " · Bouwbedrijven · Vastgoedkantoren · Notarissen · Vastgoedmakelaars")}
          </p>
        </div>

        <div className="reveal in">
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(25,59,94,0.45)",
              marginBottom: 8,
            }}
          >
            {t("Vue plateforme", "Platformweergave")}
          </div>
          <div className="dash">
            <div className="dash-top">
              <span className="hello">{t("Bonjour", "Hallo")}, Delvaux Promotions 👋</span>
              <span className="dots">
                <i />
                <i />
                <i />
              </span>
            </div>
            <div className="dash-stats">
              <div className="st">
                <b>24</b>
                <small>{t("Biens actifs", "Actieve panden")}</small>
              </div>
              <div className="st acc">
                <b>58</b>
                <small>{t("Leads reçus", "Ontvangen leads")}</small>
              </div>
              <div className="st">
                <b>{t("1 320", "1.320")}</b>
                <small>{t("Vues totales", "Totaal weergaven")}</small>
              </div>
              <div className="st acc">
                <b>{t("1 674 €", "1.674 €")}</b>
                <small>{t("Mensualité moy.", "Gem. maandbedrag")}</small>
              </div>
            </div>
            <div className="dash-bien">
              <div className="db-photo">
                <img
                  src="/biens/residence.jpg"
                  alt={t("Résidence", "Residentie")}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span className="tag">{t("Nouvelle résidence", "Nieuwe residentie")}</span>
              </div>
              <div className="db-body">
                <div className="nm">
                  {t("Résidence Les Tilleuls — App. B2.03", "Residentie Les Tilleuls — App. B2.03")}{" "}
                  <small>{t("· 2 ch · 94 m² · terrasse sud", "· 2 slpk · 94 m² · terras op het zuiden")}</small>
                </div>
                <div className="prix">
                  {t("Prix de vente", "Verkoopprijs")}{" "}
                  <b>
                    302.500 € <span>{t("TVA 21 % comprise", "incl. 21 % btw")}</span>
                  </b>{" "}
                  <small>{t("soit 250.000 € HTVA", "of 250.000 € excl. btw")}</small>
                </div>
                <div className="reframe" style={{ marginTop: 8 }}>
                  <div className="badge" style={{ flex: 1 }}>
                    <div className="cal">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <span key={i} />
                      ))}
                    </div>
                    <div className="val">
                      <small className="apd">{t("À partir de", "Vanaf")}</small>
                      <b>
                        1.282 €<span>{t("/mois*", "/maand*")}</span>
                      </b>
                    </div>
                  </div>
                </div>
                <p className="disclaimer">
                  {t(
                    "* Attention, emprunter de l'argent coûte aussi de l'argent. Estimation indicative, hors droits d'enregistrement et frais de notaire. Exemple représentatif : bien de 302.500 € TVA 21 % comprise, apport de 10 %, durée de 30 ans, taux débiteur de 3,95 %, TAEG de 4,25 %, mensualité de 1.282 €. Sous réserve d'acceptation du dossier. Hypothèses fournies par BuyMonth Finance, nom commercial de JG Management SRL, intermédiaire de crédit.",
                    "* Let op, geld lenen kost ook geld. Indicatieve raming, exclusief registratierechten en notariskosten. Representatief voorbeeld: pand van 302.500 € incl. 21 % btw, eigen inbreng van 10 %, looptijd van 30 jaar, debetrentevoet van 3,95 %, JKP van 4,25 %, maandbedrag van 1.282 €. Onder voorbehoud van aanvaarding van het dossier. Hypotheses aangeleverd door BuyMonth Finance, handelsnaam van JG Management SRL, kredietbemiddelaar."
                  )}
                </p>
                <div className="mini-cta">{t("Simuler mon budget mensuel", "Bereken mijn maandbudget")}</div>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 11, color: "rgba(25,59,94,0.4)", margin: "10px 0 0", textAlign: "center", fontStyle: "italic" }}>
            {t("Illustration — interface et données fictives.", "Illustratie — fictieve interface en gegevens.")}
          </p>
        </div>
      </div>
    </header>
  );
}