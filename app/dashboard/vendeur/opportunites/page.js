import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import OpportuniteActions from "./OpportuniteActions";

export default async function MesOpportunitesPage() {
  const session = await getServerSession(authOptions);

  const vendeur = await prisma.vendeur.findUnique({
    where: { userId: session.user.id },
    include: {
      opportunites: {
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { deblocages: { where: { paidAt: { not: null } } } } }
        }
      },
    },
  });

  const opportunites = vendeur?.opportunites || [];

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        @media (max-width: 1024px) {
          .opp-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; margin-bottom: 20px !important; }
          .opp-header h1 { font-size: 20px !important; }
          .opp-card-inner { flex-direction: column !important; gap: 14px !important; }
          .opp-actions-row { order: -1 !important; }
        }
      `}</style>

      <div className="opp-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#141414", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Mes opportunités</h1>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>{opportunites.length} dossier{opportunites.length > 1 ? "s" : ""} déposé{opportunites.length > 1 ? "s" : ""}</p>
        </div>
        <Link href="/dashboard/vendeur/nouvelle-opportunite"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#141414", color: "#fff", padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouvelle opportunité
        </Link>
      </div>

      {opportunites.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "60px 24px", textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "#F9FAFB", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#9CA3AF" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#141414", margin: "0 0 6px" }}>Aucun dossier déposé</p>
          <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 20px" }}>Déposez votre premier dossier pour le rendre visible aux acheteurs.</p>
          <Link href="/dashboard/vendeur/nouvelle-opportunite"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#141414", color: "#fff", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            Déposer un dossier
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {opportunites.map((opp) => (
            <div key={opp.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "18px 20px", opacity: opp.status === "HIDDEN" ? 0.7 : 1 }}>

              <div className="opp-card-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>

                {/* Infos */}
                <div style={{ flex: 1, minWidth: 0 }}>

                  {/* Ligne 1 : province + statut */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#141414", margin: 0 }}>{opp.province}</h3>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: opp.status === "ACTIVE" ? "#F0FDF4" : opp.status === "HIDDEN" ? "#F9FAFB" : "#FFFBEB", color: opp.status === "ACTIVE" ? "#10B981" : opp.status === "HIDDEN" ? "#9CA3AF" : "#F59E0B" }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} />
                      {opp.status === "ACTIVE" ? "En ligne" : opp.status === "HIDDEN" ? "Masquée" : "À valider"}
                    </span>
                  </div>

                  {/* Ligne 2 : tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "rgba(255,90,31,0.1)", color: "#C2410C" }}>
                      {Array.isArray(opp.typeDeal) ? opp.typeDeal.map(t => t.replace(/_/g, " ")).join(", ") : opp.typeDeal}
                    </span>
                    {opp.activites.slice(0, 3).map(a => (
                      <span key={a} style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "#F3F4F6", color: "#374151" }}>{a}</span>
                    ))}
                    {opp.activites.length > 3 && (
                      <span style={{ padding: "3px 8px", borderRadius: 20, fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>+{opp.activites.length - 3}</span>
                    )}
                  </div>

                  {/* Stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, auto)", gap: "0 24px", marginBottom: 12 }}>
                    {[
                      { label: "CA annuel", value: `${(opp.chiffreAffaires / 1000).toFixed(0)}k €` },
                      { label: "Clients", value: opp.nombreClients.toLocaleString("fr-BE") },
                      { label: "Collab.", value: opp.nombreCollaborateurs },
                      { label: "Déblocages", value: opp._count.deblocages, accent: opp._count.deblocages > 0 },
                    ].map(s => (
                      <div key={s.label}>
                        <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{s.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: s.accent ? "#FF5A1F" : "#141414" }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: 11, color: "#D1D5DB" }}>
                    Déposée le {new Date(opp.createdAt).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </div>

                {/* Actions — desktop droite, mobile en bas */}
                <div className="opp-actions-row" style={{ flexShrink: 0 }}>
                  <OpportuniteActions opportunite={opp} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}