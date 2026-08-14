"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import CalMark from "./CalMark";

export default function Nav() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  // Ferme à Échap + verrouille le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav>
      <div className="wrap nav-in">
        <Link className="brand" href="/pro" onClick={close}>
          <CalMark size={34} />
          BuyMonth
        </Link>

        {/* Liens desktop */}
        <div className="nav-links">
          <a href="/pro#solution">Solution</a>
          <a href="/pro#vitrine">Les biens</a>
          <a href="/pro#process">Process</a>
          <a href="/pro#tarif">Tarifs</a>
          <a href="/pro#contact">Contact</a>
        </div>

        {/* Actions desktop */}
        <div className="nav-actions">
          {isLoggedIn ? (
            <>
              <button
                className="nav-login"
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}
              >
                Déconnexion
              </button>
              <Link className="btn btn-primary" href="/dashboard">
                Mon espace →
              </Link>
            </>
          ) : (
            <>
              <Link className="nav-login" href="/login">
                Connexion
              </Link>
              <Link className="btn btn-primary" href="/pro/contact">
                Réserver une démo
              </Link>
            </>
          )}
        </div>

        {/* Hamburger mobile */}
        <button
          type="button"
          className={`bm-burger${open ? " is-open" : ""}`}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Overlay + panneau mobile */}
      <div className={`bm-overlay${open ? " is-open" : ""}`} onClick={close} />
      <aside className={`bm-sheet${open ? " is-open" : ""}`} role="dialog" aria-modal="true">
        <a className="bm-sheet-link" href="/pro#solution" onClick={close}>Solution</a>
        <a className="bm-sheet-link" href="/pro#vitrine" onClick={close}>Les biens</a>
        <a className="bm-sheet-link" href="/pro#process" onClick={close}>Process</a>
        <a className="bm-sheet-link" href="/pro#tarif" onClick={close}>Tarifs</a>
        <a className="bm-sheet-link" href="/pro#contact" onClick={close}>Contact</a>

        <div className="bm-sheet-sep" />

        {isLoggedIn ? (
          <>
            <button
              type="button"
              className="bm-sheet-login"
              onClick={() => {
                close();
                signOut({ callbackUrl: "/" });
              }}
            >
              Déconnexion
            </button>
            <Link className="bm-sheet-cta" href="/dashboard" onClick={close}>
              Mon espace →
            </Link>
          </>
        ) : (
          <>
            <Link className="bm-sheet-login" href="/login" onClick={close}>
              Connexion
            </Link>
            <Link className="bm-sheet-cta" href="/pro/contact" onClick={close}>
              Réserver une démo
            </Link>
          </>
        )}
      </aside>

      <style>{`
        .bm-burger { display: none; }
        .bm-overlay, .bm-sheet { display: none; }

        @media (max-width: 860px) {
          /* Nav toujours visible au scroll */
          nav {
            position: sticky;
            top: 0;
            z-index: 900;
            background: #fff;
            box-shadow: 0 2px 14px rgba(11, 26, 42, .08);
          }

          nav .nav-links,
          nav .nav-actions { display: none !important; }

          .bm-burger {
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            gap: 5px;
            width: 44px;
            height: 44px;
            padding: 0 10px;
            margin-left: auto;
            background: transparent;
            border: 0;
            cursor: pointer;
          }
          .bm-burger span {
            display: block;
            width: 100%;
            height: 2px;
            border-radius: 2px;
            background: #16324F;
            transition: transform .25s ease, opacity .2s ease;
          }
          .bm-burger.is-open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
          .bm-burger.is-open span:nth-child(2) { opacity: 0; }
          .bm-burger.is-open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

          .bm-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(11, 26, 42, .45);
            opacity: 0;
            pointer-events: none;
            transition: opacity .25s ease;
            z-index: 998;
          }
          .bm-overlay.is-open { opacity: 1; pointer-events: auto; }

          .bm-sheet {
            display: flex;
            flex-direction: column;
            gap: 4px;
            position: fixed;
            top: 0;
            right: 0;
            height: 100dvh;
            width: min(84vw, 340px);
            padding: 88px 22px 28px;
            background: #fff;
            box-shadow: -8px 0 30px rgba(11, 26, 42, .18);
            transform: translateX(100%);
            transition: transform .28s cubic-bezier(.4, 0, .2, 1);
            overflow-y: auto;
            z-index: 999;
          }
          .bm-sheet.is-open { transform: translateX(0); }

          /* Liens de section — leur propre classe, plus de collision avec le CTA */
          .bm-sheet-link,
          .bm-sheet-login {
            font-size: 1.05rem;
            font-weight: 600;
            color: #16324F;
            text-decoration: none;
            padding: 14px 6px;
            border-radius: 10px;
          }
          .bm-sheet-link:active { background: #EEF1F6; }

          .bm-sheet-sep { height: 1px; background: #E3E8F0; margin: 12px 0; }

          .bm-sheet-login {
            background: none;
            border: 0;
            cursor: pointer;
            font: inherit;
            text-align: left;
          }

          /* CTA — blanc sur navy, aucune autre règle ne le cible */
          .bm-sheet-cta {
            margin-top: 10px;
            display: block;
            text-align: center;
            text-decoration: none;
            background: #16324F;
            color: #fff;
            font-weight: 700;
            font-size: 1.02rem;
            padding: 15px 18px;
            border-radius: 12px;
          }
          .bm-sheet-cta:active { background: #1D4267; }
        }
      `}</style>
    </nav>
  );
}