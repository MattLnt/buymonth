"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "../components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res.error) {
      setError("Email ou mot de passe incorrect");
    } else {
      await new Promise(resolve => setTimeout(resolve, 500));
      const session = await fetch("/api/auth/session").then(r => r.json());
      const role = session?.user?.role;
      if (role === "VENDEUR") router.push("/dashboard/vendeur");
      else if (role === "ACHETEUR") router.push("/dashboard/acheteur");
      else if (role === "ADMIN") router.push("/dashboard/admin");
      else router.push("/");
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", background: "#F6F8F6" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .login-left { display: none !important; }
          .login-right { padding: 0 !important; background: #141414 !important; align-items: flex-start !important; }
          .login-form-card { border-radius: 24px 24px 0 0 !important; min-height: calc(100vh - 220px) !important; }
          .login-mobile-hero { display: block !important; }
        }
        @media (min-width: 1025px) {
          .login-mobile-hero { display: none !important; }
          .login-form-card { border-radius: 0 !important; box-shadow: none !important; }
        }
      `}</style>

      {/* Panneau gauche desktop */}
      <div className="login-left" style={{
        width: "52%", background: "linear-gradient(160deg, #141414 0%, #1F1F22 50%, #141414 100%)",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "48px", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(255,90,31,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-120px", left: "-60px", width: "500px", height: "500px", borderRadius: "50%", background: "rgba(255,90,31,0.05)", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-block" }}>
            <Logo dark height={28} />
          </Link>
        </div>

        {/* Contenu central */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,90,31,0.15)", border: "1px solid rgba(255,90,31,0.3)", borderRadius: "20px", padding: "6px 14px", marginBottom: "28px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FF5A1F" }} />
            <span style={{ fontSize: "12px", color: "#FF5A1F", fontWeight: 600 }}>Plateforme privée off-market</span>
          </div>
          <h2 style={{ fontSize: "38px", fontWeight: 700, color: "white", lineHeight: 1.15, margin: "0 0 20px", letterSpacing: "-0.02em" }}>
            Bon retour<br />sur la plateforme<br /><span style={{ color: "#FF5A1F" }}>de cession belge.</span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 40px", maxWidth: "340px" }}>
            Connectez-vous pour accéder à votre espace et gérer vos opportunités.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {["Anonymat total pour les vendeurs", "Opportunités filtrées par province et chiffre d'affaires annuel", "Déblocage sécurisé avec CGV intégrées", "Alertes en temps réel"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "rgba(255,90,31,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bas — choix inscription */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "16px 20px" }}>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 10px", lineHeight: 1.5 }}>
              Pas encore de compte ? Choisissez votre profil :
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <Link href="/register/acheteur" style={{ flex: 1, textAlign: "center", background: "#FF5A1F", color: "#141414", padding: "10px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                Acheteur — 59€/mois
              </Link>
              <Link href="/register/vendeur" style={{ flex: 1, textAlign: "center", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", padding: "10px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                Vendeur — gratuit
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Panneau droit */}
      <div className="login-right" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", background: "white", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: "480px" }}>

          {/* Hero mobile */}
          <div className="login-mobile-hero" style={{ padding: "48px 28px 36px", position: "relative", display: "none" }}>
            <div style={{ position: "absolute", top: 0, right: -28, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,90,31,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
            <Link href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: 24 }}>
              <Logo dark height={24} />
            </Link>
            <h1 style={{ fontSize: "30px", fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
              Bon retour<br /><span style={{ color: "#FF5A1F" }}>sur la plateforme.</span>
            </h1>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: "0 0 24px", lineHeight: 1.6 }}>
              Accédez à votre espace privé de cession comptable belge.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <Link href="/register/acheteur" style={{ flex: 1, textAlign: "center", background: "#FF5A1F", color: "#141414", padding: "10px 12px", borderRadius: 10, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                Acheteur
              </Link>
              <Link href="/register/vendeur" style={{ flex: 1, textAlign: "center", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", padding: "10px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                Vendeur
              </Link>
            </div>
          </div>

          {/* Card formulaire */}
          <div className="login-form-card" style={{ background: "#fff", padding: "32px 28px", borderRadius: 0, boxShadow: "none" }}>
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,90,31,0.1)", border: "1px solid rgba(255,90,31,0.25)", borderRadius: "20px", padding: "5px 12px", marginBottom: "14px" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span style={{ fontSize: "11px", color: "#FF5A1F", fontWeight: 700 }}>Accès sécurisé</span>
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#141414", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Connexion</h2>
              <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>Accédez à votre espace privé</p>
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#ef4444", fontSize: "13px", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Email</label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="vous@exemple.com"
                    style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: "12px", padding: "12px 14px 12px 42px", fontSize: "14px", color: "#141414", outline: "none", boxSizing: "border-box", background: "#fafafa", transition: "border-color 0.2s" }}
                    onFocus={e => e.target.style.borderColor = "#FF5A1F"}
                    onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Mot de passe</label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  </div>
                  <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Votre mot de passe"
                    style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: "12px", padding: "12px 44px 12px 42px", fontSize: "14px", color: "#141414", outline: "none", boxSizing: "border-box", background: "#fafafa", transition: "border-color 0.2s" }}
                    onFocus={e => e.target.style.borderColor = "#FF5A1F"}
                    onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, color: "#9ca3af" }}>
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
                <p style={{ fontSize: "13px", textAlign: "right", margin: "8px 0 0" }}>
                  <Link href="/mot-de-passe-oublie" style={{ color: "#9ca3af", textDecoration: "none", fontWeight: 600 }}>Mot de passe oublié ?</Link>
                </p>
              </div>

              <button type="submit" disabled={loading}
                style={{ width: "100%", background: loading ? "#e5e7eb" : "#141414", color: loading ? "#9ca3af" : "white", fontWeight: 700, padding: "14px", borderRadius: "12px", border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: "15px", boxShadow: loading ? "none" : "0 4px 20px rgba(20,20,20,0.25)", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                {loading ? (
                  <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Connexion...</>
                ) : (
                  <>Se connecter <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                )}
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0 20px" }}>
              <div style={{ flex: 1, height: "1px", background: "#f0f0f0" }} />
              <span style={{ fontSize: "12px", color: "#d1d5db" }}>Pas encore de compte ?</span>
              <div style={{ flex: 1, height: "1px", background: "#f0f0f0" }} />
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <Link href="/register/acheteur" style={{ flex: 1, textAlign: "center", background: "#FF5A1F", color: "#141414", padding: "12px", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                Compte acheteur
              </Link>
              <Link href="/register/vendeur" style={{ flex: 1, textAlign: "center", background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#374151", padding: "12px", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                Compte vendeur
              </Link>
            </div>

            <p style={{ fontSize: "11px", color: "#d1d5db", margin: 0, textAlign: "center" }}>© 2026 Fiderio · Belgique</p>
          </div>
        </div>
      </div>
    </main>
  );
}