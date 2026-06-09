"use client";
import { useState } from "react";
import Link from "next/link";
import PublicNav from "@/app/components/PublicNav";
import PublicFooter from "@/app/components/PublicFooter";

const faqs = [
  {
    categorie: "Général",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    desc: "Présentation de la plateforme",
    questions: [
      { q: "Qu'est-ce que Fiderio ?", r: "Fiderio est une plateforme privée off-market dédiée à la cession de fiduciaires. Elle met en relation des dirigeants vendeurs et des acheteurs dans un cadre confidentiel et structuré." },
      { q: "Qui peut utiliser la plateforme ?", r: "La plateforme est réservée aux professionnels de la comptabilité — experts-comptables, fiduciaires, et tout professionnel souhaitant céder ou acquérir un cabinet." },
      { q: "La plateforme est-elle réservée à la Belgique ?", r: "Oui, Fiderio est exclusivement dédiée au marché des fiduciaires en Belgique." },
    ]
  },
  {
    categorie: "Vendeurs",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
    desc: "Déposer et gérer vos dossiers",
    questions: [
      { q: "Est-ce vraiment gratuit pour les vendeurs ?", r: "Oui, déposer un dossier est entièrement gratuit. Vous ne payez rien, même si votre dossier est débloqué par un acheteur. La commission est à charge exclusive de l'acheteur." },
      { q: "Mon identité est-elle protégée ?", r: "Absolument. Aucune information identifiable (nom, adresse, logo, email, téléphone) n'est visible par les acheteurs avant déblocage payant. Seules les données anonymisées (province, chiffre d'affaires annuel, activités, type de transaction) sont visibles." },
      { q: "Combien de dossiers puis-je déposer ?", r: "Il n'y a aucune limite. Vous pouvez déposer autant de dossiers que vous le souhaitez." },
      { q: "Puis-je modifier ou supprimer mon dossier ?", r: "Oui, vous pouvez modifier, masquer ou supprimer vos dossiers à tout moment depuis votre tableau de bord." },
      { q: "Que se passe-t-il quand un acheteur débloque mon dossier ?", r: "Vous recevez une notification par email. Vous pouvez ensuite contacter l'acheteur directement ou via la messagerie interne sécurisée de la plateforme." },
    ]
  },
  {
    categorie: "Acheteurs",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
    desc: "Accéder et débloquer des dossiers",
    questions: [
      { q: "Comment fonctionne l'abonnement ?", r: "L'abonnement à 59€/mois vous donne accès à tous les dossiers disponibles, aux filtres avancés et aux alertes email. Il est sans engagement et peut être résilié à tout moment." },
      { q: "Que contient un dossier avant déblocage ?", r: "Avant déblocage, vous voyez la province, le chiffre d'affaires annuel, le nombre de clients, le nombre de collaborateurs, les activités (Comptabilité, Fiscalité, Gestion salariale, etc.), le type de transaction et la présence du dirigeant après cession." },
      { q: "Que contient un dossier après déblocage ?", r: "Après déblocage, vous accédez aux coordonnées complètes du vendeur : nom du cabinet, nom du dirigeant, email de contact, téléphone et adresse." },
      { q: "Puis-je débloquer plusieurs dossiers ?", r: "Oui, chaque déblocage est indépendant à 699€. Une fois débloqué, l'accès est permanent." },
      { q: "Les alertes sont-elles personnalisables ?", r: "Vous pouvez activer ou désactiver les alertes email depuis votre tableau de bord. Vous serez notifié à chaque nouveau dossier publié." },
    ]
  },
  {
    categorie: "Paiements",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    desc: "Facturation et sécurité",
    questions: [
      { q: "Comment sont sécurisés les paiements ?", r: "Tous les paiements sont traités via Stripe, le leader mondial des paiements en ligne. Nous ne stockons jamais vos données bancaires." },
      { q: "Puis-je obtenir un remboursement ?", r: "L'abonnement peut être résilié à tout moment. Les déblocages de dossiers sont non remboursables une fois les coordonnées du vendeur révélées." },
      { q: "Comment est calculée la commission ?", r: "La commission est à charge de l'acheteur et dépend du pack choisi au moment du déblocage. Elle est calculée sur le chiffre d'affaires annuel de la fiduciaire : 1,5% (Pack Mise en relation), 3,5% (Pack Intégration Métier), 3,5% (Pack Communication & Transition) ou 5% (Pack Full Premium)." },
      { q: "Puis-je obtenir une facture ?", r: "Oui, des reçus automatiques sont envoyés par email via Stripe après chaque paiement." },
    ]
  },
];

