import { PageHeader } from '@/app/components/dashboard/Ui'
import { getSettings } from '@/lib/settings'
import { ParametresForm } from './ParametresForm'

export const dynamic = 'force-dynamic'

export default async function AdminParametresPage() {
  const settings = await getSettings()

  return (
    <>
      <PageHeader title="Paramètres" subtitle="Réglages de calcul et destinataires des leads." />
      <ParametresForm
        initial={{
          apportPct: settings.apportPct,
          tauxAnnuel: settings.tauxAnnuel,
          dureeMois: settings.dureeMois,
          leadEmails: settings.leadEmails || [],
        }}
      />
    </>
  )
}