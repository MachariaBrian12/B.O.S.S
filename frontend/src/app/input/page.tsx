"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useBusinessStore } from "@/store/useBusinessStore";

export default function Input() {
  const router = useRouter();
  const { user, token, setInsights } = useBusinessStore(s => s);
  const [sales,    setSales]    = useState("");
  const [expenses, setExpenses] = useState("");
  const [notes,    setNotes]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState("");

  useEffect(() => {
    if (!token || !user) { router.push("/login"); return; }
    /* prefill if entry exists */
    api.getToday(token).then(d => {
      if (d.entry) {
        setSales(String(d.entry.sales));
        setExpenses(String(d.entry.expenses));
        setNotes(d.entry.notes || "");
      }
    }).catch(() => {});
  }, []);

  const profit = (parseFloat(sales)||0) - (parseFloat(expenses)||0);
  const margin = (parseFloat(sales)||0) > 0
    ? (( profit / (parseFloat(sales)||1) )*100).toFixed(1)
    : "0.0";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError(""); setLoading(true);
    try {
      const { insights } = await api.addEntry(
        parseFloat(sales), parseFloat(expenses), notes, token
      );
      setInsights(insights);
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",position:"relative"}}>
      <div className="aurora-bg"><div className="aurora-1"/><div className="aurora-2"/><div className="aurora-3"/></div>
      <div className="noise"/>

      <div style={{width:"100%",maxWidth:"520px",position:"relative",zIndex:2}}>

        {/* Back */}
        <Link href="/dashboard" style={{display:"inline-flex",alignItems:"center",gap:"6px",color:"var(--t3)",fontSize:"13px",textDecoration:"none",marginBottom:"24px",transition:"color .2s"}}
          onMouseEnter={e => (e.currentTarget.style.color="var(--t1)")}
          onMouseLeave={e => (e.currentTarget.style.color="var(--t3)")}>
          ← Back to Dashboard
        </Link>

        <div className="glass fade-up" style={{padding:"40px"}}>
          <div style={{marginBottom:"32px"}}>
            <div style={{fontSize:"11px",color:"var(--blue)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:"8px"}}>Daily Entry</div>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"28px",fontWeight:700,letterSpacing:"-.03em"}}>
              {new Date().toLocaleDateString("en-KE",{weekday:"long",month:"long",day:"numeric"})}
            </h1>
            <p style={{color:"var(--t3)",fontSize:"13px",marginTop:"6px"}}>{user?.business}</p>
          </div>

          {success ? (
            <div style={{textAlign:"center",padding:"32px 0"}}>
              <div style={{fontSize:"48px",marginBottom:"16px"}}>✅</div>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"22px",fontWeight:700,marginBottom:"8px"}}>Entry saved!</h2>
              <p style={{color:"var(--t2)",fontSize:"14px"}}>Redirecting to your dashboard...</p>
            </div>
          ) : (
            <>
              {error && (
                <div style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"10px",padding:"12px 16px",marginBottom:"24px",fontSize:"13px",color:"#EF4444"}}>
                  {error}
                </div>
              )}

              <form onSubmit={submit}>
                <div style={{marginBottom:"20px"}}>
                  <label className="label">Total Sales Today (KES)</label>
                  <input className="input" type="number" min="0" step="0.01"
                    placeholder="e.g. 15000"
                    value={sales} onChange={e => setSales(e.target.value)} required />
                </div>

                <div style={{marginBottom:"20px"}}>
                  <label className="label">Total Expenses Today (KES)</label>
                  <input className="input" type="number" min="0" step="0.01"
                    placeholder="e.g. 6000"
                    value={expenses} onChange={e => setExpenses(e.target.value)} required />
                </div>

                {/* Live preview */}
                {(sales || expenses) && (
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"20px",padding:"16px",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.06)",borderRadius:"12px"}}>
                    <div>
                      <div style={{fontSize:"10px",color:"var(--t3)",letterSpacing:".06em",textTransform:"uppercase",marginBottom:"4px"}}>Estimated Profit</div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:"22px",fontWeight:700,color:profit>=0?"var(--green)":"var(--red)"}}>
                        KES {profit.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div style={{fontSize:"10px",color:"var(--t3)",letterSpacing:".06em",textTransform:"uppercase",marginBottom:"4px"}}>Margin</div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:"22px",fontWeight:700,color:"var(--cyan)"}}>
                        {margin}%
                      </div>
                    </div>
                  </div>
                )}

                <div style={{marginBottom:"28px"}}>
                  <label className="label">Notes (optional)</label>
                  <input className="input" type="text"
                    placeholder="e.g. Busy Monday, restocked shoes..."
                    value={notes} onChange={e => setNotes(e.target.value)} />
                </div>

                <button className="btn btn-primary" type="submit"
                  style={{width:"100%",justifyContent:"center",padding:"14px",fontSize:"15px"}}
                  disabled={loading}>
                  {loading ? "Saving..." : "Save & Get Insights →"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
