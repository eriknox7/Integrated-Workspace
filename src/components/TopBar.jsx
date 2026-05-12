import { useState } from 'react'
import { Search, Moon, Sun, Target, Settings, Zap } from 'lucide-react'
import { SEARCH_SHORTCUTS } from '../data/defaults'

export default function TopBar({ theme, setTheme, focusMode, setFocusMode, onSettings, searchRef, searchQuery, setSearchQuery }) {
  const [hint, setHint] = useState(null)

  function handleKey(e) {
    if (e.key !== 'Enter' || !searchQuery.trim()) return
    const parts = searchQuery.trim().split(' ')
    const sc    = parts[0].toLowerCase()
    const rest  = parts.slice(1).join(' ')
    if (SEARCH_SHORTCUTS[sc] && rest) {
      window.open(SEARCH_SHORTCUTS[sc].url + encodeURIComponent(rest), '_blank')
    } else if (searchQuery.startsWith('http')) {
      window.open(searchQuery, '_blank')
    } else {
      window.open('https://google.com/search?q=' + encodeURIComponent(searchQuery), '_blank')
    }
    setSearchQuery('')
    setHint(null)
  }

  function handleChange(e) {
    const v = e.target.value
    setSearchQuery(v)
    const sc = v.split(' ')[0].toLowerCase()
    setHint(SEARCH_SHORTCUTS[sc] ? SEARCH_SHORTCUTS[sc].label : null)
  }

  const dimColor = theme === 'dark' ? '#9999b0' : '#7070a0'
  const inputBg  = theme === 'dark' ? '#1a1a24' : '#e8e8f4'
  const borderC  = theme === 'dark' ? '#2a2a38' : '#d0d0e0'
  const headerBg = theme === 'dark' ? 'rgba(10,10,15,0.92)' : 'rgba(240,240,248,0.92)'
  const btnBg    = theme === 'dark' ? '#1a1a24' : '#e8e8f4'

  return (
    <header className="sticky top-0 z-50 flex items-center gap-4 px-6 py-3"
      style={{ background: headerBg, borderBottom: `1px solid ${borderC}`, backdropFilter: 'blur(16px)' }}>
      
      <div className="flex items-center gap-2 select-none shrink-0">
        <Zap size={20} style={{ color: 'var(--accent)' }} />
        <span className="font-bold text-lg tracking-tight grad-text">SadiqOS</span>
      </div>

      <div className="relative flex-1 max-w-xl">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: dimColor }} />
        <input
          ref={searchRef}
          value={searchQuery}
          onChange={handleChange}
          onKeyDown={handleKey}
          placeholder="Search apps or: yt tutorial · lc arrays · gh react · npm axios  (Ctrl+K)"
          className="w-full pl-9 pr-4 py-2 rounded-2xl text-sm outline-none"
          style={{ background: inputBg, border: `1px solid ${borderC}`, color: theme === 'dark' ? '#e8e8f0' : '#1a1a2e' }}
        />
        {hint && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'var(--accentbg)', color: 'var(--accent)' }}>
            → {hint}
          </span>
        )}
      </div>

      <div className="hidden lg:flex items-center gap-1.5 shrink-0">
        {Object.entries(SEARCH_SHORTCUTS).slice(0, 5).map(([k]) => (
          <span key={k} className="text-xs px-2 py-0.5 rounded font-mono cursor-default"
            style={{ background: btnBg, color: dimColor, border: `1px solid ${borderC}` }}
            title={SEARCH_SHORTCUTS[k].label}>{k}</span>
        ))}
      </div>

      <div className="flex items-center gap-2 ml-auto shrink-0">
        <button
          onClick={() => setFocusMode(f => !f)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: focusMode ? 'var(--accentbg)' : btnBg,
            color: focusMode ? 'var(--accent)' : dimColor,
            border: `1px solid ${focusMode ? 'var(--accent)' : borderC}`,
          }}
        >
          <Target size={13} />
          <span className="hidden sm:inline">{focusMode ? 'Focus ON' : 'Focus'}</span>
        </button>

        <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ background: btnBg, border: `1px solid ${borderC}` }}>
          {theme === 'dark'
            ? <Sun  size={14} style={{ color: '#f5a623' }} />
            : <Moon size={14} style={{ color: '#6c63ff' }} />}
        </button>

        <button onClick={onSettings}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ background: btnBg, border: `1px solid ${borderC}`, color: dimColor }}>
          <Settings size={14} />
        </button>
      </div>
    </header>
  )
}
