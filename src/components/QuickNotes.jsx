import { useState, useRef } from 'react'
import { Save } from 'lucide-react'

export default function QuickNotes({ notes, setNotes, theme }) {
  const [saved, setSaved] = useState(false)
  const saveTimer = useRef(null)

  const card   = theme === 'dark' ? '#111118' : '#ffffff'
  const border = theme === 'dark' ? '#2a2a38' : '#d8d8ec'
  const dim    = theme === 'dark' ? '#9999b0' : '#7070a0'
  const bg3    = theme === 'dark' ? '#1a1a24' : '#eeeef8'
  const textPrimary = theme === 'dark' ? '#e8e8f0' : '#1a1a2e'

  function handleChange(e) {
    setNotes(e.target.value)
    setSaved(false)
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => setSaved(true), 1000)
  }

  const charCount = notes.length

  return (
    <div className="rounded-2xl p-4" style={{ background: card, border: `1px solid ${border}` }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold tracking-widest uppercase" style={{ color: dim }}>
          📌 Quick Notes
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono" style={{ color: dim }}>{charCount} chars</span>
          {saved && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--green)' }}>
              <Save size={10} /> Saved
            </span>
          )}
        </div>
      </div>

      <textarea
        value={notes}
        onChange={handleChange}
        placeholder="Jot down thoughts, links, ideas, reminders...&#10;&#10;Auto-saves as you type 🔒"
        rows={6}
        className="w-full rounded-xl p-3 text-sm outline-none resize-none leading-relaxed"
        style={{
          background: bg3,
          border: `1px solid ${border}`,
          color: textPrimary,
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      />
    </div>
  )
}
