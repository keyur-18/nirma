import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";

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

  return (

    <div className="p-4 md:p-6">

      {/* Filter + Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <select
          value={selectedInverter}
          onChange={(e) => {
            setSelectedInverter(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-60"
        >

          <option value="">All Inverters</option>

          {inverters.map((inv) => (

            <option key={inv._id} value={inv.inverterId}>
              {inv.inverterId}
            </option>

          ))}

        </select>

        <Pagination
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />

      </div>

      {/* Table Card */}
      <div className="bg-white shadow-sm border">

        <div className="overflow-x-auto">

          <table className="min-w-full text-sm">

            <thead className="bg-gray-100 text-gray-600">

              <tr>
                <th className="px-4 py-3 text-left">Inverter</th>
                <th className="px-4 py-3 text-left">Temp</th>
                <th className="px-4 py-3 text-left">V_CA</th>
                <th className="px-4 py-3 text-left">V_BC</th>
                <th className="px-4 py-3 text-left">V_AB</th>
                <th className="px-4 py-3 text-left">PV Power</th>
                <th className="px-4 py-3 text-left">Power</th>
                <th className="px-4 py-3 text-left">Energy Today</th>
                <th className="px-4 py-3 text-left">Energy Total</th>
                <th className="px-4 py-3 text-left">Timestamp</th>
              </tr>

            </thead>

            <tbody>

              {data.map((item) => (

                <tr
                  key={item._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  <td className="px-4 py-3 font-medium">{item.inverterId}</td>
                  <td className="px-4 py-3">{item.temperature}</td>
                  <td className="px-4 py-3">{item.voltageCA}</td>
                  <td className="px-4 py-3">{item.voltageBC}</td>
                  <td className="px-4 py-3">{item.voltageAB}</td>
                  <td className="px-4 py-3">{item.pvPower}</td>
                  <td className="px-4 py-3">{item.power}</td>
                  <td className="px-4 py-3">{item.energyToday}</td>
                  <td className="px-4 py-3">{item.energyTotal}</td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}

export default Telemetry;