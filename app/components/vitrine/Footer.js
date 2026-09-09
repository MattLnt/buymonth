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
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <a href="https://www.facebook.com/buymonth" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ width: 38, height: 38, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(124,184,168,0.12)", border: "1px solid rgba(124,184,168,0.25)", color: "#7CB8A8" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-2.9h2.5V9.4c0-2.5 1.5-3.8 3.8-3.8 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5v1.9H16l-.4 2.9h-2.1v7A10 10 0 0 0 22 12z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/buymonth" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ width: 38, height: 38, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(124,184,168,0.12)", border: "1px solid rgba(124,184,168,0.25)", color: "#7CB8A8" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1-.02 5 2.5 2.5 0 0 1 .02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9z"/></svg>
              </a>
              <a href="https://www.instagram.com/buymonth.be/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ width: 38, height: 38, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(124,184,168,0.12)", border: "1px solid rgba(124,184,168,0.25)", color: "#7CB8A8" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              </a>
            </div>
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