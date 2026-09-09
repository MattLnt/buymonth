import Link from "next/link";

export default function PublicFooter() {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 36px 24px !important; padding: 40px 24px 32px !important; }
          .footer-brand { grid-column: 1 / -1 !important; }
          .footer-fin { grid-column: 1 / -1 !important; }
          .footer-email { margin: 0 !important; flex-direction: column !important; align-items: flex-start !important; padding: 20px 24px !important; }
          .footer-bottom { padding: 16px 24px !important; flex-direction: column !important; gap: 12px !important; text-align: center !important; }
          .footer-bottom-links { justify-content: center !important; flex-wrap: wrap !important; }
        }
      `}</style>

      <footer className="public-footer" style={{ background: "#193B5E" }}>

        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(124,184,168,0.3), transparent)" }} />

        <div className="footer-grid" style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 48px 48px", display: "grid", gridTemplateColumns: "2fr 1fr 1.6fr", gap: 48 }}>

          <div className="footer-brand">
            <img src="/logo-buymonth.svg" alt="BuyMonth" style={{ height: 50, width: "auto", display: "block", filter: "brightness(0) invert(1)", marginBottom: 16 }} />
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, margin: "0 0 20px", maxWidth: 300 }}>
              Trouvez le bien qui correspond à votre budget mensuel, pas à un prix affiché.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "5px 12px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7CB8A8" }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600, letterSpacing: "0.06em" }}>BELGIQUE</span>
              </div>
            </div>
          </div>

          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 18px" }}>Navigation</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Les biens", href: "/biens" },
                { label: "Comment ça marche", href: "/#comment-ca-marche" },
                { label: "FAQ", href: "/#faq" },
                { label: "Contact", href: "/contact" },
              ].map(l => (
                <Link key={l.label} href={l.href} style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(124,184,168,0.6)" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-fin">
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 18px" }}>Votre financement</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 14px" }}>
              Votre estimation reste indicative. Pour connaître vos conditions réelles, un conseiller
              BuyMonth Finance analyse votre situation.
            </p>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,184,168,0.15)", border: "1px solid rgba(124,184,168,0.25)", color: "#7CB8A8", padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none", marginBottom: 16 }}>
              Demander une étude personnalisée →
            </Link>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>
              BuyMonth Finance (JG Management SRL), intermédiaire en crédit agréé FSMA n° 1021.366.349.
            </p>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 48px" }}>
          <div className="footer-email" style={{
            maxWidth: 1004, margin: "0 auto",
            background: "rgba(124,184,168,0.06)", border: "1px solid rgba(124,184,168,0.15)",
            borderRadius: 16, padding: "28px 32px",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
          }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Pas encore trouvé votre bien ?</p>
              <p style={{ fontSize: 15, color: "#fff", margin: 0, fontWeight: 600 }}>Parcourez les biens disponibles</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: "4px 0 0" }}>Tous affichés avec leur mensualité estimée.</p>
            </div>
            <Link href="/biens"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,184,168,0.15)", border: "1px solid rgba(124,184,168,0.25)", color: "#7CB8A8", padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
              Voir tous les biens →
            </Link>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="footer-bottom" style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", margin: 0 }}>
              © 2026 BuyMonth · BuyMonth Finance (JG Management SRL, FSMA 1021.366.349)
            </p>
            <div className="footer-bottom-links" style={{ display: "flex", gap: 20 }}>
              <Link href="/cgv" style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>CGV</Link>
              <Link href="/confidentialite" style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Confidentialité</Link>
              <Link href="/mentions-legales" style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Mentions légales</Link>
              <Link href="/pro" style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Devenir partenaire</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}