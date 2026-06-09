"use client";
import { useState, useEffect } from "react";

export default function ForfaitPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [subStatus, setSubStatus] = useState(null);
  const [subEndsAt, setSubEndsAt] = useState(null);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  function fetchData() {
    return fetch("/api/acheteur/abonnement")
      .then(r => r.json())
      .then(data => {
        setSubStatus(data.subStatus);
        setSubEndsAt(data.subEndsAt || null);
        setCancelAtPeriodEnd(data.cancelAtPeriodEnd === true);
        setFetching(false);
      });
  }

  useEffect(() => { fetchData(); }, []);

  async function handleAbonnement() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setLoading(false);
    if (data.url) window.location.href = data.url;
  }

  async function handleCancel() {
    setActionLoading(true);
    const res = await fetch("/api/acheteur/abonnement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
    const data = await res.json();
    setActionLoading(false);
    if (res.ok) {
      setShowCancelModal(false);
      setCancelAtPeriodEnd(true);
      if (data.subEndsAt) setSubEndsAt(data.subEndsAt);
      setMessage("ok:Votre abonnement a été résilié. Vous conservez l'accès jusqu'à la fin de la période en cours.");
    } else {
      setMessage("err:" + (data.error || "Une erreur est survenue"));
      setShowCancelModal(false);
    }
  }

  async function handleReactivate() {
    setActionLoading(true);
    const res = await fetch("/api/acheteur/abonnement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reactivate" }),
    });
    setActionLoading(false);
    if (res.ok) {
      setCancelAtPeriodEnd(false);
      setMessage("ok:Votre abonnement a été réactivé.");
    } else {
      setMessage("err:Une erreur est survenue");
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" });
  };

  const isOk = message.startsWith("ok:");
  const messageText = message.replace(/^(ok|err):/, "");

  const PERTES = [
    "L'accès à toutes les opportunités de la plateforme",
    "L'accès aux coordonnées des dossiers que vous avez déjà débloqués",
    "La messagerie avec les vendeurs",
    "Vos alertes email sur les nouvelles opportunités",
    "Vos filtres et préférences de recherche",
  ];

  if (fetching) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
        <div style={{ fontSize: 13, color: "#9CA3AF" }}>Chargement...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640 }}>

      {/* Modal de résiliation */}
      {showCancelModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={() => !actionLoading && setShowCancelModal(false)}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(3px)" }} />
          <div style={{ background: "#fff", borderRadius: 18, padding: "28px", maxWidth: 460, width: "100%", position: "relative", zIndex: 1 }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", marginBottom: 16 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#141414", margin: "0 0 8px" }}>Résilier votre abonnement ?</h3>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 16px", lineHeight: 1.6 }}>
              À la fin de votre période en cours{subEndsAt ? ` (le ${formatDate(subEndsAt)})` : ""}, vous perdrez :
            </p>
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {PERTES.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    <span style={{ fontSize: 13, color: "#7F1D1D", lineHeight: 1.4 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 20px", lineHeight: 1.5 }}>
              Les déblocages déjà payés (699 €/dossier) ne sont pas remboursables. Vous pourrez vous réabonner à tout moment pour retrouver vos accès.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowCancelModal(false)} disabled={actionLoading}
                style={{ flex: 1, padding: "12px", borderRadius: 10, background: "#141414", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
                Conserver mon abonnement
              </button>
              <button onClick={handleCancel} disabled={actionLoading}
                style={{ flex: 1, padding: "12px", borderRadius: 10, background: "#fff", color: "#EF4444", fontWeight: 600, fontSize: 13, border: "1.5px solid #FECACA", cursor: actionLoading ? "not-allowed" : "pointer", opacity: actionLoading ? 0.6 : 1 }}>
                {actionLoading ? "Résiliation..." : "Résilier quand même"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#141414", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Mon abonnement</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Gérez votre accès à la plateforme</p>
      </div>

      {message && (
        <div style={{ background: isOk ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${isOk ? "#BBF7D0" : "#FECACA"}`, borderRadius: 10, padding: "12px 16px", color: isOk ? "#15803D" : "#DC2626", fontSize: 13, marginBottom: 16 }}>
          {messageText}
        </div>
      )}

      {/* Bannière résiliation programmée */}
      {subStatus === "active" && cancelAtPeriodEnd && (
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "16px 20px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#C2410C", margin: "0 0 2px" }}>Résiliation programmée</p>
            <p style={{ fontSize: 13, color: "#B45309", margin: 0 }}>
              Vous conservez l'accès jusqu'au {subEndsAt ? formatDate(subEndsAt) : "terme de la période en cours"}.
            </p>
          </div>
          <button onClick={handleReactivate} disabled={actionLoading}
            style={{ padding: "9px 16px", borderRadius: 9, background: "#141414", color: "#fff", fontWeight: 600, fontSize: 13, border: "none", cursor: actionLoading ? "not-allowed" : "pointer", flexShrink: 0, opacity: actionLoading ? 0.7 : 1 }}>
            {actionLoading ? "..." : "Réactiver l'abonnement"}
          </button>
        </div>
      )}

      {/* Statut abonnement */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "32px" }}>
        {subStatus === "active" ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: cancelAtPeriodEnd ? "#F59E0B" : "#10B981" }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: "#141414" }}>
                {cancelAtPeriodEnd ? "Abonnement actif — résiliation programmée" : "Abonnement actif"}
              </span>
            </div>
            <div style={{ background: "#F0FDF4", borderRadius: 12, padding: "20px 24px", marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: "#16A34A", fontWeight: 600, marginBottom: 6, letterSpacing: "0.05em" }}>PLAN ACHETEUR</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#141414", marginBottom: 4 }}>59 €<span style={{ fontSize: 16, color: "#6B7280", fontWeight: 400 }}> / mois</span></div>
              <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Accès illimité à toutes les opportunités</p>
              {subEndsAt && !cancelAtPeriodEnd && (
                <p style={{ fontSize: 12, color: "#9CA3AF", margin: "8px 0 0" }}>
                  Prochain renouvellement le {formatDate(subEndsAt)}
                </p>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              {[
                "Toutes les opportunités disponibles",
                "Filtres avancés (province, commissions, activité...)",
                "Alertes nouvelles opportunités",
                "Déblocage de dossiers à l'unité",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#374151" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  {item}
                </div>
              ))}
            </div>

            {!cancelAtPeriodEnd && (
              <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 20 }}>
                <button onClick={() => setShowCancelModal(true)}
                  style={{ background: "none", border: "none", color: "#9CA3AF", fontSize: 13, fontWeight: 500, cursor: "pointer", padding: 0, textDecoration: "underline", textUnderlineOffset: 3 }}
                  onMouseEnter={e => e.currentTarget.style.color = "#EF4444"}
                  onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}>
                  Résilier mon abonnement
                </button>
                <p style={{ fontSize: 11, color: "#D1D5DB", margin: "6px 0 0" }}>
                  Sans engagement — l'accès reste actif jusqu'à la fin de la période payée.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#9CA3AF" }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: "#141414" }}>Aucun abonnement actif</span>
            </div>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, marginBottom: 24 }}>
              Abonnez-vous pour accéder à toutes les opportunités, filtrer par province, commissions, activité et recevoir des alertes.
            </p>
            <button
              onClick={handleAbonnement}
              disabled={loading}
              style={{ width: "100%", padding: "14px", borderRadius: 10, background: "#141414", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Redirection..." : "S'abonner — 59 € / mois"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}