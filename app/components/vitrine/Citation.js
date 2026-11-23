"use client";
import { useLang } from "@/app/components/i18n/LangProvider";

export default function Citation() {
  const { t } = useLang();
  return (
    <section className="pad">
      <div className="wrap">
        <figure className="quote reveal">
          <span className="qm" aria-hidden="true">
            “
          </span>
          <blockquote>
            {t(
              "Vos biens ne changent pas. Leur lisibilité, si : un logement affiché ",
              "Uw panden veranderen niet. Hoe ze overkomen wel: een woning die wordt getoond "
            )}
            <b>{t("à partir de 1.490 € par mois", "vanaf 1.490 € per maand")}</b>
            {t(
              " suscite plus d'intérêt qu'un prix de 350.000 €.",
              " wekt meer interesse dan een prijs van 350.000 €."
            )}
          </blockquote>
        </figure>
      </div>
    </section>
  );
}
