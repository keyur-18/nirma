import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

function Navbar({ toggleSidebar }) {

  const { user, logout } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {

    const path = location.pathname;

    if (path === "/") return "Dashboard";
    if (path.includes("/inverters")) return "Inverters";
    if (path.includes("/telemetry")) return "Telemetry";
    if (path.includes("/predictions")) return "Predictions";
    if (path.includes("/qa")) return "AI Q&A";

    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b">

      <div className="flex items-center justify-between px-3 md:px-6 h-10">

        {/* Left Section */}
        <div className="flex items-center gap-3">

          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-600 hover:text-amber-600"
          >
            ☰
          </button>

          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            {getPageTitle()}
          </h2>

        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* User name */}
          <span className="hidden sm:block text-gray-600">
            {user?.name}
          </span>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-md transition"
          >
            Logout
          </button>

        </div>

      </div>

    </header>
  );
}

export default Navbar;