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
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-slate-950/95 backdrop-blur-xl shadow-sm">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-200 shadow-sm transition hover:border-slate-500 hover:bg-slate-800"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>

          <div>
            <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-slate-300">
              {getPageTitle()}
            </h2>
            <p className="mt-1 text-sm text-slate-400">Live system overview</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="hidden rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 shadow-sm sm:inline-flex">
            {user?.name}
          </span>

          <div className="flex items-center gap-3 rounded-full border border-slate-700 bg-slate-900 px-3 py-2 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-sm font-semibold text-white shadow-inner">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

      </div>

    </header>
  );
}

export default Navbar;