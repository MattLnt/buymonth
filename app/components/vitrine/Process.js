"use client";
import { useLang } from "@/app/components/i18n/LangProvider";

export default function Process() {
  const { t } = useLang();
  return (
    <section className="pad" id="process">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">{t("Le process", "De werkwijze")}</span>
          <h2>{t("De la communication à la vente, un parcours maîtrisé.", "Van communicatie tot verkoop, een traject onder controle.")}</h2>
          <p className="lead">
            {t(
              "Six étapes claires. Tout ce qui relève du crédit — hypothèses de simulation, pré-scoring, étude — est pris en charge par BuyMonth Finance, intermédiaire de crédit. Chacun son expertise.",
              "Zes duidelijke stappen. Alles wat met krediet te maken heeft — simulatiehypotheses, pre-scoring, studie — wordt verzorgd door BuyMonth Finance, kredietbemiddelaar. Ieder zijn expertise."
            )}
          </p>
        </div>
        <div className="steps">
          <div className="step reveal">
            <div className="num">1</div>
            <div>
              <h4>{t("Affichage en mensualités", "Weergave in maandbedragen")}</h4>
              <p>
                {t(
                  "Chaque bien porte une estimation mensuelle claire, sur vos supports comme sur la vitrine BuyMonth, sur base d'hypothèses fournies par BuyMonth Finance, intermédiaire de crédit.",
                  "Elk pand krijgt een duidelijke maandelijkse raming, op uw eigen kanalen en op de BuyMonth-etalage, op basis van hypotheses aangeleverd door BuyMonth Finance, kredietbemiddelaar."
                )}
              </p>
            </div>
          </div>
          <div className="step reveal">
            <div className="num">2</div>
            <div>
              <h4>{t("Capture des leads", "Leads verzamelen")}</h4>
              <p>
                {t(
                  "Badges, widgets, QR codes, landing pages dédiées, bornes en showroom : chaque point de contact ramène vers la page de simulation de votre bien.",
                  "Badges, widgets, QR-codes, eigen landingspagina's, zuilen in de showroom: elk contactpunt leidt naar de simulatiepagina van uw pand."
                )}
              </p>
            </div>
          </div>
          <div className="step reveal">
            <div className="num">3</div>
            <div>
              <h4>{t("Simulation", "Simulatie")}</h4>
              <p>
                {t(
                  "En quelques minutes, le visiteur estime sa capacité d'emprunt et voit si le bien entre dans son budget, sur base d'hypothèses fournies et validées par BuyMonth Finance. Le tri se fait de lui-même, avant de mobiliser vos équipes.",
                  "In enkele minuten raamt de bezoeker zijn leencapaciteit en ziet hij of het pand binnen zijn budget past, op basis van hypotheses aangeleverd en gevalideerd door BuyMonth Finance. De selectie gebeurt vanzelf, nog voor uw team wordt ingeschakeld."
                )}
              </p>
            </div>
          </div>
          <div className="step fin reveal">
            <div className="num">4</div>
            <div>
              <h4>
                {t("Pré-scoring personnalisé", "Gepersonaliseerde pre-scoring")} <span className="pill">BuyMonth Finance</span>
              </h4>
              <p>
                {t(
                  "Un conseiller BuyMonth Finance affine l'estimation avec les paramètres qu'un calcul automatique ne peut pas prendre en compte.",
                  "Een medewerker van BuyMonth Finance verfijnt de raming met de parameters waarmee een automatische berekening geen rekening kan houden."
                )}
              </p>
            </div>
          </div>
          <div className="step fin reveal">
            <div className="num">5</div>
            <div>
              <h4>
                {t("Étude approfondie", "Grondige studie")} <span className="pill">BuyMonth Finance</span>
              </h4>
              <p>
                {t(
                  "Sur accord du prospect, le dossier passe à la cellule crédit : conditions réelles, négociation avec les banques, jusqu'à la signature.",
                  "Met akkoord van de prospect gaat het dossier naar de kredietcel: reële voorwaarden, onderhandeling met de banken, tot aan de ondertekening."
                )}
              </p>
            </div>
          </div>
          <div className="step reveal">
            <div className="num">6</div>
            <div>
              <h4>{t("Suivi & reporting", "Opvolging & rapportering")}</h4>
              <p>
                {t(
                  "Depuis votre tableau de bord : leads reçus, biens consultés, date à laquelle chacun a demandé une simulation, avancement que vous encodez, ventes conclues.",
                  "Vanuit uw dashboard: ontvangen leads, bekeken panden, datum waarop elk een simulatie aanvroeg, voortgang die u zelf ingeeft, gesloten verkopen."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
