import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartCard } from './Card';

/**
 * Power Distribution Chart - Bar chart showing power by inverter
 */
function PowerDistributionChart({ data, className = '' }) {
  const defaultData = [
    { name: 'Inverter 1', power: 2400, capacity: 3000 },
    { name: 'Inverter 2', power: 2210, capacity: 3000 },
    { name: 'Inverter 3', power: 2290, capacity: 3000 },
    { name: 'Inverter 4', power: 2000, capacity: 3000 },
    { name: 'Inverter 5', power: 2780, capacity: 3000 },
    { name: 'Inverter 6', power: 1890, capacity: 3000 },
  ];

  const chartData = data && data.length ? data : defaultData;

  return (
    <ChartCard 
      title="Power Distribution" 
      subtitle="Current power output by inverter"
      className={className}
    >
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          margin={{ top: 18, right: 24, left: 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#9ca3af" tickLine={false} axisLine={false} />
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
          <Bar
            dataKey="power"
            fill="#f97316"
            radius={[8, 8, 0, 0]}
            name="Output"
          />
          <Bar
            dataKey="capacity"
            fill="#A9A9A9"
            radius={[8, 8, 0, 0]}
            name="Capacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export default PowerDistributionChart;
