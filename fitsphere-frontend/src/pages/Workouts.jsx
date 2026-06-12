import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import WorkoutCard from "../components/WorkoutCard";
import AddWorkoutModal from "../components/AddWorkoutModal";
import WorkoutChart from "../components/WorkoutChart";
import api from "../services/api";

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [goal, setGoal] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [loading, setLoading] = useState(true);


  const loadWorkouts = async () => {
    try {
      const [res, weekly, monthly] = await Promise.allSettled([
        api.get(`/workouts?page=${page}&size=6`),
        api.get("/users/weekly-report"),
        api.get("/users/monthly-report"),
      ]);
      if (res.status === "fulfilled") {
        setWorkouts(res.value.data.content || []);
        setTotalPages(res.value.data.totalPages || 0);
      } else {
        console.error("[Workouts.jsx] Failed to load workouts:", res.reason?.response?.status, res.reason?.message);
      }
      if (weekly.status === "fulfilled") setWeeklyReport(weekly.value.data);
      if (monthly.status === "fulfilled") setMonthlyReport(monthly.value.data);
    } catch (error) {
      console.error("[Workouts.jsx] Unexpected error:", error?.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadWorkouts(); }, [page]);

  const addWorkout = async (w) => { try { await api.post("/workouts", w); loadWorkouts(); } catch (error) { console.error("[Workouts.jsx]", error?.response?.data || error?.message || error); } };
  const deleteWorkout = async (id) => { try { await api.delete(`/workouts/${id}`); loadWorkouts(); } catch (error) { console.error("[Workouts.jsx]", error?.response?.data || error?.message || error); } };
  const updateWorkout = async (id, w) => { try { await api.put(`/workouts/${id}`, w); setEditingWorkout(null); loadWorkouts(); } catch (error) { console.error("[Workouts.jsx]", error?.response?.data || error?.message || error); } };

  const searchWorkout = async () => {
    if (!search.trim()) { loadWorkouts(); return; }
    try { const res = await api.get(`/workouts/search?title=${search}`); setWorkouts(res.data); } catch (error) { console.error("[Workouts.jsx]", error?.response?.data || error?.message || error); }
  };

  const getRecommendations = async () => {
    if (!goal.trim()) return;
    try { const res = await api.get(`/workouts/recommendations?goal=${goal}`); setRecommendations(res.data.recommendedWorkouts || []); } catch (error) { console.error("[Workouts.jsx]", error?.response?.data || error?.message || error); }
  };

  const reportStats = [
    { id: "week-workouts",  label: "This Week",   sub: "Workouts", val: weeklyReport?.totalWorkouts || 0, icon: "📅" },
    { id: "week-calories",  label: "This Week",   sub: "Calories", val: (weeklyReport?.totalCaloriesBurned || 0).toLocaleString(), icon: "🔥" },
    { id: "month-workouts", label: "This Month",  sub: "Workouts", val: monthlyReport?.totalWorkouts || 0, icon: "📊" },
    { id: "avg-duration",   label: "Avg Duration",sub: "Minutes",  val: weeklyReport?.averageWorkoutDuration || 0, icon: "⏱" },
  ];

  return (
    <div className="fs-layout">
      <Sidebar />
      <main className="fs-main fs-page">

        {/* HERO */}
        <div style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)",
          borderRadius: "var(--fs-radius-2xl)",
          padding: "40px",
          marginBottom: "var(--fs-space-8)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 75% 50%, rgba(139,92,246,0.25) 0%, transparent 60%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p className="fs-hero-eyebrow" style={{ color: "#A78BFA" }}>Training</p>
            <h1 className="fs-hero-title">Build Strength Every Day</h1>
            <p className="fs-hero-sub">Track every rep, every set, every victory.</p>
            <button onClick={() => { setEditingWorkout(null); setShowModal(true); }} className="fs-btn fs-btn-primary fs-btn-md" style={{ marginTop: 24 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              Log New Workout
            </button>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="fs-grid-4" style={{ marginBottom: "var(--fs-space-8)" }}>
          {reportStats.map((s) => (
            <div key={s.id} className="fs-stat-card">
              <div className="stat-icon" style={{ background: "var(--fs-surface-2)", fontSize: 18 }}>{s.icon}</div>
              <div className="stat-value">{s.val}</div>
              <div className="stat-label">{s.label} · {s.sub}</div>
            </div>
          ))}
        </div>

        {/* SEARCH + RECOMMENDATIONS */}
        <div className="fs-grid-2" style={{ marginBottom: "var(--fs-space-8)" }}>
          {/* Search */}
          <div className="fs-card" style={{ padding: "24px" }}>
            <h2 className="fs-h2" style={{ marginBottom: "16px" }}>Find Workouts</h2>
            <div style={{ display: "flex", gap: "10px" }}>
              <div className="fs-input-with-icon" style={{ flex: 1 }}>
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input type="text" className="fs-input" placeholder="Search by name…" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && searchWorkout()} />
              </div>
              <button onClick={searchWorkout} className="fs-btn fs-btn-primary fs-btn-md">Search</button>
            </div>
            {search && (
              <button onClick={() => { setSearch(""); loadWorkouts(); }} className="fs-btn fs-btn-ghost fs-btn-sm" style={{ marginTop: 10 }}>Clear</button>
            )}
          </div>

          {/* Goal Recommendations */}
          <div className="fs-card" style={{ padding: "24px" }}>
            <h2 className="fs-h2" style={{ marginBottom: "16px" }}>Goal-Based Plan</h2>
            <div style={{ display: "flex", gap: "10px" }}>
              <select className="fs-input fs-select" value={goal} onChange={e => setGoal(e.target.value)} style={{ flex: 1 }}>
                <option value="">Select your goal…</option>
                <option value="weight loss">Weight Loss</option>
                <option value="muscle gain">Muscle Gain</option>
                <option value="endurance">Endurance</option>
              </select>
              <button onClick={getRecommendations} className="fs-btn fs-btn-md" style={{ background: "var(--fs-grad-purple)", color: "#fff", flexShrink: 0 }}>Get Plan</button>
            </div>
            {recommendations.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
                {recommendations.map((r, i) => (
                  <span key={`rec-${i}-${r}`} className="fs-badge fs-badge-purple">{r}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CHART */}
        <div style={{ marginBottom: "var(--fs-space-8)" }}>
          <WorkoutChart />
        </div>

        {/* WORKOUT LIST */}
        <div style={{ marginBottom: "var(--fs-space-6)" }}>
          <div className="fs-section-header">
            <h2 className="fs-h2">Recent Workouts</h2>
            <span className="fs-caption">{workouts.length} shown</span>
          </div>

          {loading ? (
            <div className="fs-grid-3">
              {[1,2,3].map(i => (
                <div key={`workout-skeleton-${i}`} className="fs-card" style={{ padding: 20 }}>
                  <div className="fs-skeleton" style={{ height: 16, width: "60%", marginBottom: 8 }} />
                  <div className="fs-skeleton" style={{ height: 24, width: "80%", marginBottom: 12 }} />
                  <div className="fs-skeleton" style={{ height: 56 }} />
                </div>
              ))}
            </div>
          ) : workouts.length === 0 ? (
            <div className="fs-empty-state fs-card" style={{ padding: "64px 24px" }}>
              <div className="empty-icon">🏋️</div>
              <p style={{ fontWeight: 600, color: "var(--fs-text-primary)", marginBottom: 6 }}>No workouts yet</p>
              <p style={{ fontSize: "0.875rem" }}>Log your first workout to start tracking your progress</p>
              <button onClick={() => setShowModal(true)} className="fs-btn fs-btn-primary fs-btn-md" style={{ marginTop: 16 }}>Log First Workout</button>
            </div>
          ) : (
            <div className="fs-grid-3">
              {workouts.map(w => (
                <WorkoutCard key={w.id} workout={w} onDelete={deleteWorkout} onEdit={wk => { setEditingWorkout(wk); setShowModal(true); }} />
              ))}
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px" }}>
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="fs-btn fs-btn-secondary fs-btn-md">← Previous</button>
            <span className="fs-caption" style={{ padding: "0 8px" }}>Page {page + 1} of {totalPages}</span>
            <button disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)} className="fs-btn fs-btn-secondary fs-btn-md">Next →</button>
          </div>
        )}

        {showModal && (
          <AddWorkoutModal
            onAdd={addWorkout} onUpdate={updateWorkout} editingWorkout={editingWorkout}
            onClose={() => { setShowModal(false); setEditingWorkout(null); }}
          />
        )}
      </main>
    </div>
  );
}

export default Workouts;
