import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="flex bg-gray-50 h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-72 h-full">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;