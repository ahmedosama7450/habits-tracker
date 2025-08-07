import type { Habit, HabitCompletion, AppSettings } from '@/types';
import { defaultSettings } from '@/types';

const HABITS_KEY = 'habits-tracker-habits';
const COMPLETIONS_KEY = 'habits-tracker-completions';
const SETTINGS_KEY = 'habits-tracker-settings';

/**
 * Get habits from local storage
 */
export function getHabits(): Habit[] {
  try {
    const stored = localStorage.getItem(HABITS_KEY);
    if (!stored) {
      // Return sample data for first time users
      const sampleHabits: Habit[] = [
        {
          id: 'sample-1',
          name: 'Drink 8 glasses of water',
          schedule: {
            type: 'weekly',
            weekdays: [ ], // Monday to Friday
          },
          startDate: new Date('2025-07-01'),
        },
        {
          id: 'sample-2',
          name: 'Read for 1 hour',
          schedule: {
            type: 'weekly',
            weekdays: [0, 6], // Sunday and Saturday
          },
          startDate: new Date('2025-07-01'),
        },
      ];
      saveHabits(sampleHabits);
      return sampleHabits;
    }
    
    const habits = JSON.parse(stored) as Habit[];
    // Convert date strings back to Date objects
    return habits.map((habit) => ({
      ...habit,
      startDate: new Date(habit.startDate),
    }));
  } catch (error) {
    console.error('Error loading habits:', error);
    return [];
  }
}

/**
 * Save habits to local storage
 */
export function saveHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error('Error saving habits:', error);
  }
}

/**
 * Get habit completions from local storage
 */
export function getHabitCompletions(): HabitCompletion[] {
  try {
    const stored = localStorage.getItem(COMPLETIONS_KEY);
    if (!stored) {
      // Return sample completions for demonstration
      const sampleCompletions: HabitCompletion[] = [
        { habitId: 'sample-1', date: '2025-07-21', completed: true },
        { habitId: 'sample-1', date: '2025-07-22', completed: true },
        { habitId: 'sample-1', date: '2025-07-23', completed: false },
        { habitId: 'sample-1', date: '2025-07-24', completed: true },
        { habitId: 'sample-2', date: '2025-07-20', completed: true },
        { habitId: 'sample-2', date: '2025-07-21', completed: true },
      ];
      saveHabitCompletions(sampleCompletions);
      return sampleCompletions;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading completions:', error);
    return [];
  }
}

/**
 * Save habit completions to local storage
 */
export function saveHabitCompletions(completions: HabitCompletion[]): void {
  try {
    localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
  } catch (error) {
    console.error('Error saving completions:', error);
  }
}

/**
 * Get app settings from local storage
 */
export function getSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  } catch (error) {
    console.error('Error loading settings:', error);
    return defaultSettings;
  }
}

/**
 * Save app settings to local storage
 */
export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

/**
 * Clear all data from local storage
 */
export function clearAllData(): void {
  try {
    localStorage.removeItem(HABITS_KEY);
    localStorage.removeItem(COMPLETIONS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}
