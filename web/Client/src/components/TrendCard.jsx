/**
 * Trend Card Component
 * Note: This component has been replaced with InverterTrendChart
 * for better chart implementation with Recharts
 */
import InverterTrendChart from './InverterTrendChart';

function TrendChart(props) {
  return <InverterTrendChart {...props} />;
}

export default TrendChart;