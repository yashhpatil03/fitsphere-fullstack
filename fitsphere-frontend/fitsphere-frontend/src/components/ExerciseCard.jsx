function ExerciseCard({ exercise, onDelete }) {

    return (

        <div
            className="
            bg-white
            p-6
            rounded-2xl
            shadow-lg
            "
        >

            <h3 className="text-2xl font-bold text-blue-600 mb-3">
                {exercise.name}
            </h3>

            <p>
                Sets: {exercise.sets}
            </p>

            <p>
                Reps: {exercise.reps}
            </p>

            <p>
                Weight: {exercise.weight} kg
            </p>

            <button
                onClick={() => onDelete(exercise.id)}
                className="
                mt-4
                bg-red-500
                text-white
                px-4
                py-2
                rounded-lg
                hover:bg-red-600
                "
            >
                Delete
            </button>

        </div>
    );
}

export default ExerciseCard;