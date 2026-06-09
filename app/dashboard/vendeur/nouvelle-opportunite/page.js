"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PROVINCES = ["Anvers", "Bruxelles", "Flandre orientale", "Flandre occidentale", "Brabant flamand", "Brabant wallon", "Hainaut", "Liège", "Luxembourg", "Namur", "Limbourg"];
const ACTIVITES = ["Comptabilité", "Fiscalité", "Création d'entreprise", "Gestion salariale", "Transmission d'entreprise", "Juridique", "Autre"];

const INITIAL_FORM = {
  province: "", chiffreAffaires: "", nombreClients: "", nombreCollaborateurs: "",
  activites: [], typeDeal: [], presenceDirigeant: "", description: "",
  utiliseBrio: null, exclusiviteCompagnie: null, nomCompagnie: "",
  venteImmeuble: null, valeurImmeuble: "", dossierDigitalise: null,
  logiciels: "",
  caIard: "", caVie: "", caCreditImmo: "", caCreditTempo: "", caPlacement: "", caBanque: "",
  adressesComplementaires: [""],
};

function CustomSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o === value);
  return (
    <div style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${open ? "#FF5A1F" : "#E5E7EB"}`, background: "#FAFAFA", fontSize: 14, color: selected ? "#141414" : "#9CA3AF", cursor: "pointer", outline: "none", transition: "border-color 0.2s", textAlign: "left" }}>
        <span>{selected || placeholder}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} />
          <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 20, background: "#fff", borderRadius: 12, border: "1px solid #F3F4F6", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", overflow: "hidden", maxHeight: 260, overflowY: "auto" }}>
            {options.map(o => (
              <button key={o} type="button" onClick={() => { onChange(o); setOpen(false); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "10px 14px", textAlign: "left", fontSize: 13, color: value === o ? "#141414" : "#6B7280", fontWeight: value === o ? 600 : 400, background: value === o ? "#F9FAFB" : "transparent", border: "none", cursor: "pointer", borderBottom: "1px solid #F9FAFB" }}>
                <span>{o}</span>
                {value === o && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function NouvelleOpportunitePage() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  function toggleActivite(act) {
    setForm(prev => ({ ...prev, activites: prev.activites.includes(act) ? prev.activites.filter(a => a !== act) : [...prev.activites, act] }));
  }
  function toggleTypeDeal(val) {
    setForm(prev => ({ ...prev, typeDeal: prev.typeDeal.includes(val) ? prev.typeDeal.filter(v => v !== val) : [...prev.typeDeal, val] }));
  }
  function setBool(field, val) { setForm(prev => ({ ...prev, [field]: val })); }
  function addAdresse() { setForm(prev => ({ ...prev, adressesComplementaires: [...prev.adressesComplementaires, ""] })); }
  function updateAdresse(idx, val) {
    setForm(prev => { const arr = [...prev.adressesComplementaires]; arr[idx] = val; return { ...prev, adressesComplementaires: arr }; });
  }
  function removeAdresse(idx) {
    setForm(prev => ({ ...prev, adressesComplementaires: prev.adressesComplementaires.filter((_, i) => i !== idx) }));
  }

  function handleReset() {
    if (window.confirm("Effacer tout le formulaire ? Cette action est irréversible.")) {
      setForm(INITIAL_FORM);
      setError("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.activites.length === 0) { setError("Sélectionnez au moins une activité"); return; }
    if (form.typeDeal.length === 0) { setError("Sélectionnez au moins un type de transaction"); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/vendeur/opportunites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        chiffreAffaires: parseFloat(form.chiffreAffaires),
        nombreClients: parseInt(form.nombreClients),
        nombreCollaborateurs: parseInt(form.nombreCollaborateurs),
        valeurImmeuble: form.venteImmeuble === true && form.valeurImmeuble ? parseInt(form.valeurImmeuble) : null,
        caIard: null, caVie: null, caCreditImmo: null, caCreditTempo: null, caPlacement: null, caBanque: null,
        adressesComplementaires: form.adressesComplementaires.filter(a => a.trim() !== ""),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) setError(data.error || "Une erreur est survenue");
    else router.push("/dashboard/vendeur?deposee=1");
  }

  const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, boxSizing: "border-box", outline: "none", background: "#FAFAFA", color: "#141414", transition: "border-color 0.2s" };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 };
  const sectionStyle = { background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "20px", marginBottom: 12 };

  const sectionHeader = (icon, title, subtitle) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F9FAFB", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5A1F", flexShrink: 0 }}>{icon}</div>
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#141414", margin: 0 }}>{title}</h2>
        <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>{subtitle}</p>
      </div>
    </div>
  );

  const BoolToggle = ({ field, label }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #F9FAFB" }}>
      <span style={{ fontSize: 13, color: "#374151" }}>{label}</span>
      <div style={{ display: "flex", gap: 6 }}>
        {[{ val: true, label: "Oui" }, { val: false, label: "Non" }].map(opt => (
          <button key={String(opt.val)} type="button" onClick={() => setBool(field, opt.val)}
            style={{ padding: "5px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${form[field] === opt.val ? "#FF5A1F" : "#E5E7EB"}`, background: form[field] === opt.val ? "rgba(255,90,31,0.1)" : "#FAFAFA", color: form[field] === opt.val ? "#C2410C" : "#6B7280", transition: "all 0.15s" }}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  const isFormValid = form.province && form.chiffreAffaires && form.nombreClients && form.nombreCollaborateurs && form.typeDeal.length > 0 && form.presenceDirigeant && form.activites.length > 0;
  const typeDealLabels = { VENTE: "Vente", FUSION: "Fusion", OUVERTURE_CAPITAL: "Ouverture du capital", COLLABORATION: "Collaboration" };
  const presenceLabels = { OUI: "Oui", OUI_PROVISOIRE: "Provisoire", NON: "Non" };

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        @media (max-width: 1024px) {
          .nouv-grid { grid-template-columns: 1fr !important; }
          .nouv-recap { display: none !important; }
          .nouv-chiffres-grid { grid-template-columns: 1fr 1fr !important; }
          .nouv-transaction-grid { grid-template-columns: 1fr 1fr !important; }
          .nouv-presence-grid { grid-template-columns: 1fr 1fr 1fr !important; }
          .nouv-submit-mobile { display: flex !important; }
          .nouv-reset-mobile { display: flex !important; }
          .nouv-header h1 { font-size: 20px !important; }
        }
      `}</style>

      <div className="nouv-header" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#141414", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Déposer un dossier</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Vos informations sont anonymisées — restez anonyme dans la description, n'indiquez pas votre nom ni celui de votre cabinet.</p>
      </div>

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", color: "#DC2626", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="nouv-grid" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "start" }}>
          <div>

            {/* Province */}
            <div style={sectionStyle}>
              {sectionHeader(
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                "Localisation", "Province principale du cabinet"
              )}
              <label style={labelStyle}>Province *</label>
              <CustomSelect
                value={form.province}
                onChange={val => setForm({ ...form, province: val })}
                options={PROVINCES}
                placeholder="Sélectionner une province"
              />

              <div style={{ marginTop: 16 }}>
                <label style={{ ...labelStyle, marginBottom: 10 }}>Bureaux supplémentaires</label>
                {form.adressesComplementaires.map((addr, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <input type="text" value={addr} onChange={e => updateAdresse(idx, e.target.value)}
                      placeholder={`Adresse bureau ${idx + 1}`}
                      style={{ ...inputStyle, flex: 1 }}
                      onFocus={e => e.target.style.borderColor = "#FF5A1F"}
                      onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                    {form.adressesComplementaires.length > 1 && (
                      <button type="button" onClick={() => removeAdresse(idx)}
                        style={{ padding: "0 12px", borderRadius: 10, border: "1.5px solid #FECACA", background: "#FEF2F2", color: "#DC2626", cursor: "pointer", fontSize: 18, flexShrink: 0 }}>×</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addAdresse}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, border: "1.5px dashed #E5E7EB", background: "transparent", color: "#6B7280", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Ajouter un bureau
                </button>
              </div>
            </div>

            {/* Activités */}
            <div style={sectionStyle}>
              {sectionHeader(
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
                "Types d'activités", "Plusieurs choix possibles"
              )}
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

            {/* Chiffres clés */}
            <div style={sectionStyle}>
              {sectionHeader(
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
                "Chiffres clés", "Données financières et opérationnelles"
              )}

              <div className="nouv-chiffres-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { name: "nombreClients", label: "Nombre de clients *", placeholder: "1 200" },
                  { name: "nombreCollaborateurs", label: "Collaborateurs *", placeholder: "4" },
                ].map(f => (
                  <div key={f.name}>
                    <label style={labelStyle}>{f.label}</label>
                    <input type="number" name={f.name} value={form[f.name]} onChange={handleChange} required min="0"
                      placeholder={f.placeholder} style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#FF5A1F"}
                      onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                  </div>
                ))}
              </div>

              {/* Chiffre d'affaires annuel — champ principal */}
              <div style={{ background: "#141414", borderRadius: 12, padding: "16px 18px" }}>
                <label style={{ ...labelStyle, color: "#9CA3AF", marginBottom: 6 }}>Chiffre d'affaires annuel *</label>
                <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 10px", lineHeight: 1.5 }}>
                  Chiffre d'affaires annuel du cabinet. C'est sur cette base que la commission d'accompagnement sera calculée.
                </p>
                <div style={{ position: "relative" }}>
                  <input type="number" name="chiffreAffaires" value={form.chiffreAffaires} onChange={handleChange} required min="0"
                    placeholder="850 000"
                    style={{ ...inputStyle, background: "#1F2937", border: "1.5px solid #374151", color: "#fff", paddingRight: 36, fontSize: 15, fontWeight: 600 }}
                    onFocus={e => e.target.style.borderColor = "#FF5A1F"}
                    onBlur={e => e.target.style.borderColor = "#374151"} />
                  <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 700, color: "#FF5A1F" }}>€</span>
                </div>
              </div>
            </div>

            {/* Transaction */}
            <div style={sectionStyle}>
              {sectionHeader(
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
                "Type de transaction", "Plusieurs choix possibles — cochez tout ce qui s'applique"
              )}
              <div className="nouv-transaction-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[
                  { value: "VENTE", label: "Vente", desc: "Cession totale du cabinet" },
                  { value: "FUSION", label: "Fusion", desc: "Fusion avec un autre cabinet" },
                  { value: "OUVERTURE_CAPITAL", label: "Ouverture du capital", desc: "Entrée d'un associé financier" },
                  { value: "COLLABORATION", label: "Collaboration", desc: "Partenariat ou sous-traitance" },
                ].map(opt => {
                  const selected = form.typeDeal.includes(opt.value);
                  return (
                    <button key={opt.value} type="button" onClick={() => toggleTypeDeal(opt.value)}
                      style={{ padding: "12px 14px", borderRadius: 10, cursor: "pointer", textAlign: "left", border: `1.5px solid ${selected ? "#FF5A1F" : "#E5E7EB"}`, background: selected ? "rgba(255,90,31,0.08)" : "#FAFAFA", transition: "all 0.15s", display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${selected ? "#FF5A1F" : "#D1D5DB"}`, background: selected ? "#FF5A1F" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        {selected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: selected ? "#C2410C" : "#141414", marginBottom: 2 }}>{opt.label}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.4 }}>{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <label style={labelStyle}>Présence du dirigeant après la cession *</label>
              <div className="nouv-presence-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { value: "OUI", label: "Oui", desc: "Reste après cession" },
                  { value: "OUI_PROVISOIRE", label: "Provisoire", desc: "Période de transition" },
                  { value: "NON", label: "Non", desc: "Départ immédiat" },
                ].map(opt => (
                  <button key={opt.value} type="button" onClick={() => setForm({ ...form, presenceDirigeant: opt.value })}
                    style={{ padding: "12px 12px", borderRadius: 10, cursor: "pointer", textAlign: "left", border: `1.5px solid ${form.presenceDirigeant === opt.value ? "#FF5A1F" : "#E5E7EB"}`, background: form.presenceDirigeant === opt.value ? "rgba(255,90,31,0.08)" : "#FAFAFA", transition: "all 0.15s" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: form.presenceDirigeant === opt.value ? "#C2410C" : "#141414", marginBottom: 2 }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Caractéristiques */}
            <div style={sectionStyle}>
              {sectionHeader(
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
                "Caractéristiques", "Informations complémentaires sur le cabinet"
              )}
              <BoolToggle field="venteImmeuble" label="Vente de l'immeuble (cabinet) incluse ?" />
              {form.venteImmeuble === true && (
                <div style={{ padding: "10px 0", borderBottom: "1px solid #F9FAFB" }}>
                  <label style={{ ...labelStyle, marginBottom: 6 }}>Valeur estimée de l'immobilier</label>
                  <div style={{ position: "relative" }}>
                    <input type="number" name="valeurImmeuble" value={form.valeurImmeuble} onChange={handleChange} min="0"
                      placeholder="350 000"
                      style={{ ...inputStyle, paddingRight: 36 }}
                      onFocus={e => e.target.style.borderColor = "#FF5A1F"}
                      onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                    <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, fontWeight: 700, color: "#FF5A1F" }}>€</span>
                  </div>
                </div>
              )}
              <BoolToggle field="dossierDigitalise" label="Dossiers clients digitalisés ?" />

              <div style={{ padding: "12px 0 0" }}>
                <label style={{ ...labelStyle, marginBottom: 6 }}>Logiciels utilisés par la fiduciaire</label>
                <input type="text" name="logiciels" value={form.logiciels} onChange={handleChange}
                  placeholder="Ex : Winbooks, Horus, Yuki, Silverfin..." style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#FF5A1F"}
                  onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
              </div>
            </div>

            {/* Description */}
            <div style={sectionStyle}>
              {sectionHeader(
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
                "Description", "Optionnel — contexte, particularités"
              )}
              <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 8, padding: "10px 14px", marginBottom: 12, display: "flex", gap: 8, alignItems: "flex-start" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <p style={{ fontSize: 12, color: "#C2410C", margin: 0, lineHeight: 1.6 }}>
                  Restez anonyme — ne mentionnez pas votre nom, celui de votre cabinet, ni aucune information permettant de vous identifier.
                </p>
              </div>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                placeholder="Contexte de la cession, particularités du cabinet, points forts... (sans informations identifiables)"
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                onFocus={e => e.target.style.borderColor = "#FF5A1F"}
                onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
            </div>

            {/* Boutons mobile */}
            <button type="submit" disabled={loading || !isFormValid} className="nouv-submit-mobile"
              style={{ display: "none", width: "100%", padding: "14px", borderRadius: 10, background: !isFormValid || loading ? "#E5E7EB" : "#141414", color: !isFormValid || loading ? "#9CA3AF" : "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: !isFormValid || loading ? "not-allowed" : "pointer", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}>
              {loading ? "Envoi..." : "Publier le dossier →"}
            </button>
            <button type="button" onClick={handleReset} className="nouv-reset-mobile"
              style={{ display: "none", width: "100%", padding: "12px", borderRadius: 10, background: "transparent", color: "#9CA3AF", fontWeight: 600, fontSize: 13, border: "1.5px solid #E5E7EB", cursor: "pointer", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 12 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
              Effacer tout
            </button>
          </div>

          {/* Colonne droite sticky */}
          <div className="nouv-recap" style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "20px" }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#141414", margin: "0 0 16px" }}>Récapitulatif</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { label: "Province", value: form.province || "—" },
                  { label: "Chiffre d'affaires", value: form.chiffreAffaires ? `${parseInt(form.chiffreAffaires).toLocaleString("fr-BE")} €` : "—" },
                  { label: "Clients", value: form.nombreClients || "—" },
                  { label: "Collaborateurs", value: form.nombreCollaborateurs || "—" },
                  { label: "Transaction", value: form.typeDeal.length > 0 ? form.typeDeal.map(t => typeDealLabels[t]).join(", ") : "—" },
                  { label: "Dirigeant", value: presenceLabels[form.presenceDirigeant] || "—" },
                  ...(form.venteImmeuble === true && form.valeurImmeuble ? [{ label: "Immobilier", value: `${parseInt(form.valeurImmeuble).toLocaleString("fr-BE")} €` }] : []),
                  { label: "Digitalisé", value: form.dossierDigitalise === true ? "Oui" : form.dossierDigitalise === false ? "Non" : "—" },
                  { label: "Logiciels", value: form.logiciels || "—" },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "6px 0", borderBottom: "1px solid #F9FAFB" }}>
                    <span style={{ fontSize: 12, color: "#9CA3AF" }}>{item.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: item.value === "—" ? "#D1D5DB" : "#141414", textAlign: "right", maxWidth: 140 }}>{item.value}</span>
                  </div>
                ))}
                {form.activites.length > 0 && (
                  <div style={{ paddingTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {form.activites.map(a => (
                      <span key={a} style={{ padding: "3px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: "rgba(255,90,31,0.1)", color: "#C2410C" }}>{a}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ background: "#F9FAFB", borderRadius: 14, border: "1px solid #F3F4F6", padding: "14px" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{ color: "#FF5A1F", flexShrink: 0, marginTop: 1 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                </div>
                <p style={{ fontSize: 12, color: "#6B7280", margin: 0, lineHeight: 1.6 }}>
                  Vos coordonnées ne seront jamais visibles publiquement avant déblocage payant.
                </p>
              </div>
            </div>

            <button type="submit" disabled={loading || !isFormValid}
              style={{ width: "100%", padding: "13px", borderRadius: 10, background: !isFormValid || loading ? "#E5E7EB" : "#141414", color: !isFormValid || loading ? "#9CA3AF" : "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: !isFormValid || loading ? "not-allowed" : "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: isFormValid && !loading ? "0 4px 20px rgba(20,20,20,0.2)" : "none" }}>
              {loading ? "Envoi..." : <>Publier le dossier <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
            </button>

            <button type="button" onClick={handleReset}
              style={{ width: "100%", padding: "11px", borderRadius: 10, background: "transparent", color: "#9CA3AF", fontWeight: 600, fontSize: 13, border: "1.5px solid #E5E7EB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#FECACA"; e.currentTarget.style.color = "#DC2626"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#9CA3AF"; }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 01-2 2L8 22a2 2 0 01-2-2L5 6"/></svg>
              Effacer tout
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}