import { useEffect, useState } from "react";
import RiskCard from "../components/RiskCard";
import TrendChart from "../components/TrendCard";
import SummaryPanel from "../components/SummaryPanel";
import { getLatestRisk } from "../api/predictionApi";

function Dashboard() {

  const [riskData, setRiskData] = useState([]);

 const fetchRisk = async () => {

  try {

    const res = await getLatestRisk();

    const sorted = res.data.sort(
      (a, b) => Number(a.inverterId) - Number(b.inverterId)
    );

    setRiskData(sorted);

  } catch (error) {

    console.error(error);

  }

};

  useEffect(() => {

    fetchRisk();

  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <main className="flex-1 p-4 md:p-6 space-y-6">

        {/* Risk Cards */}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

          {riskData.map((inv) => (
            
            <RiskCard
              key={inv.inverterId}
              inverterId={inv.inverterId}
              riskScore={(inv.riskScore * 100).toFixed(1)}
            />

          ))}

        </div>


        {/* Charts + Summary */}

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">

          <TrendChart />

          <SummaryPanel
            summary="System monitoring latest inverter risks."
          />

        </div>

      </main>

    </div>
  );
}

export default Dashboard;