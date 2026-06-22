"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Field } from "@/app/components/ui/Field";
import { Button } from "@/app/components/ui/Button";
import { PasswordField, validatePassword } from "@/app/components/ui/PasswordField";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ societe: "", contactNom: "", email: "", telephone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);

    if (!validatePassword(form.password)) {
      setError("Le mot de passe ne respecte pas tous les critères.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erreur."); setLoading(false); return; }

      const login = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (login?.error) { router.push("/login"); return; }
      router.push("/dashboard");
    } catch {
      setError("Erreur réseau."); setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#F4F6FB" }}>
      <style>{`
        @media (max-width: 880px) {
          .reg-aside { display: none !important; }
          .reg-form-col { padding: 32px 24px !important; }
        }
      `}</style>

      {/* ===== COLONNE GAUCHE : formulaire ===== */}
      <div className="reg-form-col" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 40px" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <Link href="/" style={{ fontSize: 24, fontWeight: 700, color: "#193B5E", textDecoration: "none", letterSpacing: "-0.02em", display: "inline-block", marginBottom: 32 }}>
            Buy<span style={{ color: "#7CB8A8" }}>Month</span>
          </Link>

          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#193B5E", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Créer un compte</h1>
          <p style={{ fontSize: 14, color: "#5A6275", margin: "0 0 28px" }}>Rejoignez l'espace promoteur BuyMonth</p>

          <form onSubmit={handleSubmit}>
            <Field label="Société" value={form.societe} onChange={set("societe")} placeholder="Nom de votre société" required />
            <Field label="Nom du contact" value={form.contactNom} onChange={set("contactNom")} placeholder="Votre nom" />
            <Field label="Email" type="email" value={form.email} onChange={set("email")} placeholder="vous@societe.be" required />
            <Field label="Téléphone" value={form.telephone} onChange={set("telephone")} placeholder="+32 ..." />
            <PasswordField value={form.password} onChange={set("password")} />

            {error && <p style={{ color: "#E5484D", fontSize: 13, margin: "0 0 16px" }}>{error}</p>}

            <Button type="submit" variant="primary" full disabled={loading}>
              {loading ? "Création..." : "Créer mon compte"}
            </Button>
          </form>

          <p style={{ fontSize: 13, color: "#5A6275", textAlign: "center", marginTop: 20 }}>
            Déjà inscrit ? <Link href="/login" style={{ color: "#193B5E", fontWeight: 600 }}>Se connecter</Link>
          </p>
        </div>
      </div>

      {/* ===== COLONNE DROITE : panneau premium ===== */}
      <div className="reg-aside" style={{
        flex: 1, position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "48px 56px", color: "#fff",
        background: "linear-gradient(150deg, #16324F 0%, #1D4267 55%, #245479 100%)",
      }}>
        {/* washes */}
        <div style={{ position: "absolute", top: "-15%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,184,168,0.20) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-15%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,184,168,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        {/* grille discrète */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "44px 44px", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 440 }}>
          <span style={{ display: "inline-block", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#7CB8A8", textTransform: "uppercase", marginBottom: 18 }}>
            Espace promoteur
          </span>

          <h2 style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.15, margin: "0 0 18px" }}>
            Transformez chaque visite en <span style={{ color: "#7CB8A8" }}>opportunité</span>.
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 44px" }}>
            Affichez vos biens en budget mensuel, générez vos badges conformes FSMA et qualifiez vos leads — le tout depuis un seul espace.
          </p>

          {/* Carte mockup flottante, discrète */}
          <div style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16, padding: "22px 24px", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20,
          }}>
            <div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 500, marginBottom: 4 }}>Propriétaire de ce bien dès</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#7CB8A8", letterSpacing: "-0.02em", lineHeight: 1 }}>965 €<span style={{ fontSize: 16, color: "rgba(124,184,168,0.8)" }}> /mois</span></div>
            </div>
            <span style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(124,184,168,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2">
                <path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V9.5z" />
              </svg>
            </span>
          </div>

          {/* séparateur */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "36px 0 28px" }} />

          {/* points clés */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              "Génération de badges en quelques clics",
              "Qualification des leads instantanée",
              "Tous vos biens sur la plateforme BuyMonth",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2.5" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{t}</span>
              </div>
            ))}
          </div>

          {/* footer confiance */}
          <div style={{ marginTop: 48, fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
            JG Management — Intermédiaire en crédit agréé FSMA 1021.366.349
          </div>
        </div>
      </div>
    </div>
  );
}