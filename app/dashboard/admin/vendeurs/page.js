import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminFilters from "../AdminFilters";
import AdminUserActions from "../AdminUserActions";

export default async function AdminVendeurs({ searchParams }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const hasOpportunites = params?.hasOpportunites || "";
  const search = params?.search || "";

  const vendeurs = await prisma.vendeur.findMany({
    include: {
      user: { select: { id: true, email: true, createdAt: true } },
      opportunites: { select: { id: true, status: true } },
    },
    orderBy: { user: { createdAt: "desc" } },
  });

  const filtered = vendeurs.filter(v => {
    if (hasOpportunites === "oui" && v.opportunites.length === 0) return false;
    if (hasOpportunites === "non" && v.opportunites.length > 0) return false;
    if (search && !v.user.email.toLowerCase().includes(search.toLowerCase()) && !v.nomBureau?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        @media (max-width: 1024px) {
          .adm-vend-table { display: none !important; }
          .adm-vend-cards { display: flex !important; }
          .adm-vend-header h1 { font-size: 20px !important; }
        }
        @media (min-width: 1025px) { .adm-vend-cards { display: none !important; } }
      `}</style>

      <div className="adm-vend-header" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#141414", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Vendeurs</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>{filtered.length} sur {vendeurs.length} vendeurs</p>
      </div>

      <AdminFilters
        basePath="/dashboard/admin/vendeurs"
        values={{ search, hasOpportunites }}
        hasFilters={!!(search || hasOpportunites)}
        filters={[
          { name: "search", type: "text", placeholder: "Rechercher email ou bureau..." },
          {
            name: "hasOpportunites", type: "select", placeholder: "Tous les vendeurs",
            options: [
              { value: "oui", label: "Avec opportunités" },
              { value: "non", label: "Sans opportunité" },
            ]
          },
        ]}
      />

      {/* TABLE DESKTOP */}
      <div className="adm-vend-table" style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", overflow: "visible" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 150px 90px 90px 110px 56px", padding: "10px 24px", background: "#F9FAFB", borderBottom: "1px solid #F3F4F6" }}>
          {["Email", "Bureau", "Dossiers", "En ligne", "Inscription", ""].map((h, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: "32px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Aucun vendeur trouvé.</p>
          </div>
        ) : filtered.map((v, i) => {
          const actives = v.opportunites.filter(o => o.status === "ACTIVE").length;
          return (
            <div key={v.id} style={{ display: "grid", gridTemplateColumns: "1fr 150px 90px 90px 110px 56px", padding: "14px 24px", borderBottom: i < filtered.length - 1 ? "1px solid #F9FAFB" : "none", alignItems: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#141414", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.user.email}</div>
              <div style={{ fontSize: 13, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.nomBureau || "—"}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#141414" }}>{v.opportunites.length}</div>
              <div>
                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: actives > 0 ? "#F0FDF4" : "#F9FAFB", color: actives > 0 ? "#10B981" : "#6B7280" }}>
                  {actives}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>{new Date(v.user.createdAt).toLocaleDateString("fr-BE")}</div>
              <div style={{ textAlign: "right" }}>
                <AdminUserActions userId={v.user.id} email={v.user.email} />
              </div>
            </div>
          );
        })}
      </div>

      {/* CARDS MOBILE */}
      <div className="adm-vend-cards" style={{ flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "32px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Aucun vendeur trouvé.</p>
          </div>
        ) : filtered.map((v) => {
          const actives = v.opportunites.filter(o => o.status === "ACTIVE").length;
          return (
            <div key={v.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "16px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#141414", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.user.email}</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>{v.nomBureau || "Bureau non renseigné"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 10 }}>
                {[
                  { label: "Dossiers", value: v.opportunites.length },
                  { label: "En ligne", value: actives },
                  { label: "Inscription", value: new Date(v.user.createdAt).toLocaleDateString("fr-BE") },
                ].map(s => (
                  <div key={s.label} style={{ background: "#F9FAFB", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontSize: 9, color: "#9CA3AF", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{s.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: actives > 0 && s.label === "En ligne" ? "#10B981" : "#141414" }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "1px solid #F9FAFB" }}>
                <AdminUserActions userId={v.user.id} email={v.user.email} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}