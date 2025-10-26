import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import {
  buildMilestoneVerificationTransaction,
  signAndSubmitTransaction,
} from '@/utils/stellar';

interface VerifyMilestoneButtonProps {
  milestoneId: number;
  milestoneName: string;
  contractAddress: string;
  onVerificationComplete?: () => void;
}

export default function VerifyMilestoneButton({
  milestoneId,
  milestoneName,
  contractAddress,
  onVerificationComplete,
}: VerifyMilestoneButtonProps) {
  const { publicKey, isWalletConnected } = useWallet();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleVerify = async () => {
    if (!publicKey || !isWalletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setIsVerifying(true);
    setError(null);
    setSuccess(false);

    try {
      // Build the verification transaction
      const xdr = await buildMilestoneVerificationTransaction(
        publicKey,
        contractAddress,
        milestoneId
      );

      // Sign and submit the transaction
      const result = await signAndSubmitTransaction(xdr);

      console.log('Verification transaction submitted:', result);

      setSuccess(true);

      // Call the callback if provided
      if (onVerificationComplete) {
        onVerificationComplete();
      }

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message || 'Failed to verify milestone');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isWalletConnected) {
    return (
      <div className="text-gray-400 text-sm">
        Connect your wallet to verify milestones
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleVerify}
        disabled={isVerifying || success}
        className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
          success
            ? 'bg-green-500/20 text-green-400 border border-green-500/50 cursor-not-allowed'
            : isVerifying
            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 cursor-wait'
            : 'bg-stellar-blue/20 text-stellar-blue border border-stellar-blue/50 hover:bg-stellar-blue/30'
        }`}
      >
        {isVerifying ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Verifying...
          </>
        ) : success ? (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Verified!
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Verify Milestone
          </>
        )}
      </button>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold">Verification Failed</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-green-300 text-sm">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold">Milestone Verified!</p>
              <p className="text-xs mt-1">
                Transaction submitted to Stellar network for "{milestoneName}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
