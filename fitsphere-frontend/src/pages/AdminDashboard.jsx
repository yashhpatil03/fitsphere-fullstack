import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const API = "http://localhost:8080";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalWorkouts: 0, totalDiets: 0, totalProgress: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        axios.get(`${API}/admin/users`),
        axios.get(`${API}/admin/stats`),
      ]);
      setUsers(usersRes.data || []);
      setStats(statsRes.data || {});
    } catch (error) { console.error("[AdminDashboard.jsx]", error?.response?.data || error?.message || error); }
    setLoading(false);
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "#0EA5E9", bg: "rgba(14,165,233,0.1)" },
    { label: "Total Workouts", value: stats.totalWorkouts, icon: "🏋️", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
    { label: "Diet Records", value: stats.totalDiets, icon: "🥗", color: "#F97316", bg: "rgba(249,115,22,0.1)" },
    { label: "Progress Entries", value: stats.totalProgress, icon: "📈", color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
  ];

  return (
    <div className="fs-layout">
      <Sidebar />
      <main className="fs-main fs-page">

        {/* HERO */}
        <div style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          borderRadius: "var(--fs-radius-2xl)",
          padding: "36px 40px",
          marginBottom: "var(--fs-space-8)",
          position: "relative",
          overflow: "hidden",
          border: "1px solid var(--fs-border)",
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(14,165,233,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ width: 40, height: 40, background: "linear-gradient(135deg,#EF4444,#F87171)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>🛡️</div>
              <p className="fs-label" style={{ color: "#F87171" }}>Admin Panel</p>
            </div>
            <h1 className="fs-h1" style={{ color: "#fff", marginBottom: 4 }}>Platform Overview</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>Monitor users, workouts, and platform health.</p>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="fs-grid-4" style={{ marginBottom: "var(--fs-space-8)" }}>
          {statCards.map(s => (
            <div key={s.label} className="fs-stat-card">
              <div className="stat-icon" style={{ background: s.bg, fontSize: 20 }}>{s.icon}</div>
              <div className="stat-value" style={{ color: s.color }}>{loading ? "—" : s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* USERS TABLE */}
        <div className="fs-card" style={{ padding: "24px" }}>
          <div className="fs-section-header">
            <h2 className="fs-h2">Registered Users</h2>
            <div className="fs-input-with-icon" style={{ width: 260 }}>
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text"
                className="fs-input"
                placeholder="Search users…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ padding: "8px 10px 8px 38px", fontSize: "0.875rem" }}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--fs-border)" }}>
                  {["ID", "Name", "Email", "Goal", "Status"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--fs-text-tertiary)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1,2,3,4,5].map(i => (
                    <tr key={i}>
                      {[1,2,3,4,5].map(j => (
                        <td key={j} style={{ padding: "14px 12px" }}>
                          <div className="fs-skeleton" style={{ height: 16, borderRadius: 6 }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--fs-text-tertiary)", fontSize: "0.9rem" }}>
                      No users found
                    </td>
                  </tr>
                ) : (
                  filtered.map((user, i) => (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: "1px solid var(--fs-border)",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--fs-surface-2)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "14px 12px" }}>
                        <span className="fs-caption" style={{ fontFamily: "monospace", background: "var(--fs-surface-2)", padding: "2px 8px", borderRadius: 6 }}>#{user.id}</span>
                      </td>
                      <td style={{ padding: "14px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 32, height: 32,
                            background: `hsl(${(user.id * 67) % 360}, 60%, 55%)`,
                            borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.75rem", fontWeight: 700, color: "#fff", flexShrink: 0,
                          }}>
                            {user.name?.slice(0, 2).toUpperCase() || "?"}
                          </div>
                          <span style={{ fontWeight: 600, color: "var(--fs-text-primary)", fontSize: "0.875rem" }}>{user.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 12px", fontSize: "0.875rem", color: "var(--fs-text-secondary)" }}>{user.email}</td>
                      <td style={{ padding: "14px 12px" }}>
                        {user.goal ? (
                          <span className="fs-badge fs-badge-electric">{user.goal}</span>
                        ) : (
                          <span className="fs-caption">Not set</span>
                        )}
                      </td>
                      <td style={{ padding: "14px 12px" }}>
                        <span className="fs-badge fs-badge-success">● Active</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--fs-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="fs-caption">Showing {filtered.length} of {users.length} users</span>
              {search && (
                <button onClick={() => setSearch("")} className="fs-btn fs-btn-ghost fs-btn-sm">Clear filter</button>
              )}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;
