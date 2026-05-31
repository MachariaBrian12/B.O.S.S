"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Stats {
  totalOrgs: number;
  totalUsers: number;
  activeSubscriptions: number;
  freeOrgs: number;
  paidOrgs: number;
  aiActions: number;
  newOrgsToday: number;
  newOrgsThisWeek: number;
  conversionRate: string;
  recentUsers: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: string;
    organization: { name: string };
  }[];
}

const ADMIN_SECRET = "boss-admin-2026";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);

  const fetchStats = async (s: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { "x-admin-secret": s },
      });
      if (!res.ok) { setError("Invalid admin secret"); setLoading(false); return; }
      const data = await res.json();
      setStats(data);
      setAuthed(true);
    } catch {
      setError("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  if (!authed) return (
    <div style={{ minHeight: "100vh", background: "#02020c", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 40, width: 340 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: "#F1F5F9", marginBottom: 6 }}>⬡ Admin</div>
        <div style={{ fontSize: 13, color: "#475569", marginBottom: 24 }}>B.O.S.S Internal Dashboard</div>
        <input
          type="password"
          placeholder="Enter admin secret"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          onKeyDown={e => e.key === "Enter" && fetchStats(secret)}
          style={{
            width: "100%", padding: "10px 14px", borderRadius: 9,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#F1F5F9", fontSize: 14, outline: "none", marginBottom: 12, boxSizing: "border-box",
          }}
        />
        {error && <div style={{ fontSize: 12, color: "#EF4444", marginBottom: 8 }}>{error}</div>}
        <button
          onClick={() => fetchStats(secret)}
          style={{
            width: "100%", padding: "10px", borderRadius: 9, border: "none",
            background: "linear-gradient(135deg,#3B82F6,#06B6D4)",
            color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          Access Dashboard
        </button>
      </div>
    </div>
  );

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#02020c", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "2px solid rgba(255,255,255,.07)", borderTopColor: "#06B6D4", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  const metrics = [
    { label: "Total Organisations", value: stats?.totalOrgs ?? 0, icon: "🏢", color: "#3B82F6" },
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: "👤", color: "#06B6D4" },
    { label: "Paying Customers", value: stats?.paidOrgs ?? 0, icon: "💳", color: "#10B981" },
    { label: "Free Plan", value: stats?.freeOrgs ?? 0, icon: "🆓", color: "#F59E0B" },
    { label: "Conversion Rate", value: `${stats?.conversionRate}%`, icon: "📈", color: "#8B5CF6" },
    { label: "New Today", value: stats?.newOrgsToday ?? 0, icon: "🆕", color: "#EC4899" },
    { label: "New This Week", value: stats?.newOrgsThisWeek ?? 0, icon: "📅", color: "#06B6D4" },
    { label: "AI Actions", value: stats?.aiActions ?? 0, icon: "🧠", color: "#8B5CF6" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#02020c", padding: "40px 24px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 10, color: "#3B82F6", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 4 }}>
              Internal
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.02em", margin: 0 }}>
              B.O.S.S Admin
            </h1>
          </div>
          <button
            onClick={() => { setAuthed(false); setStats(null); }}
            style={{ padding: "8px 16px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#475569", fontSize: 12, cursor: "pointer" }}
          >
            Sign Out
          </button>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
          {metrics.map(({ label, value, icon, color }) => (
            <div key={label} style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: "20px",
            }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 12, color: "#475569" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Recent Signups */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", marginBottom: 20 }}>Recent Signups</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  {["Name", "Email", "Organisation", "Role", "Joined"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#475569", fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats?.recentUsers.map(user => (
                  <tr key={user.id}>
                    <td style={{ padding: "10px 12px", color: "#F1F5F9" }}>{user.name || "—"}</td>
                    <td style={{ padding: "10px 12px", color: "#94A3B8" }}>{user.email}</td>
                    <td style={{ padding: "10px 12px", color: "#94A3B8" }}>{user.organization?.name || "—"}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{
                        padding: "2px 8px", borderRadius: 6, fontSize: 11,
                        background: user.role === "admin" ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.05)",
                        color: user.role === "admin" ? "#60A5FA" : "#475569",
                      }}>{user.role}</span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#475569" }}>
                      {new Date(user.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
                {(!stats?.recentUsers.length) && (
                  <tr>
                    <td colSpan={5} style={{ padding: "20px 12px", color: "#475569", textAlign: "center" }}>No users yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
