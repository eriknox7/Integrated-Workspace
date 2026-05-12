import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Save } from 'lucide-react'

const P = {
  high: { color:'var(--red)',   label:'High' },
  mid:  { color:'var(--amber)', label:'Mid'  },
  low:  { color:'var(--green)', label:'Low'  },
}

export default function TasksNotes({ todos, setTodos, notes, setNotes }) {
  const [input, setInput]       = useState('')
  const [priority, setPriority] = useState('mid')
  const [saved, setSaved]       = useState(false)
  const saveTimer               = useRef(null)

  const done  = todos.filter(t => t.done).length
  const total = todos.length
  const prog  = total ? Math.round((done / total) * 100) : 0

  function add() {
    if (!input.trim()) return
    setTodos(t => [{ id:Date.now(), text:input.trim(), done:false, priority }, ...t])
    setInput('')
  }
  function toggle(id) { setTodos(t => t.map(x => x.id===id ? {...x,done:!x.done} : x)) }
  function remove(id) { setTodos(t => t.filter(x => x.id!==id)) }
  function clearDone() { setTodos(t => t.filter(x => !x.done)) }
  function onNotesChange(e) {
    setNotes(e.target.value); setSaved(false)
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => setSaved(true), 900)
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, minHeight:'calc(100vh - 52px)' }}>

      {/* ── LEFT: Tasks ── */}
      <div style={{ padding:'56px 56px 96px', borderRight:'1px solid rgba(255,255,255,0.04)', overflowY:'auto' }}>
        <div style={{ marginBottom:32 }}>
          <h2 style={{ fontSize:24, fontWeight:700, letterSpacing:'-0.04em', color:'var(--t0)', marginBottom:4 }}>Tasks</h2>
          <p style={{ fontSize:13, color:'var(--t2)', marginBottom:20 }}>{done} of {total} completed</p>
          <div className="prog-track">
            <motion.div className="prog-fill" animate={{ width:`${prog}%` }} />
          </div>
        </div>

        {/* Input */}
        <div style={{ display:'flex', gap:8, marginBottom:28 }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()}
            placeholder="Add a task…" style={{ flex:1, padding:'10px 14px', fontSize:14, borderRadius:'var(--r)' }} />
          <select value={priority} onChange={e=>setPriority(e.target.value)}
            style={{ padding:'10px 10px', fontSize:12, color:P[priority].color, background:'var(--bg-3)',
              border:'1px solid var(--b1)', borderRadius:'var(--r)', width:'auto' }}>
            <option value="high">High</option>
            <option value="mid">Mid</option>
            <option value="low">Low</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: .96 }}
            onClick={add}
            style={{
              padding: '12px 22px',
              borderRadius: 8,
              background: 'rgba(88, 101, 242, 0.08)',
              border: '1px solid rgba(88, 101, 242, 0.28)',
              color: '#7c8cff',
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 8px 30px rgba(50,70,200,.10)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
              transition: 'all .2s ease'
            }}
          >
            <Plus size={16}/>Add
          </motion.button>
        </div>

        {/* Pending */}
        <p className="label" style={{ marginBottom:10 }}>Pending ({todos.filter(t=>!t.done).length})</p>
        <div style={{ display:'flex', flexDirection:'column', gap:2, marginBottom:28 }}>
          <AnimatePresence>
            {todos.filter(t=>!t.done).map(t => (
              <TodoRow key={t.id} todo={t} onToggle={()=>toggle(t.id)} onRemove={()=>remove(t.id)} />
            ))}
          </AnimatePresence>
          {todos.filter(t=>!t.done).length===0 && (
            <p style={{ fontSize:13, color:'var(--t2)', padding:'16px 0', textAlign:'center' }}>Nothing pending</p>
          )}
        </div>

        {/* Done */}
        {done > 0 && <>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
            <p className="label">Completed ({done})</p>
            <button onClick={clearDone} style={{ fontSize:12, color:'var(--t2)', transition:'color .12s', cursor:'pointer' }}
              onMouseEnter={e=>e.target.style.color='var(--red)'} onMouseLeave={e=>e.target.style.color='var(--t2)'}>
              Clear all
            </button>
          </div>
          <div style={{ opacity:.45, display:'flex', flexDirection:'column', gap:2 }}>
            <AnimatePresence>
              {todos.filter(t=>t.done).map(t => (
                <TodoRow key={t.id} todo={t} onToggle={()=>toggle(t.id)} onRemove={()=>remove(t.id)} />
              ))}
            </AnimatePresence>
          </div>
        </>}
      </div>

      {/* ── RIGHT: Notes ── */}
      <div style={{ padding:'48px 48px 80px', display:'flex', flexDirection:'column' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:32 }}>
          <div>
            <h2 style={{ fontSize:24, fontWeight:700, letterSpacing:'-0.04em', color:'var(--t0)', marginBottom:4 }}>Notes</h2>
            <p style={{ fontSize:13, color:'var(--t2)' }}>Quick thoughts and reminders</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:11, color:'var(--t3)', fontFamily:'JetBrains Mono,monospace' }}>
              {notes.trim() ? notes.trim().split(/\s+/).length : 0}w
            </span>
            <AnimatePresence>
              {saved && (
                <motion.span initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'var(--green)' }}>
                  <Save size={11}/> Saved
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <textarea
          value={notes} onChange={onNotesChange}
          placeholder={"Jot things down here…\n\nIdeas, links, reminders. Auto-saves as you type."}
          style={{
            flex:1, width:'100%', minHeight:400,
            background:'rgba(255,255,255,0.02)', border:'1px solid var(--b1)',
            borderRadius:12, padding:'18px 20px',
            fontSize:14, lineHeight:1.8, color:'var(--t0)',
            resize:'none', fontFamily:"'Inter',sans-serif", outline:'none',
            transition:'border-color .15s',
          }}
          onFocus={e => e.target.style.borderColor='var(--b2)'}
          onBlur={e => e.target.style.borderColor='var(--b1)'}
        />
      </div>
    </div>
  )
}

function TodoRow({ todo, onToggle, onRemove }) {
  const [hov, setHov] = useState(false)
  const pc = P[todo.priority]

  return (
    <motion.div layout initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}} exit={{opacity:0,x:-12}}
      transition={{type:'spring',stiffness:300,damping:28}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px',
        borderRadius:8, background: hov ? 'rgba(255,255,255,0.03)' : 'transparent', transition:'background .1s' }}>

      <motion.div whileTap={{scale:.82}} onClick={onToggle}
        className={`check-box${todo.done?' checked':''}`}>
        {todo.done && (
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </motion.div>

      <span style={{ flex:1, fontSize:14, color: todo.done ? 'var(--t2)' : 'var(--t1)',
        textDecoration: todo.done ? 'line-through' : 'none', transition:'all .2s' }}>
        {todo.text}
      </span>

      <div style={{ width:6, height:6, borderRadius:'50%', background:pc.color, opacity:.65, flexShrink:0 }} />

      <AnimatePresence>
        {hov && (
          <motion.button initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={onRemove} style={{ color:'var(--t3)', padding:2, marginLeft:2, transition:'color .12s' }}
            onMouseEnter={e=>e.currentTarget.style.color='var(--red)'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--t3)'}>
            <Trash2 size={13}/>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
