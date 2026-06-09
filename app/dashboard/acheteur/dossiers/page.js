import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const formatTypeDeal = (typeDeal) => {
  if (!typeDeal) return "";
  if (Array.isArray(typeDeal)) return typeDeal.map(t => t.replace(/_/g, " ")).join(", ");
  return typeDeal.replace(/_/g, " ");
};

const packLabels = {
  1: "Mise en relation",
  2: "Intégration Métier",
  3: "Communication & Transition",
  4: "Full Premium",
};

const packCommissions = {
  1: "1,5%",
  2: "3,5%",
  3: "3,5%",
  4: "5%",
};

export default async function DossiersDebloques() {
  const session = await getServerSession(authOptions);

  const acheteur = await prisma.acheteur.findUnique({
    where: { userId: session.user.id },
    include: {
      deblocages: {
        where: { paidAt: { not: null } },
        include: { opportunite: true },
        orderBy: { paidAt: "desc" },
      },
    },
  });

  const deblocages = acheteur?.deblocages || [];

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        @media (max-width: 1024px) {
          .dos-card { flex-direction: column !important; align-items: flex-start !important; gap: 14px !important; padding: 16px !important; }
          .dos-btn { width: 100% !important; text-align: center !important; justify-content: center !important; }
          .dos-stats { grid-template-columns: repeat(2, auto) !important; gap: 12px 20px !important; }
          .dos-header h1 { font-size: 20px !important; }
        }
      `}</style>

      <div className="dos-header" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#141414", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
          Dossiers débloqués
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
          {deblocages.length} dossier{deblocages.length > 1 ? "s" : ""} débloqué{deblocages.length > 1 ? "s" : ""}
        </p>
      </div>

      {deblocages.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "60px 24px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#FF5A1F" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#141414", margin: "0 0 8px" }}>Aucun dossier débloqué</p>
          <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 24px" }}>Parcourez les opportunités et déverrouillez les dossiers qui vous intéressent.</p>
          <Link href="/dashboard/acheteur/opportunites" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#141414", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            Voir les opportunités
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {deblocages.map((d) => (
            <div key={d.id} className="dos-card" style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "rgba(255,90,31,0.1)", color: "#C2410C" }}>
                    {formatTypeDeal(d.opportunite.typeDeal)}
                  </span>
                  <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "#F3F4F6", color: "#374151" }}>
                    {d.opportunite.province}
                  </span>
                  {d.packCommission && (
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "rgba(255,90,31,0.1)", color: "#C2410C", border: "1px solid rgba(255,90,31,0.2)" }}>
                      Pack {d.packCommission} — {packCommissions[d.packCommission]}
                    </span>
                  )}
                </div>

                <div className="dos-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: "0 24px", marginBottom: 10 }}>
                  {[
                    { label: "CA annuel", value: `${(d.opportunite.chiffreAffaires / 1000).toFixed(0)}k €` },
                    { label: "Clients", value: d.opportunite.nombreClients.toLocaleString("fr-BE") },
                    { label: "Activités", value: d.opportunite.activites.slice(0, 2).join(", ") },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{s.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#141414" }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                {d.packCommission && (
                  <div style={{ fontSize: 12, color: "#6B7280" }}>
                    {packLabels[d.packCommission]} · Débloqué le {new Date(d.paidAt).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                )}
              </div>

              <Link className="dos-btn" href={`/dashboard/acheteur/opportunites/${d.opportuniteId}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#141414", color: "#fff", padding: "10px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", flexShrink: 0 }}>
                Voir les coordonnées →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}