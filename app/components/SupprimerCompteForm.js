"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useLang } from "@/app/components/i18n/LangProvider";

export default function SupprimerCompteForm() {
  const { t } = useLang();
  // Mot à taper pour confirmer, dans la langue affichée
  const MOT = t("SUPPRIMER", "VERWIJDEREN");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSupprimer(e) {
    e.preventDefault();
    if (confirmation !== MOT) {
      setError(t("Tapez SUPPRIMER pour confirmer", "Typ VERWIJDEREN om te bevestigen"));
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/account/delete", {
      method: "DELETE",
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || t("Une erreur est survenue", "Er is een fout opgetreden"));
    } else {
      signOut({ callbackUrl: "/" });
    }
  }

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #FECACA", padding: "32px", maxWidth: 480 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", color: "#DC2626", flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
        </div>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#DC2626", margin: 0 }}>{t("Zone dangereuse", "Gevarenzone")}</h3>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>{t("Cette action est irréversible", "Deze actie is onomkeerbaar")}</p>
        </div>
      </div>

      <div style={{ background: "#FEF2F2", borderRadius: 10, padding: "14px 16px", marginBottom: 24, fontSize: 13, color: "#991B1B", lineHeight: 1.6 }}>
        {t(
          "La suppression de votre compte entraîne la perte définitive de toutes vos données. Cette action ne peut pas être annulée.",
          "Als u uw account verwijdert, gaan al uw gegevens definitief verloren. Deze actie kan niet ongedaan worden gemaakt."
        )}
      </div>

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", color: "#DC2626", fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSupprimer}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
            {t("Tapez ", "Typ ")}<strong>{MOT}</strong>{t(" pour confirmer", " om te bevestigen")}
          </label>
          <input
            type="text"
            value={confirmation}
            onChange={e => setConfirmation(e.target.value)}
            placeholder={MOT}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #FECACA", fontSize: 14, boxSizing: "border-box", outline: "none", background: "#fff", color: "#141414" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading || confirmation !== MOT}
          style={{ width: "100%", padding: "12px", borderRadius: 8, background: confirmation === MOT ? "#DC2626" : "#F3F4F6", color: confirmation === MOT ? "#fff" : "#9CA3AF", fontWeight: 600, fontSize: 14, border: "none", cursor: confirmation === MOT && !loading ? "pointer" : "not-allowed" }}
        >
          {loading ? t("Suppression...", "Verwijderen...") : t("Supprimer définitivement mon compte", "Mijn account definitief verwijderen")}
        </button>
      </form>
    </div>
  );
}