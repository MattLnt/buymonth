"use client";
import { useState } from "react";

const PACKS = [
  {
    id: 1,
    label: "Mise en relation",
    commission: "1,5%",
    taux: 0.015,
    color: "#FF5A1F",
    desc: "Pour les professionnels qui souhaitent gérer la suite en toute autonomie.",
    includes: [
      "Accès au dossier complet",
      "Mise en relation vendeur / acheteur",
      "Transmission des coordonnées complètes",
      "Modèle d'offre fourni",
    ],
    ideal: "Idéal pour les professionnels autonomes qui n'ont pas besoin d'accompagnement.",
  },
  {
    id: 2,
    label: "Intégration Métier",
    commission: "3,5%",
    taux: 0.035,
    color: "#FF5A1F",
    desc: "Accompagnement métier complet pour réussir l'intégration technique et réglementaire.",
    includes: [
      "Tout du Pack Mise en relation",
      "Analyse du portefeuille repris et pistes d'optimisation",
      "Analyse de la base clients et de sa qualité",
      "Complétion des données manquantes",
      "Rédaction des courriers de transfert",
      "Harmonisation des process internes",
      "Accompagnement ITAA & RGPD",
      "Support organisationnel pendant la transition",
    ],
    ideal: "Idéal pour une reprise fluide et structurée. Nous gérons toute la partie opérationnelle.",
  },
  {
    id: 3,
    label: "Communication & Transition",
    commission: "3,5%",
    taux: 0.035,
    color: "#FF5A1F",
    desc: "Pour rassurer les clients et réussir l'unification des marques et canaux de communication.",
    includes: [
      "Tout du Pack Mise en relation",
      "Communication clients avant/pendant/après reprise",
      "Rédaction des messages stratégiques",
      "Harmonisation des marques et identité visuelle",
      "Réflexion logo / identité visuelle",
      "Fusion ou redirection des sites internet",
      "Cohérence réseaux sociaux",
      "Communiqué de presse si opportun",
      "Mise en place d'une stratégie commerciale",
    ],
    ideal: "Idéal lors d'une fusion visible ou d'un changement d'image de marque.",
  },
  {
    id: 4,
    label: "Full Premium",
    commission: "5%",
    taux: 0.05,
    color: "#FF5A1F",
    desc: "L'accompagnement global combinant expertise métier, intégration et communication.",
    includes: [
      "Tout du Pack Intégration Métier",
      "Tout du Pack Communication & Transition",
      "Coordination générale du projet",
      "Accompagnement global jusqu'à finalisation",
      "Interlocuteur unique dédié",
    ],
    ideal: "Idéal pour maximiser la réussite de la reprise de A à Z.",
  },
];

function PackModal({ pack, chiffreAffaires, onClose }) {
  const commissionEstimee = Math.round(chiffreAffaires * pack.taux);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />
      <div style={{ background: "#141414", borderRadius: 20, padding: "28px", maxWidth: 480, width: "100%", position: "relative", zIndex: 1, border: `1px solid ${pack.color}40`, maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9CA3AF" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${pack.color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: pack.color }}>{pack.commission}</span>
          </div>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", margin: 0 }}>{pack.label}</h3>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Commission sur transaction aboutie</p>
          </div>
        </div>

        {/* Commission estimée dans la modal */}
        <div style={{ background: `${pack.color}12`, borderRadius: 10, padding: "12px 14px", marginBottom: 16, border: `1px solid ${pack.color}25`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, letterSpacing: "0.05em", marginBottom: 2 }}>COMMISSION ESTIMÉE</div>
            <div style={{ fontSize: 11, color: "#6B7280" }}>Sur {chiffreAffaires.toLocaleString("fr-BE")} € · si transaction aboutie</div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: pack.color }}>
            {commissionEstimee.toLocaleString("fr-BE")} €
          </div>
        </div>

        <p style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.7, margin: "0 0 20px" }}>{pack.desc}</p>

        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", margin: "0 0 12px", letterSpacing: "0.06em" }}>CE QUI EST INCLUS</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pack.includes.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: `${pack.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={pack.color} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span style={{ fontSize: 13, color: "#D1D5DB", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: `${pack.color}15`, borderRadius: 12, padding: "14px 16px", border: `1px solid ${pack.color}30` }}>
          <p style={{ fontSize: 13, color: pack.color, fontWeight: 600, margin: "0 0 4px" }}>💡 {pack.ideal}</p>
          <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0, lineHeight: 1.5 }}>
            La commission n'est due qu'en cas de transaction aboutie. Les frais externes (juridiques, légaux, etc.) restent distincts.
          </p>
        </div>

        <button onClick={onClose} style={{ width: "100%", marginTop: 16, padding: "12px", borderRadius: 10, background: pack.color, color: "#141414", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
          Fermer
        </button>
      </div>
    </div>
  );
}

