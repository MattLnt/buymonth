'use client'

import { calculMensualite } from '@/lib/calcul'

export function FormRecap({ form, photos = [], loading, isFormValid, mode, onDelete, deleting }) {
  const prix = parseInt(form.prixTotal, 10)
  const mensualite = prix > 0 ? calculMensualite(prix) : null

  const rows = [
    { label: 'Titre', value: form.titre },
    { label: 'Prix total', value: prix > 0 ? `${prix.toLocaleString('fr-BE')} €` : null },
    { label: 'Type', value: form.type },
    { label: 'Province', value: form.province },
    { label: 'Ville', value: form.ville },
    { label: 'Chambres', value: form.chambres },
    { label: 'Surface', value: form.surface ? `${form.surface} m²` : null },
    { label: 'Photos', value: photos.length || '0', always: true },
  ]

  return (
    <div style={{ position: 'sticky', top: 24 }}>
      {/* Badge preview mensualité */}
      <div style={{ background: 'linear-gradient(150deg, #16324F 0%, #1D4267 100%)', borderRadius: 16, padding: '22px 22px', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,184,168,0.22) 0%, transparent 65%)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Aperçu du badge</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Propriétaire de ce bien dès</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#7CB8A8', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {mensualite ? `${mensualite} €` : '— €'}<span style={{ fontSize: 15 }}>/mois</span>
          </div>
        </div>
      </div>

      {/* Récap */}
      <div style={{ background: '#fff', border: '1px solid #EEF2F7', borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#193B5E', margin: '0 0 14px' }}>Récapitulatif</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {rows.map((r) => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: '1px solid #F2F5FA' }}>
              <span style={{ fontSize: 13, color: '#8A92A6' }}>{r.label}</span>
              {r.value ? (
                <span style={{ fontSize: 13, fontWeight: 600, color: '#193B5E', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}>{r.value}</span>
              ) : (
                <span style={{ fontSize: 18, color: '#D8DFE9', lineHeight: 1 }}>—</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <div style={{ display: 'flex', gap: 10, background: 'rgba(124,184,168,0.08)', border: '1px solid rgba(124,184,168,0.2)', borderRadius: 12, padding: '12px 14px', marginBottom: 16 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7CB8A8" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
        <p style={{ fontSize: 12, color: '#5A6B7D', margin: 0, lineHeight: 1.5 }}>
          La mensualité est calculée automatiquement (apport 10 %, 25 ans, TAEG 3,45 %).
        </p>
      </div>

      {/* Submit desktop */}
      <button
        type="submit"
        disabled={loading || !isFormValid}
        style={{
          width: '100%', padding: 13, borderRadius: 10,
          background: !isFormValid || loading ? '#E5E9F0' : '#193B5E',
          color: !isFormValid || loading ? '#9AA2B4' : '#fff',
          fontWeight: 600, fontSize: 14, border: 'none',
          cursor: !isFormValid || loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
      >
        {loading ? 'Enregistrement...' : mode === 'edit' ? 'Enregistrer →' : 'Créer le bien →'}
      </button>

      {/* Supprimer (édition) */}
      {mode === 'edit' && (
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          style={{ width: '100%', padding: 11, borderRadius: 10, background: 'transparent', color: '#E5484D', fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer', marginTop: 8 }}
        >
          {deleting ? 'Suppression...' : 'Supprimer ce bien'}
        </button>
      )}
    </div>
  )
}