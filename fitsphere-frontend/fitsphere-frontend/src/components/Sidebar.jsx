import { Link } from "react-router-dom";

function Sidebar() {

    const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.location.href = "/login";
};
    const role = localStorage.getItem("role");

    return (

        <div className="w-64 min-h-screen bg-slate-900 text-white p-6">

            <h1 className="text-3xl font-bold mb-10">
                FitSphere
            </h1>

            <nav className="space-y-4">

                <Link
                    to="/dashboard"
                    className="block hover:text-cyan-400"
                >
                    🏠 Dashboard
                </Link>

                <Link
                    to="/profile"
                    className="block hover:text-cyan-400"
                >
                    👤 Profile
                </Link>

                <Link
                    to="/workouts"
                    className="block hover:text-cyan-400"
                >
                    🏋 Workouts
                </Link>

                <Link
                    to="/diet"
                    className="block hover:text-cyan-400"
                >
                    🍎 Diet
                </Link>

                <Link
                    to="/progress"
                    className="block hover:text-cyan-400"
                >
                    📈 Progress
                </Link>

                <Link
                    to="/reports"
                    className="block hover:text-cyan-400"
                >
                    📊 Reports
                </Link>

                
                <Link
                  to="/ai-coach"
                className="block hover:text-cyan-400"
                   >
                🤖 AI Coach
                 </Link>

                   {role === "ADMIN" && (
  <Link
    to="/admin"
    className="block hover:text-cyan-400"
  >
    👑 Admin Panel
  </Link>
)}
                

                <button
                    onClick={logout}
                    className="
                    mt-10
                    bg-red-500
                    px-4
                    py-2
                    rounded-lg
                    w-full
                    "
                >
                    Logout
                </button>

            </nav>

        </div>
    );
}

export default Sidebar;