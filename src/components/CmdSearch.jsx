import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, X } from 'lucide-react'
import { SHORTCUTS } from '../data/defaults'

export default function CmdSearch({ open, onClose, apps }) {
  const [q, setQ] = useState('')
  const [hint, setHint] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) { setQ(''); setHint(null); setTimeout(() => inputRef.current?.focus(), 60) }
  }, [open])

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  function handleChange(e) {
    const v = e.target.value; setQ(v)
    const sc = v.split(' ')[0].toLowerCase()
    setHint(SHORTCUTS[sc] ? SHORTCUTS[sc].label : null)
  }

  function submit() {
    if (!q.trim()) return
    const parts = q.trim().split(' '), sc = parts[0].toLowerCase(), rest = parts.slice(1).join(' ')
    if (SHORTCUTS[sc] && rest) window.open(SHORTCUTS[sc].url + encodeURIComponent(rest), '_blank')
    else if (q.startsWith('http')) window.open(q, '_blank')
    else window.open('https://google.com/search?q=' + encodeURIComponent(q), '_blank')
    onClose()
  }

  const matchedApps = q.length > 1
    ? apps.filter(a => a.name.toLowerCase().includes(q.toLowerCase())).slice(0, 4)
    : []

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="cmd-bg" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          transition={{duration:.15}} onClick={e => e.target === e.currentTarget && onClose()}>
          <motion.div className="cmd-box"
            initial={{opacity:0,y:-16,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-10,scale:.97}}
            transition={{type:'spring',stiffness:380,damping:30}}>

            {/* Search input */}
            <div style={{display:'flex',alignItems:'center',gap:10,padding:'14px 16px',borderBottom:'1px solid var(--b0)'}}>
              <Search size={16} style={{color:'var(--t2)',flexShrink:0}} />
              <input
                ref={inputRef}
                value={q}
                onChange={handleChange}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder="Search apps, or type yt · lc · gh · gpt · npm…"
                style={{flex:1,background:'transparent',border:'none',fontSize:14,color:'var(--t0)',outline:'none',boxShadow:'none', lineHeight:'28px',
                padding:'2.1px 0',}}
              />
              {hint && (
                <span className="badge" style={{background:'var(--accent-dim)',color:'var(--accent)',border:'1px solid var(--accent-b)',fontSize:11}}>
                  → {hint}
                </span>
              )}
              <button onClick={onClose} style={{color:'var(--t2)',padding:4,borderRadius:4}}>
                <X size={14} />
              </button>
            </div>

            {/* Shortcut pills */}
            {q.length === 0 && (
              <div style={{padding:'12px 16px 8px'}}>
                <p className="label" style={{marginBottom:8}}>Quick shortcuts</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {Object.entries(SHORTCUTS).map(([k,v]) => (
                    <button key={k}
                      onClick={() => setQ(k + ' ')}
                      style={{fontSize:11,fontFamily:'JetBrains Mono,monospace',padding:'4px 9px',borderRadius:6,
                        background:'var(--bg-4)',border:'1px solid var(--b1)',color:'var(--t1)',transition:'all .12s'}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--accent-b)';e.currentTarget.style.color='var(--t0)'}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--b1)';e.currentTarget.style.color='var(--t1)'}}>
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matched apps */}
            {matchedApps.length > 0 && (
              <div style={{padding:'8px 8px 4px'}}>
                <p className="label" style={{padding:'0 8px',marginBottom:6}}>Apps</p>
                {matchedApps.map(app => (
                  <a key={app.id} href={app.url} target="_blank" rel="noreferrer" onClick={onClose}
                    style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:'var(--r-sm)',
                      transition:'background .1s',cursor:'pointer'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <div className="app-icon" style={{width:28,height:28,borderRadius:7,fontSize:14}}>
                      {app.icon?.startsWith('http')
                        ? <img src={app.icon} alt="" onError={e=>e.target.style.display='none'} style={{width:18,height:18}} />
                        : app.icon}
                    </div>
                    <span style={{fontSize:13,color:'var(--t0)'}}>{app.name}</span>
                    <span style={{marginLeft:'auto',fontSize:11,color:'var(--t2)'}}>{app.cat}</span>
                  </a>
                ))}
              </div>
            )}

            {/* Footer */}
            <div style={{padding:'8px 16px 12px',display:'flex',alignItems:'center',gap:12,borderTop:'1px solid var(--b0)',marginTop:4}}>
              <span style={{fontSize:11,color:'var(--t2)'}}>
                <kbd style={{background:'var(--bg-4)',border:'1px solid var(--b1)',borderRadius:4,padding:'1px 5px',fontSize:10,fontFamily:'monospace'}}>↵</kbd>
                {' '}to open
              </span>
              <span style={{fontSize:11,color:'var(--t2)'}}>
                <kbd style={{background:'var(--bg-4)',border:'1px solid var(--b1)',borderRadius:4,padding:'1px 5px',fontSize:10,fontFamily:'monospace'}}>Esc</kbd>
                {' '}to close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
