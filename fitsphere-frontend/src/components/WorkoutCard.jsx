import { useNavigate } from "react-router-dom";

function WorkoutCard({
    workout,
    onDelete,
    onEdit
}) {

    const navigate = useNavigate();

    return (

        <div className="bg-white p-6 rounded-2xl shadow-lg">

            <h3 className="text-2xl font-bold text-blue-600 mb-3">
                {workout.title}
            </h3>

            <p>
                Duration: {workout.duration} mins
            </p>

            <p>
                Calories Burned:
                {" "}
                {workout.caloriesBurned}
            </p>

            <p className="my-3">
                Date: {workout.workoutDate}
            </p>

            <div className="flex flex-wrap gap-2">

                <button
                    onClick={() =>
                        navigate(
                            `/exercises/${workout.id}`
                        )
                    }
                    className="
                    bg-blue-600
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    "
                >
                    Exercises
                </button>

                <button
                    onClick={() =>
                        onEdit(workout)
                    }
                    className="
                    bg-yellow-500
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    "
                >
                    Edit
                </button>

                <button
                    onClick={() =>
                        onDelete(workout.id)
                    }
                    className="
                    bg-red-500
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    "
                >
                    Delete
                </button>

            </div>

        </div>
    );
}

export default WorkoutCard;