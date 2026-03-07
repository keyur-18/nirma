import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 ml-64">
        <Navbar/>
        <div className="p-6 bg-gray-50 min-h-screen">
          <Outlet />
        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;