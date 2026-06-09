import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminFilters from "../AdminFilters";
import AdminUserActions from "../AdminUserActions";

export default async function AdminAcheteurs({ searchParams }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const subStatus = params?.subStatus || "";
  const alertes = params?.alertes || "";
  const search = params?.search || "";

  const acheteurs = await prisma.acheteur.findMany({
    include: {
      user: { select: { id: true, email: true, createdAt: true } },
      deblocages: { where: { paidAt: { not: null } } },
    },
    orderBy: { user: { createdAt: "desc" } },
  });

  const filtered = acheteurs.filter(a => {
    if (subStatus && a.subStatus !== subStatus) return false;
    if (alertes === "oui" && !a.alertesEmail) return false;
    if (alertes === "non" && a.alertesEmail) return false;
    if (search && !a.user.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        @media (max-width: 1024px) {
          .adm-ach-table { display: none !important; }
          .adm-ach-cards { display: flex !important; }
          .adm-ach-header h1 { font-size: 20px !important; }
        }
        @media (min-width: 1025px) { .adm-ach-cards { display: none !important; } }
      `}</style>

      <div className="adm-ach-header" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#141414", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Acheteurs</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>{filtered.length} sur {acheteurs.length} acheteurs</p>
      </div>

      <AdminFilters
        basePath="/dashboard/admin/acheteurs"
        values={{ search, subStatus, alertes }}
        hasFilters={!!(search || subStatus || alertes)}
        filters={[
          { name: "search", type: "text", placeholder: "Rechercher par email..." },
          {
            name: "subStatus", type: "select", placeholder: "Tous les statuts",
            options: [
              { value: "active", label: "Actif" },
              { value: "past_due", label: "Retard" },
              { value: "canceled", label: "Annulé" },
            ]
          },
          {
            name: "alertes", type: "select", placeholder: "Toutes les alertes",
            options: [
              { value: "oui", label: "Alertes activées" },
              { value: "non", label: "Alertes désactivées" },
            ]
          },
        ]}
      />

      {/* TABLE DESKTOP */}
      <div className="adm-ach-table" style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", overflow: "visible" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 90px 90px 110px 56px", padding: "10px 24px", background: "#F9FAFB", borderBottom: "1px solid #F3F4F6" }}>
          {["Email", "Abonnement", "Dossiers", "Alertes", "Inscription", ""].map((h, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: "32px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Aucun acheteur trouvé.</p>
          </div>
        ) : filtered.map((a, i) => (
          <div key={a.id} style={{ display: "grid", gridTemplateColumns: "1fr 110px 90px 90px 110px 56px", padding: "14px 24px", borderBottom: i < filtered.length - 1 ? "1px solid #F9FAFB" : "none", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#141414", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.user.email}</div>
            <div>
              <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: a.subStatus === "active" ? "#F0FDF4" : a.subStatus === "past_due" ? "#FEF3C7" : "#F9FAFB", color: a.subStatus === "active" ? "#10B981" : a.subStatus === "past_due" ? "#D97706" : "#6B7280" }}>
                {a.subStatus === "active" ? "Actif" : a.subStatus === "past_due" ? "Retard" : a.subStatus === "canceled" ? "Annulé" : "Inactif"}
              </span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#141414" }}>{a.deblocages.length}</div>
            <div>
              <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: a.alertesEmail ? "rgba(255,90,31,0.1)" : "#F9FAFB", color: a.alertesEmail ? "#C2410C" : "#6B7280" }}>
                {a.alertesEmail ? "Activées" : "Désactivées"}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF" }}>{new Date(a.user.createdAt).toLocaleDateString("fr-BE")}</div>
            <div style={{ textAlign: "right" }}>
              <AdminUserActions userId={a.user.id} email={a.user.email} />
            </div>
          </div>
        ))}
      </div>

      {/* CARDS MOBILE */}
      <div className="adm-ach-cards" style={{ flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "32px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Aucun acheteur trouvé.</p>
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
                { label: "Dossiers", value: a.deblocages.length },
                { label: "Alertes", value: a.alertesEmail ? "Activées" : "Désactivées" },
                { label: "Inscription", value: new Date(a.user.createdAt).toLocaleDateString("fr-BE") },
              ].map(s => (
                <div key={s.label} style={{ background: "#F9FAFB", borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 9, color: "#9CA3AF", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{s.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#141414" }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, paddingTop: 12, borderTop: "1px solid #F9FAFB" }}>
              <AdminUserActions userId={a.user.id} email={a.user.email} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}