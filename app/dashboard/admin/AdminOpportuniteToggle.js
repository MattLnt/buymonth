"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminOpportuniteToggle({ id, currentStatus }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle(status) {
    setLoading(true);
    await fetch(`/api/admin/opportunites/${id}/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div style={{ display: "flex", gap: 6 }}>
      {currentStatus === "PENDING" && (
        <button
          onClick={() => handleToggle("ACTIVE")}
          disabled={loading}
          style={{ padding: "5px 12px", borderRadius: 6, background: "#F0FDF4", color: "#16A34A", fontSize: 11, fontWeight: 600, border: "1px solid #BBF7D0", cursor: "pointer", opacity: loading ? 0.6 : 1 }}
        >
          Valider
        </button>
      )}
      {currentStatus === "ACTIVE" && (
        <button
          onClick={() => handleToggle("HIDDEN")}
          disabled={loading}
          style={{ padding: "5px 12px", borderRadius: 6, background: "#FEF2F2", color: "#EF4444", fontSize: 11, fontWeight: 600, border: "1px solid #FECACA", cursor: "pointer", opacity: loading ? 0.6 : 1 }}
        >
          Masquer
        </button>
      )}
      {currentStatus === "HIDDEN" && (
        <button
          onClick={() => handleToggle("ACTIVE")}
          disabled={loading}
          style={{ padding: "5px 12px", borderRadius: 6, background: "#F0FDF4", color: "#16A34A", fontSize: 11, fontWeight: 600, border: "1px solid #BBF7D0", cursor: "pointer", opacity: loading ? 0.6 : 1 }}
        >
          Republier
        </button>
      )}
      {currentStatus === "PENDING" && (
        <button
          onClick={() => handleToggle("HIDDEN")}
          disabled={loading}
          style={{ padding: "5px 12px", borderRadius: 6, background: "#FEF2F2", color: "#EF4444", fontSize: 11, fontWeight: 600, border: "1px solid #FECACA", cursor: "pointer", opacity: loading ? 0.6 : 1 }}
        >
          Rejeter
        </button>
      )}
    </div>
  );
}