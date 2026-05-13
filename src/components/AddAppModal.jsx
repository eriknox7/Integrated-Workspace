import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Image } from 'lucide-react'
import { CATEGORIES } from '../data/defaults'

export default function AddAppModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ name: '', url: '', icon: '', cat: 'Developer', fav: false })
  const [iconError, setIconError] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function submit() {
    if (!form.name.trim() || !form.url.trim()) return
    const url = form.url.startsWith('http') ? form.url : 'https://' + form.url
    onAdd({ ...form, url, id: Date.now() })
    onClose()
  }

  const hasIcon = form.icon.trim().length > 0 && !iconError

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className="modal-box"
        initial={{ opacity: 0, y: -20, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--t0)', letterSpacing: '-0.02em' }}>Add App</h3>
          <button onClick={onClose} style={{ color: 'var(--t2)', padding: 4, borderRadius: 6, transition: 'color .12s' }}
            onMouseEnter={e => e.target.style.color = 'var(--t0)'} onMouseLeave={e => e.target.style.color = 'var(--t2)'}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--t2)', display: 'block', marginBottom: 5, fontWeight: 500 }}>App name</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="e.g. Notion" className="input-base" style={{ width: '100%' }} />
          </div>

          {/* Icon URL */}
          <div>
            <label style={{ fontSize: 11, color: 'var(--t2)', display: 'block', marginBottom: 5, fontWeight: 500 }}>
              Icon image URL <span style={{ color: 'var(--t3)', fontWeight: 400 }}>(optional)</span>
            </label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{
                width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                background: 'var(--bg-3)', border: '1px solid var(--b1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
              }}>
                {hasIcon
                  ? <img src={form.icon} alt="" onError={() => setIconError(true)} onLoad={() => setIconError(false)}
                    style={{ width: 26, height: 26, objectFit: 'contain' }} />
                  : <Image size={16} color="var(--t3)" />
                }
              </div>
              <input value={form.icon} onChange={e => { set('icon', e.target.value); setIconError(false) }}
                placeholder="https://example.com/icon.png"
                className="input-base" style={{ flex: 1 }} />
            </div>
            {iconError && (
              <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 4 }}>Couldn't load that image — double-check the URL.</p>
            )}
            <p style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>
              Tip: right-click any site's favicon → "Copy image address"
            </p>
          </div>

          <div>
            <label style={{ fontSize: 11, color: 'var(--t2)', display: 'block', marginBottom: 5, fontWeight: 500 }}>URL</label>
            <input value={form.url} onChange={e => set('url', e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="notion.so or https://notion.so" className="input-base" style={{ width: '100%' }} />
          </div>

          <div>
            <label style={{ fontSize: 11, color: 'var(--t2)', display: 'block', marginBottom: 5, fontWeight: 500 }}>Category</label>
            <select value={form.cat} onChange={e => set('cat', e.target.value)} style={{ width: '100%', padding: '9px 12px' }}>
              {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--t1)', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.fav} onChange={e => set('fav', e.target.checked)} />
            Mark as favourite
          </label>

          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: .97 }} onClick={submit}
              style={{ flex: 1, padding: '10px', borderRadius: 'var(--r)', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600 }}>
              Add App
            </motion.button>
            <button onClick={onClose}
              style={{
                padding: '10px 16px', borderRadius: 'var(--r)', background: 'var(--bg-4)',
                border: '1px solid var(--b1)', color: 'var(--t2)', fontSize: 13
              }}>
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}