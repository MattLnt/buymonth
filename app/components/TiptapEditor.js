"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useRef } from "react";

const ToolbarButton = ({ onClick, active, disabled, title, children }) => (
  <button type="button" onClick={onClick} disabled={disabled} title={title}
    style={{
      padding: "5px 8px", borderRadius: 6, border: "none", cursor: disabled ? "not-allowed" : "pointer",
      background: active ? "#141414" : "transparent",
      color: active ? "#fff" : "#374151",
      fontSize: 13, fontWeight: 600, lineHeight: 1,
      opacity: disabled ? 0.4 : 1,
      transition: "all 0.15s",
      display: "flex", alignItems: "center", justifyContent: "center", minWidth: 30, height: 30,
    }}>
    {children}
  </button>
);

const Divider = () => <div style={{ width: 1, height: 20, background: "#E5E7EB", margin: "0 4px" }} />;

export default function TiptapEditor({ content, onChange, placeholder = "Rédigez votre contenu ici..." }) {
  const fileInputRef = useRef(null);

const editor = useEditor({
  immediatelyRender: false,
  extensions: [
    StarterKit.configure({
      link: false,
      underline: false,
    }),
    Underline,
    TextStyle,
    Color,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Link.configure({ openOnClick: false, HTMLAttributes: { class: "tiptap-link" } }),
    Image.configure({ HTMLAttributes: { class: "tiptap-image" } }),
    Placeholder.configure({ placeholder }),
  ],
  content: content || "",
  onUpdate: ({ editor }) => onChange(editor.getHTML()),
  editorProps: {
    attributes: {
      style: "min-height: 400px; padding: 20px; outline: none; font-size: 15px; line-height: 1.8; color: #141414;",
    },
  },
});

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL du lien :");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/articles/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url && editor) {
      editor.chain().focus().setImage({ src: data.url }).run();
    }
  };

  if (!editor) return null;

  return (
    <div style={{ border: "1.5px solid #E5E7EB", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
      {/* Toolbar */}
      <div style={{ borderBottom: "1px solid #F3F4F6", padding: "8px 12px", display: "flex", flexWrap: "wrap", gap: 2, background: "#FAFAFA", alignItems: "center" }}>

        {/* Titres */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Titre 1">H1</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Titre 2">H2</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Titre 3">H3</ToolbarButton>

        <Divider />

        {/* Formatage */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Gras">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 4h8a4 4 0 010 8H6z"/><path d="M6 12h9a4 4 0 010 8H6z"/></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italique">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Souligné">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 3v7a6 6 0 0012 0V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Barré">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><path d="M16 6C16 6 14.5 4 12 4C9.5 4 7 5.5 7 8C7 10.5 9 11.5 12 12"/><path d="M8 18C8 18 9.5 20 12 20C14.5 20 17 18.5 17 16C17 13.5 15 12.5 12 12"/></svg>
        </ToolbarButton>

        <Divider />

        {/* Alignement */}
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Aligner à gauche">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Centrer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Aligner à droite">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>
        </ToolbarButton>

        <Divider />

        {/* Listes */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Liste à puces">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Liste numérotée">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Citation">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
        </ToolbarButton>

        <Divider />

        {/* Lien + Image */}
        <ToolbarButton onClick={addLink} active={editor.isActive("link")} title="Ajouter un lien">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
        </ToolbarButton>
        {editor.isActive("link") && (
          <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} title="Supprimer le lien">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/><line x1="4" y1="4" x2="20" y2="20" stroke="#EF4444"/></svg>
          </ToolbarButton>
        )}
        <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Insérer une image">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </ToolbarButton>
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={e => { if (e.target.files?.[0]) uploadImage(e.target.files[0]); e.target.value = ""; }} />

        <Divider />

        {/* Undo/Redo */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Annuler">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M3 13A9 9 0 1021 12"/></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Rétablir">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M21 13A9 9 0 113 12"/></svg>
        </ToolbarButton>
      </div>

      {/* Zone d'édition */}
      <style>{`
        .tiptap-editor h1 { font-size: 28px; font-weight: 700; margin: 16px 0 8px; color: #141414; }
        .tiptap-editor h2 { font-size: 22px; font-weight: 700; margin: 14px 0 8px; color: #141414; }
        .tiptap-editor h3 { font-size: 18px; font-weight: 600; margin: 12px 0 6px; color: #141414; }
        .tiptap-editor p { margin: 0 0 12px; }
        .tiptap-editor ul { padding-left: 20px; margin: 8px 0; }
        .tiptap-editor ol { padding-left: 20px; margin: 8px 0; }
        .tiptap-editor li { margin-bottom: 4px; }
        .tiptap-editor blockquote { border-left: 3px solid #FF5A1F; padding-left: 16px; margin: 12px 0; color: #6B7280; font-style: italic; }
        .tiptap-editor a.tiptap-link { color: #FF5A1F; text-decoration: underline; }
        .tiptap-editor img.tiptap-image { max-width: 100%; border-radius: 8px; margin: 12px 0; }
        .tiptap-editor p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: #9CA3AF; pointer-events: none; height: 0; }
        .tiptap-editor:focus { outline: none; }
      `}</style>
      <div className="tiptap-editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}