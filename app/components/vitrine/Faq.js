import Link from "next/link";

export default function Faq() {
  return (
    <section className="pad" id="faq">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Questions fréquentes</span>
          <h2>Ce que les promoteurs nous demandent.</h2>
        </div>
        <div className="faq reveal">
          <details open>
            <summary>BuyMonth fait-il du crédit ?</summary>
            <div className="a">
              Le crédit est pris en charge par un spécialiste agréé : BuyMonth Finance (JG Management
              SRL), intermédiaire de crédit agréé FSMA sous le n° 1021.366.349, réalise l'étude, le
              pré-scoring et le conseil. La plateforme BuyMonth se consacre à l'affichage en
              mensualités et à la mise en relation. Chacun son métier — et vous êtes couvert des deux
              côtés.
            </div>
          </details>
          <details>
            <summary>Dois-je refaire mon site ?</summary>
            <div className="a">
              Non. Le badge, le widget et les QR codes s'intègrent à votre existant sans refonte. En
              formule Pro+, tout est livré en marque blanche, à vos couleurs et avec votre logo.
            </div>
          </details>
          <details>
            <summary>Que deviennent les données de mes prospects ?</summary>
            <div className="a">
              Elles sont collectées avec le consentement explicite du prospect et ne sont jamais
              transmises en bloc. Elles ne partent vers BuyMonth Finance que si le prospect demande
              une étude, et vers vous pour la mise en relation. Le détail figure dans notre{" "}
              <Link href="/confidentialite">Politique de confidentialité</Link>.
            </div>
          </details>
          <details>
            <summary>Suis-je couvert légalement ?</summary>
            <div className="a">
              Oui. Chaque mensualité affichée porte la mention « emprunter de l'argent coûte aussi de
              l'argent », l'exemple représentatif (TAEG, durée…) et les disclaimers exigés. Les
              hypothèses financières du simulateur (taux, TAEG, durées) sont fournies, validées et
              mises à jour exclusivement par BuyMonth Finance, intermédiaire agréé FSMA — jamais par
              la plateforme. La conformité RGPD est intégrée d'office.
            </div>
          </details>
          <details>
            <summary>Mes biens seront-ils noyés parmi ceux des concurrents ?</summary>
            <div className="a">
              Non. La vitrine est un canal d'acquisition en plus, qui vous amène des acheteurs déjà
              sensibilisés au budget. Votre badge fonctionne sur votre propre site indépendamment de
              la vitrine, et la formule <b style={{ color: "var(--proplus)" }}>Pro+</b> vous garantit
              un placement prioritaire.
            </div>
          </details>
          <details>
            <summary>Le pré-scoring, comment ça marche ?</summary>
            <div className="a">
              Lorsqu'un prospect le souhaite, il transmet quelques informations sur sa situation.
              Notre partenaire agréé, BuyMonth Finance, réalise alors une évaluation indicative de sa
              capacité de financement. Vous recevez un lead avec un budget vérifié — et l'analyse
              reste entre les mains de l'expert agréé, du début à la fin.
            </div>
          </details>
          <details>
            <summary>Qui gère le dossier de financement ?</summary>
            <div className="a">
              Exclusivement BuyMonth Finance (JG Management SRL), intermédiaire en crédit agréé FSMA.
              C'est elle qui analyse le dossier, conseille l'acheteur et négocie avec les banques —
              jusqu'à la signature. Vous suivez l'avancement, sans avoir à vous en occuper.
            </div>
          </details>
          <details>
            <summary>Combien ça coûte ?</summary>
            <div className="a">
              Une mise en service unique de 1 490 € HTVA, puis 39 € HTVA par bien actif et par mois en
              formule Pro — 45 € en <b style={{ color: "var(--proplus)" }}>Pro+</b>. Vous ne payez que
              vos biens actifs : un bien vendu sort automatiquement du décompte. Aucune commission sur
              vos ventes.
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}