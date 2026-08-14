"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Field } from "@/app/components/ui/Field";
import { Button } from "@/app/components/ui/Button";
import {
  PasswordField,
  validatePassword,
} from "@/app/components/ui/PasswordField";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    societe: "",
    contactNom: "",
    email: "",
    telephone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) =>
    setForm({
      ...form,
      [k]: e.target.value,
    });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validatePassword(form.password)) {
      setError("Le mot de passe ne respecte pas tous les critères.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur.");
        setLoading(false);
        return;
      }

      const login = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (login?.error) {
        router.push("/login");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Erreur réseau.");
      setLoading(false);
    }
  }

  return (
    <main className="register-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .register-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          position: relative;
          overflow-x: hidden;
          background:
            linear-gradient(
              150deg,
              #16324F 0%,
              #1D4267 55%,
              #245479 100%
            );
        }

        /* Halo supérieur */
        .register-page::before {
          content: "";
          position: absolute;
          width: 620px;
          height: 620px;
          top: -300px;
          right: -180px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(124,184,168,0.20) 0%,
            rgba(124,184,168,0) 68%
          );
          pointer-events: none;
        }

        /* Halo inférieur */
        .register-page::after {
          content: "";
          position: absolute;
          width: 520px;
          height: 520px;
          bottom: -280px;
          left: -180px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(124,184,168,0.10) 0%,
            rgba(124,184,168,0) 68%
          );
          pointer-events: none;
        }

        .register-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(
              rgba(255,255,255,0.018) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.018) 1px,
              transparent 1px
            );
          background-size: 44px 44px;
        }

        .register-wrapper {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 500px;
        }

        .register-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
        }

        .register-card {
          width: 100%;
          background: #fff;
          border: 1px solid rgba(255,255,255,0.65);
          border-radius: 20px;
          padding: 38px 34px;
          box-shadow:
            0 24px 70px rgba(5, 25, 45, 0.24),
            0 4px 18px rgba(5, 25, 45, 0.08);
        }

        .register-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .register-footer {
          text-align: center;
          margin-top: 20px;
          color: rgba(255,255,255,0.45);
          font-size: 11px;
          line-height: 1.6;
        }

        @media (max-width: 600px) {
          .register-page {
            min-height: 100vh;
            padding: 24px 12px 20px;
            align-items: flex-start;
          }

          .register-wrapper {
            width: 100%;
            max-width: 440px;
            margin: 0 auto;
          }

          .register-brand {
            margin-top: 4px;
            margin-bottom: 18px;
          }

          .register-card {
            width: 100%;
            padding: 28px 18px;
            border-radius: 17px;
          }

          .register-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .register-footer {
            margin-top: 18px;
          }
        }

        @media (max-width: 380px) {
          .register-page {
            padding-left: 10px;
            padding-right: 10px;
          }

          .register-card {
            padding: 24px 16px;
          }
        }
      `}</style>

      <div className="register-grid" />

      <div className="register-wrapper">

        {/* =========================
            LOGO + BADGE
            ========================= */}
        <div className="register-brand">
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "inline-block",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.025em",
              }}
            >
              Buy<span style={{ color: "#7CB8A8" }}>Month</span>
            </span>
          </Link>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(124,184,168,0.15)",
              border: "1px solid rgba(124,184,168,0.30)",
              borderRadius: 20,
              padding: "5px 12px",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#7CB8A8",
              }}
            />

            <span
              style={{
                fontSize: 11,
                color: "#7CB8A8",
                fontWeight: 600,
              }}
            >
              Espace promoteur
            </span>
          </div>
        </div>

        {/* =========================
            CARTE INSCRIPTION
            ========================= */}
        <div className="register-card">

          {/* Header */}
          <div style={{ marginBottom: 26 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(124,184,168,0.12)",
                border: "1px solid rgba(124,184,168,0.25)",
                borderRadius: 20,
                padding: "5px 12px",
                marginBottom: 14,
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7CB8A8"
                strokeWidth="2.5"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>

              <span
                style={{
                  fontSize: 11,
                  color: "#5FA894",
                  fontWeight: 700,
                }}
              >
                Inscription sécurisée
              </span>
            </div>

            <h1
              style={{
                fontSize: 25,
                fontWeight: 700,
                color: "#193B5E",
                margin: "0 0 5px",
                letterSpacing: "-0.02em",
              }}
            >
              Créer un compte
            </h1>

            <p
              style={{
                fontSize: 13.5,
                color: "#8A92A6",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Rejoignez l'espace promoteur BuyMonth
            </p>
          </div>

          {/* Erreur */}
          {error && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#E5484D",
                fontSize: 13,
                borderRadius: 11,
                padding: "11px 14px",
                marginBottom: 18,
                lineHeight: 1.45,
              }}
            >
              {error}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>

            <Field
              label="Société"
              value={form.societe}
              onChange={set("societe")}
              placeholder="Nom de votre société"
              required
            />

            <div className="register-row">
              <Field
                label="Nom du contact"
                value={form.contactNom}
                onChange={set("contactNom")}
                placeholder="Votre nom"
              />

              <Field
                label="Téléphone"
                value={form.telephone}
                onChange={set("telephone")}
                placeholder="+32 ..."
              />
            </div>

            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="vous@societe.be"
              required
            />

            <PasswordField
              value={form.password}
              onChange={set("password")}
            />

            <Button
              type="submit"
              variant="primary"
              full
              disabled={loading}
            >
              {loading ? "Création..." : "Créer mon compte"}
            </Button>
          </form>

          {/* Séparateur */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "23px 0 18px",
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background: "#EEF1F4",
              }}
            />

            <span
              style={{
                fontSize: 11.5,
                color: "#C2C8D4",
                whiteSpace: "nowrap",
              }}
            >
              Déjà inscrit ?
            </span>

            <div
              style={{
                flex: 1,
                height: 1,
                background: "#EEF1F4",
              }}
            />
          </div>

          {/* Connexion */}
          <Link
            href="/login"
            style={{
              display: "block",
              textAlign: "center",
              background: "#FAFBFE",
              border: "1px solid #E8EDF2",
              color: "#193B5E",
              padding: 12,
              borderRadius: 10,
              fontSize: 13.5,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Se connecter
          </Link>
        </div>

        {/* =========================
            FOOTER
            ========================= */}
        <p className="register-footer">
          © 2026 BuyMonth · Belgique
        </p>
      </div>
    </main>
  );
}