import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";

import DashboardLayout from "../pages/DashboardLayout";
import ProtectedRoutes from "./ProtectedRoutes";

import Dashboard from "../pages/Dashboard";
import Inverters from "../pages/Inverters";
import Telemetry from "../pages/Telemetry";
import Predictions from "../pages/Predictions";
import QA from "../pages/QA";

function AppRoutes() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>

        <Route element={<DashboardLayout />}>

          <Route path="/" element={<Dashboard />} />
          <Route path="/inverters" element={<Inverters />} />
          <Route path="/telemetry" element={<Telemetry />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/qa" element={<QA />} />

        </Route>

      </Route>

    </Routes>
  );
}

export default AppRoutes;