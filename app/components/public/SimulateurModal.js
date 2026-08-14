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

  useEffect(() => {
    function ouvrirSiHash() {
      if (window.location.hash === '#simuler') {
        setStep(1)
        setOpen(true)
      }
    }
    ouvrirSiHash()
    window.addEventListener('hashchange', ouvrirSiHash)
    return () => window.removeEventListener('hashchange', ouvrirSiHash)
  }, [])

  const maxW = step === 1 ? 880 : 560

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
          className="sim-modal-overlay"
          style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(15,36,56,0.65)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center' }}
        >
          <style>{`
            .sim-modal-overlay { padding: 24px; align-items: center; }
            .sim-modal-card { max-height: calc(100vh - 48px); }
            @media (max-width: 720px){
              .sim-modal-overlay { padding: 85px 12px 20px 12px; align-items: flex-start; }
              .sim-modal-card { max-height: calc(100vh - 105px); }
            }
          `}</style>
          <div
            onClick={(e) => e.stopPropagation()}
            className="sim-modal-card"
            style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: maxW, overflowY: 'auto', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', transition: 'max-width 0.25s ease' }}
          >
            <button
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', background: '#F2F5FA', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5A6275', zIndex: 20 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>

            <Simulateur bien={bien} onStepChange={setStep} />
          </div>
        </div>
      )}
    </>
  )
}