import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartCard } from './Card';

/**
 * Inverter Trend Chart - Line chart showing power trends
 */
function InverterTrendChart({ data, className = '' }) {
  const defaultData = [
    { time: '08:00', inverter1: 2400, inverter2: 2210, inverter3: 2290 },
    { time: '09:00', inverter1: 3300, inverter2: 2988, inverter3: 2100 },
    { time: '10:00', inverter1: 2800, inverter2: 3100, inverter3: 2390 },
    { time: '11:00', inverter1: 2780, inverter2: 3600, inverter3: 2450 },
    { time: '12:00', inverter1: 3200, inverter2: 4100, inverter3: 2600 },
    { time: '13:00', inverter1: 3400, inverter2: 4300, inverter3: 2800 },
    { time: '14:00', inverter1: 3600, inverter2: 4500, inverter3: 3000 },
    { time: '15:00', inverter1: 3800, inverter2: 4700, inverter3: 3200 },
  ];

  const chartData = data && data.length ? data : defaultData;

  return (
    <ChartCard 
      title="Inverter Trend" 
      subtitle="Power generation over time"
      className={className}
    >
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="time" stroke="#9ca3af" tickLine={false} axisLine={false} />
          <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
            }}
            formatter={(value) => [`${value}W`, 'Power']}
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="inverter1"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ fill: '#f97316', r: 4 }}
            activeDot={{ r: 6 }}
            name="Inverter 1"
          />
          <Line
            type="monotone"
            dataKey="inverter2"
            stroke="#fbbf24"
            strokeWidth={2}
            dot={{ fill: '#fbbf24', r: 4 }}
            activeDot={{ r: 6 }}
            name="Inverter 2"
          />
          <Line
            type="monotone"
            dataKey="inverter3"
            stroke="#34d399"
            strokeWidth={2}
            dot={{ fill: '#34d399', r: 4 }}
            activeDot={{ r: 6 }}
            name="Inverter 3"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export default InverterTrendChart;
