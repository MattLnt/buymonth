"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const TiptapEditor = dynamic(() => import("@/app/components/TiptapEditor"), { ssr: false });

function generateSlug(titre) {
  return titre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

export default function ArticleForm({ article }) {
  const router = useRouter();
  const isEdit = !!article;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [form, setForm] = useState({
    titre: article?.titre || "",
    slug: article?.slug || "",
    extrait: article?.extrait || "",
    contenu: article?.contenu || "",
    coverImage: article?.coverImage || "",
    published: article?.published || false,
  });

  // Auto-génère le slug depuis le titre (seulement en création)
  useEffect(() => {
    if (!isEdit && form.titre) {
      setForm(f => ({ ...f, slug: generateSlug(f.titre) }));
    }
  }, [form.titre, isEdit]);

  async function uploadCover(file) {
    setUploadingCover(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/articles/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploadingCover(false);
    if (data.url) setForm(f => ({ ...f, coverImage: data.url }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.titre || !form.slug || !form.contenu) { setError("Titre, slug et contenu sont requis."); return; }
    setLoading(true); setError("");
    const res = await fetch(isEdit ? `/api/admin/articles/${article.id}` : "/api/admin/articles", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Une erreur est survenue"); return; }
    router.push("/dashboard/admin/blog");
    router.refresh();
  }

  const inputStyle = { width: "100%", border: "1.5px solid #E5E7EB", borderRadius: 10, padding: "10px 14px", fontSize: 14, color: "#141414", outline: "none", boxSizing: "border-box", background: "#fafafa", transition: "border-color 0.2s" };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 };

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        @media (max-width: 1024px) {
          .article-form-grid { grid-template-columns: 1fr !important; }
          .article-form-sidebar { position: static !important; }
        }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Retour
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#141414", margin: 0, letterSpacing: "-0.02em" }}>
          {isEdit ? "Modifier l'article" : "Nouvel article"}
        </h1>
      </div>

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#EF4444", fontSize: 13, borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="article-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>

          {/* Colonne principale */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Titre */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "20px" }}>
              <label style={labelStyle}>Titre</label>
              <input type="text" value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))} required placeholder="Titre de l'article" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#FF5A1F"} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
            </div>

            {/* Contenu */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "20px" }}>
              <label style={labelStyle}>Contenu</label>
              <TiptapEditor content={form.contenu} onChange={v => setForm(f => ({ ...f, contenu: v }))} />
            </div>

            {/* Extrait */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "20px" }}>
              <label style={labelStyle}>Extrait <span style={{ color: "#9CA3AF", fontWeight: 400, textTransform: "none" }}>(résumé affiché sur la liste)</span></label>
              <textarea value={form.extrait} onChange={e => setForm(f => ({ ...f, extrait: e.target.value }))} placeholder="Résumé court de l'article..." rows={3}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                onFocus={e => e.target.style.borderColor = "#FF5A1F"} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
            </div>
          </div>

          {/* Sidebar droite */}
          <div className="article-form-sidebar" style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 80 }}>

            {/* Publication */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "20px" }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#141414", margin: "0 0 16px" }}>Publication</h3>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 20 }}>
                <div onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                  style={{ width: 40, height: 22, borderRadius: 11, background: form.published ? "#10B981" : "#E5E7EB", position: "relative", transition: "background 0.2s", cursor: "pointer", flexShrink: 0 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: form.published ? 20 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                </div>
                <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{form.published ? "Publié" : "Brouillon"}</span>
              </label>
              <button type="submit" disabled={loading}
                style={{ width: "100%", background: loading ? "#E5E7EB" : "#141414", color: loading ? "#9CA3AF" : "#fff", fontWeight: 700, padding: "12px", borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: 14, transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading ? "Enregistrement..." : isEdit ? "Enregistrer les modifications" : "Créer l'article"}
              </button>
              {isEdit && article.published && (
                <Link href={`/blog/${article.slug}`} target="_blank"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 10, fontSize: 12, color: "#FF5A1F", fontWeight: 600, textDecoration: "none" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Voir l'article publié
                </Link>
              )}
            </div>

            {/* Slug */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "20px" }}>
              <label style={labelStyle}>Slug <span style={{ color: "#9CA3AF", fontWeight: 400, textTransform: "none" }}>(URL)</span></label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#9CA3AF" }}>/blog/</span>
                <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} required
                  style={{ ...inputStyle, paddingLeft: 52 }}
                  onFocus={e => e.target.style.borderColor = "#FF5A1F"} onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
              </div>
            </div>

            {/* Image de couverture */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "20px" }}>
              <label style={labelStyle}>Image de couverture</label>
              {form.coverImage ? (
                <div style={{ position: "relative", marginBottom: 10 }}>
                  <img src={form.coverImage} alt="Cover" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }} />
                  <button type="button" onClick={() => setForm(f => ({ ...f, coverImage: "" }))}
                    style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ) : (
                <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "24px", borderRadius: 10, border: "2px dashed #E5E7EB", cursor: "pointer", background: "#FAFAFA", transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#FF5A1F"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#E5E7EB"}>
                  {uploadingCover ? (
                    <span style={{ fontSize: 13, color: "#9CA3AF" }}>Upload en cours...</span>
                  ) : (
                    <>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>Cliquer pour uploader</span>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>JPG, PNG — max 10MB</span>
                    </>
                  )}
                  <input type="file" accept="image/*" style={{ display: "none" }}
                    onChange={e => { if (e.target.files?.[0]) uploadCover(e.target.files[0]); }} />
                </label>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

import Link from "next/link";