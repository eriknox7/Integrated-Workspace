import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Save, Trash2, Plus } from 'lucide-react'

export default function Notes({ notes, setNotes }) {
  const [saved, setSaved] = useState(false)
  const timer = useRef(null)

  function onChange(e) {
    setNotes(e.target.value)
    setSaved(false)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setSaved(true), 800)
  }

  const words = notes.trim() ? notes.trim().split(/\s+/).length : 0
  const chars = notes.length

  return (
    <div style={{padding:'40px 32px 80px',maxWidth:720,margin:'0 auto'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28}}>
        <div>
          <h2 style={{fontSize:20,fontWeight:700,letterSpacing:'-0.03em',color:'var(--t0)',marginBottom:4}}>Notes</h2>
          <p style={{fontSize:13,color:'var(--t2)'}}>Quick thoughts, links, and reminders.</p>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <span style={{fontSize:12,color:'var(--t2)',fontFamily:'JetBrains Mono,monospace'}}>{words}w · {chars}c</span>
          {saved && (
            <motion.span initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}
              style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:'var(--green)'}}>
              <Save size={12}/> Saved
            </motion.span>
          )}
        </div>
      </div>

      <motion.textarea
        initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
        transition={{type:'spring',stiffness:280,damping:28}}
        value={notes}
        onChange={onChange}
        placeholder={"Jot things down here…\n\nIdeas, links, reminders, anything. Auto-saves as you type."}
        style={{
          width:'100%', minHeight:'calc(100vh - 260px)',
          background:'rgba(255,255,255,0.02)', border:'1px solid var(--b1)',
          borderRadius:'var(--r-lg)', padding:'20px 22px',
          fontSize:14, lineHeight:1.75, color:'var(--t0)',
          resize:'none', fontFamily:"'Inter',sans-serif",
          outline:'none', boxShadow:'none',
        }}
        onFocus={e=>{e.target.style.borderColor='var(--b2)';e.target.style.boxShadow='none'}}
        onBlur={e=>{e.target.style.borderColor='var(--b1)'}}
      />
    </div>
  )
}
