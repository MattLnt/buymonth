"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Logo from "./Logo";

export default function PublicNav({ dark = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [session, setSession] = useState(null);
  const registerRef = useRef(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then(r => r.json())
      .then(data => { if (data?.user) setSession(data); });
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Ferme le dropdown register si clic extérieur
  useEffect(() => {
    function handleClickOutside(e) {
      if (registerRef.current && !registerRef.current.contains(e.target)) {
        setRegisterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const bg = dark
    ? scrolled ? "rgba(20,20,20,0.95)" : "rgba(20,20,20,0)"
    : scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0)";

  const border = dark
    ? scrolled ? "rgba(255,255,255,0.08)" : "transparent"
    : scrolled ? "rgba(0,0,0,0.06)" : "transparent";

  const links = dark ? "rgba(255,255,255,0.75)" : "#6B7280";

  const dashboardHref = session?.user?.role === "VENDEUR"
    ? "/dashboard/vendeur"
    : session?.user?.role === "ADMIN"
    ? "/dashboard/admin"
    : "/dashboard/acheteur";

  const navLinks = [
    { href: "/opportunites", label: "Opportunités", desc: "Voir les dossiers disponibles" },
    { href: "/tarifs", label: "Tarifs", desc: "Simple et transparent" },
    { href: "/blog", label: "Blog", desc: "Actualités & conseils" },
    { href: "/faq", label: "FAQ", desc: "Toutes vos questions" },
    { href: "/contact", label: "Contact", desc: "Notre équipe vous répond" },
  ];

  return (
    <>
      <style>{`
        @keyframes menuIn {
          from { opacity: 0; transform: translateY(-100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes itemIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (min-width: 1025px) {
          .burger-btn { display: none !important; }
          .mobile-menu-overlay { display: none !important; }
        }
        @media (max-width: 1024px) {
          .desktop-links { display: none !important; }
        }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        padding: "0 32px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: menuOpen ? "#141414" : bg,
        backdropFilter: scrolled && !menuOpen ? "blur(20px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled && !menuOpen ? "blur(20px) saturate(180%)" : "none",
        borderBottom: menuOpen ? "1px solid rgba(255,255,255,0.07)" : `1px solid ${border}`,
        transition: "background 0.4s ease, border-color 0.3s ease",
      }}>
        <Link href="/" onClick={() => setMenuOpen(false)}
          style={{ display: "flex", alignItems: "center", textDecoration: "none", zIndex: 201 }}>
          <Logo dark={dark || menuOpen} height={26} />
        </Link>

        {/* Desktop */}
        <div className="desktop-links" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={{ color: links, fontSize: 14, textDecoration: "none", fontWeight: 500 }}>{l.label}</Link>
          ))}

          {session ? (
            <Link href={dashboardHref}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: dark ? "#FF5A1F" : "#141414", color: dark ? "#141414" : "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                {session.user?.email?.[0]?.toUpperCase()}
              </div>
              Mon espace
            </Link>
          ) : (
            <>
              <Link href="/login" style={{ color: links, fontSize: 14, textDecoration: "none", fontWeight: 500 }}>Connexion</Link>

              {/* Dropdown S'inscrire */}
              <div ref={registerRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setRegisterOpen(!registerOpen)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, background: dark ? "#FF5A1F" : "#141414", color: dark ? "#141414" : "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}>
                  S'inscrire
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ transform: registerOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {registerOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 10px)", right: 0, zIndex: 300,
                    background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.12)", overflow: "hidden", minWidth: 240,
                    animation: "dropIn 0.2s ease",
                  }}>
                    <Link href="/register/acheteur" onClick={() => setRegisterOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", textDecoration: "none", borderBottom: "1px solid #F9FAFB" }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,90,31,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#141414", marginBottom: 2 }}>Compte acheteur</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF" }}>59 €/mois · Accès à tous les dossiers</div>
                      </div>
                    </Link>
                    <Link href="/register/vendeur" onClick={() => setRegisterOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", textDecoration: "none" }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#141414", marginBottom: 2 }}>Compte vendeur</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF" }}>Gratuit · Déposer un dossier</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Burger */}
        <button className="burger-btn" aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8, zIndex: 201, width: 40, height: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: "block", height: 2, borderRadius: 2, background: "#FF5A1F",
              width: i === 1 ? (menuOpen ? 22 : 14) : 22,
              transform: menuOpen ? (i === 0 ? "rotate(45deg) translate(5px, 5px)" : i === 2 ? "rotate(-45deg) translate(5px, -5px)" : "none") : "none",
              opacity: menuOpen && i === 1 ? 0 : 1,
              transition: "all 0.3s ease",
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu-overlay" style={{
          position: "fixed", inset: 0, zIndex: 199, background: "#141414",
          animation: "menuIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)", display: "flex", flexDirection: "column",
        }}>
          <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,90,31,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,90,31,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "88px 28px 32px", position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,90,31,0.1)", border: "1px solid rgba(255,90,31,0.2)", borderRadius: 20, padding: "5px 12px", marginBottom: 36, alignSelf: "flex-start", animation: "itemIn 0.4s ease 0.05s both" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#FF5A1F" }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "#FF5A1F", letterSpacing: "0.08em" }}>PLATEFORME PRIVÉE OFF-MARKET</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 40 }}>
              {navLinks.map((l, i) => (
                <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", textDecoration: "none", animation: `itemIn 0.4s ease ${0.1 + i * 0.07}s both` }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 3 }}>{l.label}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>{l.desc}</div>
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,90,31,0.1)", border: "1px solid rgba(255,90,31,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "itemIn 0.4s ease 0.38s both" }}>
              {session ? (
                <Link href={dashboardHref} onClick={() => setMenuOpen(false)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px", background: "#FF5A1F", borderRadius: 14, fontSize: 15, fontWeight: 700, color: "#141414", textDecoration: "none" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(20,20,20,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                    {session.user?.email?.[0]?.toUpperCase()}
                  </div>
                  Mon espace →
                </Link>
              ) : (
                <>
                  <Link href="/register/acheteur" onClick={() => setMenuOpen(false)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px", background: "#FF5A1F", borderRadius: 14, fontSize: 15, fontWeight: 700, color: "#141414", textDecoration: "none" }}>
                    S'inscrire comme acheteur — 59€/mois →
                  </Link>
                  <Link href="/register/vendeur" onClick={() => setMenuOpen(false)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "15px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>
                    Déposer un dossier — gratuit
                  </Link>
                  <Link href="/login" onClick={() => setMenuOpen(false)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px", borderRadius: 12, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                    Déjà un compte ? Se connecter →
                  </Link>
                </>
              )}
            </div>
          </div>

          <div style={{ padding: "20px 28px 40px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>© 2026 Fiderio</p>
            <div style={{ display: "flex", gap: 20 }}>
              <Link href="/cgv" onClick={() => setMenuOpen(false)} style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>CGV</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Contact</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}