export default function DeblocageButton({ opportuniteId, chiffreAffaires }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("pack");
  const [selectedPack, setSelectedPack] = useState(null);
  const [cgvAccepted, setCgvAccepted] = useState(false);
  const [modalPack, setModalPack] = useState(null);

  async function handleDeblocage() {
    if (!cgvAccepted) return;
    setLoading(true);
    const res = await fetch("/api/acheteur/debloquer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportuniteId, packCommission: selectedPack }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.url) window.location.href = data.url;
  }

  const pack = PACKS.find(p => p.id === selectedPack);

  if (step === "pack") {
    return (
      <>
        {modalPack && <PackModal pack={modalPack} chiffreAffaires={chiffreAffaires} onClose={() => setModalPack(null)} />}

        <div>
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", margin: "0 0 4px", letterSpacing: "0.05em" }}>CHOISISSEZ VOTRE PACK</p>
            <p style={{ fontSize: 11, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>
              La commission n'est due qu'en cas de transaction aboutie, calculée sur le chiffre d'affaires annuel de la fiduciaire.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {PACKS.map((p) => {
              const selected = selectedPack === p.id;
              const commissionEstimee = Math.round(chiffreAffaires * p.taux);
              return (
                <div key={p.id} style={{ borderRadius: 12, border: `1.5px solid ${selected ? p.color : "rgba(255,255,255,0.08)"}`, background: selected ? `${p.color}15` : "rgba(255,255,255,0.03)", transition: "all 0.15s", overflow: "hidden" }}>
                  <button onClick={() => setSelectedPack(p.id)} style={{ width: "100%", padding: "12px 14px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selected ? p.color : "rgba(255,255,255,0.2)"}`, background: selected ? p.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {selected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: selected ? "#fff" : "#D1D5DB" }}>{p.label}</span>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: p.color }}>{p.commission}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: selected ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)" }}>
                          ≈ {commissionEstimee.toLocaleString("fr-BE")} €
                        </div>
                        <div style={{ fontSize: 10, color: "#6B7280" }}>si transaction</div>
                      </div>
                    </div>
                    <p style={{ fontSize: 11, color: "#6B7280", margin: "6px 0 0 26px", lineHeight: 1.4, textAlign: "left" }}>{p.desc}</p>
                  </button>
                  <div style={{ padding: "0 14px 10px 14px" }}>
                    <button onClick={() => setModalPack(p)}
                      style={{ background: "none", border: "none", color: p.color, fontSize: 11, fontWeight: 600, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 4, marginLeft: 26 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                      Voir le détail du pack
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 12px", marginBottom: 14, display: "flex", gap: 8 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <p style={{ fontSize: 11, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>
              Commission calculée sur le chiffre d'affaires annuel ({chiffreAffaires.toLocaleString("fr-BE")} €), uniquement si la transaction aboutit.
            </p>
          </div>

          <button onClick={() => setStep("cgv")} disabled={!selectedPack}
            style={{ width: "100%", padding: "13px", borderRadius: 10, background: selectedPack ? "#FF5A1F" : "#374151", color: selectedPack ? "#141414" : "#6B7280", fontWeight: 700, fontSize: 14, border: "none", cursor: selectedPack ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
            Continuer →
          </button>
        </div>
      </>
    );
  }

  if (step === "cgv" && pack) {
    const commissionEstimee = Math.round(chiffreAffaires * pack.taux);
    return (
      <div>
        <button onClick={() => setStep("pack")} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 12, marginBottom: 16, padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Changer de pack
        </button>

        {/* Récap */}
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "16px", marginBottom: 14, border: `1px solid ${pack.color}30` }}>
          <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, letterSpacing: "0.05em", marginBottom: 8 }}>PACK SÉLECTIONNÉ</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{pack.label}</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: pack.color }}>{pack.commission}</span>
          </div>

          {/* Commission estimée */}
          <div style={{ background: `${pack.color}10`, borderRadius: 8, padding: "8px 12px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${pack.color}20` }}>
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>Commission estimée si transaction aboutie</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: pack.color }}>{commissionEstimee.toLocaleString("fr-BE")} €</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {pack.includes.slice(0, 4).map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={pack.color} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>{item}</span>
              </div>
            ))}
            {pack.includes.length > 4 && (
              <span style={{ fontSize: 11, color: "#6B7280", paddingLeft: 18 }}>+ {pack.includes.length - 4} autres inclus</span>
            )}
          </div>
          <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(0,0,0,0.2)", borderRadius: 8, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#6B7280" }}>Déblocage (immédiat)</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>699 €</span>
          </div>
        </div>

        {/* CGV */}
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "14px", marginBottom: 14, maxHeight: 120, overflowY: "auto", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.7 }}>
            <strong style={{ color: "#D1D5DB", display: "block", marginBottom: 6 }}>Conditions Générales de Vente</strong>
            En débloquant ce dossier, vous accédez aux coordonnées complètes du vendeur (699 €, non remboursable).<br /><br />
            Vous vous engagez à verser une commission de <strong style={{ color: pack.color }}>{pack.commission}</strong> sur le chiffre d'affaires annuel de la fiduciaire ({chiffreAffaires.toLocaleString("fr-BE")} €), soit <strong style={{ color: pack.color }}>{commissionEstimee.toLocaleString("fr-BE")} €</strong>, uniquement en cas de transaction aboutie.<br /><br />
            Les honoraires couvrent l'accompagnement et l'expertise. Les frais externes (publications légales, conseils juridiques, etc.) restent distincts.
          </div>
        </div>

        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 16 }}>
          <div onClick={() => setCgvAccepted(!cgvAccepted)}
            style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${cgvAccepted ? "#FF5A1F" : "rgba(255,255,255,0.2)"}`, background: cgvAccepted ? "#FF5A1F" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, cursor: "pointer", transition: "all 0.15s" }}>
            {cgvAccepted && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
          </div>
          <span style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>
            J'accepte les CGV et m'engage à payer la commission de <span style={{ color: pack.color, fontWeight: 600 }}>{pack.commission}</span> ({commissionEstimee.toLocaleString("fr-BE")} €) en cas de transaction aboutie.
          </span>
        </label>

        <button onClick={handleDeblocage} disabled={!cgvAccepted || loading}
          style={{ width: "100%", padding: "13px", borderRadius: 10, background: cgvAccepted ? "#FF5A1F" : "#374151", color: cgvAccepted ? "#141414" : "#6B7280", fontWeight: 700, fontSize: 14, border: "none", cursor: cgvAccepted && !loading ? "pointer" : "not-allowed", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {loading ? (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Redirection...</>
          ) : (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>Débloquer ce dossier — 699 €</>
          )}
        </button>
      </div>
    );
  }

  return null;
}