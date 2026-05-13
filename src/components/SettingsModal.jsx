import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Check, Pencil } from 'lucide-react'
import { ACCENTS } from '../data/defaults'

export default function SettingsModal({ accent, setAccent, onClose, onReset }) {
  const [name, setName] = useState(localStorage.getItem('username') || '')
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(name)

  function saveName() {
    const trimmed = nameInput.trim()
    if (trimmed) {
      localStorage.setItem('username', trimmed)
      setName(trimmed)
    }
    setEditingName(false)
  }

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className="modal-box"
        initial={{ opacity: 0, y: -20, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--t0)', letterSpacing: '-0.02em' }}>Settings</h3>
          <button onClick={onClose} style={{ color: 'var(--t2)', padding: 4, borderRadius: 6, transition: 'color .12s' }}
            onMouseEnter={e => e.target.style.color = 'var(--t0)'} onMouseLeave={e => e.target.style.color = 'var(--t2)'}>
            <X size={16} />
          </button>
        </div>

        {/* Name */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, color: 'var(--t2)', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12 }}>Your name</p>
          {editingName ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                autoFocus
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false) }}
                placeholder="Enter your name"
                className="input-base"
                style={{ flex: 1 }}
              />
              <button onClick={saveName}
                style={{
                  width: 34, height: 34, borderRadius: 'var(--r)', background: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer'
                }}>
                <Check size={15} color="#fff" />
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--bg-3)', border: '1px solid var(--b0)', borderRadius: 'var(--r)', padding: '10px 12px'
            }}>
              <span style={{ fontSize: 14, color: name ? 'var(--t0)' : 'var(--t3)' }}>
                {name || 'Not set'}
              </span>
              <button onClick={() => { setNameInput(name); setEditingName(true) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--t2)',
                  padding: '4px 8px', borderRadius: 6, background: 'var(--bg-4)', border: '1px solid var(--b1)', cursor: 'pointer'
                }}>
                <Pencil size={12} /> Edit
              </button>
            </div>
          )}
        </div>

        {/* Accent */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, color: 'var(--t2)', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12 }}>Accent color</p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {ACCENTS.map(a => (
              <button key={a.name} onClick={() => setAccent(a)} title={a.name}
                style={{
                  width: 28, height: 28, borderRadius: '50%', background: a.val, cursor: 'pointer',
                  border: accent.name === a.name ? `2px solid var(--t0)` : '2px solid transparent',
                  outline: accent.name === a.name ? `2px solid ${a.val}` : 'none',
                  outlineOffset: 2, transition: 'all .15s',
                  transform: accent.name === a.name ? 'scale(1.15)' : 'scale(1)'
                }}>
              </button>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--t2)', marginTop: 8 }}>Current: {accent.name}</p>
        </div>

        {/* Shortcuts ref */}
        <div style={{ marginBottom: 28, background: 'var(--bg-3)', borderRadius: 'var(--r)', padding: '14px 16px', border: '1px solid var(--b0)' }}>
          <p style={{ fontSize: 11, color: 'var(--t2)', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12 }}>Search shortcuts</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[['yt query', 'YouTube'], ['lc query', 'LeetCode'], ['gh query', 'GitHub'], ['gpt query', 'ChatGPT'], ['mdn query', 'MDN'], ['npm query', 'npm']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                <code style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono,monospace', fontSize: 11 }}>{k}</code>
                <span style={{ color: 'var(--t2)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Keyboard */}
        <div style={{ marginBottom: 28, background: 'var(--bg-3)', borderRadius: 'var(--r)', padding: '14px 16px', border: '1px solid var(--b0)' }}>
          <p style={{ fontSize: 11, color: 'var(--t2)', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12 }}>Keyboard shortcuts</p>
          {[['⌘K', 'Open search'], ['Esc', 'Close modals']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <kbd style={{ background: 'var(--bg-4)', border: '1px solid var(--b1)', borderRadius: 5, padding: '2px 7px', fontSize: 11, fontFamily: 'monospace', color: 'var(--t1)' }}>{k}</kbd>
              <span style={{ color: 'var(--t2)' }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Reset */}
        <button onClick={() => { if (window.confirm('Reset all data? This cannot be undone.')) onReset() }}
          style={{
            width: '100%', padding: '10px', borderRadius: 'var(--r)', background: 'var(--red-dim)',
            border: '1px solid rgba(224,92,92,.2)', color: 'var(--red)', fontSize: 13, fontWeight: 500, cursor: 'pointer'
          }}>
          Reset all data
        </button>
      </motion.div>
    </div>
  )
}