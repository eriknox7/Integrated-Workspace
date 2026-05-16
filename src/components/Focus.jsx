import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, CheckCircle2, Circle, Flame, Zap, Plus, Trash2, X } from 'lucide-react'
import { fmtTimer } from '../utils/time'
import { TIMER_MODES } from '../data/defaults'

const MODE_META = {
  focus: { color: 'var(--accent)', glow: 'rgba(91,106,248,0.25)', bg: 'rgba(91,106,248,0.06)' },
  short: { color: 'var(--green)', glow: 'rgba(52,196,139,0.25)', bg: 'rgba(52,196,139,0.06)' },
  long: { color: 'var(--amber)', glow: 'rgba(232,160,69,0.25)', bg: 'rgba(232,160,69,0.06)' },
}

const EMOJI_OPTIONS = ['💡', '📖', '⏱', '🏋️', '🧘', '💻', '✍️', '📐', '🎯', '🌱', '📚', '🔬', '🎨', '🏃', '💪']
const COLOR_OPTIONS = [
  { color: 'var(--accent)', dim: 'var(--accent-dim)', border: 'var(--accent-b)' },
  { color: 'var(--green)', dim: 'var(--green-dim)', border: 'rgba(52,196,139,0.22)' },
  { color: 'var(--amber)', dim: 'var(--amber-dim)', border: 'rgba(232,160,69,0.22)' },
  { color: 'var(--red)', dim: 'var(--red-dim)', border: 'rgba(224,92,92,0.22)' },
]

function normalizeStreaks(raw) {
  if (Array.isArray(raw)) return raw
  return Object.entries(raw).map(([key, s], i) => ({
    id: key,
    label: s.label ?? key,
    emoji: key === 'dsa' ? '💡' : key === 'study' ? '📖' : '⏱',
    colorIdx: i % COLOR_OPTIONS.length,
    doneToday: s.doneToday ?? false,
  }))
}

// ── localStorage helpers ────────────────────────────────
function loadTimer() {
  try { return JSON.parse(localStorage.getItem('focus_timer') || '{}') } catch { return {} }
}
function saveTimer(patch) {
  try {
    const cur = loadTimer()
    localStorage.setItem('focus_timer', JSON.stringify({ ...cur, ...patch }))
  } catch { }
}

// Focus-seconds logged today (separate key, reset daily)
function loadFocusSecs() {
  try {
    const raw = JSON.parse(localStorage.getItem('focus_secs_today') || '{}')
    const today = new Date().toDateString()
    if (raw.date !== today) return 0
    return raw.secs ?? 0
  } catch { return 0 }
}
function saveFocusSecs(secs) {
  localStorage.setItem('focus_secs_today', JSON.stringify({ date: new Date().toDateString(), secs }))
}

