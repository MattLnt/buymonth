import Link from "next/link";
import PublicNav from "@/app/components/PublicNav";
import PublicFooter from "@/app/components/PublicFooter";

export default function TarifsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "var(--font-sans)" }}>

      <style>{`
        @media (max-width: 768px) {
          .tarifs-hero { padding: 72px 24px 48px !important; }
          .tarifs-hero h1 { font-size: 32px !important; }
          .tarifs-section { padding: 60px 24px !important; }
          .tarifs-compare-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .tarifs-trust-row { gap: 28px !important; flex-wrap: wrap !important; }
          .tarifs-grid-2 { grid-template-columns: 1fr !important; gap: 32px !important; }
          .tarifs-prix { font-size: 40px !important; }
          .pack-detail-grid { grid-template-columns: 1fr !important; }
          .tarifs-cta { padding: 60px 24px !important; }
          .tarifs-cta h2 { font-size: 28px !important; }
          .tarifs-cta-btns { flex-direction: column !important; }
        }
      `}</style>

      <PublicNav />

      <div style={{ paddingTop: 64 }}>

        {/* Hero */}
        <div className="tarifs-hero" style={{ background: "#141414", padding: "80px 48px 70px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,90,31,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#FF5A1F", letterSpacing: "0.1em", margin: "0 0 16px" }}>TARIFS</p>
            <h1 style={{ fontSize: 52, fontWeight: 700, color: "#fff", margin: "0 0 18px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Transparent et<br />sans surprise.
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", maxWidth: 460, margin: "0 auto", lineHeight: 1.8 }}>
              Déposer est gratuit. Accéder aux dossiers commence à 59€/mois.
            </p>
          </div>
        </div>

        {/* Comparaison — style mockup */}
        <div className="tarifs-section" style={{ padding: "90px 48px", background: "#FCFBF9", position: "relative", overflow: "hidden" }}>

          {/* Lignes graphiques décoratives */}
          <svg width="420" height="260" viewBox="0 0 420 260" fill="none" style={{ position: "absolute", top: 30, right: -40, pointerEvents: "none", opacity: 0.5 }}>
            <path d="M10 230 L90 190 L170 200 L250 130 L330 110 L410 30" stroke="#FF5A1F" strokeWidth="1.5" strokeDasharray="4 5" opacity="0.45" fill="none"/>
            {[[10,230],[90,190],[170,200],[250,130],[330,110],[410,30]].map(([x,y],i) => (
              <circle key={i} cx={x} cy={y} r="3.5" fill="#FCFBF9" stroke="#FF5A1F" strokeWidth="1.5" opacity="0.6"/>
            ))}
          </svg>
          <svg width="360" height="220" viewBox="0 0 360 220" fill="none" style={{ position: "absolute", bottom: 40, left: -60, pointerEvents: "none", opacity: 0.4 }}>
            <path d="M10 190 L90 170 L170 110 L250 120 L350 30" stroke="#FF5A1F" strokeWidth="1.5" strokeDasharray="4 5" opacity="0.45" fill="none"/>
            {[[10,190],[90,170],[170,110],[250,120],[350,30]].map(([x,y],i) => (
              <circle key={i} cx={x} cy={y} r="3.5" fill="#FCFBF9" stroke="#FF5A1F" strokeWidth="1.5" opacity="0.6"/>
            ))}
          </svg>

          <div style={{ maxWidth: 880, margin: "0 auto", position: "relative", zIndex: 1 }}>

            {/* Cards */}
            <div className="tarifs-compare-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "stretch", marginBottom: 64 }}>

              {/* Card Vendeur */}
              <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ECECEC", boxShadow: "0 8px 30px rgba(20,20,20,0.05)", padding: "36px 32px", display: "flex", flexDirection: "column" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.1em", margin: "0 0 14px" }}>VENDEUR</p>
                <div style={{ fontSize: 44, fontWeight: 700, color: "#141414", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 6 }}>Gratuit</div>
                <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 28px" }}>Pour toujours</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 32, flex: 1 }}>
                  {[
                    "Dépôt de dossiers illimité",
                    "Anonymat total garanti",
                    "Alertes lors des déblocages",
                    "Messagerie avec les acheteurs",
                  ].map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2.5" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ fontSize: 14, color: "#374151" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/register/vendeur" style={{ display: "block", textAlign: "center", background: "#141414", color: "#fff", padding: "13px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                  Déposer un dossier
                </Link>
              </div>

              {/* Card Acheteur — dark, populaire */}
              <div style={{ background: "#141414", borderRadius: 20, border: "1px solid #141414", boxShadow: "0 12px 40px rgba(20,20,20,0.18)", padding: "36px 32px", display: "flex", flexDirection: "column", position: "relative" }}>
                <span style={{ position: "absolute", top: -12, right: 28, background: "#FF5A1F", color: "#141414", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", padding: "5px 14px", borderRadius: 20 }}>
                  LE PLUS POPULAIRE
                </span>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#FF5A1F", letterSpacing: "0.1em", margin: "0 0 14px" }}>ACHETEUR</p>
                <div style={{ fontSize: 44, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 6 }}>59 €</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "0 0 28px" }}>par mois · sans engagement</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 32, flex: 1 }}>
                  {[
                    "Accès à tous les dossiers",
                    "Filtres avancés",
                    "Alertes nouvelles opportunités",
                    "Messagerie sécurisée",
                    "699 € par coordonnées complètes",
                  ].map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2.5" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/register/acheteur" style={{ display: "block", textAlign: "center", background: "#FF5A1F", color: "#141414", padding: "13px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                  S'abonner maintenant
                </Link>
              </div>
            </div>

            {/* Rangée de confiance */}
            <div className="tarifs-trust-row" style={{ display: "flex", justifyContent: "center", gap: 64 }}>
              {[
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>, t1: "Anonymat", t2: "garanti" },
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, t1: "Paiement", t2: "sécurisé" },
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>, t1: "Support", t2: "réactif" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", border: "1px solid #E5E0D5", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#D8480F" }}>
                    {item.icon}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#141414", lineHeight: 1.3 }}>{item.t1}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>{item.t2}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Déblocage + Packs — fond sombre */}
        <div className="tarifs-section" style={{ padding: "100px 48px", background: "#141414", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,90,31,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>

            {/* Déblocage */}
            <div className="tarifs-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "flex-start", marginBottom: 48 }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,90,31,0.15)", border: "1px solid rgba(255,90,31,0.3)", borderRadius: 20, padding: "6px 16px", marginBottom: 20 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#FF5A1F", letterSpacing: "0.06em" }}>DÉBLOCAGE DE DOSSIER</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                  <span className="tarifs-prix" style={{ fontSize: 72, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>699 €</span>
                  <span style={{ fontSize: 20, color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>/dossier</span>
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: "0 0 20px" }}>Paiement unique · Accès permanent</p>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, margin: "0 0 24px" }}>
                  Déverrouillez les coordonnées complètes d'un vendeur et choisissez votre pack d'accompagnement. La commission n'est due qu'en cas de transaction aboutie.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {["Coordonnées complètes du vendeur", "Messagerie directe activée", "Accès permanent au dossier", "Pack d'accompagnement au choix"].map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", padding: "28px" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 6px" }}>Ce que vous recevez</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 20px" }}>Après déblocage, vous accédez immédiatement à :</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                  {[
                    { label: "Nom du cabinet", value: "Cabinet Exemple" },
                    { label: "Nom du dirigeant", value: "Jean Dupont" },
                    { label: "Email de contact", value: "contact@exemple.be" },
                    { label: "Téléphone", value: "+32 456 78 90 12" },
                    { label: "Adresse", value: "Rue Exemple 1, Liège" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{item.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "rgba(255,90,31,0.08)", borderRadius: 10, border: "1px solid rgba(255,90,31,0.2)", padding: "12px 14px" }}>
                  <p style={{ fontSize: 11, color: "#FF5A1F", fontWeight: 600, margin: "0 0 3px" }}>💡 Commission uniquement si transaction aboutie</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.5 }}>Calculée sur le chiffre d'affaires annuel de la fiduciaire selon le pack choisi.</p>
                </div>
              </div>
            </div>

            {/* Packs détaillés */}
            <div className="tarifs-packs" style={{ background: "rgba(255,255,255,0.03)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.06)", padding: "40px" }}>
              <div style={{ marginBottom: 32 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#FF5A1F", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 8px" }}>Packs d'accompagnement</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>Choisissez votre niveau au moment du déblocage.</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6 }}>
                  La commission est calculée sur le chiffre d'affaires annuel de la fiduciaire, uniquement en cas de transaction aboutie.
                </p>
              </div>

              <div className="pack-detail-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                {[
                  { num: "Pack 1", title: "Mise en relation", commission: "1,5%", desc: "Pour les parties souhaitant gérer la suite en autonomie, avec un accès direct à une opportunité qualifiée.", items: ["Accès au dossier complet", "Mise en relation vendeur / acquéreur", "Transmission des coordonnées", "Modèle d'offre"], ideal: "Idéal pour les professionnels autonomes." },
                  { num: "Pack 2", title: "Intégration Métier", commission: "3,5%", desc: "Un accompagnement métier pour réussir l'intégration technique, opérationnelle et réglementaire du cabinet repris.", items: ["Analyse du portefeuille et pistes d'optimisation", "Analyse de la base clients et de sa qualité", "Complétion des données manquantes", "Accompagnement ITAA & RGPD", "Support organisationnel pendant la transition"], ideal: "Idéal pour une reprise fluide et structurée." },
                  { num: "Pack 3", title: "Communication & Transition", commission: "3,5%", desc: "Pour rassurer les clients, valoriser l'opération et réussir l'unification des images et canaux de communication.", items: ["Communication clients avant / pendant / après reprise", "Rédaction des messages stratégiques", "Harmonisation des marques", "Réflexion logo / identité visuelle", "Fusion ou redirection des sites internet", "Cohérence réseaux sociaux", "Mise en place d'une stratégie commerciale"], ideal: "Idéal lors d'une fusion visible ou d'un changement d'image." },
                  { num: "Pack 4", title: "Full Premium", commission: "5%", desc: "L'accompagnement complet combinant expertise métier, intégration technique, communication et pilotage global.", items: ["Tous les éléments du Pack Intégration Métier", "Tous les éléments du Pack Communication & Transition", "Coordination générale du projet", "Accompagnement global jusqu'à finalisation"], ideal: "Idéal pour maximiser la réussite de la reprise." },
                ].map((pack, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", padding: "24px", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>{pack.num.toUpperCase()}</span>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>{pack.title}</h3>
                      </div>
                      <span style={{ fontSize: 18, fontWeight: 700, color: "#FF5A1F", background: "rgba(255,90,31,0.1)", padding: "6px 14px", borderRadius: 10, flexShrink: 0 }}>{pack.commission}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: "0 0 16px" }}>{pack.desc}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16, flex: 1 }}>
                      {pack.items.map((item, j) => (
                        <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12"/></svg>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 11, color: "#FF5A1F", fontWeight: 600, margin: 0, fontStyle: "italic" }}>{pack.ideal}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 24, background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", padding: "20px 24px" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 8px" }}>Mention importante</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.7 }}>
                  Les honoraires couvrent notre accompagnement, notre expertise et notre temps d'intervention. Les frais externes éventuels restent distincts : publications légales, frais réglementaires, impressions, envois postaux, campagnes média, prestataires tiers, conseils juridiques, comptables ou IT externes, etc.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA final — deux boutons */}
        <div className="tarifs-cta" style={{ background: "#F9FAFB", borderTop: "1px solid #F3F4F6", padding: "80px 48px", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#D8480F", letterSpacing: "0.1em", margin: "0 0 14px" }}>PRÊT À COMMENCER ?</p>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: "#141414", margin: "0 0 14px", letterSpacing: "-0.02em" }}>Rejoignez la plateforme dès aujourd'hui.</h2>
          <p style={{ fontSize: 15, color: "#6B7280", margin: "0 0 36px" }}>Inscription rapide, sans engagement.</p>
          <div className="tarifs-cta-btns" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register/acheteur" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FF5A1F", color: "#141414", padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              Créer un compte Acheteur
            </Link>
            <Link href="/register/vendeur" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#141414", color: "#fff", padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
              Créer un compte Vendeur
            </Link>
          </div>
        </div>

        <PublicFooter />
      </div>
    </div>
  );
}