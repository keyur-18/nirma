import { NavLink } from "react-router-dom";
import { useState } from "react";

function Sidebar() {

  const [open, setOpen] = useState(false);

  const baseStyle =
    "flex flex-col items-center p-3 rounded-lg text-gray-700 transition";

  const activeStyle =
    "bg-amber-100 text-amber-700 font-semibold";

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20 transition hover:bg-amber-600"
        aria-label="Open sidebar"
      >
        ☰
      </button>

      {/* Backdrop for mobile */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-slate-950 text-slate-100 shadow-2xl transition-transform duration-300 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-400/80">Solar Monitor</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">
              🌤️ Dashboard
            </h1>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden rounded-2xl bg-slate-800 p-2 text-slate-200 transition hover:bg-slate-700"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-hidden px-4 py-6">
          <p className="mb-4 text-xs uppercase tracking-[0.24em] text-slate-400">Navigation</p>
          <nav className="space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${baseStyle} ${isActive ? activeStyle : "text-slate-200 hover:bg-slate-800"}`
              }
            >
              <span className="text-2xl mb-1">🏠</span>
              <span className="text-sm">Dashboard</span>
            </NavLink>

            <NavLink
              to="/inverters"
              className={({ isActive }) =>
                `${baseStyle} ${isActive ? activeStyle : "text-slate-200 hover:bg-slate-800"}`
              }
            >
              <span className="text-2xl mb-1">⚡</span>
              <span className="text-sm">Inverters</span>
            </NavLink>

            <NavLink
              to="/telemetry"
              className={({ isActive }) =>
                `${baseStyle} ${isActive ? activeStyle : "text-slate-200 hover:bg-slate-800"}`
              }
            >
              <span className="text-2xl mb-1">📡</span>
              <span className="text-sm">Telemetry</span>
            </NavLink>

            <NavLink
              to="/predictions"
              className={({ isActive }) =>
                `${baseStyle} ${isActive ? activeStyle : "text-slate-200 hover:bg-slate-800"}`
              }
            >
              <span className="text-2xl mb-1">📈</span>
              <span className="text-sm">Predictions</span>
            </NavLink>

            <NavLink
              to="/qa"
              className={({ isActive }) =>
                `${baseStyle} ${isActive ? activeStyle : "text-slate-200 hover:bg-slate-800"}`
              }
            >
              <span className="text-2xl mb-1">💬</span>
              <span className="text-sm">Q&A</span>
            </NavLink>
          </nav>
        </div>

        <div className="border-t border-slate-800 px-6 py-5">
          <div className="rounded-3xl bg-slate-900 p-4 shadow-inner">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Weekly status</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-2xl bg-slate-950 px-4 py-3">
                <span>System uptime</span>
                <span className="text-emerald-300">99.8%</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-950 px-4 py-3">
                <span>Alerts</span>
                <span className="text-amber-300">2 active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;