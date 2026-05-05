import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, Badge } from './Card';

/**
 * Enhanced Risk Card - Shows inverter risk with visual indicators
 */
function RiskCard({ inverterId, riskScore }) {
  const risk = Number(riskScore);
  
  const getRiskLevel = () => {
    if (risk > 70) return { level: 'Critical', color: 'error', trend: 'up', icon: TrendingUp };
    if (risk > 40) return { level: 'Warning', color: 'warning', trend: 'neutral', icon: TrendingDown };
    return { level: 'Good', color: 'success', trend: 'down', icon: TrendingDown };
  };

  const riskInfo = getRiskLevel();
  const TrendIcon = riskInfo.icon;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Inverter {inverterId}
            </h3>
            <p className="text-sm text-gray-500 mt-1">System monitoring</p>
          </div>
          <Badge status={riskInfo.color} label={riskInfo.level} size="sm" />
        </div>

        {/* Risk Score Display */}
        <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-100">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-orange-600 mb-1">Risk Score</p>
              <p className="text-3xl font-bold text-orange-600">{risk.toFixed(1)}%</p>
            </div>
            <div className={`
              p-2 rounded-lg
              ${risk > 70 ? 'bg-red-100 text-red-600' : 
                risk > 40 ? 'bg-yellow-100 text-yellow-600' : 
                'bg-green-100 text-green-600'}
            `}>
              <AlertTriangle className="w-5 h-5" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Progress</span>
            <span className="text-xs text-gray-500">{risk.toFixed(1)} / 100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                risk > 70 ? 'bg-red-500' :
                risk > 40 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(risk, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-center gap-1">
            <TrendIcon className={`w-4 h-4 ${
              risk > 70 ? 'text-red-600' :
              risk > 40 ? 'text-yellow-600' :
              'text-green-600'
            }`} strokeWidth={2} />
            <span className="text-xs font-medium text-gray-600">
              {risk > 70 ? 'Rising' : 'Improving'}
            </span>
          </div>
          <div className="text-xs text-gray-500 flex-1 text-right">
            Last updated: now
          </div>
        </div>
      </div>
    </Card>
  );
}

export default RiskCard;