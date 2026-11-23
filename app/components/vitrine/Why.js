"use client";
import { useLang } from "@/app/components/i18n/LangProvider";

export default function Why() {
  const { t } = useLang();
  return (
    <section className="pad">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">{t("Pourquoi BuyMonth", "Waarom BuyMonth")}</span>
          <h2>{t("Trois raisons de démarrer maintenant.", "Drie redenen om nu te starten.")}</h2>
        </div>
        <div className="why">
          <div className="item reveal">
            <h3>{t("Une communication qui déclenche", "Communicatie die in beweging zet")}</h3>
            <p>
              {t(
                "Afficher une mensualité accélère la décision et simplifie le dialogue avec vos prospects.",
                "Een maandbedrag tonen versnelt de beslissing en vereenvoudigt het gesprek met uw prospects."
              )}
            </p>
          </div>
          <div className="item reveal">
            <h3>{t("Un vrai gain de temps", "Echte tijdwinst")}</h3>
            <p>
              {t(
                "Grâce à la qualification et au suivi digitalisé, vos équipes se concentrent sur les acheteurs dont le projet est solide.",
                "Dankzij de kwalificatie en de digitale opvolging concentreert uw team zich op kopers met een solide project."
              )}
            </p>
          </div>
          <div className="item reveal">
            <h3>{t("Un écosystème complet", "Een volledig ecosysteem")}</h3>
            <p>
              {t(
                "Derrière la plateforme, un partenaire crédit — BuyMonth Finance, intermédiaire de crédit — dont l'expertise ouvre des solutions pour les profils atypiques, sans jamais interférer dans vos relations.",
                "Achter het platform staat een kredietpartner — BuyMonth Finance, kredietbemiddelaar — wiens expertise oplossingen biedt voor atypische profielen, zonder ooit tussen te komen in uw klantrelaties."
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
