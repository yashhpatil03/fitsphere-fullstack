import { useState } from "react";
function AddWorkoutModal({
    onAdd,
    onUpdate,
    onClose,
    editingWorkout
})  {

   const [title, setTitle] =
    useState(editingWorkout?.title || "");

const [duration, setDuration] =
    useState(editingWorkout?.duration || "");

const [caloriesBurned, setCaloriesBurned] =
    useState(editingWorkout?.caloriesBurned || "");

const [workoutDate, setWorkoutDate] =
    useState(editingWorkout?.workoutDate || "");

    const handleSubmit = (e) => {

        e.preventDefault();

        const workoutData = {
    title,
    duration,
    caloriesBurned,
    workoutDate
};

if (editingWorkout) {

    onUpdate(
        editingWorkout.id,
        workoutData
    );

} else {

    onAdd(workoutData);
}

        onClose();
    };

    return (

        <div
            className="
            fixed
            inset-0
            bg-black/50
            flex
            items-center
            justify-center
            "
        >

            <div
                className="
                bg-white
                p-8
                rounded-2xl
                w-[450px]
                "
            >

                <h2 className="text-3xl font-bold mb-6">
                    Add Workout
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                     type="text"
                     placeholder="Workout Title"
                     value={title}
                     onChange={(e) =>
                    setTitle(e.target.value)
                      }
                     className="w-full p-3 border rounded-lg"
                        required
                     />

                    <input
                        type="number"
                        placeholder="Duration"
                        value={duration}
                        onChange={(e) =>
                            setDuration(e.target.value)
                        }
                        className="w-full p-3 border rounded-lg"
                        required
                    />

                    <input
                        type="number"
                        placeholder="Calories Burned"
                        value={caloriesBurned}
                        onChange={(e) =>
                            setCaloriesBurned(e.target.value)
                        }
                        className="w-full p-3 border rounded-lg"
                        required
                    />

                    <input
                        type="date"
                        value={workoutDate}
                        onChange={(e) =>
                            setWorkoutDate(e.target.value)
                        }
                        className="w-full p-3 border rounded-lg"
                        required
                    />

                    <button
                        type="submit"
                        className="
                        w-full
                        bg-blue-600
                        text-white
                        p-3
                        rounded-lg
                        "
                    >
                        Save Workout
                    </button>
                    <button
    type="button"
    onClick={onClose}
    className="
    w-full
    mt-3
    bg-gray-400
    text-white
    p-3
    rounded-lg
    "
>
    Cancel
</button>

                </form>

            </div>

        </div>
    );
}

export default AddWorkoutModal;