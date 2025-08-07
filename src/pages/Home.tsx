import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { HabitsCalendar } from '@/components/HabitsCalendar';
import { SettingsDialog } from '@/components/SettingsDialog';
import { useHabits } from '@/hooks/useHabits';
import { useHabitCompletions } from '@/hooks/useHabitCompletions';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from '@/hooks/useI18nTranslation';
import { getPreviousMonth, getNextMonth } from '@/utils/dateUtils';
import type { Habit } from '@/types';

export function Home() {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const { habits, loading: habitsLoading, addHabit, updateHabit, deleteHabit, error: habitsError } = useHabits();
  
  const habitIds = useMemo(() => habits.map(h => h.id), [habits]);
  const { getCompletion, toggleCompletion, loading: completionsLoading, error: completionsError } = useHabitCompletions(habitIds);
  const { settings, updateSettings, loading: settingsLoading, error: settingsError } = useSettings();

  const loading = habitsLoading || completionsLoading || settingsLoading;

  const handlePreviousMonth = () => {
    setCurrentDate(getPreviousMonth(currentDate));
  };

  const handleNextMonth = () => {
    setCurrentDate(getNextMonth(currentDate));
  };

  const handleAddHabit = async (habitData: Omit<Habit, 'id' | 'userId'>) => {
    try {
      await addHabit(habitData);
    } catch (error) {
      console.error('Failed to add habit:', error);
    }
  };

  const handleUpdateHabit = async (id: string, updates: Partial<Omit<Habit, 'id' | 'userId'>>) => {
    try {
      await updateHabit(id, updates);
    } catch (error) {
      console.error('Failed to update habit:', error);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      await deleteHabit(habitId);
    } catch (error) {
      console.error('Failed to delete habit:', error);
    }
  };

  const handleToggleCompletion = async (habitId: string, date: string) => {
    try {
      await toggleCompletion(habitId, date);
    } catch (error) {
      console.error('Failed to toggle completion:', error);
    }
  };

  const handleSettingsChange = async (newSettings: Partial<typeof settings>) => {
    try {
      await updateSettings(newSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSettingsClick={() => setSettingsOpen(true)} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Error Messages */}
          {(habitsError || completionsError || settingsError) && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600 text-sm">
                {habitsError || completionsError || settingsError}
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <p className="mt-2 text-gray-600">{t('auth.loading')}</p>
            </div>
          )}

          {/* Habits Calendar */}
          {!loading && (
            <HabitsCalendar
              habits={habits}
              currentDate={currentDate}
              getCompletion={getCompletion}
              toggleCompletion={handleToggleCompletion}
              updateHabit={handleUpdateHabit}
              deleteHabit={handleDeleteHabit}
              addHabit={handleAddHabit}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
            />
          )}
        </div>
      </main>

      {/* Settings Dialog */}
      <SettingsDialog
        settings={settings}
        onSettingsChange={handleSettingsChange}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </div>
  );
}
