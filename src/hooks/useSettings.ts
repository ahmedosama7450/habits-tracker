import { useState, useEffect } from 'react';
import type { AppSettings } from '@/types';
import { settingsApi } from '@/lib/api';
import { defaultSettings } from '@/types';
import { useAuth } from './useAuth';

export function useSettings() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't try to load settings if not authenticated or still loading auth
    if (authLoading || !isAuthenticated) {
      setLoading(false);
      return;
    }

    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedSettings = await settingsApi.getSettings();
        setSettings(fetchedSettings);
      } catch (err) {
        console.error('Error loading settings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load settings');
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [isAuthenticated, authLoading]);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      setError(null);
      const updatedSettings = await settingsApi.updateSettings(newSettings);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      throw err;
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
  };
}
