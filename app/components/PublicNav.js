"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import CalMark from "./CalMark";

export default function Nav() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const navH = 64; // Hauteur fixe commune
  const navRef = useRef(null);

  const close = () => setOpen(false);

  // Détecte le mobile pour la logique responsive pure
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Détection du scroll pour assombrir la nav
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Verrouille le scroll du body quand le menu plein écran est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Liens spécifiques à la page Pro
  const navLinks = [
    { href: "/pro#solution", label: "Solution", desc: "Comment ça marche" },
    { href: "/pro#vitrine", label: "Les biens", desc: "Découvrir la vitrine" },
    { href: "/pro#process", label: "Process", desc: "Les étapes de vente" },
    { href: "/pro#tarif", label: "Tarifs", desc: "Nos offres" },
    { href: "/pro#contact", label: "Contact", desc: "Nous parler" },
  ];

  // Gestion des couleurs pour coller à l'effet de publicnav.js (toujours sur fond clair ou transparent, puis assombri au scroll)
  const navBackground = open ? "#193B5E" : scrolled ? "rgba(25,59,94,0.95)" : "rgba(255,255,255,0.95)";
  const logoColor = (scrolled || open) ? "#fff" : "#193B5E";
  const burgerColor = (scrolled || open) ? "#7CB8A8" : "#193B5E";

  return (
    <>
      <style>{`
        @keyframes menuIn { from { opacity: 0; transform: translateY(-100%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes itemIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        
        .nav-pro-desktop { display: flex; gap: 24px; align-items: center; }
        .nav-pro-mobile { display: none !important; }
        
        @media (max-width: 1024px) { 
          .nav-pro-desktop { display: none !important; } 
          .nav-pro-mobile { display: flex !important; }
        }

        .btn-mon-espace { display: inline-flex; align-items: center; gap: 7px; background: #7CB8A8; color: #193B5E; padding: 8px 18px; border-radius: 8px; font-size: 14px; font-weight: 700; text-decoration: none; }
        .nav-pro-link { color: #193B5E; font-size: 14px; text-decoration: none; font-weight: 500; transition: color 0.3s ease; }
        .nav-pro-link:hover { color: #7CB8A8; }
      `}</style>

      <nav ref={navRef} style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 900,
        height: navH, padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: navBackground,
        backdropFilter: (!open) ? "blur(20px) saturate(180%)" : "none",
        WebkitBackdropFilter: (!open) ? "blur(20px) saturate(180%)" : "none",
        borderBottom: open ? "1px solid rgba(255,255,255,0.07)" : `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`,
        transition: "background 0.4s ease, border-color 0.3s ease",
      }}>
        {/* LOGO */}
        <Link href="/pro" onClick={close} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", zIndex: 901, fontSize: 20, fontWeight: 700, color: logoColor, letterSpacing: "-0.02em", transition: "color 0.3s ease" }}>
          <CalMark size={30} color={scrolled || open ? "#fff" : "#193B5E"} />
          Buy<span style={{ color: "#7CB8A8" }}>Month</span> <span style={{ fontSize: 13, background: "rgba(124,184,168,0.2)", color: "#7CB8A8", padding: "2px 6px", borderRadius: 6, marginLeft: 4 }}>PRO</span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="nav-pro-desktop">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className="nav-pro-link" style={{ color: scrolled ? "rgba(255,255,255,0.8)" : "#193B5E" }}>
              {l.label}
            </a>
          ))}

          <div style={{ width: 1, height: 20, background: scrolled ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)", margin: "0 8px" }} />

          {isLoggedIn ? (
            <>
              <button onClick={() => signOut({ callbackUrl: "/" })} style={{ background: "none", border: "none", cursor: "pointer", color: scrolled ? "rgba(255,255,255,0.7)" : "#193B5E", fontSize: 14, fontWeight: 600, padding: 0 }}>
                Déconnexion
              </button>
              <Link href="/dashboard" className="btn-mon-espace">Mon espace →</Link>
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: scrolled ? "#fff" : "#193B5E", fontSize: 14, textDecoration: "none", fontWeight: 600 }}>Connexion</Link>
              <Link href="/pro/contact" className="btn-mon-espace">Réserver une démo</Link>
            </>
          )}
        </div>

        {/* MOBILE BURGER */}
        <button className="nav-pro-mobile" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8, zIndex: 901, width: 40, height: 40, flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: "block", height: 2, borderRadius: 2, background: burgerColor,
              width: i === 1 ? (open ? 22 : 14) : 22,
              transform: open ? (i === 0 ? "rotate(45deg) translate(5px, 5px)" : i === 2 ? "rotate(-45deg) translate(5px, -5px)" : "none") : "none",
              opacity: open && i === 1 ? 0 : 1,
              transition: "all 0.3s ease",
            }} />
          ))}
        </button>
      </nav>

      {/* FULL SCREEN MOBILE MENU (Identique à publicnav.js) */}
      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 899, background: "#193B5E",
          animation: "menuIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)", display: "flex", flexDirection: "column",
        }}>
          <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(124,184,168,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "88px 24px 32px", position: "relative", zIndex: 1, overflowY: "auto" }}>
            
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(124,184,168,0.1)", border: "1px solid rgba(124,184,168,0.2)", borderRadius: 20, padding: "5px 12px", marginBottom: 32, alignSelf: "flex-start", animation: "itemIn 0.4s ease 0.05s both" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#7CB8A8" }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "#7CB8A8", letterSpacing: "0.08em" }}>ESPACE PROMOTEURS</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 28 }}>
              {navLinks.map((l, i) => (
                <a key={l.href} href={l.href} onClick={close}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", textDecoration: "none", animation: `itemIn 0.4s ease ${0.1 + i * 0.06}s both` }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 3 }}>{l.label}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>{l.desc}</div>
                  </div>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(124,184,168,0.1)", border: "1px solid rgba(124,184,168,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </a>
              ))}
            </div>

            {isLoggedIn ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/dashboard" onClick={close}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px", background: "#7CB8A8", borderRadius: 14, fontSize: 15, fontWeight: 700, color: "#193B5E", textDecoration: "none", animation: "itemIn 0.4s ease 0.4s both" }}>
                  Mon espace →
                </Link>
                <button onClick={() => { close(); signOut({ callbackUrl: "/" }); }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "15px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", animation: "itemIn 0.4s ease 0.45s both" }}>
                  Déconnexion
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/login" onClick={close}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "15px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, fontSize: 15, fontWeight: 700, color: "#fff", textDecoration: "none", animation: "itemIn 0.4s ease 0.4s both" }}>
                  Connexion
                </Link>
                <Link href="/pro/contact" onClick={close}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px", background: "#7CB8A8", borderRadius: 14, fontSize: 15, fontWeight: 700, color: "#193B5E", textDecoration: "none", animation: "itemIn 0.4s ease 0.45s both" }}>
                  Réserver une démo
                </Link>
              </div>
            )}
          </div>

          <div style={{ padding: "20px 24px 40px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>© 2026 BuyMonth</p>
            <a href="mailto:info@buymonth.be" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>info@buymonth.be</a>
          </div>
        </div>
      )}

      {/* Spacer pour compenser la nav fixed */}
      <div style={{ height: navH }} aria-hidden="true" />
    </>
  );
}