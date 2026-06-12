import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    
    // Add token validation check
    if (!token || token === "undefined" || token === "null") {
        return <Navigate to="/login" />;
    }
    
    return children;
}

export default ProtectedRoute;