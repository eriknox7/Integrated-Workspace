export default function StatsRow({ todos, focusMins, streaks, apps, theme }) {
  const done = todos.filter(t => t.done).length

  const catCount = {}
  apps.forEach(a => { catCount[a.cat] = (catCount[a.cat] || 0) + 1 })
  const topCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]

  const card  = theme === 'dark' ? '#111118' : '#ffffff'
  const border = theme === 'dark' ? '#2a2a38' : '#d8d8ec'
  const dim   = theme === 'dark' ? '#9999b0' : '#7070a0'

  const stats = [
    { label: 'Tasks Done',    val: `${done}/${todos.length}`, color: 'var(--accent)' },
    { label: 'Focus Time',    val: `${Math.round(focusMins)}m`, color: 'var(--green)' },
    { label: 'Best Streak',   val: `${Math.max(...Object.values(streaks).map(s => s.count))}🔥`, color: 'var(--amber)' },
    { label: 'Top Category',  val: topCat ? topCat[0].split(' ')[0] : '—', color: 'var(--blue)' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7 stagger">
      {stats.map(s => (
        <div
          key={s.label}
          className="rounded-2xl p-4 text-center"
          style={{ background: card, border: `1px solid ${border}` }}
        >
          <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.val}</div>
          <div className="text-xs mt-1" style={{ color: dim }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}
