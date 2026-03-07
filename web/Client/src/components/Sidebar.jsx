import { NavLink } from "react-router-dom";
import { useState } from "react";

function Sidebar() {

  const [open, setOpen] = useState(false);

  const baseStyle =
    "p-2 rounded-lg text-gray-700 transition";

  const activeStyle =
    "bg-amber-100 text-amber-700 font-semibold";

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 bg-amber-500 text-white p-2 rounded"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-screen w-64
        bg-white border-r shadow-sm
        p-6 transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        `}
      >

        <h1 className="text-xl font-semibold text-amber-600 mb-10">
          🌤️ Solar Monitor
        </h1>

        <nav className="flex flex-col gap-2">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `${baseStyle} ${isActive ? activeStyle : "hover:bg-amber-50"}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/inverters"
            className={({ isActive }) =>
              `${baseStyle} ${isActive ? activeStyle : "hover:bg-amber-50"}`
            }
          >
            Inverters
          </NavLink>

          <NavLink
            to="/telemetry"
            className={({ isActive }) =>
              `${baseStyle} ${isActive ? activeStyle : "hover:bg-amber-50"}`
            }
          >
            Telemetry
          </NavLink>

          <NavLink
            to="/predictions"
            className={({ isActive }) =>
              `${baseStyle} ${isActive ? activeStyle : "hover:bg-amber-50"}`
            }
          >
            Predictions
          </NavLink>

          <NavLink
            to="/qa"
            className={({ isActive }) =>
              `${baseStyle} ${isActive ? activeStyle : "hover:bg-amber-50"}`
            }
          >
            Q&A
          </NavLink>

        </nav>

      </div>
    </>
  );
}

export default Sidebar;