"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OpportuniteActions({ opportunite }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleToggle() {
    setLoading(true);
    const newStatus = opportunite.status === "ACTIVE" ? "HIDDEN" : "ACTIVE";
    await fetch(`/api/vendeur/opportunites/${opportunite.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(false);
    router.refresh();
  }

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/vendeur/opportunites/${opportunite.id}`, { method: "DELETE" });
    setLoading(false);
    setShowConfirm(false);
    router.refresh();
  }

  if (showConfirm) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 12, color: "#DC2626", fontWeight: 600, whiteSpace: "nowrap" }}>Confirmer ?</span>
        <button onClick={handleDelete} disabled={loading}
          style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, border: "none", background: "#DC2626", color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}>
          Oui
        </button>
        <button onClick={() => setShowConfirm(false)}
          style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "1px solid #E5E7EB", background: "#fff", color: "#6B7280", cursor: "pointer", whiteSpace: "nowrap" }}>
          Non
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <Link href={`/dashboard/vendeur/opportunites/${opportunite.id}/edit`}
        style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "1px solid #E5E7EB", background: "#F9FAFB", color: "#374151", textDecoration: "none", whiteSpace: "nowrap" }}>
        Modifier
      </Link>
      <button onClick={handleToggle} disabled={loading}
        style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "1px solid", cursor: loading ? "not-allowed" : "pointer", background: opportunite.status === "ACTIVE" ? "#FFFBEB" : "#F0FDF4", color: opportunite.status === "ACTIVE" ? "#D97706" : "#10B981", borderColor: opportunite.status === "ACTIVE" ? "#FDE68A" : "#BBF7D0", opacity: loading ? 0.6 : 1, whiteSpace: "nowrap" }}>
        {opportunite.status === "ACTIVE" ? "Masquer" : "Republier"}
      </button>
      <button onClick={() => setShowConfirm(true)}
        style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "1px solid #FECACA", background: "#FEF2F2", color: "#DC2626", cursor: "pointer", whiteSpace: "nowrap" }}>
        Supprimer
      </button>
    </div>
  );
}