import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { SiteConfig } from '../types';

interface SiteContextType {
  config: SiteConfig | null;
  loading: boolean;
  error: string | null;
}

const SiteContext = createContext<SiteContextType>({
  config: null,
  loading: true,
  error: null,
});

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await api.get<SiteConfig>('/public/config');
        setConfig(response.data);
      } catch (err: any) {
        console.error('Failed to load site config:', err);
        setError(err.message || 'Failed to load site configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return (
    <SiteContext.Provider value={{ config, loading, error }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
