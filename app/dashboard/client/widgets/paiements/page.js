import { getCurrentClient } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { PageHeader, Card, StatCard } from '@/app/components/dashboard/Ui'
import { getT } from '@/lib/i18n/server'
import { locale } from '@/lib/i18n/config'

export const dynamic = 'force-dynamic'

export default async function PaiementsWidgetsPage() {
  const client = await getCurrentClient()
  const { lang, t } = await getT()

  const paiements = await prisma.widgetPayment.findMany({
    where: { clientId: client.id },
    orderBy: { createdAt: 'desc' },
  })

  // Récupère les titres des biens concernés
  const bienIds = [...new Set(paiements.map((p) => p.bienId).filter(Boolean))]
  const biens = bienIds.length
    ? await prisma.bien.findMany({ where: { id: { in: bienIds } }, select: { id: true, titre: true, ville: true } })
    : []
  const bienMap = Object.fromEntries(biens.map((b) => [b.id, b]))

  const total = paiements.reduce((sum, p) => sum + (p.montant || 0), 0)

  return (
    <>
      <PageHeader title={t('Historique des paiements', 'Betalingsgeschiedenis')} subtitle={t('Tous vos paiements de génération de widgets.', 'Al uw betalingen voor het genereren van widgets.')} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label={t('Widgets payés', 'Betaalde widgets')} value={paiements.length} icon="code" />
        <StatCard label={t('Total dépensé', 'Totaal uitgegeven')} value={`${total.toLocaleString(locale(lang))} €`} icon="card" />
      </div>

      {paiements.length === 0 ? (
        <Card>
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#193B5E', margin: '0 0 6px' }}>{t("Aucun paiement pour l'instant", 'Nog geen betalingen')}</p>
            <p style={{ fontSize: 13.5, color: '#8A92A6', margin: 0 }}>{t('Vos paiements de génération de widgets apparaîtront ici.', 'Uw betalingen voor het genereren van widgets verschijnen hier.')}</p>
          </div>
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead>
                <tr style={{ background: '#FAFBFE', borderBottom: '1px solid #EEF2F7' }}>
                  {[t('Bien', 'Pand'), t('Montant', 'Bedrag'), t('Statut', 'Status'), t('Date', 'Datum')].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '13px 18px', fontSize: 11.5, fontWeight: 700, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paiements.map((p) => {
                  const bien = p.bienId ? bienMap[p.bienId] : null
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #F4F7FB' }}>
                      <td style={{ padding: '14px 18px' }}>
                        {bien ? (
                          <>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#193B5E' }}>{bien.titre}</div>
                            {bien.ville && <div style={{ fontSize: 12, color: '#A9B0BE' }}>{bien.ville}</div>}
                          </>
                        ) : <span style={{ fontSize: 13, color: '#C2C8D4' }}>{t('Bien supprimé', 'Pand verwijderd')}</span>}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 14, fontWeight: 700, color: '#193B5E' }}>{p.montant.toLocaleString(locale(lang))} €</td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, color: '#249E7C', background: 'rgba(36,158,124,0.12)' }}>{t('Payé', 'Betaald')}</span>
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 12.5, color: '#A9B0BE', whiteSpace: 'nowrap' }}>
                        {new Date(p.createdAt).toLocaleDateString(locale(lang), { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  )
}