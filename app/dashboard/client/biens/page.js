import { getCurrentClient } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { EmptyState } from '@/app/components/dashboard/Ui'
import { MesBiensExplorer } from '@/app/components/dashboard/MesBiensExplorer'
import { Icon } from '@/app/components/dashboard/Icon'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function BiensPage() {
  const client = await getCurrentClient()

  const biensRaw = await prisma.bien.findMany({
    where: { clientId: client.id },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { leads: true } } },
  })

  // On aplatit le _count en nbLeads pour la card
  const biens = biensRaw.map((b) => ({ ...b, nbLeads: b._count?.leads || 0 }))

  return (
    <>
      {/* En-tête + bouton ajouter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: 14.5, color: '#5A6275', margin: 0 }}>
            <strong style={{ color: '#193B5E' }}>{biens.length} bien{biens.length > 1 ? 's' : ''}</strong> dans votre portefeuille.
          </p>
        </div>
        <Link href="/dashboard/client/biens/nouveau" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#193B5E', color: '#fff', padding: '11px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
          <Icon name="plus" size={16} /> Ajouter un bien
        </Link>
      </div>

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
        <MesBiensExplorer biens={biens} />
      )}
    </>
  )
}