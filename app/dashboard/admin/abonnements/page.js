import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminFilters from "../AdminFilters";

export default async function AdminAbonnementsPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const subStatus = params?.subStatus || "";
  const search = params?.search || "";

  const acheteurs = await prisma.acheteur.findMany({
    include: {
      user: { select: { email: true, createdAt: true } },
      deblocages: { where: { paidAt: { not: null } } },
    },
    orderBy: { user: { createdAt: "desc" } },
  });

  const filtered = acheteurs.filter(a => {
    if (subStatus && a.subStatus !== subStatus) return false;
    if (search && !a.user.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const abonnesActifs = acheteurs.filter(a => a.subStatus === "active");
  const abonnesRetard = acheteurs.filter(a => a.subStatus === "past_due");
  const totalDeblocages = acheteurs.reduce((acc, a) => acc + a.deblocages.length, 0);
  const mrr = abonnesActifs.length * 59;
  const revenusDeblocages = totalDeblocages * 699;

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        @media (max-width: 1024px) {
          .adm-abo-stats { grid-template-columns: 1fr 1fr !important; }
          .adm-abo-table { display: none !important; }
          .adm-abo-cards { display: flex !important; }
          .adm-abo-header h1 { font-size: 20px !important; }
        }
        @media (min-width: 1025px) { .adm-abo-cards { display: none !important; } }
      `}</style>

      <div className="adm-abo-header" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#141414", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Abonnements</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>{abonnesActifs.length} abonné{abonnesActifs.length > 1 ? "s" : ""} actif{abonnesActifs.length > 1 ? "s" : ""}</p>
      </div>

      <div className="adm-abo-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "MRR", value: `${mrr} €`, sub: "Revenu mensuel", color: "#10B981" },
          { label: "Abonnés actifs", value: abonnesActifs.length, sub: `${abonnesRetard.length} en retard`, color: "#141414" },
          { label: "Déblocages", value: totalDeblocages, sub: "Total payés", color: "#FF5A1F" },
          { label: "Revenus déblocages", value: `${revenusDeblocages.toLocaleString("fr-BE")} €`, sub: "Total cumulé", color: "#141414" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "18px 20px" }}>
            <p style={{ fontSize: 11, color: "#9CA3AF", margin: "0 0 8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color, letterSpacing: "-0.02em", marginBottom: 4 }}>{s.value}</div>
            <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <AdminFilters
        basePath="/dashboard/admin/abonnements"
        values={{ search, subStatus }}
        hasFilters={!!(search || subStatus)}
        filters={[
          { name: "search", type: "text", placeholder: "Rechercher par email..." },
          {
            name: "subStatus", type: "select", placeholder: "Tous les statuts",
            options: [
              { value: "active", label: "Actif" },
              { value: "past_due", label: "Retard de paiement" },
              { value: "canceled", label: "Annulé" },
            ]
          },
        ]}
      />

      {/* TABLE DESKTOP */}
      <div className="adm-abo-table" style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 130px 100px 120px 120px", padding: "10px 24px", background: "#F9FAFB", borderBottom: "1px solid #F3F4F6" }}>
          {["Email", "Abonnement", "Déblocages", "Revenus", "Inscription"].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: "32px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Aucun résultat.</p>
          </div>
        ) : filtered.map((a, i) => (
          <div key={a.id} style={{ display: "grid", gridTemplateColumns: "1fr 130px 100px 120px 120px", padding: "14px 24px", borderBottom: i < filtered.length - 1 ? "1px solid #F9FAFB" : "none", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#141414", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.user.email}</div>
            <div>
              <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: a.subStatus === "active" ? "#F0FDF4" : a.subStatus === "past_due" ? "#FEF3C7" : "#F9FAFB", color: a.subStatus === "active" ? "#10B981" : a.subStatus === "past_due" ? "#D97706" : "#6B7280" }}>
                {a.subStatus === "active" ? "Actif" : a.subStatus === "past_due" ? "Retard" : a.subStatus === "canceled" ? "Annulé" : "Inactif"}
              </span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#141414" }}>{a.deblocages.length}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#10B981" }}>
              {a.deblocages.length > 0 ? `${(a.deblocages.length * 699).toLocaleString("fr-BE")} €` : "—"}
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF" }}>{new Date(a.user.createdAt).toLocaleDateString("fr-BE")}</div>
          </div>
        ))}
      </div>

      {/* CARDS MOBILE */}
      <div className="adm-abo-cards" style={{ flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "32px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Aucun résultat.</p>
          </div>
        ) : filtered.map((a) => (
          <div key={a.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#141414", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 10 }}>{a.user.email}</div>
              <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, flexShrink: 0, background: a.subStatus === "active" ? "#F0FDF4" : a.subStatus === "past_due" ? "#FEF3C7" : "#F9FAFB", color: a.subStatus === "active" ? "#10B981" : a.subStatus === "past_due" ? "#D97706" : "#6B7280" }}>
                {a.subStatus === "active" ? "Actif" : a.subStatus === "past_due" ? "Retard" : a.subStatus === "canceled" ? "Annulé" : "Inactif"}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[
                { label: "Déblocages", value: a.deblocages.length },
                { label: "Revenus", value: a.deblocages.length > 0 ? `${(a.deblocages.length * 699).toLocaleString("fr-BE")} €` : "—" },
                { label: "Inscription", value: new Date(a.user.createdAt).toLocaleDateString("fr-BE") },
              ].map(s => (
                <div key={s.label} style={{ background: "#F9FAFB", borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 9, color: "#9CA3AF", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{s.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: s.label === "Revenus" ? "#10B981" : "#141414" }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}