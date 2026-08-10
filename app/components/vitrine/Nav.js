"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import CalMark from "./CalMark";

export default function Nav() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    <nav>
      <div className="wrap nav-in">
        <Link className="brand" href="/pro">
          <CalMark size={34} />
          BuyMonth
        </Link>
        <div className="nav-links">
          <a href="/pro#solution">Solution</a>
          <a href="/pro#vitrine">Les biens</a>
          <a href="/pro#process">Process</a>
          <a href="/pro#tarif">Tarifs</a>
          <a href="/pro#contact">Contact</a>
        </div>
        <div className="nav-actions">
          {isLoggedIn ? (
            <>
              <button className="nav-login" onClick={() => signOut({ callbackUrl: "/" })} style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}>
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
      </div>
    </nav>
  );
}