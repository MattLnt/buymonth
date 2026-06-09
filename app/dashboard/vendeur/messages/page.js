"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

export default function MessagesVendeurPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [userId, setUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const listRef = useRef(null);
  const fileInputRef = useRef(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(s => setUserId(s?.user?.id));
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => { loadConversations(); }, []);

  useEffect(() => {
    if (selectedConv && isMobile) {
      window.dispatchEvent(new Event('msg-chat-open'));
    } else if (!selectedConv && isMobile) {
      window.dispatchEvent(new Event('msg-chat-close'));
    }
    if (selectedConv) {
      loadMessages(selectedConv.id);
      const interval = setInterval(() => loadMessages(selectedConv.id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedConv, isMobile]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  async function loadConversations() {
    const res = await fetch("/api/messages");
    const data = await res.json();
    setConversations(data);
    const convId = searchParams.get("conv");
    const mobile = window.innerWidth <= 1024;
    if (convId) {
      const found = data.find(c => c.id === convId);
      if (found) setSelectedConv(found);
      else if (data.length > 0 && !mobile) setSelectedConv(data[0]);
    } else if (data.length > 0 && !mobile) {
      setSelectedConv(data[0]);
    }
  }

  async function loadMessages(convId) {
    const res = await fetch(`/api/messages?conversationId=${convId}`);
    const data = await res.json();
    setMessages(data);
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/messages/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    if (res.ok) setAttachment({ url: data.url, name: data.name });
  }

  async function handleSend(e) {
    e.preventDefault();
    if ((!content.trim() && !attachment) || !selectedConv) return;
    setLoading(true);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: selectedConv.id, content: content.trim(), attachmentUrl: attachment?.url || null, attachmentName: attachment?.name || null }),
    });
    const msg = await res.json();
    setMessages(prev => [...prev, msg]);
    setContent(""); setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setLoading(false);
    loadConversations();
  }

  function handleBack() {
    setSelectedConv(null);
    window.dispatchEvent(new Event('msg-chat-close'));
    // Double setTimeout pour attendre le re-render du composant liste
    setTimeout(() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        if (listRef.current) listRef.current.scrollTop = 0;
        const main = document.querySelector('.vend-main');
        if (main) main.scrollTop = 0;
        const body = document.querySelector('body');
        if (body) body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, 50);
    }, 10);
  }

  const formatDate = (d) => new Date(d).toLocaleDateString("fr-BE", { day: "numeric", month: "short" });
  const formatTime = (d) => new Date(d).toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" });
  const isImg = (url) => url && /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  const formatTypeDeal = (t) => {
    if (!t) return "";
    if (Array.isArray(t)) return t.map(x => x.replace(/_/g, " ")).join(", ");
    return t.replace(/_/g, " ");
  };

  const sortedMessages = [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const showList = !isMobile || !selectedConv;
  const showChat = !isMobile || !!selectedConv;

  return (
    <div style={{ height: "100vh", background: "#F4F6F8", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "300px 1fr", minHeight: 0, overflow: "hidden" }}>

        {/* LISTE */}
        {showList && (
          <div ref={listRef} style={{ borderRight: isMobile ? "none" : "1px solid #F3F4F6", background: "#fff", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px", borderBottom: "1px solid #F3F4F6", flexShrink: 0 }}>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: "#141414", margin: 0 }}>Messages</h1>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: "2px 0 0" }}>{conversations.length} conversation{conversations.length > 1 ? "s" : ""}</p>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {conversations.length === 0 ? (
                <div style={{ padding: "40px 16px", textAlign: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "#9CA3AF" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  </div>
                  <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Aucune conversation</p>
                  <p style={{ fontSize: 12, color: "#D1D5DB", margin: "4px 0 0" }}>Les acheteurs vous contacteront ici</p>
                </div>
              ) : conversations.map(conv => {
                const isSelected = selectedConv?.id === conv.id;
                const unread = conv._count?.messages || 0;
                const lastMsg = conv.messages?.[0];
                const opp = conv.deblocage?.opportunite;
                const acheteur = conv.deblocage?.acheteur;
                return (
                  <div key={conv.id} onClick={() => setSelectedConv(conv)}
                    style={{ padding: "14px 16px", cursor: "pointer", borderBottom: "1px solid #F9FAFB", background: isSelected ? "#F9FAFB" : unread > 0 ? "#FAFFFE" : "#fff", borderLeft: `3px solid ${isSelected ? "#FF5A1F" : unread > 0 ? "#FF5A1F" : "transparent"}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "#141414", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#FF5A1F", fontSize: 15, fontWeight: 700 }}>
                        {(acheteur?.nomBureau || acheteur?.user?.email || "?")[0].toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                          <p style={{ fontSize: 13, fontWeight: unread > 0 ? 700 : 600, color: "#141414", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {acheteur?.nomBureau || acheteur?.user?.email?.split("@")[0]}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginLeft: 8 }}>
                            {unread > 0 && <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#FF5A1F", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{unread}</span>}
                            {lastMsg && <span style={{ fontSize: 11, color: "#9CA3AF" }}>{formatDate(lastMsg.createdAt)}</span>}
                          </div>
                        </div>
                        <p style={{ fontSize: 11, color: "#9CA3AF", margin: "0 0 2px" }}>{opp?.province} · {formatTypeDeal(opp?.typeDeal)}</p>
                        {lastMsg && <p style={{ fontSize: 12, color: unread > 0 ? "#374151" : "#9CA3AF", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: unread > 0 ? 500 : 400 }}>
                          {lastMsg.attachmentName ? `📎 ${lastMsg.attachmentName}` : lastMsg.content}
                        </p>}
                      </div>
                      {isMobile && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M9 18l6-6-6-6"/></svg>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CHAT */}
        {showChat && (
          selectedConv ? (
            <div style={{
              display: "flex", flexDirection: "column", background: "#F4F6F8", overflow: "hidden",
              ...(isMobile ? { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 } : { height: "100%" }),
            }}>
              {/* Header desktop */}
              {!isMobile && (
                <div style={{ background: "#fff", borderBottom: "1px solid #F3F4F6", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#141414", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5A1F", fontWeight: 700, flexShrink: 0 }}>
                    {(selectedConv?.deblocage?.acheteur?.nomBureau || selectedConv?.deblocage?.acheteur?.user?.email || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#141414", margin: 0 }}>
                      {selectedConv?.deblocage?.acheteur?.nomBureau || selectedConv?.deblocage?.acheteur?.user?.email}
                    </p>
                    <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
                      {selectedConv?.deblocage?.opportunite?.province} · {formatTypeDeal(selectedConv?.deblocage?.opportunite?.typeDeal)} · {(selectedConv?.deblocage?.opportunite?.chiffreAffaires / 1000).toFixed(0)}k €
                    </p>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div ref={messagesContainerRef} style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10, minHeight: 0, height: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, justifyContent: "flex-end", minHeight: "100%" }}>
                  {sortedMessages.length === 0 && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center" }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#141414", margin: "0 0 6px" }}>Démarrez la conversation</p>
                      <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Envoyez votre premier message.</p>
                    </div>
                  )}
                  {sortedMessages.map(msg => {
                    const isMine = msg.sender?.id === userId || msg.senderId === userId;
                    return (
                      <div key={msg.id} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
                        <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: isMine ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: isMine ? "#141414" : "#fff", color: isMine ? "#fff" : "#141414", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", wordBreak: "break-word" }}>
                          {msg.content && <p style={{ fontSize: 14, margin: "0 0 4px", lineHeight: 1.5 }}>{msg.content}</p>}
                          {msg.attachmentUrl && (
                            isImg(msg.attachmentUrl) ? (
                              <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer">
                                <img src={msg.attachmentUrl} alt={msg.attachmentName} style={{ maxWidth: "100%", borderRadius: 8, display: "block" }} />
                              </a>
                            ) : (
                              <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer"
                                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", borderRadius: 8, background: isMine ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)", textDecoration: "none", color: "inherit" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                                <span style={{ fontSize: 12, fontWeight: 600 }}>{msg.attachmentName}</span>
                              </a>
                            )
                          )}
                          <p style={{ fontSize: 10, margin: "4px 0 0", opacity: 0.5, textAlign: "right" }}>{formatTime(msg.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Pièce jointe */}
              {attachment && (
                <div style={{ padding: "8px 14px", borderTop: "1px solid #F9FAFB", display: "flex", alignItems: "center", gap: 8, background: "#fff", flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                  <span style={{ fontSize: 12, color: "#374151", fontWeight: 600, flex: 1 }}>{attachment.name}</span>
                  <button onClick={() => { setAttachment(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 18 }}>×</button>
                </div>
              )}

              {/* Barre du bas */}
              <div style={{ background: "#fff", borderTop: "1px solid #F3F4F6", flexShrink: 0 }}>
                <div style={{ padding: "10px 16px 6px", display: "flex", gap: 10, alignItems: "center" }}>
                  <input ref={fileInputRef} type="file" onChange={handleFileChange} style={{ display: "none" }} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                    style={{ width: 38, height: 38, borderRadius: 10, border: "1.5px solid #E5E7EB", background: "#FAFAFA", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: uploading ? "#FF5A1F" : "#9CA3AF" }}>
                    {uploading
                      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                    }
                  </button>
                  <input value={content} onChange={e => setContent(e.target.value)} placeholder="Écrire un message..."
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                    style={{ flex: 1, border: "1px solid #E5E7EB", borderRadius: 10, padding: "10px 14px", fontSize: 14, outline: "none", minWidth: 0 }}
                    onFocus={e => e.target.style.borderColor = "#FF5A1F"}
                    onBlur={e => e.target.style.borderColor = "#E5E7EB"} />
                  <button onClick={handleSend} disabled={loading || uploading || (!content.trim() && !attachment)}
                    style={{ background: loading || (!content.trim() && !attachment) ? "#E5E7EB" : "#141414", color: loading || (!content.trim() && !attachment) ? "#9CA3AF" : "#fff", border: "none", borderRadius: 10, padding: "10px 14px", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </div>

                {/* Barre mobile bas */}
                {isMobile && (
                  <div style={{ padding: "6px 16px 12px", display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid #F3F4F6" }}>
                    <button onClick={handleBack}
                      style={{ background: "#F3F4F6", border: "none", cursor: "pointer", padding: 7, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#141414", flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    </button>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: "#141414", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5A1F", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                      {(selectedConv?.deblocage?.acheteur?.nomBureau || selectedConv?.deblocage?.acheteur?.user?.email || "?")[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#141414", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {selectedConv?.deblocage?.acheteur?.nomBureau || selectedConv?.deblocage?.acheteur?.user?.email}
                      </p>
                      <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {selectedConv?.deblocage?.opportunite?.province} · {formatTypeDeal(selectedConv?.deblocage?.opportunite?.typeDeal)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            !isMobile && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F6F8", height: "100%" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "#fff", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "#9CA3AF" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  </div>
                  <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Sélectionnez une conversation</p>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}