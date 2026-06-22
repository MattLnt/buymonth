import { prisma } from '@/lib/prisma'
import { calculMensualite } from '@/lib/calcul'
import { Badge } from '@/app/components/widget/Badge'

export const dynamic = 'force-dynamic'

export default async function EmbedBadgePage({ searchParams }) {
  const sp = await searchParams
  const bienId = sp.bien
  const premium = sp.premium === '1'
  const theme = sp.theme === 'dark' ? 'dark' : 'light'
  const couleurPrimaire = sp.primaire ? `#${sp.primaire.replace('#', '')}` : '#16324F'
  const couleurAccent = sp.accent ? `#${sp.accent.replace('#', '')}` : '#7CB8A8'

  let mensualite = null
  let urlClient = null

  if (bienId) {
    const bien = await prisma.bien.findUnique({ where: { id: bienId } })
    if (bien) {
      mensualite = bien.mensualite || calculMensualite(bien.prixTotal)
      urlClient = bien.urlClient
      // incrémente les vues du widget (fire and forget)
      prisma.widget.updateMany({ where: { bienId: bien.id }, data: { vues: { increment: 1 } } }).catch(() => {})
    }
  }

  const content = (
    <Badge
      mensualite={mensualite}
      premium={premium}
      theme={theme}
      couleurPrimaire={couleurPrimaire}
      couleurAccent={couleurAccent}
      width={320}
    />
  )

  return (
    <div style={{ margin: 0, padding: 12, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', background: 'transparent' }}>
      {urlClient ? (
        <a href={urlClient} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  )
}