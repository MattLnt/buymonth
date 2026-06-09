import SupprimerCompteForm from "@/app/components/SupprimerCompteForm";

export default function SupprimerVendeurPage() {
  return (
    <div style={{ maxWidth: "100%" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#141414", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Supprimer le compte</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Supprimez définitivement votre compte et toutes vos données</p>
      </div>
      <SupprimerCompteForm />
    </div>
  );
}