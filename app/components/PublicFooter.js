import Link from "next/link";
import Logo from "./Logo";

export default function PublicFooter({ desktopOnly = false }) {
  return (
    <>
      <style>{`
        ${desktopOnly ? `
          @media (max-width: 1024px) {
            .public-footer { display: none !important; }
          }
        ` : ''}
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 36px 24px !important; padding: 40px 24px 32px !important; }
          .footer-brand { grid-column: 1 / -1 !important; }
          .footer-email-wrapper { padding: 0 !important; }
          .footer-email { margin: 0 !important; border-radius: 0 !important; border-left: none !important; border-right: none !important; flex-direction: column !important; align-items: flex-start !important; padding: 20px 24px !important; }
          .footer-bottom { padding: 16px 24px !important; flex-direction: column !important; gap: 12px !important; text-align: center !important; }
          .footer-bottom-links { justify-content: center !important; }
        }
      `}</style>

      <footer className="public-footer" style={{ background: "#141414" }}>

        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,90,31,0.3), transparent)" }} />

        <div className="footer-grid" style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 48px 48px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48 }}>

          <div className="footer-brand">
            <Link href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: 14 }}>
              <Logo dark height={28} />
            </Link>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, margin: "0 0 20px", maxWidth: 260 }}>
              La plateforme privée off-market dédiée à la cession de cabinets comptables en Belgique.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,90,31,0.1)", border: "1px solid rgba(255,90,31,0.2)", borderRadius: 20, padding: "5px 12px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF5A1F" }} />
                <span style={{ fontSize: 11, color: "#FF5A1F", fontWeight: 600, letterSpacing: "0.06em" }}>PLATEFORME BELGE</span>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "5px 12px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600, letterSpacing: "0.06em" }}>OFF-MARKET</span>
              </div>
            </div>
          </div>

          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 18px" }}>Plateforme</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Opportunités", href: "/opportunites" },
                { label: "Tarifs", href: "/tarifs" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact", href: "/contact" },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,90,31,0.6)" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 18px" }}>Compte</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Se connecter", href: "/login" },
                { label: "S'inscrire", href: "/register" },
                { label: "Déposer un dossier", href: "/register" },
                { label: "S'abonner", href: "/register" },
              ].map(l => (
                <Link key={l.label} href={l.href} style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,90,31,0.6)" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 18px" }}>Légal</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "CGV", href: "/cgv" },
                { label: "Confidentialité", href: "/confidentialite" },
                { label: "Mentions légales", href: "/mentions-legales" },
              ].map(l => (
                <Link key={l.label} href={l.href} style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,90,31,0.6)" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Email CTA — cadre desktop, pleine largeur mobile */}
        <div className="footer-email-wrapper" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 48px" }}>
          <div className="footer-email" style={{
            maxWidth: 1004,
            margin: "0 auto",
            background: "rgba(255,90,31,0.06)",
            border: "1px solid rgba(255,90,31,0.15)",
            borderRadius: 16,
            padding: "28px 32px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 16,
          }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Nous contacter</p>
              <a href="mailto:contact@fiderio.be" style={{ fontSize: 15, color: "#FF5A1F", textDecoration: "none", fontWeight: 600 }}>
                contact@fiderio.be
              </a>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: "4px 0 0" }}>Notre équipe répond sous 24h, du lundi au vendredi.</p>
            </div>
            <a href="mailto:contact@fiderio.be"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,90,31,0.15)", border: "1px solid rgba(255,90,31,0.25)", color: "#FF5A1F", padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Envoyer un email →
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="footer-bottom" style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", margin: 0 }}>
              © 2026 Fiderio · Tous droits réservés · Belgique
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