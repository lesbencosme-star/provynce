import { useState } from 'react';

interface ServiceNotice {
  id: number;
  type: 'closure' | 'delay' | 'maintenance' | 'alert';
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string;
  severity: 'low' | 'medium' | 'high';
  projectId?: number;
}

export default function ServiceNotices() {
  const [expanded, setExpanded] = useState<number | null>(null);

  // Mock service notices
  const notices: ServiceNotice[] = [
    {
      id: 1,
      type: 'closure',
      title: 'Washington Bridge - Lane Closure',
      description: 'South-bound lane will be closed for steel reinforcement work. Expect delays during peak hours. Detour routes available via I-195 East.',
      location: 'Providence, RI',
      startDate: '2024-10-26',
      endDate: '2024-11-15',
      severity: 'high',
      projectId: 1,
    },
    {
      id: 2,
      type: 'maintenance',
      title: 'Metro Line 4 - Weekend Service',
      description: 'Reduced service on weekends while station upgrades continue. Buses available as alternatives.',
      location: 'Cambridge, MA',
      startDate: '2024-10-27',
      endDate: '2024-12-31',
      severity: 'medium',
      projectId: 5,
    },
    {
      id: 3,
      type: 'alert',
      title: 'Water Pressure Adjustment',
      description: 'Smart meter installation may cause brief pressure fluctuations in residential areas.',
      location: 'Warwick, RI',
      startDate: '2024-10-28',
      endDate: '2024-11-02',
      severity: 'low',
      projectId: 4,
    },
  ];

  const getTypeIcon = (type: ServiceNotice['type']) => {
    switch (type) {
      case 'closure':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        );
      case 'delay':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'maintenance':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'alert':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getSeverityStyle = (severity: ServiceNotice['severity']) => {
    switch (severity) {
      case 'high':
        return 'from-red-500/20 to-orange-500/20 border-red-500/40 text-red-300';
      case 'medium':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/40 text-yellow-300';
      case 'low':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/40 text-blue-300';
    }
  };

  return (
    <div className="bg-gradient-to-br from-stellar-navy via-blue-900/50 to-stellar-navy-dark rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Service Notices
      </h3>

      <div className="space-y-3">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className={`bg-gradient-to-r ${getSeverityStyle(notice.severity)} backdrop-blur-md rounded-xl border overflow-hidden transition-all`}
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => setExpanded(expanded === notice.id ? null : notice.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-white/10 rounded-lg">
                    {getTypeIcon(notice.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{notice.title}</h4>
                    <p className="text-sm opacity-90">{notice.location}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(notice.startDate).toLocaleDateString()}
                      {notice.endDate && ` - ${new Date(notice.endDate).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 transition-transform ${expanded === notice.id ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {expanded === notice.id && (
              <div className="px-4 pb-4 border-t border-white/10">
                <p className="text-sm mt-3 leading-relaxed opacity-90">
                  {notice.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
