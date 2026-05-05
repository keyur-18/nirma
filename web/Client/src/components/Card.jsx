/**
 * Reusable Card Component - Base for all card layouts
 */
export function Card({ children, className = "", hover = true }) {
  return (
    <div
      className={
        `card bg-base-100 rounded-2xl shadow-sm border border-base-200 transition-shadow duration-300 ${
          hover ? 'hover:shadow-lg hover:border-base-300' : ''
        } ${className}`
      }
    >
      {children}
    </div>
  );
}

/**
 * KPI Card - Displays key performance indicators
 */
export function KPICard({ 
  title, 
  value, 
  icon: Icon, 
  unit = '', 
  trend = null,
  trendUp = true,
  color = 'primary',
  status = null
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    solar: 'bg-orange-100 text-orange-600'
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {status && (
              <span className={`badge badge-sm ${
                status === 'healthy' ? 'badge-success' : status === 'warning' ? 'badge-warning' : status === 'alert' ? 'badge-error' : 'badge-secondary'
              }`}>{status}</span>
            )}
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <p className="stat-value text-3xl font-semibold text-gray-900">
              {value}
            </p>
            {unit && <span className="text-sm text-gray-500">{unit}</span>}
          </div>
          {trend && (
            <div className={`mt-3 text-sm font-medium ${trendUp ? 'text-success' : 'text-error'}`}>
              {trendUp ? '▲' : '▼'} {trend}% vs last hour
            </div>
          )}
        </div>

        {Icon && (
          <div className={`grid h-14 w-14 place-items-center rounded-3xl ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" strokeWidth={1.5} />
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * Chart Card - Container for charts
 */
export function ChartCard({ title, children, subtitle = null }) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </Card>
  );
}

/**
 * Status Badge - Shows status with color
 */
export function Badge({ 
  status = 'default', 
  label, 
  icon: Icon = null,
  size = 'md'
}) {
  const statusClasses = {
    success: 'badge badge-success',
    warning: 'badge badge-warning',
    error: 'badge badge-error',
    info: 'badge badge-info',
    default: 'badge badge-outline'
  };

  const sizeClasses = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg'
  };

  return (
    <div className={`inline-flex items-center gap-2 ${statusClasses[status]} ${sizeClasses[size]} font-medium`}>
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
    </div>
  );
}

export default Card;
