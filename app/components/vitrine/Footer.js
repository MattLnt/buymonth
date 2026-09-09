import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <img src="/logo-buymonth.svg" alt="BuyMonth" style={{ height: 120, width: "auto", display: "block", filter: "brightness(0) invert(1)", marginBottom: 14 }} />
            <p className="sep">
              La plateforme marketing d'affichage en mensualités et de mise en relation, éditée par{" "}
              <b style={{ color: "#fff" }}>BuyMonth SRL</b>. BuyMonth ne réalise aucun conseil en
              crédit ni analyse de solvabilité.
            </p>
          </div>
          <div>
            <h5>Partenaire crédit</h5>
            <p className="sep">
              <b style={{ color: "#fff" }}>BuyMonth Finance</b> (JG Management SRL), intermédiaire en
              crédit immobilier agréé par la FSMA — n° 1021.366.349.
            </p>
          </div>
          <div>
            <h5>Contact</h5>
            <p className="sep">
              +32 (0)474 27 26 49
              <br />
              <a href="mailto:info@buymonth.be">info@buymonth.be</a>
              <br />
              Partenariats : <a href="mailto:promoteurs@buymonth.be">promoteurs@buymonth.be</a>
            </p>
          </div>
        </div>
        <p className="sep" style={{ marginTop: 22 }}>
          <Link href="/mentions-legales">Mentions légales</Link> &nbsp;·&nbsp;{" "}
          <Link href="/cgv">CGV / CGU</Link> &nbsp;·&nbsp;{" "}
          <Link href="/confidentialite">Politique de confidentialité</Link>
        </p>
        <p className="legal">Attention, emprunter de l'argent coûte aussi de l'argent.</p>
        <p className="fine">
          © BuyMonth. Les simulations, le pré-scoring et l'accompagnement crédit sont assurés
          exclusivement par BuyMonth Finance (JG Management SRL), agréé FSMA. Les mensualités
          affichées sont indicatives et ne constituent pas une offre de crédit.
        </p>
      </div>
    </footer>
  );
}