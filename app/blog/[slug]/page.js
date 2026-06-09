import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import PublicNav from "@/app/components/PublicNav";
import PublicFooter from "@/app/components/PublicFooter";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) return {};
  return {
    title: `${article.titre} — Fiderio`,
    description: article.extrait || "",
    openGraph: { images: article.coverImage ? [article.coverImage] : [] },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article || !article.published) notFound();

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "var(--font-sans)" }}>
      <style>{`
        @media (max-width: 768px) {
          .article-header { padding: 80px 24px 32px !important; }
          .article-header h1 { font-size: 28px !important; }
          .article-body { padding: 32px 24px 60px !important; }
        }
        .article-content h1 { font-size: 28px; font-weight: 700; margin: 28px 0 12px; color: #141414; letter-spacing: -0.02em; }
        .article-content h2 { font-size: 22px; font-weight: 700; margin: 24px 0 10px; color: #141414; letter-spacing: -0.01em; }
        .article-content h3 { font-size: 18px; font-weight: 600; margin: 20px 0 8px; color: #141414; }
        .article-content p { margin: 0 0 16px; font-size: 16px; line-height: 1.85; color: #374151; }
        .article-content ul { padding-left: 22px; margin: 12px 0 16px; }
        .article-content ol { padding-left: 22px; margin: 12px 0 16px; }
        .article-content li { margin-bottom: 6px; font-size: 16px; line-height: 1.7; color: #374151; }
        .article-content blockquote { border-left: 3px solid #FF5A1F; padding: 12px 20px; margin: 20px 0; background: rgba(255,90,31,0.06); border-radius: 0 8px 8px 0; }
        .article-content blockquote p { color: #6B7280; font-style: italic; margin: 0; }
        .article-content a { color: #FF5A1F; text-decoration: underline; }
        .article-content img { max-width: 100%; border-radius: 10px; margin: 20px 0; }
        .article-content strong { font-weight: 700; color: #141414; }
        .article-content em { font-style: italic; }
        .article-content u { text-decoration: underline; }
        .article-content s { text-decoration: line-through; }
        .article-content hr { border: none; border-top: 1px solid #F3F4F6; margin: 28px 0; }
      `}</style>

      <PublicNav />

      {/* Header article */}
      <div className="article-header" style={{ background: "#141414", padding: "120px 48px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,90,31,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 20, fontWeight: 500 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Retour au blog
          </Link>
          <h1 style={{ fontSize: 40, fontWeight: 700, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.03em", lineHeight: 1.15 }}>{article.titre}</h1>
          {article.extrait && <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 20px" }}>{article.extrait}</p>}
          {article.publishedAt && (
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>
              Publié le {new Date(article.publishedAt).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
        </div>
      </div>

      {/* Image de couverture */}
      {article.coverImage && (
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
          <img src={article.coverImage} alt={article.titre} style={{ width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: "0 0 16px 16px" }} />
        </div>
      )}

      {/* Contenu */}
      <div className="article-body" style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: article.contenu }} />

        {/* CTA bas d'article */}
        <div style={{ marginTop: 64, background: "#141414", borderRadius: 16, padding: "36px", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#FF5A1F", letterSpacing: "0.1em", margin: "0 0 12px" }}>FIDERIO</p>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.02em" }}>Prêt à céder ou acquérir une fiduciaire ?</h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "0 0 24px", lineHeight: 1.7 }}>Rejoignez la plateforme privée de référence pour la cession de fiduciaires en Belgique.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register/acheteur" style={{ background: "#FF5A1F", color: "#141414", padding: "11px 22px", borderRadius: 9, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              Créer un compte acheteur
            </Link>
            <Link href="/register/vendeur" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", padding: "11px 22px", borderRadius: 9, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              Déposer un dossier
            </Link>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}