"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { href: "#solution", label: "Solution", desc: "Notre approche commerciale" },
    { href: "#process", label: "Process", desc: "En 7 étapes clé en main" },
    { href: "#tarifs", label: "Tarifs", desc: "Simple et transparent" },
    { href: "#contact", label: "Contact", desc: "Notre équipe vous répond" },
  ];

  return (
    <>
      <style>{`
        @keyframes menuIn { from { opacity: 0; transform: translateY(-100%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes itemIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @media (min-width: 1025px) { .burger-btn { display: none !important; } .mobile-menu-overlay { display: none !important; } }
        @media (max-width: 1024px) { .desktop-links { display: none !important; } }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        padding: "0 32px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: menuOpen ? "#193B5E" : scrolled ? "rgba(25,59,94,0.95)" : "rgba(25,59,94,0)",
        backdropFilter: scrolled && !menuOpen ? "blur(20px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled && !menuOpen ? "blur(20px) saturate(180%)" : "none",
        borderBottom: menuOpen ? "1px solid rgba(255,255,255,0.07)" : `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "transparent"}`,
        transition: "background 0.4s ease, border-color 0.3s ease",
      }}>
        <Link href="/" onClick={() => setMenuOpen(false)}
          style={{ display: "flex", alignItems: "center", textDecoration: "none", zIndex: 201, fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
          Buy<span style={{ color: "#7CB8A8" }}>Month</span>
        </Link>

        <div className="desktop-links" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>{l.label}</Link>
          ))}
          <Link href="#contact"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#7CB8A8", color: "#193B5E", padding: "8px 18px", borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            Commencer →
          </Link>
        </div>

        <button className="burger-btn" aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8, zIndex: 201, width: 40, height: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: "block", height: 2, borderRadius: 2, background: "#7CB8A8",
              width: i === 1 ? (menuOpen ? 22 : 14) : 22,
              transform: menuOpen ? (i === 0 ? "rotate(45deg) translate(5px, 5px)" : i === 2 ? "rotate(-45deg) translate(5px, -5px)" : "none") : "none",
              opacity: menuOpen && i === 1 ? 0 : 1,
              transition: "all 0.3s ease",
            }} />
          ))}
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu-overlay" style={{
          position: "fixed", inset: 0, zIndex: 199, background: "#193B5E",
          animation: "menuIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)", display: "flex", flexDirection: "column",
        }}>
          <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(124,184,168,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "88px 28px 32px", position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(124,184,168,0.1)", border: "1px solid rgba(124,184,168,0.2)", borderRadius: 20, padding: "5px 12px", marginBottom: 36, alignSelf: "flex-start", animation: "itemIn 0.4s ease 0.05s both" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#7CB8A8" }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "#7CB8A8", letterSpacing: "0.08em" }}>INTERMÉDIAIRE EN CRÉDIT AGRÉÉ FSMA</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 40 }}>
              {navLinks.map((l, i) => (
                <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", textDecoration: "none", animation: `itemIn 0.4s ease ${0.1 + i * 0.07}s both` }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 3 }}>{l.label}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>{l.desc}</div>
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(124,184,168,0.1)", border: "1px solid rgba(124,184,168,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </Link>
              ))}
            </div>

            <Link href="#contact" onClick={() => setMenuOpen(false)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px", background: "#7CB8A8", borderRadius: 14, fontSize: 15, fontWeight: 700, color: "#193B5E", textDecoration: "none", animation: "itemIn 0.4s ease 0.38s both" }}>
              Commencer maintenant →
            </Link>
          </div>

          <div style={{ padding: "20px 28px 40px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>© 2024 BuyMonth</p>
            <a href="mailto:info@buymonth.be" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>info@buymonth.be</a>
          </div>
        </div>
      )}
    </>
  );
}