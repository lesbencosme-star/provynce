import { useEffect, useState } from 'react';
import { useMetrics } from '@/context/MetricsContext';

export default function GlobalImpact() {
  const { metrics } = useMetrics();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  if (!metrics) {
    return null;
  }

  const impactCards = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'CO₂ Reduced',
      value: metrics.co2Saved,
      unit: 'tons',
      color: 'from-green-500 to-emerald-600',
      bg: 'bg-green-500/10',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
      label: 'Water Treated',
      value: metrics.waterTreated,
      unit: 'M gal',
      color: 'from-blue-500 to-cyan-600',
      bg: 'bg-blue-500/10',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      label: 'Jobs Created',
      value: metrics.jobsCreated,
      unit: 'positions',
      color: 'from-purple-500 to-pink-600',
      bg: 'bg-purple-500/10',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      label: 'Clean Energy',
      value: metrics.energyGenerated,
      unit: 'MWh',
      color: 'from-yellow-500 to-orange-600',
      bg: 'bg-yellow-500/10',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-stellar-navy via-blue-900/50 to-stellar-navy-dark rounded-2xl p-8 border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-1.5 h-8 bg-gradient-to-b from-stellar-blue to-green-500 rounded-full"></span>
            Global Impact Dashboard
          </h2>
          <p className="text-gray-400 mt-1">Real-time metrics from all active projects</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-semibold">Live Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {impactCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bg} backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:shadow-xl ${
              animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${card.color} text-white mb-4 shadow-lg`}>
              {card.icon}
            </div>
            <div className="space-y-1">
              <p className="text-gray-400 text-sm font-medium">{card.label}</p>
              <p className="text-3xl font-bold text-white">
                {card.value.toLocaleString()}
                <span className="text-lg text-gray-400 ml-1">{card.unit}</span>
              </p>
            </div>
            <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${card.color} transition-all duration-1000 ease-out`}
                style={{ width: animated ? '100%' : '0%' }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
