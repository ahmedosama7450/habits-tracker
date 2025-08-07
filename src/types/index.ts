export interface Habit {
  id: string;
  name: string;
  schedule: HabitSchedule;
  startDate: Date;
  userId?: string; // Added for database integration
}

export interface HabitSchedule {
  type: 'weekly' | 'monthly';
  // For weekly: array of day indices (0 = Sunday, 1 = Monday, etc. - displayed starting from Saturday)
  weekdays?: number[];
  // For monthly: array of day numbers (1-31)
  monthDays?: number[];
}

export interface HabitCompletion {
  id?: string; // Added for database integration
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  userId?: string; // Added for database integration
}

export interface AppSettings {
  language: 'en' | 'ar';
  firstTrackingMonth: string; // YYYY-MM format
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

export const defaultSettings: AppSettings = {
  language: 'ar',
  firstTrackingMonth: new Date().toISOString().slice(0, 7), // Current month
};
