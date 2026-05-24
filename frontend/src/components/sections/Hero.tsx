"use client"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

const MERCHANTS = ["Westlands Store","CBD Branch","Karen Outlet","Mombasa Rd","Thika Town"]
const ITEMS = ["Arabica Blend","Cold Brew Kit","Matcha Set","Oat Milk 1L","V60 Papers"]
const BAR_DATA = [62,78,55,90,83,95,88]
const BAR_COLORS = ["#4f8ef7","#a855f7","#00d4ff","#4f8ef7","#10d98a","#4f8ef7","#00d4ff"]

function randomFeed() {
  return {
    store: MERCHANTS[Math.floor(Math.random()*MERCHANTS.length)],
    item: ITEMS[Math.floor(Math.random()*ITEMS.length)],
    amount: (Math.random()*200+10).toFixed(2),
    id: Date.now()+Math.random(),
  }
}

export default function Hero() {
  const [feed, setFeed] = useState(() => Array.from({length:4}, randomFeed))
  const [aiReply, setAiReply] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setFeed(f => [randomFeed(), ...f.slice(0,3)]), 2800)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setAiReply(true), 3500)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-10 pt-32 pb-20 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 80% 60% at 50% -10%, rgba(79,142,247,0.18) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 60%, rgba(168,85,247,0.12) 0%, transparent 50%),
          radial-gradient(ellipse 50% 50% at 20% 80%, rgba(16,217,138,0.08) 0%, transparent 50%)
        `
      }}/>

      {/* Badge */}
      <motion.div
        initial={{ opacity:0, y:20 }}
        animate={{ opacity:1, y:0 }}
        transition={{ delay:0.2, duration:0.6 }}
        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-[12px] tracking-widest uppercase"
        style={{ background:"rgba(79,142,247,0.1)", border:"1px solid rgba(79,142,247,0.3)", color:"var(--blue)" }}
      >
        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background:"var(--cyan)", boxShadow:"0 0 8px var(--cyan)", animation:"pulse 2s infinite" }}/>
        Now with AI-Powered Insights
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity:0, y:30 }}
        animate={{ opacity:1, y:0 }}
        transition={{ delay:0.3, duration:0.8, ease:[0.23,1,0.32,1] }}
        className="font-extrabold leading-none mb-6"
        style={{ fontSize:"clamp(48px,7vw,90px)", letterSpacing:"-3px" }}
      >
        <span className="grad-text">Business Operations<br/>&amp; Smart Systems</span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity:0, y:20 }}
        animate={{ opacity:1, y:0 }}
        transition={{ delay:0.4, duration:0.7 }}
        className="text-lg max-w-xl mb-12 leading-relaxed"
        style={{ color:"var(--muted)" }}
      >
        B.O.S.S is the all-in-one intelligent POS ecosystem built for modern retail.
        Real-time analytics, AI insights, and seamless multi-store management.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity:0, y:20 }}
        animate={{ opacity:1, y:0 }}
        transition={{ delay:0.5, duration:0.6 }}
        className="flex gap-4 flex-wrap justify-center mb-20"
      >
        <motion.button
          whileHover={{ y:-2, scale:1.02, boxShadow:"0 0 48px rgba(79,142,247,0.5)" }}
          whileTap={{ scale:0.97 }}
          className="px-8 py-4 rounded-full text-[15px] font-semibold text-black border-none"
          style={{ background:"linear-gradient(135deg,var(--blue),var(--cyan))", boxShadow:"0 0 32px rgba(79,142,247,0.3)", cursor:"none" }}
        >
          Start for free
        </motion.button>
        <motion.button
          whileHover={{ y:-2, borderColor:"rgba(255,255,255,0.3)" }}
          whileTap={{ scale:0.97 }}
          className="px-8 py-4 rounded-full text-[15px] font-medium"
          style={{ background:"var(--surface)", border:"1px solid var(--border2)", color:"#f0f0ff", backdropFilter:"blur(12px)", cursor:"none" }}
        >
          Watch demo ▶
        </motion.button>
      </motion.div>

      {/* Dashboard Mockup */}
      <motion.div
        initial={{ opacity:0, y:60 }}
        animate={{ opacity:1, y:0 }}
        transition={{ delay:0.6, duration:1, ease:[0.23,1,0.32,1] }}
        className="w-full max-w-4xl relative"
        style={{ animation:"floatY 6s ease-in-out infinite" }}
      >
        {/* Float cards */}
        <motion.div
          className="absolute glass rounded-2xl p-4 text-left text-[12px] z-10"
          style={{ top:"20%", left:-60, "--rot":"-3deg" } as any}
          animate={{ y:[0,-8,0] }}
          transition={{ duration:5, repeat:Infinity, ease:"easeInOut" }}
        >
          <div style={{ color:"var(--muted)", marginBottom:4 }}>Today's Revenue</div>
          <div className="text-lg font-bold" style={{ color:"var(--emerald)" }}>$24,871</div>
          <div className="inline-block px-2 py-0.5 rounded-full text-[10px] mt-1.5" style={{ background:"rgba(16,217,138,0.15)", color:"var(--emerald)" }}>↑ 18.4%</div>
        </motion.div>
        <motion.div
          className="absolute glass rounded-2xl p-4 text-left text-[12px] z-10"
          style={{ top:"40%", right:-60 }}
          animate={{ y:[0,-8,0] }}
          transition={{ duration:5, repeat:Infinity, ease:"easeInOut", delay:1.5 }}
        >
          <div style={{ color:"var(--muted)", marginBottom:4 }}>Active Stores</div>
          <div className="text-lg font-bold" style={{ color:"var(--blue)" }}>12</div>
          <div className="inline-block px-2 py-0.5 rounded-full text-[10px] mt-1.5" style={{ background:"rgba(79,142,247,0.15)", color:"var(--blue)" }}>All online</div>
        </motion.div>

        {/* Dashboard window */}
        <div className="rounded-2xl overflow-hidden" style={{
          background:"rgba(12,12,24,0.9)",
          border:"1px solid var(--border2)",
          boxShadow:"0 0 0 1px rgba(79,142,247,0.1), 0 40px 100px rgba(0,0,0,0.6)",
        }}>
          {/* Title bar */}
          <div className="flex items-center gap-2 px-5 py-3" style={{ background:"rgba(255,255,255,0.03)", borderBottom:"1px solid var(--border)" }}>
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"/>
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"/>
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"/>
            <div className="mx-auto text-[12px]" style={{ color:"var(--muted)" }}>B.O.S.S — Command Center</div>
          </div>

          <div className="grid" style={{ gridTemplateColumns:"180px 1fr", minHeight:380 }}>
            {/* Sidebar */}
            <div className="flex flex-col gap-1 p-3" style={{ borderRight:"1px solid var(--border)" }}>
              {[["⊞","Overview",true],["◈","Analytics",false],["⬡","Inventory",false],["⊛","Employees",false],["◉","Customers",false]].map(([icon,label,active])=>(
                <div key={label as string} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] transition-all"
                  style={{ background:active?"rgba(79,142,247,0.15)":"transparent", color:active?"var(--blue)":"var(--muted)" }}>
                  <span className="w-5 h-5 rounded flex items-center justify-center text-[10px]"
                    style={{ background:active?"rgba(79,142,247,0.2)":"rgba(255,255,255,0.06)" }}>{icon}</span>
                  {label}
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="p-5 flex flex-col gap-4">
              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3">
                {[["Total Revenue","$128.4K","var(--blue)","↑ 12.3%",true],
                  ["Transactions","4,821","var(--emerald)","↑ 8.7%",true],
                  ["Avg Basket","$26.6","var(--purple)","↓ 2.1%",false]].map(([label,val,color,change,up])=>(
                  <div key={label as string} className="rounded-xl p-3.5" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
                    <div className="text-[11px] mb-1.5" style={{ color:"var(--muted)" }}>{label}</div>
                    <div className="text-xl font-bold tracking-tight" style={{ color:color as string }}>{val}</div>
                    <div className="text-[10px] mt-1" style={{ color:up?"var(--emerald)":"#f87171" }}>{change}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="rounded-xl p-3.5 flex-1" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
                <div className="text-[11px] mb-3" style={{ color:"var(--muted)" }}>Revenue — last 7 days</div>
                <div className="flex items-end gap-1.5 h-20">
                  {BAR_DATA.map((h,i)=>(
                    <div key={i} className="flex-1 rounded-t" style={{
                      height:`${h}%`,
                      background:`linear-gradient(to top, ${BAR_COLORS[i]}, ${BAR_COLORS[i]}88)`
                    }}/>
                  ))}
                </div>
              </div>

              {/* Live feed */}
              <div className="rounded-2xl p-4" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
                <div className="flex items-center gap-2 mb-4 text-[13px]">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background:"var(--emerald)", boxShadow:"0 0 8px var(--emerald)", animation:"pulse 2s infinite" }}/>
                  Live transactions
                </div>
                {feed.map(f=>(
                  <div key={f.id} className="flex items-center gap-3 py-2.5 text-[12px]" style={{ borderBottom:"1px solid var(--border)", animation:"slideIn 0.4s ease" }}>
                    <span style={{ color:"var(--muted)" }}>⬡</span>
                    <div>
                      <div className="font-medium">{f.item}</div>
                      <div className="text-[11px]" style={{ color:"var(--muted)" }}>{f.store}</div>
                    </div>
                    <div className="ml-auto font-bold" style={{ color:"var(--emerald)" }}>+${f.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
