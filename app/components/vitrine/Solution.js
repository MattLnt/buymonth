"use client";
import { useLang } from "@/app/components/i18n/LangProvider";

export default function Solution() {
  const { t } = useLang();
  return (
    <section className="pad tint" id="solution">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">{t("La solution", "De oplossing")}</span>
          <h2>{t("Et si vos prospects se décidaient dès la première visite ?", "En als uw prospects al bij het eerste bezoek beslisten?")}</h2>
          <p className="lead">
            {t(
              "BuyMonth valorise vos biens en €/mois et fluidifie le parcours du prospect — sans complexifier vos process internes. Notre approche repose sur 3 piliers.",
              "BuyMonth toont uw panden in €/maand en maakt het traject van de prospect vlotter — zonder uw interne processen ingewikkelder te maken. Onze aanpak steunt op 3 pijlers."
            )}
          </p>
        </div>
        <div className="cards3">
          <div className="card reveal">
            <div className="n">01</div>
            <h3>{t("Communiquer en €/mois", "Communiceren in €/maand")}</h3>
            <p>{t("Un affichage clair, conforme et directement aligné sur le budget de l'acheteur.", "Een duidelijke, conforme weergave die rechtstreeks aansluit bij het budget van de koper.")}</p>
          </div>
          <div className="card reveal">
            <div className="n">02</div>
            <h3>{t("Capter vos leads", "Uw leads binnenhalen")}</h3>
            <p>
              {t(
                "QR codes, landing pages et bornes en showroom : le prospect estime sa mensualité — sur base d'hypothèses validées par BuyMonth Finance — et vous laisse un contact concret.",
                "QR-codes, landingspagina's en zuilen in de showroom: de prospect raamt zijn maandbedrag — op basis van hypotheses gevalideerd door BuyMonth Finance — en laat u concrete contactgegevens na."
              )}
            </p>
          </div>
          <div className="card reveal">
            <div className="n">03</div>
            <h3>{t("Qualifier & fluidifier", "Kwalificeren & vlotter maken")}</h3>
            <p>
              {t(
                "S'il le souhaite, l'acheteur fait étudier sa capacité de financement par notre partenaire crédit, BuyMonth Finance, et repart avec une estimation personnalisée de son budget. Vous voyez dans votre tableau de bord lesquels de vos contacts ont franchi cette étape.",
                "Als hij dat wenst, laat de koper zijn financieringscapaciteit bestuderen door onze kredietpartner, BuyMonth Finance, en krijgt hij een gepersonaliseerde raming van zijn budget. In uw dashboard ziet u welke van uw contacten die stap hebben gezet."
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
