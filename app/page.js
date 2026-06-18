import Link from "next/link";
import Image from "next/image";
import PublicNav from "@/app/components/PublicNav";
import PublicBottomNav from "@/app/components/PublicBottomNav";
import PublicFooter from "@/app/components/PublicFooter";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "var(--font-sans)" }}>

      <PublicNav />

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
          .market-cols { grid-template-columns: 1fr !important; gap: 16px !important; }
          .expert-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .split-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>

      <main>

        {/* ============ HERO ============ */}
        <div id="home" className="hero-section" style={{ background: "#193B5E", padding: "130px 48px 90px", position: "relative", overflow: "hidden" }}>
          <Image src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80" alt="" fill priority sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 30%" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(95deg, rgba(25,59,94,0.97) 0%, rgba(25,59,94,0.88) 45%, rgba(25,59,94,0.55) 100%)" }} />

          <div style={{ maxWidth: 1060, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: 660 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,184,168,0.12)", border: "1px solid rgba(124,184,168,0.25)", borderRadius: 24, padding: "6px 16px", marginBottom: 28 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#7CB8A8", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#7CB8A8", letterSpacing: "0.08em" }}>INTERMÉDIAIRE EN CRÉDIT AGRÉÉ FSMA</span>
              </div>
              <h1 className="hero-title" style={{ fontSize: 52, fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 22px", letterSpacing: "-0.03em" }}>
                Vendez votre bien en{" "}
                <span style={{ color: "#7CB8A8" }}>mensualités</span>, pas en m².
              </h1>
              <p className="hero-subtitle" style={{ fontSize: 17, color: "rgba(255,255,255,0.8)", lineHeight: 1.8, maxWidth: 520, margin: "0 0 36px" }}>
                Facilitez la vente de vos biens immobiliers en proposant à vos clients une approche claire et rassurante : communiquer en mensualités.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 56 }}>
                <Link href="#contact" style={{ background: "#7CB8A8", color: "#193B5E", padding: "12px 26px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                  Commencer maintenant →
                </Link>
                <Link href="#solution" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "12px 26px", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none", backdropFilter: "blur(4px)" }}>
                  En savoir plus
                </Link>
              </div>
            </div>

            <div className="hero-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", maxWidth: 620, backdropFilter: "blur(6px)" }}>
              {[
                { value: "499 €", label: "Redevance fixe / mois" },
                { value: "19 €", label: "Max par bien" },
                { value: "7", label: "Étapes clés en main" },
                { value: "FSMA", label: "Agrément officiel" },
              ].map((s, i) => (
                <div key={i} style={{ padding: "16px 12px", background: "rgba(20,20,20,0.55)", textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#7CB8A8", marginBottom: 3 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============ SIGNATURE DÈS LA 1ÈRE VISITE (split) ============ */}
        <div id="solution" className="section-pad" style={{ padding: "90px 48px", background: "#fff" }}>
          <div style={{ maxWidth: 1060, margin: "0 auto" }}>
            <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#7CB8A8", letterSpacing: "0.1em", margin: "0 0 14px" }}>LE CONSTAT</p>
                <h2 style={{ fontSize: 34, fontWeight: 700, color: "#193B5E", margin: "0 0 20px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                  Et si vos prospects signaient dès la première visite ?
                </h2>
                <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.8, margin: "0 0 18px" }}>
                  Aujourd'hui, les acquéreurs raisonnent d'abord en <strong style={{ color: "#193B5E" }}>budget mensuel</strong>, comme pour une voiture en leasing ou un smartphone avec abonnement, et non plus en prix global.
                </p>
                <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.8, margin: "0 0 18px" }}>
                  Cette évolution est dictée par l'incertitude économique et la nécessité de maîtriser leurs dépenses. Afficher un bien en mensualités n'est plus une option, c'est devenu la norme.
                </p>
                <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.8, margin: 0 }}>
                  En tant qu'intermédiaire en crédit <strong style={{ color: "#193B5E" }}>agréé FSMA</strong>, nous conseillons vos clients en matière de financement, transformant l'incertitude en opportunité commerciale concrète et rapide.
                </p>
              </div>
              <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", minHeight: 380, boxShadow: "0 20px 60px rgba(25,59,94,0.15)" }}>
                <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80" alt="Maison" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(25,59,94,0.6) 100%)" }} />
                <div style={{ position: "absolute", bottom: 24, left: 24, right: 24, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", borderRadius: 14, padding: "18px 22px" }}>
                  <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600, marginBottom: 4 }}>Achetez ce bien dès</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#193B5E" }}>1 260 € <span style={{ fontSize: 15, color: "#7CB8A8" }}>/mois</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============ LE FREIN N°1 (3 problèmes, fond foncé) ============ */}
        <div className="section-pad" style={{ padding: "90px 48px", background: "#193B5E", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(124,184,168,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#7CB8A8", letterSpacing: "0.1em", margin: "0 0 14px" }}>LE FREIN N°1</p>
              <h2 style={{ fontSize: 36, fontWeight: 700, color: "#fff", margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                L'incertitude liée au financement.
              </h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", maxWidth: 540, margin: "0 auto", lineHeight: 1.8 }}>
                Le marché immobilier belge fait face à des défis majeurs qui paralysent les décisions d'achat et compromettent vos ventes.
              </p>
            </div>

            <div className="market-cols" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {[
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>, title: "Pouvoir d'achat sous pression", desc: "Vos acheteurs potentiels reportent leurs décisions face à l'incertitude économique et aux taux d'intérêt fluctuants." },
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="1.5"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/></svg>, title: "Exigences bancaires accrues", desc: "Des critères d'octroi plus stricts vous font perdre des ventes, même pour des profils solides." },
                { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: "Financement trop tardif", desc: "L'incertitude sur le financement génère des coûts marketing exponentiels et des cycles de vente interminables." },
              ].map((item, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "28px 24px" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(124,184,168,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 8px", lineHeight: 1.4 }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <p style={{ textAlign: "center", fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 32, fontStyle: "italic" }}>
              Cette réalité du terrain vous coûte cher en temps, en argent et en opportunités perdues.
            </p>
          </div>
        </div>

        {/* ============ APPROCHE COMMERCIALE INÉDITE (3 piliers) ============ */}
        <div className="section-pad" style={{ padding: "90px 48px", background: "#fff" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#7CB8A8", letterSpacing: "0.1em", margin: "0 0 12px" }}>LA SOLUTION</p>
              <h2 style={{ fontSize: 34, fontWeight: 700, color: "#193B5E", margin: "0 0 16px", letterSpacing: "-0.02em" }}>Une approche commerciale inédite.</h2>
              <p style={{ fontSize: 15, color: "#6B7280", maxWidth: 600, margin: "0 auto 48px", lineHeight: 1.8 }}>
                Notre solution clé en main vous permet de présenter vos biens plus concrètement, d'optimiser la qualification de vos leads et de raccourcir vos cycles de vente.
              </p>
            </div>

            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {[
                { num: "1", title: "Affichage en €/mois", desc: "Une communication claire et conforme qui parle directement au budget de vos prospects. Finis les prix au m² abstraits, vous parlez à leurs priorités financières." },
                { num: "2", title: "Simulation + pré-scoring", desc: "Une qualification dès le premier contact. Vos commerciaux savent immédiatement s'ils parlent à un acheteur solvable, vous faisant gagner un temps précieux." },
                { num: "3", title: "Gestion complète jusqu'à l'acte", desc: "BuyMonth pilote l'intégralité du dossier de financement. Plus de stress, plus de ventes perdues pour des raisons financières ou administratives." },
              ].map((p, i) => (
                <div key={i} style={{ background: "#F7F9FB", border: "1px solid #E5E7EB", borderRadius: 16, padding: "32px 28px" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#193B5E", color: "#7CB8A8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, marginBottom: 20 }}>{p.num}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#193B5E", margin: "0 0 10px" }}>{p.title}</h3>
                  <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
                </div>
              ))}
            </div>
            <p style={{ textAlign: "center", fontSize: 18, fontWeight: 700, color: "#193B5E", marginTop: 40 }}>
              Parler mensualités, c'est parler décision.
            </p>
          </div>
        </div>

        {/* ============ PROCESS 7 ÉTAPES (timeline) ============ */}
        <div id="process" className="section-pad" style={{ padding: "90px 48px", background: "#F7F9FB", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 80, alignItems: "start" }}>
              <div className="sticky-col" style={{ position: "sticky", top: 100 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#7CB8A8", letterSpacing: "0.1em", margin: "0 0 12px" }}>NOTRE PROCESS</p>
                <h2 style={{ fontSize: 32, fontWeight: 700, color: "#193B5E", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>En 7 étapes, clé en main.</h2>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, margin: "0 0 28px" }}>De la mensualisation de vos biens jusqu'à la signature de l'acte, nous pilotons tout le processus.</p>
                <Link href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#193B5E", textDecoration: "none", borderBottom: "2px solid #7CB8A8", paddingBottom: 2 }}>
                  Démarrer le test →
                </Link>
              </div>

              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 21, top: 30, bottom: 30, width: 2, background: "linear-gradient(to bottom, rgba(124,184,168,0.5), rgba(124,184,168,0.12))", borderRadius: 2 }} />
                {[
                  { num: "01", title: "Mensualisation des biens", desc: "Nous convertissons tous vos biens en affichage €/mois à utiliser sur vos supports marketing et commerciaux." },
                  { num: "02", title: "Capture des leads", desc: "QR codes sur vos supports, landing pages dédiées, et bornes interactives en showroom." },
                  { num: "03", title: "Simulation personnalisée", desc: "Calcul de la mensualité adapté au profil du prospect, suivi de la mise en place du processus de financement." },
                  { num: "04", title: "Constitution du dossier", desc: "Accompagnement de vos prospects étape par étape pour garantir la complétude du dossier de financement." },
                  { num: "05", title: "Analyse crédit", desc: "Présentation du dossier simultanément auprès de plusieurs banques partenaires pour identifier la meilleure offre et maximiser les chances d'acceptation." },
                  { num: "06", title: "Offre ferme", desc: "Une fois l'accord obtenu, le prospect devient acheteur avec conditions suspensives levées, sécurisant ainsi la vente pour vous." },
                  { num: "07", title: "Acte & reporting", desc: "Accompagnement jusqu'à la signature finale et reporting détaillé pour votre suivi commercial et votre comptabilité." },
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 24, padding: "22px 0", position: "relative" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#fff", border: "2px solid #7CB8A8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#193B5E", fontSize: 14, fontWeight: 700, position: "relative", zIndex: 1, boxShadow: "0 0 0 5px #F7F9FB" }}>
                      {step.num}
                    </div>
                    <div style={{ flex: 1, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "18px 20px" }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#193B5E", margin: "0 0 6px" }}>{step.title}</h3>
                      <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ============ MODÈLE TARIFAIRE ============ */}
        <div id="tarifs" className="section-pad" style={{ padding: "90px 48px", background: "#fff" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#7CB8A8", letterSpacing: "0.1em", margin: "0 0 12px" }}>TARIFS</p>
              <h2 style={{ fontSize: 34, fontWeight: 700, color: "#193B5E", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Une redevance fixe, claire et évolutive.</h2>
              <p style={{ fontSize: 15, color: "#6B7280", maxWidth: 580, margin: "0 auto", lineHeight: 1.8 }}>
                BuyMonth fonctionne sur base d'une redevance mensuelle fixe, couplée à une redevance variable ajustée selon votre portefeuille.
              </p>
            </div>

            <div style={{ background: "#193B5E", borderRadius: 20, padding: "48px", textAlign: "center", marginBottom: 20, position: "relative", overflow: "hidden", boxShadow: "0 20px 60px rgba(25,59,94,0.2)" }}>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(124,184,168,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 56, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>499 €</span>
                  <span style={{ fontSize: 18, color: "rgba(255,255,255,0.7)" }}>/mois fixe</span>
                </div>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", margin: "0 0 8px" }}>
                  + redevance variable de <strong style={{ color: "#7CB8A8" }}>maximum 19€ par bien</strong>
                </p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", maxWidth: 480, margin: "0 auto" }}>
                  Le tarif est progressif et cumulatif : plus le portefeuille est large, plus le coût unitaire par bien diminue. Une seule facture, tout compris.
                </p>
              </div>
            </div>

            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {[
                { title: "Tarification dégressive", desc: "Un modèle flexible avec des tarifs réduits pour chaque bien supplémentaire." },
                { title: "Réduction de fidélité", desc: "Pour les clients s'engageant sur 2 ans, une réduction de 5% est appliquée." },
                { title: "Réévaluation semestrielle", desc: "Tarification ajustée tous les 6 mois selon l'évolution de votre portefeuille." },
              ].map((c, i) => (
                <div key={i} style={{ background: "#F7F9FB", border: "1px solid #E5E7EB", borderRadius: 14, padding: "24px" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(124,184,168,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#193B5E", margin: "0 0 6px" }}>{c.title}</h3>
                  <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============ SERVICES INCLUS (6 cards) ============ */}
        <div className="section-pad" style={{ padding: "90px 48px", background: "#F7F9FB", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#7CB8A8", letterSpacing: "0.1em", margin: "0 0 12px" }}>INCLUS DANS L'ABONNEMENT</p>
              <h2 style={{ fontSize: 32, fontWeight: 700, color: "#193B5E", margin: 0, letterSpacing: "-0.02em" }}>Tout ce dont vous avez besoin.</h2>
            </div>
            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {[
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 7h10v10H7z"/><path d="M21 7v10M3 7v10"/></svg>, title: "Badge mensualité", desc: "Un badge personnalisé conforme FSMA « Achetez ce bien dès x €/mois », prêt à intégrer dans vos annonces." },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, title: "Pré-scoring", desc: "Analyse de la faisabilité financière du crédit sur demande, pour évaluer et filtrer vos prospects." },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>, title: "Calculatrice de mensualisation", desc: "Outil personnalisé pour simuler les mensualités et les communiquer au client à titre indicatif." },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, title: "Reporting régulier", desc: "Suivi des dossiers et reporting général régulier : décompte des leads reçus, etc." },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/></svg>, title: "Support & formation", desc: "Formation des commerciaux et fourniture des visuels, goodies et supports marketing." },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6v6l4 2"/></svg>, title: "Maintenance", desc: "Mises à jour et conformité réglementaire assurées par BuyMonth pour votre tranquillité d'esprit." },
              ].map((f, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: "22px" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(124,184,168,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#7CB8A8", marginBottom: 14 }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#193B5E", margin: "0 0 6px" }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============ BUYMONTH CONCRÈTEMENT (3 points + citation) ============ */}
        <div className="section-pad" style={{ padding: "90px 48px", background: "#fff" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#7CB8A8", letterSpacing: "0.1em", margin: "0 0 12px" }}>BUYMONTH, CONCRÈTEMENT</p>
              <h2 style={{ fontSize: 32, fontWeight: 700, color: "#193B5E", margin: 0, letterSpacing: "-0.02em" }}>Trois bénéfices immédiats.</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
              {[
                { tag: "COMMUNICATION OPTIMALE", title: "La mensualité accélère la décision", desc: "Les clients pensent aujourd'hui principalement en termes de budget mensuel. Afficher une mensualité accélère leur décision d'achat et améliore significativement le processus de vente." },
                { tag: "GAIN DE TEMPS", title: "Le filtre qui qualifie vos leads", desc: "Grâce au pré-scoring, à la qualification des leads, à un reporting clair et à la formation, BuyMonth permet un gain de temps précieux pour les équipes de vente." },
                { tag: "EXPERTISE UNIQUE", title: "Notre agrément FSMA facilite la vente", desc: "Nos connaissances techniques et notre agrément FSMA nous permettent de fournir des solutions financières innovantes, même en cas de refus classique, apportant une réelle valeur ajoutée." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start", padding: "28px", background: "#F7F9FB", border: "1px solid #E5E7EB", borderRadius: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#193B5E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#7CB8A8", letterSpacing: "0.1em" }}>{item.tag}</span>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#193B5E", margin: "4px 0 8px" }}>{item.title}</h3>
                    <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", padding: "40px", background: "#193B5E", borderRadius: 20 }}>
              <p style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.4 }}>
                « Moins d'incertitude, <span style={{ color: "#7CB8A8" }}>plus de ventes</span>, plus vite. »
              </p>
            </div>
          </div>
        </div>

        {/* ============ CTA CONTACT ============ */}
        <div id="contact" className="cta-section" style={{ background: "#193B5E", padding: "90px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(124,184,168,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#7CB8A8", letterSpacing: "0.1em", margin: "0 0 16px" }}>PRÊT À BOOSTER VOS VENTES ?</p>
            <h2 className="cta-title" style={{ fontSize: 36, fontWeight: 700, color: "#fff", margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Et si on faisait le test<br />sur vos prochains biens ?</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", margin: "0 0 36px", lineHeight: 1.7 }}>Rejoignez les promoteurs qui choisissent l'innovation concrète.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 8 }} className="market-cols">
              {[
                { label: "Ligne directe", value: "+32 497 70 94 94", href: "tel:+32497709494" },
                { label: "E-mail général", value: "info@buymonth.be", href: "mailto:info@buymonth.be" },
                { label: "Partenariats", value: "promoteurs@buymonth.be", href: "mailto:promoteurs@buymonth.be" },
              ].map((c, i) => (
                <a key={i} href={c.href} style={{ display: "block", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "20px 16px", textDecoration: "none" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#7CB8A8", letterSpacing: "0.08em", marginBottom: 6 }}>{c.label.toUpperCase()}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", wordBreak: "break-word" }}>{c.value}</div>
                </a>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 28, lineHeight: 1.6 }}>
              BuyMonth est une marque de JG Management SRL, intermédiaire en crédit immobilier agréé par la FSMA sous le numéro 1021.366.349.
            </p>
          </div>
        </div>

      </main>

      <PublicFooter />
      <PublicBottomNav />

    </div>
  );
}