"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useBusinessStore } from "@/store/useBusinessStore";

export default function Insights() {
  const router = useRouter();
  const { user, token, insights, setInsights } = useBusinessStore(s => s);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !user) { router.push("/login"); return; }
    api.getInsights(token)
      .then(d => setInsights(d.insights))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:"32px",height:"32px",border:"2px solid rgba(255,255,255,.1)",borderTopColor:"var(--cyan)",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
    </div>
  );

  const ins = insights;

  return (
    <div style={{minHeight:"100vh",position:"relative"}}>
      <div className="aurora-bg"><div className="aurora-1"/><div className="aurora-2"/><div className="aurora-3"/></div>
      <div className="noise"/>

      <div style={{position:"relative",zIndex:2,maxWidth:"900px",margin:"0 auto",padding:"24px"}}>

        {/* Back */}
        <Link href="/dashboard" style={{display:"inline-flex",alignItems:"center",gap:"6px",color:"var(--t3)",fontSize:"13px",textDecoration:"none",marginBottom:"24px",transition:"color .2s"}}
          onMouseEnter={e => (e.currentTarget.style.color="var(--t1)")}
          onMouseLeave={e => (e.currentTarget.style.color="var(--t3)")}>
          ← Back to Dashboard
        </Link>

        <div className="fade-up" style={{marginBottom:"36px"}}>
          <div style={{fontSize:"11px",color:"var(--purple)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:"8px"}}>Intelligence Layer</div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,4vw,44px)",fontWeight:800,letterSpacing:"-.03em"}}>
            Your AI Insights
          </h1>
          <p style={{color:"var(--t3)",fontSize:"14px",marginTop:"8px"}}>
            Powered by B.O.S.S Intelligence Engine
          </p>
        </div>

        {!ins?.hasData ? (
          <div className="glass" style={{padding:"60px 40px",textAlign:"center"}}>
            <div style={{fontSize:"48px",marginBottom:"16px"}}>🧠</div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"22px",fontWeight:700,marginBottom:"12px"}}>No insights yet</h2>
            <p style={{color:"var(--t2)",fontSize:"15px",marginBottom:"28px",fontWeight:300}}>Enter today&apos;s sales data to generate your first AI insights.</p>
            <Link href="/input" className="btn btn-primary" style={{textDecoration:"none",padding:"14px 28px"}}>
              Enter Today&apos;s Data →
            </Link>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>

            {/* Summary */}
            <div className="glass fade-up" style={{padding:"28px"}}>
              <div style={{fontSize:"10px",color:"var(--t3)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:"14px"}}>📊 Today&apos;s Summary</div>
              <p style={{fontSize:"16px",color:"var(--t1)",lineHeight:1.75,fontWeight:300}}>{ins.summary}</p>
            </div>

            {/* Trend + Score */}
            <div className="fade-up" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
              <div className="glass" style={{padding:"28px",textAlign:"center"}}>
                <div style={{fontSize:"10px",color:"var(--t3)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:"14px"}}>Profit Trend</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:"48px",fontWeight:800,
                  color: ins.profitTrend === "neutral" ? "var(--t2)" : ins.profitTrend.startsWith("+") ? "var(--green)" : "var(--red)"
                }}>
                  {ins.profitTrend === "neutral" ? "—" : ins.profitTrend}
                </div>
                <div style={{fontSize:"12px",color:"var(--t3)",marginTop:"8px"}}>vs yesterday</div>
              </div>
              <div className="glass" style={{padding:"28px",textAlign:"center"}}>
                <div style={{fontSize:"10px",color:"var(--t3)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:"14px"}}>Business Score</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:"48px",fontWeight:800,
                  color: ins.score >= 75 ? "var(--green)" : ins.score >= 50 ? "var(--amber)" : "var(--red)"
                }}>
                  {ins.score}
                </div>
                <div style={{fontSize:"12px",color:"var(--t3)",marginTop:"8px"}}>/100 today</div>
              </div>
            </div>

            {/* Warning */}
            {ins.warning && (
              <div className="fade-up" style={{padding:"20px 24px",background:"rgba(239,68,68,.07)",border:"1px solid rgba(239,68,68,.2)",borderRadius:"14px"}}>
                <div style={{fontSize:"10px",color:"#EF4444",letterSpacing:".08em",textTransform:"uppercase",marginBottom:"10px"}}>⚠️ Warning</div>
                <p style={{fontSize:"15px",color:"#EF4444",lineHeight:1.6}}>{ins.warning}</p>
              </div>
            )}

            {/* Recommendation */}
            <div className="glass fade-up" style={{padding:"28px",borderColor:"rgba(139,92,246,.25)",background:"rgba(139,92,246,.05)"}}>
              <div style={{fontSize:"10px",color:"var(--purple)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:"14px"}}>💡 Recommendation</div>
              <p style={{fontSize:"16px",color:"var(--t1)",lineHeight:1.75,fontWeight:400}}>{ins.recommendation}</p>
            </div>

            {/* Top Product */}
            <div className="glass fade-up" style={{padding:"24px 28px"}}>
              <div style={{fontSize:"10px",color:"var(--t3)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:"10px"}}>🏆 Top Product</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:"22px",fontWeight:700,color:"var(--amber)"}}>{ins.topProduct}</div>
            </div>

            {/* Week breakdown */}
            {ins.weekStats && (
              <div className="glass fade-up" style={{padding:"28px"}}>
                <div style={{fontSize:"10px",color:"var(--t3)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:"20px"}}>📅 This Week</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"16px"}}>
                  {[
                    { label:"Total Sales",    value:`KES ${ins.weekStats.totalSales.toLocaleString()}`,    color:"var(--blue)" },
                    { label:"Total Expenses", value:`KES ${ins.weekStats.totalExpenses.toLocaleString()}`, color:"var(--red)" },
                    { label:"Total Profit",   value:`KES ${ins.weekStats.totalProfit.toLocaleString()}`,   color:"var(--green)" },
                    { label:"Avg Daily",      value:`KES ${ins.weekStats.avgDailySales.toLocaleString()}`, color:"var(--cyan)" },
                    { label:"Best Day",       value:`KES ${ins.weekStats.bestDaySales.toLocaleString()}`,  color:"var(--amber)" },
                    { label:"Days Recorded",  value:`${ins.weekStats.daysRecorded} / 7`,                  color:"var(--purple)" },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{fontSize:"10px",color:"var(--t3)",letterSpacing:".06em",textTransform:"uppercase",marginBottom:"6px"}}>{s.label}</div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:"18px",fontWeight:700,color:s.color}}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="fade-up" style={{display:"flex",gap:"12px",paddingTop:"8px"}}>
              <Link href="/input" className="btn btn-primary" style={{textDecoration:"none",flex:1,justifyContent:"center",padding:"14px"}}>
                Update Today&apos;s Entry
              </Link>
              <Link href="/dashboard" className="btn btn-ghost" style={{textDecoration:"none",flex:1,justifyContent:"center",padding:"14px"}}>
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
