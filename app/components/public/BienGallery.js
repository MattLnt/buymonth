'use client'

import { useState } from 'react'

export function BienGallery({ images = [], titre }) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  function openAt(i) { setActive(i); setLightbox(true) }

  if (!images || images.length === 0) {
    return (
      <div style={{ height: 420, borderRadius: 20, background: 'linear-gradient(135deg, #EEF3FA, #E3ECF5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#B7C4D6" strokeWidth="1.3"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
      </div>
    )
  }

  const main = images[0]
  const thumbs = images.slice(1, 5)

  return (
    <>
      <div className="airbnb-gallery" style={{ display: 'grid', gridTemplateColumns: images.length > 1 ? '2fr 1fr 1fr' : '1fr', gridTemplateRows: '1fr 1fr', gap: 8, height: 440, borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
        <style>{`
          @media (max-width: 760px){
            .airbnb-gallery { grid-template-columns: 1fr !important; grid-template-rows: 1fr !important; height: 300px !important; }
            .airbnb-thumb { display: none !important; }
          }
        `}</style>

        {/* Grande image */}
        <div
          onClick={() => openAt(0)}
          style={{ gridRow: '1 / 3', gridColumn: images.length > 1 ? '1 / 2' : '1 / -1', background: `url(${main}) center/cover`, cursor: 'zoom-in' }}
        />

        {/* Mosaïque */}
        {thumbs.map((img, i) => {
          const isLast = i === 3 && images.length > 5
          return (
            <div key={i} className="airbnb-thumb" onClick={() => openAt(i + 1)}
              style={{ background: `url(${img}) center/cover`, cursor: 'zoom-in', position: 'relative' }}>
              {isLast && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(22,50,79,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 700 }}>
                  +{images.length - 5}
                </div>
              )}
            </div>
          )
        })}

        {/* bouton "voir toutes les photos" */}
        <button onClick={() => openAt(0)} style={{ position: 'absolute', bottom: 16, right: 16, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.95)', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#193B5E', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
          {images.length} photo{images.length > 1 ? 's' : ''}
        </button>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(false)} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,36,56,0.94)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <button onClick={() => setLightbox(false)} style={{ position: 'absolute', top: 24, right: 24, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>

          {images.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); setActive((active - 1 + images.length) % images.length) }} style={{ position: 'absolute', left: 24, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
          )}

          <img src={images[active]} alt={titre} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '90%', maxHeight: '88%', borderRadius: 12, objectFit: 'contain' }} />

          {images.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); setActive((active + 1) % images.length) }} style={{ position: 'absolute', right: 24, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          )}

          <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
            {active + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}