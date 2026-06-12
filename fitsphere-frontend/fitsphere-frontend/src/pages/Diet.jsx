import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DietCard from "../components/DietCard";
import api from "../services/api";
import dietBanner from "../assets/diet-banner.jpg";

function Diet() {

    const [diets, setDiets] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    const [summary, setSummary] = useState({
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFats: 0
    });

    const [goal, setGoal] = useState({
        goalCalories: 0,
        consumedCalories: 0,
        remainingCalories: 0
    });

    const [streak, setStreak] = useState({
        currentStreak: 0
    });

    const [mealName, setMealName] = useState("");
    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fats, setFats] = useState("");
    const [mealDate, setMealDate] = useState("");

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const loadData = async () => {

        try {

            const dietsRes =
                await api.get("/diets", config);

            const summaryRes =
                await api.get(
                    "/diets/summary/today",
                    config
                );

            const goalRes =
                await api.get(
                    "/diets/calorie-goal",
                    config
                );

            const streakRes =
                await api.get(
                    "/diets/streak",
                    config
                );
            const recommendationRes =
               await api.get(
                 "/users/recommendations/diet",
                      config
                 );

            setDiets(dietsRes.data || []);
            setSummary(summaryRes.data || {});
            setGoal(goalRes.data || {});
            setStreak(streakRes.data || {});
            setRecommendations(recommendationRes.data?.recommendedMeals || []);

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {

        loadData();

    }, []);

    
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.post(
                "/diets",
                {
                    mealName,
                    calories,
                    protein,
                    carbs,
                    fats,
                    mealDate
                },
                config
            );

            setMealName("");
            setCalories("");
            setProtein("");
            setCarbs("");
            setFats("");
            setMealDate("");

            loadData();

        } catch (error) {

            console.error(error);
        }
    };

    const deleteMeal = async (id) => {

        try {

            await api.delete(
                `/diets/${id}`,
                config
            );

            loadData();

        } catch (error) {

            console.error(error);
        }
    };

    return (

        <div className="flex bg-slate-100 min-h-screen">

            <Sidebar />

            <div className="flex-1 p-8">

                {/* Hero */}

                <div className="relative mb-8">

                    <img
                        src={dietBanner}
                        alt="Diet"
                        className="
                        w-full
                        h-72
                        object-cover
                        rounded-3xl
                        "
                    />

                    <div
                        className="
                        absolute
                        inset-0
                        bg-black/50
                        rounded-3xl
                        "
                    />

                    <div
                        className="
                        absolute
                        top-10
                        left-10
                        text-white
                        "
                    >

                        <h1 className="text-5xl font-bold">
                            Diet Tracker 🍎
                        </h1>

                        <p className="text-xl mt-2">
                            Fuel your body with the right nutrition.
                        </p>

                    </div>

                </div>

                {/* Summary Cards */}

                <div
                    className="
                    grid
                    md:grid-cols-2
                    lg:grid-cols-3
                    gap-6
                    mb-8
                    "
                >

                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h3 className="font-bold text-lg">
                            🔥 Calories
                        </h3>
                        <p className="text-3xl mt-2">
                            {summary.totalCalories || 0}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h3 className="font-bold text-lg">
                            🥩 Protein
                        </h3>
                        <p className="text-3xl mt-2">
                            {summary.totalProtein || 0}g
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h3 className="font-bold text-lg">
                            🍚 Carbs
                        </h3>
                        <p className="text-3xl mt-2">
                            {summary.totalCarbs || 0}g
                        </p>
                    </div>

                </div>

                {/* Goal & Streak */}

                <div
                    className="
                    grid
                    lg:grid-cols-2
                    gap-6
                    mb-8
                    "
                >

                    <div className="bg-white p-6 rounded-2xl shadow-lg">

                        <h2 className="text-2xl font-bold mb-3">
                            🎯 Calorie Goal
                        </h2>

                        <p>
                            Goal: {goal.goalCalories || 0}
                        </p>

                        <p>
                            Consumed:
                            {" "}
                            {goal.consumedCalories || 0}
                        </p>

                        <p>
                            Remaining:
                            {" "}
                            {goal.remainingCalories || 0}
                        </p>

                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg">

                        <h2 className="text-2xl font-bold mb-3">
                            🔥 Diet Streak
                        </h2>

                        <p className="text-4xl font-bold">
                            {streak.currentStreak || 0} Days
                        </p>

                    </div>

                </div>

                {/* Add Meal */}

                <div
                    className="
                    bg-white
                    p-6
                    rounded-2xl
                    shadow-lg
                    mb-8
                    "
                >
                    {/* Diet Recommendations */}

<div
    className="
    bg-white
    p-6
    rounded-2xl
    shadow-lg
    mb-8
    "
>

    <h2
        className="
        text-3xl
        font-bold
        mb-6
        "
    >
        🥗 Diet Recommendations
    </h2>

    {recommendations.length === 0 ? (

        <p className="text-gray-500">
            No recommendations available.
        </p>

    ) : (

        <div className="grid md:grid-cols-2 gap-4">

            {recommendations.map(
                (meal, index) => (

                    <div
                        key={index}
                        className="
                        bg-green-50
                        border
                        border-green-200
                        p-4
                        rounded-xl
                        hover:scale-105
                        transition
                        "
                    >
                        ✅ {meal}
                    </div>
                )
            )}

        </div>

    )}

</div>

                    <h2 className="text-3xl font-bold mb-6">
                        Add Meal
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="
                        grid
                        md:grid-cols-2
                        gap-4
                        "
                    >

                        <input
                            type="text"
                            placeholder="Meal Name"
                            value={mealName}
                            onChange={(e) =>
                                setMealName(
                                    e.target.value
                                )
                            }
                            className="border p-3 rounded-lg"
                            required
                        />

                        <input
                            type="number"
                            placeholder="Calories"
                            value={calories}
                            onChange={(e) =>
                                setCalories(
                                    e.target.value
                                )
                            }
                            className="border p-3 rounded-lg"
                            required
                        />

                        <input
                            type="number"
                            placeholder="Protein"
                            value={protein}
                            onChange={(e) =>
                                setProtein(
                                    e.target.value
                                )
                            }
                            className="border p-3 rounded-lg"
                            required
                        />

                        <input
                            type="number"
                            placeholder="Carbs"
                            value={carbs}
                            onChange={(e) =>
                                setCarbs(
                                    e.target.value
                                )
                            }
                            className="border p-3 rounded-lg"
                            required
                        />

                        <input
                            type="number"
                            placeholder="Fats"
                            value={fats}
                            onChange={(e) =>
                                setFats(
                                    e.target.value
                                )
                            }
                            className="border p-3 rounded-lg"
                            required
                        />

                        <input
                            type="date"
                            value={mealDate}
                            onChange={(e) =>
                                setMealDate(
                                    e.target.value
                                )
                            }
                            className="border p-3 rounded-lg"
                            required
                        />

                        <button
                            type="submit"
                            className="
                            bg-green-600
                            text-white
                            p-3
                            rounded-lg
                            font-semibold
                            "
                        >
                            Add Meal
                        </button>

                    </form>

                </div>

                {/* Meal List */}

                <div
                    className="
                    grid
                    md:grid-cols-2
                    lg:grid-cols-3
                    gap-6
                    "
                >

                    {diets.map((meal) => (

                        <DietCard
                            key={meal.id}
                            meal={meal}
                            onDelete={deleteMeal}
                        />

                    ))}

                </div>

            </div>

        </div>
    );
}

export default Diet;