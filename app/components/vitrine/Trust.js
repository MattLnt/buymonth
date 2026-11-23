"use client";
import { useLang } from "@/app/components/i18n/LangProvider";

export default function Trust() {
  const { t } = useLang();
  return (
    <div className="trust">
      <div className="wrap trust-in">
        <span>
          <i className="dot" />
          {t("Sans refonte de votre site", "Zonder uw website te herwerken")}
        </span>
        <span>
          <i className="dot" />
          {t("Mentions légales & RGPD intégrés", "Wettelijke vermeldingen & AVG inbegrepen")}
        </span>
        <span>
          <i className="dot" />
          {t("Partenaire crédit : BuyMonth Finance", "Kredietpartner: BuyMonth Finance")}
        </span>
      </div>
    </div>
  );
}
