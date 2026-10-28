/*
 * Faux configurateur de type Vizion — banc de test de l'intégration BuyMonth.
 * Maquette interne, aucun lien avec la société Vizion.
 *
 * Rejoue les deux bouts de l'intégration :
 *   1. le configurateur appelle POST /api/calculate-monthly pour afficher la mensualité
 *   2. le bouton de fin de parcours renvoie vers /simulateur avec la config en paramètres
 *
 * La clé API reste côté serveur (montage recommandé à Vizion) : le navigateur
 * n'appelle que ce serveur-ci, jamais BuyMonth directement.
 *
 *   node serveur.js            → http://localhost:4000, cible http://localhost:3123
 *   BUYMONTH=https://buymonth.be node serveur.js
 */
const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = Number(process.env.PORT || 4000)
const BUYMONTH = (process.env.BUYMONTH || 'http://localhost:3123').replace(/\/$/, '')
const PROJET = path.resolve(__dirname, '..', '..')  // racine du projet BuyMonth

// Clé lue dans le .env.local du projet : jamais écrite dans la page
function lireCle() {
  if (process.env.VIZION_API_KEY) return process.env.VIZION_API_KEY
  for (const f of ['.env.local', '.env']) {
    const p = path.join(PROJET, f)
    if (!fs.existsSync(p)) continue
    for (const ln of fs.readFileSync(p, 'utf-8').split('\n')) {
      const m = ln.match(/^\s*VIZION_API_KEY\s*=\s*"?([^"\r\n]+)"?\s*$/)
      if (m) return m[1].split(',')[0].trim()
    }
  }
  return null
}
const CLE = lireCle()

const page = fs.readFileSync(path.join(__dirname, 'page.html'), 'utf-8')

const serveur = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)

  // Étape 1 : le configurateur demande la mensualité correspondant au prix courant
  if (url.pathname === '/api/mensualite') {
    const corps = {
      price: Number(url.searchParams.get('prix')),
      regime: url.searchParams.get('regime') || undefined,
      // Meme duree qu'au simulateur, pour que les deux affichent le meme montant
      duration: url.searchParams.get('duree') ? Number(url.searchParams.get('duree')) : undefined,
    }
    try {
      const r = await fetch(`${BUYMONTH}/api/calculate-monthly`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': CLE || '' },
        body: JSON.stringify(corps),
      })
      const data = await r.json()
      res.writeHead(r.status, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ ...data, _http: r.status }))
    } catch (e) {
      res.writeHead(502, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ error: `BuyMonth injoignable : ${e.message}` }))
    }
  }

  // Expose la configuration du banc de test à la page
  if (url.pathname === '/api/contexte') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ buymonth: BUYMONTH, cleChargee: Boolean(CLE) }))
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(page)
})

serveur.listen(PORT, () => {
  console.log(`Faux configurateur  : http://localhost:${PORT}`)
  console.log(`Cible BuyMonth      : ${BUYMONTH}`)
  console.log(`Clé API             : ${CLE ? 'chargée depuis .env.local' : 'ABSENTE — les appels renverront 401'}`)
})
