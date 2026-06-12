import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DietCard from "../components/DietCard";
import api from "../services/api";

function Diet() {
  const [diets, setDiets] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [summary, setSummary] = useState({ totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 });
  const [goal, setGoal] = useState({ goalCalories: 0, consumedCalories: 0, remainingCalories: 0 });
  const [streak, setStreak] = useState({ currentStreak: 0 });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ mealName: "", calories: "", protein: "", carbs: "", fats: "", mealDate: new Date().toISOString().slice(0, 10) });
  const [loading, setLoading] = useState(true);


  const loadData = async () => {
    try {
      const [dietsRes, summaryRes, goalRes, streakRes, recRes] = await Promise.allSettled([
        api.get("/diets"),
        api.get("/diets/summary/today"),
        api.get("/diets/calorie-goal"),
        api.get("/diets/streak"),
        api.get("/users/recommendations/diet"),
      ]);
      if (dietsRes.status === "fulfilled") setDiets(dietsRes.value.data || []);
      if (summaryRes.status === "fulfilled") setSummary(summaryRes.value.data || {});
      if (goalRes.status === "fulfilled") setGoal(goalRes.value.data || {});
      if (streakRes.status === "fulfilled") setStreak(streakRes.value.data || {});
      if (recRes.status === "fulfilled") setRecommendations(recRes.value.data?.recommendedMeals || []);
    } catch (error) {
      console.error("[Diet.jsx] Load error:", error?.response?.status, error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend DietRequest expects Integer for calories/protein/carbs/fats
      // and LocalDate for mealDate — send exact field names
      const payload = {
        mealName:  form.mealName.trim(),
        calories:  form.calories  !== "" ? parseInt(form.calories,  10) : 0,
        protein:   form.protein   !== "" ? parseInt(form.protein,   10) : 0,
        carbs:     form.carbs     !== "" ? parseInt(form.carbs,     10) : 0,
        fats:      form.fats      !== "" ? parseInt(form.fats,      10) : 0,
        mealDate:  form.mealDate,
      };
      console.log("[Diet] Submitting meal payload:", payload);
      await api.post("/diets", payload);
      setForm({ mealName: "", calories: "", protein: "", carbs: "", fats: "", mealDate: new Date().toISOString().slice(0, 10) });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error("[Diet.jsx] addDiet failed:", error?.response?.status, error?.response?.data || error?.message);
    }
  };

  const deleteMeal = async (id) => {
    try { await api.delete(`/diets/${id}`); loadData(); } catch (error) { console.error("[Diet.jsx]", error?.response?.data || error?.message || error); }
  };

  const goalPct = goal.goalCalories ? Math.min((goal.consumedCalories / goal.goalCalories) * 100, 100) : 0;
  const goalColor = goalPct > 90 ? "var(--fs-error)" : goalPct > 70 ? "var(--fs-warning)" : "var(--fs-success)";

  const macros = [
    { label: "Calories", value: summary.totalCalories || 0, unit: "kcal", color: "#F97316", bg: "rgba(249,115,22,0.08)", icon: "🔥" },
    { label: "Protein", value: summary.totalProtein || 0, unit: "g", color: "#8B5CF6", bg: "rgba(139,92,246,0.08)", icon: "💪" },
    { label: "Carbs", value: summary.totalCarbs || 0, unit: "g", color: "#0EA5E9", bg: "rgba(14,165,233,0.08)", icon: "🌾" },
    { label: "Fats", value: summary.totalFats || 0, unit: "g", color: "#10B981", bg: "rgba(16,185,129,0.08)", icon: "🥑" },
  ];

  return (
    <div className="fs-layout">
      <Sidebar />
      <main className="fs-main fs-page">

        {/* HERO */}
        <div style={{
          background: "linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)",
          borderRadius: "var(--fs-radius-2xl)",
          padding: "40px",
          marginBottom: "var(--fs-space-8)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 75% 50%, rgba(16,185,129,0.3) 0%, transparent 60%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p className="fs-hero-eyebrow" style={{ color: "#34D399" }}>Nutrition</p>
              <h1 className="fs-hero-title">Fuel Your Performance</h1>
              <p className="fs-hero-sub">Track every meal, hit your macros, stay consistent.</p>
            </div>
            <div style={{ textAlign: "center", background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: "14px 20px" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fff" }}>{streak.currentStreak || 0}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Day Streak 🔥</div>
            </div>
          </div>
        </div>

        {/* TODAY'S MACROS */}
        <div className="fs-grid-4" style={{ marginBottom: "var(--fs-space-8)" }}>
          {macros.map(m => (
            <div key={m.label} className="fs-stat-card">
              <div className="stat-icon" style={{ background: m.bg, fontSize: 18 }}>{m.icon}</div>
              <div className="stat-value" style={{ color: m.color }}>{m.value}<span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--fs-text-tertiary)", marginLeft: 3 }}>{m.unit}</span></div>
              <div className="stat-label">Today's {m.label}</div>
            </div>
          ))}
        </div>

        {/* CALORIE GOAL */}
        <div className="fs-card" style={{ padding: "24px", marginBottom: "var(--fs-space-8)" }}>
          <div className="fs-section-header">
            <h2 className="fs-h2">Daily Calorie Goal</h2>
            <span className="fs-badge" style={{ background: `${goalColor}18`, color: goalColor }}>{Math.round(goalPct)}%</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span className="fs-caption">{goal.consumedCalories || 0} consumed</span>
            <span className="fs-caption">{goal.remainingCalories || 0} remaining of {goal.goalCalories || 0}</span>
          </div>
          <div className="fs-progress">
            <div className="fs-progress-fill success" style={{ width: `${goalPct}%`, background: `linear-gradient(90deg, ${goalColor}, ${goalColor}cc)` }} />
          </div>
        </div>

        {/* LOG MEAL SECTION */}
        <div style={{ marginBottom: "var(--fs-space-8)" }}>
          <div className="fs-section-header">
            <h2 className="fs-h2">Log a Meal</h2>
            <button onClick={() => setShowForm(!showForm)} className={`fs-btn fs-btn-md ${showForm ? "fs-btn-secondary" : "fs-btn-primary"}`}>
              {showForm ? "Cancel" : "+ Add Meal"}
            </button>
          </div>

          {showForm && (
            <div className="fs-card fs-animate-in" style={{ padding: "24px" }}>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "14px" }}>
                  {[
                    { key: "mealName", label: "Meal Name", type: "text", placeholder: "Grilled chicken & rice" },
                    { key: "calories", label: "Calories (kcal)", type: "number", placeholder: "500" },
                    { key: "protein", label: "Protein (g)", type: "number", placeholder: "40" },
                    { key: "carbs", label: "Carbs (g)", type: "number", placeholder: "60" },
                    { key: "fats", label: "Fats (g)", type: "number", placeholder: "15" },
                    { key: "mealDate", label: "Date", type: "date" },
                  ].map(f => (
                    <div key={f.key} className="fs-input-group">
                      <label className="fs-input-label">{f.label}</label>
                      <input type={f.type} className="fs-input" placeholder={f.placeholder || ""} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required />
                    </div>
                  ))}
                </div>
                <button type="submit" className="fs-btn fs-btn-primary fs-btn-md">Save Meal</button>
              </form>
            </div>
          )}
        </div>

        {/* RECOMMENDATIONS */}
        {recommendations.length > 0 && (
          <div className="fs-card" style={{ padding: "24px", marginBottom: "var(--fs-space-8)" }}>
            <h2 className="fs-h2" style={{ marginBottom: "16px" }}>Personalized Meal Ideas</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
              {recommendations.map((m, i) => (
                <div key={`dietrec-${i}-${m.slice(0,8)}`} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "rgba(16,185,129,0.06)", borderLeft: "3px solid var(--fs-success)", borderRadius: "0 var(--fs-radius-lg) var(--fs-radius-lg) 0", fontSize: "0.875rem", color: "var(--fs-text-secondary)" }}>
                  <span>✅</span> {m}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MEAL LIST */}
        <div>
          <div className="fs-section-header">
            <h2 className="fs-h2">Meal Log</h2>
            <span className="fs-caption">{diets.length} meals tracked</span>
          </div>
          {diets.length === 0 ? (
            <div className="fs-empty-state fs-card" style={{ padding: "64px 24px" }}>
              <div className="empty-icon">🥗</div>
              <p style={{ fontWeight: 600, color: "var(--fs-text-primary)", marginBottom: 6 }}>No meals logged yet</p>
              <p style={{ fontSize: "0.875rem" }}>Start tracking your nutrition for better insights</p>
            </div>
          ) : (
            <div className="fs-grid-3">
              {diets.map(meal => <DietCard key={meal.id} meal={meal} onDelete={deleteMeal} />)}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default Diet;
