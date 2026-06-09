"use client";
import { useState } from "react";
import Link from "next/link";
import PublicNav from "@/app/components/PublicNav";
import PublicFooter from "@/app/components/PublicFooter";

function CustomSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <div style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${open ? "#FF5A1F" : "#E5E7EB"}`,
          background: "#FAFAFA", fontSize: 14, color: selected ? "#141414" : "#9CA3AF",
          cursor: "pointer", outline: "none", transition: "border-color 0.2s", textAlign: "left",
        }}>
        <span>{selected ? selected.label : placeholder}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} />
          <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 20, background: "#fff", borderRadius: 12, border: "1px solid #F3F4F6", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", overflow: "hidden" }}>
            {options.map(o => (
              <button key={o.value} type="button" onClick={() => { onChange(o.value); setOpen(false); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "11px 14px", textAlign: "left", fontSize: 13, color: value === o.value ? "#141414" : "#6B7280", fontWeight: value === o.value ? 600 : 400, background: value === o.value ? "#F9FAFB" : "transparent", border: "none", cursor: "pointer", borderBottom: "1px solid #F9FAFB" }}>
                <span>{o.label}</span>
                {value === o.value && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ nom: "", email: "", sujet: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const sujets = [
    { value: "question-generale", label: "Question générale" },
    { value: "probleme-technique", label: "Problème technique" },
    { value: "facturation", label: "Facturation / Paiement" },
    { value: "compte", label: "Mon compte" },
    { value: "partenariat", label: "Partenariat" },
    { value: "autre", label: "Autre" },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
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
  const isValid = form.nom && form.email && form.sujet && form.message;

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "var(--font-sans)" }}>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .contact-hero { padding: 72px 24px 48px !important; }
          .contact-hero h1 { font-size: 36px !important; }
          .contact-layout { grid-template-columns: 1fr !important; padding: 40px 20px !important; gap: 32px !important; }
          .contact-sidebar { position: static !important; }
          .contact-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <PublicNav />

      <div style={{ paddingTop: 64 }}>

        {/* Hero */}
        <div className="contact-hero" style={{ background: "#141414", padding: "90px 48px 80px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,90,31,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#FF5A1F", letterSpacing: "0.1em", margin: "0 0 16px" }}>CONTACT</p>
            <h1 style={{ fontSize: 52, fontWeight: 700, color: "#fff", margin: "0 0 18px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Parlons-en.
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", margin: "0 auto", lineHeight: 1.8, maxWidth: 400 }}>
              Une question, un problème ou une suggestion ? Nous vous répondons sous 24h.
            </p>
          </div>
        </div>

        <div className="contact-layout" style={{ maxWidth: 960, margin: "0 auto", padding: "80px 48px", display: "grid", gridTemplateColumns: "1fr 300px", gap: 56, alignItems: "start" }}>

          {/* Formulaire */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#141414", margin: "0 0 28px", letterSpacing: "-0.02em" }}>Envoyer un message</h2>

            {sent ? (
              <div style={{ background: "#F0FDF4", borderRadius: 16, border: "1px solid #BBF7D0", padding: "48px 32px", textAlign: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#16A34A" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#15803D", margin: "0 0 8px" }}>Message envoyé !</h3>
                <p style={{ fontSize: 14, color: "#16A34A", margin: "0 0 24px" }}>Nous vous répondrons dans les 24 heures.</p>
                <button onClick={() => { setSent(false); setForm({ nom: "", email: "", sujet: "", message: "" }); }}
                  style={{ background: "#141414", color: "#fff", padding: "11px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}>
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="contact-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Nom *</label>
                    <input type="text" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required
                      placeholder="Jean Dupont" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#FF5A1F"}
                      onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
                      placeholder="vous@exemple.com" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#FF5A1F"}
                      onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Sujet *</label>
                  <CustomSelect value={form.sujet} onChange={v => setForm({ ...form, sujet: v })} options={sujets} placeholder="Sélectionner un sujet" />
                </div>

                <div>
                  <label style={labelStyle}>Message *</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required
                    rows={6} placeholder="Décrivez votre question ou problème..."
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                    onFocus={e => e.target.style.borderColor = "#FF5A1F"}
                    onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                </div>

                <button type="submit" disabled={loading || !isValid}
                  style={{
                    padding: "13px", borderRadius: 10, fontSize: 14, fontWeight: 700, border: "none",
                    cursor: isValid && !loading ? "pointer" : "not-allowed",
                    background: isValid && !loading ? "#141414" : "#E5E7EB",
                    color: isValid && !loading ? "#fff" : "#9CA3AF",
                    transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: isValid && !loading ? "0 4px 20px rgba(20,20,20,0.15)" : "none",
                  }}>
                  {loading ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                      Envoi en cours...
                    </>
                  ) : "Envoyer le message →"}
                </button>
              </form>
            )}
          </div>

          {/* Infos contact */}
          <div className="contact-sidebar" style={{ position: "sticky", top: 88, display: "flex", flexDirection: "column", gap: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#141414", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Informations</h2>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 8px" }}>Plusieurs façons de nous joindre.</p>

            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, title: "Email", value: "contact@fiderio.be", sub: "Réponse sous 24h" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: "Disponibilité", value: "Lun — Ven", sub: "9h00 — 18h00" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>, title: "Localisation", value: "Belgique", sub: "Plateforme privée off-market" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#F9FAFB", borderRadius: 14, border: "1px solid #F3F4F6", padding: "16px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,90,31,0.08)", border: "1px solid rgba(255,90,31,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5A1F", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "#9CA3AF", margin: "0 0 2px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.title}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#141414", margin: "0 0 1px" }}>{item.value}</p>
                  <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>{item.sub}</p>
                </div>
              </div>
            ))}

            <div style={{ background: "#141414", borderRadius: 14, padding: "18px" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>Consulter la FAQ</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "0 0 14px", lineHeight: 1.6 }}>Trouvez rapidement une réponse à votre question dans notre FAQ.</p>
              <Link href="/faq" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#FF5A1F", textDecoration: "none" }}>
                Voir la FAQ →
              </Link>
            </div>
          </div>
        </div>

        <PublicFooter />
      </div>
    </div>
  );
}