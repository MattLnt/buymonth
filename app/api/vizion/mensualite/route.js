import { postMensualite, optionsMensualite, getMensualite } from '@/lib/vizionApi'

/*
 * POST /api/vizion/mensualite — route historique (clés en français), conservée pour compatibilité.
 * La route officielle du brief Vizion est /api/calculate-monthly. Même handler : lib/vizionApi.js.
 */
export async function POST(req) {
  return postMensualite(req, 'fr')
}

export async function OPTIONS(req) {
  return optionsMensualite(req)
}

export async function GET(req) {
  return getMensualite(req)
}
