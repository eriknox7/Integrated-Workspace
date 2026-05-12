import { useState } from 'react'
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'

const PRIORITY_CONFIG = {
  high: { label: 'High', color: 'var(--red)',   bg: 'var(--redbg)'   },
  mid:  { label: 'Mid',  color: 'var(--amber)', bg: 'var(--amberbg)' },
  low:  { label: 'Low',  color: 'var(--green)', bg: 'var(--greenbg)' },
}

export default function TodoPanel({ todos, setTodos, theme }) {
  const [input, setInput]       = useState('')
  const [priority, setPriority] = useState('mid')

  const card   = theme === 'dark' ? '#111118' : '#ffffff'
  const border = theme === 'dark' ? '#2a2a38' : '#d8d8ec'
  const dim    = theme === 'dark' ? '#9999b0' : '#7070a0'
  const bg3    = theme === 'dark' ? '#1a1a24' : '#eeeef8'
  const bg4    = theme === 'dark' ? '#22222e' : '#e8e8f4'
  const textPrimary = theme === 'dark' ? '#e8e8f0' : '#1a1a2e'

  const done = todos.filter(t => t.done).length
  const prog = todos.length ? Math.round((done / todos.length) * 100) : 0

  function add() {
    if (!input.trim()) return
    setTodos(t => [...t, { id: Date.now(), text: input.trim(), done: false, priority }])
    setInput('')
  }

  function toggle(id) {
    setTodos(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x))
  }

  function remove(id) {
    setTodos(t => t.filter(x => x.id !== id))
  }

  function clearDone() {
    setTodos(t => t.filter(x => !x.done))
  }

  return (
    <div className="rounded-2xl p-4" style={{ background: card, border: `1px solid ${border}` }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold tracking-widest uppercase" style={{ color: dim }}>
          ✅ To-Do
        </h3>
        {done > 0 && (
          <button
            onClick={clearDone}
            className="text-xs px-2 py-0.5 rounded-lg transition-all"
            style={{ color: dim, background: bg3 }}
          >
            Clear done ({done})
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1.5" style={{ color: dim }}>
          <span>{done}/{todos.length} completed</span>
          <span>{prog}%</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: border }}>
          <div
            className="h-full rounded-full progress-shine"
            style={{ width: `${prog}%`, transition: 'width 0.4s ease' }}
          />
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Add a task..."
          className="flex-1 rounded-xl px-3 py-1.5 text-sm outline-none"
          style={{
            background: bg3,
            border: `1px solid ${border}`,
            color: textPrimary,
          }}
        />
        <select
          value={priority}
          onChange={e => setPriority(e.target.value)}
          className="rounded-xl px-2 py-1.5 text-xs outline-none cursor-pointer"
          style={{
            background: bg3,
            border: `1px solid ${border}`,
            color: PRIORITY_CONFIG[priority].color,
          }}
        >
          <option value="high">🔴 High</option>
          <option value="mid">🟡 Mid</option>
          <option value="low">🟢 Low</option>
        </select>
        <button
          onClick={add}
          className="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          <Plus size={15} />
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
        {todos.length === 0 && (
          <div className="text-center py-6 text-sm" style={{ color: dim }}>No tasks yet. Add one above!</div>
        )}
        {todos.map(t => (
          <TodoItem
            key={t.id}
            todo={t}
            theme={theme}
            bg4={bg4}
            dim={dim}
            textPrimary={textPrimary}
            border={border}
            onToggle={() => toggle(t.id)}
            onRemove={() => remove(t.id)}
          />
        ))}
      </div>
    </div>
  )
}

function TodoItem({ todo, theme, bg4, dim, textPrimary, border, onToggle, onRemove }) {
  const [hovered, setHovered] = useState(false)
  const pc = PRIORITY_CONFIG[todo.priority]

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl group"
      style={{
        background: hovered ? (theme === 'dark' ? '#22222e' : '#e8e8f4') : bg4,
        transition: 'background 0.15s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button onClick={onToggle} className="shrink-0 transition-all">
        {todo.done
          ? <CheckCircle2 size={16} style={{ color: 'var(--green)' }} />
          : <Circle       size={16} style={{ color: dim }} />
        }
      </button>

      <span
        className="flex-1 text-sm leading-tight"
        style={{
          color: todo.done ? dim : textPrimary,
          textDecoration: todo.done ? 'line-through' : 'none',
        }}
      >
        {todo.text}
      </span>

      <span
        className="text-xs px-1.5 py-0.5 rounded-md font-semibold shrink-0"
        style={{ background: pc.bg, color: pc.color }}
      >
        {todo.priority}
      </span>

      <button
        onClick={onRemove}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 size={13} style={{ color: 'var(--red)' }} />
      </button>
    </div>
  )
}
