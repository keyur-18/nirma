import { useEffect, useMemo, useState } from "react";
import {
  Zap,
  Activity,
  AlertTriangle,
  TrendingUp,
  Loader2,
  Sparkles,
  ShieldCheck,
  Clock4,
} from "lucide-react";
import { KPICard } from "../components/Card";
import { SkeletonLoader } from "../components/SkeletonLoader";
import RiskCard from "../components/RiskCard";
import TrendChart from "../components/TrendCard";
import PowerDistributionChart from "../components/PowerDistributionChart";
import SummaryPanel from "../components/SummaryPanel";
import { getLatestRisk } from "../api/predictionApi";

function Dashboard() {
  const [riskData, setRiskData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRisk = async () => {
    setIsLoading(true);
    try {
      const res = await getLatestRisk();
      const sorted = res.data.sort(
        (a, b) => Number(a.inverterId) - Number(b.inverterId)
      );
      setRiskData(sorted);
    } catch (error) {
      console.error("Error fetching risk data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRisk();
    // Refresh every 30 seconds
    const interval = setInterval(fetchRisk, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalPower = useMemo(
    () => riskData.reduce((sum, inv) => sum + (Number(inv.power) || 2400), 0),
    [riskData]
  );

  const activeInverters = useMemo(
    () => riskData.filter((inv) => inv.status !== "offline").length,
    [riskData]
  );

  const alertsCount = useMemo(
    () => riskData.filter((inv) => Number(inv.riskScore) > 0.5).length,
    [riskData]
  );

  const avgEfficiency = useMemo(() => {
    const total = riskData.reduce((sum, inv) => sum + (Number(inv.efficiency) || 0), 0);
    return (total / Math.max(riskData.length, 1)).toFixed(1);
  }, [riskData]);

  const powerChartData = useMemo(
    () =>
      riskData.map((inv) => ({
        name: `Inv ${inv.inverterId}`,
        power: Number(inv.power) || 0,
        capacity: 3000,
      })),
    [riskData]
  );

  const trendData = useMemo(
    () => [
      { time: "08:00", inverter1: 2400, inverter2: 2210, inverter3: 2290 },
      { time: "09:00", inverter1: 3300, inverter2: 2988, inverter3: 2100 },
      { time: "10:00", inverter1: 2800, inverter2: 3100, inverter3: 2390 },
      { time: "11:00", inverter1: 2780, inverter2: 3600, inverter3: 2450 },
      { time: "12:00", inverter1: 3200, inverter2: 4100, inverter3: 2600 },
      { time: "13:00", inverter1: 3400, inverter2: 4300, inverter3: 2800 },
      { time: "14:00", inverter1: 3600, inverter2: 4500, inverter3: 3000 },
      { time: "15:00", inverter1: 3800, inverter2: 4700, inverter3: 3200 },
    ],
    []
  );

  return (
    <div className="h-full bg-linear-to-br from-slate-50 to-slate-100">
      <div className="px-4 py-4 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Solar Analytics</h1>
            <p className="text-sm text-slate-600 mt-1">
              Modern dashboard for inverter health, alerts, and power performance.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            {isLoading ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-amber-800">
                <Loader2 className="w-3 h-3 animate-spin" />
                Updating data...
              </div>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">
                <ShieldCheck className="w-3 h-3 text-success" /> Live metrics
              </span>
            )}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-4">
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <SkeletonLoader count={4} type="card" />
          ) : (
            <>
              <KPICard
                title="Total Power"
                value={Math.round(totalPower / 1000)}
                unit="kW"
                icon={Zap}
                color="solar"
                trend={12}
                trendUp={true}
                status="healthy"
              />
              <KPICard
                title="Active Inverters"
                value={activeInverters}
                unit={`/ ${riskData.length}`}
                icon={Activity}
                color="success"
                trend={5}
                trendUp={true}
                status="healthy"
              />
              <KPICard
                title="Alerts"
                value={alertsCount}
                unit={alertsCount > 0 ? "active" : "none"}
                icon={AlertTriangle}
                color={alertsCount > 2 ? "error" : alertsCount > 0 ? "warning" : "success"}
                trend={alertsCount > 0 ? 14 : 0}
                trendUp={alertsCount > 0}
                status={alertsCount > 2 ? 'alert' : alertsCount > 0 ? 'warning' : 'healthy'}
              />
              <KPICard
                title="Avg Efficiency"
                value={avgEfficiency}
                unit="%"
                icon={TrendingUp}
                color="primary"
                trend={3}
                trendUp={true}
                status="healthy"
              />
            </>
          )}
        </section>

        <section className="grid grid-cols-1  gap-4">
          <div className="space-y-4">
            {isLoading ? (
              <>
                <SkeletonLoader type="chart" />
                <SkeletonLoader type="chart" />
              </>
            ) : (
              <>
                <TrendChart data={trendData} className="min-h-80" />
                <PowerDistributionChart data={powerChartData} className="min-h-72" />
              </>
            )}
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <SkeletonLoader count={2} type="card" />
            ) : (
              <>
                <SummaryPanel
                  summary={`System monitoring ${riskData.length} inverters with ${alertsCount} active alerts.`}
                />
                <div className="card bg-base-100 rounded-2xl border border-base-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-900">System Status</p>
                      <p className="text-xs text-slate-500 mt-1">Live health and performance insights.</p>
                    </div>
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>

                  <div className="grid gap-3 mt-4">
                    <div className="rounded-2xl bg-slate-50 border border-base-200 shadow-sm p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Uptime</p>
                          <p className="text-xs text-slate-500 mt-1">Stable</p>
                        </div>
                        <ShieldCheck className="w-5 h-5 text-success" />
                      </div>
                      <p className="mt-3 text-2xl font-semibold text-slate-900">99.98%</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 border border-base-200 shadow-sm p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Alerts</p>
                          <p className="text-xs text-slate-500 mt-1">{alertsCount > 0 ? 'Review soon' : 'No new issues'}</p>
                        </div>
                        <Clock4 className="w-5 h-5 text-warning" />
                      </div>
                      <p className="mt-3 text-2xl font-semibold text-slate-900">{alertsCount}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 border border-base-200 shadow-sm p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Peak Yield</p>
                          <p className="text-xs text-slate-500 mt-1">Across all inverters</p>
                        </div>
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <p className="mt-3 text-2xl font-semibold text-slate-900">{Math.round(totalPower / 1000)}kW</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[2.3fr_1fr] gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Inverter Risk Overview</h2>
                <p className="text-xs text-slate-500 mt-1">Review current inverter risk scores and status cards.</p>
              </div>
            </div>

            {isLoading ? (
              <SkeletonLoader count={3} type="card" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <RiskCard
                  inverterId={1}
                  riskScore="12.5"
                />
                <RiskCard
                  inverterId={2}
                  riskScore="8.3"
                />
                <RiskCard
                  inverterId={3}
                  riskScore="73.6"
                />
                <RiskCard
                  inverterId={4}
                  riskScore="25.7"
                />
                <RiskCard
                  inverterId={5}
                  riskScore="31.2"
                />
                <RiskCard
                  inverterId={6}
                  riskScore="8.23"
                />
                <RiskCard
                  inverterId={7}
                  riskScore="25"
                />
                <RiskCard
                  inverterId={8}
                  riskScore="48"
                />
                <RiskCard
                  inverterId={9}
                  riskScore="30.7"
                />
                <RiskCard
                  inverterId={10}
                  riskScore="5.7"
                />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;