function FAQItem({ question, reponse, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #F3F4F6", overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: "100%", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: open ? "#FF5A1F" : "#D1D5DB", minWidth: 20, letterSpacing: "0.02em", flexShrink: 0 }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span style={{ fontSize: 14, fontWeight: 600, color: open ? "#141414" : "#374151", lineHeight: 1.4 }}>{question}</span>
        </div>
        <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: open ? "#141414" : "#F9FAFB", border: `1px solid ${open ? "#141414" : "#E5E7EB"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={open ? "#fff" : "#9CA3AF"} strokeWidth="2.5"
            style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
      </button>
      {open && (
        <div style={{ paddingLeft: 32, paddingBottom: 20 }}>
          <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.8, margin: 0, borderLeft: "2px solid #FF5A1F", paddingLeft: 16 }}>{reponse}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [categorie, setCategorie] = useState("Général");
  const current = faqs.find(f => f.categorie === categorie);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "var(--font-sans)" }}>
      <style>{`
        @media (max-width: 768px) {
          .faq-hero { padding: 72px 24px 48px !important; }
          .faq-hero h1 { font-size: 32px !important; }
          .faq-layout { grid-template-columns: 1fr !important; padding: 32px 20px !important; gap: 24px !important; }
          .faq-sidebar { position: static !important; }
          .faq-cats { flex-direction: row !important; flex-wrap: wrap !important; gap: 8px !important; }
          .faq-cat-btn { flex: 1 !important; min-width: calc(50% - 4px) !important; }
          .faq-tarifs-card { display: none !important; }
          .faq-cta { grid-template-columns: 1fr !important; gap: 16px !important; }
          .faq-cta a { text-align: center !important; justify-content: center !important; }
        }
      `}</style>

      <PublicNav />
      <div style={{ paddingTop: 64 }}>

        {/* Hero */}
        <div className="faq-hero" style={{ background: "#141414", padding: "90px 48px 80px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,90,31,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#FF5A1F", letterSpacing: "0.1em", margin: "0 0 16px" }}>FAQ</p>
            <h1 style={{ fontSize: 52, fontWeight: 700, color: "#fff", margin: "0 0 18px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Questions fréquentes.
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", margin: "0 auto", lineHeight: 1.8, maxWidth: 440 }}>
              Tout ce que vous devez savoir sur la plateforme Fiderio.
            </p>
          </div>
        </div>

        {/* Contenu */}
        <div className="faq-layout" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 48px", display: "grid", gridTemplateColumns: "260px 1fr", gap: 48, alignItems: "start" }}>

          {/* Sidebar */}
          <div className="faq-sidebar" style={{ position: "sticky", top: 88 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 16px" }}>Catégories</p>
            <div className="faq-cats" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {faqs.map(f => {
                const isActive = categorie === f.categorie;
                return (
                  <button key={f.categorie} onClick={() => setCategorie(f.categorie)} className="faq-cat-btn"
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, border: `1px solid ${isActive ? "#141414" : "#F3F4F6"}`, background: isActive ? "#141414" : "#fff", cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isActive ? "rgba(255,90,31,0.15)" : "#F9FAFB", color: isActive ? "#FF5A1F" : "#9CA3AF", transition: "all 0.15s" }}>
                      {f.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? "#fff" : "#141414", marginBottom: 2 }}>{f.categorie}</div>
                      <div style={{ fontSize: 11, color: isActive ? "rgba(255,255,255,0.4)" : "#9CA3AF" }}>{f.questions.length} questions</div>
                    </div>
                    {isActive && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
                  </button>
                );
              })}
            </div>

            <div className="faq-tarifs-card" style={{ marginTop: 24, background: "#F9FAFB", borderRadius: 14, border: "1px solid #F3F4F6", padding: "18px" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#141414", margin: "0 0 6px" }}>Voir les tarifs</p>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 12px", lineHeight: 1.5 }}>Retrouvez le détail complet de nos offres.</p>
              <Link href="/tarifs" style={{ fontSize: 12, fontWeight: 700, color: "#FF5A1F", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                Page tarifs →
              </Link>
            </div>
          </div>

          {/* Questions */}
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,90,31,0.08)", border: "1px solid rgba(255,90,31,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5A1F", flexShrink: 0 }}>
                  {current?.icon}
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#141414", margin: 0, letterSpacing: "-0.02em" }}>{categorie}</h2>
              </div>
              <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>{current?.desc} · {current?.questions.length} questions</p>
            </div>

            <div>
              {current?.questions.map((item, i) => (
                <FAQItem key={i} question={item.q} reponse={item.r} index={i} />
              ))}
            </div>

            <div className="faq-cta" style={{ marginTop: 48, background: "#141414", borderRadius: 16, padding: "28px 32px", display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>Vous n'avez pas trouvé votre réponse ?</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.6 }}>Notre équipe répond à toutes vos questions sous 24h.</p>
              </div>
              <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#FF5A1F", color: "#141414", padding: "11px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                Nous contacter →
              </Link>
            </div>
          </div>
        </div>

        <PublicFooter />
      </div>
    </div>
  );
}