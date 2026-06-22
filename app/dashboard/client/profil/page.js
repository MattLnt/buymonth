import { getCurrentClient } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/app/components/dashboard/Ui'
import { ProfilForm } from './ProfilForm'

export const dynamic = 'force-dynamic'

export default async function ClientProfilPage() {
  const client = await getCurrentClient()
  const full = await prisma.client.findUnique({
    where: { id: client.id },
    include: { user: { select: { email: true } } },
  })

  return (
    <>
      <PageHeader title="Profil" subtitle="Vos informations société, affichées sur vos biens." />
      <ProfilForm
        initial={{
          societe: full.societe,
          contactNom: full.contactNom,
          telephone: full.telephone,
          adresse: full.adresse,
          numeroTva: full.numeroTva,
          logoUrl: full.logoUrl,
        }}
        email={full.user?.email || ''}
      />
    </>
  )
}