import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "var(--fs-surface)", border: "1px solid var(--fs-border)",
        borderRadius: "var(--fs-radius-lg)", padding: "10px 14px",
        boxShadow: "var(--fs-shadow-lg)",
      }}>
        <p style={{ fontSize: "0.75rem", color: "var(--fs-text-tertiary)", marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--fs-electric)" }}>
          {payload[0].value} kg
        </p>
      </div>
    );
  }
  return null;
};

function Progress() {
  const [weeklyReport, setWeeklyReport]   = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [streak, setStreak]               = useState(null);
  const [progress, setProgress]           = useState([]);
  const [analytics, setAnalytics]         = useState(null);
  const [weight, setWeight]               = useState("");
  const [progressDate, setProgressDate]   = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading]             = useState(true);
  const [weightError, setWeightError]     = useState("");

  const loadProgress = async () => {
    try {
      const [w, m, s, p, a] = await Promise.allSettled([
        api.get("/users/weekly-report"),
        api.get("/users/monthly-report"),
        api.get("/users/streak"),
        api.get("/progress"),
        api.get("/progress/analytics"),
      ]);
      if (w.status === "fulfilled") setWeeklyReport(w.value.data);
      else console.error("[Progress] /users/weekly-report:", w.reason?.response?.status);

      if (m.status === "fulfilled") setMonthlyReport(m.value.data);
      if (s.status === "fulfilled") setStreak(s.value.data);

      if (p.status === "fulfilled") {
        const entries = p.value.data || [];
        // Sort ascending by date so chart renders left→right correctly
        const sorted = [...entries].sort((a, b) =>
          new Date(a.progressDate) - new Date(b.progressDate)
        );
        setProgress(sorted);
      }

      if (a.status === "fulfilled") {
        setAnalytics(a.value.data);
        console.log("[Progress] Analytics response:", a.value.data);
      } else {
        console.warn("[Progress] /progress/analytics:", a.reason?.response?.status);
      }
    } catch (error) {
      console.error("[Progress.jsx] Load error:", error?.response?.status, error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProgress(); }, []);

  const addWeight = async () => {
    setWeightError("");
    const parsed = parseFloat(weight);
    if (!weight || isNaN(parsed) || parsed <= 0 || parsed > 500) {
      setWeightError("Please enter a valid weight between 1–500 kg.");
      return;
    }
    try {
      await api.post("/progress", {
        weight: parsed,
        progressDate: progressDate,
      });
      setWeight("");
      loadProgress();
    } catch (error) {
      console.error("[Progress.jsx] addWeight failed:", error?.response?.data, error?.message);
      setWeightError("Failed to save weight. Please try again.");
    }
  };

  // Build chart data — progressDate is "2024-01-15" from LocalDate
  const chartData = progress.map(p => ({
    date: p.progressDate
      ? new Date(p.progressDate + "T00:00:00").toLocaleDateString("en", {
          month: "short", day: "numeric",
        })
      : "—",
    weight: typeof p.weight === "number" ? p.weight : parseFloat(p.weight) || 0,
  }));

  const hasProgressData = progress.length > 0;

  // ── Analytics field mapping ──────────────────────────────────────────────
  // Backend ProgressAnalyticsResponse: { startWeight, currentWeight, change, trend }
  // (NOT startingWeight / weightChange — those were wrong field names)
  const startWeight   = analytics?.startWeight   ?? null;
  const currentWeight = analytics?.currentWeight ?? null;
  const change        = analytics?.change        ?? null;
  const trend         = analytics?.trend         ?? null;

  const hasAnalytics = startWeight !== null || currentWeight !== null;

  // Prevent NaN display
  const safeChange = (change !== null && !isNaN(change))
    ? `${change >= 0 ? "+" : ""}${Number(change).toFixed(1)} kg`
    : "—";

  const trendColor =
    trend === "Losing"   ? "var(--fs-success)" :
    trend === "Gaining"  ? "var(--fs-energy)"  :
    trend === "Stable"   ? "var(--fs-electric)" :
                           "var(--fs-text-tertiary)";

  const topStats = [
    { label: "Weekly Workouts",  value: weeklyReport?.totalWorkouts  || 0, icon: "📅" },
    { label: "Monthly Workouts", value: monthlyReport?.totalWorkouts || 0, icon: "📊" },
    { label: "Current Streak",   value: `${streak?.currentStreak   || 0}d`, icon: "🔥" },
    {
      label: "Weight Change",
      value: hasAnalytics ? safeChange : "—",
      icon: "⚖️",
    },
  ];

  const perfMetrics = [
    { label: "Weekly Calories Burned",     value: weeklyReport?.totalCaloriesBurned     || 0, max: 5000, color: "var(--fs-success)"  },
    { label: "Monthly Workouts",           value: monthlyReport?.totalWorkouts          || 0, max: 30,   color: "var(--fs-electric)" },
    { label: "Avg Session Duration (min)", value: weeklyReport?.averageWorkoutDuration  || 0, max: 120,  color: "#8B5CF6"            },
  ];

  return (
    <div className="fs-layout">
      <Sidebar />
      <main className="fs-main fs-page">

        <div style={{ marginBottom: "var(--fs-space-8)" }}>
          <p className="fs-label" style={{ marginBottom: 6 }}>Your Journey</p>
          <h1 className="fs-h1">Fitness Progress</h1>
          <p className="fs-body">Track your transformation over time.</p>
        </div>

        {/* TOP STATS */}
        <div className="fs-grid-4" style={{ marginBottom: "var(--fs-space-8)" }}>
          {topStats.map(s => (
            <div key={s.label} className="fs-stat-card">
              <div className="stat-icon" style={{ background: "var(--fs-surface-2)", fontSize: 18 }}>{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* WEIGHT ANALYTICS — only show when data exists */}
        {hasAnalytics ? (
          <div className="fs-card" style={{ padding: "24px", marginBottom: "var(--fs-space-8)" }}>
            <h2 className="fs-h2" style={{ marginBottom: "20px" }}>Weight Analytics</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px" }}>
              {[
                { label: "Starting",  value: startWeight   != null ? `${Number(startWeight).toFixed(1)} kg`   : "—" },
                { label: "Current",   value: currentWeight != null ? `${Number(currentWeight).toFixed(1)} kg` : "—" },
                { label: "Change",    value: safeChange },
                { label: "Trend",     value: trend || "—", color: trendColor },
              ].map(item => (
                <div key={item.label} style={{
                  textAlign: "center", padding: "16px",
                  background: "var(--fs-surface-2)", borderRadius: "var(--fs-radius-lg)",
                }}>
                  <div style={{ fontSize: "1.375rem", fontWeight: 700, color: item.color || "var(--fs-text-primary)", marginBottom: 4 }}>
                    {item.value}
                  </div>
                  <div className="fs-caption">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        ) : !loading && (
          <div className="fs-card" style={{ padding: "24px", marginBottom: "var(--fs-space-8)", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>⚖️</div>
            <p style={{ fontWeight: 600, color: "var(--fs-text-primary)", marginBottom: 6 }}>
              No weight history yet
            </p>
            <p className="fs-body">
              Add your starting weight below to begin tracking your progress.
            </p>
          </div>
        )}

        {/* LOG WEIGHT */}
        <div className="fs-card" style={{ padding: "24px", marginBottom: "var(--fs-space-8)" }}>
          <h2 className="fs-h2" style={{ marginBottom: "16px" }}>Log Weight</h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div className="fs-input-group" style={{ flex: "1 1 160px" }}>
              <label className="fs-input-label">Weight (kg)</label>
              <input
                type="number"
                className={`fs-input${weightError ? " error" : ""}`}
                placeholder="75.5"
                value={weight}
                onChange={e => { setWeight(e.target.value); setWeightError(""); }}
                onKeyDown={e => e.key === "Enter" && addWeight()}
                step="0.1"
                min="1"
                max="500"
              />
            </div>
            <div className="fs-input-group" style={{ flex: "1 1 180px" }}>
              <label className="fs-input-label">Date</label>
              <input
                type="date"
                className="fs-input"
                value={progressDate}
                onChange={e => setProgressDate(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
              />
            </div>
            <button onClick={addWeight} className="fs-btn fs-btn-primary fs-btn-md"
              style={{ flexShrink: 0, marginBottom: weightError ? "22px" : 0 }}>
              Save Entry
            </button>
          </div>
          {weightError && (
            <p style={{ marginTop: 8, fontSize: "0.8125rem", color: "var(--fs-error)" }}>
              ⚠️ {weightError}
            </p>
          )}
        </div>

        {/* WEIGHT CHART */}
        <div className="fs-card" style={{ padding: "24px", marginBottom: "var(--fs-space-8)" }}>
          <div className="fs-section-header">
            <div>
              <h2 className="fs-h2">Weight Over Time</h2>
              <p className="fs-caption" style={{ marginTop: 2 }}>Track your body weight trend</p>
            </div>
            {hasProgressData && (
              <span className="fs-badge fs-badge-electric">{progress.length} entries</span>
            )}
          </div>
          {!hasProgressData ? (
            <div className="fs-empty-state">
              <div className="empty-icon">📈</div>
              <p>Log your starting weight above to see your progress chart</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0EA5E9" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--fs-border)" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false}
                  tick={{ fontSize: 12, fill: "var(--fs-text-tertiary)" }} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fontSize: 12, fill: "var(--fs-text-tertiary)" }}
                  domain={["auto", "auto"]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="weight" stroke="#0EA5E9" strokeWidth={2.5}
                  fill="url(#weightGrad)"
                  dot={{ fill: "#0EA5E9", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* PERFORMANCE BARS */}
        <div className="fs-card" style={{ padding: "24px" }}>
          <h2 className="fs-h2" style={{ marginBottom: "20px" }}>Performance Overview</h2>
          {perfMetrics.map(m => {
            const pct = m.max > 0 ? Math.min((m.value / m.max) * 100, 100) : 0;
            return (
              <div key={m.label} style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "0.875rem", color: "var(--fs-text-secondary)" }}>{m.label}</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--fs-text-primary)" }}>{m.value}</span>
                </div>
                <div className="fs-progress">
                  <div className="fs-progress-fill" style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${m.color}, ${m.color}aa)`,
                    transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
                  }} />
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}

export default Progress;
