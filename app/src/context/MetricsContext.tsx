import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface GlobalMetrics {
  co2Saved: number;
  waterTreated: number;
  jobsCreated: number;
  energyGenerated: number;
}

interface MetricsContextType {
  metrics: GlobalMetrics;
  updateMetrics: (updates: Partial<GlobalMetrics>) => void;
  incrementCO2: (amount: number) => void;
  incrementWater: (amount: number) => void;
  incrementJobs: (amount: number) => void;
  incrementEnergy: (amount: number) => void;
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

const STORAGE_KEY = 'provynce_global_metrics';

const DEFAULT_METRICS: GlobalMetrics = {
  co2Saved: 12500,
  waterTreated: 425,
  jobsCreated: 1847,
  energyGenerated: 8500,
};

export function MetricsProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<GlobalMetrics>(DEFAULT_METRICS);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setMetrics(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse metrics:', e);
        }
      }
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
    }
  }, [metrics]);

  const updateMetrics = useCallback((updates: Partial<GlobalMetrics>) => {
    setMetrics((prev) => ({ ...prev, ...updates }));
  }, []);

  const incrementCO2 = useCallback((amount: number) => {
    setMetrics((prev) => ({ ...prev, co2Saved: prev.co2Saved + amount }));
  }, []);

  const incrementWater = useCallback((amount: number) => {
    setMetrics((prev) => ({ ...prev, waterTreated: prev.waterTreated + amount }));
  }, []);

  const incrementJobs = useCallback((amount: number) => {
    setMetrics((prev) => ({ ...prev, jobsCreated: prev.jobsCreated + amount }));
  }, []);

  const incrementEnergy = useCallback((amount: number) => {
    setMetrics((prev) => ({ ...prev, energyGenerated: prev.energyGenerated + amount }));
  }, []);

  const value: MetricsContextType = {
    metrics,
    updateMetrics,
    incrementCO2,
    incrementWater,
    incrementJobs,
    incrementEnergy,
  };

  return <MetricsContext.Provider value={value}>{children}</MetricsContext.Provider>;
}

export function useMetrics() {
  const context = useContext(MetricsContext);
  if (context === undefined) {
    throw new Error('useMetrics must be used within a MetricsProvider');
  }
  return context;
}
