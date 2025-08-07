import { useState, useEffect } from 'react';
import type { Habit } from '@/types';
import { habitsApi } from '@/lib/api';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHabits = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedHabits = await habitsApi.getHabits();
        setHabits(fetchedHabits);
      } catch (err) {
        console.error('Error loading habits:', err);
        setError(err instanceof Error ? err.message : 'Failed to load habits');
        setHabits([]);
      } finally {
        setLoading(false);
      }
    };

    loadHabits();
  }, []);

  const addHabit = async (habitData: Omit<Habit, 'id' | 'userId'>) => {
    try {
      setError(null);
      const newHabit = await habitsApi.createHabit(habitData);
      setHabits(prev => [...prev, newHabit]);
      return newHabit;
    } catch (err) {
      console.error('Error adding habit:', err);
      setError(err instanceof Error ? err.message : 'Failed to add habit');
      throw err;
    }
  };

  const updateHabit = async (id: string, updates: Partial<Omit<Habit, 'id' | 'userId'>>) => {
    try {
      setError(null);
      const updatedHabit = await habitsApi.updateHabit(id, updates);
      setHabits(prev => prev.map(habit =>
        habit.id === id ? updatedHabit : habit
      ));
      return updatedHabit;
    } catch (err) {
      console.error('Error updating habit:', err);
      setError(err instanceof Error ? err.message : 'Failed to update habit');
      throw err;
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      setError(null);
      await habitsApi.deleteHabit(habitId);
      setHabits(prev => prev.filter(habit => habit.id !== habitId));
    } catch (err) {
      console.error('Error deleting habit:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete habit');
      throw err;
    }
  };

  return {
    habits,
    loading,
    error,
    addHabit,
    updateHabit,
    deleteHabit,
  };
}
