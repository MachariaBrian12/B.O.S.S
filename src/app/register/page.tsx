"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useBusinessStore } from "@/store/useBusinessStore";

export default function Register() {
  const router  = useRouter();
  const setUser = useBusinessStore(s => s.setUser);
  const [form,    setForm]    = useState({ name:"", email:"", password:"", business:"" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { user, token } = await api.register(form.name, form.email, form.password, form.business);
      setUser(user, token);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",position:"relative"}}>
      <div className="aurora-bg"><div className="aurora-1"/><div className="aurora-2"/><div className="aurora-3"/></div>
      <div className="noise"/>

      <div className="glass fade-up" style={{width:"100%",maxWidth:"440px",padding:"48px 40px",position:"relative",zIndex:2}}>
        <div style={{textAlign:"center",marginBottom:"40px"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:"32px",fontWeight:800,background:"linear-gradient(135deg,#fff,var(--cyan))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:"8px"}}>
            B.O.S.S
          </div>
          <div style={{fontSize:"12px",color:"var(--t3)",letterSpacing:".15em",textTransform:"uppercase"}}>
            Create your account
          </div>
        </div>

        {error && (
          <div style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"10px",padding:"12px 16px",marginBottom:"24px",fontSize:"13px",color:"#EF4444"}}>
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          {[
            { key:"name",     label:"Full Name",     type:"text",     placeholder:"John Kamau" },
            { key:"business", label:"Business Name", type:"text",     placeholder:"My Shop" },
            { key:"email",    label:"Email",         type:"email",    placeholder:"you@example.com" },
            { key:"password", label:"Password",      type:"password", placeholder:"Min 6 characters" },
          ].map(f => (
            <div key={f.key} style={{marginBottom:"18px"}}>
              <label className="label">{f.label}</label>
              <input className="input" type={f.type} placeholder={f.placeholder}
                value={form[f.key as keyof typeof form]}
                onChange={update(f.key)} required />
            </div>
          ))}

          <div style={{marginTop:"8px"}}>
            <button className="btn btn-primary" type="submit"
              style={{width:"100%",justifyContent:"center",padding:"14px",fontSize:"15px"}}
              disabled={loading}>
              {loading ? "Creating account..." : "Get Started Free →"}
            </button>
          </div>
        </form>

        <div style={{textAlign:"center",marginTop:"24px",fontSize:"13px",color:"var(--t3)"}}>
          Already have an account?{" "}
          <Link href="/login" style={{color:"var(--cyan)",textDecoration:"none",fontWeight:500}}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
