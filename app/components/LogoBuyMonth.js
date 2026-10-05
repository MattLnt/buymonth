/*
 * Logo BuyMonth — entièrement vectoriel.
 *
 * L'ancien fichier /logo-buymonth.svg n'était pas un vrai SVG : il contenait deux
 * images PNG de 753 px encapsulées dans un masque. D'où les deux défauts signalés
 * dans le dossier du 05/10/2026 — le flou sur mobile (image bitmap agrandie) et le
 * carré noir sur les pages légales (le masque combiné au filtre brightness/invert
 * du pied de page). Ici la maison est dessinée en courbes et le mot est du texte
 * en Montserrat, la police déjà chargée par le site : net à toutes les tailles,
 * et la version blanche est une simple couleur, sans filtre.
 *
 * `height` est la hauteur réelle du logo (maison + mot). L'ancien <img> portait sur
 * une image carrée dont le logo n'occupait que 52 % de la hauteur : un height de 28
 * dans l'en-tête ne donnait qu'un logo de 15 px, d'où l'impression de flou.
 */

// Proportions relevées sur le logo d'origine (canevas carré de 844 px)
const ICONE_L = 287
const ICONE_H = 296
const MOT_H = 112
const ECART = 30
const CONTENU_H = ICONE_H + ECART + MOT_H // 438

const NAVY = '#193B5E'
const VERT_CLAIR = '#D1E2DA'
const VERT_MOYEN = '#9DC9B3'
const VERT_FONCE = '#749D89'
const SAGE = '#88B49E'

// Colonnes et lignes de la grille, dans le repère de l'icône
const COLONNES = [41, 96, 151, 206]
const LIGNES = [
  { y: 111, couleur: VERT_CLAIR },
  { y: 164, couleur: VERT_MOYEN },
  { y: 217, couleur: VERT_FONCE },
]

// Contour de la maison : tracé ouvert, le bas s'arrête avant le mur droit
const MAISON =
  'M281 259 L281 114.7 Q281 96.7 264.7 85.2 L158.8 17.5 Q142.5 6 126.2 17.7 ' +
  'L22.8 85.6 Q6.5 97.3 6.5 115.3 L6.5 273.5 Q6.5 291.5 24.5 291.5 L200 291.5'

export default function LogoBuyMonth({ height = 62, blanc = false, title = 'BuyMonth' }) {
  const echelle = height / CONTENU_H
  const contenu = height
  const icone = { l: ICONE_L * echelle, h: ICONE_H * echelle }
  const ecart = ECART * echelle
  // Montserrat : hauteur de capitale + jambage du « y » ≈ 0,90 cadratin
  const taillePolice = (MOT_H * echelle) / 0.9

  const couleurBuy = blanc ? '#FFFFFF' : NAVY
  const couleurMonth = blanc ? 'rgba(255,255,255,0.75)' : SAGE
  const traitMaison = blanc ? '#FFFFFF' : NAVY

  return (
    <span
      role="img"
      aria-label={title}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: contenu,
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      <svg
        width={icone.l}
        height={icone.h}
        viewBox="0 0 288 297"
        fill="none"
        aria-hidden="true"
        style={{ display: 'block' }}
      >
        {LIGNES.map((ligne) =>
          COLONNES.map((x, i) => {
            const dernierNavy = ligne.y === 217 && i === 3
            return (
              <rect
                key={`${ligne.y}-${x}`}
                x={x}
                y={ligne.y}
                width="41"
                height="42"
                rx="6"
                fill={dernierNavy ? (blanc ? '#FFFFFF' : NAVY) : ligne.couleur}
                opacity={blanc ? 0.9 : 1}
              />
            )
          })
        )}
        <path
          d={MAISON}
          stroke={traitMaison}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span
        style={{
          marginTop: ecart,
          fontFamily: 'var(--font-montserrat), Montserrat, system-ui, sans-serif',
          fontWeight: 500,
          fontSize: taillePolice,
          letterSpacing: '-0.005em',
          whiteSpace: 'nowrap',
          display: 'block',
        }}
      >
        <span style={{ color: couleurBuy }}>Buy</span>
        <span style={{ color: couleurMonth }}>Month</span>
      </span>
    </span>
  )
}
