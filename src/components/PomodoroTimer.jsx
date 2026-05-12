import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { TIMER_MODES } from '../data/defaults'
import { formatTimer } from '../utils/time'

export default function PomodoroTimer({ theme, onFocusMinute }) {
  const [mode, setMode]       = useState('focus')
  const [secs, setSecs]       = useState(TIMER_MODES.focus.duration)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  const total = TIMER_MODES[mode].duration
  const prog  = secs / total
  const R = 54
  const circ  = 2 * Math.PI * R
  const offset = circ * (1 - prog)

  const card   = theme === 'dark' ? '#111118' : '#ffffff'
  const border = theme === 'dark' ? '#2a2a38' : '#d8d8ec'
  const dim    = theme === 'dark' ? '#9999b0' : '#7070a0'
  const bg3    = theme === 'dark' ? '#1a1a24' : '#eeeef8'

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecs(s => {
          if (s <= 1) {
            setRunning(false)
            // Play a small beep via AudioContext
            try {
              const ctx = new (window.AudioContext || window.webkitAudioContext)()
              const osc = ctx.createOscillator()
              const gain = ctx.createGain()
              osc.connect(gain); gain.connect(ctx.destination)
              osc.frequency.value = 880
              gain.gain.setValueAtTime(0.3, ctx.currentTime)
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
              osc.start(); osc.stop(ctx.currentTime + 0.8)
            } catch {}
            return TIMER_MODES[mode].duration
          }
          if (mode === 'focus') onFocusMinute(1 / 60)
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, mode])

  function switchMode(m) {
    setMode(m)
    setSecs(TIMER_MODES[m].duration)
    setRunning(false)
  }

  function reset() {
    setSecs(TIMER_MODES[mode].duration)
    setRunning(false)
  }

  const modeColor = TIMER_MODES[mode].color

  return (
    <div className="rounded-2xl p-4" style={{ background: card, border: `1px solid ${border}` }}>
      <h3 className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: dim }}>
        ⏱ Pomodoro Timer
      </h3>

      {/* Mode tabs */}
      <div className="flex gap-1.5 mb-4">
        {Object.entries(TIMER_MODES).map(([k, v]) => (
          <button
            key={k}
            onClick={() => switchMode(k)}
            className="flex-1 text-xs py-1.5 rounded-xl font-medium transition-all"
            style={{
              background: mode === k ? 'rgba(108,99,255,0.15)' : bg3,
              color: mode === k ? modeColor : dim,
              border: `1px solid ${mode === k ? modeColor : border}`,
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Circle */}
      <div className="flex justify-center mb-4">
        <div className="relative" style={{ width: 120, height: 120 }}>
          {running && <div className="timer-pulse-ring" />}
          <svg
            width="120" height="120" viewBox="0 0 120 120"
            style={{ transform: 'rotate(-90deg)' }}
          >
            <circle
              cx="60" cy="60" r={R}
              fill="none" stroke={border} strokeWidth="5"
            />
            <circle
              cx="60" cy="60" r={R}
              fill="none"
              stroke={modeColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ transition: running ? 'stroke-dashoffset 1s linear' : 'none' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-mono" style={{ color: modeColor }}>
              {formatTimer(secs)}
            </span>
            <span className="text-xs mt-0.5" style={{ color: dim }}>
              {TIMER_MODES[mode].label}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setRunning(r => !r)}
          className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ background: modeColor, color: '#fff' }}
        >
          {running ? <Pause size={14} /> : <Play size={14} />}
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all"
          style={{ background: bg3, border: `1px solid ${border}`, color: dim }}
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  )
}
