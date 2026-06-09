import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminDeleteArticle from "./AdminDeleteArticle";

export default async function AdminBlogPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, titre: true, slug: true, published: true, publishedAt: true, createdAt: true, extrait: true, coverImage: true },
  });

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        @media (max-width: 1024px) {
          .blog-header { flex-direction: column !important; gap: 12px !important; align-items: flex-start !important; }
          .blog-table { display: none !important; }
          .blog-cards { display: flex !important; }
        }
        @media (min-width: 1025px) {
          .blog-cards { display: none !important; }
        }
      `}</style>

      <div className="blog-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#141414", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Blog</h1>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>{articles.length} article{articles.length > 1 ? "s" : ""}</p>
        </div>
        <Link href="/dashboard/admin/blog/new"
          style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#141414", color: "#fff", padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouvel article
        </Link>
      </div>

      {/* TABLE DESKTOP */}
      <div className="blog-table" style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 120px 160px", padding: "10px 24px", background: "#F9FAFB", borderBottom: "1px solid #F3F4F6" }}>
          {["Titre", "Statut", "Date", "Actions"].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
          ))}
        </div>

        {articles.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 16px" }}>Aucun article pour l'instant.</p>
            <Link href="/dashboard/admin/blog/new" style={{ fontSize: 13, color: "#FF5A1F", fontWeight: 600, textDecoration: "none" }}>Créer le premier article →</Link>
          </div>
        ) : articles.map((a, i) => (
          <div key={a.id} style={{ display: "grid", gridTemplateColumns: "1fr 140px 120px 160px", padding: "14px 24px", borderBottom: i < articles.length - 1 ? "1px solid #F9FAFB" : "none", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              {a.coverImage && (
                <img src={a.coverImage} alt="" style={{ width: 48, height: 36, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#141414", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.titre}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>/{a.slug}</div>
              </div>
            </div>
            <div>
              <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: a.published ? "#F0FDF4" : "#F9FAFB", color: a.published ? "#10B981" : "#6B7280" }}>
                {a.published ? "Publié" : "Brouillon"}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>
              {new Date(a.createdAt).toLocaleDateString("fr-BE")}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {a.published && (
                <Link href={`/blog/${a.slug}`} target="_blank"
                  style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 7, background: "#F9FAFB", border: "1px solid #F3F4F6", color: "#6B7280", fontSize: 11, fontWeight: 600, textDecoration: "none" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Voir
                </Link>
              )}
              <Link href={`/dashboard/admin/blog/${a.id}/edit`}
                style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 7, background: "#141414", color: "#fff", fontSize: 11, fontWeight: 600, textDecoration: "none" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Éditer
              </Link>
              <AdminDeleteArticle id={a.id} />
            </div>
          </div>
        ))}
      </div>

      {/* CARDS MOBILE */}
      <div className="blog-cards" style={{ flexDirection: "column", gap: 10 }}>
        {articles.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "32px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 12px" }}>Aucun article pour l'instant.</p>
            <Link href="/dashboard/admin/blog/new" style={{ fontSize: 13, color: "#FF5A1F", fontWeight: 600, textDecoration: "none" }}>Créer le premier →</Link>
          </div>
        ) : articles.map(a => (
          <div key={a.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "16px", display: "flex", gap: 12 }}>
            {a.coverImage && (
              <img src={a.coverImage} alt="" style={{ width: 64, height: 48, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#141414", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.titre}</div>
                <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600, flexShrink: 0, background: a.published ? "#F0FDF4" : "#F9FAFB", color: a.published ? "#10B981" : "#6B7280" }}>
                  {a.published ? "Publié" : "Brouillon"}
                </span>
              </div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 10 }}>/{a.slug} · {new Date(a.createdAt).toLocaleDateString("fr-BE")}</div>
              <div style={{ display: "flex", gap: 8 }}>
                {a.published && (
                  <Link href={`/blog/${a.slug}`} target="_blank"
                    style={{ padding: "6px 12px", borderRadius: 7, background: "#F9FAFB", border: "1px solid #F3F4F6", color: "#6B7280", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                    Voir
                  </Link>
                )}
                <Link href={`/dashboard/admin/blog/${a.id}/edit`}
                  style={{ padding: "6px 12px", borderRadius: 7, background: "#141414", color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                  Éditer
                </Link>
                <AdminDeleteArticle id={a.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}