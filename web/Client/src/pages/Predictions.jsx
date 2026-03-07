import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";

import {
  getAllPredictions,
  getPredictionsByInverter
} from "../api/predictionApi";

import { getAllInverters } from "../api/inverterApi";

function Predictions() {

  const [data, setData] = useState([]);
  const [inverters, setInverters] = useState([]);
  const [selectedInverter, setSelectedInverter] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);



  const fetchPredictions = async () => {

    try {

      let res;

      if (selectedInverter) {

        res = await getPredictionsByInverter(
          selectedInverter,
          page,
          limit
        );

      } else {

        res = await getAllPredictions(page, limit);

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

    const sorted = res.data.sort(
      (a, b) => Number(a.inverterId) - Number(b.inverterId)
    );

    setInverters(sorted);

  } catch (error) {

    console.error(error);

  }

};



  useEffect(() => {

    fetchPredictions();

  }, [selectedInverter, page]);



  useEffect(() => {

    fetchInverters();

  }, []);



  // Convert risk_score → status
  const getStatus = (score) => {

    if (score >= 0.6) return "HIGH";
    if (score >= 0.3) return "MEDIUM";
    return "LOW";

  };



  const getStatusStyle = (status) => {

    if (status === "HIGH") return "bg-red-100 text-red-700";
    if (status === "MEDIUM") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";

  };



  return (

    <div className="p-4 md:p-6">

      <div className="flex justify-between mb-6">

        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-60"
          value={selectedInverter}
          onChange={(e) => {
            setSelectedInverter(e.target.value);
            setPage(1);
          }}
        >

          <option value="">All Inverters</option>

          {inverters.map((inv) => (

            <option
              key={inv._id}
              value={inv.inverterId}
            >
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



      <div className="bg-white shadow-sm border">

        <div className="overflow-x-auto">

          <table className="min-w-full text-sm">

            <thead className="bg-gray-100 text-gray-600">

              <tr>
                <th className="px-4 py-3 text-left">Inverter</th>
                <th className="px-4 py-3 text-left">Power</th>
                <th className="px-4 py-3 text-left">Temp</th>
                <th className="px-4 py-3 text-left">PV Power</th>
                <th className="px-4 py-3 text-left">Risk Score</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Timestamp</th>
              </tr>

            </thead>

            <tbody>

              {data.map((p) => {

                const status = getStatus(p.risk_score);

                return (

                  <tr
                    key={p._id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="px-4 py-3 font-medium">
                      {p.inverter_id}
                    </td>

                    <td className="px-4 py-3">
                      {p.power}
                    </td>

                    <td className="px-4 py-3">
                      {p.temp}
                    </td>

                    <td className="px-4 py-3">
                      {p.pv_power}
                    </td>

                    <td className="px-4 py-3">
                      {(p.risk_score * 100).toFixed(1)}%
                    </td>

                    <td className="px-4 py-3">

                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(
                          status
                        )}`}
                      >
                        {status}
                      </span>

                    </td>

                    <td className="px-4 py-3">
                      {new Date(p.timestamp).toLocaleString()}
                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

      </div>



      

    </div>

  );
}

export default Predictions;