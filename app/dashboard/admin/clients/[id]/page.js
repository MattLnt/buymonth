import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageHeader, StatCard } from '@/app/components/dashboard/Ui'
import { EssaiCard } from './EssaiCard'

export const dynamic = 'force-dynamic'

const planLabel = {
  CLASSIC: { label: 'Classic', color: '#5A6275', bg: '#F2F5FA' },
  PREMIUM: { label: 'Premium', color: '#7CB8A8', bg: 'rgba(124,184,168,0.14)' },
}

export default async function AdminClientDetailPage({ params }) {
  const { id } = await params

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      user: { select: { email: true } },
      biens: { orderBy: { createdAt: 'desc' } },
      _count: { select: { biens: true, widgetPayments: true } },
    },
  })

  if (!client) notFound()

  const nbLeads = await prisma.lead.count({ where: { bien: { clientId: client.id } } })
  const plan = planLabel[client.plan] || planLabel.CLASSIC

  const infoRow = (label, value) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #F4F7FB' }}>
      <span style={{ fontSize: 13, color: '#8A92A6' }}>{label}</span>
      <span style={{ fontSize: 13.5, color: '#193B5E', fontWeight: 600, textAlign: 'right' }}>{value || '—'}</span>
    </div>
  )

  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <Link href="/dashboard/admin/clients" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: '#7CB8A8', textDecoration: 'none', fontWeight: 600 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          Retour aux clients
        </Link>
      </div>

      <PageHeader title={client.societe || 'Sans nom'} subtitle={client.user?.email} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 26 }}>
        <StatCard label="Biens" value={client._count.biens} icon="building" />
        <StatCard label="Widgets générés" value={client._count.widgetPayments} icon="code" />
        <StatCard label="Leads reçus" value={nbLeads} icon="users" />
      </div>

      <div className="cd-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 22, alignItems: 'start' }}>
        <style>{`@media (max-width: 900px){ .cd-grid { grid-template-columns: 1fr !important; } }`}</style>

        {/* Colonne principale */}
        <div>
          {/* Infos */}
          <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 24, marginBottom: 22 }}>
            <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#193B5E', margin: '0 0 14px' }}>Informations</h3>
            {infoRow('Société', client.societe)}
            {infoRow('Contact', client.contactNom)}
            {infoRow('Email', client.user?.email)}
            {infoRow('Téléphone', client.telephone)}
            {infoRow('Adresse', client.adresse)}
            {infoRow('N° TVA', client.numeroTva)}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0' }}>
              <span style={{ fontSize: 13, color: '#8A92A6' }}>Plan</span>
              <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, color: plan.color, background: plan.bg }}>{plan.label}</span>
            </div>
          </div>

          {/* Grille des biens */}
          <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#193B5E', margin: '0 0 16px' }}>
              Biens du portefeuille ({client.biens.length})
            </h3>

            {client.biens.length === 0 ? (
              <div style={{ padding: '30px 0', textAlign: 'center', color: '#A9B0BE', fontSize: 13.5 }}>Aucun bien encodé.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                {client.biens.map((b) => (
                  <div key={b.id} style={{ border: '1px solid #EEF2F7', borderRadius: 12, overflow: 'hidden', background: '#FAFBFE' }}>
                    <div style={{ height: 110, background: '#EEF2F7', position: 'relative' }}>
                      {b.images?.[0] ? (
                        <img src={b.images[0]} alt={b.titre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C2C8D4' }}>
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                        </div>
                      )}
                      {!b.published && (
                        <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(22,50,79,0.85)', color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6 }}>Brouillon</span>
                      )}
                    </div>
                    <div style={{ padding: '12px 13px' }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: '#193B5E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.titre}</div>
                      {b.ville && <div style={{ fontSize: 11.5, color: '#A9B0BE', marginBottom: 6 }}>{b.ville}</div>}
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#7CB8A8' }}>{b.mensualite?.toLocaleString('fr-BE')} €<span style={{ fontSize: 11, color: '#A9B0BE', fontWeight: 500 }}>/mois</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Colonne droite : essai */}
        <EssaiCard client={{ id: client.id, trialEndsAt: client.trialEndsAt, widgetsGratuits: client.widgetsGratuits, subStatus: client.subStatus }} />
      </div>
    </>
  )
}