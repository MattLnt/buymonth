import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SidebarFiltres from "./SidebarFiltres";

const formatTypeDeal = (typeDeal) => {
  if (!typeDeal) return "";
  if (Array.isArray(typeDeal)) return typeDeal.map(t => t.replace(/_/g, " ")).join(", ");
  return typeDeal.replace(/_/g, " ");
};

export default async function OpportunitesAcheteurPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  const acheteur = await prisma.acheteur.findUnique({
    where: { userId: session.user.id },
    include: {
      deblocages: {
        where: { paidAt: { not: null } },
        select: { opportuniteId: true },
      },
    },
  });

  const hasSubscription = acheteur?.subStatus === "active";
  const debloqueIds = new Set(acheteur?.deblocages.map(d => d.opportuniteId) || []);

  const province = params?.province ? (Array.isArray(params.province) ? params.province : [params.province]) : [];
  const typeDeal = params?.typeDeal ? (Array.isArray(params.typeDeal) ? params.typeDeal : [params.typeDeal]) : [];
  const activite = params?.activite ? (Array.isArray(params.activite) ? params.activite : [params.activite]) : [];
  const caMin = params?.caMin ? parseFloat(params.caMin) : null;
  const caMax = params?.caMax ? parseFloat(params.caMax) : null;

  const where = {
    status: "ACTIVE",
    ...(province.length > 0 && { province: { in: province } }),
    ...(typeDeal.length > 0 && { typeDeal: { hasSome: typeDeal } }),
    ...(activite.length > 0 && { activites: { hasSome: activite } }),
    ...(caMin || caMax ? {
      chiffreAffaires: {
        ...(caMin && { gte: caMin }),
        ...(caMax && { lte: caMax }),
      }
    } : {}),
  };

  const opportunites = await prisma.opportunite.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const totalActives = await prisma.opportunite.count({ where: { status: "ACTIVE" } });

  const opportunitesApercu = !hasSubscription
    ? await prisma.opportunite.findMany({ where: { status: "ACTIVE" }, take: 3, orderBy: { createdAt: "desc" } })
    : [];

  const provinces = ["Anvers", "Bruxelles", "Flandre orientale", "Flandre occidentale", "Brabant flamand", "Brabant wallon", "Hainaut", "Liège", "Luxembourg", "Namur", "Limbourg"];
  const activites = ["Comptabilité", "Fiscalité", "Création d'entreprise", "Gestion salariale", "Transmission d'entreprise", "Juridique", "Autre"];
  const deals = [
    { value: "VENTE", label: "Vente" },
    { value: "FUSION", label: "Fusion" },
    { value: "OUVERTURE_CAPITAL", label: "Ouverture du capital" },
    { value: "COLLABORATION", label: "Collaboration" },
  ];

  const hasFilters = province.length > 0 || typeDeal.length > 0 || activite.length > 0 || caMin || caMax;

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        @media (max-width: 1024px) {
          .ach-opp-grid { grid-template-columns: 1fr !important; }
          .ach-sidebar { display: none !important; }
          .ach-cards { grid-template-columns: 1fr !important; }
          .ach-opp-header h1 { font-size: 20px !important; }
        }
      `}</style>

      <div className="ach-opp-header" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#141414", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Opportunités</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
          {hasSubscription
            ? `${opportunites.length} dossier${opportunites.length > 1 ? "s" : ""} disponible${opportunites.length > 1 ? "s" : ""}`
            : `${totalActives} dossier${totalActives > 1 ? "s" : ""} disponible${totalActives > 1 ? "s" : ""} — abonnement requis`
          }
        </p>
      </div>

      {!hasSubscription ? (
        <div style={{ background: "#141414", borderRadius: 16, padding: "40px 24px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,90,31,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#FF5A1F" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>Abonnement requis</h2>
          <p style={{ fontSize: 14, color: "#9CA3AF", margin: "0 auto 24px", maxWidth: 400, lineHeight: 1.6 }}>
            Accédez à toutes les opportunités anonymisées pour <strong style={{ color: "#FF5A1F" }}>59 € / mois</strong>. Sans engagement.
          </p>
          <Link href="/dashboard/acheteur/forfait" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FF5A1F", color: "#141414", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            S'abonner — 59 € / mois
          </Link>
          {opportunitesApercu.length > 0 && (
            <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12, filter: "blur(4px)", opacity: 0.4, pointerEvents: "none" }}>
              {opportunitesApercu.map((opp) => (
                <div key={opp.id} style={{ background: "#1F2937", borderRadius: 12, padding: "20px", textAlign: "left" }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "#374151", color: "#9CA3AF" }}>
                      {formatTypeDeal(opp.typeDeal)}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[
                      { label: "CA annuel", value: `${(opp.chiffreAffaires / 1000).toFixed(0)}k €` },
                      { label: "Clients", value: opp.nombreClients },
                      { label: "Collab.", value: opp.nombreCollaborateurs },
                    ].map(s => (
                      <div key={s.label} style={{ background: "#374151", borderRadius: 8, padding: "10px" }}>
                        <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="ach-opp-grid" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20, alignItems: "start" }}>

          <div className="ach-sidebar">
            <SidebarFiltres
              province={province}
              typeDeal={typeDeal}
              activite={activite}
              caMin={caMin}
              caMax={caMax}
              provinces={provinces}
              deals={deals}
              activites={activites}
              hasFilters={hasFilters}
            />
          </div>

          <div>
            {opportunites.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "48px 24px", textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 12px" }}>Aucune opportunité ne correspond à vos filtres.</p>
                <Link href="/dashboard/acheteur/opportunites" style={{ fontSize: 13, color: "#FF5A1F", fontWeight: 600, textDecoration: "none" }}>Réinitialiser</Link>
              </div>
            ) : (
              <div className="ach-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                {opportunites.map((opp) => {
                  const isDebloque = debloqueIds.has(opp.id);
                  return (
                    <div key={opp.id} style={{ background: "#fff", borderRadius: 16, border: `1px solid ${isDebloque ? "#BBF7D0" : "#F3F4F6"}`, padding: "22px", display: "flex", flexDirection: "column", gap: 14, position: "relative" }}>

                      {isDebloque && (
                        <div style={{ position: "absolute", top: 16, right: 16, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 20, padding: "3px 10px", display: "flex", alignItems: "center", gap: 4 }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#10B981" }}>Débloqué</span>
                        </div>
                      )}

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingRight: isDebloque ? 80 : 0 }}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "rgba(255,90,31,0.1)", color: "#C2410C" }}>
                            {formatTypeDeal(opp.typeDeal)}
                          </span>
                          {opp.activites.slice(0, 1).map(a => (
                            <span key={a} style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "#F3F4F6", color: "#374151" }}>{a}</span>
                          ))}
                        </div>
                        <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500, flexShrink: 0 }}>{opp.province}</span>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        {[
                          { label: "CA annuel", value: `${(opp.chiffreAffaires / 1000).toFixed(0)}k €` },
                          { label: "Clients", value: opp.nombreClients.toLocaleString("fr-BE") },
                          { label: "Collab.", value: opp.nombreCollaborateurs },
                        ].map((s) => (
                          <div key={s.label} style={{ background: "#F9FAFB", borderRadius: 10, padding: "10px 12px" }}>
                            <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 4, fontWeight: 500 }}>{s.label}</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "#141414" }}>{s.value}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 5 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        {opp.presenceDirigeant === "OUI" ? "Dirigeant présent après cession" : opp.presenceDirigeant === "OUI_PROVISOIRE" ? "Dirigeant présent provisoirement" : "Dirigeant non présent"}
                      </div>

                      <Link href={`/dashboard/acheteur/opportunites/${opp.id}`}
                        style={{ display: "block", textAlign: "center", background: isDebloque ? "#F0FDF4" : "#141414", color: isDebloque ? "#15803D" : "#fff", border: isDebloque ? "1px solid #BBF7D0" : "none", padding: "11px", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                        {isDebloque ? "✓ Voir les coordonnées" : "Voir le dossier"}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}