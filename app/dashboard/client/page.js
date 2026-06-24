import { getCurrentClient } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { PageHeader, StatCard, EmptyState } from '@/app/components/dashboard/Ui'
import { Icon } from '@/app/components/dashboard/Icon'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ClientDashboard() {
  const client = await getCurrentClient()

  const [nbBiens, nbLeads, nbWidgets] = await Promise.all([
    prisma.bien.count({ where: { clientId: client.id } }),
    prisma.lead.count({ where: { bien: { clientId: client.id } } }),
    prisma.widgetPayment.count({ where: { clientId: client.id } }),
  ])

  return (
    <>
      <PageHeader
        title={`Bonjour, ${client.contactNom || client.societe || ''}`}
        subtitle="Voici l'activité de votre portefeuille."
        action={
          <Link href="/dashboard/client/biens/nouveau" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#193B5E', color: '#fff', padding: '11px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            <Icon name="plus" size={16} /> Ajouter un bien
          </Link>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Biens actifs" value={nbBiens} icon="building" />
        <StatCard label="Leads reçus" value={nbLeads} icon="users" />
        <StatCard label="Widgets payés" value={nbWidgets} icon="code" />
      </div>

      {nbBiens === 0 && (
        <EmptyState
          icon="building"
          title="Aucun bien pour l'instant"
          text="Ajoutez votre premier bien pour générer son badge mensualité et commencer à recevoir des leads."
          action={
            <Link href="/dashboard/client/biens/nouveau" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#193B5E', color: '#fff', padding: '11px 22px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              <Icon name="plus" size={16} /> Ajouter un bien
            </Link>
          }
        />
      )}
    </>
  )
}