import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminOpportuniteToggle from "../AdminOpportuniteToggle";
import AdminFilters from "../AdminFilters";

export default async function AdminOpportunites({ searchParams }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const status = params?.status || "";
  const province = params?.province || "";

  const where = {
    ...(status && { status }),
    ...(province && { province }),
  };

  const opportunites = await prisma.opportunite.findMany({
    where,
    include: { vendeur: { include: { user: { select: { email: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.opportunite.count();

  const provinces = ["Anvers", "Bruxelles", "Flandre orientale", "Flandre occidentale", "Brabant flamand", "Brabant wallon", "Hainaut", "Liège", "Luxembourg", "Namur", "Limbourg"];

  const statusStyle = {
    PENDING: { background: "#FFFBEB", color: "#F59E0B" },
    ACTIVE: { background: "#F0FDF4", color: "#10B981" },
    HIDDEN: { background: "#FEF2F2", color: "#EF4444" },
    CLOSED: { background: "#F9FAFB", color: "#6B7280" },
  };
  const statusLabel = { PENDING: "À valider", ACTIVE: "En ligne", HIDDEN: "Masquée", CLOSED: "Clôturée" };

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        @media (max-width: 1024px) {
          .adm-opp-table { display: none !important; }
          .adm-opp-cards { display: flex !important; }
          .adm-opp-header h1 { font-size: 20px !important; }
        }
        @media (min-width: 1025px) {
          .adm-opp-cards { display: none !important; }
        }
      `}</style>

      <div className="adm-opp-header" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#141414", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Opportunités</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>{opportunites.length} sur {total} dossiers</p>
      </div>

      <AdminFilters
        basePath="/dashboard/admin/opportunites"
        values={{ status, province }}
        hasFilters={!!(status || province)}
        filters={[
          {
            name: "status", type: "select", placeholder: "Tous les statuts",
            options: [
              { value: "ACTIVE", label: "En ligne" },
              { value: "PENDING", label: "À valider" },
              { value: "HIDDEN", label: "Masquée" },
              { value: "CLOSED", label: "Clôturée" },
            ]
          },
          {
            name: "province", type: "select", placeholder: "Toutes les provinces",
            options: provinces.map(p => ({ value: p, label: p }))
          },
        ]}
      />

      {/* TABLE DESKTOP */}
      <div className="adm-opp-table" style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 120px 100px 180px", padding: "10px 24px", background: "#F9FAFB", borderBottom: "1px solid #F3F4F6" }}>
          {["Province / Type", "Commissions", "Activités", "Statut", "Actions"].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
          ))}
        </div>
        {opportunites.length === 0 ? (
          <div style={{ padding: "32px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Aucune opportunité.</p>
          </div>
        ) : opportunites.map((opp, i) => (
          <div key={opp.id} style={{ display: "grid", gridTemplateColumns: "1fr 100px 120px 100px 180px", padding: "14px 24px", borderBottom: i < opportunites.length - 1 ? "1px solid #F9FAFB" : "none", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#141414" }}>{opp.province}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                {Array.isArray(opp.typeDeal) ? opp.typeDeal.map(t => t.replace(/_/g, " ")).join(", ") : opp.typeDeal} · {opp.vendeur?.user?.email}
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#141414" }}>{(opp.chiffreAffaires / 1000).toFixed(0)}k €</div>
            <div style={{ fontSize: 11, color: "#6B7280" }}>{opp.activites.slice(0, 2).join(", ")}</div>
            <div>
              <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, ...statusStyle[opp.status] }}>
                {statusLabel[opp.status]}
              </span>
            </div>
            <AdminOpportuniteToggle id={opp.id} currentStatus={opp.status} />
          </div>
        ))}
      </div>

      {/* CARDS MOBILE */}
      <div className="adm-opp-cards" style={{ flexDirection: "column", gap: 10 }}>
        {opportunites.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "32px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Aucune opportunité.</p>
          </div>
        ) : opportunites.map((opp) => (
          <div key={opp.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 8 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#141414" }}>{opp.province}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                  {Array.isArray(opp.typeDeal) ? opp.typeDeal.map(t => t.replace(/_/g, " ")).join(", ") : opp.typeDeal}
                </div>
              </div>
              <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, flexShrink: 0, ...statusStyle[opp.status] }}>
                {statusLabel[opp.status]}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 10 }}>
              {[
                { label: "Commissions", value: `${(opp.chiffreAffaires / 1000).toFixed(0)}k €` },
                { label: "Clients", value: opp.nombreClients },
                { label: "Activités", value: opp.activites.slice(0, 2).join(", ") || "—" },
              ].map(s => (
                <div key={s.label} style={{ background: "#F9FAFB", borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 9, color: "#9CA3AF", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{s.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#141414" }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 10 }}>{opp.vendeur?.user?.email}</div>
            <AdminOpportuniteToggle id={opp.id} currentStatus={opp.status} />
          </div>
        ))}
      </div>
    </div>
  );
}