import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfilAcheteurForm from "./ProfilAcheteurForm";

export default async function ProfilAcheteurPage() {
  const session = await getServerSession(authOptions);

  const acheteur = await prisma.acheteur.findUnique({
    where: { userId: session.user.id },
    select: {
      nomBureau: true, nomCEO: true, telephone: true, adresse: true,
      siteInternet: true, chiffreAffaires: true, nombreClients: true,
      nombreCollaborateurs: true, activites: true,
    },
  });

  return (
    <div style={{ maxWidth: "100%" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#141414", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Mon profil</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Ces informations donnent envie aux vendeurs de vous rejoindre — complétez-les !</p>
      </div>

      <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "12px 16px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <p style={{ fontSize: 13, color: "#C2410C", margin: 0 }}>
          Un profil complet inspire confiance aux vendeurs et augmente vos chances d'être mis en relation.
        </p>
      </div>

      <ProfilAcheteurForm initialData={acheteur} email={session?.user?.email} />
    </div>
  );
}