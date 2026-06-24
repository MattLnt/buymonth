import Link from "next/link";

export default function PublicFooter() {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 36px 24px !important; padding: 40px 24px 32px !important; }
          .footer-brand { grid-column: 1 / -1 !important; }
          .footer-email { margin: 0 !important; flex-direction: column !important; align-items: flex-start !important; padding: 20px 24px !important; }
          .footer-bottom { padding: 16px 24px !important; flex-direction: column !important; gap: 12px !important; text-align: center !important; }
          .footer-bottom-links { justify-content: center !important; }
        }
      `}</style>

      <footer className="public-footer" style={{ background: "#193B5E" }}>

        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(124,184,168,0.3), transparent)" }} />

        <div className="footer-grid" style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 48px 48px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48 }}>

          <div className="footer-brand">
            <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 14 }}>
              Buy<span style={{ color: "#7CB8A8" }}>Month</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, margin: "0 0 20px", maxWidth: 280 }}>
              Le nouvel outil qui facilite la vente immobilière. Vendez vos biens en mensualités, pas en m².
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(124,184,168,0.1)", border: "1px solid rgba(124,184,168,0.2)", borderRadius: 20, padding: "5px 12px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7CB8A8" }} />
                <span style={{ fontSize: 11, color: "#7CB8A8", fontWeight: 600, letterSpacing: "0.06em" }}>AGRÉÉ FSMA</span>
              </div>
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
                { label: "Accueil", href: "/" },
                { label: "Les biens", href: "/biens" },
                { label: "Process", href: "/#process" },
                { label: "Tarifs", href: "/#tarifs" },
                { label: "FAQ", href: "/#faq" },
              ].map(l => (
                <Link key={l.label} href={l.href} style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(124,184,168,0.6)" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 18px" }}>Espace pro</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Link href="/login" style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(124,184,168,0.6)" strokeWidth="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                Connexion
              </Link>
              <Link href="/register" style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(124,184,168,0.6)" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                Devenir partenaire
              </Link>
              <a href="mailto:info@buymonth.be" style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(124,184,168,0.6)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                info@buymonth.be
              </a>
              <a href="tel:+32497709494" style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(124,184,168,0.6)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/></svg>
                +32 497 70 94 94
              </a>
            </div>
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
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Prêt à booster vos ventes ?</p>
              <a href="mailto:info@buymonth.be" style={{ fontSize: 15, color: "#7CB8A8", textDecoration: "none", fontWeight: 600 }}>info@buymonth.be</a>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: "4px 0 0" }}>Et si on faisait le test sur vos prochains biens ?</p>
            </div>
            <Link href="/register"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,184,168,0.15)", border: "1px solid rgba(124,184,168,0.25)", color: "#7CB8A8", padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
              Devenir partenaire →
            </Link>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="footer-bottom" style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", margin: 0 }}>
              © 2026 BuyMonth · JG Management SRL · Agréé FSMA n°1021.366.349
            </p>
            <div className="footer-bottom-links" style={{ display: "flex", gap: 20 }}>
              <Link href="/cgv" style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>CGV</Link>
              <Link href="/confidentialite" style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Confidentialité</Link>
              <Link href="/mentions-legales" style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Mentions légales</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}