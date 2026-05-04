/**
 * Skeleton Loading Component
 */
export function SkeletonLoader({ count = 1, type = 'card', className = '' }) {
  if (type === 'card') {
    return (
      <>
        {Array(count)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={`
                bg-white rounded-2xl p-6 border border-gray-100
                animate-pulse ${className}
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
      </>
    );
  }

  if (type === 'chart') {
    return (
      <div className={`
        bg-white rounded-2xl p-6 border border-gray-100
        animate-pulse ${className}
      `}>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={`bg-white rounded-2xl p-6 border border-gray-100 animate-pulse ${className}`}>
        <div className="space-y-3">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
        </div>
      </div>
    );
  }

  return null;
}

export default SkeletonLoader;
