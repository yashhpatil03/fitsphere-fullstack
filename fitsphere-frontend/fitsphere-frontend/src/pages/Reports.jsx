import { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import WorkoutChart from "../components/WorkoutChart";
import api from "../services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


function Reports() {

    const [weeklyReport, setWeeklyReport] = useState(null);
    const [monthlyReport, setMonthlyReport] = useState(null);
const [streak, setStreak] = useState(null);
    const reportRef = useRef();

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const loadReports = async () => {

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

setStreak(streakRes.data);

            setWeeklyReport(weeklyRes.data);
            setMonthlyReport(monthlyRes.data);

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {

        loadReports();

    }, []);

    const downloadPDF = async () => {

        const element = reportRef.current;

        const canvas =
            await html2canvas(element);

        const imgData =
            canvas.toDataURL("image/png");

        const pdf = new jsPDF();

        pdf.addImage(
            imgData,
            "PNG",
            10,
            10,
            190,
            0
        );

        pdf.save("FitSphere_Report.pdf");
    };

    const printReport = () => {

        window.print();
    };

    return (

        <div className="flex bg-slate-100 min-h-screen">

            <Sidebar />

            <div className="flex-1 p-8">

                <div className="flex justify-between mb-8">

                    <h1 className="text-4xl font-bold">
                        📊 Fitness Reports
                    </h1>

                    <div className="flex gap-4">

                        <button
                            onClick={downloadPDF}
                            className="
                            bg-green-600
                            text-white
                            px-5
                            py-3
                            rounded-xl
                            "
                        >
                            ⬇ Download PDF
                        </button>

                        <button
                            onClick={printReport}
                            className="
                            bg-blue-600
                            text-white
                            px-5
                            py-3
                            rounded-xl
                            "
                        >
                            🖨 Print
                        </button>

                    </div>

                </div>
                
            <div
    className="
    bg-gradient-to-r
    from-orange-500
    to-red-500
    text-white
    p-8
    rounded-3xl
    shadow-xl
    mb-8
    "
>

    <div className="flex items-center justify-between">

        <div>

            <h2 className="text-3xl font-bold">
                🔥 Current Streak
            </h2>

            <p className="mt-2 text-lg">
                Consecutive workout days
            </p>

        </div>

        <div className="text-6xl font-extrabold">

            {streak?.currentStreak || 0}

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

    <h2 className="text-2xl font-bold mb-4">
        🏆 Achievement
    </h2>

    {streak?.currentStreak >= 30 ? (

        <div className="text-green-600 text-xl font-bold">
            👑 Fitness Legend
        </div>

    ) : streak?.currentStreak >= 14 ? (

        <div className="text-blue-600 text-xl font-bold">
            💪 Dedicated Athlete
        </div>

    ) : streak?.currentStreak >= 7 ? (

        <div className="text-orange-600 text-xl font-bold">
            🔥 Consistency Master
        </div>

    ) : (

        <div className="text-gray-600 text-xl font-bold">
            🚀 Keep Going
        </div>

    )}

</div>

                <div ref={reportRef}>

                    {/* Report Cards */}

                    <div
                        className="
                        grid
                        md:grid-cols-2
                        gap-6
                        mb-8
                        "
                    >

                        <div
                            className="
                            bg-gradient-to-r
                            from-blue-500
                            to-cyan-500
                            text-white
                            p-8
                            rounded-3xl
                            shadow-lg
                            "
                        >


                            <h2 className="text-3xl font-bold mb-6">
                                📅 Weekly Report
                            </h2>

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
                                mins
                            </p>

                        </div>

                        <div
                            className="
                            bg-gradient-to-r
                            from-purple-500
                            to-pink-500
                            text-white
                            p-8
                            rounded-3xl
                            shadow-lg
                            "
                        >

                            <h2 className="text-3xl font-bold mb-6">
                                📊 Monthly Report
                            </h2>

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
                                mins
                            </p>

                        </div>

                    </div>

                    {/* Chart */}

                    <div className="mb-8">

                        <WorkoutChart />

                    </div>

                    {/* Progress Overview */}

                    <div
                        className="
                        bg-white
                        p-8
                        rounded-3xl
                        shadow-lg
                        "
                    >

                        <h2 className="text-3xl font-bold mb-6">
                            📈 Progress Overview
                        </h2>

                        <div className="mb-6">

                            <div className="flex justify-between">

                                <span>
                                    Weekly Calories
                                </span>

                                <span>
                                    {weeklyReport?.totalCaloriesBurned || 0}
                                </span>

                            </div>

                            <div
                                className="
                                w-full
                                bg-gray-200
                                rounded-full
                                h-5
                                "
                            >

                                <div
                                    className="
                                    bg-green-500
                                    h-5
                                    rounded-full
                                    "
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

                            <div className="flex justify-between">

                                <span>
                                    Monthly Workouts
                                </span>

                                <span>
                                    {monthlyReport?.totalWorkouts || 0}
                                </span>

                            </div>

                            <div
                                className="
                                w-full
                                bg-gray-200
                                rounded-full
                                h-5
                                "
                            >

                                <div
                                    className="
                                    bg-blue-500
                                    h-5
                                    rounded-full
                                    "
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

        </div>
    );
}

export default Reports;