import { useTranslation as useI18nTranslation } from 'react-i18next';

export function useTranslation() {
  const { t, i18n } = useI18nTranslation();

  const getWeekday = (day: string): string => {
    return t(`weekdays.${day}`);
  };

  const getMonth = (month: string): string => {
    return t(`months.${month}`);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const getCurrentLanguage = (): 'en' | 'ar' => {
    return i18n.language as 'en' | 'ar';
  };

  const isRTL = (): boolean => {
    return i18n.language === 'ar';
  };

  const getDirection = (): 'ltr' | 'rtl' => {
    return i18n.language === 'ar' ? 'rtl' : 'ltr';
  };

  return { 
    t, 
    i18n, 
    getWeekday, 
    getMonth, 
    changeLanguage, 
    getCurrentLanguage, 
    isRTL, 
    getDirection 
  };
}
