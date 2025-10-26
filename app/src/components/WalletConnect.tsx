import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useWallet, WalletTransaction } from '@/context/WalletContext';

const statusStyles: Record<
  WalletTransaction['status'],
  { badge: string; dot: string; label: string }
> = {
  pending: {
    badge: 'bg-yellow-500/10 text-yellow-200 border-yellow-500/30',
    dot: 'bg-yellow-400',
    label: 'Pending',
  },
  success: {
    badge: 'bg-green-500/10 text-green-200 border-green-500/30',
    dot: 'bg-green-400',
    label: 'Confirmed',
  },
  error: {
    badge: 'bg-red-500/10 text-red-200 border-red-500/30',
    dot: 'bg-red-400',
    label: 'Failed',
  },
};

export default function WalletConnect() {
  const {
    publicKey,
    isWalletConnected,
    isFreighterInstalled,
    connectWallet,
    disconnectWallet,
    error,
    balance,
    refreshBalance,
    transactions,
    toasts,
    pushToast,
    dismissToast,
  } = useWallet();

  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFunding, setIsFunding] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [panelCoords, setPanelCoords] = useState<{ top: number; right: number }>({
    top: 96,
    right: 24,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const updatePanelPosition = () => {
    if (!triggerRef.current || typeof window === 'undefined') return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPanelCoords({
      top: rect.bottom + 12 + window.scrollY,
      right: window.innerWidth - rect.right - 24,
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const dropdownEl = dropdownRef.current;
      const triggerEl = triggerRef.current;
      if (
        dropdownEl &&
        !dropdownEl.contains(target) &&
        triggerEl &&
        !triggerEl.contains(target)
      ) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      updatePanelPosition();
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', updatePanelPosition);
      window.addEventListener('scroll', updatePanelPosition, true);
      refreshBalance();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updatePanelPosition);
      window.removeEventListener('scroll', updatePanelPosition, true);
    };
  }, [showDropdown, refreshBalance]);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (publicKey && typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
      pushToast({ type: 'success', message: 'Address copied to clipboard' });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnect = async () => {
    await connectWallet();
  };

  const handleFriendbotFunding = async () => {
    if (!publicKey) return;
    setIsFunding(true);
    try {
      await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
      );
      pushToast({
        type: 'success',
        message: 'Friendbot funding requested',
        detail: 'Funds should arrive within a few seconds.',
      });
      await refreshBalance();
    } catch (err: any) {
      pushToast({
        type: 'error',
        message: 'Friendbot request failed',
        detail: err?.message || 'Unable to reach Stellar Friendbot',
      });
    } finally {
      setIsFunding(false);
    }
  };

  const formattedBalance = (() => {
    if (!balance) return '--';
    const numeric = Number(balance);
    if (Number.isNaN(numeric)) return balance;
    return numeric.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  })();

  const pendingCount = transactions.filter(
    (tx) => tx.status === 'pending'
  ).length;
  const recentTransactions = transactions.slice(0, 6);

  if (!isWalletConnected) {
    return (
      <div className="relative z-40">
        <button
          onClick={handleConnect}
          className="px-4 py-2 bg-stellar-blue text-white rounded-lg hover:bg-stellar-blue-dark transition flex items-center gap-2 shadow-lg shadow-stellar-blue/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Connect Wallet
        </button>

        {error && (
          <div className="absolute top-full mt-2 right-0 w-64 bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        {!isFreighterInstalled && (
          <div className="absolute top-full mt-2 right-0 w-72 bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 shadow-xl">
            <p className="text-yellow-300 text-sm font-semibold mb-2">
              Freighter Wallet Not Detected
            </p>
            <p className="text-yellow-200 text-xs mb-3">
              Install Freighter to connect your Stellar wallet
            </p>
            <a
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 bg-yellow-500 text-stellar-navy rounded-lg hover:bg-yellow-400 transition text-sm font-semibold"
            >
              Install Freighter
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
          </div>
        )}

        {/* Toasts */}
        <div className="fixed bottom-4 right-4 space-y-3 z-50">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`w-80 rounded-xl border backdrop-blur-md px-4 py-3 shadow-lg ${
                toast.type === 'success'
                  ? 'bg-green-500/10 border-green-400/40 text-green-100'
                  : toast.type === 'error'
                  ? 'bg-red-500/10 border-red-400/40 text-red-100'
                  : 'bg-stellar-blue/20 border-stellar-blue/40 text-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{toast.message}</p>
                  {toast.detail && (
                    <p className="text-xs opacity-80 mt-1 leading-snug">
                      {toast.detail}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="text-xs text-gray-300 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative z-40" ref={dropdownRef}>
        <button
          ref={triggerRef}
          onClick={() => {
            const next = !showDropdown;
            setShowDropdown(next);
            if (next) {
              requestAnimationFrame(() => updatePanelPosition());
            }
          }}
          className="px-4 py-2 bg-gradient-to-r from-green-500/30 to-stellar-blue/30 border border-white/10 text-white rounded-full hover:from-green-500/40 hover:to-stellar-blue/40 transition flex items-center gap-3 shadow-lg backdrop-blur"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-mono font-semibold">
              {truncateAddress(publicKey!)}
            </span>
          </div>
          <svg
            className={`w-4 h-4 transition-transform ${
              showDropdown ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && isMounted &&
          createPortal(
            <>
              <div
                className="fixed inset-0 z-[9997]"
                onClick={() => setShowDropdown(false)}
                aria-hidden="true"
              />
              <div
                ref={dropdownRef}
                style={{ top: panelCoords.top, right: panelCoords.right }}
                className="fixed w-[360px] bg-gradient-to-br from-stellar-navy via-blue-950/80 to-stellar-navy-dark border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-[9998]"
              >
            {/* Header */}
            <div className="bg-gradient-to-r from-stellar-blue/30 via-stellar-blue/10 to-green-500/20 p-5 border-b border-white/10 backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-300 mb-1">Wallet Connected</p>
                  <p className="text-white font-semibold text-lg flex items-center gap-2">
                    {truncateAddress(publicKey!)}
                    <span className="px-2 py-0.5 text-[10px] uppercase tracking-wide rounded-full bg-white/10 text-gray-200 border border-white/20">
                      Active
                    </span>
                  </p>
                  <p className="text-xs text-green-300 mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Stellar Testnet
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-300 uppercase tracking-wide">
                    Balance
                  </p>
                  <p className="text-2xl font-semibold text-white leading-tight">
                    {formattedBalance}
                  </p>
                  <p className="text-xs text-gray-400">
                    XLM available · Pending: {pendingCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Address & actions */}
            <div className="p-5 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                  Your Address
                </p>
                <div className="flex items-center gap-2">
                  <code className="text-white font-mono text-sm bg-black/40 px-3 py-2 rounded-xl flex-1 overflow-hidden text-ellipsis border border-white/10">
                    {publicKey}
                  </code>
                  <button
                    onClick={copyAddress}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded transition-colors shrink-0"
                    title="Copy address"
                  >
                    {copied ? (
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={refreshBalance}
                  className="flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition text-sm text-gray-300 hover:text-white shadow-sm"
                >
                  <span>Refresh Balance</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8 8 0 104.582 9m0 0H9"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleFriendbotFunding}
                  disabled={isFunding}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition text-sm shadow-sm ${
                    isFunding
                      ? 'bg-stellar-blue/20 text-gray-400 border-stellar-blue/30 cursor-not-allowed'
                      : 'bg-gradient-to-r from-stellar-blue/30 to-green-500/20 text-stellar-blue-light border-stellar-blue/40 hover:from-stellar-blue/40 hover:to-green-500/30'
                  }`}
                >
                  <span>Get Test XLM</span>
                  {isFunding ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a1 1 0 000 2h1v11a1 1 0 102 0V5h1a1 1 0 000-2H4z" />
                      <path d="M9 16a1 1 0 001 1h6a1 1 0 100-2h-1V7a1 1 0 10-2 0v8h-3a1 1 0 00-1 1z" />
                    </svg>
                  )}
                </button>
              </div>

              <a
                href={`https://testnet.stellarchain.io/accounts/${publicKey}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors text-gray-300 hover:text-white text-sm border border-white/10 shadow-sm"
              >
                <span>Open in Explorer</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </a>
            </div>

            {/* Transaction feed */}
            <div className="border-t border-white/10 bg-black/20">
              <div className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-semibold flex items-center gap-2">
                    Transaction Feed
                    <span className="flex items-center gap-1 text-xs font-normal text-green-300">
                      <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
                      Live
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Updates whenever you tip, stake, or release funds.
                  </p>
                </div>
                {recentTransactions.length > 0 && (
                  <span className="text-xs text-gray-400">
                    Showing {recentTransactions.length} of {transactions.length}
                  </span>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto px-5 pb-5 space-y-3">
                {recentTransactions.length === 0 ? (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center text-sm text-gray-400">
                    No transactions yet. Tip a project or stake to see updates here.
                  </div>
                ) : (
                  recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${statusStyles[tx.status].dot}`}
                          ></div>
                          <div>
                            <p className="text-sm text-white font-semibold">
                              {tx.type === 'tip' ? 'Tip Sent' : 'Stake Submitted'}
                            </p>
                            <p className="text-xs text-gray-400">
                              {tx.projectName} • {new Date(tx.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-semibold border rounded-lg ${statusStyles[tx.status].badge}`}
                        >
                          {statusStyles[tx.status].label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3 text-sm text-gray-300">
                        <span>
                          {tx.amount} {tx.assetCode}
                        </span>
                        {tx.hash ? (
                          <a
                            href={tx.explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stellar-blue text-xs font-semibold flex items-center gap-1 hover:text-stellar-blue-light"
                          >
                            View on Stellar Expert
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                          </a>
                        ) : (
                          <span className="text-xs text-gray-500">Awaiting confirmation...</span>
                        )}
                      </div>
                      {tx.error && (
                        <p className="text-xs text-red-300 mt-2">{tx.error}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-white/10 bg-black/30">
              <button
                onClick={disconnectWallet}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-2xl transition-colors text-red-300 hover:text-red-200 w-full text-sm font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Disconnect Wallet
              </button>
            </div>
              </div>
            </>,
            document.body
          )
        }
      </div>

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 space-y-3 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`w-80 rounded-xl border backdrop-blur-md px-4 py-3 shadow-lg ${
              toast.type === 'success'
                ? 'bg-green-500/10 border-green-400/40 text-green-100'
                : toast.type === 'error'
                ? 'bg-red-500/10 border-red-400/40 text-red-100'
                : 'bg-stellar-blue/20 border-stellar-blue/40 text-white'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{toast.message}</p>
                {toast.detail && (
                  <p className="text-xs opacity-80 mt-1 leading-snug">
                    {toast.detail}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-xs text-gray-300 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
