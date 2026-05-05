import { useEffect, useState } from "react";
import { AlertTriangle, TrendingUp, Zap, Thermometer, Clock, Filter } from "lucide-react";
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

  const getStatusConfig = (status) => {
    switch (status) {
      case "HIGH":
        return {
          color: "red",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-700",
          progressBg: "bg-red-500",
          icon: AlertTriangle,
          label: "Critical Risk"
        };
      case "MEDIUM":
        return {
          color: "yellow",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-700",
          progressBg: "bg-yellow-500",
          icon: TrendingUp,
          label: "Warning"
        };
      default:
        return {
          color: "green",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-700",
          progressBg: "bg-green-500",
          icon: Zap,
          label: "Safe"
        };
    }
  };



  return (

    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 p-3 md:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Risk Predictions</h1>
          <p className="text-slate-600">Monitor inverter risk levels and predictive maintenance alerts</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="font-medium text-slate-700">Filter by Inverter</span>
            </div>
            <select
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-w-40"
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
                  Inverter {inv.inverterId}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {data.map((prediction) => {
            const status = getStatus(prediction.risk_score);
            const config = getStatusConfig(status);
            const StatusIcon = config.icon;
            const riskPercentage = (prediction.risk_score * 100).toFixed(1);

            return (
              <div
                key={prediction._id}
                className={`group relative bg-white rounded-xl shadow-sm border-2 ${config.borderColor} ${config.bgColor} p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden`}
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
                  <StatusIcon className="w-full h-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-3 h-3 text-slate-600" />
                    </div>
                    <span className="font-semibold text-slate-800">INV-{prediction.inverter_id}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} border border-current`}>
                    {config.label}
                  </div>
                </div>

                {/* Risk Score Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-600">Risk Score</span>
                    <span className={`text-sm font-bold ${config.textColor}`}>{riskPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${config.progressBg} transition-all duration-1000 ease-out rounded-full`}
                      style={{ width: `${riskPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Temp</p>
                      <p className="text-sm font-semibold text-slate-800">{prediction.temp}°C</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Power</p>
                      <p className="text-sm font-semibold text-slate-800">{prediction.power}W</p>
                    </div>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-1 pt-2 border-t border-slate-200">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-500">
                    {new Date(prediction.timestamp).toLocaleString()}
                  </span>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          </div>
        )}

        {/* Empty State */}
        {data.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-600 mb-2">No Predictions Found</h3>
            <p className="text-slate-500">Try adjusting your filter or check back later for new predictions.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Predictions;