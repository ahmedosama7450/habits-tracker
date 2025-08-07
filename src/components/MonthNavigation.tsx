import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useI18nTranslation';

interface MonthNavigationProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function MonthNavigation({
  currentDate,
  onPreviousMonth,
  onNextMonth,
}: MonthNavigationProps) {
  const { t, getMonth } = useTranslation();

  const monthKey = currentDate.toLocaleDateString('en', { month: 'long' }).toLowerCase();
  const monthName = getMonth(monthKey);
  const year = currentDate.getFullYear();

  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <Button
        variant="outline"
        size="sm"
        onClick={onPreviousMonth}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        {t('previousMonth')}
      </Button>
      
      <h2 className="text-xl font-semibold text-emerald-800 min-w-48 text-center">
        {monthName} {year}
      </h2>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onNextMonth}
        className="flex items-center gap-2"
      >
        {t('nextMonth')}
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
      </Button>
    </div>
  );
}
