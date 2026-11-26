"use client";
import Link from "next/link";
import { useLang } from "@/app/components/i18n/LangProvider";

export default function Cta() {
  const { t } = useLang();
  return (
    <section className="pad" id="contact" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="band reveal">
          <h2>{t("Prêt à accélérer vos ventes ?", "Klaar om uw verkoop te versnellen?")}</h2>
          <p>
            {t(
              "Rejoignez les promoteurs et agences qui misent sur une innovation concrète et mesurable. Et si on testait BuyMonth sur vos prochains biens ?",
              "Sluit aan bij de projectontwikkelaars en vastgoedkantoren die inzetten op concrete en meetbare innovatie. Zullen we BuyMonth testen op uw volgende panden?"
            )}
          </p>
          <Link
            className="btn btn-primary"
            href="/pro/contact"
            style={{ padding: "14px 30px", fontSize: "1rem" }}
          >
            {t("Réserver ma démo", "Mijn demo aanvragen")}
          </Link>
        </div>
      </div>
    </section>
  );
}
