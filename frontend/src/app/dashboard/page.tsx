"use client"
import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Navbar from "@/components/layout/Navbar"
import Hero from "@/components/sections/Hero"

/* ── CSS injected globally so variables + keyframes are available everywhere ── */
const GLOBAL_STYLES = `
  :root {
    --bg:      #04040a;
    --surface: rgba(255,255,255,0.03);
    --surface2:rgba(255,255,255,0.055);
    --border:  rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --muted:   #6b7280;
    --cyan:    #06b6d4;
    --blue:    #3b82f6;
    --purple:  #8b5cf6;
    --pink:    #ec4899;
    --emerald: #10b981;
    --amber:   #f59e0b;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: #f0f0ff;
    font-family: 'Inter', system-ui, sans-serif;
    overflow-x: hidden;
    cursor: none;
  }

  .grad-text {
    background: linear-gradient(135deg, var(--cyan) 0%, var(--purple) 60%, var(--blue) 100%);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: grad-shift 6s ease infinite;
  }

  @keyframes grad-shift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .particle {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 1;
    bottom: -10px;
    opacity: 0;
    animation: particle-rise var(--dur, 12s) var(--delay, 0s) ease-in infinite;
  }

  @keyframes particle-rise {
    0%   { transform: translateY(0) scale(0);   opacity: 0; }
    10%  { opacity: 0.55; transform: scale(1); }
    90%  { opacity: 0.2; }
    100% { transform: translateY(-100vh) scale(0.4); opacity: 0; }
  }

  /* Aurora blobs */
  .aurora {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
    opacity: 0.18;
  }
  .aurora-1 {
    width: 700px; height: 700px;
    background: radial-gradient(circle, #3b82f6, transparent 70%);
    top: -200px; left: -150px;
    animation: a1 22s ease-in-out infinite alternate;
  }
  .aurora-2 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, #8b5cf6, transparent 70%);
    top: 300px; right: -100px;
    animation: a2 28s ease-in-out infinite alternate;
  }
  .aurora-3 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, #06b6d4, transparent 70%);
    bottom: 10%; left: 25%;
    animation: a3 18s ease-in-out infinite alternate;
  }

  @keyframes a1 { to { transform: translate(120px, 80px) scale(1.15); } }
  @keyframes a2 { to { transform: translate(-80px, 120px) scale(0.9); } }
  @keyframes a3 { to { transform: translate(-100px, -80px) scale(1.2); } }

  /* Noise overlay */
  .noise-overlay {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: 0.022;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  /* Glowing card hover */
  .glow-card {
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1),
                border-color 0.35s ease,
                box-shadow 0.35s ease;
  }
  .glow-card:hover {
    transform: translateY(-5px) scale(1.01);
    border-color: rgba(255,255,255,0.14) !important;
    box-shadow: 0 30px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06);
  }

  /* Feed animation */
  @keyframes feed-slide {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .feed-item { animation: feed-slide 0.4s ease both; }

  /* Bar chart grow */
  @keyframes bar-grow {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }

  /* Pulse dot */
  @keyframes pulse-dot {
    0%, 100% { box-shadow: 0 0 6px var(--emerald); opacity: 1; }
    50%       { box-shadow: 0 0 14px var(--emerald); opacity: 0.6; }
  }

  /* Magnetic button */
  .mag-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .mag-btn:hover { transform: translateY(-2px) scale(1.03); }
`

const COLORS = ["#06b6d4","#3b82f6","#8b5cf6","#10b981","#f59e0b"]
const STORES  = ["Westlands","CBD Branch","Karen","Mombasa Rd","Thika Town"]
const ITEMS   = ["Arabica Blend","Cold Brew Kit","Matcha Set","Oat Milk 1L","V60 Papers"]
const HEIGHTS = [12,18,24,31,28,45,52,61,58,72,68,84,91,87,95,102,98,88,76,65,54,43,32,21]

