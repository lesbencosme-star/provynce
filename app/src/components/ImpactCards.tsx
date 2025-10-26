interface ImpactMetric {
  label: string;
  value: string;
  unit: string;
  icon: JSX.Element;
  color: string;
  trend?: string;
}

interface ImpactCardsProps {
  projectId: number;
  category: string;
}

export default function ImpactCards({ projectId, category }: ImpactCardsProps) {
  // Mock impact data based on category
  const getImpactMetrics = (): ImpactMetric[] => {
    switch (category) {
      case 'Bridge':
        return [
          {
            label: 'Daily Traffic',
            value: '12,500',
            unit: 'vehicles',
            trend: '+15% since repairs',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ),
            color: 'from-blue-500 to-cyan-600',
          },
          {
            label: 'Safety Score',
            value: '9.2',
            unit: '/ 10',
            trend: 'Excellent',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ),
            color: 'from-green-500 to-emerald-600',
          },
          {
            label: 'Incident Reduction',
            value: '47%',
            unit: 'decrease',
            trend: 'vs last year',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            color: 'from-purple-500 to-pink-600',
          },
          {
            label: 'Lifespan Extension',
            value: '50+',
            unit: 'years',
            trend: 'Projected',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            color: 'from-yellow-500 to-orange-600',
          },
        ];
      case 'Renewable Energy':
        return [
          {
            label: 'Energy Generated',
            value: '8.5',
            unit: 'MWh',
            trend: 'This month',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ),
            color: 'from-yellow-500 to-orange-600',
          },
          {
            label: 'CO₂ Avoided',
            value: '2,400',
            unit: 'tons',
            trend: 'Annual',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            color: 'from-green-500 to-emerald-600',
          },
          {
            label: 'Cost Savings',
            value: '$125K',
            unit: 'saved',
            trend: 'Per year',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            color: 'from-blue-500 to-cyan-600',
          },
          {
            label: 'Buildings Powered',
            value: '300',
            unit: 'facilities',
            trend: 'And growing',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            ),
            color: 'from-purple-500 to-pink-600',
          },
        ];
      default:
        return [
          {
            label: 'Community Impact',
            value: '95%',
            unit: 'satisfaction',
            trend: 'Resident feedback',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            color: 'from-green-500 to-emerald-600',
          },
        ];
    }
  };

  const metrics = getImpactMetrics();

  return (
    <div className="bg-gradient-to-br from-stellar-navy via-blue-900/50 to-stellar-navy-dark rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-gradient-to-b from-stellar-blue to-green-500 rounded-full"></span>
        Real Impact Metrics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all hover:scale-105"
          >
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${metric.color} text-white mb-3 shadow-lg`}>
              {metric.icon}
            </div>
            <p className="text-gray-400 text-sm font-medium mb-1">{metric.label}</p>
            <p className="text-3xl font-bold text-white">
              {metric.value}
              <span className="text-lg text-gray-400 ml-1">{metric.unit}</span>
            </p>
            {metric.trend && (
              <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                {metric.trend}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
