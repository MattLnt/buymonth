import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageHeader, StatCard } from '@/app/components/dashboard/Ui'
import { EssaiCard } from './EssaiCard'
import { ClientEditForm } from './ClientEditForm'

export const dynamic = 'force-dynamic'

export default async function AdminClientDetailPage({ params }) {
  const { id } = await params

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      user: { select: { email: true } },
      biens: { orderBy: { createdAt: 'desc' } },
      _count: { select: { biens: true } },
    },
  })

  if (!client) notFound()

  const nbLeads = await prisma.lead.count({ where: { bien: { clientId: client.id }, deletedAt: null } })
  const nbBiensActifs = client.biens.filter((b) => b.statut === 'ACTIF' || b.statut === 'OPTION').length

  // Données passées au formulaire d'édition
  const editable = {
    id: client.id,
    societe: client.societe,
    email: client.user?.email,
    contactNom: client.contactNom,
    contactOpe: client.contactOpe,
    contactFacturation: client.contactFacturation,
    telephone: client.telephone,
    numeroTva: client.numeroTva,
    adresse: client.adresse,
    adresseAdmin: client.adresseAdmin,
    formule: client.formule,
  }

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
        <StatCard label="Biens facturés" value={nbBiensActifs} icon="building" />
        <StatCard label="Biens (total)" value={client._count.biens} icon="building" />
        <StatCard label="Leads reçus" value={nbLeads} icon="users" />
      </div>

      <div className="cd-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 22, alignItems: 'start' }}>
        <style>{`@media (max-width: 900px){ .cd-grid { grid-template-columns: 1fr !important; } }`}</style>

        {/* Colonne principale */}
        <div>
          {/* Formulaire d'édition (remplace le bloc lecture seule) */}
          <ClientEditForm client={editable} />

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
                      {(b.statut === 'HORS_LIGNE' || b.statut === 'VENDU') && (
                        <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(22,50,79,0.85)', color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6 }}>
                          {b.statut === 'VENDU' ? 'Vendu' : 'Hors-ligne'}
                        </span>
                      )}
                      {b.statut === 'OPTION' && (
                        <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(232,153,35,0.92)', color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6 }}>Option</span>
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