import MotDePasseForm from "@/app/components/MotDePasseForm";

export default function MotDePassePage() {
  return (
    <div style={{ maxWidth: "100%" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#141414", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Sécurité du compte</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Modifiez votre mot de passe de connexion</p>
      </div>
      <MotDePasseForm />
    </div>
  );
}