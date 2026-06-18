"use client";
import Link from "next/link";

const NAV_ITEMS = [
  {
    key: "solution", href: "#solution", label: "Solution",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  },
  {
    key: "process", href: "#process", label: "Process",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>,
  },
  {
    key: "commencer", href: "#contact", label: "Commencer", primary: true,
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#193B5E" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  },
  {
    key: "tarifs", href: "#tarifs", label: "Tarifs",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9h4.5a1.5 1.5 0 010 3H9m0 0h4.5a1.5 1.5 0 010 3H9"/></svg>,
  },
  {
    key: "contact", href: "#contact", label: "Contact",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  },
];

export default function PublicBottomNav() {
  return (
    <>
      <style>{`
        .public-bottom-nav { display: none; }
        .public-bottom-nav-spacer { display: none; }
        @media (max-width: 1024px) {
          .public-bottom-nav { display: flex; }
          .public-bottom-nav-spacer { display: block; }
        }
      `}</style>

      <div className="public-bottom-nav-spacer" style={{ height: 72 }} />

      <nav className="public-bottom-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 150,
        background: "rgba(25,59,94,0.97)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        height: 72, alignItems: "center", justifyContent: "space-around",
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
      }}>
        {NAV_ITEMS.map(item => {
          if (item.primary) {
            return (
              <Link key={item.key} href={item.href} style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: "#7CB8A8", borderRadius: 16, padding: "10px 16px",
                textDecoration: "none", gap: 3, boxShadow: "0 4px 20px rgba(124,184,168,0.35)",
              }}>
                {item.icon}
                <span style={{ fontSize: 9, fontWeight: 700, color: "#193B5E", letterSpacing: "0.03em" }}>{item.label}</span>
              </Link>
            );
          }
          return (
            <Link key={item.key} href={item.href} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              textDecoration: "none", padding: "6px 10px", borderRadius: 12, flex: 1,
            }}>
              {item.icon}
              <span style={{ fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap" }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}