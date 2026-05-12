import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Star, Trash2 } from 'lucide-react'
import { CATEGORIES, FOCUS_HIDDEN } from '../data/defaults'

export default function Launcher({ apps, setApps, focusMode, onAdd }) {
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')

  const visible = apps.filter(a => {
    if (focusMode && FOCUS_HIDDEN.includes(a.cat)) return false
    if (q) return a.name.toLowerCase().includes(q.toLowerCase())
    if (cat !== 'All' && a.cat !== cat) return false
    return true
  })

  const usedCats = ['All', ...CATEGORIES.slice(1).filter(c =>
    (!focusMode || !FOCUS_HIDDEN.includes(c)) && apps.some(a => a.cat === c)
  )]

  return (
    <div style={{padding:'52px 56px 80px'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:36}}>
        <div>
          <h2 style={{fontSize:30,fontWeight:700,letterSpacing:'-0.04em',color:'var(--t0)',marginBottom:6}}>Launcher</h2>
          <p style={{fontSize:14,color:'var(--t2)'}}>Your apps, in one place.</p>
        </div>
        <motion.button whileHover={{scale:1.02}} whileTap={{scale:.98}} onClick={onAdd}
          style={{display:'flex',alignItems:'center',gap:7,padding:'10px 18px',borderRadius:'var(--r)',
            background:'var(--accent-dim)',border:'1px solid var(--accent-b)',color:'var(--accent)',fontSize:14,fontWeight:500}}>
          <Plus size={15}/> Add App
        </motion.button>
      </div>

      {/* Filter row */}
      <div style={{display:'flex',gap:10,marginBottom:28,alignItems:'center',flexWrap:'wrap'}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Filter apps…"
          style={{padding:'9px 14px',borderRadius:'var(--r)',fontSize:14,width:200,flex:'none'}} />
        <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
          {usedCats.map(c => (
            <button key={c} onClick={()=>setCat(c)}
              style={{padding:'7px 14px',borderRadius:99,fontSize:13,fontWeight:500,cursor:'pointer',transition:'all .12s',
                background: cat===c ? 'var(--accent-dim)' : 'transparent',
                border: `1px solid ${cat===c ? 'var(--accent-b)' : 'var(--b1)'}`,
                color: cat===c ? 'var(--accent)' : 'var(--t2)'}}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid — more columns, bigger cards */}
      <AnimatePresence>
        {visible.length === 0
          ? <p style={{color:'var(--t2)',fontSize:14,padding:'60px 0',textAlign:'center'}}>No apps found.</p>
          : (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:10}}>
              {visible.map((app,i) => <AppCard key={app.id} app={app} i={i}
                onToggleFav={()=>setApps(a=>a.map(x=>x.id===app.id?{...x,fav:!x.fav}:x))}
                onRemove={()=>setApps(a=>a.filter(x=>x.id!==app.id))} />)}
              <motion.button whileHover={{borderColor:'var(--accent-b)'}} onClick={onAdd}
                style={{minHeight:100,border:'1px dashed var(--b1)',borderRadius:'var(--r-lg)',cursor:'pointer',
                  display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:6,
                  color:'var(--t3)',transition:'all .15s',background:'transparent'}}>
                <Plus size={18}/>
                <span style={{fontSize:12}}>Add</span>
              </motion.button>
            </div>
          )
        }
      </AnimatePresence>
    </div>
  )
}

function AppCard({ app, i, onToggleFav, onRemove }) {
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
      transition={{delay:i*0.025,type:'spring',stiffness:300,damping:28}}
      onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
      style={{position:'relative',borderRadius:'var(--r-lg)',overflow:'hidden'}}
    >
      <motion.a href={app.url} target="_blank" rel="noreferrer"
        animate={{y: hov ? -2 : 0, background: hov ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.025)'}}
        transition={{type:'spring',stiffness:400,damping:30}}
        style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10,
          padding:'22px 14px 16px',
          border:`1px solid ${hov ? 'var(--b2)' : 'var(--b1)'}`,
          borderRadius:'var(--r-lg)',cursor:'pointer',textDecoration:'none'}}>
        {app.fav && <div style={{position:'absolute',top:8,left:8,width:5,height:5,borderRadius:'50%',background:'var(--amber)',opacity:.9}}/>}
        <div className="app-icon" style={{width:48,height:48,borderRadius:13,fontSize:24}}>
          
        {app.icon?.startsWith('http') ? (
          <img
            src={app.icon}
            alt={app.name}
            style={{ width:28, height:28, objectFit:'contain' }}
            onError={e => {
              e.currentTarget.onerror = null
              e.currentTarget.src =
                `https://www.google.com/s2/favicons?domain=${new URL(app.url).hostname}&sz=64`
            }}
          />
        ) : (
          <span style={{fontSize:24}}>{app.icon}</span>
        )}

        </div>
        <div style={{textAlign:'center'}}>
          <p style={{fontSize:13,fontWeight:500,color:'var(--t1)',lineHeight:1.3}}>{app.name}</p>
          <p style={{fontSize:11,color:'var(--t3)',marginTop:3}}>{app.cat}</p>
        </div>
      </motion.a>

      <AnimatePresence>
        {hov && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:'absolute',top:7,right:7,display:'flex',gap:3}}>
            <button onClick={e=>{e.preventDefault();onToggleFav()}}
              style={{width:22,height:22,borderRadius:5,background:'rgba(0,0,0,.6)',border:'1px solid var(--b2)',
                display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(4px)'}}>
              <Star size={11} fill={app.fav?'var(--amber)':'none'} style={{color:'var(--amber)'}}/>
            </button>
            <button onClick={e=>{e.preventDefault();onRemove()}}
              style={{width:22,height:22,borderRadius:5,background:'rgba(0,0,0,.6)',border:'1px solid var(--b2)',
                display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(4px)'}}>
              <Trash2 size={11} style={{color:'var(--red)'}}/>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
