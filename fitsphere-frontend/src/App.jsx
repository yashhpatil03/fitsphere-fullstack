import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Workouts from "./pages/Workouts";
import Exercises from "./pages/Exercises";
import Diet from "./pages/Diet";
import Progress from "./pages/Progress";
import Reports from "./pages/Reports";
import AiCoach from './pages/AiCoach'; 
import AdminDashboard from "./pages/AdminDashboard";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />}/>

        <Route path="/profile" element={<Profile />}/>

        <Route path="/workouts" element={<Workouts />} />

        <Route path="/exercises/:workoutId" element={<Exercises />} />

        <Route path="/diet" element={<Diet />}/>

        <Route path="/progress" element={<Progress />}/>

        <Route  path="/reports" element={<Reports />}/>

        <Route  path="/ai-coach" element={ <AiCoach />}/>
       <Route path="/admin" element={<AdminDashboard />}/>


      </Routes>

    </BrowserRouter>
  );
}

export default App;