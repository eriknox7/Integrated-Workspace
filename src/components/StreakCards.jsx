import { CheckCircle2, Circle } from 'lucide-react'

export default function StreakCards({ streaks, setStreaks, theme }) {
  const card   = theme === 'dark' ? '#111118' : '#ffffff'
  const border = theme === 'dark' ? '#2a2a38' : '#d8d8ec'
  const dim    = theme === 'dark' ? '#9999b0' : '#7070a0'

  function toggle(key) {
    setStreaks(s => ({
      ...s,
      [key]: {
        ...s[key],
        doneToday: !s[key].doneToday,
        count: s[key].doneToday ? s[key].count - 1 : s[key].count + 1,
      },
    }))
  }

  return (
    <div className="mb-7">
      <h2 className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: dim }}>
        Daily Streaks
      </h2>
      <div className="grid grid-cols-3 gap-3 stagger">
        {Object.entries(streaks).map(([key, s]) => (
          <div
            key={key}
            className="rounded-2xl p-4 relative overflow-hidden"
            style={{ background: card, border: `1px solid ${border}` }}
          >
            {/* Bottom gradient bar */}
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl"
              style={{ background: s.color }}
            />

            <div className="text-2xl mb-1">{s.emoji}</div>
            <div className="text-3xl font-bold font-mono" style={{ color: s.color }}>
              {s.count}
            </div>
            <div className="text-xs font-medium mt-0.5" style={{ color: theme === 'dark' ? '#e8e8f0' : '#1a1a2e' }}>
              {s.label} Streak
            </div>
            <div className="text-xs mt-0.5" style={{ color: dim }}>days in a row</div>

            {/* Check button */}
            <button
              onClick={() => toggle(key)}
              className="absolute top-3 right-3 transition-all"
              title={s.doneToday ? 'Mark undone' : 'Mark done today'}
            >
              {s.doneToday
                ? <CheckCircle2 size={20} style={{ color: 'var(--green)' }} />
                : <Circle      size={20} style={{ color: border }} />
              }
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