function LiveFeed() {
  const [feed, setFeed] = useState(() =>
    Array.from({length:4}, () => ({
      id: Math.random().toString(36).slice(2),
      store: STORES[Math.floor(Math.random()*STORES.length)],
      item:  ITEMS[Math.floor(Math.random()*ITEMS.length)],
      amount:(Math.random()*200+10).toFixed(2),
    }))
  )
  useEffect(() => {
    const t = setInterval(() => {
      setFeed(f => [{
        id: Math.random().toString(36).slice(2),
        store: STORES[Math.floor(Math.random()*STORES.length)],
        item:  ITEMS[Math.floor(Math.random()*ITEMS.length)],
        amount:(Math.random()*200+10).toFixed(2),
      }, ...f.slice(0,3)])
    }, 2200)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="rounded-2xl p-5 h-full" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid var(--border)" }}>
      <div className="flex items-center gap-2 mb-4">
        <span style={{ width:6,height:6,borderRadius:"50%",background:"var(--emerald)",boxShadow:"0 0 8px var(--emerald)",display:"inline-block",animation:"pulse-dot 1.5s ease-in-out infinite" }}/>
        <span style={{ fontSize:11,color:"var(--muted)",letterSpacing:"0.06em" }}>LIVE TRANSACTIONS</span>
      </div>
      <AnimatePresence initial={false}>
        {feed.map(f => (
          <motion.div key={f.id}
            initial={{ opacity:0, x:-10, height:0 }}
            animate={{ opacity:1, x:0, height:"auto" }}
            exit={{ opacity:0, height:0 }}
            transition={{ duration:0.35 }}
            style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)" }}
          >
            <div>
              <div style={{ fontSize:12,color:"#c0c0d0" }}>{f.item}</div>
              <div style={{ fontSize:10,color:"var(--muted)" }}>{f.store}</div>
            </div>
            <div style={{ fontSize:13,fontWeight:700,color:"var(--emerald)" }}>KES {f.amount}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function DashboardMockup() {
  const [rev, setRev] = useState(0)
  const [txn, setTxn] = useState(0)
  const maxH = Math.max(...HEIGHTS)

  useEffect(() => {
    let r = 0, t = 0
    const id = setInterval(() => {
      r = Math.min(r + 1240, 48250)
      t = Math.min(t + 22, 847)
      setRev(r); setTxn(t)
      if (r >= 48250) clearInterval(id)
    }, 18)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative w-full max-w-4xl mx-auto" style={{ marginTop:56 }}>
      {/* Glow ring */}
      <div style={{
        position:"absolute",inset:-1,
        background:"linear-gradient(135deg,rgba(59,130,246,0.35),rgba(139,92,246,0.25),rgba(6,182,212,0.3))",
        borderRadius:22,zIndex:-1,filter:"blur(1px)"
      }}/>
      <div style={{
        background:"rgba(8,8,20,0.92)",
        backdropFilter:"blur(40px) saturate(160%)",
        border:"1px solid rgba(255,255,255,0.07)",
        borderRadius:20,
        overflow:"hidden",
        padding:24,
      }}>
        {/* Traffic lights */}
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:20 }}>
          {["#FF5F57","#FFBD2E","#28C840"].map(c=>(
            <span key={c} style={{ width:10,height:10,borderRadius:"50%",background:c,display:"inline-block" }}/>
          ))}
          <span style={{ marginLeft:12,fontSize:11,color:"var(--muted)",letterSpacing:"0.05em" }}>
            B.O.S.S — Command Centre
          </span>
        </div>

        {/* Metric cards */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16 }}>
          {[
            { label:"Revenue Today", value:`KES ${rev.toLocaleString()}`, delta:"↑ 23.4%", color:"var(--emerald)" },
            { label:"Transactions",  value:txn.toLocaleString(), delta:"↑ 847 today", color:"var(--cyan)" },
            { label:"Active Stores", value:"5 / 5", delta:"All online", color:"var(--blue)" },
            { label:"Uptime",        value:"99.99%", delta:"30-day avg", color:"var(--purple)" },
          ].map(card => (
            <div key={card.label} className="glow-card" style={{
              background:"rgba(255,255,255,0.03)",
              border:"1px solid rgba(255,255,255,0.06)",
              borderRadius:12,padding:14,cursor:"default"
            }}>
              <div style={{ fontSize:10,color:"var(--muted)",letterSpacing:"0.05em",marginBottom:6 }}>{card.label}</div>
              <div style={{ fontSize:20,fontWeight:800,letterSpacing:"-0.03em",color:"#f0f0ff" }}>{card.value}</div>
              <div style={{ fontSize:11,color:card.color,marginTop:4,fontWeight:500 }}>{card.delta}</div>
            </div>
          ))}
        </div>

        {/* Chart + Feed */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <div style={{ background:"rgba(255,255,255,0.02)",border:"1px solid var(--border)",borderRadius:12,padding:16 }}>
            <div style={{ fontSize:10,color:"var(--muted)",letterSpacing:"0.05em",marginBottom:10 }}>HOURLY REVENUE</div>
            <div style={{ display:"flex",alignItems:"flex-end",gap:3,height:90 }}>
              {HEIGHTS.map((h,i) => (
                <div key={i} style={{
                  flex:1,
                  height:`${(h/maxH)*100}%`,
                  background:"linear-gradient(to top, var(--blue), var(--cyan))",
                  borderRadius:"2px 2px 0 0",
                  opacity:0.75,
                  transformOrigin:"bottom",
                  animation:`bar-grow 1s ${i*0.04}s cubic-bezier(0.16,1,0.3,1) both`,
                }}/>
              ))}
            </div>
          </div>
          <LiveFeed />
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const glowRef   = useRef<HTMLDivElement>(null)
  const gPos = useRef({ x:0, y:0 })
  const mPos = useRef({ x:0, y:0 })
  const rafRef = useRef<number>(0)

  /* Inject global styles once */
  useEffect(() => {
    const el = document.createElement("style")
    el.textContent = GLOBAL_STYLES
    document.head.appendChild(el)
    return () => { el.remove() }
  }, [])

  /* Custom cursor */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      mPos.current = { x:e.clientX, y:e.clientY }
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px"
        cursorRef.current.style.top  = e.clientY + "px"
      }
    }
    const anim = () => {
      gPos.current.x += (mPos.current.x - gPos.current.x) * 0.08
      gPos.current.y += (mPos.current.y - gPos.current.y) * 0.08
      if (glowRef.current) {
        glowRef.current.style.left = gPos.current.x + "px"
        glowRef.current.style.top  = gPos.current.y + "px"
      }
      rafRef.current = requestAnimationFrame(anim)
    }
    window.addEventListener("mousemove", move)
    rafRef.current = requestAnimationFrame(anim)
    return () => {
      window.removeEventListener("mousemove", move)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const particles = Array.from({length:30}, (_,i) => {
    const c  = COLORS[i % COLORS.length]
    const sz = Math.random() * 3 + 1
    return { c, sz, left:`${Math.random()*100}%`, dur:`${Math.random()*12+9}s`, delay:`-${Math.random()*12}s` }
  })

  return (
    <main style={{ background:"var(--bg)", minHeight:"100vh", position:"relative" }}>

      {/* Aurora blobs */}
      <div className="aurora aurora-1"/>
      <div className="aurora aurora-2"/>
      <div className="aurora aurora-3"/>

      {/* Noise */}
      <div className="noise-overlay"/>

      {/* Cursor */}
      <div ref={cursorRef} style={{
        position:"fixed",width:10,height:10,borderRadius:"50%",
        background:"var(--cyan)",transform:"translate(-50%,-50%)",
        pointerEvents:"none",zIndex:9999,mixBlendMode:"screen",
        boxShadow:"0 0 18px var(--cyan)",transition:"width 0.2s,height 0.2s"
      }}/>
      <div ref={glowRef} style={{
        position:"fixed",width:300,height:300,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 70%)",
        transform:"translate(-50%,-50%)",pointerEvents:"none",zIndex:9998,
      }}/>

      {/* Particles */}
      {particles.map((p,i)=>(
        <div key={i} className="particle"
          style={{ width:p.sz,height:p.sz,left:p.left,background:p.c,"--dur":p.dur,"--delay":p.delay } as React.CSSProperties}/>
      ))}

      {/* ── Existing components ── */}
      <Navbar />
      <Hero />

      {/* ── Dashboard Mockup (inlined so it always works) ── */}
      <section style={{ position:"relative",zIndex:2,padding:"0 24px 80px",textAlign:"center" }}>
        <motion.div
          initial={{ opacity:0, y:40 }}
          whileInView={{ opacity:1, y:0 }}
          transition={{ duration:1, ease:[0.16,1,0.3,1] }}
          viewport={{ once:true }}
        >
          <DashboardMockup />
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <motion.div
        initial={{ opacity:0 }}
        whileInView={{ opacity:1 }}
        transition={{ duration:0.8 }}
        viewport={{ once:true }}
        style={{ borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)",position:"relative",zIndex:2 }}
      >
        <div style={{ maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"rgba(255,255,255,0.05)" }}>
          {[
            ["50K+","Active merchants","linear-gradient(135deg,#fff,var(--cyan))"],
            ["$2.8B","Processed monthly","linear-gradient(135deg,var(--emerald),var(--cyan))"],
            ["99.99%","Uptime SLA","linear-gradient(135deg,var(--purple),var(--pink))"],
            ["140+","Countries","linear-gradient(135deg,var(--blue),var(--cyan))"],
          ].map(([num,lbl,grad],i)=>(
            <motion.div key={lbl}
              initial={{ opacity:0,y:20 }}
              whileInView={{ opacity:1,y:0 }}
              transition={{ delay:i*0.1,duration:0.6 }}
              viewport={{ once:true }}
              style={{ background:"var(--bg)",padding:"44px 32px",textAlign:"center",transition:"background 0.3s" }}
              onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.025)")}
              onMouseLeave={e=>(e.currentTarget.style.background="var(--bg)")}
            >
              <div style={{ fontSize:48,fontWeight:900,letterSpacing:"-0.04em",background:grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>{num}</div>
              <div style={{ fontSize:13,color:"var(--muted)",marginTop:6,letterSpacing:"0.03em" }}>{lbl}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── FEATURES ── */}
      <motion.section id="features"
        initial={{ opacity:0,y:40 }}
        whileInView={{ opacity:1,y:0 }}
        transition={{ duration:0.8 }}
        viewport={{ once:true }}
        style={{ padding:"96px 24px",maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2 }}
      >
        <div style={{ fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--cyan)",marginBottom:16 }}>Platform</div>
        <h2 style={{ fontSize:"clamp(36px,5vw,56px)",fontWeight:900,letterSpacing:"-0.04em",lineHeight:1.05,marginBottom:64 }}>
          Everything you need<br/><span className="grad-text">to run modern retail</span>
        </h2>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12 }}>
          {[
            { icon:"📊",title:"Real-time Analytics",desc:"Live dashboards tracking revenue and customer behaviour across all stores. Every metric, every second.",span:2,glow:"rgba(59,130,246,0.15)" },
            { icon:"📦",title:"Smart Inventory",desc:"Auto-reorder, expiry tracking, supplier sync. Never run out of stock.",span:1,glow:"rgba(6,182,212,0.15)" },
            { icon:"📱",title:"Mobile POS",desc:"Full POS on any device. Works offline and syncs when back online.",span:1,glow:"rgba(139,92,246,0.15)" },
            { icon:"⚡",title:"QR Payments",desc:"Accept QR, NFC, card, and cash in under 2 seconds.",span:1,glow:"rgba(16,185,129,0.15)" },
            { icon:"👥",title:"Employee Tracking",desc:"Staff performance, shifts, and customer profiles — fully automated across all locations.",span:2,glow:"rgba(236,72,153,0.15)" },
            { icon:"🔄",title:"Offline Sync",desc:"Sell without internet. Syncs automatically when reconnected.",span:1,glow:"rgba(59,130,246,0.15)" },
            { icon:"🧾",title:"Smart Receipts",desc:"Digital, printed, or WhatsApp receipts in one tap.",span:1,glow:"rgba(16,185,129,0.15)" },
            { icon:"🏪",title:"Multi-store HQ",desc:"Manage unlimited locations from one command centre.",span:1,glow:"rgba(139,92,246,0.15)" },
          ].map(({icon,title,desc,span,glow},i)=>(
            <motion.div key={title}
              initial={{ opacity:0,y:20 }}
              whileInView={{ opacity:1,y:0 }}
              transition={{ delay:i*0.06,duration:0.5 }}
              viewport={{ once:true }}
              className="glow-card"
              style={{
                background:"var(--surface)",border:"1px solid var(--border)",
                borderRadius:20,padding:"28px",gridColumn:`span ${span}`,
                position:"relative",overflow:"hidden",cursor:"default"
              }}
            >
              <div style={{ position:"absolute",width:180,height:180,borderRadius:"50%",background:glow,filter:"blur(50px)",bottom:-40,right:-40,pointerEvents:"none" }}/>
              <div style={{ width:44,height:44,borderRadius:12,background:glow,border:`1px solid ${glow.replace("0.15","0.25")}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:18 }}>{icon}</div>
              <h3 style={{ fontSize:18,fontWeight:700,letterSpacing:"-0.02em",marginBottom:10 }}>{title}</h3>
              <p style={{ fontSize:14,color:"var(--muted)",lineHeight:1.65,fontWeight:300 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── AI SECTION ── */}
      <motion.div id="ai"
        initial={{ opacity:0 }}
        whileInView={{ opacity:1 }}
        transition={{ duration:0.8 }}
        viewport={{ once:true }}
        style={{
          borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)",
          background:"linear-gradient(180deg,transparent,rgba(59,130,246,0.04),transparent)",
          position:"relative",zIndex:2,padding:"96px 24px"
        }}
      >
        <div style={{ maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"center" }}>
          <div>
            <div style={{ fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--cyan)",marginBottom:16 }}>Intelligence</div>
            <h2 style={{ fontSize:"clamp(36px,5vw,56px)",fontWeight:900,letterSpacing:"-0.04em",lineHeight:1.05,marginBottom:20 }}>
              Your AI-powered<br/><span className="grad-text">business co-pilot</span>
            </h2>
            <p style={{ fontSize:16,color:"var(--muted)",lineHeight:1.7,fontWeight:300,marginBottom:32,maxWidth:400 }}>
              Ask questions in plain English. Get instant insights on inventory, sales, and customer behaviour.
            </p>
            {["Predictive restock recommendations","Anomaly detection & fraud alerts","Demand forecasting across stores","Personalised customer offers"].map(f=>(
              <div key={f} style={{ display:"flex",alignItems:"center",gap:12,fontSize:14,marginBottom:14,color:"#d0d0e8" }}>
                <span style={{ width:20,height:20,borderRadius:"50%",background:"rgba(16,185,129,0.15)",color:"var(--emerald)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,flexShrink:0 }}>✓</span>
                {f}
              </div>
            ))}
          </div>

          {/* AI Chat UI */}
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute",inset:-1,background:"linear-gradient(135deg,rgba(139,92,246,0.25),transparent,rgba(59,130,246,0.2))",borderRadius:21,zIndex:-1 }}/>
            <div style={{ background:"rgba(8,8,20,0.9)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:20,overflow:"hidden",backdropFilter:"blur(20px)" }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,padding:"14px 20px",background:"rgba(255,255,255,0.03)",borderBottom:"1px solid var(--border)" }}>
                <div style={{ width:30,height:30,borderRadius:9,background:"linear-gradient(135deg,var(--purple),var(--blue))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#fff" }}>B</div>
                <div>
                  <div style={{ fontSize:13,fontWeight:500 }}>B.O.S.S AI</div>
                  <div style={{ fontSize:11,color:"var(--emerald)" }}>● Online</div>
                </div>
              </div>
              <div style={{ padding:20,display:"flex",flexDirection:"column",gap:12 }}>
                {[
                  { role:"user", text:"What were my top products this week?" },
                  { role:"ai",   text:<>Top 5 this week:<br/><br/>1. <strong style={{color:"var(--cyan)"}}>Arabica Blend</strong> — KES 4,821 (↑23%)<br/>2. <strong style={{color:"var(--cyan)"}}>Cold Brew Kit</strong> — KES 3,204 (↑11%)<br/>3. <strong style={{color:"var(--cyan)"}}>Matcha Latte Set</strong> — KES 2,102 (↑44%)</> },
                  { role:"user", text:"Should I restock Matcha?" },
                  { role:"ai",   text:<>✅ <strong>Yes — restock immediately.</strong> Stock: 3 units. At 44% growth you'll sell out in ~18 hours. Order 24 units today.</> },
                ].map((msg,i)=>(
                  <motion.div key={i}
                    initial={{ opacity:0,y:8 }}
                    whileInView={{ opacity:1,y:0 }}
                    transition={{ delay:i*0.15,duration:0.5 }}
                    viewport={{ once:true }}
                    style={{ display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start" }}
                  >
                    <div style={{
                      maxWidth:"82%",padding:"10px 14px",borderRadius:msg.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",
                      fontSize:13,lineHeight:1.55,
                      background:msg.role==="user"?"rgba(59,130,246,0.18)":"rgba(255,255,255,0.04)",
                      border:msg.role==="user"?"1px solid rgba(59,130,246,0.25)":"1px solid var(--border)",
                      color:msg.role==="user"?"#e0e8ff":"#b0b8d0"
                    }}>{msg.text}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── PRICING ── */}
      <motion.section id="pricing"
        initial={{ opacity:0,y:40 }}
        whileInView={{ opacity:1,y:0 }}
        transition={{ duration:0.8 }}
        viewport={{ once:true }}
        style={{ padding:"96px 24px",maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2 }}
      >
        <div style={{ fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--cyan)",marginBottom:16 }}>Pricing</div>
        <h2 style={{ fontSize:"clamp(36px,5vw,56px)",fontWeight:900,letterSpacing:"-0.04em",lineHeight:1.05,marginBottom:64 }}>
          Simple, transparent<br/><span className="grad-text">pricing that scales</span>
        </h2>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16 }}>
          {[
            { tier:"Starter",    price:"$29",    per:"/mo", desc:"For single-location businesses.",       features:["1 store","Basic analytics","500 products","Email support"],                                  featured:false },
            { tier:"Growth",     price:"$89",    per:"/mo", desc:"For growing multi-location teams.",      features:["Up to 5 stores","AI insights","Unlimited products","Priority support","Employee tracking"],  featured:true  },
            { tier:"Enterprise", price:"Custom", per:"",    desc:"Unlimited scale + dedicated support.",   features:["Unlimited stores","Custom AI","99.99% SLA","Dedicated engineer"],                            featured:false },
          ].map(({tier,price,per,desc,features,featured})=>(
            <motion.div key={tier}
              whileHover={{ y:-8, boxShadow:"0 40px 100px rgba(0,0,0,0.5)" }}
              transition={{ duration:0.3 }}
              style={{
                borderRadius:24,padding:"36px",position:"relative",overflow:"hidden",cursor:"default",
                background: featured ? "linear-gradient(135deg,rgba(59,130,246,0.1),rgba(139,92,246,0.07))" : "var(--surface)",
                border:     featured ? "1px solid rgba(59,130,246,0.35)" : "1px solid var(--border)",
                boxShadow:  featured ? "0 0 60px rgba(59,130,246,0.12)" : "none",
              }}
            >
              {featured && (
                <div style={{ position:"absolute",top:18,right:18,fontSize:9,fontWeight:700,letterSpacing:"0.1em",color:"var(--blue)",background:"rgba(59,130,246,0.12)",padding:"4px 10px",borderRadius:100,border:"1px solid rgba(59,130,246,0.25)" }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:24 }}>{tier}</div>
              <div style={{ fontSize:48,fontWeight:900,letterSpacing:"-0.04em",lineHeight:1,marginBottom:4, ...(featured?{background:"linear-gradient(135deg,var(--blue),var(--cyan))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}:{}) }}>
                {price}<span style={{ fontSize:18,fontWeight:400,color:"var(--muted)",WebkitTextFillColor:"var(--muted)" }}>{per}</span>
              </div>
              <p style={{ fontSize:13,color:"var(--muted)",marginBottom:28,lineHeight:1.6 }}>{desc}</p>
              <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:28 }}>
                {features.map(f=>(
                  <div key={f} style={{ display:"flex",alignItems:"center",gap:10,fontSize:13,color:"#c0c8d8" }}>
                    <span style={{ color:"var(--emerald)",flexShrink:0 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale:1.03 }}
                whileTap={{ scale:0.97 }}
                style={{
                  width:"100%",padding:"14px",borderRadius:12,
                  fontSize:14,fontWeight:600,cursor:"none",transition:"box-shadow 0.2s",
                  ...(featured ? {
                    background:"linear-gradient(135deg,var(--blue),var(--cyan))",
                    color:"#000",border:"none",boxShadow:"0 0 30px rgba(59,130,246,0.3)"
                  } : {
                    background:"transparent",border:"1px solid var(--border2)",color:"#f0f0ff"
                  })
                }}
              >
                {featured ? "Start free trial →" : tier==="Enterprise" ? "Contact sales" : "Get started"}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── TESTIMONIALS ── */}
      <motion.section id="reviews"
        initial={{ opacity:0,y:40 }}
        whileInView={{ opacity:1,y:0 }}
        transition={{ duration:0.8 }}
        viewport={{ once:true }}
        style={{ padding:"96px 24px",maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2 }}
      >
        <div style={{ fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--cyan)",marginBottom:16 }}>Reviews</div>
        <h2 style={{ fontSize:"clamp(36px,5vw,56px)",fontWeight:900,letterSpacing:"-0.04em",lineHeight:1.05,marginBottom:64 }}>
          Loved by <span className="grad-text">50,000+ merchants</span>
        </h2>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16 }}>
          {[
            { quote:"B.O.S.S transformed how we run our 8 coffee shops. The AI restock alerts saved us $12K last quarter.", name:"Amara Mumo",   role:"CEO, Roast Republic", grad:"linear-gradient(135deg,var(--blue),var(--cyan))" },
            { quote:"The offline sync is a game-changer. Our rural locations never miss a sale even without internet.",      name:"James Kariuki", role:"Founder, FreshMart",  grad:"linear-gradient(135deg,var(--emerald),var(--cyan))" },
            { quote:"We replaced 3 tools with B.O.S.S. It feels like NASA mission control for retail.",                    name:"Sara Wanjiru",  role:"Director, Zuri Stores",grad:"linear-gradient(135deg,var(--purple),var(--pink))" },
          ].map(({quote,name,role,grad},i)=>(
            <motion.div key={name}
              initial={{ opacity:0,y:20 }}
              whileInView={{ opacity:1,y:0 }}
              transition={{ delay:i*0.1,duration:0.5 }}
              viewport={{ once:true }}
              className="glow-card"
              style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:20,padding:28,cursor:"default" }}
            >
              <div style={{ fontSize:14,color:"#fbbf24",marginBottom:16 }}>★★★★★</div>
              <p style={{ fontSize:14,color:"var(--muted)",lineHeight:1.7,marginBottom:20,fontWeight:300 }}>{quote}</p>
              <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:38,height:38,borderRadius:"50%",background:grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#000",flexShrink:0 }}>
                  {name.split(" ").map(n=>n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontSize:13,fontWeight:600 }}>{name}</div>
                  <div style={{ fontSize:11,color:"var(--muted)" }}>{role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── FOOTER ── */}
      <footer style={{ padding:"60px 24px",maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:24,borderTop:"1px solid var(--border)",position:"relative",zIndex:2 }}>
        <div style={{ fontSize:18,fontWeight:900,letterSpacing:"0.08em",background:"linear-gradient(90deg,var(--cyan),var(--blue),var(--purple))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>
          B.O.S.S
        </div>
        <div style={{ display:"flex",gap:28 }}>
          {["Product","Docs","Blog","Careers","Status"].map(l=>(
            <a key={l} href="#"
              style={{ fontSize:13,color:"var(--muted)",textDecoration:"none",transition:"color 0.2s" }}
              onMouseEnter={e=>(e.currentTarget.style.color="#f0f0ff")}
              onMouseLeave={e=>(e.currentTarget.style.color="var(--muted)")}>
              {l}
            </a>
          ))}
        </div>
        <div style={{ fontSize:12,color:"var(--muted)" }}>© 2026 B.O.S.S Inc. All rights reserved.</div>
      </footer>

    </main>
  )
}
