import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Modal = dynamic(() => import('@/components/Modal'), { ssr: false });

interface TransactionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionHash: string;
  signer: string;
  timestamp: string;
  type: 'proof_submitted' | 'milestone_verified' | 'payment_released' | 'tip' | 'stake';
  amount?: string;
  projectName?: string;
  milestoneName?: string;
}

export default function TransactionConfirmationModal({
  isOpen,
  onClose,
  transactionHash,
  signer,
  timestamp,
  type,
  amount,
  projectName,
  milestoneName,
}: TransactionConfirmationModalProps) {
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowCheckmark(true);
    } else {
      setShowCheckmark(false);
    }
  }, [isOpen]);

  const getTitle = () => {
    switch (type) {
      case 'proof_submitted':
        return 'Proof Submitted Successfully';
      case 'milestone_verified':
        return 'Milestone Verified';
      case 'payment_released':
        return 'Funds Released on Stellar';
      case 'tip':
        return 'Tip Sent Successfully';
      case 'stake':
        return 'Stake Confirmed';
      default:
        return 'Transaction Confirmed';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'proof_submitted':
        return 'Your proof has been submitted to the Stellar blockchain and is awaiting verification.';
      case 'milestone_verified':
        return 'The milestone has been verified and recorded on the Stellar blockchain.';
      case 'payment_released':
        return 'Payment has been released and is now available on the Stellar network.';
      case 'tip':
        return 'Your tip has been sent to the project escrow address.';
      case 'stake':
        return 'Your stake has been recorded and you can now participate in milestone verification.';
      default:
        return 'Your transaction has been confirmed on the Stellar blockchain.';
    }
  };

  const getIcon = () => {
    if (type === 'payment_released') {
      return (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }

    return (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
    >
      <div className="text-center">
        {/* Animated checkmark or icon */}
        <div className="flex justify-center mb-6">
          <div
            className={`text-green-400 transition-all duration-500 ${
              showCheckmark ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
            style={{
              animation: showCheckmark ? 'checkmark-pop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none',
            }}
          >
            {getIcon()}
          </div>
        </div>

        <p className="text-gray-300 mb-6">{getDescription()}</p>

        {/* Transaction Details */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 space-y-3 text-left">
          {projectName && (
            <div className="flex justify-between items-start">
              <span className="text-gray-400 text-sm">Project</span>
              <span className="text-white font-semibold text-sm text-right">{projectName}</span>
            </div>
          )}

          {milestoneName && (
            <div className="flex justify-between items-start">
              <span className="text-gray-400 text-sm">Milestone</span>
              <span className="text-white font-semibold text-sm text-right">{milestoneName}</span>
            </div>
          )}

          {amount && (
            <div className="flex justify-between items-start">
              <span className="text-gray-400 text-sm">Amount</span>
              <span className="text-green-400 font-bold text-sm">{amount}</span>
            </div>
          )}

          <div className="flex justify-between items-start">
            <span className="text-gray-400 text-sm">Transaction Hash</span>
            <a
              href={`https://testnet.stellarchain.io/transactions/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stellar-blue hover:text-stellar-blue-light text-xs font-mono flex items-center gap-1 group"
            >
              {transactionHash.slice(0, 8)}...{transactionHash.slice(-8)}
              <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-gray-400 text-sm">Signer</span>
            <span className="text-white text-xs font-mono">
              {signer.slice(0, 6)}...{signer.slice(-6)}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-gray-400 text-sm">Timestamp</span>
            <span className="text-white text-xs">{timestamp}</span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-gray-400 text-sm">Network</span>
            <span className="text-stellar-blue text-xs font-semibold">Stellar Testnet</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex gap-3">
          <a
            href={`https://testnet.stellarchain.io/transactions/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 bg-stellar-blue hover:bg-stellar-blue-dark text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
            View on Explorer
          </a>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-semibold transition-all border border-white/10"
          >
            Close
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes checkmark-pop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </Modal>
  );
}
