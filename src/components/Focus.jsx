import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, CheckCircle2, Circle } from 'lucide-react'
import { fmtTimer } from '../utils/time'
import { TIMER_MODES } from '../data/defaults'

export default function Focus({ streaks, setStreaks, focusMins, onFocusMinute }) {
  const [mode, setMode]       = useState('focus')
  const [secs, setSecs]       = useState(TIMER_MODES.focus.mins * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const timerRef = useRef(null)

  const total = TIMER_MODES[mode].mins * 60
  const prog  = secs / total
  const R = 80, C = 2 * Math.PI * R

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSecs(s => {
          if (s <= 1) { setRunning(false); if (mode==='focus') setSessions(n=>n+1); beep(); return TIMER_MODES[mode].mins*60 }
          if (mode==='focus') onFocusMinute(1/60)
          return s-1
        })
      }, 1000)
    } else clearInterval(timerRef.current)
    return () => clearInterval(timerRef.current)
  }, [running, mode])

  function switchMode(m) { setMode(m); setSecs(TIMER_MODES[m].mins*60); setRunning(false) }
  function reset() { setSecs(TIMER_MODES[mode].mins*60); setRunning(false) }
  function beep() {
    try {
      const ctx = new (window.AudioContext||window.webkitAudioContext)()
      const osc = ctx.createOscillator(), g = ctx.createGain()
      osc.connect(g); g.connect(ctx.destination)
      osc.frequency.value=528; g.gain.setValueAtTime(.12,ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+1.2)
      osc.start(); osc.stop(ctx.currentTime+1.2)
    } catch {}
  }
  function toggleStreak(key) {
    setStreaks(s=>({...s,[key]:{...s[key],doneToday:!s[key].doneToday,count:s[key].doneToday?s[key].count-1:s[key].count+1}}))
  }

  const modeColor = mode==='focus'?'var(--accent)':mode==='short'?'var(--green)':'var(--amber)'

  return (
    <div style={{padding:'52px 56px 80px'}}>
      <h2 style={{fontSize:30,fontWeight:700,letterSpacing:'-0.04em',color:'var(--t0)',marginBottom:6}}>Focus</h2>
      <p style={{fontSize:14,color:'var(--t2)',marginBottom:48}}>Stay in deep work. One session at a time.</p>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,alignItems:'start'}}>
        {/* Timer */}
        <motion.div className="card" style={{padding:'44px 36px',textAlign:'center'}}
          initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{type:'spring',stiffness:280,damping:28}}>

          <div style={{display:'flex',gap:6,justifyContent:'center',marginBottom:44}}>
            {Object.entries(TIMER_MODES).map(([k,v]) => (
              <button key={k} onClick={()=>switchMode(k)}
                style={{padding:'7px 18px',borderRadius:99,fontSize:13,fontWeight:500,cursor:'pointer',transition:'all .15s',
                  background: mode===k?'rgba(255,255,255,0.07)':'transparent',
                  border:`1px solid ${mode===k?'var(--b2)':'var(--b0)'}`,
                  color: mode===k?'var(--t0)':'var(--t2)'}}>
                {v.label}
              </button>
            ))}
          </div>

          <div style={{position:'relative',width:196,height:196,margin:'0 auto 44px'}}>
            <svg width="196" height="196" viewBox="0 0 196 196" style={{transform:'rotate(-90deg)'}}>
              <circle className="t-track" cx="98" cy="98" r={R} />
              <motion.circle className="t-fill" cx="98" cy="98" r={R}
                style={{stroke:modeColor}}
                strokeDasharray={C}
                animate={{strokeDashoffset: C*(1-prog)}}
                transition={running?{duration:1,ease:'linear'}:{duration:.4}} />
            </svg>
            <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <span style={{fontSize:38,fontWeight:700,fontFamily:'JetBrains Mono,monospace',letterSpacing:'-0.02em',color:modeColor}}>
                {fmtTimer(secs)}
              </span>
              <span style={{fontSize:12,color:'var(--t2)',marginTop:4}}>{TIMER_MODES[mode].label}</span>
            </div>
          </div>

          <div style={{display:'flex',gap:10,justifyContent:'center'}}>
            <motion.button whileHover={{scale:1.03}} whileTap={{scale:.96}} onClick={()=>setRunning(r=>!r)}
              style={{display:'flex',alignItems:'center',gap:8,padding:'12px 32px',borderRadius:'var(--r)',
                background:modeColor,color:'#fff',fontSize:15,fontWeight:600}}>
              {running?<><Pause size={16}/>Pause</>:<><Play size={16}/>Start</>}
            </motion.button>
            <motion.button whileHover={{scale:1.03}} whileTap={{scale:.96}} onClick={reset}
              style={{padding:'12px 16px',borderRadius:'var(--r)',background:'rgba(255,255,255,0.04)',
                border:'1px solid var(--b1)',color:'var(--t2)'}}>
              <RotateCcw size={16}/>
            </motion.button>
          </div>
          {sessions>0&&<p style={{marginTop:20,fontSize:13,color:'var(--t2)'}}>{sessions} session{sessions>1?'s':''} completed</p>}
        </motion.div>

        {/* Right col: stats + streaks */}
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="stat-card">
              <p style={{fontSize:12,color:'var(--t2)',marginBottom:10}}>Focus today</p>
              <p style={{fontSize:30,fontWeight:700,color:'var(--accent)',fontFamily:'JetBrains Mono,monospace'}}>{Math.round(focusMins)}m</p>
            </div>
            <div className="stat-card">
              <p style={{fontSize:12,color:'var(--t2)',marginBottom:10}}>Sessions</p>
              <p style={{fontSize:30,fontWeight:700,color:'var(--green)',fontFamily:'JetBrains Mono,monospace'}}>{sessions}</p>
            </div>
          </div>

          <p className="label" style={{marginTop:8}}>Daily check-in</p>
          {Object.entries(streaks).map(([key,s]) => (
            <div key={key} className="card" style={{padding:'16px 20px',display:'flex',alignItems:'center',gap:14}}>
              <div style={{fontSize:20}}>{key==='dsa'?'💡':key==='study'?'📖':'⏱'}</div>
              <div style={{flex:1}}>
                <p style={{fontSize:14,fontWeight:500,color:'var(--t0)'}}>{s.label}</p>
                <p style={{fontSize:12,color:'var(--t2)'}}>{s.count} day streak</p>
              </div>
              <motion.button whileTap={{scale:.82}} onClick={()=>toggleStreak(key)} style={{background:'none',border:'none',cursor:'pointer'}}>
                {s.doneToday
                  ? <CheckCircle2 size={22} style={{color:'var(--green)'}}/>
                  : <Circle       size={22} style={{color:'var(--b2)'}}/>}
              </motion.button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
