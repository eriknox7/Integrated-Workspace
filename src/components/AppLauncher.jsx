import { useState } from 'react'
import { Plus, Star, Trash2, ExternalLink } from 'lucide-react'
import { CATEGORIES, FOCUS_HIDDEN_CATS } from '../data/defaults'

export default function AppLauncher({ apps, setApps, focusMode, searchQuery, theme, onAddApp }) {
  const [activeCAT, setActiveCAT] = useState('All')

  const card   = theme === 'dark' ? '#111118' : '#ffffff'
  const border = theme === 'dark' ? '#2a2a38' : '#d8d8ec'
  const dim    = theme === 'dark' ? '#9999b0' : '#7070a0'
  const bg3    = theme === 'dark' ? '#1a1a24' : '#eeeef8'

  const filtered = apps.filter(a => {
    if (focusMode && FOCUS_HIDDEN_CATS.includes(a.cat)) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return a.name.toLowerCase().includes(q) || a.cat.toLowerCase().includes(q)
    }
    if (activeCAT !== 'All' && a.cat !== activeCAT) return false
    return true
  })

  function toggleFav(id) {
    setApps(a => a.map(x => x.id === id ? { ...x, fav: !x.fav } : x))
  }

  function removeApp(id) {
    setApps(a => a.filter(x => x.id !== id))
  }

  return (
    <div className="mb-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-semibold tracking-widest uppercase" style={{ color: dim }}>
            App Launcher
          </h2>
          {focusMode && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'var(--amberbg)', color: 'var(--amber)', border: '1px solid var(--amber)' }}
            >
              FOCUS ON
            </span>
          )}
        </div>
        <button
          onClick={onAddApp}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl font-semibold transition-all"
          style={{
            background: 'var(--accentbg)',
            color: 'var(--accent)',
            border: '1px solid var(--accent)',
          }}
        >
          <Plus size={12} /> Add App
        </button>
      </div>

      {/* Category tabs */}
      {!searchQuery && (
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.filter(c => !focusMode || !FOCUS_HIDDEN_CATS.includes(c)).map(c => (
            <button
              key={c}
              onClick={() => setActiveCAT(c)}
              className="text-xs px-3 py-1.5 rounded-full transition-all font-medium"
              style={{
                background: activeCAT === c ? 'var(--accentbg)' : bg3,
                color: activeCAT === c ? 'var(--accent)' : dim,
                border: `1px solid ${activeCAT === c ? 'var(--accent)' : border}`,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* App grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-sm" style={{ color: dim }}>
          {focusMode ? 'No apps visible in Focus Mode 🎯' : 'No apps found'}
        </div>
      ) : (
        <div className="grid gap-2.5 stagger" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))' }}>
          {filtered.map(app => (
            <AppCard
              key={app.id}
              app={app}
              theme={theme}
              card={card}
              border={border}
              dim={dim}
              onFav={() => toggleFav(app.id)}
              onRemove={() => removeApp(app.id)}
            />
          ))}
          {/* Add button in grid */}
          <button
            onClick={onAddApp}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl p-3 transition-all"
            style={{
              minHeight: 88,
              background: 'transparent',
              border: `1.5px dashed ${border}`,
              color: dim,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = dim }}
          >
            <Plus size={18} />
            <span className="text-xs">Add</span>
          </button>
        </div>
      )}
    </div>
  )
}

function AppCard({ app, theme, card, border, dim, onFav, onRemove }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative flex flex-col items-center gap-2 rounded-2xl p-3 app-card-glow"
      style={{
        background: card,
        border: `1px solid ${hovered ? 'var(--accent)' : border}`,
        cursor: 'pointer',
        transition: 'all 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Fav dot */}
      {app.fav && (
        <div
          className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full"
          style={{ background: 'var(--amber)' }}
        />
      )}

      {/* Actions (on hover) */}
      {hovered && (
        <div className="absolute top-1.5 right-1.5 flex gap-1">
          <button
            onClick={e => { e.stopPropagation(); onFav() }}
            className="w-5 h-5 rounded flex items-center justify-center"
            style={{ background: 'var(--amberbg)' }}
            title={app.fav ? 'Unfavourite' : 'Favourite'}
          >
            <Star size={10} fill={app.fav ? 'var(--amber)' : 'none'} style={{ color: 'var(--amber)' }} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onRemove() }}
            className="w-5 h-5 rounded flex items-center justify-center"
            style={{ background: 'var(--redbg)' }}
            title="Remove"
          >
            <Trash2 size={10} style={{ color: 'var(--red)' }} />
          </button>
        </div>
      )}

      {/* Icon */}
      <a
        href={app.url}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col items-center gap-1.5 w-full text-center"
        style={{ textDecoration: 'none' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: theme === 'dark' ? '#1a1a24' : '#eeeef8' }}
        >
          <img
  src={app.icon}
  alt={app.name}
  style={{ width:28, height:28, objectFit:'contain' }}
  onError={e => {
    e.currentTarget.onerror = null
    e.currentTarget.src =
      `https://www.google.com/s2/favicons?domain=${new URL(app.url).hostname}&sz=64`
  }}
/>
        </div>
        <span className="text-xs leading-tight" style={{ color: dim, wordBreak: 'break-word' }}>
          {app.name}
        </span>
      </a>

      {hovered && (
        <ExternalLink
          size={9}
          className="absolute bottom-1.5 right-1.5"
          style={{ color: 'var(--accent)', opacity: 0.7 }}
        />
      )}
    </div>
  )
}
