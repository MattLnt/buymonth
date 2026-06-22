"use client";
import { useState } from "react";

const RULES = [
  { key: "len", label: "10 caractères min.", test: (v) => v.length >= 10 },
  { key: "upper", label: "Une majuscule", test: (v) => /[A-Z]/.test(v) },
  { key: "lower", label: "Une minuscule", test: (v) => /[a-z]/.test(v) },
  { key: "digit", label: "Un chiffre", test: (v) => /\d/.test(v) },
  { key: "symbol", label: "Un symbole (!@#…)", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export function validatePassword(value) {
  return RULES.every((r) => r.test(value));
}

export function PasswordField({ label = "Mot de passe", value, onChange, name = "password", showChecklist = true }) {
  const [show, setShow] = useState(false);

  return (
    <div style={{ marginBottom: 16 }}>
      <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#193B5E", marginBottom: 6 }}>
        {label}<span style={{ color: "#E5484D" }}> *</span>
      </span>

      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {/* Cadenas */}
        <span style={{ position: "absolute", left: 14, display: "flex", pointerEvents: "none" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9AA2B4" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </span>

        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="••••••••••"
          style={{
            width: "100%", padding: "12px 44px", fontSize: 14,
            border: "1px solid #E5E7EB", borderRadius: 10, outline: "none",
            background: "#F8FAFD", color: "#1A1E2E", boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#7CB8A8")}
          onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
        />

        {/* Œil */}
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Masquer" : "Afficher"}
          style={{ position: "absolute", right: 12, background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}
        >
          {show ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A6275" strokeWidth="2">
              <path d="M17.94 17.94A10 10 0 0112 20c-7 0-11-8-11-8a18.5 18.5 0 015.06-5.94M9.9 4.24A9 9 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A6275" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

      {/* Checklist */}
      {showChecklist && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginTop: 14 }}>
          {RULES.map((r) => {
            const ok = r.test(value || "");
            return (
              <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ display: "flex", flexShrink: 0 }}>
                  {ok ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#249E7C" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" stroke="#249E7C" strokeWidth="1.5" /><polyline points="8 12 11 15 16 9" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C5CBD6" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" /><polyline points="8 12 11 15 16 9" stroke="#C5CBD6" strokeWidth="2" />
                    </svg>
                  )}
                </span>
                <span style={{ fontSize: 13, fontWeight: ok ? 600 : 400, color: ok ? "#249E7C" : "#9AA2B4", transition: "color 0.2s" }}>
                  {r.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}