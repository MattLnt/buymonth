"use client";
import { useState } from "react";

const PROVINCES = ["Anvers", "Bruxelles", "Flandre orientale", "Flandre occidentale", "Brabant flamand", "Brabant wallon", "Hainaut", "Liège", "Luxembourg", "Namur", "Limbourg"];
const TYPE_DEALS = [
  { value: "VENTE", label: "Vente" },
  { value: "FUSION", label: "Fusion" },
  { value: "OUVERTURE_CAPITAL", label: "Ouverture du capital" },
  { value: "COLLABORATION", label: "Collaboration" },
];

export default function AlertesForm({ initialData }) {
  const [enabled, setEnabled] = useState(initialData?.alertesEmail ?? true);
  const [provinces, setProvinces] = useState(initialData?.alerteProvinces || []);
  const [typeDeals, setTypeDeals] = useState(initialData?.alerteTypeDeals || []);
  const [caMin, setCaMin] = useState(initialData?.alerteCaMin || "");
  const [caMax, setCaMax] = useState(initialData?.alerteCaMax || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const disabled = initialData?.subStatus !== "active";

  function toggleProvince(p) {
    setProvinces(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  }

  function toggleTypeDeal(t) {
    setTypeDeals(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }

  async function handleSave() {
    setLoading(true); setError(""); setSuccess(false);
    const res = await fetch("/api/acheteur/alertes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        alertesEmail: enabled,
        alerteProvinces: provinces,
        alerteTypeDeals: typeDeals,
        alerteCaMin: caMin ? parseFloat(caMin) : null,
        alerteCaMax: caMax ? parseFloat(caMax) : null,
      }),
    });
    setLoading(false);
    if (!res.ok) setError("Une erreur est survenue");
    else setSuccess(true);
  }

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: "1.5px solid #E5E7EB", fontSize: 14, boxSizing: "border-box",
    outline: "none", background: disabled ? "#F9FAFB" : "#FAFAFA",
    color: "#141414", transition: "border-color 0.2s",
  };
  const sectionStyle = {
    background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6",
    padding: "24px", marginBottom: 14,
    opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? "none" : "auto",
  };

  return (
    <div>
      <style>{`
        @media (max-width: 1024px) {
          .alertes-grid { grid-template-columns: 1fr 1fr !important; }
          .alertes-ca { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {success && (
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "12px 16px", color: "#15803D", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Alertes enregistrées !
        </div>
      )}
      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", color: "#DC2626", fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Toggle alertes */}
      <div style={{ ...sectionStyle, opacity: 1, pointerEvents: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#141414", margin: "0 0 4px" }}>Alertes email</h2>
            <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>Recevoir un email à chaque nouveau dossier correspondant à vos critères</p>
          </div>
          <button onClick={() => { if (!disabled) setEnabled(!enabled); }}
            style={{ width: 44, height: 24, borderRadius: 12, background: enabled && !disabled ? "#FF5A1F" : "#E5E7EB", border: "none", cursor: disabled ? "not-allowed" : "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 2, left: enabled && !disabled ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
          </button>
        </div>
      </div>

      {/* Provinces */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F9FAFB", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5A1F" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#141414", margin: 0 }}>Provinces</h2>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>
              {provinces.length === 0 ? "Toutes les provinces" : `${provinces.length} sélectionnée${provinces.length > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <div className="alertes-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {PROVINCES.map(p => {
            const selected = provinces.includes(p);
            return (
              <button key={p} type="button" onClick={() => toggleProvince(p)}
                style={{ padding: "9px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${selected ? "#FF5A1F" : "#E5E7EB"}`, background: selected ? "rgba(255,90,31,0.1)" : "#FAFAFA", color: selected ? "#C2410C" : "#6B7280", transition: "all 0.15s", textAlign: "left", display: "flex", alignItems: "center", gap: 6 }}>
                {selected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                {p}
              </button>
            );
          })}
        </div>
        {provinces.length > 0 && (
          <button onClick={() => setProvinces([])} style={{ marginTop: 10, fontSize: 12, color: "#FF5A1F", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Tout déselectionner
          </button>
        )}
      </div>

      {/* Type de transaction */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F9FAFB", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5A1F" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#141414", margin: 0 }}>Type de transaction</h2>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>
              {typeDeals.length === 0 ? "Tous les types" : `${typeDeals.length} sélectionné${typeDeals.length > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {TYPE_DEALS.map(t => {
            const selected = typeDeals.includes(t.value);
            return (
              <button key={t.value} type="button" onClick={() => toggleTypeDeal(t.value)}
                style={{ padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${selected ? "#FF5A1F" : "#E5E7EB"}`, background: selected ? "rgba(255,90,31,0.1)" : "#FAFAFA", color: selected ? "#C2410C" : "#6B7280", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6 }}>
                {selected && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CA min/max */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F9FAFB", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5A1F" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          </div>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#141414", margin: 0 }}>Chiffre d'affaires annuel</h2>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Fourchette souhaitée en euros</p>
          </div>
        </div>
        <div className="alertes-ca" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Minimum (€)</label>
            <input type="number" value={caMin} onChange={e => setCaMin(e.target.value)}
              placeholder="ex: 50 000" min="0" style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#FF5A1F"}
              onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Maximum (€)</label>
            <input type="number" value={caMax} onChange={e => setCaMax(e.target.value)}
              placeholder="ex: 500 000" min="0" style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#FF5A1F"}
              onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
          </div>
        </div>
      </div>

      {/* Résumé */}
      <div style={{ background: "#F9FAFB", borderRadius: 12, border: "1px solid #F3F4F6", padding: "16px 20px", marginBottom: 16 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#141414", margin: "0 0 6px" }}>Résumé de vos alertes</p>
        <p style={{ fontSize: 12, color: "#6B7280", margin: 0, lineHeight: 1.7 }}>
          {!enabled ? "Alertes désactivées." : (
            <>
              Alertes activées pour
              {provinces.length > 0 ? ` les provinces : ${provinces.join(", ")}` : " toutes les provinces"}
              {typeDeals.length > 0 ? ` · types : ${typeDeals.map(t => TYPE_DEALS.find(d => d.value === t)?.label).join(", ")}` : ""}
              {caMin ? ` · min ${parseFloat(caMin).toLocaleString("fr-BE")} €` : ""}
              {caMax ? ` · max ${parseFloat(caMax).toLocaleString("fr-BE")} €` : ""}.
            </>
          )}
        </p>
      </div>

      <button onClick={handleSave} disabled={loading || disabled}
        style={{ padding: "13px 28px", borderRadius: 10, background: disabled ? "#E5E7EB" : loading ? "#E5E7EB" : "#141414", color: disabled || loading ? "#9CA3AF" : "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: disabled || loading ? "not-allowed" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8 }}>
        {loading ? "Enregistrement..." : <>Enregistrer mes alertes <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
      </button>
    </div>
  );
}