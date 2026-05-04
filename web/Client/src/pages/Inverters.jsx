import { useEffect, useState } from "react";
import { getAllInverters } from "../api/inverterApi";

function Inverters() {
  const [inverters, setInverters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchInverters = async () => {
    try {
      setLoading(true);
      const res = await getAllInverters();
      setInverters(res.data);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInverters();
  }, []);

  // Filter and search logic
  const filteredInverters = inverters.filter((inv) => {
    const matchesSearch =
      String(inv.inverterId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(inv.plant || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || String(inv.status || '').toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredInverters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInverters = filteredInverters.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleAddNew = () => {
    alert("Add new inverter feature is coming soon.");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 lg:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_30px_90px_-40px_rgba(15,23,42,0.3)]">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">
                  Inverter Management
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Monitor inverter status, search quickly, and manage entries.
                </p>
              </div>
              <button onClick={handleAddNew} className="btn btn-primary rounded-full px-4 py-2 text-sm font-semibold shadow-sm">
                <span className="mr-2">+</span>
                Add New
              </button>
            </div>
          </div>

          <div className="px-4 py-4 sm:px-6">
            <div className="grid gap-3 lg:grid-cols-[1.8fr_1fr_1fr]">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Search</span>
                <input
                  type="text"
                  placeholder="Search by inverter ID or plant"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Status</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="fault">Fault</option>
                  <option value="offline">Offline</option>
                </select>
              </label>

              <div className="flex h-full flex-col justify-end rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                <div className="text-sm font-semibold text-slate-600">Results</div>
                <div className="mt-2 flex items-center gap-2 text-2xl font-semibold text-slate-950">
                  {filteredInverters.length}
                  <span className="text-sm font-medium text-slate-500">/ {inverters.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 px-4 py-4 sm:px-6">
            {loading ? (
              <div className="flex min-h-48 items-center justify-center rounded-2xl bg-slate-50">
                <div className="text-center">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <p className="mt-3 text-sm text-slate-500">Loading inverters...</p>
                </div>
              </div>
            ) : filteredInverters.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">No inverters found</h3>
                <p className="mt-2 text-sm text-slate-500">
                  {searchTerm || statusFilter !== "all"
                    ? "Try changing your search or status filter."
                    : "No inverter records are available right now."}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="table-zebra w-full rounded-2xl border-collapse bg-white text-left shadow-sm">
                    <thead className="bg-slate-900 text-sm uppercase tracking-[0.12em] text-white">
                      <tr>
                        <th className="px-3 py-3 rounded-tl-2xl">Inverter ID</th>
                        <th className="px-3 py-3">Plant</th>
                        <th className="px-3 py-3">Capacity (kWh)</th>
                        <th className="px-3 py-3">Status</th>
                        <th className="px-3 py-3 rounded-tr-2xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedInverters.map((inv) => (
                        <tr key={inv._id} className="transition hover:bg-slate-50">
                          <td className="px-3 py-3">
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-900">
                              {String(inv.inverterId || 'N/A')}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-slate-700">{String(inv.plant || 'N/A')}</td>
                          <td className="px-3 py-3 text-slate-700 font-medium">{inv.capacityKWh || 'N/A'}</td>
                          <td className="px-3 py-3">
                            <span className={`badge badge-sm ${
                              String(inv.status || '').toLowerCase() === "active"
                                ? "badge-success"
                                : String(inv.status || '').toLowerCase() === "fault"
                                ? "badge-error"
                                : "badge-warning"
                            } badge-outline`}>
                              {String(inv.status || 'Unknown').charAt(0).toUpperCase() + String(inv.status || 'Unknown').slice(1)}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex flex-wrap gap-1.5">
                              <button className="btn btn-xs btn-outline btn-primary rounded-full px-3 py-1.5 text-xs">
                                View
                              </button>
                              <button className="btn btn-xs btn-outline btn-secondary rounded-full px-3 py-1.5 text-xs">
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="btn btn-xs btn-outline rounded-full px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`btn btn-xs rounded-full px-3 py-1.5 ${currentPage === page ? "btn-primary" : "btn-outline"}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="btn btn-xs btn-outline rounded-full px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed ml-240"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inverters;