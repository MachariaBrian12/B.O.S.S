"use client"
import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Navbar from "@/components/layout/Navbar"
import Hero from "@/components/sections/Hero"

const COLORS = ["#00d4ff","#4f8ef7","#a855f7","#10d98a"]

export default function Home() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const gPos = useRef({ x:0, y:0 })
  const mPos = useRef({ x:0, y:0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mPos.current = { x:e.clientX, y:e.clientY }
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX+"px"
        cursorRef.current.style.top = e.clientY+"px"
      }
    }
    const anim = () => {
      gPos.current.x += (mPos.current.x - gPos.current.x)*0.08
      gPos.current.y += (mPos.current.y - gPos.current.y)*0.08
      if (glowRef.current) {
        glowRef.current.style.left = gPos.current.x+"px"
        glowRef.current.style.top = gPos.current.y+"px"
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

  const particles = Array.from({length:32}, (_,i) => {
    const c = COLORS[i%COLORS.length]
    const sz = Math.random()*3+1
    return { c, sz, left:`${Math.random()*100}%`, dur:`${Math.random()*10+8}s`, delay:`-${Math.random()*10}s` }
  })

  return (
    <main style={{ background:"var(--bg)", minHeight:"100vh" }}>
      {/* Cursor */}
      <div ref={cursorRef} className="fixed pointer-events-none z-[9999] rounded-full"
        style={{ width:12, height:12, background:"var(--cyan)", transform:"translate(-50%,-50%)", mixBlendMode:"screen", transition:"width 0.2s, height 0.2s" }}/>
      <div ref={glowRef} className="fixed pointer-events-none z-[9998] rounded-full"
        style={{ width:280, height:280, background:"radial-gradient(circle,rgba(79,142,247,0.12) 0%,transparent 70%)", transform:"translate(-50%,-50%)" }}/>

      {/* Particles */}
      {particles.map((p,i)=>(
        <div key={i} className="particle fixed rounded-full pointer-events-none"
          style={{ width:p.sz, height:p.sz, left:p.left, background:p.c, "--dur":p.dur, "--delay":p.delay } as any}/>
      ))}

      <Navbar />
      <Hero />

      {/* STATS */}
      <motion.div
        initial={{ opacity:0 }}
        whileInView={{ opacity:1 }}
        transition={{ duration:0.8 }}
        viewport={{ once:true }}
        className="flex justify-center gap-12 flex-wrap px-10 py-16"
        style={{ borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}
      >
        {[["50K+","Active merchants","linear-gradient(135deg,#fff,var(--cyan))"],
          ["$2.8B","Processed monthly","linear-gradient(135deg,var(--emerald),var(--cyan))"],
          ["99.99%","Uptime SLA","linear-gradient(135deg,var(--purple),var(--pink))"],
          ["140+","Countries","linear-gradient(135deg,var(--blue),var(--cyan))"]].map(([num,lbl,grad],i)=>(
          <motion.div key={lbl} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
            transition={{ delay:i*0.1, duration:0.6 }} viewport={{ once:true }} className="text-center">
            <div className="text-[40px] font-extrabold tracking-tight"
              style={{ background:grad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{num}</div>
            <div className="text-[13px] mt-1" style={{ color:"var(--muted)" }}>{lbl}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* FEATURES */}
      <motion.section id="features"
        initial={{ opacity:0, y:40 }}
        whileInView={{ opacity:1, y:0 }}
        transition={{ duration:0.8 }}
        viewport={{ once:true }}
        className="px-10 py-24 max-w-6xl mx-auto"
      >
        <div className="text-[11px] tracking-[2px] uppercase mb-4" style={{ color:"var(--cyan)" }}>Platform</div>
        <h2 className="font-extrabold leading-tight mb-4" style={{ fontSize:"clamp(32px,4vw,52px)", letterSpacing:"-2px" }}>
          Everything you need<br/><span className="grad-text">to run modern retail</span>
        </h2>
        <p className="text-[16px] mb-16 max-w-lg leading-relaxed" style={{ color:"var(--muted)" }}>
          From inventory to AI insights — a complete operating system for your business.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[
            {icon:"📊",title:"Real-time Analytics",desc:"Live dashboards tracking revenue and customer behavior across all stores.",span:2,bg:"rgba(79,142,247,0.15)"},
            {icon:"📦",title:"Smart Inventory",desc:"Auto-reorder, expiry tracking, supplier sync.",span:1,bg:"rgba(16,217,138,0.15)"},
            {icon:"📱",title:"Mobile POS",desc:"Full POS on any device. Works offline.",span:1,bg:"rgba(168,85,247,0.15)"},
            {icon:"⚡",title:"QR Payments",desc:"Accept QR, NFC, card, cash in under 2 seconds.",span:1,bg:"rgba(0,212,255,0.15)"},
            {icon:"👥",title:"Employee Tracking",desc:"Staff performance, shifts, and customer profiles — fully automated.",span:2,bg:"rgba(244,114,182,0.15)"},
            {icon:"🔄",title:"Offline Sync",desc:"Sell without internet. Syncs automatically.",span:1,bg:"rgba(79,142,247,0.15)"},
            {icon:"🧾",title:"Smart Receipts",desc:"Digital, printed, or WhatsApp receipts.",span:1,bg:"rgba(16,217,138,0.15)"},
            {icon:"🏪",title:"Multi-store HQ",desc:"Manage unlimited locations from one command center.",span:1,bg:"rgba(168,85,247,0.15)"},
          ].map(({icon,title,desc,span,bg},i)=>(
            <motion.div key={title}
              initial={{ opacity:0, y:20 }}
              whileInView={{ opacity:1, y:0 }}
              whileHover={{ y:-4, borderColor:"rgba(255,255,255,0.15)" }}
              transition={{ delay:i*0.05, duration:0.5 }}
              viewport={{ once:true }}
              className="rounded-2xl p-7"
              style={{ background:"var(--surface)", border:"1px solid var(--border)", gridColumn:`span ${span}` }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4" style={{ background:bg }}>{icon}</div>
              <h3 className="text-[16px] font-semibold mb-2">{title}</h3>
              <p className="text-[13px] leading-relaxed" style={{ color:"var(--muted)" }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* AI SECTION */}
      <motion.div id="ai"
        initial={{ opacity:0 }}
        whileInView={{ opacity:1 }}
        transition={{ duration:0.8 }}
        viewport={{ once:true }}
        className="px-10 py-24"
        style={{ borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", background:"linear-gradient(180deg,transparent,rgba(79,142,247,0.04),transparent)" }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-[11px] tracking-[2px] uppercase mb-4" style={{ color:"var(--cyan)" }}>Intelligence</div>
            <h2 className="font-extrabold leading-tight mb-4" style={{ fontSize:"clamp(32px,4vw,52px)", letterSpacing:"-2px" }}>
              Your AI-powered<br/><span className="grad-text">business co-pilot</span>
            </h2>
            <p className="text-[16px] mb-8 leading-relaxed" style={{ color:"var(--muted)" }}>
              Ask questions in plain English. Get instant insights on inventory, sales, and customer behavior.
            </p>
            {["Predictive restock recommendations","Anomaly detection & fraud alerts","Demand forecasting across stores","Personalized customer offers"].map(f=>(
              <div key={f} className="flex items-center gap-3 text-[14px] mb-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0"
                  style={{ background:"rgba(16,217,138,0.15)", color:"var(--emerald)" }}>✓</div>
                {f}
              </div>
            ))}
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ background:"rgba(12,12,24,0.9)", border:"1px solid var(--border2)" }}>
            <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ background:"rgba(255,255,255,0.03)", borderBottom:"1px solid var(--border)" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold text-black"
                style={{ background:"linear-gradient(135deg,var(--blue),var(--cyan))" }}>B</div>
              <span className="text-[13px] font-medium">B.O.S.S AI</span>
              <span className="text-[11px] ml-auto" style={{ color:"var(--emerald)" }}>● Online</span>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div className="self-end max-w-[80%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid var(--border)" }}>
                What were my top products this week?
              </div>
              <div className="self-start max-w-[80%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed" style={{ background:"rgba(79,142,247,0.15)", border:"1px solid rgba(79,142,247,0.2)" }}>
                Top 5 this week:<br/><br/>
                1. <strong>Arabica Blend</strong> — $4,821 (↑23%)<br/>
                2. <strong>Cold Brew Kit</strong> — $3,204 (↑11%)<br/>
                3. <strong>Matcha Latte Set</strong> — $2,102 (↑44%)
              </div>
              <div className="self-end max-w-[80%] px-4 py-3 rounded-2xl text-[13px]" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid var(--border)" }}>
                Should I restock Matcha?
              </div>
              <div className="self-start max-w-[80%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed" style={{ background:"rgba(79,142,247,0.15)", border:"1px solid rgba(79,142,247,0.2)" }}>
                ✅ <strong>Yes — restock immediately.</strong> Stock: 3 units. At 44% growth you'll sell out in ~18 hours. Order 24 units today.
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* PRICING */}
      <motion.section id="pricing"
        initial={{ opacity:0, y:40 }}
        whileInView={{ opacity:1, y:0 }}
        transition={{ duration:0.8 }}
        viewport={{ once:true }}
        className="px-10 py-24 max-w-6xl mx-auto"
      >
        <div className="text-[11px] tracking-[2px] uppercase mb-4" style={{ color:"var(--cyan)" }}>Pricing</div>
        <h2 className="font-extrabold leading-tight mb-4" style={{ fontSize:"clamp(32px,4vw,52px)", letterSpacing:"-2px" }}>
          Simple, transparent<br/><span className="grad-text">pricing that scales</span>
        </h2>
        <div className="grid grid-cols-3 gap-5 mt-16">
          {[
            { tier:"Starter", price:"$29", desc:"For single-location businesses.", features:["1 store","Basic analytics","500 products","Email support"], featured:false },
            { tier:"Growth", price:"$89", desc:"For growing multi-location teams.", features:["Up to 5 stores","AI insights","Unlimited products","Priority support","Employee tracking"], featured:true },
            { tier:"Enterprise", price:"Custom", desc:"Unlimited scale + dedicated support.", features:["Unlimited stores","Custom AI","99.99% SLA","Dedicated engineer"], featured:false },
          ].map(({tier,price,desc,features,featured})=>(
            <motion.div key={tier}
              whileHover={{ y:-6 }}
              transition={{ duration:0.3 }}
              className="rounded-3xl p-9 relative overflow-hidden"
              style={{
                background: featured ? "linear-gradient(135deg,rgba(79,142,247,0.12),rgba(168,85,247,0.08))" : "var(--surface)",
                border: featured ? "1px solid rgba(79,142,247,0.4)" : "1px solid var(--border)",
                boxShadow: featured ? "0 0 60px rgba(79,142,247,0.1)" : "none",
              }}
            >
              {featured && <div className="absolute top-5 right-5 text-[10px] font-bold px-3 py-1 rounded-full text-black"
                style={{ background:"linear-gradient(135deg,var(--blue),var(--cyan))" }}>POPULAR</div>}
              <div className="text-[12px] tracking-[2px] uppercase mb-3" style={{ color:"var(--muted)" }}>{tier}</div>
              <div className="text-[48px] font-extrabold tracking-tight leading-none mb-1"
                style={ featured ? { background:"linear-gradient(135deg,var(--blue),var(--cyan))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" } : {} }>
                {price}<span className="text-[20px] font-normal" style={{ color:"var(--muted)", WebkitTextFillColor:"var(--muted)" }}>{price!=="Custom"?"/mo":""}</span>
              </div>
              <p className="text-[13px] mb-6 leading-relaxed" style={{ color:"var(--muted)" }}>{desc}</p>
              <div className="flex flex-col gap-2.5 mb-7">
                {features.map(f=>(
                  <div key={f} className="flex items-center gap-2.5 text-[13px]">
                    <div className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0"
                      style={{ background:"rgba(16,217,138,0.15)", color:"var(--emerald)" }}>✓</div>
                    {f}
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale:1.02 }}
                whileTap={{ scale:0.97 }}
                className="w-full py-3.5 rounded-full text-[14px] font-semibold"
                style={featured ? {
                  background:"linear-gradient(135deg,var(--blue),var(--cyan))",
                  color:"#000", border:"none", boxShadow:"0 0 24px rgba(79,142,247,0.3)", cursor:"none"
                } : {
                  background:"transparent", border:"1px solid var(--border2)", color:"#f0f0ff", cursor:"none"
                }}
              >
                {featured ? "Start free trial" : tier==="Enterprise" ? "Contact sales" : "Get started"}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* TESTIMONIALS */}
      <motion.section id="reviews"
        initial={{ opacity:0, y:40 }}
        whileInView={{ opacity:1, y:0 }}
        transition={{ duration:0.8 }}
        viewport={{ once:true }}
        className="px-10 py-24 max-w-6xl mx-auto"
      >
        <div className="text-[11px] tracking-[2px] uppercase mb-4" style={{ color:"var(--cyan)" }}>Reviews</div>
        <h2 className="font-extrabold leading-tight mb-12" style={{ fontSize:"clamp(32px,4vw,52px)", letterSpacing:"-2px" }}>
          Loved by <span className="grad-text">50,000+ merchants</span>
        </h2>
        <div className="grid grid-cols-3 gap-5">
          {[
            { quote:"B.O.S.S transformed how we run our 8 coffee shops. The AI restock alerts saved us $12K last quarter.", name:"Amara Mumo", role:"CEO, Roast Republic", grad:"linear-gradient(135deg,var(--blue),var(--cyan))" },
            { quote:"The offline sync is a game-changer. Our rural locations never miss a sale.", name:"James Kariuki", role:"Founder, FreshMart", grad:"linear-gradient(135deg,var(--emerald),var(--cyan))" },
            { quote:"We replaced 3 tools with B.O.S.S. It feels like NASA mission control for retail.", name:"Sara Wanjiru", role:"Director, Zuri Stores", grad:"linear-gradient(135deg,var(--purple),var(--pink))" },
          ].map(({quote,name,role,grad},i)=>(
            <motion.div key={name}
              initial={{ opacity:0, y:20 }}
              whileInView={{ opacity:1, y:0 }}
              whileHover={{ y:-4 }}
              transition={{ delay:i*0.1, duration:0.5 }}
              viewport={{ once:true }}
              className="rounded-2xl p-7"
              style={{ background:"var(--surface)", border:"1px solid var(--border)" }}
            >
              <div className="text-[14px] mb-4" style={{ color:"#fbbf24" }}>★★★★★</div>
              <p className="text-[14px] mb-5 leading-relaxed" style={{ color:"var(--muted)" }}>{quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold text-black flex-shrink-0"
                  style={{ background:grad }}>{name.split(" ").map(n=>n[0]).join("")}</div>
                <div>
                  <div className="text-[13px] font-medium">{name}</div>
                  <div className="text-[11px]" style={{ color:"var(--muted)" }}>{role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="px-10 py-16 max-w-6xl mx-auto flex justify-between items-center flex-wrap gap-6"
        style={{ borderTop:"1px solid var(--border)" }}>
        <div className="text-[16px] font-extrabold tracking-[2px]"
          style={{ background:"linear-gradient(90deg,var(--cyan),var(--blue),var(--purple))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          B.O.S.S
        </div>
        <div className="flex gap-6">
          {["Product","Docs","Blog","Careers","Status"].map(l=>(
            <a key={l} href="#" className="text-[13px] transition-colors"
              style={{ color:"var(--muted)", textDecoration:"none" }}
              onMouseEnter={e=>(e.currentTarget.style.color="#f0f0ff")}
              onMouseLeave={e=>(e.currentTarget.style.color="var(--muted)")}>
              {l}
            </a>
          ))}
        </div>
        <div className="text-[12px]" style={{ color:"var(--muted)" }}>© 2026 B.O.S.S Inc. All rights reserved.</div>
      </footer>
    </main>
  )
}
