import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteConfig } from '../types';
import { api } from '../utils/api';
import { getLocalizedString as resolveLocalizedString } from '../utils/mapper';

interface SiteContextType {
  config: SiteConfig | null;
  loading: boolean;
  error: string | null;
  locale: string;
  getLocalizedString: (value: Record<string, string> | null | undefined) => string;
}

const DEFAULT_LOCALE = 'en-US';

const SiteContext = createContext<SiteContextType>({
  config: null,
  loading: true,
  error: null,
  locale: DEFAULT_LOCALE,
  getLocalizedString: () => '',
});

const resolveInitialLocale = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }
  return window.localStorage.getItem('locale') || window.navigator.language || DEFAULT_LOCALE;
};

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locale, setLocale] = useState(resolveInitialLocale);

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

  useEffect(() => {
    if (!config?.languages?.length) {
      return;
    }

    const nextLocale = config.languages.includes(locale) ? locale : config.languages[0];
    if (nextLocale !== locale) {
      setLocale(nextLocale);
      return;
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('locale', nextLocale);
    }
  }, [config, locale]);

  const getLocalizedString = (value: Record<string, string> | null | undefined) =>
    resolveLocalizedString(value, locale);

  return (
    <SiteContext.Provider value={{ config, loading, error, locale, getLocalizedString }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
