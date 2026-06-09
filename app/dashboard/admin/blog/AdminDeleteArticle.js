"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminDeleteArticle({ id }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    setLoading(false);
    setConfirm(false);
    router.refresh();
  }

  if (confirm) return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 600 }}>Supprimer ?</span>
      <button onClick={handleDelete} disabled={loading}
        style={{ padding: "5px 8px", borderRadius: 7, background: "#EF4444", color: "#fff", fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer" }}>
        {loading ? "..." : "Oui"}
      </button>
      <button onClick={() => setConfirm(false)}
        style={{ padding: "5px 8px", borderRadius: 7, background: "#F3F4F6", color: "#6B7280", fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer" }}>
        Non
      </button>
    </div>
  );

  return (
    <button onClick={() => setConfirm(true)}
      style={{ display: "inline-flex", alignItems: "center", padding: "5px 8px", borderRadius: 7, background: "#FEF2F2", border: "1px solid #FECACA", color: "#EF4444", fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer" }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
    </button>
  );
}