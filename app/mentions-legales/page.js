import Link from "next/link";
import PublicNav from "@/app/components/PublicNav";
import PublicFooter from "@/app/components/PublicFooter";

export const metadata = {
  title: "Mentions légales — BuyMonth",
};

const H2 = ({ children }) => (
  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#193B5E", margin: "0 0 14px", letterSpacing: "-0.01em" }}>{children}</h2>
);

const Row = ({ label, children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 12, padding: "10px 0", borderBottom: "1px solid #F2F5FA", fontSize: 14 }} className="ml-row">
    <span style={{ color: "#8A92A6" }}>{label}</span>
    <span style={{ color: "#193B5E", fontWeight: 600 }}>{children}</span>
  </div>
);

const card = { background: "#fff", border: "1px solid #EEF2F7", borderRadius: 18, padding: "32px 36px", marginBottom: 20 };

export default function MentionsLegalesPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#EEF1F6" }}>
      <PublicNav />

      <style>{`
        @media (max-width: 600px) {
          .ml-row { grid-template-columns: 1fr !important; gap: 2px !important; }
          .ml-card { padding: 24px 20px !important; }
        }
      `}</style>

      <div style={{ paddingTop: 64 }}>
        {/* Hero */}
        <div style={{ background: "linear-gradient(150deg, #16324F 0%, #1D4267 100%)", padding: "72px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-30%", right: "-5%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,184,168,0.16) 0%, transparent 65%)", pointerEvents: "none" }} />
          <p style={{ fontSize: 11, fontWeight: 700, color: "#7CB8A8", letterSpacing: "0.1em", margin: "0 0 14px", position: "relative" }}>LÉGAL</p>
          <h1 style={{ fontSize: 40, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.025em", position: "relative" }}>
            Mentions légales
          </h1>
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 80px" }}>

          {/* Éditeur */}
          <div style={card} className="ml-card">
            <H2>Éditeur de la plateforme</H2>
            <Row label="Dénomination">BuyMonth SRL</Row>
            <Row label="Siège social">Rue Lucien Poncelet 58, 4520 Wanze, Belgique</Row>
            <Row label="Numéro d'entreprise">BCE 1041.967.664</Row>
            <Row label="E-mail"><a href="mailto:info@buymonth.be" style={{ color: "#193B5E" }}>info@buymonth.be</a></Row>
            <p style={{ fontSize: 14, color: "#5A6275", lineHeight: 1.7, margin: "18px 0 0" }}>
              BuyMonth SRL édite une plateforme d'affichage de biens immobiliers en mensualités et de mise en relation
              entre promoteurs et acheteurs. <strong style={{ color: "#193B5E" }}>BuyMonth SRL n'est pas intermédiaire de crédit</strong> :
              elle ne réalise aucun conseil en crédit, aucune analyse de solvabilité et ne propose aucun contrat de crédit.
            </p>
          </div>

          {/* Partenaire crédit */}
          <div style={card} className="ml-card">
            <H2>Partenaire crédit</H2>
            <Row label="Nom commercial">BuyMonth Finance</Row>
            <Row label="Société">JG Management SRL</Row>
            <Row label="Qualité">Intermédiaire de crédit</Row>
            <Row label="Inscription FSMA">
              n° 1021.366.349 —{" "}
              <a href="https://www.fsma.be/fr/registres" target="_blank" rel="noopener noreferrer" style={{ color: "#249E7C" }}>
                consulter le registre public de la FSMA
              </a>
            </Row>
            <Row label="Siège social">Rue Lucien Poncelet 58, 4520 Antheit, Belgique</Row>
            <Row label="Contact"><a href="mailto:info@buymonth-finance.be" style={{ color: "#193B5E" }}>info@buymonth-finance.be</a></Row>
            <Row label="Réclamations">
              En cas de réclamation, contactez d'abord BuyMonth Finance à{" "}
              <a href="mailto:info@buymonth-finance.be" style={{ color: "#249E7C" }}>info@buymonth-finance.be</a>.
              Si aucune solution n'est trouvée, vous pouvez vous adresser à Ombudsfin, le service de médiation des
              services financiers : North Gate II, Boulevard du Roi Albert II 8, bte 2, 1000 Bruxelles,{" "}
              <a href="mailto:ombudsman@ombudsfin.be" style={{ color: "#249E7C" }}>ombudsman@ombudsfin.be</a>,{" "}
              <a href="https://www.ombudsfin.be" target="_blank" rel="noopener noreferrer" style={{ color: "#249E7C" }}>www.ombudsfin.be</a>.
            </Row>
            <p style={{ fontSize: 14, color: "#5A6275", lineHeight: 1.7, margin: "18px 0 0" }}>
              Les hypothèses de simulation affichées sur la plateforme (apport, durée, taux, TAEG) sont fournies par
              BuyMonth Finance. Toute étude de financement, tout pré-scoring et tout conseil en crédit sont réalisés
              exclusivement par BuyMonth Finance. Les mensualités affichées sur BuyMonth sont indicatives et ne
              constituent pas une offre de crédit.
            </p>
          </div>

          {/* Avertissement */}
          <div style={card} className="ml-card">
            <H2>Avertissement</H2>
            <p style={{ fontSize: 14, color: "#5A6275", lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: "#193B5E" }}>Attention, emprunter de l'argent coûte aussi de l'argent.</strong> Les montants exprimés
              en euros par mois sur cette plateforme sont des estimations indicatives, hors droits d'enregistrement et frais de notaire,
              sous réserve d'acceptation du crédit par l'organisme prêteur. L'exemple représentatif complet accompagne chaque montant affiché.
            </p>
          </div>

          {/* Hébergement & propriété */}
          <div style={card} className="ml-card">
            <H2>Hébergement</H2>
            <p style={{ fontSize: 14, color: "#5A6275", lineHeight: 1.7, margin: 0 }}>
              Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
              Les données sont stockées sur des serveurs situés dans l'Union européenne.
            </p>
          </div>

          <div style={card} className="ml-card">
            <H2>Propriété intellectuelle</H2>
            <p style={{ fontSize: 14, color: "#5A6275", lineHeight: 1.7, margin: 0 }}>
              L'ensemble des éléments de la plateforme (marque, logo, textes, interfaces, code) est la propriété de BuyMonth SRL
              ou de ses partenaires. Les annonces immobilières restent la propriété des promoteurs qui les publient et qui sont
              seuls responsables de leur exactitude. Toute reproduction sans autorisation écrite est interdite.
            </p>
          </div>

          <p style={{ textAlign: "center", fontSize: 13, color: "#8A92A6", marginTop: 8, lineHeight: 1.7 }}>
            Voir aussi : <Link href="/confidentialite" style={{ color: "#249E7C", fontWeight: 600 }}>Politique de confidentialité</Link>
            {" · "}
            <Link href="/cgv" style={{ color: "#249E7C", fontWeight: 600 }}>Conditions générales</Link>
          </p>
        </div>

        <PublicFooter />
      </div>
    </div>
  );
}
