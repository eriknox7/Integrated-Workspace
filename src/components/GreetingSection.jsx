import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import { MOTIVATIONS, SEARCH_SHORTCUTS } from '../data/defaults'

const motive = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]

export default function GreetingSection({ theme }) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const hour     = now.getHours()
  const greeting = getGreeting(hour)

  const dim = theme === 'dark' ? '#9999b0' : '#7070a0'
  const card = theme === 'dark' ? '#111118' : '#ffffff'
  const border = theme === 'dark' ? '#2a2a38' : '#d8d8ec'

  return (
    <div className="mb-7 anim-up">
      {/* Date + clock row */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <p className="text-xs font-mono tracking-widest uppercase" style={{ color: dim }}>
          {formatDate(now)}
        </p>
        <div
          className="px-3 py-1 rounded-xl text-sm font-mono font-medium"
          style={{ background: card, border: `1px solid ${border}`, color: 'var(--accent)' }}
        >
          {formatTime(now)}
        </div>
      </div>

      {/* Greeting */}
      <h1 className="text-3xl font-bold tracking-tight leading-tight mb-1">
        <span className="grad-text">{greeting}, Sadique.</span>
        <span style={{ color: theme === 'dark' ? '#e8e8f0' : '#1a1a2e' }}>
          {' '}Stay consistent today.
        </span>
      </h1>
      <p className="text-sm italic" style={{ color: dim }}>&ldquo;{motive}&rdquo;</p>

      {/* Shortcut pills */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {Object.entries(SEARCH_SHORTCUTS).map(([k, v]) => (
          <span
            key={k}
            className="text-xs font-mono px-2 py-0.5 rounded-md cursor-default"
            style={{
              background: theme === 'dark' ? '#1a1a24' : '#eeeef8',
              border: `1px solid ${border}`,
              color: dim,
            }}
            title={`Type "${k} <query>" in search → ${v.label}`}
          >
            {k} →
          </span>
        ))}
      </div>
    </div>
  )
}
