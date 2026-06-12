

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import WorkoutChart from "../components/WorkoutChart";
import api from "../services/api";
import dashboardBanner from "../assets/dashboard-banner.jpg";

function Dashboard() {

    const [dashboard, setDashboard] = useState({});
    const [streak, setStreak] = useState({});
    const [bmi, setBmi] = useState({});

    const [workoutRecommendations,
        setWorkoutRecommendations] = useState([]);

    const [dietRecommendations,
        setDietRecommendations] = useState([]);

    useEffect(() => {

        const token = localStorage.getItem("token");

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const loadDashboard = async () => {

            try {

                const dashboardRes =
                    await api.get("/users/dashboard", config);

                const streakRes =
                    await api.get("/users/streak", config);

                const bmiRes =
                    await api.get("/users/bmi", config);

                const workoutRes =
                    await api.get(
                        "/users/recommendations/workout",
                        config
                    );

                const dietRes =
                    await api.get(
                        "/users/recommendations/diet",
                        config
                    );

                setDashboard(dashboardRes.data || {});
                setStreak(streakRes.data || {});
                setBmi(bmiRes.data || {});

                setWorkoutRecommendations(
                    workoutRes.data?.recommendations || []
                );

                setDietRecommendations(
                    dietRes.data?.recommendations || []
                );

            } catch (error) {

                console.error(error);
            }
        };

        loadDashboard();

    }, []);

    return (

        <div className="flex bg-slate-100 min-h-screen">

            <Sidebar />

            <div className="flex-1 p-8">

                <div className="relative mb-10">

                    <img
                        src={dashboardBanner}
                        alt="dashboard"
                        className="
                            w-full
                            h-80
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
                            top-12
                            left-12
                            text-white
                        "
                    >

                        <h1 className="text-6xl font-bold mb-4">
                            Welcome Back 👋
                        </h1>

                        <p className="text-xl">
                            Keep pushing toward your fitness goals.
                        </p>

                    </div>

                </div>

                <div className="flex flex-wrap gap-4 mb-8">

                    <button
                        className="
                        bg-cyan-600
                        text-white
                        px-6
                        py-3
                        rounded-xl
                        shadow-lg
                        "
                    >
                        ➕ Add Workout
                    </button>

                    <button
                        className="
                        bg-green-600
                        text-white
                        px-6
                        py-3
                        rounded-xl
                        shadow-lg
                        "
                    >
                        🍎 Add Diet
                    </button>

                    <button
                        className="
                        bg-purple-600
                        text-white
                        px-6
                        py-3
                        rounded-xl
                        shadow-lg
                        "
                    >
                        📈 Track Progress
                    </button>

                </div>

                <div
                    className="
                    grid
                    lg:grid-cols-4
                    md:grid-cols-2
                    gap-6
                    mb-10
                    "
                >

                    <StatCard
                        title="Workout Streak"
                        value={`${streak.currentStreak || 0} Days`}
                        icon="🔥"
                        color="from-orange-500 to-red-500"
                    />

                    <StatCard
                        title="Total Workouts"
                        value={dashboard.totalWorkouts || 0}
                        icon="🏋️"
                        color="from-cyan-500 to-blue-500"
                    />

                    <StatCard
                        title="Calories Burned"
                        value={dashboard.totalCaloriesBurned || 0}
                        icon="🔥"
                        color="from-green-500 to-emerald-600"
                    />

                    <StatCard
                        title="BMI"
                        value={bmi.bmi || 0}
                        icon="⚖️"
                        color="from-purple-500 to-pink-500"
                    />

                </div>

                <div className="mb-10">
                    <WorkoutChart />
                </div>

                <div className="grid lg:grid-cols-2 gap-8">

                    <div
                        className="
                        bg-white
                        p-6
                        rounded-3xl
                        shadow-lg
                        "
                    >

                        <h2 className="text-2xl font-bold mb-6">
                            💪 Workout Recommendations
                        </h2>

                        <div className="space-y-3">

                            {workoutRecommendations.map((item, index) => (

                                <div
                                    key={index}
                                    className="
                                    p-4
                                    bg-cyan-50
                                    rounded-xl
                                    "
                                >
                                    {item}
                                </div>

                            ))}

                        </div>

                    </div>

                    <div
                        className="
                        bg-white
                        p-6
                        rounded-3xl
                        shadow-lg
                        "
                    >

                        <h2 className="text-2xl font-bold mb-6">
                            🥗 Diet Recommendations
                        </h2>

                        <div className="space-y-3">

                            {dietRecommendations.map((item, index) => (

                                <div
                                    key={index}
                                    className="
                                    p-4
                                    bg-green-50
                                    rounded-xl
                                    "
                                >
                                    {item}
                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;
