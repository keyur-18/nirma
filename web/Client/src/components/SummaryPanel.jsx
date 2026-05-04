import { Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from './Card';

/**
 * Enhanced Summary Panel - Shows AI summary and system alerts
 */
function SummaryPanel({ summary }) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">System Summary</h3>
          <p className="text-sm text-gray-500 mt-1">AI-powered insights</p>
        </div>

        {/* Main Summary */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p className="text-gray-700 leading-relaxed">
            {summary || "Monitor your solar inverters in real-time. This system tracks power generation, efficiency, and potential issues to ensure optimal performance."}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" strokeWidth={1.5} />
            <div>
              <p className="font-medium text-green-900">All Systems</p>
              <p className="text-sm text-green-700">Operating normally</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" strokeWidth={1.5} />
            <div>
              <p className="font-medium text-yellow-900">2 Warnings</p>
              <p className="text-sm text-yellow-700">Check inverters 2 & 5</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <Zap className="w-5 h-5 text-blue-600 shrink-0" strokeWidth={1.5} />
            <div>
              <p className="font-medium text-blue-900">Peak Performance</p>
              <p className="text-sm text-blue-700">Expected around 14:00</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default SummaryPanel;