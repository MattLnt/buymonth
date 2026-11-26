"use client";
import { useLang } from "@/app/components/i18n/LangProvider";

export default function Showcase() {
  const { t } = useLang();
  return (
    <section className="pad tint" id="vitrine">
      <div className="wrap vitrine-grid">
        <div className="reveal">
          <span className="eyebrow">{t("En plus de vos supports", "Bovenop uw eigen kanalen")}</span>
          <h2>{t("Une vitrine où les acheteurs pensent déjà en mensualités.", "Een etalage waar kopers al in maandbedragen denken.")}</h2>
          <p className="lead" style={{ marginTop: 12 }}>
            {t(
              "Vos biens sont aussi diffusés sur la vitrine BuyMonth — un canal d'acquisition supplémentaire, qui s'ajoute à votre site sans jamais le remplacer.",
              "Uw panden worden ook verspreid via de BuyMonth-etalage — een extra acquisitiekanaal dat uw website aanvult zonder die ooit te vervangen."
            )}
          </p>
          <div className="args">
            <div className="varg">
              <span className="vic">✓</span>
              <div>
                <b>{t("Une audience qui vous cherche déjà.", "Een publiek dat u al zoekt.")}</b>{" "}
                {t(
                  "Chaque visiteur de la vitrine raisonne en budget mensuel : il arrive éduqué à votre langage de vente. Et plus la vitrine s'étoffe, plus elle attire d'acheteurs — l'audience profite à chacun de vos biens.",
                  "Elke bezoeker van de etalage denkt in een maandbudget: hij spreekt al uw verkoopstaal. En hoe groter de etalage wordt, hoe meer kopers ze aantrekt — het publiek komt al uw panden ten goede."
                )}
              </div>
            </div>
            <div className="varg">
              <span className="vic">✓</span>
              <div>
                <b>{t("Vous gardez la main.", "U houdt de controle.")}</b>{" "}
                {t(
                  "Vos biens y sont diffusés par défaut, et vous pouvez demander le retrait de l'un d'eux à tout moment.",
                  "Uw panden worden er standaard op getoond, en u kunt op elk moment vragen om er een te verwijderen."
                )}
              </div>
            </div>
            <div className="varg">
              <span className="vic">✓</span>
              <div>
                <b>{t("En Pro+, vos biens passent devant.", "In Pro+ komen uw panden vooraan.")}</b>{" "}
                {t("Mise en avant prioritaire sur la vitrine, à vos couleurs.", "Voorrangsplaats op de etalage, in uw kleuren.")}
              </div>
            </div>
          </div>
        </div>
        <div className="reveal">
          <div className="vitrine-card">
            <div className="vh">
              {t("Vitrine BuyMonth", "BuyMonth-etalage")} <small>{t("Tous les biens · en €/mois", "Alle panden · in €/maand")}</small>
            </div>
            <div className="vrow hlrow">
              <span className="ph"><img src="/biens/interieur-1.jpg" alt="" /></span>
              <div className="vt">
                <b>{t("Résidence Les Tilleuls — App. B2.03", "Residentie Les Tilleuls — App. B2.03")}</b>
                <small>
                  <b>Pro+</b> · {t("2 ch", "2 slpk")} · 94 m² · Delvaux Promotions
                </small>
              </div>
              <span className="vm">
                <small>{t("À partir de", "Vanaf")}</small>
                <b>1.282 {t("€/mois*", "€/maand*")}</b>
              </span>
            </div>
            <div className="vrow">
              <span className="ph"><img src="/biens/maison.jpg" alt="" /></span>
              <div className="vt">
                <b>{t("Clos du Verger — Maison 3 façades", "Clos du Verger — Halfopen bebouwing")}</b>
                <small>{t("3 ch · 142 m² · jardin", "3 slpk · 142 m² · tuin")}</small>
              </div>
              <span className="vm">
                <small>{t("À partir de", "Vanaf")}</small>
                <b>1.643 {t("€/mois*", "€/maand*")}</b>
              </span>
            </div>
            <div className="vrow">
              <span className="ph"><img src="/biens/interieur-2.jpg" alt="" /></span>
              <div className="vt">
                <b>{t("Quai des Aulnes — App. penthouse", "Quai des Aulnes — Penthouse")}</b>
                <small>{t("2 ch · 118 m² · terrasse", "2 slpk · 118 m² · terras")}</small>
              </div>
              <span className="vm">
                <small>{t("À partir de", "Vanaf")}</small>
                <b>1.977 {t("€/mois*", "€/maand*")}</b>
              </span>
            </div>
            <p className="vnote">
              {t(
                "* Attention, emprunter de l'argent coûte aussi de l'argent. Estimations indicatives, hors droits d'enregistrement et frais de notaire. Exemple représentatif : bien de 302.500 € TVA 21 % comprise, apport de 10 %, durée de 30 ans, taux débiteur de 3,95 %, TAEG de 4,25 %, mensualité de 1.282 €. Sous réserve d'acceptation du dossier. Hypothèses fournies par BuyMonth Finance, nom commercial de JG Management SRL, intermédiaire de crédit.",
                "* Let op, geld lenen kost ook geld. Indicatieve ramingen, exclusief registratierechten en notariskosten. Representatief voorbeeld: pand van 302.500 € incl. 21 % btw, eigen inbreng van 10 %, looptijd van 30 jaar, debetrentevoet van 3,95 %, JKP van 4,25 %, maandbedrag van 1.282 €. Onder voorbehoud van aanvaarding van het dossier. Hypotheses aangeleverd door BuyMonth Finance, handelsnaam van JG Management SRL, kredietbemiddelaar."
              )}
            </p>
          </div>
          <p style={{ fontSize: 11, color: "rgba(25,59,94,0.4)", margin: "10px 0 0", textAlign: "center", fontStyle: "italic" }}>
            {t("Illustration — interface et données fictives.", "Illustratie — fictieve interface en gegevens.")}
          </p>
        </div>
      </div>

      <style>{`
        /* Vignettes de biens : vraies images, on masque le motif décoratif d'origine */
        #vitrine .vrow .ph::after { display: none !important; }
        #vitrine .vrow .ph img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Lignes de la carte vitrine : restructuration sur petit écran.
           Scopé sous #vitrine, ne touche pas le reste du site. */
        @media (max-width: 560px) {
          #vitrine .vrow {
            flex-wrap: wrap;
            align-items: flex-start;
            column-gap: 12px;
            row-gap: 10px;
            padding: 12px;
          }
          #vitrine .vrow .vt {
            flex: 1 1 0;
            min-width: 0;
          }
          /* Titre entier, plus d'ellipse écrasée */
          #vitrine .vrow .vt b {
            white-space: normal;
            overflow: visible;
            text-overflow: clip;
            line-height: 1.25;
          }
          /* Prix : barre pleine largeur sur sa propre ligne, aucun débordement */
          #vitrine .vrow .vm {
            flex: 0 0 100%;
            width: 100%;
            box-sizing: border-box;
            margin-left: 0;
            text-align: left;
            display: flex;
            align-items: baseline;
            gap: 6px;
            padding: 6px 12px;
          }
          #vitrine .vrow .vm small {
            display: inline;
          }
        }
      `}</style>
    </section>
  );
}