"use client";

export function Field({ label, type = "text", value, onChange, placeholder, required, name }) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#193B5E", marginBottom: 6 }}>
        {label}{required && <span style={{ color: "#E5484D" }}> *</span>}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          width: "100%", padding: "12px 14px", fontSize: 14,
          border: "1px solid #E5E7EB", borderRadius: 10, outline: "none",
          background: "#fff", color: "#1A1E2E", boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#7CB8A8")}
        onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
      />
    </label>
  );
}