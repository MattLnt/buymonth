import Link from "next/link";
import PublicNav from "@/app/components/PublicNav";
import PublicFooter from "@/app/components/PublicFooter";

export const metadata = {
  title: "Conditions générales — BuyMonth",
};

export default function CGVPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#EEF1F6" }}>
      <PublicNav />

      <div style={{ paddingTop: 64 }}>
        {/* Hero */}
        <div style={{ background: "linear-gradient(150deg, #16324F 0%, #1D4267 100%)", padding: "72px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-30%", right: "-5%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,184,168,0.16) 0%, transparent 65%)", pointerEvents: "none" }} />
          <p style={{ fontSize: 11, fontWeight: 700, color: "#7CB8A8", letterSpacing: "0.1em", margin: "0 0 14px", position: "relative" }}>LÉGAL</p>
          <h1 style={{ fontSize: 40, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.025em", position: "relative" }}>
            Conditions générales
          </h1>
        </div>

        {/* Contenu placeholder */}
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px 80px" }}>
          <div style={{ background: "#fff", border: "1px solid #EEF2F7", borderRadius: 18, padding: "48px 40px", textAlign: "center" }}>
            <div style={{ display: "inline-flex", width: 56, height: 56, borderRadius: 16, background: "rgba(124,184,168,0.12)", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#193B5E", margin: "0 0 10px" }}>Page en cours de finalisation</h2>
            <p style={{ fontSize: 14.5, color: "#5A6275", lineHeight: 1.7, margin: "0 0 28px", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
              Les conditions générales de BuyMonth sont en cours de rédaction et seront publiées prochainement. Pour toute question d'ici là, vous pouvez nous contacter directement.
            </p>
            <a href="mailto:info@buymonth.be" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#193B5E", color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              info@buymonth.be
            </a>
          </div>

          <p style={{ textAlign: "center", fontSize: 12.5, color: "#9AA2B4", marginTop: 28, lineHeight: 1.7 }}>
            BuyMonth est une marque de JG Management SRL,<br />intermédiaire en crédit immobilier agréé par la FSMA n°1021.366.349.
          </p>
        </div>

        <PublicFooter />
      </div>
    </div>
  );
}