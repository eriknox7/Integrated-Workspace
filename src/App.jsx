import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocalStorage } from './hooks/useLocalStorage'
import { DEFAULT_APPS, DEFAULT_TODOS, DEFAULT_STREAKS, ACCENTS } from './data/defaults'

import Dashboard     from './components/Dashboard'
import Launcher      from './components/Launcher'
import TasksNotes    from './components/TasksNotes'
import Focus         from './components/Focus'
import CmdSearch     from './components/CmdSearch'
import AddAppModal   from './components/AddAppModal'
import SettingsModal from './components/SettingsModal'
import AppGrid       from './components/AppGrid'
import settings from './assets/settings.png'
import iconApps from './assets/apps.png'

export default function App() {
  const [apps,      setApps]      = useLocalStorage('apps_v4',    DEFAULT_APPS)
  const [todos,     setTodos]     = useLocalStorage('todos_v3',   DEFAULT_TODOS)
  const [notes,     setNotes]     = useLocalStorage('notes_v2',   '')
  const [streaks,   setStreaks]   = useLocalStorage('streaks_v3', DEFAULT_STREAKS)
  const [focusMins, setFocusMins] = useLocalStorage('focusMins',  0)
  const [accent,    setAccent]    = useLocalStorage('accent_v2',  ACCENTS[0])
  const [focusMode, setFocusMode] = useLocalStorage('focusMode',  false)

  const [view,         setView]         = useState('home')
  const [cmdOpen,      setCmdOpen]      = useState(false)
  const [showAddApp,   setShowAddApp]   = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [gridOpen,     setGridOpen]     = useState(false)

  useEffect(() => {
    document.documentElement.style.setProperty('--accent',     accent.val)
    document.documentElement.style.setProperty('--accent-dim', accent.dim)
    document.documentElement.style.setProperty('--accent-b',   accent.border)
  }, [accent])

  const handleKey = useCallback(e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(o => !o) }
    if (e.key === 'Escape') { setGridOpen(false); setShowSettings(false) }
  }, [])
  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  const pv = {
    initial: { opacity:0, y:8 },
    animate: { opacity:1, y:0, transition:{ type:'spring', stiffness:300, damping:30 } },
    exit:    { opacity:0, transition:{ duration:.12 } },
  }

  function renderView() {
    switch(view) {
      case 'home':     return <Dashboard   key="home"    apps={apps} setApps={setApps} focusMode={focusMode} onOpenSearch={()=>setCmdOpen(true)} />
      case 'launcher': return <Launcher    key="launcher" apps={apps} setApps={setApps} focusMode={focusMode} onAdd={()=>setShowAddApp(true)} />
      case 'tasks':    return <TasksNotes  key="tasks"   todos={todos} setTodos={setTodos} notes={notes} setNotes={setNotes} />
      case 'focus':    return <Focus       key="focus"   streaks={streaks} setStreaks={setStreaks} focusMins={focusMins} onFocusMinute={d=>setFocusMins(m=>m+d)} />
      default:         return null
    }
  }

  return (
    <>
      <div className="ambient" />
      <div className="noise" />

      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', position:'relative', zIndex:2 }}>

        {/* ── Top bar ── */}
        <header style={{
          position:'sticky', top:0, zIndex:50,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 24px', height:52,
          background:'rgba(12,14,18,0.85)', backdropFilter:'blur(16px)',
          borderBottom:'1px solid var(--b0)',
        }}>
          
        {/* Left: logo + nav */}
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <button onClick={()=>setView('home')}
            style={{ display:'flex', alignItems:'center', gap:7, padding:'5px 8px', borderRadius:8,
              color: view==='home' ? 'var(--t0)' : 'var(--t1)', transition:'all .15s', fontWeight:600, fontSize:14 }}>

            <span style={{ display:'flex', alignItems:'center' }}>
              <span style={{ fontSize: 28, lineHeight: 1, marginRight: 6 }}>
                ∫
              </span>

              <span style={{ fontSize: 16 }}>
                work • space
              </span>
            </span>
          </button>

          <div style={{ width:1, height:16, background:'var(--b1)', margin:'0 4px' }} />

          {[
            { id:'launcher', label:'Apps' }
          ].map(n => (
            <button key={n.id} onClick={()=>setView(n.id)}
              style={{
                padding:'5px 12px', borderRadius:8, fontSize:13, fontWeight:500,
                cursor:'pointer', transition:'all .15s',
                background: view===n.id ? 'rgba(255,255,255,0.07)' : 'transparent',
                color: view===n.id ? 'var(--t0)' : 'var(--t2)',
                transform:'translateY(1px)'
              }}>
              {n.label}
            </button>
          ))}
        </div>

          {/* Right: focus toggle + settings + grid */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={()=>setFocusMode(f=>!f)}
              style={{
                padding:'5px 12px', borderRadius:8, fontSize:12, fontWeight:500,
                cursor:'pointer', transition:'all .15s',
                background: 'transparent',
                border: `1px solid ${focusMode ? '#fff' : 'var(--b1)'}`,
                color: focusMode ? '#fff' : 'var(--t2)',
              }}>
              {focusMode ? 'Focusing' : 'Focus'}
          </button>
            
            {/* App grid (Google Workspace style) */}
              <button onClick={()=>setGridOpen(g=>!g)}
                style={{ width:34, height:34, borderRadius:'50%', display:'flex', alignItems:'center',
                  justifyContent:'center', background: gridOpen ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                  border:'1px solid var(--b1)', color:'var(--t2)', fontSize:15, transition:'all .15s' }}
                title="Apps">
                
              <img
                src={iconApps}
                alt="Apps"
                style={{ width:24, height:24 }}
              />                

              </button>

            {/* Settings */}
            <div style={{ position:'relative' }}>
            <button onClick={()=>setShowSettings(true)}
              style={{ width:34, height:34, borderRadius:'50%', display:'flex', alignItems:'center',
                justifyContent:'center', background:'rgba(255,255,255,0.04)',
                border:'1px solid var(--b1)', color:'var(--t2)', fontSize:15, transition:'all .15s' }}
              title="Settings">
              
              <img
                src={settings}
                alt="Settings"
                style={{ width:24, height:24 }}
              />

            </button>



              <AnimatePresence>
                {gridOpen && <AppGrid onNavigate={(v)=>{ setView(v); setGridOpen(false) }} onClose={()=>setGridOpen(false)} focusMode={focusMode} setFocusMode={setFocusMode} />}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <main style={{ flex:1, overflowY:'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div key={view} variants={pv} initial="initial" animate="animate" exit="exit">
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CmdSearch open={cmdOpen} onClose={()=>setCmdOpen(false)} apps={apps} />

      <AnimatePresence>
        {showAddApp   && <AddAppModal   key="add" onAdd={a=>setApps(x=>[...x,a])} onClose={()=>setShowAddApp(false)} />}
        {showSettings && <SettingsModal key="set" accent={accent} setAccent={setAccent} onClose={()=>setShowSettings(false)} onReset={()=>{localStorage.clear();window.location.reload()}} />}
      </AnimatePresence>
    </>
  )
}
