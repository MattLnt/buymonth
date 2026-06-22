'use client'

import { useState, useEffect } from 'react'
import { Simulateur } from './Simulateur'

export function SimulateurModal({ bien, label = 'Recevoir une offre personnalisée' }) {
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // largeur modale : large en étape 2 (2 colonnes), normale en étape 1
  const maxW = step === 2 ? 760 : 460

  return (
    <>
      <button
        onClick={() => { setOpen(true); setStep(1) }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 11,
          width: '100%', padding: '17px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #1D4267 0%, #16324F 100%)',
          color: '#fff', fontSize: 15.5, fontWeight: 700, letterSpacing: '-0.01em',
          boxShadow: hover ? '0 16px 36px rgba(22,50,79,0.4)' : '0 8px 22px rgba(22,50,79,0.25)',
          transform: hover ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease',
          overflow: 'hidden',
        }}
      >
        <span style={{
          position: 'absolute', top: 0, left: hover ? '120%' : '-60%', width: '50%', height: '100%',
          background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.18), transparent)',
          transition: 'left 0.6s ease', pointerEvents: 'none',
        }} />
        <span style={{ display: 'flex', width: 30, height: 30, borderRadius: 9, background: 'rgba(124,184,168,0.18)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#7CB8A8" stroke="#7CB8A8" strokeWidth="1.5" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </span>
        <span style={{ position: 'relative' }}>{label}</span>
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(15,36,56,0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', overflowY: 'auto' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: maxW, position: 'relative', boxShadow: '0 24px 70px rgba(0,0,0,0.3)', transition: 'max-width 0.25s ease', margin: 'auto' }}
          >
            <button
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', top: 18, right: 18, width: 36, height: 36, borderRadius: '50%', background: '#F2F5FA', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5A6275', zIndex: 1 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>

            <div style={{ marginBottom: 24, paddingRight: 32 }}>
              <h2 style={{ fontSize: 21, fontWeight: 700, color: '#193B5E', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Votre capacité d'emprunt</h2>
              <p style={{ fontSize: 13.5, color: '#8A92A6', margin: 0 }}>
                {bien?.titre ? `Pour « ${bien.titre} »` : 'Simulation gratuite et sans engagement'}
              </p>
            </div>

            <Simulateur bien={bien} onStepChange={setStep} />
          </div>
        </div>
      )}
    </>
  )
}