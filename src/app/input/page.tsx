"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useBusinessStore } from "@/store/useBusinessStore";

export default function InputPage() {
  const router = useRouter();
  const { token, setInsights } = useBusinessStore(s => s);
  const [form, setForm] = useState({ sales: "", expenses: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { router.push("/login"); return; }
    if (!form.sales || !form.expenses) { setError("Sales and expenses are required"); return; }

    setError(""); setLoading(true);
    try {
      const data = await api.addEntry(token, {
        sales: parseFloat(form.sales),
        expenses: parseFloat(form.expenses),
        notes: form.notes,
      });
      if (data.insights) setInsights(data.insights);
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch {
      setError("Failed to save entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",position:"relative"}}>
      <div className="aurora-bg"><div className="aurora-1"/><div className="aurora-2"/><div className="aurora-3"/></div>
      <div className="noise"/>

      <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.5}}
        className="glass" style={{width:"100%",maxWidth:"480px",padding:"40px",position:"relative",zIndex:2}}>

        <div style={{marginBottom:28}}>
          <Link href="/dashboard" style={{fontSize:12,color:"var(--t3)",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:6,marginBottom:20,transition:"color .2s"}}
            onMouseEnter={e=>(e.currentTarget.style.color="var(--t1)")}
            onMouseLeave={e=>(e.currentTarget.style.color="var(--t3)")}>
            ← Dashboard
          </Link>
          <div style={{fontSize:10,color:"var(--cyan)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:6}}>Daily Entry</div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:"#F1F5F9",letterSpacing:"-.02em"}}>
            {new Date().toLocaleDateString("en-KE",{weekday:"long",month:"long",day:"numeric"})}
          </h1>
        </div>

        {error && (
          <div style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",borderRadius:10,padding:"12px 16px",marginBottom:20,fontSize:13,color:"#EF4444"}}>
            {error}
          </div>
        )}

        {success && (
          <div style={{background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.25)",borderRadius:10,padding:"12px 16px",marginBottom:20,fontSize:13,color:"#10B981",textAlign:"center"}}>
            ✓ Saved! Redirecting to dashboard...
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
            <div>
              <label className="label">Revenue (KES)</label>
              <input className="input" type="number" placeholder="0.00" min="0" step="0.01"
                value={form.sales} onChange={update("sales")} required/>
            </div>
            <div>
              <label className="label">Expenses (KES)</label>
              <input className="input" type="number" placeholder="0.00" min="0" step="0.01"
                value={form.expenses} onChange={update("expenses")} required/>
            </div>
          </div>

          {form.sales && form.expenses && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}}
              style={{marginBottom:16,padding:"12px 16px",background:"rgba(16,185,129,.07)",border:"1px solid rgba(16,185,129,.15)",borderRadius:10}}>
              <div style={{fontSize:10,color:"#10B981",letterSpacing:".08em",textTransform:"uppercase",marginBottom:4}}>Net Profit</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,
                color:(parseFloat(form.sales)-parseFloat(form.expenses))>=0?"#10B981":"#EF4444"}}>
                KES {(parseFloat(form.sales||"0")-parseFloat(form.expenses||"0")).toLocaleString()}
              </div>
            </motion.div>
          )}

          <div style={{marginBottom:20}}>
            <label className="label">Notes (optional)</label>
            <textarea className="input" placeholder="Best seller today, any observations..."
              value={form.notes} onChange={update("notes") as any}
              style={{resize:"vertical",minHeight:80}}/>
          </div>

          <button className="btn btn-primary" type="submit"
            style={{width:"100%",justifyContent:"center",padding:"14px",fontSize:15}}
            disabled={loading || success}>
            {loading ? "Saving..." : success ? "Saved ✓" : "Save Today's Entry →"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
