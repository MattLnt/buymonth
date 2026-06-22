import { PageHeader } from '@/app/components/dashboard/Ui'
import { BienForm } from '@/app/components/dashboard/BienForm'

export default function NouveauBienPage() {
  return (
    <>
      <PageHeader title="Nouveau bien" subtitle="Encodez votre bien, la mensualité est calculée automatiquement." />
      <BienForm mode="create" />
    </>
  )
}