import { getCurrentClient } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { PageHeader, EmptyState } from '@/app/components/dashboard/Ui'
import { WidgetGenerator } from '@/app/components/widget/WidgetGenerator'
import { Icon } from '@/app/components/dashboard/Icon'
import Link from 'next/link'
import { getConfigMensualite } from '@/lib/settings'
import { getT } from '@/lib/i18n/server'

export const dynamic = 'force-dynamic'

export default async function WidgetsPage() {
  const client = await getCurrentClient()
  const { t } = await getT()
  const cfg = await getConfigMensualite()

  const biens = await prisma.bien.findMany({
    where: { clientId: client.id },
    orderBy: { createdAt: 'desc' },
    select: { id: true, titre: true, mensualite: true, prixTotal: true, ville: true, urlClient: true },
  })

  return (
    <>
      <PageHeader title={t('Mes widgets', 'Mijn widgets')} subtitle={t('Générez le badge mensualité à intégrer sur votre site.', 'Genereer de maandbedrag-badge om op uw website te plaatsen.')} />

      {biens.length === 0 ? (
        <EmptyState
          icon="code"
          title={t('Aucun bien à afficher', 'Geen panden om te tonen')}
          text={t("Ajoutez d'abord un bien pour générer son widget mensualité.", 'Voeg eerst een pand toe om de maandbedrag-widget ervan te genereren.')}
          action={
            <Link href="/dashboard/client/biens/nouveau" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#193B5E', color: '#fff', padding: '11px 22px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              <Icon name="plus" size={16} /> {t('Ajouter un bien', 'Een pand toevoegen')}
            </Link>
          }
        />
      ) : (
        <WidgetGenerator biens={biens} plan={client.formule} cfg={cfg} />
      )}
    </>
  )
}