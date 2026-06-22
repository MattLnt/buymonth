"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      await new Promise((resolve) => setTimeout(resolve, 500));
      const session = await fetch("/api/auth/session").then((r) => r.json());
      const role = session?.user?.role;
      if (role === "ADMIN") router.push("/dashboard/admin");
      else router.push("/dashboard/client");
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", background: "#EEF1F6" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .login-left { display: none !important; }
          .login-right { padding: 0 !important; align-items: flex-start !important; }
          .login-form-card { min-height: 100vh !important; }
        }
      `}</style>

      {/* Panneau gauche desktop */}
      <div className="login-left" style={{
        width: "52%", background: "linear-gradient(160deg, #16324F 0%, #1D4267 55%, #245479 100%)",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "48px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: 400, height: 400, borderRadius: "50%", background: "rgba(124,184,168,0.12)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-120px", left: "-60px", width: 500, height: 500, borderRadius: "50%", background: "rgba(124,184,168,0.07)", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-block" }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Buy<span style={{ color: "#7CB8A8" }}>Month</span></span>
          </Link>
        </div>

        {/* Contenu central */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,184,168,0.15)", border: "1px solid rgba(124,184,168,0.3)", borderRadius: 20, padding: "6px 14px", marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7CB8A8" }} />
            <span style={{ fontSize: 12, color: "#7CB8A8", fontWeight: 600 }}>Espace promoteur</span>
          </div>
          <h2 style={{ fontSize: 38, fontWeight: 700, color: "white", lineHeight: 1.15, margin: "0 0 20px", letterSpacing: "-0.02em" }}>
            Vos biens affichés<br />en <span style={{ color: "#7CB8A8" }}>mensualités.</span>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 40px", maxWidth: 360 }}>
            Connectez-vous pour gérer vos biens, vos widgets et suivre vos leads.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {["Affichez vos biens en budget mensuel clair", "Générez des widgets pour votre site", "Recevez des leads qualifiés en temps réel", "Conforme — crédit agréé FSMA"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(124,184,168,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bas — inscription */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px 20px" }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "0 0 10px" }}>Pas encore de compte ?</p>
            <Link href="/register" style={{ display: "inline-block", background: "#7CB8A8", color: "#0F2A22", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              Créer un compte promoteur
            </Link>
          </div>
        </div>
      </div>

      {/* Panneau droit */}
      <div className="login-right" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", background: "#EEF1F6", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div className="login-form-card" style={{ background: "#fff", padding: "40px 32px", borderRadius: 18, boxShadow: "0 4px 24px rgba(22,50,79,0.06)", border: "1px solid #EEF2F7" }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(124,184,168,0.12)", border: "1px solid rgba(124,184,168,0.25)", borderRadius: 20, padding: "5px 12px", marginBottom: 14 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                <span style={{ fontSize: 11, color: "#5FA894", fontWeight: 700 }}>Accès sécurisé</span>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "#193B5E", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Connexion</h2>
              <p style={{ fontSize: 13.5, color: "#8A92A6", margin: 0 }}>Accédez à votre espace promoteur</p>
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#ef4444", fontSize: 13, borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Email</label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  </div>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="vous@exemple.com"
                    style={{ width: "100%", border: "1.5px solid #E8EDF2", borderRadius: 12, padding: "12px 14px 12px 42px", fontSize: 14, color: "#193B5E", outline: "none", boxSizing: "border-box", background: "#FAFDFD" }}
                    onFocus={(e) => (e.target.style.borderColor = "#7CB8A8")}
                    onBlur={(e) => (e.target.style.borderColor = "#E8EDF2")} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Mot de passe</label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                  </div>
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Votre mot de passe"
                    style={{ width: "100%", border: "1.5px solid #E8EDF2", borderRadius: 12, padding: "12px 44px 12px 42px", fontSize: 14, color: "#193B5E", outline: "none", boxSizing: "border-box", background: "#FAFDFD" }}
                    onFocus={(e) => (e.target.style.borderColor = "#7CB8A8")}
                    onBlur={(e) => (e.target.style.borderColor = "#E8EDF2")} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, color: "#9ca3af" }}>
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
                <p style={{ fontSize: 13, textAlign: "right", margin: "8px 0 0" }}>
                  <Link href="/mot-de-passe-oublie" style={{ color: "#9ca3af", textDecoration: "none", fontWeight: 600 }}>Mot de passe oublié ?</Link>
                </p>
              </div>

              <button type="submit" disabled={loading}
                style={{ width: "100%", background: loading ? "#E8EDF2" : "#193B5E", color: loading ? "#9ca3af" : "white", fontWeight: 700, padding: 14, borderRadius: 12, border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: 15, transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading ? (
                  <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>Connexion...</>
                ) : (
                  <>Se connecter <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>
                )}
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0 20px" }}>
              <div style={{ flex: 1, height: 1, background: "#f0f0f0" }} />
              <span style={{ fontSize: 12, color: "#C2C8D4" }}>Pas encore de compte ?</span>
              <div style={{ flex: 1, height: 1, background: "#f0f0f0" }} />
            </div>

            <Link href="/register" style={{ display: "block", textAlign: "center", background: "#FAFBFE", border: "1px solid #E8EDF2", color: "#193B5E", padding: 12, borderRadius: 10, fontSize: 13.5, fontWeight: 600, textDecoration: "none" }}>
              Créer un compte promoteur
            </Link>

            <p style={{ fontSize: 11, color: "#C2C8D4", margin: "20px 0 0", textAlign: "center" }}>© 2026 BuyMonth · Belgique</p>
          </div>
        </div>
      </div>
    </main>
  );
}