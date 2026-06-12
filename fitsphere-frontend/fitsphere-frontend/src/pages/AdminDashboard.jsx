import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const API = "http://localhost:8080";

function AdminDashboard() {

    const [users, setUsers] = useState([]);

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalWorkouts: 0,
        totalDiets: 0,
        totalProgress: 0
    });

    useEffect(() => {
        loadUsers();
        loadStats();
    }, []);

    const loadUsers = async () => {

        try {

            const usersRes = await axios.get(
                `${API}/admin/users`
            );

            const statsRes = await axios.get(
                `${API}/admin/stats`
            );

            setUsers(usersRes.data);
            setStats(statsRes.data);

        } catch (error) {

            console.error(error);
        }
    };

    const loadStats = async () => {

        try {

            const res = await axios.get(
                `${API}/admin/stats`
            );

            setStats(res.data);

        } catch (error) {

            console.error(error);
        }
    };

    return (

        <div className="flex min-h-screen bg-slate-100">

            <Sidebar />

            <div className="flex-1 p-8">

                <h1 className="text-4xl font-bold text-slate-800 mb-8">
                    Admin Dashboard
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <div className="bg-white shadow-lg rounded-xl p-6">
                        <h3 className="text-gray-500">
                            Total Users
                        </h3>
                        <p className="text-3xl font-bold text-cyan-600">
                            {stats.totalUsers}
                        </p>
                    </div>

                    <div className="bg-white shadow-lg rounded-xl p-6">
                        <h3 className="text-gray-500">
                            Total Workouts
                        </h3>
                        <p className="text-3xl font-bold text-green-600">
                            {stats.totalWorkouts}
                        </p>
                    </div>

                    <div className="bg-white shadow-lg rounded-xl p-6">
                        <h3 className="text-gray-500">
                            Total Diet Records
                        </h3>
                        <p className="text-3xl font-bold text-orange-500">
                            {stats.totalDiets}
                        </p>
                    </div>

                    <div className="bg-white shadow-lg rounded-xl p-6">
                        <h3 className="text-gray-500">
                            Total Progress Records
                        </h3>
                        <p className="text-3xl font-bold text-purple-600">
                            {stats.totalProgress}
                        </p>
                    </div>

                </div>

                <div className="mt-10 bg-white rounded-xl shadow-lg p-6">

                    <h2 className="text-2xl font-bold mb-4">
                        Registered Users
                    </h2>

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="border-b">

                                    <th className="text-left py-3">
                                        ID
                                    </th>

                                    <th className="text-left py-3">
                                        Name
                                    </th>

                                    <th className="text-left py-3">
                                        Email
                                    </th>

                                    <th className="text-left py-3">
                                        Goal
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {users.map((user) => (

                                    <tr
                                        key={user.id}
                                        className="border-b hover:bg-slate-50"
                                    >

                                        <td className="py-3">
                                            {user.id}
                                        </td>

                                        <td className="py-3">
                                            {user.name}
                                        </td>

                                        <td className="py-3">
                                            {user.email}
                                        </td>

                                        <td className="py-3">
                                            {user.goal || "Not Set"}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;