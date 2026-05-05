import { useEffect, useState } from "react";

import {
  getAllTelemetry,
  getTelemetryByInverter
} from "../api/telemetryAPI";

import { getAllInverters } from "../api/inverterApi";

function Telemetry() {

  const [data, setData] = useState([]);
  const [inverters, setInverters] = useState([]);
  const [selectedInverter, setSelectedInverter] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTelemetry = async () => {

    try {

      let res;

      if (selectedInverter) {
        res = await getTelemetryByInverter(selectedInverter, page, limit);
      } else {
        res = await getAllTelemetry(page, limit);
      }

      setData(res.data);
      setTotalPages(res.pagination.totalPages);

    } catch (error) {
      console.error(error);
    }

  };

  const fetchInverters = async () => {

    try {

      const res = await getAllInverters();

      const sortedInverters = res.data.sort(
        (a, b) => Number(a.inverterId) - Number(b.inverterId)
      );

      setInverters(sortedInverters);

    } catch (error) {
      console.error(error);
    }

  };

  useEffect(() => {
    fetchTelemetry();
  }, [selectedInverter, page]);

  useEffect(() => {
    fetchInverters();
  }, []);

  const safeNumber = (value) => {
    const number = Number(value);
    return Number.isNaN(number) ? 0 : number;
  };

  const avgTemp = data.length
    ? (data.reduce((sum, item) => sum + safeNumber(item.temperature), 0) / data.length).toFixed(1)
    : 0;
  const totalPower = data.reduce((sum, item) => sum + safeNumber(item.power), 0).toFixed(1);
  const alertCount = data.reduce((count, item) => {
    const tempAlert = safeNumber(item.temperature) > 80;
    const voltageAlert = [item.voltageCA, item.voltageBC, item.voltageAB].some(
      (v) => safeNumber(v) < 330 || safeNumber(v) > 430
    );
    return count + (tempAlert || voltageAlert ? 1 : 0);
  }, 0);

  const getTempBadge = (temp) => {
    const value = safeNumber(temp);
    if (value > 80) return "badge badge-error badge-outline";
    if (value > 70) return "badge badge-warning badge-outline";
    return "badge badge-success badge-outline";
  };

  const getVoltageBadge = (voltage) => {
    const value = safeNumber(voltage);
    if (value < 330 || value > 430) return "badge badge-error badge-outline";
    if (value < 350 || value > 420) return "badge badge-warning badge-outline";
    return "badge badge-success badge-outline";
  };

  const visiblePages = () => {
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  };

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-4 md:px-4">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_20px_70px_-40px_rgba(15,23,42,0.2)] sm:px-6">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-950">Telemetry dashboard</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Live inverter telemetry with voltage health, temperature alerts, and power trends.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-sm">
                <div className="text-sm uppercase tracking-[0.18em] text-slate-300">Avg Temp</div>
                <div className="mt-2 text-2xl font-semibold">{avgTemp}°C</div>
              </div>
              <div className="rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-sm">
                <div className="text-sm uppercase tracking-[0.18em] text-slate-300">Total Power</div>
                <div className="mt-2 text-2xl font-semibold">{totalPower} kW</div>
              </div>
              <div className="rounded-2xl bg-rose-50 px-4 py-3 text-slate-900 shadow-sm">
                <div className="text-sm uppercase tracking-[0.18em] text-rose-500">Alerts</div>
                <div className="mt-2 text-2xl font-semibold">{alertCount}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_20px_70px_-40px_rgba(15,23,42,0.2)]">
          <div className="border-b border-slate-200 px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Telemetry table</h2>
                <p className="mt-1 text-sm text-slate-500">Monitor asset health in a scrollable, live-friendly view.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="flex w-full max-w-sm flex-col gap-2 text-sm text-slate-700">
                  Filter inverter
                  <select
                    value={selectedInverter}
                    onChange={(e) => {
                      setSelectedInverter(e.target.value);
                      setPage(1);
                    }}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="">All inverters</option>
                    {inverters.map((inv) => (
                      <option key={inv._id} value={inv.inverterId}>
                        {inv.inverterId}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>

          <div className="overflow-hidden px-4 py-3 sm:px-6">
            <div className="relative overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 shadow-inner">
              <table className="min-w-full border-separate border-spacing-0 text-sm">
                <thead className="sticky top-0 bg-slate-950 text-left text-xs uppercase tracking-[0.24em] text-white shadow-sm">
                  <tr>
                    <th className="px-3 py-3">Inverter</th>
                    <th className="px-3 py-3">Temp</th>
                    <th className="px-3 py-3">V_CA</th>
                    <th className="px-3 py-3">V_BC</th>
                    <th className="px-3 py-3">V_AB</th>
                    <th className="px-3 py-3">PV Power</th>
                    <th className="px-3 py-3">Power</th>
                    <th className="px-3 py-3">Energy Today</th>
                    <th className="px-3 py-3">Energy Total</th>
                    <th className="px-3 py-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.map((item, index) => (
                    <tr
                      key={item._id}
                      className={`transition ${index % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-slate-100`}
                    >
                      <td className="px-3 py-3 font-semibold text-slate-900">{item.inverterId}</td>
                      <td className="px-3 py-3">
                        <span className={`${getTempBadge(item.temperature)} inline-flex items-center rounded-full px-2.5 py-1 text-sm font-semibold`}>
                          {item.temperature}°C
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`${getVoltageBadge(item.voltageCA)} inline-flex items-center rounded-full px-2.5 py-1 text-sm font-semibold`}>
                          {item.voltageCA} V
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`${getVoltageBadge(item.voltageBC)} inline-flex items-center rounded-full px-2.5 py-1 text-sm font-semibold`}>
                          {item.voltageBC} V
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`${getVoltageBadge(item.voltageAB)} inline-flex items-center rounded-full px-2.5 py-1 text-sm font-semibold`}>
                          {item.voltageAB} V
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-700">{item.pvPower} kW</td>
                      <td className="px-3 py-3 text-slate-700">{item.power} kW</td>
                      <td className="px-3 py-3 text-slate-700">{item.energyToday} kWh</td>
                      <td className="px-3 py-3 text-slate-700">{item.energyTotal} kWh</td>
                      <td className="px-3 py-3 text-slate-500 whitespace-nowrap">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                Page <span className="font-semibold text-slate-900">{page}</span> of <span className="font-semibold text-slate-900">{totalPages}</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="btn btn-xs btn-outline rounded-full px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                {page > 3 && (
                  <button type="button" className="btn btn-xs btn-ghost rounded-full px-3 py-1.5 text-slate-600">
                    1
                  </button>
                )}
                {page > 4 && <span className="text-slate-400">...</span>}
                {visiblePages().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`btn btn-xs rounded-full px-3 py-1.5 ${pageNumber === page ? "btn-primary" : "btn-ghost text-slate-700"}`}
                  >
                    {pageNumber}
                  </button>
                ))}
                {page < totalPages - 3 && <span className="text-slate-400">...</span>}
                {page < totalPages - 2 && (
                  <button type="button" className="btn btn-xs btn-ghost rounded-full px-3 py-1.5 text-slate-600">
                    {totalPages}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="btn btn-xs btn-outline rounded-full px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Telemetry;