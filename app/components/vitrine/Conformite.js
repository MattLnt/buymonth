import Link from "next/link";

export default function Conformite() {
  return (
    <section className="pad tint" id="conformite">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Conformité &amp; confiance</span>
          <h2>Un cadre carré, de bout en bout.</h2>
          <p className="lead">
            La force de BuyMonth, c'est une frontière nette entre la plateforme et le crédit. Vous
            communiquez en mensualités sans porter le risque réglementaire — et sans jamais endosser
            un rôle qui n'est pas le vôtre.
          </p>
        </div>
        <div className="conf">
          <div className="c reveal">
            <div className="ic">🛡️</div>
            <h3>Le financement, confié à un expert agréé</h3>
            <p>
              Chaque étude de financement est réalisée par BuyMonth Finance, intermédiaire de crédit
              agréé FSMA. La plateforme, elle, se consacre à ce qu'elle fait de mieux : votre
              visibilité et vos leads.
            </p>
          </div>
          <div className="c reveal">
            <div className="ic">⚖️</div>
            <h3>Vos mentions légales intégrées</h3>
            <p>
              Chaque mensualité affichée porte les avertissements et l'exemple représentatif exigés
              par la loi belge. Vous encodez vos prix HTVA : la plateforme calcule et affiche le prix
              TVAC et la mensualité conformes.
            </p>
          </div>
          <div className="c reveal">
            <div className="ic">🔒</div>
            <h3>Les données protégées</h3>
            <p>
              Collecte encadrée par le RGPD, consentement explicite du prospect, aucune transmission
              en bloc à des tiers.
            </p>
          </div>
        </div>
        <p className="conf-note reveal">
          En savoir plus : <Link href="/mentions-legales">Mentions légales</Link> ·{" "}
          <Link href="/confidentialite">Politique de confidentialité</Link>
        </p>
      </div>
    </section>
  );
}