'use client'

import { useRef } from 'react'

export function PhotoUploader({ photos, setPhotos, uploading, setUploading, setError, max = 10 }) {
  const inputRef = useRef(null)

  async function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    if (photos.length + files.length > max) {
      setError?.(`Maximum ${max} photos.`)
      return
    }

    setUploading(true)
    setError?.('')

    try {
      const uploaded = []
      for (const file of files) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (res.ok && data.url) uploaded.push(data.url)
        else throw new Error(data.error || 'Upload échoué')
      }
      setPhotos([...photos, ...uploaded])
    } catch (err) {
      setError?.(err.message || 'Erreur lors de l\'upload.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function removePhoto(idx) {
    setPhotos(photos.filter((_, i) => i !== idx))
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: 'none' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 12 }}>
        {photos.map((url, idx) => (
          <div key={idx} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden', border: '1px solid #EEF2F7', background: `url(${url}) center/cover` }}>
            {idx === 0 && (
              <span style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(124,184,168,0.95)', color: '#16324F', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>
                Principale
              </span>
            )}
            <button type="button" onClick={() => removePhoto(idx)} style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: 'rgba(20,20,20,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        ))}

        {photos.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            style={{
              aspectRatio: '4/3', borderRadius: 12, border: '1.5px dashed #C8D4E2',
              background: '#FAFDFD', cursor: uploading ? 'wait' : 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#7CB8A8',
            }}
          >
            {uploading ? (
              <span style={{ fontSize: 12, color: '#8A92A6', fontWeight: 600 }}>Envoi...</span>
            ) : (
              <>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                <span style={{ fontSize: 12, color: '#5A6B7D', fontWeight: 600 }}>Ajouter</span>
              </>
            )}
          </button>
        )}
      </div>

      <p style={{ fontSize: 12, color: '#A9B0BE', margin: '12px 0 0' }}>
        {photos.length}/{max} photos · La première est l'image principale du bien.
      </p>
    </div>
  )
}