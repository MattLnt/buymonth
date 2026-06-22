"use client";

export function Button({ children, onClick, type = "button", variant = "primary", disabled, full }) {
  const styles = {
    primary: { background: "#193B5E", color: "#fff" },
    teal: { background: "#7CB8A8", color: "#193B5E" },
    ghost: { background: "#fff", color: "#193B5E", border: "1px solid #E5E7EB" },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        width: full ? "100%" : "auto",
        padding: "13px 24px", fontSize: 14, fontWeight: 600,
        border: styles[variant].border || "none", borderRadius: 10,
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1,
        transition: "opacity 0.2s",
      }}
    >
      {children}
    </button>
  );
}