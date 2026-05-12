import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'

const P_CONFIG = {
  high: { color:'var(--red)',   dim:'var(--red-dim)',   label:'High' },
  mid:  { color:'var(--amber)', dim:'var(--amber-dim)', label:'Mid'  },
  low:  { color:'var(--green)', dim:'var(--green-dim)', label:'Low'  },
}

export default function Tasks({ todos, setTodos }) {
  const [input, setInput] = useState('')
  const [priority, setPriority] = useState('mid')

  const done  = todos.filter(t=>t.done).length
  const total = todos.length
  const prog  = total ? Math.round((done/total)*100) : 0

  function add() {
    if (!input.trim()) return
    setTodos(t => [{ id:Date.now(), text:input.trim(), done:false, priority }, ...t])
    setInput('')
  }
  function toggle(id) { setTodos(t=>t.map(x=>x.id===id?{...x,done:!x.done}:x)) }
  function remove(id) { setTodos(t=>t.filter(x=>x.id!==id)) }
  function clearDone() { setTodos(t=>t.filter(x=>!x.done)) }

  return (
    <div style={{padding:'52px 56px 80px'}}>
      <div style={{marginBottom:36}}>
        <h2 style={{fontSize:30,fontWeight:700,letterSpacing:'-0.04em',color:'var(--t0)',marginBottom:6}}>Tasks</h2>
        <p style={{fontSize:14,color:'var(--t2)',marginBottom:24}}>
          {done} of {total} completed · {prog}%
        </p>
        <div className="prog-track" style={{height:3}}>
          <motion.div className="prog-fill" animate={{width:`${prog}%`}} />
        </div>
      </div>

      {/* Input row */}
      <div style={{display:'flex',gap:10,marginBottom:36}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()}
          placeholder="Add a task…" style={{flex:1,padding:'11px 15px',fontSize:14}} />
        <select value={priority} onChange={e=>setPriority(e.target.value)}
          style={{padding:'11px 12px',fontSize:13,color:P_CONFIG[priority].color,background:'var(--bg-3)',width:'auto',borderRadius:'var(--r)'}}>
          <option value="high">High</option>
          <option value="mid">Mid</option>
          <option value="low">Low</option>
        </select>
        <motion.button whileHover={{scale:1.02}} whileTap={{scale:.97}} onClick={add}
          style={{padding:'11px 20px',borderRadius:'var(--r)',background:'var(--accent)',color:'#fff',fontSize:14,fontWeight:500,display:'flex',alignItems:'center',gap:6}}>
          <Plus size={15}/> Add
        </motion.button>
      </div>

      {/* Pending */}
      <div style={{marginBottom:10,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <p className="label">Pending ({todos.filter(t=>!t.done).length})</p>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:2,marginBottom:32}}>
        <AnimatePresence>
          {todos.filter(t=>!t.done).map(t => (
            <TodoRow key={t.id} todo={t} onToggle={()=>toggle(t.id)} onRemove={()=>remove(t.id)} />
          ))}
        </AnimatePresence>
        {todos.filter(t=>!t.done).length===0 && (
          <p style={{fontSize:14,color:'var(--t2)',padding:'20px 14px',textAlign:'center'}}>Nothing pending 🎉</p>
        )}
      </div>

      {/* Done */}
      {todos.filter(t=>t.done).length > 0 && (
        <>
          <div style={{marginBottom:10,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <p className="label">Completed ({done})</p>
            <button onClick={clearDone} style={{fontSize:13,color:'var(--t2)',transition:'color .12s'}}
              onMouseEnter={e=>e.target.style.color='var(--red)'} onMouseLeave={e=>e.target.style.color='var(--t2)'}>
              Clear all
            </button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:2,opacity:.5}}>
            <AnimatePresence>
              {todos.filter(t=>t.done).map(t => (
                <TodoRow key={t.id} todo={t} onToggle={()=>toggle(t.id)} onRemove={()=>remove(t.id)} />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  )
}

function TodoRow({ todo, onToggle, onRemove }) {
  const [hov, setHov] = useState(false)
  const pc = P_CONFIG[todo.priority]

  return (
    <motion.div layout initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0,x:-16}}
      transition={{type:'spring',stiffness:300,damping:28}}
      className="todo-row"
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background: hov ? 'rgba(255,255,255,0.025)' : 'transparent', padding:'10px 12px'}}>

      <motion.div whileTap={{scale:.82}} onClick={onToggle}
        className={`check-box${todo.done?' checked':''}`}>
        {todo.done && (
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </motion.div>

      <span style={{flex:1,fontSize:14,color:todo.done?'var(--t2)':'var(--t1)',
        textDecoration:todo.done?'line-through':'none',transition:'all .2s'}}>
        {todo.text}
      </span>

      <div style={{width:7,height:7,borderRadius:'50%',background:pc.color,opacity:.65,flexShrink:0}} />

      <AnimatePresence>
        {hov && (
          <motion.button initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={onRemove} style={{color:'var(--t3)',transition:'color .12s',flexShrink:0,padding:2,marginLeft:4}}
            onMouseEnter={e=>e.currentTarget.style.color='var(--red)'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--t3)'}>
            <Trash2 size={14}/>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
