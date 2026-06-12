function DietCard({ meal, onDelete }) {

    return (

        <div
            className="
            bg-white
            p-6
            rounded-2xl
            shadow-lg
            hover:shadow-xl
            transition
            "
        >

            <h3
                className="
                text-2xl
                font-bold
                text-green-600
                mb-4
                "
            >
                {meal.mealName}
            </h3>

            <div className="space-y-2">

                <p>🔥 Calories: {meal.calories}</p>

                <p>🥩 Protein: {meal.protein} g</p>

                <p>🍚 Carbs: {meal.carbs} g</p>

                <p>🥑 Fats: {meal.fats} g</p>

                <p>📅 {meal.mealDate}</p>

            </div>

            <button
                onClick={() => onDelete(meal.id)}
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

export default DietCard;