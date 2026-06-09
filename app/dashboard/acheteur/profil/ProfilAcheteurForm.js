"use client";
import { useState } from "react";

const ACTIVITES = ["IARD", "Vie", "Crédit immobilier", "Crédit à tempérament", "Banque", "Placement"];

export default function ProfilAcheteurForm({ initialData, email }) {
  const [form, setForm] = useState({
    nomBureau: initialData?.nomBureau || "",
    nomCEO: initialData?.nomCEO || "",
    telephone: initialData?.telephone || "",
    adresse: initialData?.adresse || "",
    siteInternet: initialData?.siteInternet || "",
    chiffreAffaires: initialData?.chiffreAffaires || "",
    nombreClients: initialData?.nombreClients || "",
    nombreCollaborateurs: initialData?.nombreCollaborateurs || "",
    activites: initialData?.activites || [],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function toggleActivite(act) {
    setForm(prev => ({
      ...prev,
      activites: prev.activites.includes(act)
        ? prev.activites.filter(a => a !== act)
        : [...prev.activites, act],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess(false);
    const res = await fetch("/api/acheteur/profil", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        chiffreAffaires: form.chiffreAffaires ? parseFloat(form.chiffreAffaires) : null,
        nombreClients: form.nombreClients ? parseInt(form.nombreClients) : null,
        nombreCollaborateurs: form.nombreCollaborateurs ? parseInt(form.nombreCollaborateurs) : null,
      }),
    });
    setLoading(false);
    if (!res.ok) setError("Une erreur est survenue");
    else setSuccess(true);
  }

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: "1.5px solid #E5E7EB", fontSize: 14, boxSizing: "border-box",
    outline: "none", background: "#FAFAFA", color: "#141414", transition: "border-color 0.2s",
  };
  const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 700, color: "#6B7280",
    textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8,
  };
  const sectionStyle = {
    background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "24px", marginBottom: 14,
  };

  return (
    <form onSubmit={handleSubmit}>
      <style>{`
        @media (max-width: 1024px) {
          .profil-grid2 { grid-template-columns: 1fr !important; }
          .profil-grid3 { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {success && (
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "12px 16px", color: "#15803D", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Profil mis à jour avec succès !
        </div>
      )}
      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", color: "#DC2626", fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Email (lecture seule) */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F9FAFB", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5A1F" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#141414", margin: 0 }}>Compte</h2>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Informations de connexion</p>
          </div>
        </div>
        <label style={labelStyle}>Email</label>
        <div style={{ ...inputStyle, color: "#6B7280", background: "#F9FAFB", display: "flex", alignItems: "center" }}>
          {email}
        </div>
        <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6, marginBottom: 0 }}>Pour modifier votre email, contactez le support.</p>
      </div>

      {/* Infos bureau */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F9FAFB", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5A1F" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#141414", margin: 0 }}>Votre bureau</h2>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Présentez votre bureau aux vendeurs</p>
          </div>
        </div>

        <div className="profil-grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Nom du bureau</label>
            <input type="text" value={form.nomBureau} onChange={e => setForm({ ...form, nomBureau: e.target.value })}
              placeholder="Bureau Dupont" style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#FF5A1F"}
              onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
          </div>
          <div>
            <label style={labelStyle}>Nom du dirigeant</label>
            <input type="text" value={form.nomCEO} onChange={e => setForm({ ...form, nomCEO: e.target.value })}
              placeholder="Jean Dupont" style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#FF5A1F"}
              onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
          </div>
        </div>

        <div className="profil-grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Téléphone</label>
            <input type="text" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })}
              placeholder="+32 456 78 90 12" style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#FF5A1F"}
              onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
          </div>
          <div>
            <label style={labelStyle}>Site internet</label>
            <input type="text" value={form.siteInternet} onChange={e => setForm({ ...form, siteInternet: e.target.value })}
              placeholder="www.monbureau.be" style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#FF5A1F"}
              onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Adresse</label>
          <input type="text" value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })}
            placeholder="Rue Exemple 1, 1000 Bruxelles" style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#FF5A1F"}
            onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
        </div>
      </div>

      {/* Chiffres clés */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F9FAFB", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5A1F" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#141414", margin: 0 }}>Chiffres clés</h2>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Votre activité actuelle</p>
          </div>
        </div>

        <div className="profil-grid3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {[
            { key: "chiffreAffaires", label: "Chiffre d'affaires annuel (€)", placeholder: "500 000", type: "number" },
            { key: "nombreClients", label: "Nombre de clients", placeholder: "800", type: "number" },
            { key: "nombreCollaborateurs", label: "Collaborateurs", placeholder: "3", type: "number" },
          ].map(f => (
            <div key={f.key}>
              <label style={labelStyle}>{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder} min="0" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#FF5A1F"}
                onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
            </div>
          ))}
        </div>
      </div>

      {/* Activités */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F9FAFB", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5A1F" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#141414", margin: 0 }}>Activités</h2>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Vos domaines d'expertise</p>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {ACTIVITES.map(act => {
            const selected = form.activites.includes(act);
            return (
              <button key={act} type="button" onClick={() => toggleActivite(act)}
                style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${selected ? "#FF5A1F" : "#E5E7EB"}`, background: selected ? "rgba(255,90,31,0.1)" : "#FAFAFA", color: selected ? "#C2410C" : "#6B7280", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6 }}>
                {selected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                {act}
              </button>
            );
          })}
        </div>
      </div>

      <button type="submit" disabled={loading}
        style={{ width: "100%", maxWidth: 400, padding: "13px", borderRadius: 10, background: loading ? "#E5E7EB" : "#141414", color: loading ? "#9CA3AF" : "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: !loading ? "0 4px 20px rgba(20,20,20,0.2)" : "none" }}>
        {loading ? "Enregistrement..." : <>Enregistrer mon profil <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
      </button>
    </form>
  );
}