"use client";
import Link from "next/link";
import { useState } from "react";
import PublicNav from "@/app/components/PublicNav";
import PublicFooter from "@/app/components/PublicFooter";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    { q: "Comment fonctionne l'affichage en mensualités ?", a: "En tant qu'intermédiaire en crédit agréé FSMA, nous convertissons le prix de vos biens en mensualité indicative. Vous communiquez un budget mensuel clair à vos prospects, tout en restant parfaitement conforme à la réglementation." },
    { q: "Quel est le coût de la plateforme ?", a: "Une redevance fixe de 500€/mois donne accès à la plateforme. Chaque génération de widget pour un bien est facturée 90€, une seule fois par bien. Une facturation simple et transparente." },
    { q: "Qui gère le dossier de financement ?", a: "BuyMonth pilote l'intégralité du dossier de crédit, de la simulation jusqu'à la signature de l'acte. Nous présentons le dossier à plusieurs banques partenaires pour maximiser les chances d'acceptation." },
    { q: "Le pré-scoring, comment ça marche ?", a: "Le pré-scoring analyse la faisabilité financière du crédit sur demande. Vos commerciaux savent immédiatement s'ils parlent à un acheteur solvable, ce qui filtre les leads et vous fait gagner un temps précieux." },
    { q: "Y a-t-il un engagement de durée ?", a: "L'abonnement est sans engagement et résiliable à tout moment depuis votre tableau de bord. La résiliation prend effet à la fin de la période de facturation en cours." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "var(--font-sans)", color: "#1A1E2E", overflow: "hidden" }}>

      <PublicNav variant="light" />

      <style>{`
        .serif-it { font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-weight: 500; }
        @media (max-width: 900px) {
          .ps-hero-title { font-size: 44px !important; }
          .ps-pad { padding: 64px 24px !important; }
          .ps-grid-3 { grid-template-columns: 1fr !important; }
          .ps-grid-2 { grid-template-columns: 1fr !important; gap: 32px !important; }
          .ps-dash { transform: none !important; }
          .ps-dash-aside { display: none !important; }
          .ps-logos { gap: 28px !important; }
        }
      `}</style>

      {/* ============ HERO ============ */}
      <section style={{ position: "relative", padding: "150px 24px 0", textAlign: "center", background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,184,168,0.18) 0%, transparent 60%), linear-gradient(180deg, #EEF3FA 0%, #fff 70%)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <span style={{ background: "#193B5E", color: "#fff", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>Nouveau</span>
            <span style={{ fontSize: 14, color: "#5A6275" }}>Approuvé par 400+ professionnels de l'immobilier</span>
          </div>

          <h1 className="ps-hero-title" style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 24px", color: "#193B5E" }}>
            Vendez vos biens<br /><span className="serif-it" style={{ color: "#7CB8A8" }}>en mensualités</span>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: "#5A6275", maxWidth: 560, margin: "0 auto 36px" }}>
            Transformez votre approche commerciale avec une plateforme pensée pour les promoteurs : affichage en budget mensuel, qualification des leads et financement intégré.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 70 }}>
            <Link href="/register" style={{ background: "#193B5E", color: "#fff", padding: "15px 32px", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none", boxShadow: "0 12px 30px rgba(25,59,94,0.25)" }}>
              Commencer
            </Link>
            <Link href="#contact" style={{ background: "#fff", color: "#193B5E", padding: "15px 32px", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none", boxShadow: "0 6px 20px rgba(25,59,94,0.1)" }}>
              Réserver une démo
            </Link>
          </div>
        </div>

        {/* ===== FAUX DASHBOARD ===== */}
        <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="ps-dash" style={{ background: "#fff", borderRadius: "20px 20px 0 0", boxShadow: "0 -10px 60px rgba(25,59,94,0.15)", border: "1px solid #EBEFF5", borderBottom: "none", overflow: "hidden", textAlign: "left" }}>
            {/* Topbar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #EFF2F7" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "#193B5E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2.5"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#193B5E" }}>BuyMonth</span>
              </div>
              <div style={{ flex: 1, maxWidth: 300, margin: "0 20px", background: "#F4F6FB", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "#9AA2B4" }}>Rechercher un bien…</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(124,184,168,0.2)" }} />
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#193B5E" }} />
              </div>
            </div>

            <div style={{ display: "flex" }}>
              {/* Sidebar */}
              <div className="ps-dash-aside" style={{ width: 180, borderRight: "1px solid #EFF2F7", padding: "18px 14px", flexShrink: 0 }}>
                {[
                  { label: "Tableau de bord", active: true },
                  { label: "Mes biens" },
                  { label: "Leads" },
                  { label: "Simulations" },
                  { label: "Dossiers crédit" },
                  { label: "Reporting" },
                  { label: "Paramètres" },
                ].map((m, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, marginBottom: 2, background: m.active ? "rgba(25,59,94,0.07)" : "transparent" }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: m.active ? "#193B5E" : "#D5DAE3" }} />
                    <span style={{ fontSize: 13, fontWeight: m.active ? 700 : 500, color: m.active ? "#193B5E" : "#7A8298" }}>{m.label}</span>
                  </div>
                ))}
              </div>

              {/* Contenu */}
              <div style={{ flex: 1, padding: "22px 24px", background: "#FBFCFE" }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#193B5E", margin: "0 0 2px" }}>Bonjour, Julien</h3>
                <p style={{ fontSize: 13, color: "#9AA2B4", margin: "0 0 20px" }}>Voici l'activité de votre portefeuille en temps réel.</p>

                {/* KPI cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                  {[
                    { label: "Biens actifs", value: "24", trend: "+3 ce mois", color: "#193B5E" },
                    { label: "Leads qualifiés", value: "58", trend: "+12% ce mois", color: "#7CB8A8" },
                    { label: "Simulations", value: "142", trend: "+24% ce mois", color: "#193B5E" },
                    { label: "Dossiers actés", value: "9", trend: "+2 ce mois", color: "#7CB8A8" },
                  ].map((k, i) => (
                    <div key={i} style={{ background: "#fff", border: "1px solid #EFF2F7", borderRadius: 12, padding: "14px" }}>
                      <div style={{ fontSize: 11, color: "#9AA2B4", marginBottom: 6 }}>{k.label}</div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: k.color, lineHeight: 1 }}>{k.value}</div>
                      <div style={{ fontSize: 10, color: "#7CB8A8", marginTop: 5, fontWeight: 600 }}>{k.trend}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 12 }}>
                  {/* Graph */}
                  <div style={{ background: "#fff", border: "1px solid #EFF2F7", borderRadius: 12, padding: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#193B5E" }}>Leads par mois</span>
                      <span style={{ fontSize: 11, color: "#9AA2B4", background: "#F4F6FB", padding: "4px 10px", borderRadius: 6 }}>2026</span>
                    </div>
                    <svg width="100%" height="130" viewBox="0 0 320 130" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(124,184,168,0.35)" />
                          <stop offset="100%" stopColor="rgba(124,184,168,0)" />
                        </linearGradient>
                      </defs>
                      <path d="M0,100 C40,90 60,60 100,65 C140,70 160,30 200,40 C240,50 260,20 320,15 L320,130 L0,130 Z" fill="url(#g1)" />
                      <path d="M0,100 C40,90 60,60 100,65 C140,70 160,30 200,40 C240,50 260,20 320,15" fill="none" stroke="#7CB8A8" strokeWidth="2.5" />
                      <path d="M0,115 C50,108 70,95 110,98 C150,101 180,80 220,85 C260,90 280,75 320,70" fill="none" stroke="#193B5E" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.6" />
                    </svg>
                    <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                      <span style={{ fontSize: 11, color: "#7A8298", display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7CB8A8" }} />Leads reçus</span>
                      <span style={{ fontSize: 11, color: "#7A8298", display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#193B5E" }} />Qualifiés</span>
                    </div>
                  </div>

                  {/* Donut */}
                  <div style={{ background: "#fff", border: "1px solid #EFF2F7", borderRadius: 12, padding: "18px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#193B5E", alignSelf: "flex-start", marginBottom: 12 }}>Taux de conversion</span>
                    <svg width="110" height="110" viewBox="0 0 42 42">
                      <circle cx="21" cy="21" r="15.9" fill="none" stroke="#EFF2F7" strokeWidth="5" />
                      <circle cx="21" cy="21" r="15.9" fill="none" stroke="#7CB8A8" strokeWidth="5" strokeDasharray="68 100" strokeDashoffset="25" strokeLinecap="round" />
                      <text x="21" y="20" textAnchor="middle" fontSize="8" fontWeight="700" fill="#193B5E">68%</text>
                      <text x="21" y="27" textAnchor="middle" fontSize="3.5" fill="#9AA2B4">acheteurs</text>
                    </svg>
                    <div style={{ marginTop: 12, width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#7A8298", marginBottom: 4 }}><span>Signés</span><span style={{ fontWeight: 700, color: "#193B5E" }}>39</span></div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#7A8298" }}><span>En cours</span><span style={{ fontWeight: 700, color: "#193B5E" }}>19</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LOGOS ============ */}
      <section className="ps-pad" style={{ padding: "60px 24px", background: "#fff", borderTop: "1px solid #F1F4F9" }}>
        <p style={{ textAlign: "center", fontSize: 14, color: "#9AA2B4", margin: "0 0 32px" }}>La solution de référence pour les promoteurs et agences en Belgique</p>
        <div className="ps-logos" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 56, opacity: 0.55 }}>
          {["Promoteurs", "Constructeurs", "Agences", "Notaires", "Courtiers", "FSMA"].map((l, i) => (
            <span key={i} style={{ fontSize: 22, fontWeight: 700, color: "#193B5E", letterSpacing: "-0.02em" }}>{l}</span>
          ))}
        </div>
      </section>

      {/* ============ INTRO FEATURES ============ */}
      <section id="solution" className="ps-pad" style={{ padding: "90px 24px 40px", textAlign: "center" }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#7CB8A8", margin: "0 0 14px" }}>● Fonctionnalités clés</p>
        <h2 style={{ fontSize: 46, fontWeight: 700, color: "#193B5E", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          Simplifiez la vente<br /><span className="serif-it" style={{ color: "#7CB8A8" }}>immobilière.</span>
        </h2>
      </section>

      {/* ============ SECTION CAPTURE LEADS (split features) ============ */}
      <section className="ps-pad" style={{ padding: "60px 24px 90px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="ps-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div style={{ background: "linear-gradient(135deg, #193B5E, #24507A)", borderRadius: 24, padding: "40px", minHeight: 380, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,184,168,0.25) 0%, transparent 70%)" }} />
              {[
                { label: "Prix du bien", val: "315 000 €" },
                { label: "Mensualité estimée", val: "1 260 € /mois", hl: true },
                { label: "Durée", val: "25 ans" },
                { label: "Profil acheteur", val: "Solvable ✓", hl: true },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "16px 20px", position: "relative", zIndex: 1 }}>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{r.label}</span>
                  <span style={{ fontSize: 17, fontWeight: 700, color: r.hl ? "#7CB8A8" : "#fff" }}>{r.val}</span>
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#7CB8A8", margin: "0 0 14px" }}>● Qualification intelligente</p>
              <h3 style={{ fontSize: 34, fontWeight: 700, color: "#193B5E", margin: "0 0 20px", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                Analysez vos leads pour <span className="serif-it" style={{ color: "#7CB8A8" }}>accélérer la vente.</span>
              </h3>
              <p style={{ fontSize: 16, color: "#5A6275", lineHeight: 1.7, margin: "0 0 28px" }}>
                Découvrez comment rester organisé, gagner du temps et développer vos ventes immobilières.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                {[
                  { title: "Capture des leads", desc: "Collectez les prospects depuis vos sites, QR codes et campagnes." },
                  { title: "Qualification automatique", desc: "Score et segmentation des leads selon leur solvabilité et leur intérêt." },
                  { title: "Conversion & financement", desc: "Outils de communication intelligents pour transformer vos prospects en acheteurs." },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", paddingLeft: 16, borderLeft: i === 0 ? "2px solid #7CB8A8" : "2px solid #EFF2F7" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(124,184,168,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#193B5E" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div>
                      <h4 style={{ fontSize: 16, fontWeight: 700, color: "#193B5E", margin: "0 0 4px" }}>{f.title}</h4>
                      <p style={{ fontSize: 14, color: "#5A6275", margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROCESS 7 ÉTAPES ============ */}
      <section id="process" className="ps-pad" style={{ padding: "90px 24px", background: "#FBFCFE", borderTop: "1px solid #F1F4F9", borderBottom: "1px solid #F1F4F9" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#7CB8A8", margin: "0 0 14px" }}>● Notre process</p>
            <h2 style={{ fontSize: 42, fontWeight: 700, color: "#193B5E", margin: 0, letterSpacing: "-0.02em" }}>En 7 étapes, <span className="serif-it" style={{ color: "#7CB8A8" }}>clé en main.</span></h2>
          </div>
          <div className="ps-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {[
              { num: "01", title: "Mensualisation des biens", desc: "Conversion de vos biens en affichage €/mois pour vos supports marketing." },
              { num: "02", title: "Capture des leads", desc: "QR codes, landing pages dédiées et bornes interactives en showroom." },
              { num: "03", title: "Simulation personnalisée", desc: "Calcul de la mensualité adaptée au profil du prospect." },
              { num: "04", title: "Constitution du dossier", desc: "Accompagnement étape par étape pour un dossier de financement complet." },
              { num: "05", title: "Analyse crédit", desc: "Présentation simultanée à plusieurs banques pour la meilleure offre." },
              { num: "06", title: "Offre ferme", desc: "Le prospect devient acheteur, conditions suspensives levées." },
              { num: "07", title: "Acte & reporting", desc: "Signature finale et reporting détaillé pour votre suivi commercial." },
            ].map((s, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #EFF2F7", borderRadius: 18, padding: "26px" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#7CB8A8", marginBottom: 14, display: "inline-flex", width: 42, height: 42, borderRadius: 12, background: "rgba(124,184,168,0.12)", alignItems: "center", justifyContent: "center" }}>{s.num}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#193B5E", margin: "0 0 8px" }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "#5A6275", margin: 0 }}>{s.desc}</p>
              </div>
            ))}
            <div style={{ background: "linear-gradient(135deg, #193B5E, #2A5278)", borderRadius: 18, padding: "26px", display: "flex", flexDirection: "column", justifyContent: "center", color: "#fff" }}>
              <h3 style={{ fontSize: 19, fontWeight: 700, margin: "0 0 8px" }}>Prêt à tester ?</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.8)", margin: "0 0 16px" }}>Et si on faisait le test sur vos prochains biens ?</p>
              <Link href="/register" style={{ display: "inline-flex", alignSelf: "flex-start", background: "#7CB8A8", color: "#193B5E", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Commencer →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRICING (fond navy) ============ */}
      <section id="tarifs" className="ps-pad" style={{ padding: "90px 24px", background: "#193B5E", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 700, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,184,168,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#7CB8A8", margin: "0 0 14px" }}>● Tarifs</p>
            <h2 style={{ fontSize: 44, fontWeight: 700, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Une tarification <span className="serif-it" style={{ color: "#7CB8A8" }}>simple.</span></h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", margin: 0 }}>Pas d'engagement. Résiliable à tout moment.</p>
          </div>

          <div className="ps-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {/* Abonnement */}
            <div style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", position: "relative", boxShadow: "0 26px 60px rgba(0,0,0,0.3)" }}>
              <div style={{ position: "absolute", top: 24, right: 24, background: "#193B5E", color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 20 }}>Accès plateforme</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#7CB8A8", margin: "0 0 12px" }}>Abonnement</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                <span style={{ fontSize: 46, fontWeight: 700, color: "#193B5E", letterSpacing: "-0.02em" }}>500 €</span>
                <span style={{ fontSize: 14, color: "#9AA2B4" }}>/mois</span>
              </div>
              <p style={{ fontSize: 13, color: "#9AA2B4", margin: "0 0 24px" }}>Tout ce qu'il faut pour gérer votre portefeuille.</p>
              <Link href="/register" style={{ display: "block", textAlign: "center", background: "#193B5E", color: "#fff", padding: "13px", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none", marginBottom: 24 }}>Commencer</Link>
              <div style={{ borderTop: "1px solid #EFF2F7", paddingTop: 18 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#9AA2B4", letterSpacing: "0.08em", margin: "0 0 14px" }}>INCLUS</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {["Accès complet à la plateforme", "Biens illimités en mensualités", "Réception de leads qualifiés", "Calcul de mensualité agréé FSMA", "Support par email"].map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ fontSize: 13, color: "#3A4256" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Widget */}
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "36px 32px" }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)", margin: "0 0 12px" }}>Widget par bien</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                <span style={{ fontSize: 46, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>90 €</span>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>/ bien</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 24px" }}>Paiement unique, à la génération du widget.</p>
              <Link href="/register" style={{ display: "block", textAlign: "center", background: "#7CB8A8", color: "#193B5E", padding: "13px", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none", marginBottom: 24 }}>Commencer</Link>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 18 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", margin: "0 0 14px" }}>INCLUS</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {["Badge mensualité personnalisable", "Code d'intégration iframe & HTML", "Téléchargement SVG et PNG", "Valable à vie pour le bien"].map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="ps-pad" style={{ padding: "90px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#7CB8A8", margin: "0 0 14px" }}>● FAQ</p>
            <h2 style={{ fontSize: 42, fontWeight: 700, color: "#193B5E", margin: 0, letterSpacing: "-0.02em" }}>Questions <span className="serif-it" style={{ color: "#7CB8A8" }}>fréquentes.</span></h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #EFF2F7", borderRadius: 14, overflow: "hidden" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#193B5E" }}>{f.q}</span>
                  <span style={{ fontSize: 24, color: "#7CB8A8", lineHeight: 1, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 22px", fontSize: 15, color: "#5A6275", lineHeight: 1.7 }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section id="contact" className="ps-pad" style={{ padding: "40px 24px 90px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ position: "relative", borderRadius: 32, padding: "80px 48px", textAlign: "center", overflow: "hidden", background: "linear-gradient(135deg, #193B5E 0%, #245179 55%, #2E6388 100%)" }}>
            <div style={{ position: "absolute", top: -80, left: "30%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,184,168,0.3) 0%, transparent 65%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ fontSize: 44, fontWeight: 700, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                Boostez vos ventes <span className="serif-it" style={{ color: "#7CB8A8" }}>dès maintenant.</span>
              </h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.8)", margin: "0 0 36px", maxWidth: 520, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
                Rejoignez les promoteurs qui choisissent l'innovation concrète. Moins d'incertitude, plus de ventes, plus vite.
              </p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
                <a href="tel:+32497709494" style={{ background: "#7CB8A8", color: "#193B5E", padding: "15px 32px", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>+32 497 70 94 94</a>
                <a href="mailto:info@buymonth.be" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", padding: "15px 32px", borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>info@buymonth.be</a>
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                BuyMonth est une marque de JG Management SRL, intermédiaire en crédit immobilier agréé par la FSMA n°1021.366.349.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />

    </div>
  );
}