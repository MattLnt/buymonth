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
  1: "Mise en relation", 2: "Intégration Métier",
  3: "Communication & Transition", 4: "Full Premium",
};
const packCommissions = { 1: "1,5%", 2: "3,5%", 3: "3,5%", 4: "5%" };

export default async function DemandesVendeurPage() {
  const session = await getServerSession(authOptions);

  const vendeur = await prisma.vendeur.findUnique({
    where: { userId: session.user.id },
    include: {
      opportunites: {
        include: {
          deblocages: {
            where: { paidAt: { not: null } },
            include: {
              acheteur: {
                include: {
                  user: { select: { email: true } },
                },
              },
              conversation: true,
            },
            orderBy: { paidAt: "desc" },
          },
        },
      },
    },
  });

  const tousDeblocages = vendeur?.opportunites.flatMap(opp =>
    opp.deblocages.map(d => ({ ...d, opportunite: opp }))
  ).sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt)) || [];

  for (const d of tousDeblocages) {
    if (!d.conversation) {
      await prisma.conversation.create({ data: { deblocageId: d.id } });
      d.conversation = await prisma.conversation.findUnique({ where: { deblocageId: d.id } });
    }
  }

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        @media (max-width: 1024px) {
          .dem-card { grid-template-columns: 1fr !important; gap: 14px !important; padding: 18px !important; }
          .dem-header h1 { font-size: 20px !important; }
          .dem-stats-grid { grid-template-columns: repeat(3, auto) !important; }
        }
      `}</style>

      <div className="dem-header" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#141414", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
          Mes acheteurs potentiels
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
          {tousDeblocages.length} acheteur{tousDeblocages.length > 1 ? "s" : ""} {tousDeblocages.length > 1 ? "ont" : "a"} débloqué vos dossiers
        </p>
      </div>

      {tousDeblocages.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "60px 24px", textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "#F9FAFB", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#9CA3AF" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#141414", margin: "0 0 6px" }}>Aucun acheteur potentiel pour l'instant</p>
          <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Quand un acheteur débloque un de vos dossiers, il apparaîtra ici.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {tousDeblocages.map((d) => {
            const a = d.acheteur;
            const hasProfile = a.nomBureau || a.nomCEO || a.chiffreAffaires || a.nombreClients || a.activites?.length > 0;

            return (
              <div key={d.id} className="dem-card" style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

                {/* Infos dossier */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#141414" }}>{d.opportunite.province}</span>
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "rgba(255,90,31,0.1)", color: "#C2410C" }}>
                      {formatTypeDeal(d.opportunite.typeDeal)}
                    </span>
                  </div>

                  <div className="dem-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: "0 20px", marginBottom: 14 }}>
                    {[
                      { label: "CA annuel", value: `${(d.opportunite.chiffreAffaires / 1000).toFixed(0)}k €` },
                      { label: "Clients", value: d.opportunite.nombreClients },
                      { label: "Collab.", value: d.opportunite.nombreCollaborateurs },
                    ].map(s => (
                      <div key={s.label}>
                        <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{s.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#141414" }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {d.packCommission && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, background: "rgba(255,90,31,0.1)", border: "1px solid rgba(255,90,31,0.2)", marginBottom: 10 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#C2410C" }}>{packLabels[d.packCommission]} — {packCommissions[d.packCommission]}</span>
                    </div>
                  )}

                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
                    Débloqué le {new Date(d.paidAt).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </div>

                {/* Profil acheteur + actions */}
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>

                  {/* Identité */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 14, borderBottom: "1px solid #F9FAFB" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: "#141414", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5A1F", flexShrink: 0, fontSize: 16, fontWeight: 700 }}>
                      {(a.nomBureau || a.user.email)[0].toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Acheteur intéressé</p>
                      {a.nomBureau && (
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#141414", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.nomBureau}</p>
                      )}
                      <p style={{ fontSize: 11, color: "#9CA3AF", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.user.email}</p>
                    </div>
                  </div>

                  {/* Infos profil */}
                  {hasProfile && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {a.nomCEO && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="1.5" style={{ flexShrink: 0 }}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          <span style={{ fontSize: 12, color: "#374151" }}>{a.nomCEO}</span>
                        </div>
                      )}
                      {a.adresse && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="1.5" style={{ flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          <span style={{ fontSize: 12, color: "#374151" }}>{a.adresse}</span>
                        </div>
                      )}
                      {a.siteInternet && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="1.5" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                          <a href={a.siteInternet.startsWith("http") ? a.siteInternet : `https://${a.siteInternet}`} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: 12, color: "#FF5A1F", textDecoration: "none", fontWeight: 500 }}>{a.siteInternet}</a>
                        </div>
                      )}

                      {/* Stats */}
                      {(a.chiffreAffaires || a.nombreClients || a.nombreCollaborateurs) && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 6 }}>
                          {a.chiffreAffaires && (
                            <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "8px 10px", textAlign: "center", border: "1px solid #F3F4F6" }}>
                              <div style={{ fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3, fontWeight: 600 }}>CA</div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#FF5A1F" }}>{(a.chiffreAffaires / 1000).toFixed(0)}k €</div>
                            </div>
                          )}
                          {a.nombreClients && (
                            <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "8px 10px", textAlign: "center", border: "1px solid #F3F4F6" }}>
                              <div style={{ fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3, fontWeight: 600 }}>Clients</div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#141414" }}>{a.nombreClients.toLocaleString("fr-BE")}</div>
                            </div>
                          )}
                          {a.nombreCollaborateurs && (
                            <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "8px 10px", textAlign: "center", border: "1px solid #F3F4F6" }}>
                              <div style={{ fontSize: 9, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3, fontWeight: 600 }}>Collab.</div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#141414" }}>{a.nombreCollaborateurs}</div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Activités */}
                      {a.activites?.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                          {a.activites.map(act => (
                            <span key={act} style={{ fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: "rgba(255,90,31,0.1)", color: "#C2410C", border: "1px solid rgba(255,90,31,0.15)" }}>{act}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {!hasProfile && (
                    <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0, fontStyle: "italic" }}>Profil acheteur non complété</p>
                  )}

                  {/* Actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4, borderTop: "1px solid #F9FAFB" }}>
                    <a href={`mailto:${a.user.email}`}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 8, background: "#F9FAFB", color: "#374151", fontSize: 12, fontWeight: 600, textDecoration: "none", border: "1px solid #F3F4F6" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      Contacter par email
                    </a>
                    <Link href={`/dashboard/vendeur/messages${d.conversation ? `?conv=${d.conversation.id}` : ""}`}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 8, background: "#141414", color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                      Messagerie interne
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}