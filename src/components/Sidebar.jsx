import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Grid2x2, CheckSquare, Timer,
  StickyNote, Settings, ChevronLeft, Zap, Target
} from 'lucide-react'

const ICONS = { LayoutDashboard, Grid2x2, CheckSquare, Timer, StickyNote }

const NAV = [
  { id:'dashboard', label:'Dashboard', Icon:LayoutDashboard },
  { id:'launcher',  label:'Launcher',  Icon:Grid2x2 },
  { id:'tasks',     label:'Tasks',     Icon:CheckSquare },
  { id:'focus',     label:'Focus',     Icon:Timer },
  { id:'notes',     label:'Notes',     Icon:StickyNote },
]

export default function Sidebar({ active, setActive, collapsed, setCollapsed, focusMode, setFocusMode, onSettings }) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 200 }}
      transition={{ type:'spring', stiffness:300, damping:30 }}
      style={{
        background:'var(--bg-1)', borderRight:'1px solid var(--b0)',
        display:'flex', flexDirection:'column', height:'100vh',
        position:'sticky', top:0, flexShrink:0, overflow:'hidden', zIndex:10,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: collapsed ? '16px 0' : '16px 14px',
        display:'flex', alignItems:'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        borderBottom:'1px solid var(--b0)', gap:8, height:56,
      }}>
        {!collapsed && (
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <Zap size={16} style={{color:'var(--accent)',flexShrink:0}} />
            <span style={{fontWeight:600,fontSize:14,color:'var(--t0)',letterSpacing:'-0.02em'}}>SadiqOS</span>
          </div>
        )}
        {collapsed && <Zap size={16} style={{color:'var(--accent)'}} />}
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} style={{color:'var(--t2)',padding:4,borderRadius:6,transition:'color .15s'}}
            onMouseEnter={e=>e.target.style.color='var(--t0)'} onMouseLeave={e=>e.target.style.color='var(--t2)'}>
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{flex:1,padding:'10px 8px',display:'flex',flexDirection:'column',gap:1}}>
        {!collapsed && <p className="label" style={{padding:'8px 6px 4px',marginBottom:2}}>Navigation</p>}
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`nav-item${active === id ? ' active' : ''}`}
            onClick={() => { setActive(id); collapsed && setCollapsed(false) }}
            style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '7px' : '6px 10px' }}
            title={collapsed ? label : undefined}
          >
            <Icon size={15} style={{flexShrink:0, color: active===id ? 'var(--accent)' : 'var(--t2)'}} />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}

        <div style={{height:1,background:'var(--b0)',margin:'8px 4px'}} />

        <button
          className={`nav-item${focusMode ? ' active' : ''}`}
          onClick={() => setFocusMode(f => !f)}
          style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '7px' : '6px 10px' }}
          title={collapsed ? 'Focus Mode' : undefined}
        >
          <Target size={15} style={{flexShrink:0, color: focusMode ? 'var(--amber)' : 'var(--t2)'}} />
          {!collapsed && <span style={{color: focusMode ? 'var(--amber)' : undefined}}>Focus Mode</span>}
          {!collapsed && focusMode && (
            <span className="badge" style={{marginLeft:'auto',background:'var(--amber-dim)',color:'var(--amber)',border:'1px solid rgba(232,160,69,.15)',fontSize:10}}>ON</span>
          )}
        </button>
      </nav>

      {/* Bottom */}
      <div style={{padding:'10px 8px',borderTop:'1px solid var(--b0)'}}>
        <button
          className="nav-item"
          onClick={onSettings}
          style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '7px' : '6px 10px', width:'100%' }}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings size={15} style={{flexShrink:0,color:'var(--t2)'}} />
          {!collapsed && <span>Settings</span>}
        </button>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="nav-item"
            style={{justifyContent:'center',padding:'7px',width:'100%',marginTop:4}}
            title="Expand sidebar"
          >
            <ChevronLeft size={14} style={{transform:'rotate(180deg)',color:'var(--t2)'}} />
          </button>
        )}
      </div>
    </motion.aside>
  )
}
