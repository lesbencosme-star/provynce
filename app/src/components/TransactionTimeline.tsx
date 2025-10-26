import { useState } from 'react';

interface Transaction {
  id: string;
  type: 'milestone_verified' | 'payment_released' | 'project_created' | 'team_member_added';
  timestamp: string;
  amount?: string;
  milestone?: string;
  verifier?: string;
  txHash: string;
  status: 'confirmed' | 'pending';
}

interface TransactionTimelineProps {
  projectId: number;
  projectName: string;
}

export default function TransactionTimeline({ projectId, projectName }: TransactionTimelineProps) {
  // Mock transaction data - in a real app, this would come from the Stellar blockchain
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'project_created',
      timestamp: '2024-03-01T10:00:00Z',
      txHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
      status: 'confirmed',
    },
    {
      id: '2',
      type: 'team_member_added',
      timestamp: '2024-03-02T14:30:00Z',
      txHash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1',
      status: 'confirmed',
    },
    {
      id: '3',
      type: 'milestone_verified',
      timestamp: '2024-04-15T09:20:00Z',
      milestone: 'Structural Assessment and Engineering Design',
      verifier: 'Dr. Emily Rodriguez',
      txHash: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2',
      status: 'confirmed',
    },
    {
      id: '4',
      type: 'payment_released',
      timestamp: '2024-04-15T10:00:00Z',
      amount: '750000',
      milestone: 'Structural Assessment and Engineering Design',
      txHash: 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3',
      status: 'confirmed',
    },
    {
      id: '5',
      type: 'milestone_verified',
      timestamp: '2024-06-30T11:45:00Z',
      milestone: 'Temporary Support Structure Installation',
      verifier: 'Robert Williams',
      txHash: 'e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4',
      status: 'confirmed',
    },
    {
      id: '6',
      type: 'payment_released',
      timestamp: '2024-06-30T12:15:00Z',
      amount: '1500000',
      milestone: 'Temporary Support Structure Installation',
      txHash: 'f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5',
      status: 'confirmed',
    },
    {
      id: '7',
      type: 'milestone_verified',
      timestamp: '2024-09-15T16:30:00Z',
      milestone: 'Steel Reinforcement and Seismic Upgrades',
      verifier: 'David Park',
      txHash: 'g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
      status: 'confirmed',
    },
    {
      id: '8',
      type: 'payment_released',
      timestamp: '2024-09-15T17:00:00Z',
      amount: '2000000',
      milestone: 'Steel Reinforcement and Seismic Upgrades',
      txHash: 'h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7',
      status: 'confirmed',
    },
  ];

  const transactions = [...mockTransactions].reverse(); // Show newest first

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'project_created':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
        );
      case 'team_member_added':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
        );
      case 'milestone_verified':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'payment_released':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'project_created':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'team_member_added':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'milestone_verified':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'payment_released':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getTypeLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'project_created':
        return 'Project Created';
      case 'team_member_added':
        return 'Team Member Added';
      case 'milestone_verified':
        return 'Milestone Verified';
      case 'payment_released':
        return 'Payment Released';
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  return (
    <div className="bg-gradient-to-br from-stellar-navy via-blue-900/50 to-stellar-navy-dark rounded-2xl p-8 border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-1.5 h-8 bg-gradient-to-b from-stellar-blue to-green-500 rounded-full"></span>
            Transaction Timeline
          </h2>
          <p className="text-gray-400 mt-1">On-chain activity for {projectName}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-stellar-blue/20 rounded-lg border border-stellar-blue/30">
          <div className="w-2 h-2 bg-stellar-blue rounded-full animate-pulse"></div>
          <span className="text-stellar-blue text-sm font-semibold">Stellar Testnet</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4 relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-stellar-blue via-white/20 to-transparent"></div>

        {transactions.map((tx, index) => (
          <div key={tx.id} className="relative pl-16 group">
            {/* Timeline dot */}
            <div
              className={`absolute left-4 top-3 w-4 h-4 rounded-full border-2 ${
                getTypeColor(tx.type)
              } backdrop-blur-md z-10`}
            ></div>

            {/* Transaction card */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all hover:bg-white/10">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${getTypeColor(tx.type)}`}>
                    {getTypeIcon(tx.type)}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{getTypeLabel(tx.type)}</p>
                    <p className="text-gray-400 text-xs">{formatDate(tx.timestamp)}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    tx.status === 'confirmed'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {tx.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
                </span>
              </div>

              {/* Transaction details */}
              <div className="mt-3 space-y-2 text-sm">
                {tx.milestone && (
                  <div className="flex items-start gap-2 text-gray-300">
                    <span className="text-gray-500">Milestone:</span>
                    <span className="flex-1">{tx.milestone}</span>
                  </div>
                )}
                {tx.verifier && (
                  <div className="flex items-start gap-2 text-gray-300">
                    <span className="text-gray-500">Verified by:</span>
                    <span className="flex-1">{tx.verifier}</span>
                  </div>
                )}
                {tx.amount && (
                  <div className="flex items-start gap-2 text-green-400 font-semibold">
                    <span className="text-gray-500">Amount:</span>
                    <span className="flex-1">${parseFloat(tx.amount).toLocaleString()} XLM</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <span className="text-gray-500">TX Hash:</span>
                  <code className="bg-black/20 px-2 py-1 rounded font-mono">
                    {truncateHash(tx.txHash)}
                  </code>
                  <a
                    href={`https://testnet.stellarchain.io/transactions/${tx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-1 text-stellar-blue hover:text-stellar-blue-light transition-colors"
                  >
                    View on Explorer
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View all button */}
      <div className="mt-6 text-center">
        <a
          href={`https://testnet.stellarchain.io/accounts/GCVXQZ7NJMZTLCWVYP4VJRHQXMQD7WPRQK4HZSYMGNLDRQ`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-stellar-blue/20 hover:bg-stellar-blue/30 text-stellar-blue border border-stellar-blue/30 rounded-lg transition-all font-semibold"
        >
          View All Transactions on Stellar
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
