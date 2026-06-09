"use client";
import { useState } from "react";

function validateBce(val) {
  return /^\d{10}$/.test(val.replace(/\./g, "").replace(/\s/g, ""));
}

function formatBce(val) {
  return val.replace(/\D/g, "");
}

export default function ProfilForm({ initialData, role }) {
  const [form, setForm] = useState(initialData || {});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (role === "VENDEUR" && form.numeroBce && !validateBce(form.numeroBce)) {
      setError("Le numéro BCE doit contenir exactement 10 chiffres (ex: 0663760904)");
      return;
    }
    setLoading(true); setError(""); setSuccess(false);
    const endpoint = role === "VENDEUR" ? "/api/vendeur/profil" : "/api/acheteur/profil";
    const res = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) setError(data.error || "Une erreur est survenue");
    else setSuccess(true);
  }

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: "1.5px solid #E5E7EB", fontSize: 14, boxSizing: "border-box",
    outline: "none", background: "#FAFAFA", color: "#141414", transition: "border-color 0.2s",
  };
  const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 700, color: "#6B7280",
    textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8,
  };

  const bceValid = form.numeroBce ? validateBce(form.numeroBce) : false;
  const isValid = form.nomBureau && form.nomCEO && form.telephone && form.adresse && form.numeroBce && bceValid;

  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .profil-layout { flex-direction: column !important; max-width: 520px !important; }
          .profil-right { display: none !important; }
          .profil-grid2 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="profil-layout" style={{ display: "flex", gap: 24, width: "100%", maxWidth: 860, alignItems: "flex-start" }}>

        {/* Formulaire */}
        <div style={{ flex: "0 0 480px", minWidth: 0 }}>

          {/* Bandeau succès en haut du form — reste visible */}
          {success && (
            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "12px 16px", color: "#15803D", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Profil mis à jour avec succès !
            </div>
          )}

          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", color: "#DC2626", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid #F9FAFB" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "#F9FAFB", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5A1F" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: "#141414", margin: 0 }}>Votre bureau</h2>
                  <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Informations transmises aux acheteurs après déblocage</p>
                </div>
              </div>

              <div className="profil-grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Nom du bureau *</label>
                  <input type="text" value={form.nomBureau || ""} onChange={e => setForm({ ...form, nomBureau: e.target.value })} required
                    placeholder="Bureau Dupont" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#FF5A1F"}
                    onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                </div>
                <div>
                  <label style={labelStyle}>Nom du dirigeant *</label>
                  <input type="text" value={form.nomCEO || ""} onChange={e => setForm({ ...form, nomCEO: e.target.value })} required
                    placeholder="Jean Dupont" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#FF5A1F"}
                    onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Téléphone *</label>
                <input type="text" value={form.telephone || ""} onChange={e => setForm({ ...form, telephone: e.target.value })} required
                  placeholder="+32 456 78 90 12" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#FF5A1F"}
                  onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Adresse *</label>
                <input type="text" value={form.adresse || ""} onChange={e => setForm({ ...form, adresse: e.target.value })} required
                  placeholder="Rue Exemple 1, 1000 Bruxelles" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#FF5A1F"}
                  onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
              </div>

              {/* Numéro BCE */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Numéro BCE *</label>
                  {form.numeroBce && (
                    bceValid
                      ? <span style={{ fontSize: 10, fontWeight: 700, color: "#10B981", background: "#F0FDF4", border: "1px solid #BBF7D0", padding: "2px 8px", borderRadius: 20 }}>✓ Valide</span>
                      : <span style={{ fontSize: 10, fontWeight: 700, color: "#EF4444", background: "#FEF2F2", border: "1px solid #FECACA", padding: "2px 8px", borderRadius: 20 }}>Format incorrect</span>
                  )}
                </div>
                <div style={{ position: "relative" }}>
                  <input type="text" value={form.numeroBce || ""} onChange={e => setForm({ ...form, numeroBce: formatBce(e.target.value) })} required
                    placeholder="0123456789" maxLength={10}
                    style={{ ...inputStyle, borderColor: form.numeroBce && !bceValid ? "#FECACA" : "#E5E7EB", paddingRight: bceValid ? 120 : 14 }}
                    onFocus={e => e.target.style.borderColor = "#FF5A1F"}
                    onBlur={e => e.target.style.borderColor = form.numeroBce && !bceValid ? "#FECACA" : "#E5E7EB"} />
                  {form.numeroBce && bceValid && (
                    <a href={`https://kbopub.economie.fgov.be/kbopub/toonondernemingps.html?ondernemingsnummer=${form.numeroBce}&lang=fr`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, fontWeight: 600, color: "#FF5A1F", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                      Vérifier BCE
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  )}
                </div>
                <p style={{ fontSize: 11, color: "#9CA3AF", margin: "6px 0 0" }}>
                  10 chiffres sans espaces ni points — ex: 0123456789
                </p>
              </div>
            </div>

            <button type="submit" disabled={loading || !isValid}
              style={{ padding: "14px", borderRadius: 12, background: !isValid || loading ? "#E5E7EB" : "#141414", color: !isValid || loading ? "#9CA3AF" : "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: !isValid || loading ? "not-allowed" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: isValid && !loading ? "0 4px 20px rgba(20,20,20,0.25)" : "none" }}>
              {loading
                ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Enregistrement...</>
                : <>Enregistrer les modifications <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
              }
            </button>
          </form>
        </div>

        {/* Colonne droite */}
        <div className="profil-right" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>

          <div style={{ background: "#141414", borderRadius: 16, padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,90,31,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5A1F" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              </div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>Confidentialité garantie</h3>
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 14px", lineHeight: 1.6 }}>
              Ces informations ne sont jamais affichées publiquement. Elles sont transmises uniquement après un déblocage payant (699 €) par un acheteur vérifié.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Nom et coordonnées masqués sur la plateforme",
                "Transmission uniquement après déblocage",
                "Acheteurs vérifiés et abonnés uniquement",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12"/></svg>
                  <span style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F0FDF4", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              </div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#141414", margin: 0 }}>Complétude du profil</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Nom du bureau", done: !!form.nomBureau },
                { label: "Nom du dirigeant", done: !!form.nomCEO },
                { label: "Téléphone", done: !!form.telephone },
                { label: "Adresse", done: !!form.adresse },
                { label: "Numéro BCE", done: !!form.numeroBce && bceValid },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "#F9FAFB", borderRadius: 8 }}>
                  <span style={{ fontSize: 12, color: "#374151" }}>{item.label}</span>
                  {item.done
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}