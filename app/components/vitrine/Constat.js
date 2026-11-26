"use client";
import { useLang } from "@/app/components/i18n/LangProvider";

export default function Constat() {
  const { t } = useLang();
  return (
    <section className="pad">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">{t("Le constat", "De vaststelling")}</span>
          <h2>{t("Un prix global, ça bloque.", "Een totaalprijs schrikt af.")}</h2>
          <p className="lead">
            {t(
              "Trois freins bien connus, un même symptôme : des ventes qui traînent.",
              "Drie bekende remmen, één symptoom: verkopen die aanslepen."
            )}
          </p>
        </div>
        <div className="cards3">
          <div className="card reveal">
            <div className="icb">1</div>
            <h3>{t("Un prix qui parle peu", "Een prijs die weinig zegt")}</h3>
            <p>
              {t("Un prix global de ", "Een totaalprijs van ")}
              <b>350.000 €</b>
              {t(
                " ne dit rien à l'acquéreur : il raisonne en budget mensuel, comme pour toutes ses autres dépenses.",
                " zegt de koper weinig: hij denkt in een maandbudget, zoals voor al zijn andere uitgaven."
              )}
            </p>
          </div>
          <div className="card reveal">
            <div className="icb">2</div>
            <h3>{t("Le financement, angle mort", "Financiering, de blinde vlek")}</h3>
            <p>
              {t("Les candidats ", "Kandidaten ")}
              <b>{t("ne connaissent pas leur capacité d'emprunt", "kennen hun leencapaciteit niet")}</b>
              {t(
                " avant d'avoir consulté plusieurs banques — beaucoup renoncent avant même de vous contacter.",
                " voordat ze bij meerdere banken zijn langsgegaan — velen haken af nog voor ze u contacteren."
              )}
            </p>
          </div>
          <div className="card reveal">
            <div className="icb">3</div>
            <h3>{t("Du temps commercial perdu", "Verloren commerciële tijd")}</h3>
            <p>
              {t("Visites et rendez-vous s'enchaînent avec des candidats ", "Bezoeken en afspraken volgen elkaar op met kandidaten ")}
              <b>{t("dont le budget est insuffisant", "van wie het budget ontoereikend is")}</b>.
            </p>
          </div>
        </div>
        <div className="answer reveal">
          <h3>{t("La réponse BuyMonth", "Het antwoord van BuyMonth")}</h3>
          <p>
            {t(
              "Un outil d'affichage intelligent, intégré à vos propres supports, qui traduit chaque bien en ",
              "Een slimme weergavetool, geïntegreerd in uw eigen kanalen, die elk pand vertaalt in een "
            )}
            <b>{t("estimation mensuelle indicative", "indicatieve maandelijkse raming")}</b>
            {t(
              " et permet au visiteur de vérifier la faisabilité de son projet en quelques minutes — avant de solliciter vos équipes.",
              " en de bezoeker in enkele minuten laat nagaan of zijn project haalbaar is — nog voor hij uw team aanspreekt."
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
