import { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from '@/hooks/useI18nTranslation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { settings } = useSettings();
  const { changeLanguage, getCurrentLanguage, getDirection } = useTranslation();

  const currentLanguage = getCurrentLanguage();

  // Sync i18n language with settings
  useEffect(() => {
    if (settings.language !== currentLanguage) {
      changeLanguage(settings.language);
    }
  }, [settings.language, currentLanguage, changeLanguage]);

  // Apply direction to document
  useEffect(() => {
    const direction = getDirection();
    document.documentElement.setAttribute('dir', direction);
  }, [getDirection]);

  return <>{children}</>;
}
