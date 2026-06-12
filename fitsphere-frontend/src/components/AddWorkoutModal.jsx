import { useState, useEffect } from "react";

/**
 * AddWorkoutModal — fields mapped exactly to backend WorkoutRequest:
 *   title        (String, @NotBlank)
 *   duration     (Integer, @NotNull)  ← was "durationMinutes" — FIXED
 *   caloriesBurned (Integer, @NotNull)
 *   workoutDate  (LocalDate)          ← was "date" — FIXED
 *
 * Fields "sets", "reps", "category" are NOT in WorkoutRequest so we keep
 * them display-only in the UI but do NOT send them to the backend.
 */
function AddWorkoutModal({ onAdd, onUpdate, onClose, editingWorkout }) {
  const [form, setForm] = useState({
    title: "",
    duration: "",
    caloriesBurned: "",
    workoutDate: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (editingWorkout) {
      // Map response fields back to form fields
      setForm({
        title: editingWorkout.title || "",
        duration: editingWorkout.duration ?? "",
        caloriesBurned: editingWorkout.caloriesBurned ?? "",
        workoutDate: editingWorkout.workoutDate
          ? editingWorkout.workoutDate.slice(0, 10)
          : new Date().toISOString().slice(0, 10),
      });
    }
  }, [editingWorkout]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build payload matching WorkoutRequest exactly
    const payload = {
      title: form.title.trim(),
      duration: form.duration !== "" ? parseInt(form.duration, 10) : 0,
      caloriesBurned:
        form.caloriesBurned !== "" ? parseInt(form.caloriesBurned, 10) : 0,
      workoutDate: form.workoutDate || new Date().toISOString().slice(0, 10),
    };

    console.log("[AddWorkoutModal] Submitting payload:", payload);

    if (editingWorkout) onUpdate(editingWorkout.id, payload);
    else onAdd(payload);

    onClose();
  };

  return (
    <div
      className="fs-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="fs-modal">
        <div className="fs-modal-header">
          <h2 className="fs-h2">
            {editingWorkout ? "Edit Workout" : "Log Workout"}
          </h2>
          <button
            onClick={onClose}
            className="fs-btn fs-btn-icon fs-btn-secondary"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="fs-modal-body">
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            {/* Title */}
            <div className="fs-input-group">
              <label className="fs-input-label">Workout Name *</label>
              <input
                className="fs-input"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Morning Run, Bench Press…"
                required
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {/* Duration */}
              <div className="fs-input-group">
                <label className="fs-input-label">Duration (min) *</label>
                <input
                  className="fs-input"
                  type="number"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="30"
                  min="0"
                  required
                />
              </div>

              {/* Calories */}
              <div className="fs-input-group">
                <label className="fs-input-label">Calories Burned *</label>
                <input
                  className="fs-input"
                  type="number"
                  name="caloriesBurned"
                  value={form.caloriesBurned}
                  onChange={handleChange}
                  placeholder="200"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div className="fs-input-group">
              <label className="fs-input-label">Date</label>
              <input
                className="fs-input"
                type="date"
                name="workoutDate"
                value={form.workoutDate}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
              <button
                type="button"
                onClick={onClose}
                className="fs-btn fs-btn-secondary fs-btn-md"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="fs-btn fs-btn-primary fs-btn-md"
                style={{ flex: 2 }}
              >
                {editingWorkout ? "Save Changes" : "Log Workout"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddWorkoutModal;
