"use client";
import { useState } from "react";
import PublicNav from "@/app/components/PublicNav";
import PublicFooter from "@/app/components/PublicFooter";
import { FormSelect } from "@/app/components/dashboard/FormSelect";

export default function ContactPage() {
  const [form, setForm] = useState({ nom: "", email: "", sujet: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const sujets = [
    { value: "Question générale", label: "Question générale" },
    { value: "Devenir partenaire", label: "Devenir partenaire" },
    { value: "Facturation / Paiement", label: "Facturation / Paiement" },
    { value: "Problème technique", label: "Problème technique" },
    { value: "Autre", label: "Autre" },
  ];

  const isValid = form.nom && form.email && form.message;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Une erreur est survenue."); setLoading(false); return; }
      setSent(true);
    } catch {
      setError("Erreur réseau. Réessayez.");
    }
    setLoading(false);
  }

  const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E8EDF2", fontSize: 14, boxSizing: "border-box", outline: "none", background: "#FAFDFD", color: "#193B5E" };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "#5A6B7D", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 };

  return (
    <div style={{ minHeight: "100vh", background: "#EEF1F6" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .contact-layout { grid-template-columns: 1fr !important; padding: 40px 20px !important; gap: 32px !important; }
          .contact-sidebar { position: static !important; }
          .contact-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <PublicNav />

      <div style={{ paddingTop: 64 }}>
        {/* Hero */}
        <div style={{ background: "linear-gradient(150deg, #16324F 0%, #1D4267 100%)", padding: "72px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-30%", right: "-5%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,184,168,0.16) 0%, transparent 65%)", pointerEvents: "none" }} />
          <p style={{ fontSize: 11, fontWeight: 700, color: "#7CB8A8", letterSpacing: "0.1em", margin: "0 0 14px", position: "relative" }}>CONTACT</p>
          <h1 style={{ fontSize: 42, fontWeight: 700, color: "#fff", margin: "0 0 14px", letterSpacing: "-0.025em", position: "relative" }}>Parlons-en.</h1>
          <p style={{ fontSize: 15.5, color: "rgba(255,255,255,0.6)", margin: "0 auto", maxWidth: 420, lineHeight: 1.7, position: "relative" }}>
            Une question, un projet ou une demande de partenariat ? Notre équipe vous répond rapidement.
          </p>
        </div>

        <div className="contact-layout" style={{ maxWidth: 980, margin: "0 auto", padding: "64px 24px 80px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 40, alignItems: "start" }}>

          {/* Formulaire */}
          <div style={{ background: "#fff", border: "1px solid #EEF2F7", borderRadius: 18, padding: 32 }}>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: "#193B5E", margin: "0 0 24px" }}>Envoyer un message</h2>

            {sent ? (
              <div style={{ background: "rgba(36,158,124,0.08)", borderRadius: 16, border: "1px solid rgba(36,158,124,0.22)", padding: "44px 32px", textAlign: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(36,158,124,0.14)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#249E7C" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1B7A5E", margin: "0 0 8px" }}>Message envoyé !</h3>
                <p style={{ fontSize: 14, color: "#249E7C", margin: "0 0 24px" }}>Nous vous répondrons dans les meilleurs délais.</p>
                <button onClick={() => { setSent(false); setForm({ nom: "", email: "", sujet: "", message: "" }); }}
                  style={{ background: "#193B5E", color: "#fff", padding: "11px 22px", borderRadius: 10, fontSize: 13.5, fontWeight: 600, border: "none", cursor: "pointer" }}>
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="contact-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Nom *</label>
                    <input type="text" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Jean Dupont" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="vous@exemple.com" style={inputStyle} />
                  </div>
                </div>

                <div>
                  <FormSelect label="Sujet" value={form.sujet} onChange={v => setForm({ ...form, sujet: v })} options={sujets} placeholder="Sélectionner un sujet" />
                </div>

                <div>
                  <label style={labelStyle}>Message *</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={6} placeholder="Décrivez votre demande..." style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
                </div>

                {error && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#ef4444", fontSize: 13.5, borderRadius: 10, padding: "12px 14px" }}>{error}</div>
                )}

                <button type="submit" disabled={loading || !isValid}
                  style={{
                    padding: "14px", borderRadius: 10, fontSize: 14.5, fontWeight: 700, border: "none",
                    cursor: isValid && !loading ? "pointer" : "not-allowed",
                    background: isValid && !loading ? "#193B5E" : "#E5E9F0",
                    color: isValid && !loading ? "#fff" : "#A9B0BE",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}>
                  {loading ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                      Envoi en cours...
                    </>
                  ) : "Envoyer le message →"}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar infos */}
          <div className="contact-sidebar" style={{ position: "sticky", top: 88, display: "flex", flexDirection: "column", gap: 12 }}>
            <h2 style={{ fontSize: 15.5, fontWeight: 700, color: "#193B5E", margin: "0 0 4px" }}>Coordonnées</h2>
            <p style={{ fontSize: 13, color: "#9AA2B4", margin: "0 0 8px" }}>Plusieurs façons de nous joindre.</p>

            {[
              { icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>, title: "Email", value: "info@buymonth.be", href: "mailto:info@buymonth.be" },
              { icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />, title: "Téléphone", value: "+32 497 70 94 94", href: "tel:+32497709494" },
              { icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, title: "Disponibilité", value: "Lun — Ven · 9h-18h", href: null },
            ].map((item, i) => {
              const inner = (
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EEF2F7", padding: "16px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(124,184,168,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#7CB8A8", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">{item.icon}</svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: "#9AA2B4", margin: "0 0 2px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.title}</p>
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: "#193B5E", margin: 0 }}>{item.value}</p>
                  </div>
                </div>
              );
              return item.href ? <a key={i} href={item.href} style={{ textDecoration: "none" }}>{inner}</a> : <div key={i}>{inner}</div>;
            })}

            <div style={{ background: "linear-gradient(135deg, #16324F, #1D4267)", borderRadius: 14, padding: "20px" }}>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>Devenir partenaire</p>
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", margin: "0 0 14px", lineHeight: 1.6 }}>Promoteur ou agence ? Rejoignez le réseau BuyMonth.</p>
              <a href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#7CB8A8", textDecoration: "none" }}>
                S'inscrire →
              </a>
            </div>
          </div>
        </div>

        <PublicFooter />
      </div>
    </div>
  );
}