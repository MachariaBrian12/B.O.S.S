"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "@/lib/api";
import { useBusinessStore } from "@/store/useBusinessStore";

/* ── types ── */
interface FeedItem   { id:string; type:string; icon:string; title:string; body:string; time:string; priority:number; }
interface Signal     { id:string; confidence:number; direction:string; title:string; body:string; timeframe:string; }
interface Alert      { level:string; title:string; body:string; action:string; }
interface HistoryRow { date:string; sales:number; expenses:number; profit:number; }

/* ── motion variants ── */
const fadeUp  = { hidden:{opacity:0,y:18}, show:{opacity:1,y:0,transition:{duration:.5,ease:[.16,1,.3,1] as [number,number,number,number]}} };
const stagger = { hidden:{}, show:{transition:{staggerChildren:.07}} };

/* ── colour helpers ── */
const alertColor = (level:string) => ({
  critical:"#EF4444", warning:"#F59E0B",
  opportunity:"#06B6D4", growth:"#10B981",
}[level] ?? "#94A3B8");

const signalColor = (dir:string) => dir==="up"?"#10B981":dir==="down"?"#EF4444":"#94A3B8";

/* ── chart tooltip ── */
const ChartTip = ({active,payload,label}:{active?:boolean;payload?:{value:number;name:string}[];label?:string}) => {
  if (!active||!payload?.length) return null;
  const colors:Record<string,string> = {sales:"#3B82F6",expenses:"#EF4444",profit:"#10B981"};
  return (
    <div className="overflow-x-hidden"  style={{background:"rgba(4,4,20,.97)",border:"1px solid rgba(255,255,255,.09)",borderRadius:10,padding:"10px 14px",fontSize:11}}>
      <div style={{color:"#64748B",marginBottom:6}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{color:colors[p.name]||"#94A3B8",fontWeight:600,marginBottom:2}}>
          {p.name.charAt(0).toUpperCase()+p.name.slice(1)}: KES {p.value?.toLocaleString()}
        </div>
      ))}
    </div>
  );
};

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export default function Dashboard() {
  const router  = useRouter();
  const { user, token, insights, setInsights, logout } = useBusinessStore(s=>s);
  const [week,    setWeek]    = useState<{history:HistoryRow[];summary:Record<string,number>}|null>(null);
  const [feed,    setFeed]    = useState<FeedItem[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [alerts,  setAlerts]  = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState<"feed"|"signals"|"alerts">("feed");
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ── responsive detection ── */
  useEffect(()=>{
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  },[]);

  /* ── close sidebar on route change / resize to desktop ── */
  useEffect(()=>{ if(!isMobile) setSidebarOpen(false); },[isMobile]);

  /* ── starfield ── */
  useEffect(()=>{
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const onResize = () => { W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; };
    window.addEventListener("resize",onResize);
    const COLS = ["#ffffff","#06B6D4","#8B5CF6","#3B82F6","#10B981"];
    const stars = Array.from({length:200},()=>({
      x:Math.random()*W, y:Math.random()*H,
      size:Math.random()*1.3+.15, opacity:Math.random()*.55+.08,
      twinkle:Math.random()*Math.PI*2, speed:.005+Math.random()*.012,
      color:COLS[Math.floor(Math.random()*5)],
    }));
    let id:number;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      stars.forEach(s=>{
        s.twinkle+=s.speed;
        ctx.globalAlpha = s.opacity*(0.55+0.45*Math.sin(s.twinkle));
        if(s.color!=="#ffffff"){ctx.shadowBlur=5;ctx.shadowColor=s.color;}
        ctx.fillStyle=s.color;
        ctx.beginPath();ctx.arc(s.x,s.y,s.size,0,Math.PI*2);ctx.fill();
        ctx.shadowBlur=0;ctx.globalAlpha=1;
      });
      id=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{cancelAnimationFrame(id);window.removeEventListener("resize",onResize);};
  },[]);

  /* ── data ── */
  useEffect(()=>{
    if(!token||!user){router.push("/login");return;}
    Promise.all([
      api.getInsights(token).then(d=>{
        setInsights(d.insights);
        setFeed(d.insights.feed||[]);
        setAlerts(d.insights.alerts||[]);
      }),
      api.getWeek(token).then(setWeek),
      api.getSignals(token).then(d=>setSignals(d.signals||[])),
    ]).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const handleLogout = async ()=>{
    if(token) await api.logout(token).catch(()=>{});
    logout(); router.push("/login");
  };

  const ins = insights;
  const scoreColor = !ins?.hasData?"#475569":ins.score>=75?"#10B981":ins.score>=50?"#F59E0B":"#EF4444";

  const chartData = (week?.history??[]).slice().reverse().map(r=>({
    date: new Date(r.date).toLocaleDateString("en-KE",{weekday:"short"}),
    sales:r.sales, expenses:r.expenses, profit:r.profit,
  }));

  /* ── loading ── */
  if(loading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#02020c"}}>
      <motion.div animate={{rotate:360}} transition={{duration:.8,repeat:Infinity,ease:"linear"}}
        style={{width:32,height:32,border:"2px solid rgba(255,255,255,.07)",borderTopColor:"#06B6D4",borderRadius:"50%"}}/>
    </div>
  );

  /* ── shared sidebar content ── */
  const SidebarContent = () => (
    <>
      {/* logo */}
      <div style={{marginBottom:36,paddingLeft:6,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:19,
            background:"linear-gradient(135deg,#fff,#06B6D4)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:3}}>
            B.O.S.S
          </div>
          <div style={{fontSize:9,color:"#334155",letterSpacing:".14em",textTransform:"uppercase"}}>
            {user?.business}
          </div>
        </div>
        {isMobile && (
          <button onClick={()=>setSidebarOpen(false)}
            style={{background:"transparent",border:"none",color:"#475569",fontSize:20,cursor:"pointer",padding:4}}>
            ✕
          </button>
        )}
      </div>

      {/* streak */}
      {ins && ins.streak > 0 && (
        <div style={{marginBottom:20,padding:"10px 12px",background:"rgba(245,158,11,.07)",
          border:"1px solid rgba(245,158,11,.18)",borderRadius:10}}>
          <div style={{fontSize:10,color:"#F59E0B",letterSpacing:".08em",textTransform:"uppercase",marginBottom:3}}>🔥 Streak</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700,color:"#F59E0B"}}>
            {ins.streak} {ins.streak===1?"day":"days"}
          </div>
          <div style={{fontSize:10,color:"#475569",marginTop:2}}>consecutive entries</div>
        </div>
      )}

      {/* nav */}
      {[
        {icon:"⬡", label:"Command Centre", href:"/dashboard",  active:true  },
        {icon:"＋", label:"Add Entry",       href:"/input",      active:false },
        {icon:"🧠", label:"Insights",        href:"/insights",   active:false },
      ].map(item=>(
        <Link key={item.label} href={item.href}
          onClick={()=>isMobile && setSidebarOpen(false)}
          style={{
            display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:10,
            background:item.active?"rgba(59,130,246,.11)":"transparent",
            border:item.active?"1px solid rgba(59,130,246,.2)":"1px solid transparent",
            color:item.active?"#F1F5F9":"#475569",fontSize:12,fontWeight:500,
            textDecoration:"none",marginBottom:3,transition:"all .2s ease",
          }}>
          <span style={{fontSize:13}}>{item.icon}</span>{item.label}
        </Link>
      ))}

      <div style={{flex:1}}/>

      {/* health mini-indicator */}
      {ins?.hasData && (
        <div style={{marginBottom:16,padding:"12px",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.05)",borderRadius:10}}>
          <div style={{fontSize:9,color:"#334155",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>Health Score</div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:scoreColor}}>{ins.score}</div>
            <div style={{flex:1}}>
              <div style={{height:3,background:"rgba(255,255,255,.06)",borderRadius:2,overflow:"hidden"}}>
                <motion.div initial={{width:0}} animate={{width:`${ins.score}%`}}
                  transition={{duration:1.2,ease:[.16,1,.3,1] as [number,number,number,number]}}
                  style={{height:"100%",background:`linear-gradient(90deg,#3B82F6,${scoreColor})`,borderRadius:2}}/>
              </div>
              <div style={{fontSize:9,color:"#334155",marginTop:4}}>{ins.score>=75?"Excellent":ins.score>=50?"Good":"Needs attention"}</div>
            </div>
          </div>
        </div>
      )}

      {/* user */}
      <div style={{borderTop:"1px solid rgba(255,255,255,.05)",paddingTop:14}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,padding:"0 2px"}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0}}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{minWidth:0}}>
            <div style={{fontSize:11,color:"#F1F5F9",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name?.split(" ")[0]}</div>
            <div style={{fontSize:9,color:"#334155",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.email}</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          width:"100%",padding:"7px 11px",borderRadius:9,
          border:"1px solid rgba(255,255,255,.05)",background:"transparent",
          color:"#334155",fontSize:11,cursor:"pointer",transition:"all .2s",textAlign:"left" as const,
        }}>
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div style={{minHeight:"100vh",background:"#02020c",position:"relative",overflow:"hidden"}}>

      {/* ── canvas starfield ── */}
      <canvas ref={canvasRef} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}/>

      {/* ── aurora ── */}
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
        {[
          {w:800,h:800,c:"rgba(59,130,246,.09)",t:-250,l:-180,a:"aA"},
          {w:650,h:650,c:"rgba(139,92,246,.07)",t:80,r:-120,a:"aB"},
          {w:600,h:600,c:"rgba(6,182,212,.06)",b:-100,l:"28%",a:"aC"},
        ].map((o,i)=>(
          <div key={i} style={{position:"absolute",width:o.w,height:o.h,borderRadius:"50%",
            background:`radial-gradient(circle,${o.c} 0%,transparent 65%)`,
            top:o.t,left:o.l,right:o.r,bottom:o.b,
            animation:`${o.a} ${[22,28,20][i]}s ease-in-out infinite alternate`}}/>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        @keyframes aA{to{transform:translate(90px,70px) scale(1.12);}}
        @keyframes aB{to{transform:translate(-70px,110px) scale(.88);}}
        @keyframes aC{to{transform:translate(-90px,-70px) scale(1.10);}}
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'DM Sans',sans-serif;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.07);border-radius:2px;}
      `}</style>

      {/* ── MOBILE: overlay backdrop ── */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            key="backdrop"
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={()=>setSidebarOpen(false)}
            style={{position:"fixed",inset:0,zIndex:10,background:"rgba(0,0,0,.6)",backdropFilter:"blur(4px)"}}
          />
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════
          LAYOUT
      ════════════════════════════════════ */}
      <div style={{position:"relative",zIndex:2,display:"flex",minHeight:"100vh"}}>

        {/* ── SIDEBAR: desktop (sticky) ── */}
        {!isMobile && (
          <motion.aside initial={{x:-220}} animate={{x:0}}
            transition={{type:"spring",stiffness:280,damping:30}}
            style={{width:214,flexShrink:0,background:"rgba(2,2,12,.88)",
              borderRight:"1px solid rgba(255,255,255,.055)",backdropFilter:"blur(40px)",
              display:"flex",flexDirection:"column",padding:"28px 14px",
              position:"sticky",top:0,height:"100vh",overflowY:"auto"}}>
            <SidebarContent/>
          </motion.aside>
        )}

        {/* ── SIDEBAR: mobile (slide-in drawer) ── */}
        {isMobile && (
          <motion.aside
            initial={false}
            animate={{x: sidebarOpen ? 0 : -260}}
            transition={{type:"spring",stiffness:300,damping:32}}
            style={{position:"fixed",left:0,top:0,bottom:0,width:240,zIndex:20,
              background:"rgba(2,2,12,.97)",borderRight:"1px solid rgba(255,255,255,.07)",
              backdropFilter:"blur(40px)",display:"flex",flexDirection:"column",
              padding:"28px 14px",overflowY:"auto"}}>
            <SidebarContent/>
          </motion.aside>
        )}

        {/* ════════════════════════════════════
            MAIN
        ════════════════════════════════════ */}
        <main style={{
          flex:1,
          overflowY:"auto",
          padding: isMobile ? "20px 16px 60px" : "32px 32px 60px",
          minWidth:0, /* prevent flex blowout */
        }}>

          {/* ── MOBILE TOPBAR ── */}
          {isMobile && (
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <button onClick={()=>setSidebarOpen(true)}
                style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.09)",
                  borderRadius:9,padding:"8px 11px",color:"#94A3B8",fontSize:16,cursor:"pointer",lineHeight:1}}>
                ☰
              </button>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,
                background:"linear-gradient(135deg,#fff,#06B6D4)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                B.O.S.S
              </div>
              <Link href="/input" style={{
                padding:"8px 13px",background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",
                borderRadius:9,color:"#fff",fontSize:12,fontWeight:500,textDecoration:"none",
              }}>+ Add</Link>
            </div>
          )}

          {/* ── TOPBAR (desktop) ── */}
          {!isMobile && (
            <motion.div variants={fadeUp} initial="hidden" animate="show"
              style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:32}}>
              <div>
                <div style={{fontSize:10,color:"#3B82F6",letterSpacing:".14em",textTransform:"uppercase",marginBottom:5}}>
                  {new Date().toLocaleDateString("en-KE",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
                </div>
                <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(24px,2.8vw,36px)",fontWeight:800,
                  letterSpacing:"-.03em",lineHeight:1.05,color:"#F1F5F9"}}>
                  Good {new Date().getHours()<12?"morning":new Date().getHours()<17?"afternoon":"evening"},{" "}
                  <span style={{background:"linear-gradient(135deg,#06B6D4,#8B5CF6)",
                    WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                    {user?.name?.split(" ")[0]}.
                  </span>
                </h1>
                <p style={{fontSize:12,color:"#334155",marginTop:5,fontWeight:300}}>
                  {ins?.hasData && ins.profitTrend!=="neutral" && ins.profitTrend!=="0%"
                    ? `Profit ${ins.profitTrend.startsWith("+")?"up":"down"} ${ins.profitTrend} from yesterday.`
                    : "Your business command centre is ready."}
                </p>
              </div>
              <Link href="/input" style={{
                display:"inline-flex",alignItems:"center",gap:7,padding:"10px 18px",flexShrink:0,
                background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",borderRadius:11,
                color:"#fff",fontSize:13,fontWeight:500,textDecoration:"none",
                boxShadow:"0 6px 24px rgba(59,130,246,.28)",transition:"all .25s ease",
              }}>
                + Add Entry
              </Link>
            </motion.div>
          )}

          {/* ── MOBILE greeting ── */}
          {isMobile && (
            <div style={{marginBottom:20}}>
              <div style={{fontSize:9,color:"#3B82F6",letterSpacing:".14em",textTransform:"uppercase",marginBottom:4}}>
                {new Date().toLocaleDateString("en-KE",{weekday:"long",month:"long",day:"numeric"})}
              </div>
              <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,
                letterSpacing:"-.02em",lineHeight:1.1,color:"#F1F5F9"}}>
                Good {new Date().getHours()<12?"morning":new Date().getHours()<17?"afternoon":"evening"},{" "}
                <span style={{background:"linear-gradient(135deg,#06B6D4,#8B5CF6)",
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                  {user?.name?.split(" ")[0]}.
                </span>
              </h1>
              {ins?.hasData && ins.profitTrend!=="neutral" && ins.profitTrend!=="0%" && (
                <p style={{fontSize:11,color:"#334155",marginTop:4,fontWeight:300}}>
                  Profit {ins.profitTrend.startsWith("+")?"up":"down"} {ins.profitTrend} from yesterday.
                </p>
              )}
            </div>
          )}

          {/* ── NO DATA ── */}
          <AnimatePresence>
          {!ins?.hasData && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" exit={{opacity:0}}
              style={{background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)",
                borderRadius:18,padding: isMobile ? "40px 24px" : "56px 40px",
                textAlign:"center",marginBottom:28}}>
              <div style={{fontSize:44,marginBottom:14}}>📊</div>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:isMobile?17:20,fontWeight:700,marginBottom:10,color:"#F1F5F9"}}>
                No data yet for today
              </h2>
              <p style={{color:"#94A3B8",fontSize:13,marginBottom:26,fontWeight:300,maxWidth:340,margin:"0 auto 26px"}}>
                Add your first entry and B.O.S.S will immediately begin building your intelligence profile.
              </p>
              <Link href="/input" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"13px 26px",
                background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",borderRadius:11,
                color:"#fff",fontSize:14,fontWeight:500,textDecoration:"none"}}>
                Enter Today&apos;s Data →
              </Link>
            </motion.div>
          )}
          </AnimatePresence>

          {ins?.hasData && (
            <motion.div variants={stagger} initial="hidden" animate="show">

              {/* ── KPI ROW ── */}
              <motion.div variants={stagger}
                style={{
                  display:"grid",
                  gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)",
                  gap: isMobile ? 8 : 10,
                  marginBottom:isMobile?12:16,
                }}>
                {[
                  {label:"Revenue",    value:`KES ${ins.today?.sales.toLocaleString()}`,    color:"#3B82F6",
                   sub: ins.profitTrend!=="neutral"&&ins.profitTrend!=="0%"
                     ? `${ins.profitTrend} vs yesterday` : "Today"},
                  {label:"Expenses",   value:`KES ${ins.today?.expenses.toLocaleString()}`,  color:"#EF4444", sub:"Today"},
                  {label:"Net Profit", value:`KES ${ins.today?.profit.toLocaleString()}`,    color:"#10B981", sub:`${ins.today?.margin}% margin`},
                  {label:"Score",      value:`${ins.score}/100`, color:scoreColor,
                   sub:ins.score>=75?"Excellent":ins.score>=50?"Good":"Needs attention"},
                ].map((c)=>(
                  <motion.div key={c.label} variants={fadeUp}
                    whileHover={{y:-3,transition:{duration:.18}}}
                    style={{background:"rgba(255,255,255,.024)",
                      border:"1px solid rgba(255,255,255,.065)",borderRadius:14,
                      padding: isMobile ? "14px 12px" : "20px 18px",
                      position:"relative",overflow:"hidden",cursor:"default"}}>
                    <div style={{position:"absolute",inset:0,
                      background:`radial-gradient(ellipse at 80% 0%,${c.color}0d 0%,transparent 55%)`,
                      pointerEvents:"none"}}/>
                    <div style={{fontSize:9,color:"#334155",letterSpacing:".1em",textTransform:"uppercase",marginBottom:6}}>{c.label}</div>
                    <div style={{fontFamily:"'Syne',sans-serif",
                      fontSize: isMobile ? 16 : 22,
                      fontWeight:700,color:c.color,letterSpacing:"-.02em",marginBottom:4,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {c.value}
                    </div>
                    <div style={{fontSize:10,color:"#334155"}}>{c.sub}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* ── CHART + SCORE RING ── */}
              <motion.div variants={stagger}
                style={{
                  display:"grid",
                  gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
                  gap: isMobile ? 8 : 10,
                  marginBottom: isMobile ? 12 : 16,
                }}>

                {/* area chart */}
                <motion.div variants={fadeUp}
                  style={{background:"rgba(255,255,255,.022)",border:"1px solid rgba(255,255,255,.065)",
                    borderRadius:14,padding: isMobile ? "16px 12px" : "22px",
                    minWidth:0}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",
                    marginBottom:14,flexWrap:"wrap",gap:8}}>
                    <div>
                      <div style={{fontSize:9,color:"#334155",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>
                        7-Day Revenue Trend
                      </div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:isMobile?14:16,fontWeight:700,color:"#F1F5F9"}}>
                        KES {(week?.summary?.total_sales||0).toLocaleString()}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:10,fontSize:10,color:"#334155",flexWrap:"wrap"}}>
                      {[{c:"#3B82F6",l:"Sales"},{c:"#EF4444",l:"Exp"},{c:"#10B981",l:"Profit"}].map(x=>(
                        <div key={x.l} style={{display:"flex",alignItems:"center",gap:4}}>
                          <div style={{width:7,height:7,borderRadius:2,background:x.c,flexShrink:0}}/>
                          {x.l}
                        </div>
                      ))}
                    </div>
                  </div>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300} width="100%" height={isMobile?120:148}>
                      <AreaChart data={chartData} margin={{top:0,right:0,left:isMobile?-20:0,bottom:0}}>
                        <defs>
                          {[["gS","#3B82F6",.22],["gE","#EF4444",.18],["gP","#10B981",.22]].map(([id,c,o])=>(
                            <linearGradient key={id as string} id={id as string} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%"  stopColor={c as string} stopOpacity={o as number}/>
                              <stop offset="95%" stopColor={c as string} stopOpacity={0}/>
                            </linearGradient>
                          ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.035)" vertical={false}/>
                        <XAxis dataKey="date" tick={{fill:"#334155",fontSize:9}} axisLine={false} tickLine={false}/>
                        <YAxis tick={{fill:"#334155",fontSize:9}} axisLine={false} tickLine={false}
                          tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                        <Tooltip content={<ChartTip/>}/>
                        <Area type="monotone" dataKey="sales"    stroke="#3B82F6" strokeWidth={1.5} fill="url(#gS)"/>
                        <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={1.5} fill="url(#gE)"/>
                        <Area type="monotone" dataKey="profit"   stroke="#10B981" strokeWidth={1.5} fill="url(#gP)"/>
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{height:isMobile?120:148,display:"flex",alignItems:"center",justifyContent:"center",
                      color:"#334155",fontSize:12,textAlign:"center",padding:"0 20px"}}>
                      Add more entries to see your trend chart
                    </div>
                  )}
                </motion.div>

                {/* score ring */}
                <motion.div variants={fadeUp}
                  style={{background:"rgba(255,255,255,.022)",border:"1px solid rgba(255,255,255,.065)",
                    borderRadius:14,padding:"22px",display:"flex",
                    flexDirection: isMobile ? "row" : "column",
                    alignItems:"center",justifyContent:"center",
                    textAlign:"center",gap: isMobile ? 20 : 0}}>
                  <div>
                    <div style={{fontSize:9,color:"#334155",letterSpacing:".1em",textTransform:"uppercase",
                      marginBottom: isMobile ? 0 : 18}}>
                      Business Health
                    </div>
                  </div>
                  <svg width={isMobile?80:110} height={isMobile?80:110} viewBox="0 0 110 110" style={{flexShrink:0}}>
                    <circle cx={55} cy={55} r={46} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth={7}/>
                    <motion.circle cx={55} cy={55} r={46} fill="none" stroke={scoreColor} strokeWidth={7}
                      strokeLinecap="round"
                      initial={{strokeDasharray:"0 289"}}
                      animate={{strokeDasharray:`${ins.score*2.89} 289`}}
                      transition={{duration:1.4,ease:[.16,1,.3,1] as [number,number,number,number]}}
                      transform="rotate(-90 55 55)"/>
                    <text x={55} y={51} textAnchor="middle" fill="#F1F5F9" fontSize={22} fontWeight={800}
                      fontFamily="Syne,sans-serif">{ins.score}</text>
                    <text x={55} y={65} textAnchor="middle" fill="#334155" fontSize={9}
                      fontFamily="DM Sans,sans-serif">/100</text>
                  </svg>
                  <div>
                    <div style={{fontSize:12,color:scoreColor,fontWeight:600,marginTop: isMobile ? 0 : 10}}>
                      {ins.score>=75?"Excellent":ins.score>=50?"Good":"Needs Work"}
                    </div>
                    <div style={{fontSize:11,color:"#334155",marginTop:3,fontWeight:300,lineHeight:1.5}}>
                      {ins.score>=75?"Strong performance.":ins.score>=50?"Room to improve.":"Take action today."}
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* ── INTELLIGENCE PANEL ── */}
              <motion.div variants={fadeUp}
                style={{background:"rgba(255,255,255,.018)",border:"1px solid rgba(255,255,255,.06)",
                  borderRadius:14,overflow:"hidden",marginBottom: isMobile ? 12 : 16}}>

                {/* tab bar */}
                <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,.055)",
                  padding: isMobile ? "0 8px" : "0 20px",overflowX:"auto",
                  WebkitOverflowScrolling:"touch" as React.CSSProperties["WebkitOverflowScrolling"]}}>
                  {([
                    {key:"feed",    label: isMobile ? "Feed"    : "Intelligence Feed", count:feed.length,    color:"#8B5CF6"},
                    {key:"alerts",  label: isMobile ? "Alerts"  : "Alerts",            count:alerts.length,  color:"#EF4444"},
                    {key:"signals", label: isMobile ? "Signals" : "Predictive Signals",count:signals.length, color:"#06B6D4"},
                  ] as const).map(t=>(
                    <button key={t.key} onClick={()=>setTab(t.key)}
                      style={{
                        padding: isMobile ? "12px 10px" : "14px 16px",
                        fontSize: isMobile ? 11 : 11,
                        fontWeight:500,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,
                        background:"transparent",border:"none",
                        color: tab===t.key ? "#F1F5F9" : "#334155",
                        borderBottom: tab===t.key ? `2px solid ${t.color}` : "2px solid transparent",
                        transition:"all .2s ease", display:"flex", alignItems:"center", gap:5,
                        letterSpacing:".03em",
                      }}>
                      {t.label}
                      {t.count>0 && (
                        <span style={{padding:"1px 5px",borderRadius:100,fontSize:9,fontWeight:600,
                          background:`${t.color}20`,color:t.color}}>
                          {t.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div style={{padding: isMobile ? "12px 14px" : "16px 20px",minHeight:180,maxHeight:320,overflowY:"auto"}}>
                  <AnimatePresence mode="wait">

                    {/* FEED */}
                    {tab==="feed" && (
                      <motion.div key="feed" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                        {feed.length===0 ? (
                          <div style={{padding:"40px 0",textAlign:"center",color:"#334155",fontSize:12}}>
                            No intelligence signals yet. Add entries to build your feed.
                          </div>
                        ) : feed.map((item,i)=>{
                          const typeColor = {
                            growth:"#10B981",warning:"#F59E0B",alert:"#EF4444",
                            critical:"#EF4444",opportunity:"#06B6D4",
                          }[item.type]??"#94A3B8";
                          return (
                            <motion.div key={item.id}
                              initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
                              transition={{delay:i*.06}}
                              style={{display:"flex",gap:10,padding:"11px 0",
                                borderBottom:i<feed.length-1?"1px solid rgba(255,255,255,.04)":"none"}}>
                              <div style={{width:26,height:26,borderRadius:7,flexShrink:0,
                                background:`${typeColor}12`,border:`1px solid ${typeColor}25`,
                                display:"flex",alignItems:"center",justifyContent:"center",
                                fontSize:11,color:typeColor,fontWeight:700}}>
                                {item.icon}
                              </div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3,flexWrap:"wrap"}}>
                                  <span style={{fontSize:12,fontWeight:600,color:"#F1F5F9"}}>{item.title}</span>
                                  <span style={{fontSize:9,color:"#334155",letterSpacing:".06em",
                                    textTransform:"uppercase",padding:"1px 6px",borderRadius:100,
                                    background:"rgba(255,255,255,.04)",flexShrink:0}}>{item.time}</span>
                                </div>
                                <p style={{fontSize:12,color:"#64748B",lineHeight:1.6,fontWeight:300}}>{item.body}</p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}

                    {/* ALERTS */}
                    {tab==="alerts" && (
                      <motion.div key="alerts" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                        {alerts.length===0 ? (
                          <div style={{padding:"40px 0",textAlign:"center",color:"#334155",fontSize:12}}>
                            ✅ No active alerts. Business operating normally.
                          </div>
                        ) : alerts.map((alert,i)=>{
                          const c = alertColor(alert.level);
                          return (
                            <motion.div key={i}
                              initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                              transition={{delay:i*.07}}
                              style={{marginBottom:10,padding:"12px 14px",
                                background:`${c}09`,border:`1px solid ${c}22`,borderRadius:12}}>
                              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                                <span style={{fontSize:9,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",
                                  color:c,padding:"2px 8px",borderRadius:100,background:`${c}18`,flexShrink:0}}>
                                  {alert.level}
                                </span>
                                <span style={{fontSize:12,fontWeight:600,color:"#F1F5F9"}}>{alert.title}</span>
                              </div>
                              <p style={{fontSize:12,color:"#64748B",lineHeight:1.55,marginBottom:7,fontWeight:300}}>
                                {alert.body}
                              </p>
                              <div style={{fontSize:11,color:c,fontWeight:500}}>→ {alert.action}</div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}

                    {/* SIGNALS */}
                    {tab==="signals" && (
                      <motion.div key="signals" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                        {signals.map((sig,i)=>{
                          const c = signalColor(sig.direction);
                          return (
                            <motion.div key={sig.id}
                              initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                              transition={{delay:i*.07}}
                              style={{marginBottom:10,padding:"12px 14px",
                                background:"rgba(255,255,255,.02)",
                                border:"1px solid rgba(255,255,255,.06)",borderRadius:12}}>
                              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5,gap:8}}>
                                <div style={{display:"flex",alignItems:"center",gap:7,minWidth:0}}>
                                  <span style={{fontSize:13,color:c,flexShrink:0}}>
                                    {sig.direction==="up"?"↑":sig.direction==="down"?"↓":"→"}
                                  </span>
                                  <span style={{fontSize:12,fontWeight:600,color:"#F1F5F9",
                                    overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sig.title}</span>
                                </div>
                                <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
                                  <div style={{width:36,height:3,background:"rgba(255,255,255,.06)",borderRadius:2,overflow:"hidden"}}>
                                    <div style={{height:"100%",width:`${sig.confidence}%`,background:c,borderRadius:2}}/>
                                  </div>
                                  <span style={{fontSize:9,color:"#334155"}}>{sig.confidence}%</span>
                                </div>
                              </div>
                              <p style={{fontSize:12,color:"#64748B",lineHeight:1.55,marginBottom:5,fontWeight:300}}>
                                {sig.body}
                              </p>
                              <div style={{fontSize:9,color:"#334155",letterSpacing:".08em",textTransform:"uppercase"}}>
                                {sig.timeframe}
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>
              </motion.div>

              {/* ── WEEK STATS ── */}
              {ins.weekStats && (
                <motion.div variants={fadeUp}
                  style={{background:"rgba(255,255,255,.018)",border:"1px solid rgba(255,255,255,.055)",
                    borderRadius:14,padding: isMobile ? "16px 14px" : "18px 22px"}}>
                  <div style={{fontSize:9,color:"#334155",letterSpacing:".1em",textTransform:"uppercase",marginBottom:12}}>
                    Weekly Summary
                  </div>
                  <div style={{
                    display:"grid",
                    gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(5,1fr)",
                    gap: isMobile ? 12 : 14,
                  }}>
                    {[
                      {label:"Total Sales",    value:`KES ${ins.weekStats.totalSales.toLocaleString()}`,    color:"#3B82F6"},
                      {label:"Total Expenses", value:`KES ${ins.weekStats.totalExpenses.toLocaleString()}`, color:"#EF4444"},
                      {label:"Total Profit",   value:`KES ${ins.weekStats.totalProfit.toLocaleString()}`,   color:"#10B981"},
                      {label:"Avg Daily",      value:`KES ${ins.weekStats.avgDailySales.toLocaleString()}`, color:"#06B6D4"},
                      {label:"Days Recorded",  value:`${ins.weekStats.daysRecorded} / 7`,                  color:"#8B5CF6"},
                    ].map(s=>(
                      <div key={s.label}
                        style={{borderLeft:`2px solid ${s.color}35`,paddingLeft:10,minWidth:0}}>
                        <div style={{fontSize:9,color:"#334155",letterSpacing:".07em",textTransform:"uppercase",marginBottom:4}}>
                          {s.label}
                        </div>
                        <div style={{fontFamily:"'Syne',sans-serif",
                          fontSize: isMobile ? 13 : 15,
                          fontWeight:700,color:s.color,
                          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          {s.value}
                        </div>
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
