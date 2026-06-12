import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

function Progress() {

    const [weeklyReport, setWeeklyReport] = useState(null);
    const [monthlyReport, setMonthlyReport] = useState(null);
    const [streak, setStreak] = useState(null);
    const [weight, setWeight] = useState("");
const [progressDate, setProgressDate] = useState("");
const [goalProgress, setGoalProgress] =useState(null);
    const [progress, setProgress] = useState([]);
    const [analytics, setAnalytics] = useState(null);

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const loadProgress = async () => {

        try {

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

            const streakRes =
                await api.get(
                    "/users/streak",
                    config
                );

            const progressRes =
                await api.get(
                    "/progress",
                    config
                );

            const analyticsRes =
                await api.get(
                    "/progress/analytics",
                    config
                );
                

            setWeeklyReport(weeklyRes.data);
            setMonthlyReport(monthlyRes.data);
            setStreak(streakRes.data);

            setProgress(progressRes.data);
            setAnalytics(analyticsRes.data);

        } catch (error) {

            console.error(error);
        }
    };
    const addWeightProgress = async () => {

    try {

        await api.post(
            "/progress",
            {
                weight,
                progressDate
            },
            config
        );

        setWeight("");
        setProgressDate("");

        loadProgress();

    } catch (error) {

        console.error(error);
    }
};

    useEffect(() => {

        loadProgress();

    }, []);

    return (

        <div className="flex bg-slate-100 min-h-screen">

            <Sidebar />

            <div className="flex-1 p-8">

                <h1 className="text-4xl font-bold mb-8">
                    📈 Fitness Progress
                </h1>

                {/* Top Cards */}

                <div className="grid md:grid-cols-4 gap-6 mb-8">

                    <div className="bg-blue-500 text-white p-6 rounded-3xl shadow-xl">

                        <h2 className="text-xl font-bold">
                            Weekly Workouts
                        </h2>

                        <p className="text-4xl mt-3">
                            {weeklyReport?.totalWorkouts || 0}
                        </p>

                    </div>

                    <div className="bg-purple-500 text-white p-6 rounded-3xl shadow-xl">

                        <h2 className="text-xl font-bold">
                            Monthly Workouts
                        </h2>

                        <p className="text-4xl mt-3">
                            {monthlyReport?.totalWorkouts || 0}
                        </p>

                    </div>

                    <div className="bg-orange-500 text-white p-6 rounded-3xl shadow-xl">

                        <h2 className="text-xl font-bold">
                            Current Streak
                        </h2>

                        <p className="text-4xl mt-3">
                            {streak?.currentStreak || 0}
                        </p>

                    </div>

                    <div className="bg-green-500 text-white p-6 rounded-3xl shadow-xl">

                        <h2 className="text-xl font-bold">
                            Weight Change
                        </h2>

                        <p className="text-4xl mt-3">
                            {analytics?.weightChange || 0}
                        </p>

                    </div>

                </div>

                {/* Weight Analytics */}

                <div className="bg-white p-8 rounded-3xl shadow-lg mb-8">

                    <h2 className="text-3xl font-bold mb-6">
                        ⚖ Weight Analytics
                    </h2>

                    <div className="grid md:grid-cols-4 gap-6">

                        <div>
                            <h3 className="font-semibold">
                                Starting Weight
                            </h3>

                            <p className="text-2xl font-bold">
                                {analytics?.startingWeight || 0} kg
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Current Weight
                            </h3>

                            <p className="text-2xl font-bold">
                                {analytics?.currentWeight || 0} kg
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Change
                            </h3>

                            <p className="text-2xl font-bold">
                                {analytics?.weightChange || 0} kg
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Trend
                            </h3>

                            <p className="text-2xl font-bold">
                                {analytics?.trend || "NO DATA"}
                            </p>
                        </div>

                    </div>

                </div>
                <div className="bg-white p-8 rounded-3xl shadow-lg mb-8">

    <h2 className="text-3xl font-bold mb-6">
        ⚖ Add Weight Progress
    </h2>

    <div className="flex gap-4">

        <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) =>
                setWeight(e.target.value)
            }
            className="border p-3 rounded-xl"
        />

        <input
            type="date"
            value={progressDate}
            onChange={(e) =>
                setProgressDate(e.target.value)
            }
            className="border p-3 rounded-xl"
        />

        <button
            onClick={addWeightProgress}
            className="
            bg-green-600
            text-white
            px-6
            rounded-xl
            "
        >
            Save
        </button>

    </div>

</div>

                {/* Weight Chart */}

                <div className="bg-white p-8 rounded-3xl shadow-lg mb-8">

                    <h2 className="text-3xl font-bold mb-6">
                        📊 Weight Progress Chart
                    </h2>

                    <ResponsiveContainer
                        width="100%"
                        height={350}
                    >

                        <LineChart data={progress}>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="progressDate" />

                            <YAxis />

                            <Tooltip />

                            <Line
                                type="monotone"
                                dataKey="weight"
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

                {/* Performance Bars */}

                <div className="bg-white p-8 rounded-3xl shadow-lg">

                    <h2 className="text-3xl font-bold mb-6">
                        🚀 Performance Overview
                    </h2>

                    <div className="mb-6">

                        <div className="flex justify-between mb-2">

                            <span>
                                Weekly Calories
                            </span>

                            <span>
                                {weeklyReport?.totalCaloriesBurned || 0}
                            </span>

                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-5">

                            <div
                                className="bg-green-500 h-5 rounded-full"
                                style={{
                                    width: `${Math.min(
                                        (weeklyReport?.totalCaloriesBurned || 0) / 50,
                                        100
                                    )}%`
                                }}
                            />

                        </div>

                    </div>

                    <div>

                        <div className="flex justify-between mb-2">

                            <span>
                                Monthly Workouts
                            </span>

                            <span>
                                {monthlyReport?.totalWorkouts || 0}
                            </span>

                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-5">

                            <div
                                className="bg-blue-500 h-5 rounded-full"
                                style={{
                                    width: `${Math.min(
                                        (monthlyReport?.totalWorkouts || 0) * 5,
                                        100
                                    )}%`
                                }}
                            />

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Progress;