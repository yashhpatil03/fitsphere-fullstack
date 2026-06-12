import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import profileBanner from "../assets/profile-banner.jpg";

function Profile() {

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        age: "",
        gender: "",
        height: "",
        weight: "",
        goal: "",
        dailyCalorieGoal: ""
    });

    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    useEffect(() => {

        const loadProfile = async () => {

            try {

                const response = await api.get(
                    "/users/profile",
                    config
                );

                setProfile(response.data);

            } catch (error) {

                console.error(error);
            }
        };

        loadProfile();

    }, []);

    const handleChange = (e) => {

        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.put(
                "/users/profile",
                {
                    age: Number(profile.age),
                    gender: profile.gender,
                    height: Number(profile.height),
                    weight: Number(profile.weight),
                    goal: profile.goal,
                    dailyCalorieGoal:
                        Number(profile.dailyCalorieGoal)
                },
                config
            );

            setMessage("Profile Updated Successfully ✅");

        } catch (error) {

            setMessage("Failed To Update Profile ❌");
        }
    };

    return (

        <div className="flex bg-slate-100 min-h-screen">

            <Sidebar />

            <div className="flex-1 p-8">

                {/* Banner */}

                <div className="relative mb-8">

                    <img
                        src={profileBanner}
                        alt="Profile"
                        className="
                        w-full
                        h-64
                        object-cover
                        rounded-3xl
                        "
                    />

                    <div
                        className="
                        absolute
                        inset-0
                        bg-black/40
                        rounded-3xl
                        "
                    />

                    <div
                        className="
                        absolute
                        bottom-10
                        left-10
                        text-white
                        "
                    >

                        <h1 className="text-5xl font-bold">
                            My Profile
                        </h1>

                        <p className="text-lg mt-2">
                            Manage your fitness information
                        </p>

                    </div>

                </div>

                {/* Profile Form */}

                <div
                    className="
                    bg-white
                    p-8
                    rounded-3xl
                    shadow-lg
                    "
                >

                    <div className="mb-6">

                        <h2 className="text-3xl font-bold">
                            Personal Information
                        </h2>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid md:grid-cols-2 gap-5"
                    >

                        <input
                            type="text"
                            value={profile.name}
                            disabled
                            className="p-3 border rounded-lg bg-gray-100"
                        />

                        <input
                            type="email"
                            value={profile.email}
                            disabled
                            className="p-3 border rounded-lg bg-gray-100"
                        />

                        <input
                            type="number"
                            name="age"
                            placeholder="Age"
                            value={profile.age || ""}
                            onChange={handleChange}
                            className="p-3 border rounded-lg"
                        />

                        <select
                            name="gender"
                            value={profile.gender || ""}
                            onChange={handleChange}
                            className="p-3 border rounded-lg"
                        >
                            <option value="">
                                Select Gender
                            </option>

                            <option value="Male">
                                Male
                            </option>

                            <option value="Female">
                                Female
                            </option>

                        </select>

                        <input
                            type="number"
                            name="height"
                            placeholder="Height (cm)"
                            value={profile.height || ""}
                            onChange={handleChange}
                            className="p-3 border rounded-lg"
                        />

                        <input
                            type="number"
                            name="weight"
                            placeholder="Weight (kg)"
                            value={profile.weight || ""}
                            onChange={handleChange}
                            className="p-3 border rounded-lg"
                        />

                        <select
                            name="goal"
                            value={profile.goal || ""}
                            onChange={handleChange}
                            className="p-3 border rounded-lg"
                        >
                            <option value="">
                                Select Goal
                            </option>

                            <option value="Weight Loss">
                                Weight Loss
                            </option>

                            <option value="Muscle Gain">
                                Muscle Gain
                            </option>

                            <option value="Maintain Fitness">
                                Maintain Fitness
                            </option>

                        </select>

                        <input
                            type="number"
                            name="dailyCalorieGoal"
                            placeholder="Daily Calorie Goal"
                            value={
                                profile.dailyCalorieGoal || ""
                            }
                            onChange={handleChange}
                            className="p-3 border rounded-lg"
                        />

                        <div className="md:col-span-2">

                            <button
                                type="submit"
                                className="
                                w-full
                                bg-gradient-to-r
                                from-blue-600
                                to-cyan-500
                                text-white
                                p-4
                                rounded-xl
                                font-semibold
                                hover:scale-[1.01]
                                transition
                                "
                            >
                                Save Changes
                            </button>

                        </div>

                    </form>

                    {message && (

                        <p className="mt-5 text-center font-medium">
                            {message}
                        </p>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Profile;