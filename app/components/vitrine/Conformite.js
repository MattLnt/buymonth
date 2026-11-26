"use client";
import Link from "next/link";
import { useLang } from "@/app/components/i18n/LangProvider";

export default function Conformite() {
  const { t } = useLang();
  return (
    <section className="pad tint" id="conformite">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">{t("Conformité & confiance", "Conformiteit & vertrouwen")}</span>
          <h2>{t("Un cadre carré, de bout en bout.", "Een helder kader, van begin tot eind.")}</h2>
          <p className="lead">
            {t(
              "La force de BuyMonth, c'est une frontière nette entre la plateforme et le crédit. Vous communiquez en mensualités sans porter le risque réglementaire — et sans jamais endosser un rôle qui n'est pas le vôtre.",
              "De kracht van BuyMonth is een duidelijke grens tussen het platform en het krediet. U communiceert in maandbedragen zonder het reglementaire risico te dragen — en zonder ooit een rol op te nemen die niet de uwe is."
            )}
          </p>
        </div>
        <div className="conf">
          <div className="c reveal">
            <div className="ic">🛡️</div>
            <h3>{t("Le financement, confié à un intermédiaire de crédit", "De financiering, toevertrouwd aan een kredietbemiddelaar")}</h3>
            <p>
              {t(
                "Chaque étude de financement est réalisée par BuyMonth Finance, nom commercial de JG Management SRL, intermédiaire de crédit. La plateforme, elle, se consacre à ce qu'elle fait de mieux : votre visibilité et vos leads.",
                "Elke financieringsstudie wordt uitgevoerd door BuyMonth Finance, handelsnaam van JG Management SRL, kredietbemiddelaar. Het platform concentreert zich op waar het het sterkst in is: uw zichtbaarheid en uw leads."
              )}
            </p>
          </div>
          <div className="c reveal">
            <div className="ic">⚖️</div>
            <h3>{t("Vos mentions légales intégrées", "Uw wettelijke vermeldingen inbegrepen")}</h3>
            <p>
              {t(
                "Chaque mensualité affichée porte les avertissements et l'exemple représentatif exigés par la loi belge. Vous encodez vos prix HTVA : la plateforme calcule et affiche le prix TVAC et la mensualité conformes.",
                "Elk getoond maandbedrag bevat de waarschuwingen en het representatief voorbeeld die de Belgische wet vereist. U geeft uw prijzen excl. btw in: het platform berekent en toont de conforme prijs incl. btw en het maandbedrag."
              )}
            </p>
          </div>
          <div className="c reveal">
            <div className="ic">🔒</div>
            <h3>{t("Les données protégées", "Beschermde gegevens")}</h3>
            <p>
              {t(
                "Collecte encadrée par le RGPD, consentement explicite du prospect, aucune transmission en bloc à des tiers.",
                "Verzameling volgens de AVG, uitdrukkelijke toestemming van de prospect, geen doorgifte in bulk aan derden."
              )}
            </p>
          </div>
        </div>
        <p className="conf-note reveal">
          {t("En savoir plus : ", "Meer weten: ")}
          <Link href="/mentions-legales">{t("Mentions légales", "Juridische vermeldingen")}</Link> ·{" "}
          <Link href="/confidentialite">{t("Politique de confidentialité", "Privacybeleid")}</Link>
        </p>
      </div>
    </section>
  );
}
