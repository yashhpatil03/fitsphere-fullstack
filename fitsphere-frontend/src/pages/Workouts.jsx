import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import WorkoutCard from "../components/WorkoutCard";
import AddWorkoutModal from "../components/AddWorkoutModal";
import api from "../services/api";
import workoutBanner from "../assets/workout-banner.jpg";
import WorkoutChart from "../components/WorkoutChart";


function Workouts() {

    const [workouts, setWorkouts] = useState([]);
    const [page, setPage] = useState(0);
const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [editingWorkout, setEditingWorkout] =useState(null);
    const [goal, setGoal] = useState("");
const [recommendations, setRecommendations] = useState([]);
const [weeklyReport, setWeeklyReport] = useState(null);
const [monthlyReport, setMonthlyReport] = useState(null);
    

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const loadWorkouts = async () => {

        try {

           const response =
    await api.get(
        `/workouts?page=${page}&size=5`,
        config
    );
const weeklyRes =
    await api.get(
        "/users/weekly-report",
        config
    );

const monthlyRes =
    await api.get(
        "/users/monthly-report",
        config
    );

setWeeklyReport(weeklyRes.data);
setMonthlyReport(monthlyRes.data);
setWorkouts(response.data.content || []);
setTotalPages(response.data.totalPages || 0);
             console.log("Workout Response:", response.data);
          

        } catch (error) {

            console.error(error);
        }
    };

  useEffect(() => {

    loadWorkouts();

}, [page]);

    const addWorkout = async (workout) => {

        try {

            await api.post(
                "/workouts",
                workout,
                config
            );

            loadWorkouts();

        } catch (error) {

            console.error(error);
        }
    };

    const deleteWorkout = async (id) => {

    try {

        await api.delete(
            `/workouts/${id}`,
            config
        );

        loadWorkouts();

    } catch (error) {

        console.error(
            "Delete Error:",
            error.response?.data || error
        );
    }
};
    const updateWorkout = async (id, updatedWorkout) => {

    try {

        await api.put(
            `/workouts/${id}`,
            updatedWorkout,
            config
        );

        setEditingWorkout(null);

        loadWorkouts();

    } catch (error) {

        console.error(error);
    }
};
    const searchWorkout = async () => {

    try {

        if (!search.trim()) {

            loadWorkouts();
            return;
        }

        const response =
            await api.get(
                `/workouts/search?title=${search}`,
                config
            );

        setWorkouts(response.data);

    } catch (error) {

        console.error(error);
    }
};
const getRecommendations = async () => {

    try {

        if (!goal.trim()) return;

        const response = await api.get(
            `/workouts/recommendations?goal=${goal}`,
            config
        );

        setRecommendations(
            response.data.recommendedWorkouts || []
        );

    } catch (error) {

        console.error(error);
    }
};

    return (

        <div className="flex bg-slate-100 min-h-screen">

            <Sidebar />

            <div className="flex-1 p-8">

                {/* Banner */}

                <div className="relative mb-8">

                    <img
                        src={workoutBanner}
                        alt="Workout"
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
                        left-10
                        top-10
                        text-white
                        "
                    >

                        <h1 className="text-5xl font-bold mb-3">
                            Build Strength Every Day 💪
                        </h1>

                        <p className="text-xl">
                            Track workouts and become stronger.
                        </p>

                    </div>

                </div>
                <div className="flex gap-4 mb-6">

    <input
        type="text"
        placeholder="Search workout..."
        value={search}
        onChange={(e) =>
            setSearch(e.target.value)
        }
        className="
        border
        p-3
        rounded-xl
        w-80
        "
    />

    <button
        onClick={searchWorkout}
        className="
        bg-green-600
        text-white
        px-6
        rounded-xl
        "
    >
        Search
    </button>

</div>

                {/* Add Button */}

                <div className="mb-6">

                    <button
                        onClick={() =>
                            setShowModal(true)
                        }
                        className="
                        bg-blue-600
                        text-white
                        px-6
                        py-3
                        rounded-xl
                        font-semibold
                        hover:bg-blue-700
                        "
                    >
                        + Add Workout
                    </button>

                </div>

                
                {/* Workout Recommendations */}

<div className="bg-white p-6 rounded-2xl shadow-lg mb-8">

    <h2 className="text-2xl font-bold mb-4">
        🎯 Workout Recommendations
    </h2>

    <div className="flex gap-4 mb-4">

        <select
            value={goal}
            onChange={(e) =>
                setGoal(e.target.value)
            }
            className="
            border
            p-3
            rounded-xl
            "
        >

            <option value="">
                Select Goal
            </option>

            <option value="weight loss">
                Weight Loss
            </option>

            <option value="muscle gain">
                Muscle Gain
            </option>

            <option value="endurance">
                Endurance
            </option>

        </select>

        <button
            onClick={getRecommendations}
            className="
            bg-purple-600
            text-white
            px-6
            rounded-xl
            "
        >
            Get Plan
        </button>

    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

        {recommendations.map((item, index) => (

            <div
                key={index}
                className="
                bg-purple-50
                border
                border-purple-200
                rounded-xl
                p-4
                text-center
                "
            >
                💪 {item}
            </div>

        ))}

    </div>

</div>
<div
    className="
    grid
    md:grid-cols-2
    gap-6
    mb-8
    "
>

    {/* Weekly */}

    <div
        className="
        bg-gradient-to-r
        from-blue-500
        to-cyan-500
        text-white
        p-6
        rounded-3xl
        shadow-xl
        "
    >
        

        <h2 className="text-2xl font-bold mb-4">
            📅 Weekly Report
        </h2>

        <div className="space-y-2">

            <p>
                🏋 Workouts:
                {" "}
                {weeklyReport?.totalWorkouts || 0}
            </p>

            <p>
                🔥 Calories:
                {" "}
                {weeklyReport?.totalCaloriesBurned || 0}
            </p>

            <p>
                ⏱ Avg Duration:
                {" "}
                {weeklyReport?.averageWorkoutDuration || 0}
                {" "}
                mins
            </p>

        </div>

    </div>

    {/* Monthly */}

    <div
        className="
        bg-gradient-to-r
        from-purple-500
        to-pink-500
        text-white
        p-6
        rounded-3xl
        shadow-xl
        "
    >

        <h2 className="text-2xl font-bold mb-4">
            📊 Monthly Report
        </h2>

        <div className="space-y-2">

            <p>
                🏋 Workouts:
                {" "}
                {monthlyReport?.totalWorkouts || 0}
            </p>

            <p>
                🔥 Calories:
                {" "}
                {monthlyReport?.totalCaloriesBurned || 0}
            </p>

            <p>
                ⏱ Avg Duration:
                {" "}
                {monthlyReport?.averageWorkoutDuration || 0}
                {" "}
                mins
            </p>

        </div>

    </div>

</div>
<div
    className="
    bg-white
    p-6
    rounded-3xl
    shadow-lg
    mb-8
    "
>

    <h2 className="text-2xl font-bold mb-6">
        📈 Performance Overview
    </h2>

    <div className="mb-5">

        <div className="flex justify-between">

            <span>Weekly Calories</span>

            <span>
                {weeklyReport?.totalCaloriesBurned || 0}
            </span>

        </div>

        <div className="w-full bg-gray-200 rounded-full h-4">

            <div
                className="
                bg-green-500
                h-4
                rounded-full
                "
                style={{
                    width: `${Math.min(
                        (weeklyReport?.totalCaloriesBurned || 0) /
                        50,
                        100
                    )}%`
                }}
            />

        </div>

    </div>

    <div>

        <div className="flex justify-between">

            <span>Monthly Workouts</span>

            <span>
                {monthlyReport?.totalWorkouts || 0}
            </span>

        </div>

        <div className="w-full bg-gray-200 rounded-full h-4">

            <div
                className="
                bg-blue-500
                h-4
                rounded-full
                "
                style={{
                    width: `${Math.min(
                        (monthlyReport?.totalWorkouts || 0) * 2,
                        100
                    )}%`
                }}
            />

        </div>

    </div>

</div>


                {/* Workout List */}

                <div
                    className="
                    grid
                    md:grid-cols-2
                    lg:grid-cols-3
                    gap-6
                    "
                >

                 {Array.isArray(workouts) && workouts.map((workout) => ((

                       <WorkoutCard
    key={workout.id}
    workout={workout}
    onDelete={deleteWorkout}
    onEdit={(workout) => {

        setEditingWorkout(workout);
        setShowModal(true);

    }}
/>
                    )))}
                    <div className="flex justify-center gap-4 mt-10">

    <button
        disabled={page === 0}
        onClick={() => setPage(page - 1)}
        className="
        bg-slate-700
        text-white
        px-5
        py-2
        rounded-xl
        disabled:opacity-50
        "
    >
        Previous
    </button>

    <div
        className="
        flex
        items-center
        font-bold
        "
    >
        Page {page + 1} of {totalPages}
    </div>

    <button
        disabled={page + 1 >= totalPages}
        onClick={() => setPage(page + 1)}
        className="
        bg-slate-700
        text-white
        px-5
        py-2
        rounded-xl
        disabled:opacity-50
        "
    >
        Next
    </button>

</div>

                </div>

                {showModal && (

                    <AddWorkoutModal
    onAdd={addWorkout}
    onUpdate={updateWorkout}
    editingWorkout={editingWorkout}
    onClose={() => {

        setShowModal(false);
        setEditingWorkout(null);

    }}
/>

                )}

            </div>

        </div>
    );
}

export default Workouts;