import { useState, useEffect, useMemo } from 'react';
import type { HabitCompletion } from '@/types';
import { completionsApi } from '@/lib/api';

export function useHabitCompletions(habitIds?: string[]) {
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const habitIdsKey = useMemo(() => habitIds?.join(',') || '', [habitIds]);

  useEffect(() => {
    const loadCompletions = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedCompletions = await completionsApi.getCompletions(habitIds);
        setCompletions(fetchedCompletions);
      } catch (err) {
        console.error('Error loading completions:', err);
        setError(err instanceof Error ? err.message : 'Failed to load completions');
        setCompletions([]);
      } finally {
        setLoading(false);
      }
    };

    loadCompletions();
  }, [habitIdsKey, habitIds]);;

  const toggleCompletion = async (habitId: string, date: string) => {
    try {
      setError(null);
      const existingCompletion = completions.find(
        c => c.habitId === habitId && c.date === date
      );
      
      const newCompleted = !existingCompletion?.completed;
      const updatedCompletion = await completionsApi.updateCompletion(habitId, date, newCompleted);
      
      setCompletions(prev => {
        const existingIndex = prev.findIndex(
          c => c.habitId === habitId && c.date === date
        );
        
        if (existingIndex >= 0) {
          // Update existing completion
          return prev.map((c, i) =>
            i === existingIndex ? updatedCompletion : c
          );
        } else {
          // Add new completion
          return [...prev, updatedCompletion];
        }
      });
      
      return updatedCompletion;
    } catch (err) {
      console.error('Error toggling completion:', err);
      setError(err instanceof Error ? err.message : 'Failed to update completion');
      throw err;
    }
  };

  const getCompletion = (habitId: string, date: string): boolean => {
    const completion = completions.find(
      c => c.habitId === habitId && c.date === date
    );
    return completion?.completed ?? false;
  };

  return {
    completions,
    loading,
    error,
    toggleCompletion,
    getCompletion,
  };
}
