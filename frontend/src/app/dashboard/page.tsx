"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import { api } from "@/lib/api";
import { useBusinessStore } from "@/store/useBusinessStore";

/* ── types ── */
interface HistoryRow { date: string; sales: number; expenses: number; profit: number; }
interface WeekData   { history: HistoryRow[]; summary: Record<string, number>; }

/* ── stagger helpers ── */
const fadeUp  = { hidden:{opacity:0,y:20}, show:{opacity:1,y:0} };
const stagger = { show:{ transition:{ staggerChildren:.08 } } };

/* ── custom tooltip ── */
const ChartTip = ({ active, payload, label }: {active?:boolean; payload?:{value:number;name:string}[]; label?:string}) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:"rgba(4,4,20,.95)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"10px",padding:"12px 16px",fontSize:"12px"}}>
      <div style={{color:"#94A3B8",marginBottom:"6px"}}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{color:p.name==="sales"?"#3B82F6":p.name==="expenses"?"#EF4444":"#10B981",fontWeight:600}}>
          {p.name.charAt(0).toUpperCase()+p.name.slice(1)}: KES {p.value?.toLocaleString()}
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const router  = useRouter();
  const { user, token, insights, setInsights, logout } = useBusinessStore(s => s);
  const [week,       setWeek]       = useState<WeekData|null>(null);
  const [loading,    setLoading]    = useState(true);
  const [sideOpen,   setSideOpen]   = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ── starfield ── */
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    const COLORS = ["#ffffff","#06B6D4","#8B5CF6","#3B82F6"];
    const stars = Array.from({length:220},()=>({
      x:Math.random()*W, y:Math.random()*H,
      size:Math.random()*1.4+.2, opacity:Math.random()*.6+.1,
      twinkle:Math.random()*Math.PI*2, speed:.006+Math.random()*.014,
      color:COLORS[Math.floor(Math.random()*4)],
    }));

    let id: number;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      stars.forEach(s => {
        s.twinkle += s.speed;
        const a = s.opacity*(0.6+0.4*Math.sin(s.twinkle));
        ctx.globalAlpha = a;
        if(s.color!=="#ffffff"){ ctx.shadowBlur=6; ctx.shadowColor=s.color; }
        ctx.fillStyle = s.color;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.size,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0; ctx.globalAlpha=1;
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize",onResize); };
  }, []);

  /* ── data load ── */
  useEffect(() => {
    if (!token || !user) { router.push("/login"); return; }
    Promise.all([
      api.getInsights(token).then(d => setInsights(d.insights)).catch(()=>{}),
      api.getWeek(token).then(d => setWeek(d)).catch(()=>{}),
    ]).finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    if (token) await api.logout(token).catch(()=>{});
    logout(); router.push("/login");
  };

  /* ── chart data ── */
  const chartData = (week?.history ?? [])
    .slice().reverse()
    .map(r => ({
      date: new Date(r.date).toLocaleDateString("en-KE",{weekday:"short"}),
      sales:    r.sales,
      expenses: r.expenses,
      profit:   r.profit,
    }));

  const ins = insights;
  const scoreColor = !ins?.hasData ? "#475569"
    : ins.score>=75 ? "#10B981"
    : ins.score>=50 ? "#F59E0B" : "#EF4444";

  const insightCards = ins?.hasData ? [
    { icon:"📈", color:"#3B82F6", title:"Revenue", body: ins.summary },
    ins.warning ? { icon:"⚠️", color:"#EF4444", title:"Alert", body: ins.warning } : null,
    { icon:"💡", color:"#8B5CF6", title:"Recommendation", body: ins.recommendation },
    ins.topProduct !== "No products recorded yet"
      ? { icon:"🏆", color:"#F59E0B", title:"Top Product", body:`${ins.topProduct} is your best performer this week.` }
      : null,
  ].filter(Boolean) : [];

  if (loading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#02020c"}}>
      <motion.div animate={{rotate:360}} transition={{duration:.8,repeat:Infinity,ease:"linear"}}
        style={{width:32,height:32,border:"2px solid rgba(255,255,255,.08)",borderTopColor:"#06B6D4",borderRadius:"50%"}}/>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#02020c",position:"relative",overflow:"hidden"}}>

      {/* starfield */}
      <canvas ref={canvasRef} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}/>

      {/* aurora */}
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
        <div style={{position:"absolute",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(59,130,246,.10) 0%,transparent 65%)",top:-200,left:-150,animation:"aA 22s ease-in-out infinite alternate"}}/>
        <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,.08) 0%,transparent 65%)",top:100,right:-100,animation:"aB 28s ease-in-out infinite alternate"}}/>
        <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(6,182,212,.07) 0%,transparent 65%)",bottom:-100,left:"30%",animation:"aC 20s ease-in-out infinite alternate"}}/>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        @keyframes aA{to{transform:translate(80px,60px) scale(1.1);}}
        @keyframes aB{to{transform:translate(-60px,100px) scale(.9);}}
        @keyframes aC{to{transform:translate(-80px,-60px) scale(1.08);}}
        @keyframes spin{to{transform:rotate(360deg);}}
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'DM Sans',sans-serif;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:2px;}
      `}</style>

      {/* ── LAYOUT ── */}
      <div style={{position:"relative",zIndex:2,display:"flex",minHeight:"100vh"}}>

        {/* ── SIDEBAR ── */}
        <motion.aside
          initial={{x:-240}} animate={{x:0}}
          transition={{type:"spring",stiffness:260,damping:28}}
          style={{
            width:220, flexShrink:0,
            background:"rgba(2,2,12,.85)",
            borderRight:"1px solid rgba(255,255,255,.06)",
            backdropFilter:"blur(40px)",
            display:"flex", flexDirection:"column",
            padding:"28px 16px",
            position:"sticky", top:0, height:"100vh",
          }}>

          {/* logo */}
          <div style={{marginBottom:40,paddingLeft:8}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,background:"linear-gradient(135deg,#fff,#06B6D4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:4}}>
              B.O.S.S
            </div>
            <div style={{fontSize:10,color:"#475569",letterSpacing:".12em",textTransform:"uppercase"}}>
              {user?.business}
            </div>
          </div>

          {/* nav items */}
          {[
            { icon:"⬡", label:"Dashboard", href:"/dashboard",  active:true  },
            { icon:"＋", label:"Add Entry",  href:"/input",      active:false },
            { icon:"🧠", label:"Insights",   href:"/insights",   active:false },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"10px 12px", borderRadius:10,
              background: item.active ? "rgba(59,130,246,.12)" : "transparent",
              border: item.active ? "1px solid rgba(59,130,246,.2)" : "1px solid transparent",
              color: item.active ? "#F1F5F9" : "#475569",
              fontSize:13, fontWeight:500, textDecoration:"none",
              marginBottom:4, transition:"all .2s ease",
            }}
              onMouseEnter={e=>{ if(!item.active){ (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,.04)"; (e.currentTarget as HTMLElement).style.color="#94A3B8"; }}}
              onMouseLeave={e=>{ if(!item.active){ (e.currentTarget as HTMLElement).style.background="transparent"; (e.currentTarget as HTMLElement).style.color="#475569"; }}}>
              <span style={{fontSize:14}}>{item.icon}</span>
              {item.label}
            </Link>
          ))}

          {/* spacer */}
          <div style={{flex:1}}/>

          {/* user + logout */}
          <div style={{borderTop:"1px solid rgba(255,255,255,.06)",paddingTop:16}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,padding:"0 4px"}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff",flexShrink:0}}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{fontSize:12,color:"#F1F5F9",fontWeight:500}}>{user?.name?.split(" ")[0]}</div>
                <div style={{fontSize:10,color:"#475569"}}>{user?.email}</div>
              </div>
            </div>
            <button onClick={handleLogout} style={{
              width:"100%",padding:"8px 12px",borderRadius:10,border:"1px solid rgba(255,255,255,.06)",
              background:"transparent",color:"#475569",fontSize:12,cursor:"pointer",
              transition:"all .2s",textAlign:"left" as const,
            }}
              onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.color="#EF4444"; (e.currentTarget as HTMLElement).style.borderColor="rgba(239,68,68,.25)"; }}
              onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.color="#475569"; (e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,.06)"; }}>
              Sign out
            </button>
          </div>
        </motion.aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{flex:1,overflowY:"auto",padding:"32px 36px"}}>

          {/* ── TOPBAR ── */}
          <motion.div variants={fadeUp} initial="hidden" animate="show"
            style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:36}}>
            <div>
              <div style={{fontSize:11,color:"#3B82F6",letterSpacing:".12em",textTransform:"uppercase",marginBottom:6}}>
                {new Date().toLocaleDateString("en-KE",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
              </div>
              <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(26px,3vw,38px)",fontWeight:800,letterSpacing:"-.03em",lineHeight:1.05,color:"#F1F5F9"}}>
                Good {new Date().getHours()<12?"morning":new Date().getHours()<17?"afternoon":"evening"},{" "}
                <span style={{background:"linear-gradient(135deg,#06B6D4,#8B5CF6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                  {user?.name?.split(" ")[0]}.
                </span>
              </h1>
              {ins?.hasData && (
                <p style={{fontSize:13,color:"#475569",marginTop:6,fontWeight:300}}>
                  {ins.profitTrend !== "neutral" && ins.profitTrend !== "0%"
                    ? `Profit is ${ins.profitTrend.startsWith("+") ? "up" : "down"} ${ins.profitTrend} from yesterday.`
                    : "Here's your business overview for today."}
                </p>
              )}
            </div>
            <Link href="/input" style={{
              display:"inline-flex",alignItems:"center",gap:8,padding:"10px 20px",
              background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",
              border:"none",borderRadius:12,color:"#fff",fontSize:13,fontWeight:500,
              textDecoration:"none",flexShrink:0,
              boxShadow:"0 8px 32px rgba(59,130,246,.3)",
              transition:"all .25s ease",
            }}
              onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.transform="translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow="0 16px 48px rgba(59,130,246,.45)"; }}
              onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.transform="none"; (e.currentTarget as HTMLElement).style.boxShadow="0 8px 32px rgba(59,130,246,.3)"; }}>
              + Add Entry
            </Link>
          </motion.div>

          {/* ── NO DATA ── */}
          <AnimatePresence>
          {!ins?.hasData && (
            <motion.div variants={fadeUp} initial="hidden" animate="show"
              style={{background:"rgba(255,255,255,.022)",border:"1px solid rgba(255,255,255,.07)",borderRadius:20,padding:"60px 40px",textAlign:"center",marginBottom:32}}>
              <div style={{fontSize:48,marginBottom:16}}>📊</div>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,marginBottom:12,color:"#F1F5F9"}}>No data yet for today</h2>
              <p style={{color:"#94A3B8",fontSize:15,marginBottom:28,fontWeight:300}}>Add your first entry to unlock your full intelligence dashboard.</p>
              <Link href="/input" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"14px 28px",background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",borderRadius:12,color:"#fff",fontSize:15,fontWeight:500,textDecoration:"none"}}>
                Enter Today&apos;s Data →
              </Link>
            </motion.div>
          )}
          </AnimatePresence>

          {ins?.hasData && (
            <motion.div variants={stagger} initial="hidden" animate="show">

              {/* ── KPI ROW ── */}
              <motion.div variants={stagger} style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
                {[
                  { label:"Revenue",      value:`KES ${ins.today?.sales.toLocaleString()}`,    color:"#3B82F6", icon:"↑", sub: ins.profitTrend!=="neutral" ? `${ins.profitTrend} vs yesterday` : "Today" },
                  { label:"Expenses",     value:`KES ${ins.today?.expenses.toLocaleString()}`,  color:"#EF4444", icon:"↓", sub:"Today" },
                  { label:"Net Profit",   value:`KES ${ins.today?.profit.toLocaleString()}`,    color:"#10B981", icon:"◆", sub:`${ins.today?.margin}% margin` },
                  { label:"Score",        value:`${ins.score}/100`,                             color:scoreColor, icon:"★", sub: ins.score>=75?"Excellent":ins.score>=50?"Good":"Needs attention" },
                ].map((c,i) => (
                  <motion.div key={c.label} variants={fadeUp}
                    whileHover={{y:-3,transition:{duration:.2}}}
                    style={{background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.07)",borderRadius:16,padding:"22px 20px",cursor:"default",position:"relative",overflow:"hidden"}}>
                    <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 80% 20%,${c.color}08 0%,transparent 60%)`,pointerEvents:"none"}}/>
                    <div style={{fontSize:10,color:"#475569",letterSpacing:".08em",textTransform:"uppercase",marginBottom:10}}>{c.label}</div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:700,color:c.color,letterSpacing:"-.02em",marginBottom:4}}>{c.value}</div>
                    <div style={{fontSize:11,color:"#475569",fontWeight:400}}>{c.sub}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* ── CHART + SCORE ── */}
              <motion.div variants={stagger} style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12,marginBottom:20}}>

                {/* chart */}
                <motion.div variants={fadeUp}
                  style={{background:"rgba(255,255,255,.022)",border:"1px solid rgba(255,255,255,.07)",borderRadius:16,padding:"24px"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
                    <div>
                      <div style={{fontSize:11,color:"#475569",letterSpacing:".08em",textTransform:"uppercase",marginBottom:4}}>7-Day Revenue</div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700,color:"#F1F5F9"}}>
                        KES {(week?.summary?.total_sales||0).toLocaleString()}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:16,fontSize:11,color:"#475569"}}>
                      {[{c:"#3B82F6",l:"Sales"},{c:"#EF4444",l:"Expenses"},{c:"#10B981",l:"Profit"}].map(x=>(
                        <div key={x.l} style={{display:"flex",alignItems:"center",gap:5}}>
                          <div style={{width:8,height:8,borderRadius:2,background:x.c}}/>
                          {x.l}
                        </div>
                      ))}
                    </div>
                  </div>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={160}>
                      <AreaChart data={chartData} margin={{top:0,right:0,left:0,bottom:0}}>
                        <defs>
                          <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#3B82F6" stopOpacity={.25}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#EF4444" stopOpacity={.2}/>
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#10B981" stopOpacity={.25}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" vertical={false}/>
                        <XAxis dataKey="date" tick={{fill:"#475569",fontSize:10}} axisLine={false} tickLine={false}/>
                        <YAxis tick={{fill:"#475569",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                        <Tooltip content={<ChartTip/>}/>
                        <Area type="monotone" dataKey="sales"    stroke="#3B82F6" strokeWidth={1.5} fill="url(#gS)"/>
                        <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={1.5} fill="url(#gE)"/>
                        <Area type="monotone" dataKey="profit"   stroke="#10B981" strokeWidth={1.5} fill="url(#gP)"/>
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{height:160,display:"flex",alignItems:"center",justifyContent:"center",color:"#475569",fontSize:13}}>
                      Add more entries to see your trend chart
                    </div>
                  )}
                </motion.div>

                {/* score ring */}
                <motion.div variants={fadeUp}
                  style={{background:"rgba(255,255,255,.022)",border:"1px solid rgba(255,255,255,.07)",borderRadius:16,padding:"24px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#475569",letterSpacing:".08em",textTransform:"uppercase",marginBottom:20}}>Business Health</div>
                  <svg width={120} height={120} viewBox="0 0 120 120">
                    <circle cx={60} cy={60} r={50} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={8}/>
                    <circle cx={60} cy={60} r={50} fill="none" stroke={scoreColor} strokeWidth={8}
                      strokeLinecap="round"
                      strokeDasharray={`${ins.score * 3.14159} 314.159`}
                      transform="rotate(-90 60 60)"
                      style={{transition:"stroke-dasharray 1.2s cubic-bezier(.16,1,.3,1)"}}/>
                    <text x={60} y={55} textAnchor="middle" fill="#F1F5F9" fontSize={26} fontWeight={800} fontFamily="Syne,sans-serif">{ins.score}</text>
                    <text x={60} y={72} textAnchor="middle" fill="#475569" fontSize={10} fontFamily="DM Sans,sans-serif">/100</text>
                  </svg>
                  <div style={{fontSize:13,color:scoreColor,fontWeight:600,marginTop:12}}>
                    {ins.score>=75?"Excellent":ins.score>=50?"Good":"Needs Work"}
                  </div>
                  <div style={{fontSize:12,color:"#475569",marginTop:4,fontWeight:300,lineHeight:1.5}}>
                    {ins.score>=75?"Keep it up.":ins.score>=50?"Room to grow.":"Take action today."}
                  </div>
                </motion.div>
              </motion.div>

              {/* ── AI INSIGHT CARDS ── */}
              <motion.div variants={fadeUp} style={{marginBottom:20}}>
                <div style={{fontSize:11,color:"#8B5CF6",letterSpacing:".12em",textTransform:"uppercase",marginBottom:14}}>
                  Intelligence Feed
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:10}}>
                  {insightCards.map((card, i) => card && (
                    <motion.div key={i} variants={fadeUp}
                      whileHover={{y:-3,transition:{duration:.2}}}
                      style={{background:"rgba(255,255,255,.022)",border:`1px solid ${card.color}22`,borderRadius:14,padding:"20px",position:"relative",overflow:"hidden",cursor:"default"}}>
                      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${card.color},transparent)`}}/>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                        <div style={{width:30,height:30,borderRadius:8,background:`${card.color}18`,border:`1px solid ${card.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>
                          {card.icon}
                        </div>
                        <div style={{fontSize:11,color:card.color,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase"}}>{card.title}</div>
                      </div>
                      <p style={{fontSize:13,color:"#94A3B8",lineHeight:1.6,fontWeight:300}}>{card.body}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── WEEK STATS ROW ── */}
              {ins.weekStats && (
                <motion.div variants={fadeUp}
                  style={{background:"rgba(255,255,255,.018)",border:"1px solid rgba(255,255,255,.06)",borderRadius:16,padding:"20px 24px"}}>
                  <div style={{fontSize:11,color:"#475569",letterSpacing:".08em",textTransform:"uppercase",marginBottom:16}}>This Week</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:16}}>
                    {[
                      { label:"Total Sales",    value:`KES ${ins.weekStats.totalSales.toLocaleString()}`,    color:"#3B82F6" },
                      { label:"Total Expenses", value:`KES ${ins.weekStats.totalExpenses.toLocaleString()}`, color:"#EF4444" },
                      { label:"Total Profit",   value:`KES ${ins.weekStats.totalProfit.toLocaleString()}`,   color:"#10B981" },
                      { label:"Avg Daily",      value:`KES ${ins.weekStats.avgDailySales.toLocaleString()}`, color:"#06B6D4" },
                      { label:"Days Recorded",  value:`${ins.weekStats.daysRecorded} / 7`,                  color:"#8B5CF6" },
                    ].map(s => (
                      <div key={s.label} style={{borderLeft:"2px solid "+s.color+"40",paddingLeft:12}}>
                        <div style={{fontSize:10,color:"#475569",letterSpacing:".06em",textTransform:"uppercase",marginBottom:6}}>{s.label}</div>
                        <div style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:700,color:s.color}}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
