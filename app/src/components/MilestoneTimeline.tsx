import { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { useMetrics } from '@/context/MetricsContext';
import { useWallet } from '@/context/WalletContext';
import TransactionConfirmationModal from '@/components/TransactionConfirmationModal';
import * as StellarSdk from '@stellar/stellar-sdk';

const { TransactionBuilder, Operation, Asset, BASE_FEE, Networks } = StellarSdk;

// Hardcoded contractor wallet address (testnet)
const CONTRACTOR_ADDRESS = 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI';

interface Milestone {
  id: number;
  description: string;
  amount: string;
  verifications_required: number;
  verifications_received: number;
  completed: boolean;
  target_date: string;
  proof_url?: string;
}

interface MilestoneTimelineProps {
  milestones: Milestone[];
}

export default function MilestoneTimeline({
  milestones,
}: MilestoneTimelineProps) {
  const { showSuccess, showInfo, showError, showWarning } = useToast();
  const { incrementCO2, incrementJobs, incrementEnergy } = useMetrics();
  const { isWalletConnected, publicKey } = useWallet();
  const [showTxModal, setShowTxModal] = useState(false);
  const [isReleasing, setIsReleasing] = useState<number | null>(null);
  const [releasedMilestones, setReleasedMilestones] = useState<Record<number, string>>({});
  const [isTesting, setIsTesting] = useState(false);
  const [txDetails, setTxDetails] = useState<{
    hash: string;
    signer: string;
    timestamp: string;
    type: 'milestone_verified' | 'payment_released';
    amount: string;
    milestoneName: string;
  }>({
    hash: '',
    signer: '',
    timestamp: '',
    type: 'milestone_verified',
    amount: '',
    milestoneName: '',
  });

  const testConnection = async () => {
    setIsTesting(true);
    console.log('🔍 Starting connection test...');

    try {
      // Step 1: Check wallet connection
      console.log('Step 1: Checking wallet connection...');
      if (!isWalletConnected || !publicKey) {
        throw new Error('❌ Wallet not connected. Please click "Connect Wallet" in the top navigation.');
      }
      console.log('✅ Wallet connected:', publicKey);

      // Step 2: Check Freighter availability
      console.log('Step 2: Checking Freighter extension...');
      if (!(window as any).freighter) {
        throw new Error('❌ Freighter extension not detected. Please install it from https://www.freighter.app/');
      }
      console.log('✅ Freighter detected');

      // Step 3: Check network
      console.log('Step 3: Checking network...');
      const network = await (window as any).freighter.getNetwork();
      console.log('Current network:', network);
      if (network !== 'TESTNET') {
        throw new Error(`❌ Wrong network: ${network}. Please switch to TESTNET in Freighter settings.`);
      }
      console.log('✅ Network is TESTNET');

      // Step 4: Check account exists on testnet
      console.log('Step 4: Checking account on Stellar Testnet...');
      const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

      try {
        const account = await server.loadAccount(publicKey);
        console.log('✅ Account found on testnet');

        // Step 5: Check balance
        console.log('Step 5: Checking XLM balance...');
        const xlmBalance = account.balances.find((b: any) => b.asset_type === 'native');
        const balance = xlmBalance ? parseFloat(xlmBalance.balance) : 0;
        console.log('XLM Balance:', balance);

        if (balance < 1.5) {
          throw new Error(`⚠️ Insufficient XLM balance: ${balance} XLM. You need at least 1.5 XLM (1 for payment + 0.5 for fees). Fund your account at https://laboratory.stellar.org/#account-creator?network=test`);
        }
        console.log('✅ Sufficient XLM balance:', balance);

        // All checks passed!
        showSuccess(
          <div>
            <p className="font-bold mb-2">✅ All checks passed!</p>
            <ul className="text-xs space-y-1">
              <li>• Wallet: Connected ({publicKey.slice(0, 8)}...)</li>
              <li>• Freighter: Installed</li>
              <li>• Network: TESTNET</li>
              <li>• Balance: {balance.toFixed(2)} XLM</li>
            </ul>
            <p className="mt-2 text-xs">You're ready to release funds!</p>
          </div>,
          8000
        );

      } catch (accountError: any) {
        if (accountError.response?.status === 404) {
          throw new Error(`❌ Account not found on Stellar Testnet. Please fund your account first at https://laboratory.stellar.org/#account-creator?network=test using address: ${publicKey}`);
        }
        throw accountError;
      }

    } catch (error: any) {
      console.error('Connection test failed:', error);
      showError(
        <div>
          <p className="font-bold mb-2">Connection Test Failed</p>
          <p className="text-sm">{error.message}</p>
          {error.message?.includes('install') && (
            <a
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-3 py-1 bg-stellar-blue/20 hover:bg-stellar-blue/30 rounded text-sm font-semibold transition-all"
            >
              Install Freighter →
            </a>
          )}
          {error.message?.includes('Fund your account') && (
            <a
              href="https://laboratory.stellar.org/#account-creator?network=test"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-3 py-1 bg-stellar-blue/20 hover:bg-stellar-blue/30 rounded text-sm font-semibold transition-all"
            >
              Get Testnet XLM →
            </a>
          )}
        </div>,
        10000
      );
    } finally {
      setIsTesting(false);
    }
  };

  const releaseFunds = async (milestone: Milestone) => {
    if (!isWalletConnected || !publicKey) {
      showInfo('Connect your wallet to release funds');
      return;
    }

    setIsReleasing(milestone.id);
    console.log('💰 Starting fund release for milestone:', milestone.description);

    try {
      // Check if Freighter is available
      console.log('Checking Freighter...');
      if (!(window as any).freighter) {
        throw new Error('Freighter wallet not detected. Please install Freighter extension.');
      }
      console.log('✅ Freighter detected');

      // Request network access from Freighter
      console.log('Getting network...');
      const network = await (window as any).freighter.getNetwork();
      console.log('Network:', network);

      if (network !== 'TESTNET') {
        throw new Error('Please switch to Stellar Testnet in Freighter');
      }
      console.log('✅ Network is TESTNET');

      // Initialize Stellar server
      console.log('Initializing Stellar server...');
      const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

      // Load sender account
      console.log('Loading account from Horizon...');
      const sourceAccount = await server.loadAccount(publicKey);
      console.log('✅ Account loaded, sequence:', sourceAccount.sequenceNumber());

      // Check balance
      const xlmBalance = sourceAccount.balances.find((b: any) => b.asset_type === 'native');
      const balance = xlmBalance ? parseFloat(xlmBalance.balance) : 0;
      console.log('Account balance:', balance, 'XLM');

      if (balance < 1.5) {
        throw new Error(`Insufficient balance: ${balance} XLM. You need at least 1.5 XLM. Get testnet XLM at https://laboratory.stellar.org/#account-creator?network=test`);
      }

      // Build transaction - send 1 XLM to contractor
      console.log('Building transaction...');
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination: CONTRACTOR_ADDRESS,
            asset: Asset.native(),
            amount: '1', // 1 XLM
          })
        )
        .addMemo({
          type: 'text',
          value: `Milestone: ${milestone.description.substring(0, 28)}`,
        } as any)
        .setTimeout(180)
        .build();
      console.log('✅ Transaction built');

      // Sign with Freighter
      console.log('Requesting signature from Freighter...');
      const signedXdr = await (window as any).freighter.signTransaction(
        transaction.toXDR(),
        {
          network: 'TESTNET',
          networkPassphrase: Networks.TESTNET,
        }
      );
      console.log('✅ Transaction signed');

      // Submit transaction
      console.log('Submitting transaction to Horizon...');
      const transactionToSubmit = TransactionBuilder.fromXDR(
        signedXdr,
        Networks.TESTNET
      );

      const result = await server.submitTransaction(transactionToSubmit);
      console.log('✅ Transaction submitted successfully!', result.hash);

      // Success! Update state
      setReleasedMilestones(prev => ({
        ...prev,
        [milestone.id]: result.hash,
      }));

      // Update global metrics
      incrementCO2(Math.floor(Math.random() * 500) + 100);
      incrementJobs(Math.floor(Math.random() * 50) + 10);
      incrementEnergy(Math.floor(Math.random() * 200) + 50);

      // Show transaction details
      setTxDetails({
        hash: result.hash,
        signer: publicKey,
        timestamp: new Date().toLocaleString(),
        type: 'payment_released',
        amount: '1 XLM',
        milestoneName: milestone.description,
      });
      setShowTxModal(true);

      // Show success toast with link
      showSuccess(
        <>
          ✅ Funds released on Stellar!{' '}
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${result.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold hover:text-white"
          >
            View on Stellar Expert →
          </a>
        </>
      );

    } catch (error: any) {
      console.error('Transaction failed:', error);

      let errorMessage = 'Transaction failed. ';
      let showRetry = true;

      if (error.message?.includes('Freighter wallet not detected')) {
        errorMessage = error.message;
        showRetry = false;
      } else if (error.message?.includes('User declined access')) {
        errorMessage = 'Transaction cancelled by user.';
        showRetry = false;
      } else if (error.message?.includes('switch to')) {
        errorMessage = error.message;
      } else if (error.response?.data?.extras?.result_codes) {
        const codes = error.response.data.extras.result_codes;
        errorMessage += `Error: ${codes.transaction || codes.operations?.[0] || 'Unknown error'}`;
      } else if (error.message) {
        errorMessage += error.message;
      }

      showError(
        <div>
          <p className="font-semibold mb-2">{errorMessage}</p>
          {showRetry && (
            <button
              onClick={() => releaseFunds(milestone)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm font-semibold transition-all"
            >
              Retry
            </button>
          )}
          {!showRetry && error.message?.includes('Freighter wallet not detected') && (
            <a
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-3 py-1 bg-stellar-blue/20 hover:bg-stellar-blue/30 rounded text-sm font-semibold transition-all"
            >
              Install Freighter →
            </a>
          )}
        </div>
      );
    } finally {
      setIsReleasing(null);
    }
  };
  return (
    <div className="space-y-6">
      {milestones.map((milestone, index) => {
        const isLast = index === milestones.length - 1;
        const verificationsProgress =
          (milestone.verifications_received / milestone.verifications_required) *
          100;

        // Check if milestone is delayed (past target date and not completed)
        const targetDate = new Date(milestone.target_date);
        const today = new Date();
        const isDelayed = !milestone.completed && today > targetDate;

        // Determine status for color coding
        const getStatusColor = () => {
          if (milestone.completed) {
            return {
              bg: 'bg-green-500',
              border: 'border-green-400',
              line: 'bg-green-400',
              text: 'text-green-400',
            };
          } else if (isDelayed) {
            return {
              bg: 'bg-red-500',
              border: 'border-red-400',
              line: 'bg-red-400',
              text: 'text-red-400',
            };
          } else if (milestone.verifications_received > 0) {
            return {
              bg: 'bg-yellow-500',
              border: 'border-yellow-400',
              line: 'bg-yellow-400',
              text: 'text-yellow-400',
            };
          } else {
            return {
              bg: 'bg-gray-600',
              border: 'border-gray-500',
              line: 'bg-gray-600',
              text: 'text-gray-400',
            };
          }
        };

        const statusColor = getStatusColor();

        return (
          <div key={milestone.id} className="relative">
            {/* Timeline Line */}
            {!isLast && (
              <div
                className={`absolute left-6 top-14 w-0.5 h-full ${statusColor.line}`}
              />
            )}

            {/* Milestone Card */}
            <div className="flex gap-4">
              {/* Status Icon */}
              <div className="relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${statusColor.bg} ${statusColor.border} shadow-lg`}
                >
                  {milestone.completed ? (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : isDelayed ? (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <span className="text-white font-bold">{index + 1}</span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-1">
                        {milestone.description}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Target: {new Date(milestone.target_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-stellar-blue font-bold">
                        ${(parseFloat(milestone.amount) / 1_000_000).toFixed(2)}M
                      </p>
                    </div>
                  </div>

                  {/* Verification Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Verifications</span>
                      <span className="text-white">
                        {milestone.verifications_received} /{' '}
                        {milestone.verifications_required}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          milestone.completed
                            ? 'bg-green-400'
                            : 'bg-yellow-400'
                        }`}
                        style={{ width: `${verificationsProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex gap-2 flex-wrap">
                    {milestone.completed && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified & Complete
                      </span>
                    )}
                    {!milestone.completed && isDelayed && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-semibold flex items-center gap-1 animate-pulse">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Delayed
                      </span>
                    )}
                    {!milestone.completed &&
                      !isDelayed &&
                      milestone.verifications_received >=
                        milestone.verifications_required && (
                        <span className="px-2 py-1 bg-stellar-blue/20 text-stellar-blue rounded text-xs font-semibold flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                          </svg>
                          Ready for Payment
                        </span>
                      )}
                    {!milestone.completed &&
                      !isDelayed &&
                      milestone.verifications_received > 0 &&
                      milestone.verifications_received <
                        milestone.verifications_required && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-semibold flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          In Review
                        </span>
                      )}
                    {!milestone.completed &&
                      !isDelayed &&
                      milestone.verifications_received === 0 && (
                        <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs font-semibold flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          </svg>
                          Pending
                        </span>
                      )}
                    {milestone.proof_url && (
                      <a
                        href={milestone.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-stellar-blue/20 text-stellar-blue rounded text-xs font-semibold hover:bg-stellar-blue/30 transition flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        View Proof
                      </a>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {!milestone.completed && (
                    <div className="mt-4 space-y-2">
                      {releasedMilestones[milestone.id] ? (
                        // Show transaction details after successful release
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-green-300 font-semibold text-sm">✅ Funds Released (1 XLM)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-black/30 px-2 py-1 rounded font-mono text-green-300">
                              {releasedMilestones[milestone.id].substring(0, 12)}...
                            </code>
                            <a
                              href={`https://stellar.expert/explorer/testnet/tx/${releasedMilestones[milestone.id]}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-stellar-blue hover:text-stellar-blue-light font-semibold flex items-center gap-1"
                            >
                              View on Stellar Expert
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Test Connection Button */}
                          {isWalletConnected && (
                            <button
                              onClick={testConnection}
                              disabled={isTesting}
                              className={`w-full px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                                isTesting
                                  ? 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
                                  : 'bg-stellar-blue/20 text-stellar-blue border border-stellar-blue/40 hover:bg-stellar-blue/30'
                              }`}
                            >
                              {isTesting ? (
                                <>
                                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"></path>
                                  </svg>
                                  Testing Connection...
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Test Connection
                                </>
                              )}
                            </button>
                          )}

                          {/* Release Funds Button */}
                          <button
                            onClick={() => releaseFunds(milestone)}
                            disabled={!isWalletConnected || isReleasing === milestone.id}
                            className={`w-full px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                              !isWalletConnected || isReleasing === milestone.id
                                ? 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
                                : 'bg-green-500/20 text-green-300 border border-green-500/40 hover:bg-green-500/30'
                            }`}
                          >
                            {isReleasing === milestone.id ? (
                              <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"></path>
                                </svg>
                                Releasing Funds...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Release Funds (1 XLM)
                              </>
                            )}
                          </button>
                        </>
                      )}
                      {!isWalletConnected && (
                        <p className="text-xs text-gray-400 mt-2">
                          Connect your Freighter wallet to release funds
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Transaction Confirmation Modal */}
      <TransactionConfirmationModal
        isOpen={showTxModal}
        onClose={() => setShowTxModal(false)}
        transactionHash={txDetails.hash}
        signer={txDetails.signer}
        timestamp={txDetails.timestamp}
        type={txDetails.type}
        amount={txDetails.amount}
        milestoneName={txDetails.milestoneName}
      />
    </div>
  );
}
