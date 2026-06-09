import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AlertesForm from "./AlertesForm";

export default async function AlertesPage() {
  const session = await getServerSession(authOptions);

  const acheteur = await prisma.acheteur.findUnique({
    where: { userId: session.user.id },
    select: {
      alertesEmail: true,
      alerteProvinces: true,
      alerteTypeDeals: true,
      alerteCaMin: true,
      alerteCaMax: true,
      subStatus: true,
    },
  });

  return (
    <div style={{ maxWidth: "100%" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#141414", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Mes alertes</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Recevez un email dès qu'un nouveau dossier correspond à vos critères.</p>
      </div>

      {acheteur?.subStatus !== "active" && (
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <p style={{ fontSize: 13, color: "#C2410C", margin: 0 }}>
            Les alertes sont disponibles uniquement avec un abonnement actif. <a href="/dashboard/acheteur/forfait" style={{ color: "#FF5A1F", fontWeight: 600, textDecoration: "none" }}>S'abonner →</a>
          </p>
        </div>
      )}

      <AlertesForm initialData={acheteur} />
    </div>
  );
}