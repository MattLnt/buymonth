import Link from "next/link";
import Image from "next/image";
import PublicNav from "@/app/components/PublicNav";
import PublicFooter from "@/app/components/PublicFooter";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "var(--font-sans)" }}>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media (max-width: 768px) {
          .hero-section { padding: 80px 24px 60px !important; }
          .hero-title { font-size: 32px !important; }
          .hero-subtitle { font-size: 15px !important; }
          .hero-stats { max-width: 100% !important; grid-template-columns: repeat(2, 1fr) !important; }
          .section-pad { padding: 60px 24px !important; }
          .grid-2 { grid-template-columns: 1fr !important; gap: 32px !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .sticky-col { position: static !important; }
          .timeline-path { display: none !important; }
          .cta-section { padding: 60px 24px !important; }
          .cta-title { font-size: 28px !important; }
          .pricing-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .pricing-card-accent { margin-top: 0 !important; }
          .market-cols { grid-template-columns: 1fr !important; gap: 16px !important; }
          .expert-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>

      <PublicNav dark />

      <main>

        {/* Hero avec photo */}
        <div className="hero-section" style={{ background: "#141414", padding: "130px 48px 90px", position: "relative", overflow: "hidden" }}>
          <Image src="/images/hero-bg.jpg" alt="" fill priority sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 30%" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(95deg, rgba(20,20,20,0.97) 0%, rgba(20,20,20,0.88) 45%, rgba(20,20,20,0.55) 100%)" }} />

          <div style={{ maxWidth: 1060, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: 640 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,90,31,0.12)", border: "1px solid rgba(255,90,31,0.25)", borderRadius: 24, padding: "6px 16px", marginBottom: 28 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#FF5A1F", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#FF5A1F", letterSpacing: "0.08em" }}>PLATEFORME PRIVÉE OFF-MARKET</span>
              </div>
              <h1 className="hero-title" style={{ fontSize: 52, fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 22px", letterSpacing: "-0.03em" }}>
                Le marché privé de la cession{" "}
                <span style={{ color: "#FF5A1F" }}>de fiduciaires.</span>
              </h1>
              <p className="hero-subtitle" style={{ fontSize: 17, color: "rgba(255,255,255,0.8)", lineHeight: 1.8, maxWidth: 480, margin: "0 0 36px" }}>
                Acheteurs et vendeurs se rencontrent dans un cadre confidentiel, structuré et sécurisé.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 56 }}>
                <Link href="/register/vendeur" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "12px 26px", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none", backdropFilter: "blur(4px)" }}>
                  Déposer un dossier
                </Link>
                <Link href="/register/acheteur" style={{ background: "#FF5A1F", color: "#141414", padding: "12px 26px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                  Accéder aux opportunités →
                </Link>
              </div>
            </div>

            <div className="hero-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", maxWidth: 620, backdropFilter: "blur(6px)" }}>
              {[
                { value: "0 €", label: "Pour les vendeurs" },
                { value: "100%", label: "Anonymat garanti" },
                { value: "699 €", label: "Achat de dossier" },
                { value: "59 €/mois", label: "Abonnement" },
              ].map((s, i) => (
                <div key={i} style={{ padding: "16px 12px", background: "rgba(20,20,20,0.55)", textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#FF5A1F", marginBottom: 3 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Processus — timeline visuelle */}
        <div className="section-pad" style={{ padding: "90px 48px", background: "#fff" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 80, alignItems: "start" }}>
              <div className="sticky-col" style={{ position: "sticky", top: 100 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#D8480F", letterSpacing: "0.1em", margin: "0 0 12px" }}>PROCESSUS</p>
                <h2 style={{ fontSize: 32, fontWeight: 700, color: "#141414", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>En 5 étapes simples.</h2>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, margin: "0 0 28px" }}>Un processus structuré pour sécuriser chaque transaction de fiduciaire.</p>
                <Link href="/register/vendeur" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#141414", textDecoration: "none", borderBottom: "2px solid #FF5A1F", paddingBottom: 2 }}>
                  Commencer maintenant →
                </Link>

                {/* Illustration chemin */}
                <svg className="timeline-path" width="220" height="180" viewBox="0 0 220 180" fill="none" style={{ marginTop: 40, opacity: 0.8 }}>
                  <path d="M20 160 C 60 160, 50 110, 95 110 C 145 110, 130 55, 175 55 C 195 55, 200 40, 202 25"
                    stroke="#FF5A1F" strokeWidth="1.5" strokeDasharray="5 6" opacity="0.5" fill="none"/>
                  {[[20,160],[95,110],[175,55]].map(([x,y],i) => (
                    <g key={i}>
                      <circle cx={x} cy={y} r="9" fill="rgba(255,90,31,0.12)" />
                      <circle cx={x} cy={y} r="3.5" fill="#FF5A1F" />
                    </g>
                  ))}
                  <circle cx="202" cy="22" r="11" fill="#141414"/>
                  <path d="M198 22l3 3 5-6" stroke="#FF5A1F" strokeWidth="2" fill="none" strokeLinecap="round"/>
                </svg>
              </div>

              {/* Timeline */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 21, top: 30, bottom: 30, width: 2, background: "linear-gradient(to bottom, rgba(255,90,31,0.5), rgba(255,90,31,0.12))", borderRadius: 2 }} />
                {[
                  { num: "01", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, title: "Déposez votre dossier en toute confidentialité", desc: "Le vendeur crée son dossier anonymisé — province, chiffre d'affaires annuel, activités, type de transaction. Aucune information identifiable n'est visible des acheteurs.", role: "Vendeur" },
                  { num: "02", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>, title: "Accédez aux opportunités", desc: "L'acheteur s'abonne à 59€/mois et accède à l'ensemble des dossiers filtrables par province, chiffre d'affaires annuel et type d'activité.", role: "Acheteur" },
                  { num: "03", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 019.9-1"/></svg>, title: "Déverrouillez les coordonnées", desc: "L'acheteur intéressé débloque le dossier pour 699€ et choisit son pack d'accompagnement.", role: "Acheteur" },
                  { num: "04", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>, title: "Mise en relation et échange", desc: "Lorsque l'intérêt est confirmé, les parties sont mises en relation. Elles peuvent échanger librement par téléphone, e-mail ou via la messagerie sécurisée de la plateforme.", role: "Tous" },
                  { num: "05", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>, title: "Accompagnement sur mesure", desc: "Au-delà de la mise en relation, nous pouvons accompagner les parties dans les étapes clés : analyse du portefeuille clients, organisation opérationnelle, conformité, migration des données, communication clients et intégration globale.", role: "Optionnel" },
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 24, padding: "22px 0", position: "relative" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#fff", border: "2px solid #FF5A1F", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#D8480F", position: "relative", zIndex: 1, boxShadow: "0 0 0 5px #fff" }}>
                      {step.icon}
                    </div>
                    <div style={{ flex: 1, background: "#FCFBF9", border: "1px solid #F3EFE7", borderRadius: 14, padding: "18px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#FF5A1F", letterSpacing: "0.08em" }}>ÉTAPE {step.num}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: step.role === "Optionnel" ? "#6B7280" : "#D8480F", background: step.role === "Optionnel" ? "#F3F4F6" : "rgba(255,90,31,0.15)", padding: "2px 8px", borderRadius: 10 }}>{step.role}</span>
                      </div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#141414", margin: "0 0 6px" }}>{step.title}</h3>
                      <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section Marché */}
        <div className="section-pad" style={{ padding: "90px 48px", background: "#141414", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,90,31,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#FF5A1F", letterSpacing: "0.1em", margin: "0 0 14px" }}>CONTEXTE DE MARCHÉ</p>
              <h2 style={{ fontSize: 36, fontWeight: 700, color: "#fff", margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                Le marché change.<br />Les opportunités aussi.
              </h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", maxWidth: 500, margin: "0 auto", lineHeight: 1.8 }}>
                Le secteur des fiduciaires est en pleine mutation. Les occasions de reprise ou de partenariat n'ont jamais été aussi nombreuses.
              </p>
            </div>

            <div className="market-cols" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 56 }}>
              {[
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>, stat: "50%", title: "De nombreux dirigeants de fiduciaires approchent de la retraite", desc: "Une génération de dirigeants cherche une transmission sereine et discrète de leur portefeuille." },
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>, stat: "+35%", title: "Les regroupements s'accélèrent", desc: "Fusions, acquisitions, partenariats : le mouvement de consolidation des fiduciaires ne fait que commencer." },
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, stat: "100%", title: "Les belles opportunités circulent discrètement", desc: "Ne les ratez pas ! Les meilleures transactions se font hors marché, en toute confidentialité." },
              ].map((item, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "28px 24px" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,90,31,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    {item.icon}
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: "#FF5A1F", letterSpacing: "-0.02em", marginBottom: 8 }}>{item.stat}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 8px", lineHeight: 1.4 }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "40px 48px" }}>
              <div className="expert-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#FF5A1F", letterSpacing: "0.1em", margin: "0 0 14px" }}>NOTRE EXPERTISE</p>
                  <h3 style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
                    Un interlocuteur qui connaît réellement la comptabilité.
                  </h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.8, margin: "0 0 24px" }}>
                    Avec plus de 20 ans d'expérience, nous connaissons les réalités du secteur : valorisation d'un portefeuille, confidentialité, relation clientèle, personnel et timing de transmission.
                  </p>
                  <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FF5A1F", color: "#141414", padding: "11px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                    Nous contacter →
                  </Link>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, title: "Spécialistes du marché de la comptabilité", desc: "Une connaissance approfondie du secteur et de ses acteurs." },
                    { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "Approche discrète et ciblée", desc: "Confidentialité totale à chaque étape de la transaction." },
                    { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, title: "Accompagnement concret", desc: "De la mise en relation jusqu'à l'intégration de la fiduciaire." },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "16px", background: "rgba(255,255,255,0.04)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,90,31,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: "0 0 3px" }}>{item.title}</p>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="section-pad" style={{ padding: "90px 48px", background: "#F9FAFB", borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#D8480F", letterSpacing: "0.1em", margin: "0 0 12px" }}>POURQUOI NOUS</p>
              <h2 style={{ fontSize: 32, fontWeight: 700, color: "#141414", margin: 0, letterSpacing: "-0.02em" }}>Conçu pour les professionnels de la comptabilité.</h2>
            </div>
            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {[
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>, title: "Identité protégée", desc: "L'identité du vendeur, les coordonnées et les éléments sensibles restent protégés jusqu'à une mise en relation validée." },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, title: "Accès encadré", desc: "L'accès aux dossiers est réservé aux membres inscrits. Chaque demande est encadrée et chaque transaction sécurisée." },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, title: "Recherche ciblée", desc: "Province, chiffre d'affaires annuel, type d'activité : identifiez rapidement les dossiers pertinents." },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/></svg>, title: "Alertes en temps réel", desc: "Soyez notifié dès qu'une nouvelle opportunité correspond à vos critères." },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>, title: "Messagerie sécurisée", desc: "Les parties peuvent dialoguer via un espace sécurisé, avec partage de documents si nécessaire." },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "Paiements sécurisés", desc: "Abonnement flexible et déblocage à l'unité via un prestataire de paiement reconnu et sécurisé." },
              ].map((f, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "22px" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,90,31,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5A1F", marginBottom: 14 }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#141414", margin: "0 0 6px" }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tarifs — 2 cards seulement */}
        <div className="section-pad" style={{ padding: "90px 48px", background: "#fff" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#D8480F", letterSpacing: "0.1em", margin: "0 0 12px" }}>TARIFS</p>
              <h2 style={{ fontSize: 32, fontWeight: 700, color: "#141414", margin: "0 0 10px", letterSpacing: "-0.02em" }}>Transparent et sans surprise.</h2>
              <p style={{ fontSize: 14, color: "#6B7280", maxWidth: 400, margin: "0 auto" }}>Déposer est gratuit. Accéder aux dossiers commence à 59€/mois.</p>
            </div>
            <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                {
                  label: "VENDEUR", prix: "Gratuit", sousTitre: "Pour toujours",
                  features: ["Dépôt de dossiers illimité", "Anonymat total garanti", "Alertes lors des déblocages", "Messagerie avec les acheteurs"],
                  cta: "Déposer un dossier", href: "/register/vendeur", accent: false
                },
                {
                  label: "ACHETEUR", prix: "59 €", sousTitre: "par mois · sans engagement",
                  features: ["Accès à tous les dossiers", "Filtres avancés", "Alertes nouvelles opportunités", "Messagerie sécurisée", "699 € par coordonnées complètes"],
                  cta: "S'abonner maintenant", href: "/register/acheteur", accent: true
                },
              ].map((plan, i) => (
                <div key={i} className={plan.accent ? "pricing-card-accent" : ""} style={{ background: plan.accent ? "#141414" : "#fff", border: `1px solid ${plan.accent ? "#141414" : "#F3F4F6"}`, borderRadius: 16, padding: "28px", position: "relative", marginTop: plan.accent ? -12 : 0, boxShadow: plan.accent ? "0 20px 60px rgba(20,20,20,0.15)" : "none" }}>
                  {plan.accent && <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "#FF5A1F", color: "#141414", fontSize: 10, fontWeight: 700, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>LE PLUS POPULAIRE</div>}
                  <p style={{ fontSize: 10, fontWeight: 700, color: plan.accent ? "#FF5A1F" : "#6B7280", letterSpacing: "0.1em", margin: "0 0 14px" }}>{plan.label}</p>
                  <div style={{ fontSize: 32, fontWeight: 700, color: plan.accent ? "#fff" : "#141414", letterSpacing: "-0.02em", marginBottom: 2 }}>{plan.prix}</div>
                  <p style={{ fontSize: 12, color: plan.accent ? "#9CA3AF" : "#6B7280", margin: "0 0 22px" }}>{plan.sousTitre}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 22 }}>
                    {plan.features.map((f, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={plan.accent ? "#FF5A1F" : "#6B7280"} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        <span style={{ fontSize: 13, color: plan.accent ? "rgba(255,255,255,0.85)" : "#374151" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={plan.href} style={{ display: "block", textAlign: "center", background: plan.accent ? "#FF5A1F" : "#141414", color: plan.accent ? "#141414" : "#fff", padding: "11px", borderRadius: 9, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>{plan.cta}</Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="cta-section" style={{ background: "#141414", padding: "90px 48px" }}>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#FF5A1F", letterSpacing: "0.1em", margin: "0 0 16px" }}>REJOINDRE LA PLATEFORME</p>
            <h2 className="cta-title" style={{ fontSize: 36, fontWeight: 700, color: "#fff", margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Prêt à céder ou acquérir<br />une fiduciaire ?</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", margin: "0 0 36px", lineHeight: 1.7 }}>Rejoignez la plateforme privée de référence pour la cession de fiduciaires.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/register/acheteur" style={{ background: "#FF5A1F", color: "#141414", padding: "13px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>Créer un compte acheteur</Link>
              <Link href="/register/vendeur" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)", padding: "13px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Déposer un dossier</Link>
            </div>
          </div>
        </div>

        <PublicFooter />

      </main>
    </div>
  );
}