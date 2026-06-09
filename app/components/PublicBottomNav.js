"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    key: "opportunites",
    href: "/opportunites",
    label: "Opportunités",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF5A1F" : "rgba(255,255,255,0.35)"} strokeWidth={active ? 2.5 : 2}>
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    key: "tarifs",
    href: "/tarifs",
    label: "Tarifs",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF5A1F" : "rgba(255,255,255,0.35)"} strokeWidth={active ? 2.5 : 2}>
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v12M9 9h4.5a1.5 1.5 0 010 3H9m0 0h4.5a1.5 1.5 0 010 3H9"/>
      </svg>
    ),
  },
  {
    key: "commencer",
    href: "/register",
    label: "Commencer",
    primary: true,
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2.5">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    ),
  },
  {
    key: "faq",
    href: "/faq",
    label: "FAQ",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF5A1F" : "rgba(255,255,255,0.35)"} strokeWidth={active ? 2.5 : 2}>
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    key: "connexion",
    href: "/login",
    label: "Connexion",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF5A1F" : "rgba(255,255,255,0.35)"} strokeWidth={active ? 2.5 : 2}>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export default function PublicBottomNav() {
  const pathname = usePathname();

  const getActiveKey = () => {
    if (pathname.startsWith("/opportunites")) return "opportunites";
    if (pathname.startsWith("/tarifs")) return "tarifs";
    if (pathname.startsWith("/faq")) return "faq";
    if (pathname.startsWith("/contact")) return "contact";
    if (pathname.startsWith("/login")) return "connexion";
    return null;
  };

  const activeKey = getActiveKey();

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
        background: "rgba(20,20,20,0.97)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        height: 72,
        alignItems: "center",
        justifyContent: "space-around",
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
      }}>
        {NAV_ITEMS.map(item => {
          const active = activeKey === item.key;
          if (item.primary) {
            return (
              <Link key={item.key} href={item.href} style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: "#FF5A1F", borderRadius: 16, padding: "10px 16px",
                textDecoration: "none", gap: 3,
                boxShadow: "0 4px 20px rgba(255,90,31,0.35)",
              }}>
                {item.icon(false)}
                <span style={{ fontSize: 9, fontWeight: 700, color: "#141414", letterSpacing: "0.03em" }}>{item.label}</span>
              </Link>
            );
          }
          return (
            <Link key={item.key} href={item.href} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              textDecoration: "none", padding: "6px 10px", borderRadius: 12, flex: 1,
              position: "relative",
            }}>
              {item.icon(active)}
              <span style={{
                fontSize: 10, fontWeight: active ? 700 : 500,
                color: active ? "#FF5A1F" : "rgba(255,255,255,0.35)",
                letterSpacing: "0.01em", whiteSpace: "nowrap",
              }}>
                {item.label}
              </span>
              {active && (
                <div style={{
                  position: "absolute", bottom: 2,
                  width: 4, height: 4, borderRadius: "50%",
                  background: "#FF5A1F",
                }} />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}