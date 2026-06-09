import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PublicNav from "@/app/components/PublicNav";
import PublicFooter from "@/app/components/PublicFooter";

export default async function BlogPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: { id: true, titre: true, slug: true, extrait: true, coverImage: true, publishedAt: true },
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "var(--font-sans)" }}>
      <style>{`
        @media (max-width: 768px) {
          .blog-hero { padding: 80px 24px 48px !important; }
          .blog-hero h1 { font-size: 32px !important; }
          .blog-grid { grid-template-columns: 1fr !important; padding: 24px 16px 48px !important; }
        }
        .blog-card { background: #fff; border-radius: 16px; border: 1px solid #F3F4F6; overflow: hidden; transition: box-shadow 0.2s, transform 0.2s; text-decoration: none; display: block; }
        .blog-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-2px); }
      `}</style>

      <PublicNav />

      {/* Hero */}
      <div className="blog-hero" style={{ background: "#141414", padding: "120px 48px 64px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,90,31,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#FF5A1F", letterSpacing: "0.1em", margin: "0 0 14px" }}>BLOG</p>
          <h1 style={{ fontSize: 48, fontWeight: 700, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Actualités & Conseils
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", maxWidth: 480, margin: "0 auto", lineHeight: 1.8 }}>
            Expertise du marché de la comptabilité, conseils de transmission et actualités du secteur.
          </p>
        </div>
      </div>

      {/* Grille articles */}
      <div className="blog-grid" style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
        {articles.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 15, color: "#6B7280" }}>Aucun article publié pour l'instant.</p>
          </div>
        ) : articles.map(a => (
          <Link key={a.id} href={`/blog/${a.slug}`} className="blog-card">
            {a.coverImage ? (
              <img src={a.coverImage} alt={a.titre} style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: 200, background: "linear-gradient(135deg, #141414, #1F1F22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,90,31,0.4)" strokeWidth="1"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
            )}
            <div style={{ padding: "20px" }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#141414", margin: "0 0 10px", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{a.titre}</h2>
              {a.extrait && <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, margin: "0 0 14px" }}>{a.extrait}</p>}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                  {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" }) : ""}
                </span>
                <span style={{ fontSize: 12, color: "#FF5A1F", fontWeight: 600 }}>Lire →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <PublicFooter />
    </div>
  );
}