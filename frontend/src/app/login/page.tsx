"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useBusinessStore } from "@/store/useBusinessStore";

export default function Login() {
  const router   = useRouter();
  const setUser  = useBusinessStore(s => s.setUser);
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { user, token } = await api.login(email, password);
      setUser(user, token);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",position:"relative"}}>
      <div className="aurora-bg"><div className="aurora-1"/><div className="aurora-2"/><div className="aurora-3"/></div>
      <div className="noise"/>

      <div className="glass fade-up" style={{width:"100%",maxWidth:"420px",padding:"48px 40px",position:"relative",zIndex:2}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:"40px"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:"32px",fontWeight:800,background:"linear-gradient(135deg,#fff,var(--cyan))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:"8px"}}>
            B.O.S.S
          </div>
          <div style={{fontSize:"12px",color:"var(--t3)",letterSpacing:".15em",textTransform:"uppercase"}}>
            Welcome back
          </div>
        </div>

        {error && (
          <div style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"10px",padding:"12px 16px",marginBottom:"24px",fontSize:"13px",color:"#EF4444"}}>
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{marginBottom:"20px"}}>
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div style={{marginBottom:"32px"}}>
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary" type="submit"
            style={{width:"100%",justifyContent:"center",padding:"14px",fontSize:"15px"}}
            disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <div style={{textAlign:"center",marginTop:"24px",fontSize:"13px",color:"var(--t3)"}}>
          No account?{" "}
          <Link href="/register" style={{color:"var(--cyan)",textDecoration:"none",fontWeight:500}}>
            Create one free
          </Link>
        </div>
      </div>
    </div>
  );
}
