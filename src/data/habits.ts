import type { Habit, HabitCompletion } from '@/types';

// Mock data for development
export const mockHabits: Habit[] = [
  {
    id: '1',
    name: 'Drink 8 glasses of water',
    schedule: {
      type: 'weekly',
      weekdays: [1, 2, 3, 4, 5], // Monday to Friday
    },
    startDate: new Date('2025-01-01'),
  },
  {
    id: '2',
    name: 'Read for 1 hour',
    schedule: {
      type: 'weekly',
      weekdays: [0, 6], // Sunday and Saturday
    },
    startDate: new Date('2025-01-01'),
  },
  {
    id: '3',
    name: 'Meditate for 15 minutes',
    schedule: {
      type: 'weekly',
      weekdays: [0, 1, 2, 3, 4, 5, 6], // Every day
    },
    startDate: new Date('2025-01-01'),
  },
  {
    id: '4',
    name: 'Take vitamins',
    schedule: {
      type: 'weekly',
      weekdays: [1, 2, 3, 4, 5], // Monday to Friday
    },
    startDate: new Date('2025-01-10'), // Started mid-month
  },
  {
    id: '5',
    name: 'Practice gratitude',
    schedule: {
      type: 'weekly',
      weekdays: [0, 1, 2, 3, 4, 5, 6], // Every day
    },
    startDate: new Date('2025-01-01'),
  },
  {
    id: '6',
    name: 'Learn something new',
    schedule: {
      type: 'weekly',
      weekdays: [1, 3, 5], // Monday, Wednesday, Friday
    },
    startDate: new Date('2025-07-20'), // Started recently to demonstrate future start dates
  },
];

export const mockCompletions: HabitCompletion[] = [
  { habitId: '1', date: '2025-07-21', completed: true },
  { habitId: '1', date: '2025-07-22', completed: true },
  { habitId: '1', date: '2025-07-23', completed: false },
  { habitId: '2', date: '2025-07-20', completed: true },
  { habitId: '2', date: '2025-07-21', completed: true },
];
