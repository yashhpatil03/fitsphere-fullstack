import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

function DashboardLayout({ children }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="flex">
            <Sidebar onLogout={handleLogout} />
            <div className="flex-1 bg-gray-100 min-h-screen p-8">
                {children}
            </div>
        </div>
    );
}

export default DashboardLayout;