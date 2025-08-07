import React, { useEffect } from 'react';
import { useTranslation } from '@/hooks/useI18nTranslation';

interface DirectionProviderProps {
  children: React.ReactNode;
}

export function DirectionProvider({ children }: DirectionProviderProps) {
  const { getDirection } = useTranslation();
  const direction = getDirection();
  
  // Apply direction to document
  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.className = direction === 'rtl' ? 'rtl' : 'ltr';
  }, [direction]);
  
  return (
    <div dir={direction} className={direction}>
      {children}
    </div>
  );
}
