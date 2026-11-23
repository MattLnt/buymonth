"use client";
import Link from "next/link";
import { useLang } from "@/app/components/i18n/LangProvider";

export default function Faq() {
  const { t } = useLang();
  const proplus = <b style={{ color: "var(--proplus)" }}>Pro+</b>;
  return (
    <section className="pad" id="faq">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">{t("Questions fréquentes", "Veelgestelde vragen")}</span>
          <h2>{t("Ce que les promoteurs nous demandent.", "Wat projectontwikkelaars ons vragen.")}</h2>
        </div>
        <div className="faq reveal">
          <details open>
            <summary>{t("BuyMonth fait-il du crédit ?", "Verstrekt BuyMonth kredieten?")}</summary>
            <div className="a">
              {t(
                "Non. Le crédit est pris en charge par notre partenaire : BuyMonth Finance, nom commercial de JG Management SRL, intermédiaire de crédit, réalise l'étude, le pré-scoring et le conseil. La plateforme BuyMonth se consacre à l'affichage en mensualités et à la mise en relation. Chacun son métier — et vous êtes couvert des deux côtés.",
                "Nee. Het krediet wordt behandeld door onze partner: BuyMonth Finance, handelsnaam van JG Management SRL, kredietbemiddelaar, verzorgt de studie, de pre-scoring en de begeleiding. Het BuyMonth-platform richt zich op de weergave in maandbedragen en het leggen van contacten. Ieder zijn vak — en u bent aan beide kanten gedekt."
              )}
            </div>
          </details>
          <details>
            <summary>{t("Dois-je refaire mon site ?", "Moet ik mijn website vernieuwen?")}</summary>
            <div className="a">
              {t(
                "Non. Le badge, le widget et les QR codes s'intègrent à votre existant sans refonte. En formule Pro+, tout est livré en marque blanche, à vos couleurs et avec votre logo.",
                "Nee. De badge, de widget en de QR-codes passen in uw bestaande kanalen zonder herwerking. In de formule Pro+ wordt alles geleverd in white label, in uw kleuren en met uw logo."
              )}
            </div>
          </details>
          <details>
            <summary>{t("Que deviennent les données de mes prospects ?", "Wat gebeurt er met de gegevens van mijn prospects?")}</summary>
            <div className="a">
              {t(
                "Elles sont collectées avec le consentement explicite du prospect et ne sont jamais transmises en bloc. Elles ne partent vers BuyMonth Finance que si le prospect demande une étude, et vers vous pour la mise en relation. Le détail figure dans notre ",
                "Ze worden verzameld met de uitdrukkelijke toestemming van de prospect en worden nooit in bulk doorgegeven. Ze gaan enkel naar BuyMonth Finance als de prospect een studie aanvraagt, en naar u voor het contact. Alle details vindt u in ons "
              )}
              <Link href="/confidentialite">{t("Politique de confidentialité", "Privacybeleid")}</Link>.
            </div>
          </details>
          <details>
            <summary>{t("Qui porte les mentions légales ?", "Wie zorgt voor de wettelijke vermeldingen?")}</summary>
            <div className="a">
              {t(
                "Chaque mensualité affichée par BuyMonth porte l'avertissement légal et l'exemple représentatif exigés. Les hypothèses financières du simulateur — taux, TAEG, durées — sont fournies exclusivement par BuyMonth Finance, nom commercial de JG Management SRL, intermédiaire de crédit. Vous restez responsable de l'exactitude des informations que vous encodez sur vos biens.",
                "Elk maandbedrag dat BuyMonth toont, bevat de vereiste wettelijke waarschuwing en het representatief voorbeeld. De financiële hypotheses van de simulator — rentevoet, JKP, looptijden — worden uitsluitend aangeleverd door BuyMonth Finance, handelsnaam van JG Management SRL, kredietbemiddelaar. U blijft verantwoordelijk voor de juistheid van de informatie die u over uw panden ingeeft."
              )}
            </div>
          </details>
          <details>
            <summary>{t("Mes biens seront-ils noyés parmi ceux des concurrents ?", "Verdwijnen mijn panden tussen die van de concurrentie?")}</summary>
            <div className="a">
              {t(
                "Non. La vitrine est un canal d'acquisition en plus, qui vous amène des acheteurs déjà sensibilisés au budget. Votre badge fonctionne sur votre propre site indépendamment de la vitrine, et la formule ",
                "Nee. De etalage is een extra acquisitiekanaal dat u kopers aanbrengt die al bewust met hun budget bezig zijn. Uw badge werkt op uw eigen website, los van de etalage, en de formule "
              )}
              {proplus}
              {t(" vous garantit un placement prioritaire.", " garandeert u een voorrangsplaats.")}
            </div>
          </details>
          <details>
            <summary>{t("Le pré-scoring, comment ça marche ?", "Hoe werkt de pre-scoring?")}</summary>
            <div className="a">
              {t(
                "Lorsqu'un prospect le souhaite, il transmet quelques informations sur sa situation. Notre partenaire crédit, BuyMonth Finance, réalise alors une évaluation indicative de sa capacité de financement. Vous recevez un lead avec un budget vérifié — et l'analyse reste entre les mains de l'intermédiaire de crédit, du début à la fin.",
                "Als een prospect dat wenst, bezorgt hij enkele gegevens over zijn situatie. Onze kredietpartner, BuyMonth Finance, maakt dan een indicatieve inschatting van zijn financieringscapaciteit. U ontvangt een lead met een gecontroleerd budget — en de analyse blijft van begin tot eind in handen van de kredietbemiddelaar."
              )}
            </div>
          </details>
          <details>
            <summary>{t("Qui gère le dossier de financement ?", "Wie beheert het financieringsdossier?")}</summary>
            <div className="a">
              {t(
                "Exclusivement BuyMonth Finance, nom commercial de JG Management SRL, intermédiaire de crédit. C'est elle qui analyse le dossier, conseille l'acheteur et négocie avec les banques — jusqu'à la signature. Vous suivez l'avancement, sans avoir à vous en occuper.",
                "Uitsluitend BuyMonth Finance, handelsnaam van JG Management SRL, kredietbemiddelaar. Zij analyseert het dossier, begeleidt de koper en onderhandelt met de banken — tot aan de ondertekening. U volgt de voortgang op, zonder er zelf mee bezig te zijn."
              )}
            </div>
          </details>
          <details>
            <summary>{t("Combien ça coûte ?", "Wat kost het?")}</summary>
            <div className="a">
              {t(
                "Une mise en service unique de 1 490 € HTVA, puis 39 € HTVA par bien actif et par mois en formule Pro — 45 € en ",
                "Een eenmalige opstartkost van 1 490 € excl. btw, daarna 39 € excl. btw per actief pand per maand in de formule Pro — 45 € in "
              )}
              {proplus}
              {t(
                ". Vous ne payez que vos biens actifs : un bien vendu sort automatiquement du décompte. Aucune commission sur vos ventes. Abonnement souscrit pour 12 mois, avec une facturation mensuelle minimale garantie définie au contrat.",
                ". U betaalt enkel voor uw actieve panden: een verkocht pand valt automatisch uit de telling. Geen commissie op uw verkopen. Abonnement voor 12 maanden, met een gegarandeerde minimale maandelijkse facturatie zoals bepaald in het contract."
              )}
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
