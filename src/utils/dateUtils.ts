import type { Habit } from '@/types';

/**
 * Get all days in a given month
 */
export function getDaysInMonth(year: number, month: number): Date[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: Date[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }
  
  return days;
}

/**
 * Format date to YYYY-MM-DD string using local time
 */
export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if a habit should be performed on a given date based on its schedule and start date
 */
export function shouldHabitBePerformed(habit: Habit, date: Date): boolean {
  const { schedule, startDate } = habit;
  
  // Check if the date is before the habit's start date
  const habitStartDate = new Date(startDate);
  // Compare dates without time to handle timezone issues
  const habitStartDateOnly = new Date(habitStartDate.getFullYear(), habitStartDate.getMonth(), habitStartDate.getDate());
  const checkDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (checkDateOnly < habitStartDateOnly) {
    return false;
  }
  
  switch (schedule.type) {
    case 'weekly':
      if (!schedule.weekdays) return false;
      return schedule.weekdays.includes(date.getDay());
      
    case 'monthly':
      if (!schedule.monthDays) return false;
      return schedule.monthDays.includes(date.getDate());
      
    default:
      return false;
  }
}

/**
 * Get the current date
 */
export function getCurrentDate(): Date {
  return new Date();
}

/**
 * Check if a habit should be shown for a given month
 * A habit should be shown if its start date is in the current month or before
 */
export function shouldHabitBeShownForMonth(habit: Habit, year: number, month: number): boolean {
  const habitStartDate = new Date(habit.startDate);
  const monthEnd = new Date(year, month + 1, 0); // Last day of the month
  
  // Compare dates without time to handle timezone issues
  const habitStartDateOnly = new Date(habitStartDate.getFullYear(), habitStartDate.getMonth(), habitStartDate.getDate());
  const monthEndOnly = new Date(monthEnd.getFullYear(), monthEnd.getMonth(), monthEnd.getDate());
  
  // Show the habit if it starts in this month or before
  return habitStartDateOnly <= monthEndOnly;
}

/**
 * Check if a date is before the habit's start date
 */
export function isDateBeforeHabitStart(habit: Habit, date: Date): boolean {
  const habitStartDate = new Date(habit.startDate);
  
  // Compare dates without time to handle timezone issues
  const habitStartDateOnly = new Date(habitStartDate.getFullYear(), habitStartDate.getMonth(), habitStartDate.getDate());
  const checkDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  return checkDateOnly < habitStartDateOnly;
}

/**
 * Get month name based on locale
 */
export function getMonthName(date: Date, locale: string = 'en'): string {
  return date.toLocaleDateString(locale, { month: 'long' });
}

/**
 * Get day names for the week
 */
export function getDayNames(locale: string = 'en'): string[] {
  const baseDate = new Date(2025, 0, 5); // A Sunday
  const dayNames: string[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    dayNames.push(date.toLocaleDateString(locale, { weekday: 'long' }));
  }
  
  return dayNames;
}

/**
 * Navigate to previous month
 */
export function getPreviousMonth(currentDate: Date): Date {
  const newDate = new Date(currentDate);
  newDate.setMonth(newDate.getMonth() - 1);
  return newDate;
}

/**
 * Navigate to next month
 */
export function getNextMonth(currentDate: Date): Date {
  const newDate = new Date(currentDate);
  newDate.setMonth(newDate.getMonth() + 1);
  return newDate;
}
