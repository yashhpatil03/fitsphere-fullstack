import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ExerciseCard from "../components/ExerciseCard";
import api from "../services/api";

function Exercises() {
  const { workoutId } = useParams();
  const [exercises, setExercises] = useState([]);
  const [name, setName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);


  const loadExercises = async () => {
    try {
      const res = await api.get(`/workouts/${workoutId}/exercises`);
      setExercises(res.data || []);
    } catch (error) { console.error("[Exercises.jsx]", error?.response?.data || error?.message || error); }
    setLoading(false);
  };

  useEffect(() => { loadExercises(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/workouts/${workoutId}/exercises`, {
        name, sets: Number(sets), reps: Number(reps), weight: Number(weight)
      });
      setName(""); setSets(""); setReps(""); setWeight("");
      setShowForm(false);
      loadExercises();
    } catch (error) { console.error("[Exercises.jsx]", error?.response?.data || error?.message || error); }
  };

  const deleteExercise = async (id) => {
    try {
      await api.delete(`/workouts/${workoutId}/exercises/${id}`);
      loadExercises();
    } catch (error) { console.error("[Exercises.jsx]", error?.response?.data || error?.message || error); }
  };

  const totalVolume = exercises.reduce((sum, e) => sum + (e.sets * e.reps * (e.weight || 0)), 0);

  return (
    <div className="fs-layout">
      <Sidebar />
      <main className="fs-main fs-page">

        {/* HERO */}
        <div style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 40%, #4C1D95 100%)",
          borderRadius: "var(--fs-radius-2xl)",
          padding: "40px",
          marginBottom: "var(--fs-space-8)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 50%, rgba(139,92,246,0.3) 0%, transparent 60%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Link to="/workouts" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Workouts
              </Link>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>/</span>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem" }}>Exercises</span>
            </div>
            <p className="fs-hero-eyebrow" style={{ color: "#A78BFA" }}>Workout #{workoutId}</p>
            <h1 className="fs-hero-title">Exercise Tracker</h1>
            <p className="fs-hero-sub">Log every set, rep, and weight to build your perfect routine.</p>

            <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
              {[
                { label: "Exercises", value: exercises.length },
                { label: "Total Volume", value: `${totalVolume.toLocaleString()} kg` },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", borderRadius: 12, padding: "12px 18px", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff" }}>{s.value}</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ADD EXERCISE */}
        <div style={{ marginBottom: "var(--fs-space-6)" }}>
          <div className="fs-section-header">
            <h2 className="fs-h2">Add Exercise</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`fs-btn fs-btn-md ${showForm ? "fs-btn-secondary" : "fs-btn-primary"}`}
            >
              {showForm ? "Cancel" : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                  Add Exercise
                </>
              )}
            </button>
          </div>

          {showForm && (
            <div className="fs-card fs-animate-in" style={{ padding: "24px" }}>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 14 }}>
                  <div className="fs-input-group" style={{ gridColumn: "1 / -1" }}>
                    <label className="fs-input-label">Exercise Name</label>
                    <input type="text" className="fs-input" placeholder="e.g. Bench Press, Squat…" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                  {[
                    { label: "Sets", val: sets, set: setSets },
                    { label: "Reps", val: reps, set: setReps },
                    { label: "Weight (kg)", val: weight, set: setWeight },
                  ].map(f => (
                    <div key={f.label} className="fs-input-group">
                      <label className="fs-input-label">{f.label}</label>
                      <input type="number" className="fs-input" placeholder="0" value={f.val} onChange={e => f.set(e.target.value)} min="0" step="0.5" required />
                    </div>
                  ))}
                </div>
                <button type="submit" className="fs-btn fs-btn-primary fs-btn-md">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                  Log Exercise
                </button>
              </form>
            </div>
          )}
        </div>

        {/* EXERCISE LIST */}
        {loading ? (
          <div className="fs-grid-3">
            {[1,2,3].map(i => (
              <div key={i} className="fs-card" style={{ padding: 20 }}>
                <div className="fs-skeleton" style={{ height: 20, width: "70%", marginBottom: 12 }} />
                <div className="fs-skeleton" style={{ height: 56 }} />
              </div>
            ))}
          </div>
        ) : exercises.length === 0 ? (
          <div className="fs-empty-state fs-card" style={{ padding: "64px 24px" }}>
            <div className="empty-icon">🏋️</div>
            <p style={{ fontWeight: 600, color: "var(--fs-text-primary)", marginBottom: 6 }}>No exercises logged yet</p>
            <p style={{ fontSize: "0.875rem" }}>Add your first exercise to start building this workout</p>
            <button onClick={() => setShowForm(true)} className="fs-btn fs-btn-primary fs-btn-md" style={{ marginTop: 16 }}>
              Add First Exercise
            </button>
          </div>
        ) : (
          <div className="fs-grid-3">
            {exercises.map(ex => (
              <ExerciseCard key={ex.id} exercise={ex} onDelete={deleteExercise} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
}

export default Exercises;
