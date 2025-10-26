import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { isConnected, getAddress, requestAccess } from '@stellar/freighter-api';
import {
  signAndSubmitTransaction,
  buildPaymentTransaction,
  buildAssetPaymentTransaction,
  getAccountBalance,
} from '@/utils/stellar';
import { getExplorerUrl, TOKENS } from '@/lib/config';

type AssetCode = 'XLM' | 'PROV' | string;
type WalletTransactionType = 'tip' | 'stake';
type WalletTransactionStatus = 'pending' | 'success' | 'error';

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  projectId?: number;
  projectName?: string;
  amount: string;
  assetCode: AssetCode;
  memo?: string;
  hash?: string;
  explorerUrl?: string;
  status: WalletTransactionStatus;
  timestamp: string;
  message?: string;
  error?: string;
}

export interface WalletToast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  detail?: string;
  duration?: number;
}

interface TipParams {
  projectId: number;
  projectName: string;
  destination: string;
  amount: string;
  assetCode: AssetCode;
}

interface StakeParams {
  projectId: number;
  projectName: string;
  destination: string;
  amount?: string;
}

interface WalletContextType {
  publicKey: string | null;
  isWalletConnected: boolean;
  isFreighterInstalled: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  error: string | null;
  balance: string | null;
  refreshBalance: () => Promise<void>;
  transactions: WalletTransaction[];
  toasts: WalletToast[];
  pushToast: (toast: Omit<WalletToast, 'id'>) => string;
  dismissToast: (id: string) => void;
  tipProject: (
    params: TipParams
  ) => Promise<{ success: boolean; hash?: string; error?: string }>;
  stakeForProject: (
    params: StakeParams
  ) => Promise<{ success: boolean; hash?: string; error?: string }>;
  stakingStatus: Record<number, boolean>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const TX_STORAGE_KEY = (publicKey: string) =>
  `cityworks:wallet:tx:${publicKey}`;
const STAKE_STORAGE_KEY = (publicKey: string) =>
  `cityworks:wallet:stake:${publicKey}`;

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function WalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isFreighterInstalled, setIsFreighterInstalled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [stakingStatus, setStakingStatus] = useState<Record<number, boolean>>(
    {}
  );
  const [toasts, setToasts] = useState<WalletToast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: Omit<WalletToast, 'id'>) => {
      const id = generateId();
      const entry: WalletToast = { id, ...toast };
      setToasts((prev) => [...prev, entry]);

      const duration = toast.duration ?? 4500;
      if (duration > 0) {
        setTimeout(() => dismissToast(id), duration);
      }

      return id;
    },
    [dismissToast]
  );

  const refreshBalance = useCallback(async () => {
    if (!publicKey) {
      setBalance(null);
      return;
    }

    try {
      const accountBalance = await getAccountBalance(publicKey);
      setBalance(accountBalance);
    } catch (err) {
      console.error('Error refreshing balance:', err);
    }
  }, [publicKey]);

  const loadPersistedState = useCallback(
    (key: string) => {
      if (typeof window === 'undefined' || !publicKey) {
        return null;
      }

      try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (err) {
        console.warn('Failed to parse stored wallet state', err);
        return null;
      }
    },
    [publicKey]
  );

  const persistState = useCallback(
    (key: string, value: unknown) => {
      if (typeof window === 'undefined' || !publicKey) {
        return;
      }

      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        console.warn('Failed to persist wallet state', err);
      }
    },
    [publicKey]
  );

  // Check if Freighter is installed on mount
  useEffect(() => {
    const checkFreighter = async () => {
      try {
        const connectionStatus = await isConnected();
        const installed = Boolean(connectionStatus.isConnected);
        setIsFreighterInstalled(installed);

        if (installed) {
          const addressResult = await getAddress();
          if (!addressResult.error && addressResult.address) {
            setPublicKey(addressResult.address);
            setIsWalletConnected(true);
          } else {
            console.log('Wallet not yet authorized');
          }
        }
      } catch (err) {
        console.error('Error checking Freighter:', err);
        setIsFreighterInstalled(false);
      }
    };

    checkFreighter();
  }, []);

  // Initialize persisted state when wallet changes
  useEffect(() => {
    if (!publicKey) {
      setTransactions([]);
      setStakingStatus({});
      setBalance(null);
      return;
    }

    const storedTransactions = loadPersistedState(TX_STORAGE_KEY(publicKey));
    if (storedTransactions) {
      setTransactions(storedTransactions as WalletTransaction[]);
    } else {
      setTransactions([]);
    }

    const storedStakes = loadPersistedState(STAKE_STORAGE_KEY(publicKey));
    if (storedStakes) {
      setStakingStatus(storedStakes as Record<number, boolean>);
    } else {
      setStakingStatus({});
    }

    refreshBalance();
  }, [publicKey, loadPersistedState, refreshBalance]);

  // Persist transactions when they change
  useEffect(() => {
    if (!publicKey) return;
    persistState(TX_STORAGE_KEY(publicKey), transactions);
  }, [transactions, persistState, publicKey]);

  // Persist staking state
  useEffect(() => {
    if (!publicKey) return;
    persistState(STAKE_STORAGE_KEY(publicKey), stakingStatus);
  }, [stakingStatus, persistState, publicKey]);

  const connectWallet = async () => {
    setError(null);

    try {
      // Check if Freighter is installed
      const connectionStatus = await isConnected();
      const installed = Boolean(connectionStatus.isConnected);

      if (!installed) {
        setError(
          'Freighter wallet is not installed. Please install it from freighter.app'
        );
        if (typeof window !== 'undefined') {
          window.open('https://www.freighter.app/', '_blank');
        }
        return;
      }

      // Request access to user's wallet
      const accessObj = await requestAccess();

      if (accessObj.error) {
        setError(
          `Failed to connect wallet: ${
            accessObj.error.message ?? accessObj.error.code ?? ''
          }`
        );
        return;
      }

      // Get the public key
      const addressResult = await getAddress();

      if (addressResult.error || !addressResult.address) {
        const message =
          addressResult.error?.message || 'Failed to retrieve wallet address';
        setError(message);
        setIsWalletConnected(false);
        setPublicKey(null);
        pushToast({ type: 'error', message });
        return;
      }

      setPublicKey(addressResult.address);
      setIsWalletConnected(true);
      pushToast({
        type: 'success',
        message: 'Freighter wallet connected',
      });

      // Store connection in localStorage for persistence (per wallet)
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          `walletConnected:${addressResult.address}`,
          'true'
        );
      }
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      const message = err?.message || 'Failed to connect wallet';
      setError(message);
      setIsWalletConnected(false);
      setPublicKey(null);
      pushToast({ type: 'error', message });
    }
  };

  const disconnectWallet = () => {
    if (publicKey && typeof window !== 'undefined') {
      localStorage.removeItem(`walletConnected:${publicKey}`);
    }

    setPublicKey(null);
    setIsWalletConnected(false);
    setTransactions([]);
    setStakingStatus({});
    setBalance(null);

    // Note: Freighter doesn't have a disconnect method
    // We just clear our local state
  };

  const sendProjectTransaction = useCallback(
    async (
      kind: WalletTransactionType,
      {
        projectId,
        projectName,
        destination,
        amount,
        assetCode,
        memo,
      }: {
        projectId: number;
        projectName: string;
        destination: string;
        amount: string;
        assetCode: AssetCode;
        memo: string;
      }
    ): Promise<{ success: boolean; hash?: string; error?: string }> => {
      if (!publicKey) {
        const message = 'Connect your Freighter wallet to continue';
        pushToast({ type: 'error', message });
        return { success: false, error: message };
      }

      const transactionId = generateId();
      const timestamp = new Date().toISOString();

      const pendingEntry: WalletTransaction = {
        id: transactionId,
        type: kind,
        projectId,
        projectName,
        amount,
        assetCode,
        status: 'pending',
        timestamp,
        memo,
        message:
          kind === 'tip'
            ? `Tipping ${projectName}`
            : `Staking for ${projectName}`,
      };

      setTransactions((prev) => [pendingEntry, ...prev]);

      try {
        let xdr: string;

        if (assetCode === 'XLM') {
          xdr = await buildPaymentTransaction(
            publicKey,
            destination,
            amount,
            memo
          );
        } else {
          const asset =
            assetCode === 'PROV'
              ? { code: TOKENS.PROV.code, issuer: TOKENS.PROV.issuer }
              : { code: assetCode, issuer: TOKENS.PROV.issuer };

          xdr = await buildAssetPaymentTransaction(
            publicKey,
            destination,
            amount,
            asset.code,
            asset.issuer,
            memo
          );
        }

        const result = await signAndSubmitTransaction(xdr);
        const explorerUrl = getExplorerUrl(`/tx/${result.hash}`);

        setTransactions((prev) =>
          prev.map((tx) =>
            tx.id === transactionId
              ? {
                  ...tx,
                  status: 'success',
                  hash: result.hash,
                  explorerUrl,
                  message:
                    kind === 'tip'
                      ? `Sent ${amount} ${assetCode} to ${projectName}`
                      : `Staked ${amount} ${assetCode} for ${projectName}`,
                }
              : tx
          )
        );

        pushToast({
          type: 'success',
          message:
            kind === 'tip'
              ? `Tip sent to ${projectName}`
              : `Stake submitted for ${projectName}`,
        });

        refreshBalance();
        return { success: true, hash: result.hash };
      } catch (err: any) {
        console.error('Transaction failed:', err);
        const message =
          err?.response?.data?.extras?.result_codes?.operations?.[0] ||
          err?.message ||
          'Transaction failed';

        setTransactions((prev) =>
          prev.map((tx) =>
            tx.id === transactionId
              ? {
                  ...tx,
                  status: 'error',
                  error: message,
                  message:
                    kind === 'tip'
                      ? `Tip failed for ${projectName}`
                      : `Stake failed for ${projectName}`,
                }
              : tx
          )
        );

        pushToast({
          type: 'error',
          message:
            kind === 'tip'
              ? 'Unable to send tip'
              : 'Unable to complete stake',
          detail: message,
        });

        return { success: false, error: message };
      }
    },
    [publicKey, pushToast, refreshBalance]
  );

  const tipProject = useCallback(
    async ({
      projectId,
      projectName,
      destination,
      amount,
      assetCode,
    }: TipParams) => {
      const memo = `TIP_PROJECT_${projectId}`;
      return sendProjectTransaction('tip', {
        projectId,
        projectName,
        destination,
        amount,
        assetCode,
        memo,
      });
    },
    [sendProjectTransaction]
  );

  const stakeForProject = useCallback(
    async ({
      projectId,
      projectName,
      destination,
      amount = '5',
    }: StakeParams) => {
      if (stakingStatus[projectId]) {
        return {
          success: false,
          error: 'Already staked for this project',
        };
      }

      const memo = `STAKE_PROJECT_${projectId}`;
      const result = await sendProjectTransaction('stake', {
        projectId,
        projectName,
        destination,
        amount,
        assetCode: 'PROV',
        memo,
      });

      if (result.success) {
        setStakingStatus((prev) => ({
          ...prev,
          [projectId]: true,
        }));
      }

      return result;
    },
    [sendProjectTransaction, stakingStatus]
  );

  const value: WalletContextType = {
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
    tipProject,
    stakeForProject,
    stakingStatus,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
