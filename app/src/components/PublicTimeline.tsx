export default function PublicTimeline() {
  // Mock recent activity data with mixed types including service notices
  const activities = [
    {
      id: 1,
      type: 'service_notice',
      project: 'Washington Bridge',
      description: 'Lane closure on I-195 - detour via Route 44',
      timestamp: '1 hour ago',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
    },
    {
      id: 2,
      type: 'milestone_verified',
      project: 'Washington Bridge',
      description: 'Steel Reinforcement milestone verified in Providence',
      timestamp: '2 hours ago',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    },
    {
      id: 3,
      type: 'service_notice',
      project: 'Metro Line 4 (Cambridge)',
      description: 'Weekend service reduced - buses available',
      timestamp: '4 hours ago',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    },
    {
      id: 4,
      type: 'payment_released',
      project: 'Metro Line 4 (Cambridge)',
      description: '$3M payment released for Station Construction',
      timestamp: '5 hours ago',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: 'from-stellar-blue/20 to-blue-500/20 border-stellar-blue/30',
    },
    {
      id: 5,
      type: 'service_notice',
      project: 'Smart Water Distribution (Warwick)',
      description: 'Brief water pressure fluctuation expected',
      timestamp: '6 hours ago',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
    },
    {
      id: 6,
      type: 'project_funded',
      project: 'Smart Water Distribution (Warwick)',
      description: 'Community member staked 50 PROV tokens',
      timestamp: '8 hours ago',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-stellar-navy/50 via-blue-900/30 to-stellar-navy/50 rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Live Activity
        </h3>
        <span className="text-xs text-gray-400">Last 24 hours</span>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`bg-gradient-to-r ${activity.color} backdrop-blur-md rounded-xl p-4 border hover:border-white/20 transition-all cursor-pointer`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/10 rounded-lg text-white shrink-0">
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{activity.project}</p>
                <p className="text-gray-300 text-xs mt-0.5">{activity.description}</p>
                <p className="text-gray-500 text-xs mt-1">{activity.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
