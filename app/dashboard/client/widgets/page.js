import { getCurrentClient } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { PageHeader, EmptyState } from '@/app/components/dashboard/Ui'
import { WidgetGenerator } from '@/app/components/widget/WidgetGenerator'
import { Icon } from '@/app/components/dashboard/Icon'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function WidgetsPage() {
  const client = await getCurrentClient()

  const biens = await prisma.bien.findMany({
    where: { clientId: client.id },
    orderBy: { createdAt: 'desc' },
    select: { id: true, titre: true, mensualite: true, prixTotal: true, ville: true, urlClient: true },
  })

  return (
    <>
      <PageHeader title="Mes widgets" subtitle="Générez le badge mensualité à intégrer sur votre site." />

      {biens.length === 0 ? (
        <EmptyState
          icon="code"
          title="Aucun bien à afficher"
          text="Ajoutez d'abord un bien pour générer son widget mensualité."
          action={
            <Link href="/dashboard/client/biens/nouveau" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#193B5E', color: '#fff', padding: '11px 22px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              <Icon name="plus" size={16} /> Ajouter un bien
            </Link>
          }
        />
      ) : (
        <WidgetGenerator biens={biens} plan={client.plan || 'CLASSIC'} />
      )}
    </>
  )
}