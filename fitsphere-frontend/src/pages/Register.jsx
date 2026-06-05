import { useState } from "react";
import api from "../services/api";
import banner from "../assets/login-banner.jpg";
import { Link } from "react-router-dom";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.post("/users", {
                name,
                email,
                password
            });

            setMessage("Registration Successful ✅");

            setName("");
            setEmail("");
            setPassword("");

        } catch (error) {

            setMessage("Registration Failed ❌");
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100">

            {/* Left Side Image */}

            <div className="hidden lg:block lg:w-1/2 relative">

                <img
                    src={banner}
                    alt="Fitness"
                    className="w-full h-screen object-cover object-center"
                />

                <div className="absolute inset-0 bg-black/50"></div>

                <div className="absolute bottom-16 left-12 text-white">

    <h1 className="text-5xl font-bold mb-4">
        FitSphere
    </h1>

    <p className="text-xl max-w-md mb-6">
        Track workouts, nutrition, progress and achieve your fitness goals.
    </p>

    <div className="flex gap-4">

        <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl">
            <h3 className="text-2xl font-bold">
                10K+
            </h3>
            <p className="text-sm">
                Active Users
            </p>
        </div>

        <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl">
            <h3 className="text-2xl font-bold">
                1M+
            </h3>
            <p className="text-sm">
                Workouts Logged
            </p>
        </div>

    </div>

</div>

            </div>

            {/* Right Side Form */}

            <div className="w-full lg:w-1/2 flex items-center justify-center">

                <div
                    className="
                    bg-white
                    p-10
                    rounded-3xl
                    shadow-2xl
                    w-[430px]
                    border
                    border-gray-100
                    "
                >
<h2 className="text-4xl font-bold text-center mb-2">
    Create Account
</h2>

<p className="text-center text-gray-500 mb-6">
    Join thousands of athletes transforming their lives.
</p>

<div className="grid grid-cols-3 gap-3 mb-8">

    <div className="bg-blue-50 rounded-xl p-3 text-center">
        <div className="text-2xl">🔥</div>
        <p className="text-xs font-medium">
            Streaks
        </p>
    </div>

    <div className="bg-green-50 rounded-xl p-3 text-center">
        <div className="text-2xl">💪</div>
        <p className="text-xs font-medium">
            Workouts
        </p>
    </div>

    <div className="bg-orange-50 rounded-xl p-3 text-center">
        <div className="text-2xl">🍎</div>
        <p className="text-xs font-medium">
            Nutrition
        </p>
    </div>

</div>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border rounded-lg mb-4"
                            required
                        />

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border rounded-lg mb-4"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border rounded-lg mb-6"
                            required
                        />

                        <button
                            type="submit"
                            className="
                            w-full
                            bg-gradient-to-r
                            from-blue-600
                            to-cyan-500
                            text-white
                            p-3
                            rounded-lg
                            font-semibold
                            hover:scale-105
                            transition
                            "
                        >
                            Register
                        </button>

                    </form>

                    {message && (
                        <p className="mt-4 text-center font-medium">
                            {message}
                        </p>
                    )}

                    <p className="text-center mt-6 text-gray-600">
                        Already have an account?

                        <Link
                           to="/login"
                            className="text-blue-600 font-semibold ml-1"
                        >
                           Login
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Register;