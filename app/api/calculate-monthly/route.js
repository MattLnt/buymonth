import { postMensualite, optionsMensualite, getMensualite } from '@/lib/vizionApi'

/*
 * POST /api/calculate-monthly — route du brief Vizion (docs/Specification_API_Buymonth.pdf)
 *   entrée  : { "price": 315000 }            (+ "regime" optionnel)
 *   sortie  : { "monthlyPrice", "totalPrice", "duration", "rate", … }
 *   en-tête : x-api-key
 */
export async function POST(req) {
  return postMensualite(req, 'brief')
}

export async function OPTIONS(req) {
  return optionsMensualite(req)
}

export async function GET(req) {
  return getMensualite(req)
}
