"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const FILTERS = [
  { key: "7d", label: "7 jours" },
  { key: "30d", label: "30 jours" },
  { key: "6m", label: "6 mois" },
  { key: "12m", label: "12 mois" },
];

const packCommissions = { 1: "1,5%", 2: "3,5%", 3: "3,5%", 4: "5%" };
const packLabels = { 1: "Mise en relation", 2: "Intégration Métier", 3: "Communication & Transition", 4: "Full Premium" };

function FilterBar({ active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {FILTERS.map(f => (
        <button key={f.key} onClick={() => onChange(f.key)}
          style={{ padding: "4px 10px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: active === f.key ? "#141414" : "#F3F4F6", color: active === f.key ? "#fff" : "#6B7280", transition: "all 0.15s" }}>
          {f.label}
        </button>
      ))}
    </div>
  );
}

function CustomTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#141414", borderRadius: 10, padding: "8px 14px", fontSize: 12, color: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
      <div style={{ color: "#9CA3AF", marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{payload[0].value} {unit}</div>
    </div>
  );
}

export default function DashboardVendeurContent({ opportunites, session, totalVuesPubliques, totalVuesAbonnes, totalDeblocages, acheteursPotentiels }) {
  const [filter, setFilter] = useState("30d");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const encoded = opportunites.length;
  const enLigne = opportunites.filter(o => o.status === "ACTIVE").length;
  const cloturees = opportunites.filter(o => o.status === "CLOSED" || o.status === "HIDDEN").length;

  const today = new Date().toLocaleDateString("fr-BE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  useEffect(() => {
    setLoading(true);
    fetch(`/api/vendeur/stats-vues?filter=${filter}`)
      .then(r => r.json())
      .then(data => { setChartData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filter]);

  const vuesPubliquesData = chartData?.vuesPubliques || [];
  const vuesAbonnesData = chartData?.vuesAbonnes || [];
  const deblocagesData = chartData?.deblocages || [];

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        @media (max-width: 1024px) {
          .vend-header { flex-direction: column !important; align-items: flex-start !important; gap: 14px !important; margin-bottom: 20px !important; }
          .vend-mini-stats { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .vend-charts-grid { grid-template-columns: 1fr !important; }
          .vend-acheteurs-row { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
          .vend-acheteurs-actions { width: 100% !important; justify-content: flex-end !important; }
        }
      `}</style>

      {/* Header */}
      <div className="vend-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 4px", textTransform: "capitalize" }}>{today}</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#141414", margin: 0, letterSpacing: "-0.02em" }}>Vue d'ensemble</h1>
        </div>
        <Link href="/dashboard/vendeur/nouvelle-opportunite"
          style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#141414", color: "#fff", padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouvelle opportunité
        </Link>
      </div>

      {/* Note auto-publish */}
      <div style={{ background: "rgba(255,90,31,0.06)", border: "1px solid rgba(255,90,31,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        <p style={{ fontSize: 13, color: "#C2410C", margin: 0 }}>
          Vos dossiers sont publiés automatiquement dès le dépôt et visibles immédiatement par les acheteurs qualifiés.
        </p>
      </div>

      {/* 3 mini stats */}
      <div className="vend-mini-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Opportunités encodées", value: encoded, color: "#141414" },
          { label: "Opportunités en ligne", value: enLigne, color: "#10B981" },
          { label: "Opportunités clôturées", value: cloturees, color: "#6B7280" },
        ].map(stat => (
          <div key={stat.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 6px", fontWeight: 500 }}>{stat.label}</p>
              <div style={{ fontSize: 28, fontWeight: 700, color: stat.color, letterSpacing: "-0.02em", lineHeight: 1 }}>{stat.value}</div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: stat.color, flexShrink: 0 }} />
          </div>
        ))}
      </div>

      {/* Filtre période */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0, fontWeight: 500 }}>Période d'analyse</p>
        <FilterBar active={filter} onChange={setFilter} />
      </div>

      {/* 2 graphiques vues */}
      <div className="vend-charts-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>

        {/* Vues publiques */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#141414", margin: "0 0 2px" }}>Vues publiques</p>
              <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>Visiteurs non abonnés</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#141414" }}>{totalVuesPubliques}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>total cumulé</div>
            </div>
          </div>
          {loading ? (
            <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Chargement…</p>
            </div>
          ) : vuesPubliquesData.every(d => d.value === 0) ? (
            <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB", borderRadius: 10 }}>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Aucune vue sur cette période</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={vuesPubliquesData} margin={{ top: 0, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradPublique" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#141414" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#141414" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip unit="vue(s)" />} />
                <Area type="monotone" dataKey="value" stroke="#141414" strokeWidth={2} fill="url(#gradPublique)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Vues acheteurs qualifiés */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#141414", margin: "0 0 2px" }}>Vues acheteurs qualifiés</p>
              <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>Acheteurs abonnés</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#FF5A1F" }}>{totalVuesAbonnes}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>total cumulé</div>
            </div>
          </div>
          {loading ? (
            <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Chargement…</p>
            </div>
          ) : vuesAbonnesData.every(d => d.value === 0) ? (
            <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB", borderRadius: 10 }}>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Aucune vue sur cette période</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={vuesAbonnesData} margin={{ top: 0, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradAbonne" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5A1F" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#FF5A1F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip unit="vue(s)" />} />
                <Area type="monotone" dataKey="value" stroke="#FF5A1F" strokeWidth={2} fill="url(#gradAbonne)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Graphique déblocages */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "20px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#141414", margin: "0 0 2px" }}>Dossiers débloqués payants</p>
            <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>Acheteurs ayant payé pour accéder à vos coordonnées</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#FF5A1F" }}>{totalDeblocages}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>total · {(totalDeblocages * 699).toLocaleString("fr-BE")} € générés</div>
          </div>
        </div>
        {loading ? (
          <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Chargement…</p>
          </div>
        ) : deblocagesData.every(d => d.value === 0) ? (
          <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB", borderRadius: 10 }}>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Aucun déblocage sur cette période</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={deblocagesData} margin={{ top: 0, right: 4, left: -28, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip unit="déblocage(s)" />} />
              <Bar dataKey="value" fill="#FF5A1F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Mes acheteurs potentiels */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#141414", margin: "0 0 2px" }}>Mes acheteurs potentiels</h2>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>
              {acheteursPotentiels.length} acheteur{acheteursPotentiels.length > 1 ? "s" : ""} ayant débloqué vos dossiers
            </p>
          </div>
          <Link href="/dashboard/vendeur/demandes" style={{ fontSize: 12, color: "#FF5A1F", fontWeight: 600, textDecoration: "none" }}>Voir tout →</Link>
        </div>

        {acheteursPotentiels.length === 0 ? (
          <div style={{ padding: "40px 24px", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "#FF5A1F" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#141414", margin: "0 0 6px" }}>Aucun acheteur potentiel</p>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0, lineHeight: 1.5 }}>
              Dès qu'un acheteur débloque votre dossier, il apparaîtra ici.
            </p>
          </div>
        ) : (
          <div>
            {acheteursPotentiels.slice(0, 5).map((a, i) => (
              <div key={a.id} className="vend-acheteurs-row" style={{ padding: "16px 20px", borderBottom: i < Math.min(acheteursPotentiels.length, 5) - 1 ? "1px solid #F9FAFB" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#141414", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#FF5A1F", flexShrink: 0 }}>
                      {a.email[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#141414" }}>{a.email}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>
                        Dossier {a.opportuniteProvince}
                        {a.packCommission && (
                          <span style={{ marginLeft: 6, padding: "2px 8px", borderRadius: 10, background: "rgba(255,90,31,0.1)", color: "#C2410C", fontSize: 10, fontWeight: 600 }}>
                            {packLabels[a.packCommission]} · {packCommissions[a.packCommission]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", paddingLeft: 42 }}>
                    Débloqué le {new Date(a.paidAt).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </div>
                <div className="vend-acheteurs-actions" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <Link href="/dashboard/vendeur/messages"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#141414", color: "#fff", padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                    Contacter
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}