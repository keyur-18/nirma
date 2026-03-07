import { useEffect, useState } from "react";
import { getAllInverters } from "../api/inverterApi";

function Inverters() {

  const [inverters, setInverters] = useState([]);

  const fetchInverters = async () => {
    try {
      const res = await getAllInverters();
      setInverters(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInverters();
  }, []);

  return (

    <div className="p-4 md:p-6">

      <div className="bg-white shadow-sm border">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gray-100 text-gray-600 text-sm">

              <tr>
                <th className="px-4 py-3 text-left">Inverter ID</th>
                <th className="px-4 py-3 text-left">Plant</th>
                <th className="px-4 py-3 text-left">Capacity (kWh)</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>

            </thead>

            <tbody className="text-gray-700">

              {inverters.map((inv) => (

                <tr
                  key={inv._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  <td className="px-4 py-3 font-medium">
                    {inv.inverterId}
                  </td>

                  <td className="px-4 py-3">
                    {inv.plant}
                  </td>

                  <td className="px-4 py-3">
                    {inv.capacityKWh}
                  </td>

                  <td className="px-4 py-3">

                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        inv.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {inv.status}
                    </span>

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

export default Inverters;