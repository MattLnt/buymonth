"use client";
import { useState } from "react";

function PasswordInput({ value, onChange, placeholder, required }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{ width: "100%", padding: "12px 44px 12px 14px", borderRadius: 12, border: "1.5px solid #E5E7EB", fontSize: 14, boxSizing: "border-box", outline: "none", background: "#FAFAFA", color: "#141414", transition: "border-color 0.2s" }}
        onFocus={e => e.target.style.borderColor = "#FF5A1F"}
        onBlur={e => e.target.style.borderColor = "#E5E7EB"}
      />
      <button type="button" onClick={() => setShow(!show)}
        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex", alignItems: "center", padding: 0 }}>
        {show
          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        }
      </button>
    </div>
  );
}

export default function MotDePasseForm() {
  const [form, setForm] = useState({ current: "", new: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const conditions = [
    { label: "9 caractères min.", ok: form.new.length >= 9 },
    { label: "Une majuscule", ok: /[A-Z]/.test(form.new) },
    { label: "Un chiffre", ok: /[0-9]/.test(form.new) },
    { label: "Un symbole (!@#...)", ok: /[^A-Za-z0-9]/.test(form.new) },
  ];
  const allConditionsOk = conditions.every(c => c.ok);
  const isValid = form.current && allConditionsOk && form.new === form.confirm;

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.new !== form.confirm) { setError("Les mots de passe ne correspondent pas"); return; }
    if (!allConditionsOk) { setError("Le mot de passe ne respecte pas les critères de sécurité"); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: form.current, newPassword: form.new }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) setError(data.error || "Une erreur est survenue");
    else { setSuccess(true); setForm({ current: "", new: "", confirm: "" }); }
  }

  const labelStyle = {
    display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280",
    textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px",
  };

  if (success) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <div style={{ background: "#F0FDF4", borderRadius: 20, border: "1px solid #BBF7D0", padding: "48px 40px", textAlign: "center", maxWidth: 380, width: "100%" }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#16A34A" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#15803D", margin: "0 0 10px" }}>Mot de passe modifié !</h3>
          <p style={{ fontSize: 13, color: "#16A34A", margin: "0 0 24px", lineHeight: 1.6 }}>Votre mot de passe a été mis à jour avec succès.</p>
          <button onClick={() => setSuccess(false)}
            style={{ background: "#141414", color: "#fff", padding: "11px 24px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}>
            Modifier à nouveau
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .mdp-layout { flex-direction: column !important; max-width: 520px !important; }
          .mdp-right { display: none !important; }
        }
      `}</style>

      <div className="mdp-layout" style={{ display: "flex", gap: 24, width: "100%", maxWidth: 860, alignItems: "flex-start" }}>

        {/* Formulaire */}
        <div style={{ flex: "0 0 480px", minWidth: 0 }}>

          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", color: "#DC2626", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Mot de passe actuel */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid #F9FAFB" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "#F9FAFB", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5A1F" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                </div>
                <div>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: "#141414", margin: 0 }}>Vérification</h2>
                  <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Confirmez votre identité</p>
                </div>
              </div>
              <label style={labelStyle}>Mot de passe actuel *</label>
              <PasswordInput value={form.current} onChange={e => setForm({ ...form, current: e.target.value })} placeholder="Votre mot de passe actuel" required />
            </div>

            {/* Nouveau mot de passe */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid #F9FAFB" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "#F9FAFB", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5A1F" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: "#141414", margin: 0 }}>Nouveau mot de passe</h2>
                  <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Choisissez un mot de passe sécurisé</p>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Nouveau mot de passe *</label>
                <PasswordInput value={form.new} onChange={e => setForm({ ...form, new: e.target.value })} placeholder="Votre nouveau mot de passe" required />

                {/* Critères comme sur register */}
                {form.new.length > 0 && (
                  <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {conditions.map((cond, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 14, height: 14, borderRadius: "50%", flexShrink: 0, background: cond.ok ? "rgba(255,90,31,0.1)" : "#F3F4F6", border: "1.5px solid " + (cond.ok ? "#FF5A1F" : "#E5E7EB"), display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                          {cond.ok && <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#FF5A1F" strokeWidth="2.5"><path d="M2 6l3 3 5-5"/></svg>}
                        </div>
                        <span style={{ fontSize: 11, color: cond.ok ? "#FF5A1F" : "#9CA3AF", fontWeight: cond.ok ? 600 : 400, transition: "color 0.2s" }}>{cond.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>Confirmer le nouveau mot de passe *</label>
                <PasswordInput value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} placeholder="Répétez le nouveau mot de passe" required />
                {form.confirm && form.new !== form.confirm && (
                  <p style={{ fontSize: 11, color: "#EF4444", margin: "6px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Les mots de passe ne correspondent pas
                  </p>
                )}
                {form.confirm && form.new === form.confirm && allConditionsOk && (
                  <p style={{ fontSize: 11, color: "#10B981", margin: "6px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    Les mots de passe correspondent
                  </p>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading || !isValid}
              style={{ padding: "14px", borderRadius: 12, background: !isValid || loading ? "#E5E7EB" : "#141414", color: !isValid || loading ? "#9CA3AF" : "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: !isValid || loading ? "not-allowed" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: isValid && !loading ? "0 4px 20px rgba(20,20,20,0.25)" : "none" }}>
              {loading
                ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Modification en cours...</>
                : <>Modifier le mot de passe <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
              }
            </button>
          </form>
        </div>

        {/* Colonne droite info */}
        <div className="mdp-right" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, paddingTop: 0 }}>

          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #F9FAFB" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FFFBEB", border: "1px solid #FDE68A", display: "flex", alignItems: "center", justifyContent: "center", color: "#D97706" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#141414", margin: 0 }}>Conseils de sécurité</h3>
                <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>Pour protéger votre compte</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { icon: "🔐", text: "Utilisez un mot de passe unique que vous n'utilisez nulle part ailleurs." },
                { icon: "🔡", text: "Combinez majuscules, chiffres et caractères spéciaux (!@#$...)." },
                { icon: "📏", text: "Visez au minimum 12 caractères pour une sécurité optimale." },
                { icon: "🔄", text: "Changez votre mot de passe régulièrement, au moins une fois par an." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "9px 12px", background: "#F9FAFB", borderRadius: 10 }}>
                  <span style={{ fontSize: 13, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#141414", borderRadius: 16, padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>Informations</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Votre session restera active après le changement.",
                "En cas d'oubli, utilisez la page de connexion pour réinitialiser.",
                "Contactez le support si vous suspectez un accès non autorisé.",
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", gap: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#FF5A1F", flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.6 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}