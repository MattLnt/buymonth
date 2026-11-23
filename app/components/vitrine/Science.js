"use client";
import { useLang } from "@/app/components/i18n/LangProvider";

export default function Science() {
  const { t } = useLang();
  return (
    <section style={{ padding: "26px 0 52px" }}>
      <div className="wrap">
        <div className="science reveal">
          <span className="eyebrow">{t("Ce n'est pas une intuition — c'est documenté", "Geen buikgevoel — het is onderzocht")}</span>
          <p className="big">
            {t("Le cadrage en mensualités rend le prix ", "Een prijs in maandbedragen is ")}
            <b>{t("plus lisible", "duidelijker")}</b>
            {t(" et ", " en ")}
            <b>{t("plus engageant", "aantrekkelijker")}</b>
            {t(" pour l'acheteur.", " voor de koper.")}
          </p>
          <div className="refs">
            <span>
              Gourville — <i>Journal of Consumer Research</i>, 1998
            </span>
            <span>
              Argyle, Nadauld &amp; Palmer — <i>Review of Financial Studies</i>, 2020
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
