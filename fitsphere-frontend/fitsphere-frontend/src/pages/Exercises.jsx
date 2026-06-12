import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import ExerciseCard from "../components/ExerciseCard";

import api from "../services/api";

import exerciseBanner from
    "../assets/exercise-banner.jpg";

function Exercises() {

    const { workoutId } = useParams();

    const [exercises, setExercises] = useState([]);

    const [name, setName] = useState("");
    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");
    const [weight, setWeight] = useState("");

    const token =
        localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const loadExercises = async () => {

        try {

            const response =
                await api.get(
                    `/workouts/${workoutId}/exercises`,
                    config
                );

            setExercises(response.data || []);

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {

        loadExercises();

    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.post(
                `/workouts/${workoutId}/exercises`,
                {
                    name,
                    sets: Number(sets),
                    reps: Number(reps),
                    weight: Number(weight)
                },
                config
            );

            setName("");
            setSets("");
            setReps("");
            setWeight("");

            loadExercises();

        } catch (error) {

            console.error(error);
        }
    };

    const deleteExercise = async (id) => {

        try {

            await api.delete(
                `/workouts/${workoutId}/exercises/${id}`,
                config
            );

            loadExercises();

        } catch (error) {

            console.error(error);
        }
    };

    return (

        <div className="flex bg-slate-100 min-h-screen">

            <Sidebar />

            <div className="flex-1 p-8">

                <div className="relative mb-8">

                    <img
                        src={exerciseBanner}
                        alt="Exercises"
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
                            Exercise Tracker 💪
                        </h1>

                        <p className="text-xl mt-2">
                            Build your workout routine
                        </p>

                    </div>

                </div>

                {/* Add Exercise */}

                <form
                    onSubmit={handleSubmit}
                    className="
                    bg-white
                    p-6
                    rounded-2xl
                    shadow-lg
                    mb-8
                    "
                >

                    <h2 className="text-2xl font-bold mb-4">
                        Add Exercise
                    </h2>

                    <div className="grid md:grid-cols-4 gap-4">

                        <input
                            type="text"
                            placeholder="Exercise Name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            className="border p-3 rounded-lg"
                            required
                        />

                        <input
                            type="number"
                            placeholder="Sets"
                            value={sets}
                            onChange={(e) =>
                                setSets(e.target.value)
                            }
                            className="border p-3 rounded-lg"
                            required
                        />

                        <input
                            type="number"
                            placeholder="Reps"
                            value={reps}
                            onChange={(e) =>
                                setReps(e.target.value)
                            }
                            className="border p-3 rounded-lg"
                            required
                        />

                        <input
                            type="number"
                            placeholder="Weight"
                            value={weight}
                            onChange={(e) =>
                                setWeight(e.target.value)
                            }
                            className="border p-3 rounded-lg"
                            required
                        />

                    </div>

                    <button
                        className="
                        mt-4
                        bg-blue-600
                        text-white
                        px-6
                        py-3
                        rounded-lg
                        "
                    >
                        Add Exercise
                    </button>

                </form>

                {/* Exercise Cards */}

                <div
                    className="
                    grid
                    md:grid-cols-2
                    lg:grid-cols-3
                    gap-6
                    "
                >

                    {exercises.map((exercise) => (

                        <ExerciseCard
                            key={exercise.id}
                            exercise={exercise}
                            onDelete={deleteExercise}
                        />

                    ))}

                </div>

            </div>

        </div>
    );
}

export default Exercises;