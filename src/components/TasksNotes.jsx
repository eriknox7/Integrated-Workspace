import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, CheckCheck, StickyNote, ListTodo } from 'lucide-react'

const P = {
  high: { color: 'var(--red)',   dim: 'var(--red-dim)',   label: 'High' },
  mid:  { color: 'var(--amber)', dim: 'var(--amber-dim)', label: 'Mid'  },
  low:  { color: 'var(--green)', dim: 'var(--green-dim)', label: 'Low'  },
}

export default function TasksNotes({ todos, setTodos, notes, setNotes }) {
  const [input,     setInput]     = useState('')
  const [priority,  setPriority]  = useState('mid')
  const [saved,     setSaved]     = useState(false)
  const [noteFocus, setNoteFocus] = useState(false)
  const saveTimer = useRef(null)

  const done  = todos.filter(t => t.done).length
  const total = todos.length
  const prog  = total ? Math.round((done / total) * 100) : 0
  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0

  function add() {
    if (!input.trim()) return
    setTodos(t => [{ id: Date.now(), text: input.trim(), done: false, priority }, ...t])
    setInput('')
  }
  function toggle(id) { setTodos(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x)) }
  function remove(id) { setTodos(t => t.filter(x => x.id !== id)) }
  function clearDone() { setTodos(t => t.filter(x => !x.done)) }
  function onNotesChange(e) {
    setNotes(e.target.value); setSaved(false)
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => setSaved(true), 900)
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 52px)',
      background: 'var(--bg-0)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '48px 32px 80px',
    }}>

      {/* ── CENTERED CONTAINER ── */}
      <div style={{
        width: '100%',
        maxWidth: 1080,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
        alignItems: 'start',
      }}>

        {/* ══ TASKS PANEL ══ */}
        <div style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid var(--b1)',
          borderRadius: 'var(--r-xl)',
          overflow: 'hidden',
        }}>

          {/* Panel header */}
          <div style={{
            padding: '22px 24px 18px',
            borderBottom: '1px solid var(--b0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'var(--accent-dim)', border: '1px solid var(--accent-b)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <ListTodo size={14} color="var(--accent)" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--t0)', lineHeight: 1.2 }}>Tasks</p>
                <p style={{ fontSize: 11, color: 'var(--t2)', marginTop: 1 }}>{done} of {total} completed</p>
              </div>
            </div>

            {/* Circular progress */}
            <div style={{ position: 'relative', width: 44, height: 44 }}>
              <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="22" cy="22" r="17" fill="none" stroke="var(--b1)" strokeWidth="2.5" />
                <motion.circle
                  cx="22" cy="22" r="17" fill="none"
                  stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 17}`}
                  animate={{ strokeDashoffset: 2 * Math.PI * 17 * (1 - prog / 100) }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </svg>
              <span style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: 'var(--t1)',
                fontFamily: 'JetBrains Mono, monospace',
              }}>{prog}%</span>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 2, background: 'var(--b0)' }}>
            <motion.div
              animate={{ width: `${prog}%` }}
              style={{ height: '100%', background: 'var(--accent)', borderRadius: 99 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Input area */}
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--b0)' }}>
            <div style={{
              display: 'flex', gap: 8,
              background: 'var(--bg-0)',
              border: '1px solid var(--b1)',
              borderRadius: 'var(--r)',
              padding: '5px 5px 5px 12px',
              transition: 'border-color .15s, box-shadow .15s',
            }}
              onFocusCapture={e => { e.currentTarget.style.borderColor = 'var(--accent-b)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-dim)' }}
              onBlurCapture={e => { e.currentTarget.style.borderColor = 'var(--b1)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && add()}
                placeholder="What needs to be done?"
                style={{
                  flex: 1, background: 'none', border: 'none',
                  outline: 'none', fontSize: 13, color: 'var(--t0)', boxShadow: 'none',
                }}
              />
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                style={{
                  background: P[priority].dim,
                  border: `1px solid ${P[priority].color}44`,
                  color: P[priority].color,
                  fontSize: 11, fontWeight: 600,
                  padding: '4px 8px', borderRadius: 6,
                  cursor: 'pointer', outline: 'none',
                }}
              >
                <option value="high">High</option>
                <option value="mid">Mid</option>
                <option value="low">Low</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}
                onClick={add}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '7px 13px', borderRadius: 7,
                  background: 'var(--accent)', color: '#fff',
                  fontSize: 12, fontWeight: 600,
                  boxShadow: '0 3px 12px rgba(91,106,248,0.35)',
                  flexShrink: 0,
                }}
              >
                <Plus size={13} strokeWidth={2.5} /> Add
              </motion.button>
            </div>
          </div>

          {/* Task list */}
          <div style={{ padding: '14px 16px 20px' }}>

            {/* Pending */}
            {todos.filter(t => !t.done).length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p className="label" style={{ marginBottom: 8, paddingLeft: 4 }}>
                  Pending · {todos.filter(t => !t.done).length}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <AnimatePresence>
                    {todos.filter(t => !t.done).map(t => (
                      <TodoRow key={t.id} todo={t} onToggle={() => toggle(t.id)} onRemove={() => remove(t.id)} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Empty */}
            {total === 0 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ textAlign: 'center', padding: '28px 0', fontSize: 13, color: 'var(--t2)' }}>
                No tasks yet — add one above
              </motion.p>
            )}

            {/* Done */}
            {done > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, paddingLeft: 4 }}>
                  <p className="label">Completed · {done}</p>
                  <button
                    onClick={clearDone}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--t2)', transition: 'color .12s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--t2)'}
                  >
                    <CheckCheck size={11} /> Clear all
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, opacity: 0.38 }}>
                  <AnimatePresence>
                    {todos.filter(t => t.done).map(t => (
                      <TodoRow key={t.id} todo={t} onToggle={() => toggle(t.id)} onRemove={() => remove(t.id)} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══ NOTES PANEL ══ */}
        <motion.div
          animate={{
            borderColor: noteFocus ? 'var(--accent-b)' : 'rgba(255,255,255,0.07)',
            boxShadow: noteFocus
              ? '0 0 0 3px var(--accent-dim), 0 20px 60px rgba(0,0,0,0.2)'
              : '0 8px 32px rgba(0,0,0,0.12)',
          }}
          transition={{ duration: 0.2 }}
          style={{
            background: 'rgba(255,255,255,0.018)',
            border: '1px solid var(--b1)',
            borderRadius: 'var(--r-xl)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Gradient top strip */}
          <div style={{
            height: 3,
            background: noteFocus
              ? 'linear-gradient(90deg, var(--accent), var(--amber))'
              : 'linear-gradient(90deg, var(--b1), var(--b0))',
            transition: 'background .3s',
          }} />

          {/* Panel header */}
          <div style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid var(--b0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'rgba(232,160,69,0.1)', border: '1px solid rgba(232,160,69,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <StickyNote size={14} color="var(--amber)" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--t0)', lineHeight: 1.2 }}>Notes</p>
                <p style={{ fontSize: 11, color: 'var(--t2)', marginTop: 1 }}>Quick thoughts & reminders</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AnimatePresence>
                {saved && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ fontSize: 11, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
                    Saved
                  </motion.span>
                )}
              </AnimatePresence>
              <span style={{
                fontSize: 11, color: 'var(--t3)',
                fontFamily: 'JetBrains Mono, monospace',
                background: 'var(--bg-3)', border: '1px solid var(--b0)',
                padding: '2px 8px', borderRadius: 6,
              }}>
                {wordCount}w
              </span>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={notes}
            onChange={onNotesChange}
            onFocus={() => setNoteFocus(true)}
            onBlur={() => setNoteFocus(false)}
            placeholder={"Jot things down here…\n\nIdeas, links, reminders — auto-saves as you type."}
            style={{
              flex: 1,
              width: '100%',
              minHeight: 420,
              background: 'transparent',
              border: 'none', outline: 'none', boxShadow: 'none',
              padding: '20px 24px',
              fontSize: 13.5,
              lineHeight: 1.9,
              color: 'var(--t0)',
              resize: 'none',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          />

          {/* Footer */}
          <div style={{
            padding: '10px 24px',
            borderTop: '1px solid var(--b0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'JetBrains Mono, monospace' }}>
              {notes.length} chars
            </span>
            <span style={{ fontSize: 11, color: 'var(--t3)' }}>
              Auto-saves · Ctrl+A to select all
            </span>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

function TodoRow({ todo, onToggle, onRemove }) {
  const [hov, setHov] = useState(false)
  const pc = P[todo.priority]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 10px',
        borderRadius: 8,
        background: hov ? 'rgba(255,255,255,0.04)' : 'transparent',
        border: hov ? '1px solid var(--b1)' : '1px solid transparent',
        boxShadow: hov ? '0 4px 14px rgba(0,0,0,0.1)' : 'none',
        transform: hov ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'all .15s ease',
      }}
    >
      <motion.div
        whileTap={{ scale: 0.78 }}
        onClick={onToggle}
        style={{
          width: 17, height: 17, borderRadius: 5, flexShrink: 0,
          border: todo.done ? 'none' : '1.5px solid var(--b2)',
          background: todo.done ? 'var(--accent)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all .15s',
          boxShadow: todo.done ? '0 2px 8px rgba(91,106,248,0.4)' : 'none',
        }}
      >
        {todo.done && (
          <svg width="8" height="8" viewBox="0 0 9 9" fill="none">
            <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </motion.div>

      <span style={{
        flex: 1, fontSize: 13.5, lineHeight: 1.5,
        color: todo.done ? 'var(--t2)' : 'var(--t1)',
        textDecoration: todo.done ? 'line-through' : 'none',
        transition: 'all .2s',
      }}>
        {todo.text}
      </span>

      <span style={{
        fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
        padding: '2px 7px', borderRadius: 99,
        color: pc.color, background: pc.dim,
        border: `1px solid ${pc.color}33`,
        flexShrink: 0,
        opacity: todo.done ? 0.35 : 1,
        transition: 'opacity .2s',
      }}>
        {pc.label}
      </span>

      <AnimatePresence>
        {hov && (
          <motion.button
            initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.75 }}
            onClick={onRemove}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 22, height: 22, borderRadius: 6,
              color: 'var(--t3)', background: 'transparent',
              transition: 'all .12s', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.background = 'var(--red-dim)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--t3)'; e.currentTarget.style.background = 'transparent' }}
          >
            <Trash2 size={12} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}