import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CAFilter from "./CAFilter";
import OpportuniteSwitcher from "./OpportuniteSwitcher";
import PublicNav from "@/app/components/PublicNav";
import PublicFooter from "@/app/components/PublicFooter";
import MobileHeader from "./MobileHeader";
import PublicBottomNav from "@/app/components/PublicBottomNav";
import VueTracker from "./VueTracker";

export default async function OpportunitesPubliquePage({ searchParams }) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  const provincesRaw = params?.province || [];
  const provinces = Array.isArray(provincesRaw) ? provincesRaw : provincesRaw ? [provincesRaw] : [];
  const typeDealsRaw = params?.typeDeal || [];
  const typeDeals = Array.isArray(typeDealsRaw) ? typeDealsRaw : typeDealsRaw ? [typeDealsRaw] : [];
  const caMin = params?.caMin ? parseFloat(params.caMin) : null;
  const caMax = params?.caMax ? parseFloat(params.caMax) : null;

  const where = {
    status: "ACTIVE",
    ...(provinces.length > 0 && { province: { in: provinces } }),
    ...(typeDeals.length > 0 && { typeDeal: { hasSome: typeDeals } }),
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
    select: {
      id: true,
      province: true,
      chiffreAffaires: true,
      typeDeal: true,
      activites: true,
      createdAt: true,
    },
  });

  const totalActives = await prisma.opportunite.count({ where: { status: "ACTIVE" } });

  let isAbonne = false;
  if (session?.user?.role === "ACHETEUR") {
    const acheteur = await prisma.acheteur.findUnique({
      where: { userId: session.user.id },
      select: { subStatus: true },
    });
    isAbonne = acheteur?.subStatus === "active";
  }

  const allProvinces = ["Anvers", "Bruxelles", "Flandre orientale", "Flandre occidentale", "Brabant flamand", "Brabant wallon", "Hainaut", "Liège", "Luxembourg", "Namur", "Limbourg"];
  const deals = [
    { value: "VENTE", label: "Vente" },
    { value: "FUSION", label: "Fusion" },
    { value: "OUVERTURE_CAPITAL", label: "Ouverture du capital" },
    { value: "COLLABORATION", label: "Collaboration" },
  ];

  const hasFilters = provinces.length > 0 || typeDeals.length > 0 || caMin || caMax;
  const activeCount = (provinces.length > 0 ? 1 : 0) + (typeDeals.length > 0 ? 1 : 0) + (caMin || caMax ? 1 : 0);
  const province = provinces[0] || "";
  const typeDeal = typeDeals[0] || "";

  return (
    <div style={{ minHeight: "100vh", background: "#F4F6F8", fontFamily: "var(--font-sans)" }}>
      <style>{`
        @media (max-width: 1024px) {
          .desktop-sidebar { display: none !important; }
          .desktop-nav-opportunites { display: none !important; }
          .desktop-hero { padding: 32px 16px 28px !important; }
          .desktop-hero h1 { font-size: 24px !important; }
          .desktop-content { padding: 16px 16px 90px !important; grid-template-columns: 1fr !important; }
          .desktop-footer { display: none !important; }
        }
      `}</style>

      <VueTracker opportuniteIds={opportunites.map(o => o.id)} isAbonne={isAbonne} />

      <div className="desktop-nav-opportunites">
        <PublicNav dark />
      </div>

      <MobileHeader
        province={province}
        typeDeal={typeDeal}
        caMin={caMin}
        caMax={caMax}
        hasFilters={!!hasFilters}
        activeCount={activeCount}
      />

      {/* Hero */}
      <div className="desktop-hero" style={{ background: "#141414", padding: "104px 40px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,90,31,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", background: "rgba(255,90,31,0.15)", color: "#FF5A1F", fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 20, marginBottom: 20, letterSpacing: "0.05em" }}>
            {totalActives} OPPORTUNITÉ{totalActives > 1 ? "S" : ""} DISPONIBLE{totalActives > 1 ? "S" : ""}
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 700, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Fiduciaires disponibles<br />sur le marché
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", maxWidth: 520, margin: "0 auto", lineHeight: 1.8 }}>
            Accédez à des dossiers confidentiels : cession, fusion, reprise, partenariat ou ouverture du capital.
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="desktop-content" style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "260px 1fr", gap: 24, alignItems: "start" }}>

        {/* Sidebar filtres */}
        <aside className="desktop-sidebar" style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", overflow: "visible", position: "sticky", top: 80 }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "16px 16px 0 0", overflow: "hidden" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#141414", margin: 0 }}>Filtres</h2>
            {hasFilters && (
              <Link href="/opportunites" style={{ fontSize: 12, color: "#FF5A1F", fontWeight: 600, textDecoration: "none" }}>Réinitialiser</Link>
            )}
          </div>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #F9FAFB" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>Province</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {allProvinces.map(p => (
                <OpportuniteSwitcher key={p} label={p} paramName="province" value={p} isActive={provinces.includes(p)} />
              ))}
            </div>
          </div>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #F9FAFB" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>Type de transaction</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {deals.map(d => (
                <OpportuniteSwitcher key={d.value} label={d.label} paramName="typeDeal" value={d.value} isActive={typeDeals.includes(d.value)} />
              ))}
            </div>
          </div>
          <div style={{ padding: "16px 20px" }}>
            <CAFilter currentMin={caMin} currentMax={caMax} />
          </div>
        </aside>

        {/* Liste opportunités */}
        <div>
          {!session && (
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: "14px 20px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <p style={{ fontSize: 13, color: "#6B7280", margin: 0, flex: 1 }}>
                <strong style={{ color: "#141414" }}>Version limitée</strong> — Abonnez-vous pour voir plus de détails, vous abonner aux alertes et avoir la possibilité de débloquer les coordonnées complètes.
              </p>
              <Link href="/register" style={{ background: "#141414", color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none", flexShrink: 0 }}>
                S'abonner — 59€/mois
              </Link>
            </div>
          )}

          {session?.user?.role === "ACHETEUR" && !isAbonne && (
            <div style={{ background: "#FFFBEB", borderRadius: 14, border: "1px solid #FDE68A", padding: "14px 20px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <p style={{ fontSize: 13, color: "#C2410C", margin: 0, flex: 1 }}>
                <strong>Abonnement requis</strong> — Abonnez-vous pour voir plus de détails, recevoir des alertes et débloquer les coordonnées complètes.
              </p>
              <Link href="/dashboard/acheteur/forfait" style={{ background: "#141414", color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none", flexShrink: 0 }}>
                S'abonner — 59€/mois
              </Link>
            </div>
          )}

          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>
            {opportunites.length} résultat{opportunites.length > 1 ? "s" : ""}
            {hasFilters && <span style={{ color: "#FF5A1F", marginLeft: 6, fontWeight: 600 }}>· filtré</span>}
          </div>

          {opportunites.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "48px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 16px" }}>Aucune opportunité ne correspond à vos filtres.</p>
              <Link href="/opportunites" style={{ fontSize: 13, color: "#FF5A1F", fontWeight: 600, textDecoration: "none" }}>Réinitialiser les filtres</Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {opportunites.map((opp) => (
                <div key={opp.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "22px", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "rgba(255,90,31,0.1)", color: "#C2410C" }}>
                      {Array.isArray(opp.typeDeal) ? opp.typeDeal.map(t => t.replace(/_/g, " ")).join(", ") : opp.typeDeal}
                    </span>
                    <span style={{ fontSize: 12, color: "#9CA3AF" }}>{opp.province}</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 3, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Province</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#141414" }}>{opp.province}</div>
                    </div>
                    <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 3, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Chiffre d'affaires annuel</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#141414" }}>{(opp.chiffreAffaires / 1000).toFixed(0)}k €</div>
                    </div>
                  </div>

                  <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "12px", position: "relative", overflow: "hidden" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, filter: "blur(4px)", pointerEvents: "none", userSelect: "none" }}>
                      {["Nombre de clients", "Collaborateurs", "Activités"].map(item => (
                        <div key={item} style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 12, color: "#6B7280" }}>{item}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#141414" }}>●●●</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(249,250,251,0.75)" }}>
                      {isAbonne ? (
                        <Link href={`/dashboard/acheteur/opportunites/${opp.id}`} style={{ background: "#141414", color: "#fff", padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                          Voir le dossier →
                        </Link>
                      ) : session ? (
                        <Link href="/dashboard/acheteur/forfait" style={{ background: "#141414", color: "#fff", padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                          🔒 S'abonner pour voir
                        </Link>
                      ) : (
                        <Link href="/register" style={{ background: "#141414", color: "#fff", padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                          🔒 Voir les détails
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!session && opportunites.length > 0 && (
            <div style={{ background: "#141414", borderRadius: 16, padding: "36px", textAlign: "center", marginTop: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>Accédez à tous les dossiers</h2>
              <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 auto 20px", maxWidth: 400, lineHeight: 1.7 }}>
                Abonnez-vous pour voir plus de détails, recevoir des alertes et débloquer les coordonnées complètes des vendeurs.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/register" style={{ background: "#FF5A1F", color: "#141414", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                  S'abonner — 59€/mois
                </Link>
                <Link href="/register/vendeur" style={{ background: "transparent", color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
                  Déposer une opportunité
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <PublicBottomNav />
      <div className="desktop-footer">
        <PublicFooter desktopOnly />
      </div>
    </div>
  );
}