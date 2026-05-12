import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

import viewApps from "../assets/viewApps.png"
import taskNotes from "../assets/taskNotes.png"
import iconFocus from "../assets/focus.png"

const ITEMS = [
  { id:'launcher', icon:viewApps,  label:'Apps'},
  { id:'tasks',    icon:taskNotes, label:'Tasks & Notes'},
  { id:'focus',    icon:iconFocus, label:'Focus'}
]

export default function AppGrid({ onNavigate, onClose, focusMode, setFocusMode }) {
  const ref = useRef()

  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) onClose() }
    setTimeout(() => document.addEventListener('mousedown', handle), 0)
    return () => document.removeEventListener('mousedown', handle)
  }, [onClose])

  return (
    <motion.div ref={ref}
      initial={{ opacity:0, scale:.95, y:-8 }}
      animate={{ opacity:1, scale:1, y:0 }}
      exit={{ opacity:0, scale:.95, y:-8 }}
      transition={{ type:'spring', stiffness:380, damping:28 }}
      style={{
        position:'absolute', top:'calc(100% + 10px)', right:0,
        width:220, background:'var(--bg-2)',
        border:'1px solid var(--b2)', borderRadius:16,
        boxShadow:'0 20px 60px rgba(0,0,0,.5)',
        padding:16, zIndex:200,
      }}>

      <p style={{ fontSize:10, fontWeight:600, letterSpacing:'.07em', textTransform:'uppercase',
        color:'var(--t3)', marginBottom:10, padding:'0 4px' }}>Navigate</p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6, marginBottom:14 }}>
        {ITEMS.map(item => (
          <button key={item.id} onClick={()=>onNavigate(item.id)}
            style={{
              display:'flex', flexDirection:'column', alignItems:'center', gap:6,
              padding:'12px 6px', borderRadius:10, cursor:'pointer', transition:'all .15s',
              background:'transparent', border:'1px solid transparent',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor='var(--b1)' }}
            onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent' }}>
            <img src={item.icon} alt={item.label} style={{width:22, height:22, objectFit:'contain'}}
/>
            <span style={{ fontSize:11, color:'var(--t1)', fontWeight:500, textAlign:'center', lineHeight:1.3 }}>{item.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}