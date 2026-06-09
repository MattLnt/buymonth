import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeblocageButton from "./DeblocageButton";

const formatTypeDeal = (typeDeal) => {
  if (!typeDeal) return "";
  if (Array.isArray(typeDeal)) return typeDeal.map(t => t.replace(/_/g, " ")).join(", ");
  return typeDeal.replace(/_/g, " ");
};

export default async function OpportuniteDetailPage({ params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const acheteur = await prisma.acheteur.findUnique({ where: { userId: session.user.id } });
  if (!acheteur || acheteur.subStatus !== "active") redirect("/dashboard/acheteur/forfait");

  const opportunite = await prisma.opportunite.findUnique({ where: { id } });
  if (!opportunite || opportunite.status !== "ACTIVE") redirect("/dashboard/acheteur/opportunites");

  await prisma.$transaction([
    prisma.vueOpportunite.create({ data: { opportuniteId: id, type: "abonne" } }),
    prisma.opportunite.update({ where: { id }, data: { vuesAbonnes: { increment: 1 } } }),
  ]);

  const deblocage = await prisma.deblocage.findUnique({
    where: { acheteurId_opportuniteId: { acheteurId: acheteur.id, opportuniteId: opportunite.id } },
    include: { conversation: true },
  });

  const isDebloque = deblocage?.paidAt !== null && deblocage?.paidAt !== undefined;

  let vendeur = null;
  if (isDebloque) {
    vendeur = await prisma.vendeur.findUnique({
      where: { id: opportunite.vendeurId },
      select: { nomBureau: true, nomCEO: true, emailContact: true, telephone: true, adresse: true, numeroBce: true },
    });
  }

  const pointsDeVente = (opportunite.adressesComplementaires || []).filter(a => a.trim());

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .opp-detail-grid { grid-template-columns: 1fr !important; }
          .opp-detail-sticky { position: static !important; }
          .opp-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 13, color: "#6B7280" }}>
        <Link href="/dashboard/acheteur/opportunites" style={{ color: "#6B7280", textDecoration: "none" }}>Opportunités</Link>
        <span>→</span>
        <span style={{ color: "#141414", fontWeight: 500 }}>Dossier #{opportunite.id.slice(-6).toUpperCase()}</span>
      </div>

      <div className="opp-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 20, alignItems: "start" }}>

        {/* COLONNE PRINCIPALE */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Header */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "rgba(255,90,31,0.1)", color: "#C2410C" }}>
                    {formatTypeDeal(opportunite.typeDeal)}
                  </span>
                  {opportunite.activites.map(a => (
                    <span key={a} style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "#F3F4F6", color: "#374151" }}>{a}</span>
                  ))}
                </div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#141414", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
                  {opportunite.province}
                </h1>
                <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
                  Dossier déposé le {new Date(opportunite.createdAt).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "#F0FDF4", color: "#10B981" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                Dossier actif
              </span>
            </div>

            <div className="opp-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { label: "Chiffre d'affaires annuel", value: `${opportunite.chiffreAffaires.toLocaleString("fr-BE")} €`, highlight: true },
                { label: "Nombre de clients", value: opportunite.nombreClients.toLocaleString("fr-BE") },
                { label: "Collaborateurs", value: opportunite.nombreCollaborateurs },
              ].map((s) => (
                <div key={s.label} style={{ background: s.highlight ? "#141414" : "#F9FAFB", borderRadius: 12, padding: "16px" }}>
                  <div style={{ fontSize: 11, color: s.highlight ? "#6B7280" : "#9CA3AF", marginBottom: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.highlight ? "#FF5A1F" : "#141414" }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Détails */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "24px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#141414", margin: "0 0 16px" }}>Détails du dossier</h2>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { label: "Type de transaction", value: formatTypeDeal(opportunite.typeDeal) },
                { label: "Province", value: opportunite.province },
                { label: "Activités", value: opportunite.activites.join(", ") },
                { label: "Présence du dirigeant", value: opportunite.presenceDirigeant === "OUI" ? "Oui, après la cession" : opportunite.presenceDirigeant === "OUI_PROVISOIRE" ? "Oui, provisoirement" : "Non" },
                ...(opportunite.venteImmeuble !== null ? [{ label: "Vente de l'immeuble incluse", value: opportunite.venteImmeuble ? "Oui" : "Non" }] : []),
                ...(opportunite.dossierDigitalise !== null ? [{ label: "Dossiers digitalisés", value: opportunite.dossierDigitalise ? "Oui" : "Non" }] : []),
                ...(opportunite.logiciels ? [{ label: "Logiciels utilisés", value: opportunite.logiciels }] : []),
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F9FAFB", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#141414", textAlign: "right" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bureaux */}
          {pointsDeVente.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "24px" }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#141414", margin: "0 0 16px" }}>Bureaux</h2>
              {isDebloque ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {pointsDeVente.map((addr, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#F9FAFB", borderRadius: 10 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span style={{ fontSize: 13, color: "#374151" }}>{addr}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "#F9FAFB", borderRadius: 10, border: "1px dashed #E5E7EB" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5A1F", flexShrink: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#141414", margin: "0 0 2px" }}>
                      {pointsDeVente.length} bureau{pointsDeVente.length > 1 ? "x" : ""} supplémentaire{pointsDeVente.length > 1 ? "s" : ""}
                    </p>
                    <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>Les adresses seront accessibles après déblocage du dossier.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {opportunite.description && (
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "24px" }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#141414", margin: "0 0 12px" }}>Informations complémentaires</h2>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0 }}>{opportunite.description}</p>
            </div>
          )}
        </div>

        {/* COLONNE DROITE */}
        <div className="opp-detail-sticky" style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 12 }}>

          {!isDebloque ? (
            <div style={{ background: "#141414", borderRadius: 16, padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,90,31,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5A1F", flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                </div>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>Débloquer ce dossier</h2>
                  <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>699 € · Accès permanent</p>
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 14px", marginBottom: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", margin: "0 0 8px", letterSpacing: "0.05em" }}>CE QUE VOUS OBTENEZ</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {[
                    "Nom et coordonnées complètes du vendeur",
                    "Email, téléphone et adresse du cabinet",
                    "Adresses des bureaux supplémentaires",
                    "Numéro BCE vérifié",
                    "Messagerie sécurisée avec le vendeur",
                    "Accompagnement selon le pack choisi",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ fontSize: 12, color: "#D1D5DB", lineHeight: 1.4 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, padding: "12px 14px", background: "rgba(255,90,31,0.08)", borderRadius: 10, border: "1px solid rgba(255,90,31,0.2)" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>Déblocage unique</div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>+ commission si transaction aboutie</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#FF5A1F" }}>699 €</div>
                  <div style={{ fontSize: 10, color: "#6B7280" }}>non remboursable</div>
                </div>
              </div>

              <DeblocageButton opportuniteId={opportunite.id} chiffreAffaires={opportunite.chiffreAffaires} />
            </div>

          ) : (
            vendeur && (
              <div style={{ background: "#F0FDF4", borderRadius: 16, border: "1px solid #BBF7D0", padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid #DCFCE7" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", color: "#16A34A", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <div>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "#15803D", margin: 0 }}>Coordonnées débloquées</h2>
                    <p style={{ fontSize: 12, color: "#16A34A", margin: 0 }}>Accès permanent</p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  {[
                    { label: "Cabinet", value: vendeur.nomBureau },
                    { label: "Dirigeant", value: vendeur.nomCEO },
                    { label: "Email", value: vendeur.emailContact },
                    { label: "Téléphone", value: vendeur.telephone || "Non renseigné" },
                    { label: "Adresse", value: vendeur.adresse || "Non renseignée" },
                  ].map((item) => (
                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #DCFCE7", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "#16A34A", fontWeight: 500 }}>{item.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#14532D" }}>{item.value}</span>
                    </div>
                  ))}

                  {vendeur.numeroBce && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "#16A34A", fontWeight: 500 }}>Numéro BCE</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#14532D" }}>{vendeur.numeroBce}</span>
                        <a href={`https://kbopub.economie.fgov.be/kbopub/toonondernemingps.html?ondernemingsnummer=${vendeur.numeroBce}&lang=fr`}
                          target="_blank" rel="noopener noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "#16A34A", background: "#DCFCE7", border: "1px solid #BBF7D0", padding: "4px 10px", borderRadius: 20, textDecoration: "none" }}>
                          Consulter
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {deblocage?.conversation && (
                  <Link href={`/dashboard/acheteur/messages?conv=${deblocage.conversation.id}`}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#15803D", color: "#fff", padding: "12px", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none", marginTop: 16 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                    Contacter le vendeur
                  </Link>
                )}
              </div>
            )
          )}

          <Link href="/dashboard/acheteur/opportunites"
            style={{ display: "block", textAlign: "center", background: "#fff", color: "#141414", padding: "11px", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid #E5E7EB" }}>
            ← Retour aux opportunités
          </Link>
        </div>
      </div>
    </div>
  );
}