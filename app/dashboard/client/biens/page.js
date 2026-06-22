import { getCurrentClient } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { PageHeader, EmptyState } from '@/app/components/dashboard/Ui'
import { BienCard } from '@/app/components/dashboard/BienCard'
import { Icon } from '@/app/components/dashboard/Icon'
import Link from 'next/link'

export default async function BiensPage() {
  const { client } = await getCurrentClient()

  const biens = await prisma.bien.findMany({
    where: { clientId: client?.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <PageHeader
        title="Mes biens"
        subtitle={`${biens.length} bien${biens.length > 1 ? 's' : ''} dans votre portefeuille.`}
        action={
          <Link href="/dashboard/client/biens/nouveau" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#193B5E', color: '#fff', padding: '11px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            <Icon name="plus" size={16} /> Ajouter un bien
          </Link>
        }
      />

      {biens.length === 0 ? (
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
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {biens.map((bien) => (
            <BienCard key={bien.id} bien={bien} />
          ))}
        </div>
      )}
    </>
  )
}