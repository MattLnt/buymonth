"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

function CustomSelect({ value, placeholder, options, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <div style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, border: `1.5px solid ${open ? "#FF5A1F" : value ? "#FF5A1F" : "#E5E7EB"}`, background: value ? "rgba(255,90,31,0.06)" : "#FAFAFA", fontSize: 13, color: selected ? "#141414" : "#9CA3AF", cursor: "pointer", minWidth: 160, justifyContent: "space-between", outline: "none", transition: "border-color 0.2s" }}>
        <span style={{ fontWeight: selected ? 600 : 400 }}>{selected ? selected.label : placeholder}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} />
          <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 20, background: "#fff", borderRadius: 12, border: "1px solid #F3F4F6", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", minWidth: "100%", overflow: "hidden" }}>
            <button type="button" onClick={() => { onChange(""); setOpen(false); }}
              style={{ display: "block", width: "100%", padding: "9px 14px", textAlign: "left", fontSize: 13, color: !value ? "#141414" : "#6B7280", fontWeight: !value ? 600 : 400, background: !value ? "#F9FAFB" : "transparent", border: "none", cursor: "pointer", borderBottom: "1px solid #F9FAFB" }}>
              {placeholder}
            </button>
            {options.map(o => (
              <button key={o.value} type="button" onClick={() => { onChange(o.value); setOpen(false); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "9px 14px", textAlign: "left", fontSize: 13, color: value === o.value ? "#141414" : "#6B7280", fontWeight: value === o.value ? 600 : 400, background: value === o.value ? "#F9FAFB" : "transparent", border: "none", cursor: "pointer" }}>
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

export default function AdminFilters({ basePath, filters, values, hasFilters }) {
  const router = useRouter();
  const [form, setForm] = useState(values);

  function applyFilters(newForm) {
    const p = new URLSearchParams();
    Object.entries(newForm).forEach(([k, v]) => { if (v) p.set(k, v); });
    const qs = p.toString();
    router.push(`${basePath}${qs ? `?${qs}` : ""}`);
  }

  function handleChange(name, value) {
    const newForm = { ...form, [name]: value };
    setForm(newForm);
    applyFilters(newForm);
  }

  function handleTextSubmit(e) {
    e.preventDefault();
    applyFilters(form);
  }

  return (
    <form onSubmit={handleTextSubmit} style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "14px 20px", marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
      {filters.map(f => (
        f.type === "text" ? (
          <div key={f.name} style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>
            <input
              type="text" name={f.name} value={form[f.name] || ""} placeholder={f.placeholder}
              onChange={e => setForm({ ...form, [f.name]: e.target.value })}
              style={{ padding: "8px 14px 8px 34px", borderRadius: 10, border: `1.5px solid ${form[f.name] ? "#FF5A1F" : "#E5E7EB"}`, fontSize: 13, color: "#141414", background: "#FAFAFA", outline: "none", transition: "border-color 0.2s", minWidth: 200 }}
              onFocus={e => e.target.style.borderColor = "#FF5A1F"}
              onBlur={e => e.target.style.borderColor = form[f.name] ? "#FF5A1F" : "#E5E7EB"}
            />
          </div>
        ) : (
          <CustomSelect
            key={f.name}
            value={form[f.name] || ""}
            placeholder={f.placeholder}
            options={f.options}
            onChange={v => handleChange(f.name, v)}
          />
        )
      ))}

      {/* Bouton recherche pour les champs texte */}
      {filters.some(f => f.type === "text") && (
        <button type="submit" style={{ padding: "8px 18px", borderRadius: 10, background: "#141414", color: "#fff", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          Chercher
        </button>
      )}

      {hasFilters && (
        <Link href={basePath} style={{ fontSize: 12, color: "#FF5A1F", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
          onClick={() => setForm({})}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Réinitialiser
        </Link>
      )}
    </form>
  );
}