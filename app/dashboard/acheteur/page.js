import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardAcheteurPage() {
  const session = await getServerSession(authOptions);

  const acheteur = await prisma.acheteur.findUnique({
    where: { userId: session.user.id },
    include: {
      deblocages: {
        where: { paidAt: { not: null } },
        include: {
          opportunite: {
            select: {
              id: true,
              province: true,
              chiffreAffaires: true,
              typeDeal: true,
              status: true,
            }
          }
        },
        orderBy: { paidAt: "desc" },
      }
    },
  });

  const deblocages = acheteur?.deblocages || [];
  const totalOpportunites = await prisma.opportunite.count({ where: { status: "ACTIVE" } });
  const today = new Date().toLocaleDateString("fr-BE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const formatTypeDeal = (t) => {
    if (!t) return "";
    if (Array.isArray(t)) return t.map(x => x.replace(/_/g, " ")).join(", ");
    return t.replace(/_/g, " ");
  };

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        @media (max-width: 1024px) {
          .ach-dash-header { flex-direction: column !important; align-items: flex-start !important; gap: 14px !important; margin-bottom: 20px !important; }
          .ach-dash-stats { grid-template-columns: 1fr 1fr !important; gap: 10px !important; margin-bottom: 20px !important; }
          .ach-dash-grid { grid-template-columns: 1fr !important; gap: 14px !important; }
          .ach-dash-actions { display: none !important; }
          .ach-dash-stat-value { font-size: 28px !important; }
        }
      `}</style>

      <div className="ach-dash-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 4px", textTransform: "capitalize" }}>{today}</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#141414", margin: 0, letterSpacing: "-0.02em" }}>Vue d'ensemble</h1>
        </div>
        <Link href="/dashboard/acheteur/opportunites"
          style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#141414", color: "#fff", padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Parcourir les dossiers
        </Link>
      </div>

      {/* Stats */}
      <div className="ach-dash-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 32 }}>
        {[
          { label: "Dossiers disponibles", value: totalOpportunites, sub: "dossiers actifs sur la plateforme", color: "#141414", bg: "#F3F4F6", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
          { label: "Dossiers débloqués", value: deblocages.length, sub: "dossiers consultés", color: "#FF5A1F", bg: "rgba(255,90,31,0.08)", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> },
          { label: "Mises en relation", value: deblocages.filter(d => d.contactDemande).length, sub: "contacts initiés", color: "#10B981", bg: "#F0FDF4", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
        ].map((stat) => (
          <div key={stat.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <p style={{ fontSize: 12, color: "#6B7280", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>{stat.label}</p>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color, flexShrink: 0 }}>{stat.icon}</div>
            </div>
            <div className="ach-dash-stat-value" style={{ fontSize: 34, fontWeight: 700, color: "#141414", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 6 }}>{stat.value}</div>
            <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="ach-dash-grid" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>

        {/* Table dossiers */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#141414", margin: "0 0 2px" }}>Dossiers débloqués</h2>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>{deblocages.length} dossier{deblocages.length > 1 ? "s" : ""} consulté{deblocages.length > 1 ? "s" : ""}</p>
            </div>
            <Link href="/dashboard/acheteur/dossiers" style={{ fontSize: 12, color: "#FF5A1F", fontWeight: 600, textDecoration: "none" }}>Voir tout →</Link>
          </div>

          {deblocages.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "#FF5A1F" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#141414", margin: "0 0 6px" }}>Aucun dossier débloqué</p>
              <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 18px", lineHeight: 1.5 }}>Parcourez les opportunités et déverrouillez les dossiers qui vous intéressent.</p>
              <Link href="/dashboard/acheteur/opportunites" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#141414", color: "#fff", padding: "10px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                Parcourir les dossiers
              </Link>
            </div>
          ) : (
            <div>
              {deblocages.slice(0, 5).map((d, i) => {
                const opp = d.opportunite;
                return (
                  <div key={d.id} style={{ padding: "12px 20px", borderBottom: i < Math.min(deblocages.length, 5) - 1 ? "1px solid #F9FAFB" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#141414" }}>
                          {opp?.province || `Dossier #${d.opportuniteId.slice(-6).toUpperCase()}`}
                        </span>
                        {opp?.typeDeal && (
                          <span style={{ fontSize: 10, fontWeight: 600, color: "#C2410C", background: "rgba(255,90,31,0.1)", padding: "2px 7px", borderRadius: 20 }}>
                            {formatTypeDeal(opp.typeDeal)}
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {opp?.chiffreAffaires && (
                          <span style={{ fontSize: 11, color: "#FF5A1F", fontWeight: 600 }}>
                            {(opp.chiffreAffaires / 1000).toFixed(0)}k € CA annuel
                          </span>
                        )}
                        <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                          {new Date(d.paidAt).toLocaleDateString("fr-BE")}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: d.contactDemande ? "#F0FDF4" : "#F9FAFB", color: d.contactDemande ? "#10B981" : "#6B7280" }}>
                        {d.contactDemande ? "Contacté" : "Débloqué"}
                      </span>
                      {opp && (
                        <Link href={`/dashboard/acheteur/opportunites/${opp.id}`}
                          style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 8, background: "#141414", color: "#fff", fontSize: 11, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>
                          Voir →
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Colonne droite */}
        <div className="ach-dash-actions" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "#141414", borderRadius: 16, padding: "20px" }}>
            <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 6px", letterSpacing: "0.05em" }}>MON ABONNEMENT</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>
              {acheteur?.subStatus === "active" ? "Plan Acheteur actif" : "Aucun abonnement"}
            </p>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 14px" }}>
              {acheteur?.subStatus === "active" ? "59 € / mois · sans engagement" : "Accédez aux dossiers pour 59€/mois"}
            </p>
            <Link href="/dashboard/acheteur/forfait" style={{ display: "block", textAlign: "center", background: "#FF5A1F", color: "#141414", padding: "9px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              {acheteur?.subStatus === "active" ? "Gérer l'abonnement" : "S'abonner"}
            </Link>
          </div>

          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "18px 20px" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#141414", margin: "0 0 14px" }}>Actions rapides</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Voir les dossiers", href: "/dashboard/acheteur/opportunites" },
                { label: "Mes messages", href: "/dashboard/acheteur/messages" },
                { label: "Mon profil", href: "/dashboard/acheteur/profil" },
              ].map((a) => (
                <Link key={a.href} href={a.href} style={{ display: "block", padding: "10px 14px", borderRadius: 9, background: "#F9FAFB", color: "#141414", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
                  {a.label}
                </Link>
              ))}
            </div>
          </div>

          <div style={{ background: "rgba(255,90,31,0.08)", borderRadius: 16, border: "1px solid rgba(255,90,31,0.2)", padding: "18px 20px" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#C2410C", margin: "0 0 8px" }}>Déblocage de dossier</h3>
            <p style={{ fontSize: 12, color: "#C2410C", margin: 0, lineHeight: 1.6 }}>
              Accédez aux coordonnées complètes d'un vendeur pour <strong>699 €</strong> par dossier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}