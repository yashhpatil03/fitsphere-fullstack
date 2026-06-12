import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

function WorkoutChart() {

    const data = [
        { day: "Mon", workouts: 2 },
        { day: "Tue", workouts: 1 },
        { day: "Wed", workouts: 3 },
        { day: "Thu", workouts: 0 },
        { day: "Fri", workouts: 2 },
        { day: "Sat", workouts: 4 },
        { day: "Sun", workouts: 1 }
    ];

    return (

        <div className="bg-white p-6 rounded-3xl shadow-lg">

            <h2 className="text-2xl font-bold mb-4">
                📈 Weekly Activity
            </h2>

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <LineChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="day" />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="workouts"
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>
    );
}

export default WorkoutChart;