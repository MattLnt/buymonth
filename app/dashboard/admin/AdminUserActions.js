"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminUserActions({ userId, email }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState(email);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type, text }

  function showToast(type, text) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  }

  async function call(body) {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error || "Erreur");
      } else {
        showToast("success", data.message || "OK");
        if (body.action === "update-email") {
          setEmailModal(false);
          router.refresh();
        }
      }
    } catch {
      showToast("error", "Erreur réseau");
    }
    setLoading(false);
  }

  function handleReset() {
    setOpen(false);
    if (confirm(`Envoyer un lien de réinitialisation de mot de passe à ${email} ?`)) {
      call({ action: "send-reset", userId });
    }
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setOpen(!open)} title="Actions"
        style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div style={{ position: "absolute", right: 0, top: 36, zIndex: 41, background: "#fff", border: "1px solid #F3F4F6", borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.12)", padding: 6, minWidth: 210 }}>
            <button onClick={() => { setOpen(false); setNewEmail(email); setEmailModal(true); }}
              style={{ width: "100%", textAlign: "left", padding: "9px 12px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "#141414", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}
              onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Modifier l'email
            </button>
            <button onClick={handleReset}
              style={{ width: "100%", textAlign: "left", padding: "9px 12px", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: "#141414", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}
              onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              Envoyer un lien de réinitialisation
            </button>
          </div>
        </>
      )}

      {emailModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(20,20,20,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={() => !loading && setEmailModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: "28px", width: "100%", maxWidth: 420, textAlign: "left" }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#141414", margin: "0 0 6px" }}>Modifier l'email</h3>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 20px", lineHeight: 1.5 }}>L'utilisateur devra utiliser cette nouvelle adresse pour se connecter.</p>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Nouvel email</label>
            <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
              style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "12px 14px", fontSize: 14, color: "#141414", outline: "none", boxSizing: "border-box", background: "#fafafa", marginBottom: 20 }}
              onFocus={e => e.target.style.borderColor = "#FF5A1F"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setEmailModal(false)} disabled={loading}
                style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Annuler</button>
              <button onClick={() => call({ action: "update-email", userId, email: newEmail })} disabled={loading || !newEmail}
                style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: loading || !newEmail ? "#e5e7eb" : "#141414", color: loading || !newEmail ? "#9ca3af" : "#fff", fontSize: 13, fontWeight: 700, cursor: loading || !newEmail ? "not-allowed" : "pointer" }}>
                {loading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 60, background: toast.type === "error" ? "#FEF2F2" : "#F0FDF4", border: `1px solid ${toast.type === "error" ? "#FECACA" : "#BBF7D0"}`, color: toast.type === "error" ? "#EF4444" : "#15803D", padding: "12px 18px", borderRadius: 12, fontSize: 13, fontWeight: 600, boxShadow: "0 8px 30px rgba(0,0,0,0.12)", maxWidth: 320 }}>
          {toast.text}
        </div>
      )}
    </div>
  );
}