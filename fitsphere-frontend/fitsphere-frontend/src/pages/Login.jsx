import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import banner from "../assets/login-banner.jpg";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post("/auth/login", {
                email,
                password
            });
localStorage.setItem(
    "token",
    response.data.token
);

localStorage.setItem(
    "role",
    response.data.role
);

            setMessage("Login Successful ✅");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);

        } catch (error) {

            setMessage("Invalid Email or Password ❌");
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100">

            {/* Left Side Image */}

            <div className="hidden lg:block lg:w-1/2 relative">

                <img
                    src={banner}
                    alt="Fitness"
                    className="w-full h-screen object-cover"
                />

                <div className="absolute inset-0 bg-black/50"></div>

                <div className="absolute bottom-16 left-12 text-white">

                    <h1 className="text-5xl font-bold mb-4">
                        Welcome Back
                    </h1>

                    <p className="text-xl max-w-md mb-6">
                        Continue your fitness journey and crush your goals.
                    </p>

                    <div className="flex gap-4">

                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl">
                            <h3 className="text-2xl font-bold">
                                🔥
                            </h3>
                            <p className="text-sm">
                                Daily Streaks
                            </p>
                        </div>

                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl">
                            <h3 className="text-2xl font-bold">
                                💪
                            </h3>
                            <p className="text-sm">
                                Track Progress
                            </p>
                        </div>

                    </div>

                </div>

            </div>

            {/* Login Form */}

            <div className="w-full lg:w-1/2 flex items-center justify-center">

                <div className="bg-white p-10 rounded-3xl shadow-2xl w-[430px]">

                    <h2 className="text-4xl font-bold text-center mb-2">
                        Login
                    </h2>

                    <p className="text-center text-gray-500 mb-8">
                        Continue your fitness journey
                    </p>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            className="w-full p-3 border rounded-lg mb-4"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
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
                            Login
                        </button>

                    </form>

                    {message && (
                        <p className="mt-4 text-center font-medium">
                            {message}
                        </p>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Login;