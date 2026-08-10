import { prisma } from '@/lib/prisma'
import { AdminLeadsExplorer } from '@/app/components/dashboard/AdminLeadsExplorer'

export const dynamic = 'force-dynamic'

export default async function AdminLeadsPage() {
  const leadsRaw = await prisma.lead.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      bien: {
        select: {
          id: true,
          titre: true,
          ville: true,
          projet: true,
          unite: true,
          client: { select: { societe: true } },
        },
      },
    },
  })

  // Aplatissement pour l'explorer (client component)
  const leads = leadsRaw.map((l) => ({
    id: l.id,
    nom: l.nom,
    email: l.email,
    telephone: l.telephone,
    societe: l.societe || null,
    revenu: l.revenu,
    apport: l.apport,
    source: l.source,
    statutAdmin: l.statutAdmin || 'À contacter',
    createdAt: l.createdAt,
    bienId: l.bien?.id || null,
    bienTitre: l.bien?.titre || null,
    bienVille: l.bien?.ville || null,
    projet: l.bien?.projet && l.bien.projet !== 'Hors projet' ? l.bien.projet : null,
    unite: l.bien?.unite || null,
    promoteur: l.bien?.client?.societe || null,
  }))

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 14.5, color: '#5A6275', margin: 0 }}>
          <strong style={{ color: '#193B5E' }}>{leads.length} demande{leads.length > 1 ? 's' : ''}</strong> reçue{leads.length > 1 ? 's' : ''} via la plateforme.
        </p>
      </div>

      <AdminLeadsExplorer leads={leads} />
    </>
  )
}