export default function Focus({ streaks: rawStreaks, setStreaks: setRawStreaks }) {
  // ── Streaks / check-ins ─────────────────────────────
  const checkins = normalizeStreaks(rawStreaks)
  function setCheckins(updater) {
    setRawStreaks(prev => {
      const cur = normalizeStreaks(prev)
      return typeof updater === 'function' ? updater(cur) : updater
    })
  }

  useEffect(() => {
    const today = new Date().toDateString()
    if (localStorage.getItem('focus_checkin_reset') !== today) {
      localStorage.setItem('focus_checkin_reset', today)
      setCheckins(list => list.map(c => ({ ...c, doneToday: false })))
    }
  }, [])

  // ── Daily reset ─────────────────────────────────────
  const today = new Date().toDateString()
  const isNewDay = localStorage.getItem('focus_last_launch') !== today
  if (isNewDay) {
    localStorage.setItem('focus_last_launch', today)
    localStorage.setItem('focus_timer', JSON.stringify({
      mode: 'focus', running: false,
      secsAtStart: TIMER_MODES.focus.mins * 60,
      startedAt: null, sessions: 0, history: [],
    }))
    saveFocusSecs(0)
  }

  // ── Bootstrap timer state from localStorage ─────────
  const _t = loadTimer()
  const _initMode = _t.mode ?? 'focus'
  const _initSecs = (() => {
    if (!isNewDay && _t.running && _t.startedAt) {
      const rem = (_t.secsAtStart ?? 0) - Math.floor((Date.now() - _t.startedAt) / 1000)
      return rem > 0 ? rem : 0
    }
    return _t.secsAtStart ?? TIMER_MODES[_initMode].mins * 60
  })()
  const _initRunning = !isNewDay && !!_t.running && !!_t.startedAt &&
    ((_t.secsAtStart ?? 0) - Math.floor((Date.now() - _t.startedAt) / 1000)) > 0

  // ── State ───────────────────────────────────────────
  const [mode, setMode] = useState(_initMode)
  const [secs, setSecs] = useState(_initSecs)
  const [running, setRunning] = useState(_initRunning)
  const [sessions, setSessions] = useState(isNewDay ? 0 : (_t.sessions ?? 0))
  const [history, setHistory] = useState(isNewDay ? [] : (_t.history ?? []))
  const [focusSecs, setFocusSecs] = useState(loadFocusSecs)  // live display

  // Add-form state
  const [adding, setAdding] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newEmoji, setNewEmoji] = useState('💡')
  const [newColorIdx, setNewColorIdx] = useState(0)

  const timerRef = useRef(null)
  const inputRef = useRef(null)

  const total = TIMER_MODES[mode].mins * 60
  const prog = secs / total
  const R = 88, C = 2 * Math.PI * R
  const meta = MODE_META[mode]

  // ── Core interval ───────────────────────────────────
  // Reads everything fresh from localStorage each tick → immune to sleep/drift
  useEffect(() => {
    if (!running) {
      clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      const t = loadTimer()
      if (!t.startedAt) return

      const elapsed = Math.floor((Date.now() - t.startedAt) / 1000)
      const remaining = (t.secsAtStart ?? 0) - elapsed

      // ── Update focus-minutes display (realtime, wall-clock based) ──
      if ((t.mode ?? 'focus') === 'focus') {
        // secsLogged = secs elapsed so far in THIS session
        const secsThisSession = Math.min(elapsed, t.secsAtStart ?? 0)
        // baseSecsToday = what was logged before this session started
        const baseSecsToday = t.baseSecsToday ?? 0
        const totalToday = baseSecsToday + secsThisSession
        setFocusSecs(totalToday)
        saveFocusSecs(totalToday)
      }

      // ── Timer expired ──
      if (remaining <= 0) {
        clearInterval(timerRef.current)
        const m = t.mode ?? 'focus'

        if (m === 'focus') {
          // Finalize focus seconds for this session
          const finalSecs = (t.baseSecsToday ?? 0) + (t.secsAtStart ?? 0)
          setFocusSecs(finalSecs)
          saveFocusSecs(finalSecs)

          setSessions(n => {
            const next = n + 1
            saveTimer({ sessions: next })
            return next
          })
          setHistory(h => {
            const next = [...h.slice(-7), 'focus']
            saveTimer({ history: next })
            return next
          })
        } else {
          setHistory(h => {
            const next = [...h.slice(-7), m]
            saveTimer({ history: next })
            return next
          })
        }

        const resetSecs = TIMER_MODES[m].mins * 60
        saveTimer({ running: false, secsAtStart: resetSecs, startedAt: null, baseSecsToday: loadFocusSecs() })
        setSecs(resetSecs)
        setRunning(false)
        beep()
        return
      }

      setSecs(remaining)
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [running])

  useEffect(() => { if (adding) setTimeout(() => inputRef.current?.focus(), 50) }, [adding])

  // ── Controls ────────────────────────────────────────
  function startTimer() {
    const now = Date.now()
    // baseSecsToday = focus secs already logged today before this session
    const base = mode === 'focus' ? loadFocusSecs() : 0
    saveTimer({ running: true, startedAt: now, secsAtStart: secs, mode, sessions, history, baseSecsToday: base })
    setRunning(true)
  }

  function pauseTimer() {
    // Snapshot how many focus secs we've accumulated so far
    if (mode === 'focus') {
      const t = loadTimer()
      if (t.startedAt) {
        const elapsed = Math.floor((Date.now() - t.startedAt) / 1000)
        const secsThisSession = Math.min(elapsed, t.secsAtStart ?? 0)
        const totalToday = (t.baseSecsToday ?? 0) + secsThisSession
        saveFocusSecs(totalToday)
        setFocusSecs(totalToday)
      }
    }
    saveTimer({ running: false, startedAt: null, secsAtStart: secs })
    setRunning(false)
  }

  function switchMode(m) {
    const s = TIMER_MODES[m].mins * 60
    setMode(m)
    setSecs(s)
    saveTimer({ mode: m, running: false, secsAtStart: s, startedAt: null })
  }

  function reset() {
    const s = TIMER_MODES[mode].mins * 60
    setSecs(s)
    setRunning(false)
    saveTimer({ running: false, secsAtStart: s, startedAt: null })
  }

  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator(), g = ctx.createGain()
      osc.connect(g); g.connect(ctx.destination)
      osc.frequency.value = 528
      g.gain.setValueAtTime(0.12, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2)
      osc.start(); osc.stop(ctx.currentTime + 1.2)
    } catch { }
  }

  // ── Check-in actions ────────────────────────────────
  function toggleCheckin(id) { setCheckins(list => list.map(c => c.id === id ? { ...c, doneToday: !c.doneToday } : c)) }
  function removeCheckin(id) { setCheckins(list => list.filter(c => c.id !== id)) }
  function addCheckin() {
    if (!newLabel.trim()) return
    setCheckins(list => [...list, { id: `ci_${Date.now()}`, label: newLabel.trim(), emoji: newEmoji, colorIdx: newColorIdx, doneToday: false }])
    setNewLabel(''); setNewEmoji('💡'); setNewColorIdx(0); setAdding(false)
  }

  // ── Display ─────────────────────────────────────────
  const totalMins = Math.floor(focusSecs / 60)
  const focusDisplay = totalMins >= 60
    ? `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`
    : `${totalMins}m`
  const doneCount = checkins.filter(c => c.doneToday).length

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: 'var(--bg-0)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '44px 32px 80px' }}>
      <div style={{ width: '100%', maxWidth: 1080 }}>

        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--t0)', marginBottom: 4 }}>Focus</h2>
          <p style={{ fontSize: 13, color: 'var(--t2)' }}>Stay in deep work. One session at a time.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>

          {/* ══ TIMER PANEL ══ */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--b1)', borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>

            {/* Mode tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--b0)' }}>
              {Object.entries(TIMER_MODES).map(([k, v]) => (
                <button key={k} onClick={() => !running && switchMode(k)}
                  title={running && k !== mode ? 'Stop the timer before switching modes' : ''}
                  style={{
                    flex: 1, padding: '14px 0', fontSize: 12, fontWeight: 600, transition: 'all .15s',
                    cursor: running && k !== mode ? 'not-allowed' : 'pointer',
                    opacity: running && k !== mode ? 0.35 : 1,
                    background: mode === k ? MODE_META[k].bg : 'transparent',
                    borderBottom: mode === k ? `2px solid ${MODE_META[k].color}` : '2px solid transparent',
                    color: mode === k ? MODE_META[k].color : 'var(--t2)',
                    letterSpacing: '0.03em',
                  }}>
                  {v.label}
                </button>
              ))}
            </div>

            {/* Ring */}
            <div style={{ padding: '44px 36px 36px', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 210, height: 210, margin: '0 auto 36px' }}>
                <AnimatePresence>
                  {running && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: [0.4, 0.15, 0.4], scale: [1, 1.06, 1] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: `radial-gradient(circle, ${meta.glow} 0%, transparent 70%)`, pointerEvents: 'none' }}
                    />
                  )}
                </AnimatePresence>
                <svg width="210" height="210" viewBox="0 0 210 210" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="105" cy="105" r={R} fill="none" stroke="var(--b1)" strokeWidth="4" />
                  <motion.circle cx="105" cy="105" r={R} fill="none" stroke={meta.color} strokeWidth="4"
                    strokeLinecap="round" strokeDasharray={C}
                    animate={{ strokeDashoffset: C * (1 - prog) }}
                    transition={running ? { duration: 1, ease: 'linear' } : { duration: 0.4 }}
                    style={{ filter: `drop-shadow(0 0 6px ${meta.glow})` }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <motion.span key={mode} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ fontSize: 42, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em', color: meta.color }}>
                    {fmtTimer(secs)}
                  </motion.span>
                  <span style={{ fontSize: 11, color: 'var(--t2)', marginTop: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {TIMER_MODES[mode].label}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                  onClick={running ? pauseTimer : startTimer}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 36px', borderRadius: 'var(--r)', background: meta.color, color: '#fff', fontSize: 14, fontWeight: 600, boxShadow: `0 6px 20px ${meta.glow}`, transition: 'box-shadow .2s' }}>
                  {running ? <><Pause size={15} /> Pause</> : <><Play size={15} /> Start</>}
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }} onClick={reset}
                  style={{ padding: '12px 16px', borderRadius: 'var(--r)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--b1)', color: 'var(--t2)' }}>
                  <RotateCcw size={15} />
                </motion.button>
              </div>

              {/* Session history */}
              <div style={{ borderTop: '1px solid var(--b0)', paddingTop: 20 }}>
                <p className="label" style={{ marginBottom: 12 }}>Session history</p>
                <div style={{ display: 'flex', gap: 7, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {history.length === 0 && <span style={{ fontSize: 12, color: 'var(--t3)' }}>No sessions yet this run</span>}
                  {history.map((type, i) => (
                    <motion.div key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      title={TIMER_MODES[type]?.label ?? type}
                      style={{ width: 10, height: 10, borderRadius: '50%', background: MODE_META[type]?.color ?? 'var(--t2)', boxShadow: `0 0 6px ${MODE_META[type]?.glow ?? 'transparent'}` }}
                    />
                  ))}
                  {Array.from({ length: Math.max(0, 8 - history.length) }).map((_, i) => (
                    <div key={`e${i}`} style={{ width: 10, height: 10, borderRadius: '50%', border: '1px solid var(--b1)' }} />
                  ))}
                </div>
                <p style={{ fontSize: 11, color: 'var(--t3)', marginTop: 10 }}>
                  {history.filter(h => h === 'focus').length} focus · {history.filter(h => h !== 'focus').length} breaks
                </p>
              </div>
            </div>
          </motion.div>

          {/* ══ RIGHT COLUMN ══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--b1)', borderRadius: 'var(--r-lg)', padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--accent-dim)', border: '1px solid var(--accent-b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={13} color="var(--accent)" />
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--t2)', fontWeight: 500 }}>Focus today</p>
                </div>
                <p style={{ fontSize: 28, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', letterSpacing: '-0.02em' }}>{focusDisplay}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--b1)', borderRadius: 'var(--r-lg)', padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--green-dim)', border: '1px solid rgba(52,196,139,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Flame size={13} color="var(--green)" />
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--t2)', fontWeight: 500 }}>Sessions</p>
                </div>
                <p style={{ fontSize: 28, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: 'var(--green)', letterSpacing: '-0.02em' }}>{sessions}</p>
              </div>
            </div>

            {/* ── DAILY CHECK-IN PANEL ── */}
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--b1)', borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid var(--b0)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <p className="label">Daily check-in</p>
                  {checkins.length > 0 && (
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 99,
                      background: doneCount === checkins.length ? 'var(--green-dim)' : 'var(--bg-3)',
                      color: doneCount === checkins.length ? 'var(--green)' : 'var(--t2)',
                      border: `1px solid ${doneCount === checkins.length ? 'rgba(52,196,139,0.25)' : 'var(--b0)'}`,
                      transition: 'all .2s',
                    }}>
                      {doneCount}/{checkins.length}
                    </span>
                  )}
                </div>
                <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                  onClick={() => setAdding(a => !a)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, fontSize: 11, fontWeight: 600,
                    background: adding ? 'var(--red-dim)' : 'var(--accent-dim)',
                    border: `1px solid ${adding ? 'rgba(224,92,92,0.25)' : 'var(--accent-b)'}`,
                    color: adding ? 'var(--red)' : 'var(--accent)', transition: 'all .15s',
                  }}>
                  {adding ? <><X size={11} /> Cancel</> : <><Plus size={11} /> Add</>}
                </motion.button>
              </div>

              <AnimatePresence>
                {adding && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden', borderBottom: '1px solid var(--b0)' }}>
                    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <input ref={inputRef} value={newLabel} onChange={e => setNewLabel(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') addCheckin(); if (e.key === 'Escape') setAdding(false) }}
                        placeholder="e.g. Morning run, Read 30 mins…"
                        style={{ width: '100%', padding: '9px 12px', fontSize: 13, borderRadius: 'var(--r)', background: 'var(--bg-0)', border: '1px solid var(--b1)' }} />
                      <div>
                        <p style={{ fontSize: 10, color: 'var(--t2)', marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>Icon</p>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {EMOJI_OPTIONS.map(e => (
                            <button key={e} onClick={() => setNewEmoji(e)}
                              style={{ width: 32, height: 32, borderRadius: 8, fontSize: 16, background: newEmoji === e ? 'var(--accent-dim)' : 'var(--bg-3)', border: `1px solid ${newEmoji === e ? 'var(--accent-b)' : 'var(--b0)'}`, cursor: 'pointer', transition: 'all .12s' }}>
                              {e}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p style={{ fontSize: 10, color: 'var(--t2)', marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>Color</p>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {COLOR_OPTIONS.map((c, i) => (
                            <button key={i} onClick={() => setNewColorIdx(i)}
                              style={{ width: 22, height: 22, borderRadius: '50%', background: c.color, border: newColorIdx === i ? '2px solid var(--t0)' : '2px solid transparent', boxShadow: newColorIdx === i ? `0 0 0 1px ${c.color}` : 'none', cursor: 'pointer', transition: 'all .12s' }} />
                          ))}
                        </div>
                      </div>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={addCheckin} disabled={!newLabel.trim()}
                        style={{ padding: '9px 0', borderRadius: 'var(--r)', fontSize: 13, fontWeight: 600, background: newLabel.trim() ? 'var(--accent)' : 'var(--bg-3)', color: newLabel.trim() ? '#fff' : 'var(--t3)', boxShadow: newLabel.trim() ? '0 4px 14px rgba(91,106,248,0.3)' : 'none', transition: 'all .15s', cursor: newLabel.trim() ? 'pointer' : 'default' }}>
                        Add check-in
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ padding: checkins.length ? '6px 12px 10px' : '0' }}>
                <AnimatePresence>
                  {checkins.map((c, i) => {
                    const col = COLOR_OPTIONS[c.colorIdx ?? 0]
                    return (
                      <motion.div key={c.id} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 8px', borderBottom: i < checkins.length - 1 ? '1px solid var(--b0)' : 'none' }}>
                        <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.doneToday ? col.dim : 'var(--bg-3)', border: `1px solid ${c.doneToday ? col.color + '44' : 'var(--b0)'}`, transition: 'all .2s' }}>
                          {c.emoji}
                        </div>
                        <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: c.doneToday ? 'var(--t2)' : 'var(--t0)', textDecoration: c.doneToday ? 'line-through' : 'none', transition: 'all .2s' }}>
                          {c.label}
                        </span>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }} onClick={() => removeCheckin(c.id)}
                          style={{ width: 24, height: 24, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)', background: 'transparent', transition: 'all .12s' }}
                          onMouseEnter={e => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.background = 'var(--red-dim)' }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'var(--t3)'; e.currentTarget.style.background = 'transparent' }}>
                          <Trash2 size={12} />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.78 }} onClick={() => toggleCheckin(c.id)}
                          style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.doneToday ? col.dim : 'transparent', border: `1.5px solid ${c.doneToday ? col.color : 'var(--b2)'}`, cursor: 'pointer', transition: 'all .18s', boxShadow: c.doneToday ? `0 2px 10px ${col.color}44` : 'none' }}>
                          <AnimatePresence mode="wait">
                            {c.doneToday
                              ? <motion.div key="y" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}><CheckCircle2 size={15} color={col.color} /></motion.div>
                              : <motion.div key="n" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Circle size={15} color="var(--b2)" /></motion.div>
                            }
                          </AnimatePresence>
                        </motion.button>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
                {checkins.length === 0 && !adding && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', padding: '24px 0', fontSize: 12, color: 'var(--t3)' }}>
                    No check-ins yet — add one above
                  </motion.p>
                )}
              </div>
            </div>

            {/* Motivational card */}
            <div style={{ padding: '14px 18px', borderRadius: 'var(--r-lg)', background: 'var(--accent-dim)', border: '1px solid var(--accent-b)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16 }}>🎯</span>
              <p style={{ fontSize: 12, color: 'var(--t1)', lineHeight: 1.6 }}>
                {sessions === 0
                  ? 'Start your first session. Deep work compounds.'
                  : sessions < 3
                    ? `${sessions} session${sessions > 1 ? 's' : ''} in. Keep the momentum going.`
                    : `${sessions} sessions strong. You're locked in. 🔥`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}