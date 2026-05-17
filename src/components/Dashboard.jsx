import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, X, GripVertical, Check, Link, ExternalLink } from 'lucide-react'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  SortableContext, rectSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { getGreeting, fmtTime, fmtDate, pick } from '../utils/time'
import { MOTIVATIONS, FOCUS_HIDDEN } from '../data/defaults'

const motive = pick(MOTIVATIONS)

export default function Dashboard({ apps, setApps, focusMode, onOpenSearch }) {

  const [username, setUsername] = useState(
    localStorage.getItem('username') || ''
  )

  useEffect(() => {
    if (!localStorage.getItem('username')) {
      const name = prompt('What should we call you?')

      if (name && name.trim()) {
        localStorage.setItem('username', name.trim())
        setUsername(name.trim())
      }
    }
  }, [])

  const [now, setNow] = useState(new Date())
  const [picking, setPicking] = useState(false)   // app picker modal

  // Quick links (pinned)
  const [pins, setPins] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pinned_links') || '[]') } catch { return [] }
  })
  const [addingPin, setAddingPin] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const pinRef = useRef(null)

  function savePins(next) { setPins(next); localStorage.setItem('pinned_links', JSON.stringify(next)) }
  function commitPin() {
    const raw = pinInput.trim()
    if (!raw) { setAddingPin(false); return }
    const url = raw.startsWith('http') ? raw : 'https://' + raw
    let label = raw
    try { label = new URL(url).hostname.replace('www.', '') } catch { }
    if (pins.length >= 3) return
    savePins([...pins, { id: Date.now(), url, label }])
    setPinInput('')
    setAddingPin(false)
  }
  function removePin(id) { savePins(pins.filter(p => p.id !== id)) }

  useEffect(() => { if (addingPin) setTimeout(() => pinRef.current?.focus(), 40) }, [addingPin])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const hour = now.getHours()

  // homeApps = apps where homescreen:true, in homeOrder
  const visibleAll = apps.filter(a => !(focusMode && FOCUS_HIDDEN.includes(a.cat)))
  const homeApps = visibleAll.filter(a => a.home).sort((a, b) => (a.homeOrder || 0) - (b.homeOrder || 0))

  // DnD sensors
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return
    const oldIdx = homeApps.findIndex(a => a.id === active.id)
    const newIdx = homeApps.findIndex(a => a.id === over.id)
    const reordered = arrayMove(homeApps, oldIdx, newIdx).map((a, i) => ({ ...a, homeOrder: i }))
    setApps(prev => prev.map(a => {
      const updated = reordered.find(r => r.id === a.id)
      return updated ? updated : a
    }))
  }

  function removeFromHome(id) {
    setApps(prev => prev.map(a => a.id === id ? { ...a, home: false } : a))
  }

  function toggleHomeApp(id) {
    setApps(prev => {
      const isHome = prev.find(a => a.id === id)?.home
      if (isHome) return prev.map(a => a.id === id ? { ...a, home: false } : a)
      if (prev.filter(a => a.home).length >= 10) return prev
      // add at end
      const maxOrder = Math.max(0, ...prev.filter(a => a.home).map(a => a.homeOrder || 0))
      return prev.map(a => a.id === id ? { ...a, home: true, homeOrder: maxOrder + 1 } : a)
    })
  }

  const [showAddTile, setShowAddTile] = useState(false)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: 'calc(100vh - 52px)',
      padding: '0 24px 80px',
    }}>
      {/* Date/time */}
      <motion.p
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .05, duration: .4 }}
        style={{
          fontSize: 13, color: 'var(--t2)', fontFamily: 'JetBrains Mono,monospace',
          letterSpacing: '.05em', marginBottom: 16, textAlign: 'center'
        }}>
        {fmtDate(now)} · {fmtTime(now)}
      </motion.p>

      {/* Greeting */}
      <motion.h1
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1, type: 'spring', stiffness: 260, damping: 28 }}
        style={{
          fontSize: 35, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.2,
          textAlign: 'center', marginBottom: 8,
          background: 'linear-gradient(135deg,#f2f3f5 30%,#9da3ae 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
        {getGreeting(hour)}, {username || 'there'}.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .18, duration: .4 }}
        style={{ fontSize: 14, color: 'var(--t2)', fontStyle: 'italic', marginBottom: 44, textAlign: 'center' }}>
        "{motive}"
      </motion.p>

      {/* Search bar */}
      <motion.button
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .22, type: 'spring', stiffness: 260, damping: 28 }}
        onClick={onOpenSearch}
        style={{
          width: '100%', maxWidth: 561, display: 'flex', alignItems: 'center', gap: 12,
          padding: '13px 20px', borderRadius: 999,
          background: 'rgba(255,255,255,0.05)', border: '1px solid var(--b2)',
          cursor: 'text', marginBottom: 52, textAlign: 'left',
          boxShadow: '0 2px 20px rgba(0,0,0,.25)', transition: 'all .2s'
        }}
        whileHover={{ background: 'rgba(255,255,255,0.08)', boxShadow: '0 4px 28px rgba(0,0,0,.35)' }}
        whileTap={{ scale: .998 }}>
        <Search size={16} style={{ color: 'var(--t2)', flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 14, color: 'var(--t2)' }}>Search apps or type yt · lc · gh…</span>
        <kbd style={{
          fontSize: 11, padding: '2px 7px', background: 'rgba(255,255,255,0.06)',
          border: '1px solid var(--b1)', borderRadius: 6, color: 'var(--t2)', fontFamily: 'monospace', flexShrink: 0
        }}>⌘K</kbd>
      </motion.button>

      {/* ── Hover zone: quick links emerge on hover between search and apps ── */}
      <QuickLinksZone
        focusMode={focusMode}
        pins={pins}
        addingPin={addingPin}
        setAddingPin={setAddingPin}
        pinInput={pinInput}
        setPinInput={setPinInput}
        pinRef={pinRef}
        commitPin={commitPin}
        removePin={removePin}
      />

      {/* Home apps grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, type: 'spring', stiffness: 260, damping: 28 }}
        style={{ width: '100%', maxWidth: 600 }}>

        {homeApps.length === 0 ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 12 }}>
              No apps on homescreen yet.
            </p>
            <button onClick={() => setPicking(true)}
              style={{
                fontSize: 13, color: 'var(--accent)', background: 'var(--accent-dim)',
                border: '1px solid var(--accent-b)', borderRadius: 8, padding: '7px 16px', cursor: 'pointer'
              }}>
              + Add apps
            </button>
          </div>
        ) : (
          <>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={homeApps.map(a => a.id)} strategy={rectSortingStrategy}>
                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                  onMouseEnter={e => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left

                    if (
                      homeApps.length < 10 &&
                      x > 80 &&
                      x < rect.width - 80
                    ) {
                      setShowAddTile(true)
                    }
                  }}
                  onMouseLeave={() => setShowAddTile(false)}
                >
                  {homeApps.map(app => (
                    <SortableTile
                      key={app.id}
                      app={app}
                      focusMode={focusMode}
                      onRemove={() => removeFromHome(app.id)}
                    />
                  ))}

                  {/* Add tile — always visible */}
                  <AnimatePresence>
                    {showAddTile && !focusMode && (
                      <motion.button
                        initial={{ opacity: 0, scale: .85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: .85 }}
                        transition={{ duration: .14 }}
                        onClick={() => setPicking(true)}
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 16,
                          border: '1.5px dashed var(--b2)',
                          background: 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--t2)',
                          alignSelf: 'flex-start',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'var(--accent)'
                          e.currentTarget.style.color = 'var(--accent)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'var(--b2)'
                          e.currentTarget.style.color = 'var(--t2)'
                        }}
                      >
                        <Plus size={18} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </SortableContext>
            </DndContext>


          </>
        )}
      </motion.div>

      {/* App picker modal */}
      <AnimatePresence>
        {picking && (
          <AppPicker
            apps={apps}
            focusMode={focusMode}
            onToggle={toggleHomeApp}
            onClose={() => setPicking(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Sortable tile ─────────────────────────────────────── */
function SortableTile({ app, onRemove, focusMode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: app.id })
  const [hov, setHov] = useState(false)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }

  return (
    <div ref={setNodeRef} style={{ ...style, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, width: 80 }}
      onMouseEnter={() => !focusMode && setHov(true)}
      onMouseLeave={() => setHov(false)}>

      {/* Remove button — show in edit mode or hover */}
      <AnimatePresence>
        {hov && (
          <motion.button initial={{ opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .7 }}
            onClick={onRemove}
            style={{
              position: 'absolute', top: -6, right: 8, width: 18, height: 18, borderRadius: '50%',
              background: 'var(--red)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
            }}>
            <X size={10} style={{ color: '#fff' }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Drag handle — show in edit mode */}
      <motion.a
        href={app.url}
        target="_blank"
        rel="noreferrer"
        animate={{
          y: !focusMode && hov ? -3 : 0,
          scale: !focusMode && isDragging ? 1.05 : 1
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        style={{
          width: 52, height: 52, borderRadius: 16, cursor: isDragging ? 'grabbing' : 'grab',
          background: hov ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${hov ? 'var(--b2)' : 'var(--b1)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, overflow: 'hidden', transition: 'all .15s',
          boxShadow: hov ? '0 4px 16px rgba(0,0,0,.3)' : 'none',
          textDecoration: 'none',
        }}
        {...attributes} {...listeners}>
        <img
          src={app.icon}
          alt={app.name}
          style={{ width: 28, height: 28, objectFit: 'contain' }}
          onError={e => {
            e.currentTarget.onerror = null
            e.currentTarget.src =
              `https://www.google.com/s2/favicons?domain=${new URL(app.url).hostname}&sz=64`
          }}
        />
      </motion.a>

      <p style={{
        fontSize: 11, fontWeight: 500, color: hov ? 'var(--t0)' : 'var(--t1)',
        textAlign: 'center', lineHeight: 1.3, transition: 'color .15s',
        maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
      }}>
        {app.name}
      </p>
    </div>
  )
}

/* ── App picker modal ──────────────────────────────────── */
function AppPicker({ apps, focusMode, onToggle, onClose }) {
  const [q, setQ] = useState('')
  const filtered = apps
    .filter(a => !(focusMode && FOCUS_HIDDEN.includes(a.cat)))
    .filter(a => !q || a.name.toLowerCase().includes(q.toLowerCase()))

  // Group by category
  const bycat = {}
  filtered.forEach(a => { if (!bycat[a.cat]) bycat[a.cat] = []; bycat[a.cat].push(a) })

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className="modal-box"
        initial={{ opacity: 0, y: -16, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: .97 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        style={{ maxWidth: 500, maxHeight: '75vh', display: 'flex', flexDirection: 'column' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--t0)', letterSpacing: '-0.02em' }}>Add to homescreen</h3>
          <button onClick={onClose} style={{ color: 'var(--t2)', padding: 4, borderRadius: 6 }}>
            <X size={16} />
          </button>
        </div>

        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search apps…"
          style={{ width: '100%', padding: '9px 13px', fontSize: 13, marginBottom: 16, borderRadius: 'var(--r)' }} />

        <div style={{ overflowY: 'auto', flex: 1, paddingRight: 4 }}>
          {Object.entries(bycat).map(([cat, catApps]) => (
            <div key={cat} style={{ marginBottom: 20 }}>
              <p className="label" style={{ marginBottom: 8 }}>{cat}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {catApps.map(app => (
                  <button key={app.id} onClick={() => onToggle(app.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px',
                      borderRadius: 8, cursor: 'pointer', transition: 'background .1s',
                      background: app.home ? 'var(--accent-dim)' : 'transparent',
                      border: `1px solid ${app.home ? 'var(--accent-b)' : 'transparent'}`,
                      width: '100%', textAlign: 'left'
                    }}
                    onMouseEnter={e => { if (!app.home) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                    onMouseLeave={e => { if (!app.home) e.currentTarget.style.background = 'transparent' }}>

                    <div style={{
                      width: 30, height: 30, borderRadius: 8, background: 'var(--bg-4)',
                      border: '1px solid var(--b1)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 16, flexShrink: 0, overflow: 'hidden'
                    }}>
                      <img
                        src={app.icon}
                        alt={app.name}
                        style={{ width: 18, height: 18, objectFit: 'contain' }}
                        onError={e => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src =
                            `https://www.google.com/s2/favicons?domain=${new URL(app.url).hostname}&sz=64`
                        }}
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--t0)' }}>{app.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--t2)' }}>{app.cat}</p>
                    </div>

                    {/* Checkmark */}
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                      background: app.home ? 'var(--accent)' : 'var(--bg-4)',
                      border: `1px solid ${app.home ? 'var(--accent)' : 'var(--b2)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s'
                    }}>
                      {app.home && <Check size={11} style={{ color: '#fff' }} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--b0)', textAlign: 'center' }}>
          <button onClick={onClose}
            style={{
              padding: '9px 32px', borderRadius: 'var(--r)', background: 'var(--accent)',
              color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}>
            Done
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Quick links zone ─────────────────────────────────── */
function QuickLinksZone({
  focusMode, pins, addingPin, setAddingPin, pinInput, setPinInput, pinRef, commitPin, removePin }) {
  const [visible, setVisible] = useState(false)
  const leaveTimer = useRef(null)

  function onEnter() {
    clearTimeout(leaveTimer.current)
    setVisible(true)
  }
  function onLeave() {
    if (addingPin) return
    leaveTimer.current = setTimeout(() => setVisible(false), 200)
  }
  // Keep open while addingPin
  useEffect(() => { if (addingPin) { clearTimeout(leaveTimer.current); setVisible(true) } }, [addingPin])
  useEffect(() => {
    function handleClickOutside(e) {
      if (!addingPin) return

      // if click is outside the quick-link area
      if (!e.target.closest('.quick-links-zone')) {
        setAddingPin(false)
        setPinInput('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [addingPin, setAddingPin, setPinInput])

  const canAddMorePins = pins.length < 3
  const show =
    (!focusMode && canAddMorePins && visible) ||
    addingPin ||
    pins.length > 0

  return (
    <div
      className="quick-links-zone"
      style={{
        width: '100%',
        maxWidth: 560,
        marginTop: -36,
        marginBottom: addingPin || pins.length > 0 ? 14 : 0,
        transition: 'margin-bottom .18s ease',
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}>
      {/* Invisible hover target — sits in the original gap space */}
      <div style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', justifyContent: 'center' }}>

              {pins.map(p => <QuickLink key={p.id} pin={p} onRemove={() => removePin(p.id)} />)}

              {addingPin ? (
                <div style={{
                  display: 'flex', alignItems: 'center',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--accent-b)', borderRadius: 999,
                  padding: '4px 8px 4px 12px',
                  minHeight: 28,
                  overflow: 'visible',
                }}>
                  <input
                    ref={pinRef}
                    value={pinInput}
                    onChange={e => setPinInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') commitPin()
                      if (e.key === 'Escape') { setAddingPin(false); setPinInput('') }
                    }}
                    placeholder="paste a URL…"
                    style={{
                      background: 'transparent', border: 'none', outline: 'none',
                      fontSize: 12, color: 'var(--t0)', width: 160,
                      fontFamily: 'inherit', padding: '2px 8px 2px 2px',
                      lineHeight: '16px',
                      caretColor: 'var(--t0)',
                    }}
                  />
                  <button onClick={commitPin}
                    style={{
                      width: 20, height: 20, borderRadius: '50%', background: 'var(--accent)',
                      border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0
                    }}>
                    <Check size={11} color="#fff" />
                  </button>
                </div>
              ) : canAddMorePins ? (
                <button
                  onClick={() => setAddingPin(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'transparent',
                    border: '1px dashed var(--b1)',
                    cursor: 'pointer',
                    color: 'var(--t3)',
                    transition: 'all .15s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'var(--accent)'
                    e.currentTarget.style.borderColor = 'var(--accent)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--t3)'
                    e.currentTarget.style.borderColor = 'var(--b1)'
                  }}
                >
                  <Plus size={11} />
                </button>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
/* ── Quick link chip ───────────────────────────────────── */
function QuickLink({ pin, onRemove }) {
  const [hov, setHov] = useState(false)
  let hostname = ''
  try { hostname = new URL(pin.url).hostname } catch { }

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <a
        href={pin.url} target="_blank" rel="noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 10px 4px 8px', borderRadius: 999,
          background: hov ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${hov ? 'var(--b2)' : 'var(--b1)'}`,
          fontSize: 12, color: hov ? 'var(--t0)' : 'var(--t1)',
          textDecoration: 'none', transition: 'all .12s',
          whiteSpace: 'nowrap', maxWidth: 160,
        }}>
        {hostname && (
          <img src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
            alt="" style={{ width: 13, height: 13, objectFit: 'contain', flexShrink: 0 }}
            onError={e => { e.currentTarget.style.display = 'none' }} />
        )}
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{pin.label}</span>
        <ExternalLink size={10} style={{ opacity: hov ? 0.5 : 0, flexShrink: 0, transition: 'opacity .12s' }} />
      </a>
      <AnimatePresence>
        {hov && (
          <motion.button
            initial={{ opacity: 0, scale: .5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .5 }}
            transition={{ duration: .1 }}
            onClick={e => { e.preventDefault(); onRemove() }}
            style={{
              position: 'absolute', top: -6, right: -5, width: 15, height: 15, borderRadius: '50%',
              background: 'var(--red)', border: 'none', cursor: 'pointer', zIndex: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
            <X size={8} color="#fff" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}