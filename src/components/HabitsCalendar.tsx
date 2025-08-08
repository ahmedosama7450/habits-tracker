import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { HabitEditDialog } from '@/components/HabitEditDialog';
import { HabitForm } from '@/components/HabitForm';
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { shouldHabitBePerformed, formatDateString, getDaysInMonth, shouldHabitBeShownForMonth, isDateBeforeHabitStart } from '@/utils/dateUtils';
import { useTranslation } from '@/hooks/useI18nTranslation';
import type { Habit } from '@/types';

interface HabitsCalendarProps {
  habits: Habit[];
  currentDate: Date;
  getCompletion: (habitId: string, date: string) => boolean;
  toggleCompletion: (habitId: string, date: string) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'userId'>>) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'userId'>) => Promise<void>;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function HabitsCalendar({
  habits,
  currentDate,
  getCompletion,
  toggleCompletion,
  updateHabit,
  deleteHabit,
  addHabit,
  onPreviousMonth,
  onNextMonth,
}: HabitsCalendarProps) {
  const { t, getCurrentLanguage, getMonth } = useTranslation();
  const currentLanguage = getCurrentLanguage(); // Force re-render on language change
  
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  // Add key to force re-render on language change
  const calendarKey = `calendar-${currentLanguage}`;
  
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

  // Filter habits to only show those that should appear in this month
  const visibleHabits = habits.filter(habit => 
    shouldHabitBeShownForMonth(habit, currentDate.getFullYear(), currentDate.getMonth())
  );
  
  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setEditDialogOpen(true);
  };

  const handleDeleteHabit = (habit: Habit) => {
    if (window.confirm(t('confirmDelete'))) {
      deleteHabit(habit.id);
    }
  };

  if (visibleHabits.length === 0) {
    return (
      <div className="space-y-6" key={calendarKey}>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-3 sm:p-6">
            {/* Month Navigation and Add Habit Button */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 pb-6 border-b border-emerald-200">
              <div className="flex items-center justify-between w-full sm:w-auto sm:gap-4 min-w-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPreviousMonth}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3"
                >
                  <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                  {t('previousMonth')}
                </Button>
                
                <h2 className="text-lg sm:text-xl font-semibold text-emerald-800 flex-1 text-center sm:text-left">
                  {(() => {
                    const monthKey = currentDate.toLocaleDateString('en', { month: 'long' }).toLowerCase();
                    const monthName = getMonth(monthKey);
                    const year = currentDate.getFullYear();
                    return `${monthName} ${year}`;
                  })()}
                </h2>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNextMonth}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3"
                >
                  {t('nextMonth')}
                  <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                </Button>
              </div>

              {/* Add Habit Button */}
              <HabitForm onSubmit={addHabit} />
            </div>

            <div className="text-center">
              <p className="text-emerald-800 text-lg">{t('noHabits')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate completion percentage for a habit up to current day
  const calculateCompletionPercentage = (habit: Habit) => {
    if (!isCurrentMonth) {
      // For past/future months, calculate for the entire month
      let totalDays = 0;
      let completedDays = 0;
      
      daysInMonth.forEach(date => {
        if (shouldHabitBePerformed(habit, date)) {
          totalDays++;
          const dateString = formatDateString(date);
          if (getCompletion(habit.id, dateString)) {
            completedDays++;
          }
        }
      });
      
      return totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    } else {
      // For current month, only calculate up to today
      let totalDays = 0;
      let completedDays = 0;
      
      daysInMonth.forEach(date => {
        // Only count days up to today
        if (date <= today && shouldHabitBePerformed(habit, date)) {
          totalDays++;
          const dateString = formatDateString(date);
          if (getCompletion(habit.id, dateString)) {
            completedDays++;
          }
        }
      });
      
      return totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    }
  };

  // Calculate dynamic widths for habits (fit content with max width)
  const getHabitColumnWidth = (habitName: string) => {
    // Base width for padding, percentage badge, and borders
    const baseWidth = 80; // Base width for button padding and badge
    // Character width estimation (approximate)
    const charWidth = 8;
    // Calculate width based on text length, with max constraint only
    const textWidth = Math.min(habitName.length * charWidth, 140);
    return Math.min(baseWidth + textWidth, 200); // Max 200px, no minimum
  };

  const habitWidths = visibleHabits.map(habit => getHabitColumnWidth(habit.name));
  const totalHabitsWidth = habitWidths.reduce((sum, width) => sum + width, 0);

  return (
    <div className="space-y-6" key={calendarKey}>
      {/* Calendar Grid */}
      <Card className="shadow-none border-none">
        <CardContent className="p-3 sm:p-6">
          {/* Month Navigation and Add Habit Button */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 pb-6 border-gray-200">
            <div className="flex items-center justify-between w-full sm:w-auto sm:gap-4 min-w-0">
              <Button
                variant="outline"
                size="sm"
                onClick={onPreviousMonth}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3"
              >
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                {t('previousMonth')}
              </Button>
              
              <h2 className="text-lg sm:text-xl font-semibold text-emerald-800 flex-1 text-center sm:text-left">
                {(() => {
                  const monthKey = currentDate.toLocaleDateString('en', { month: 'long' }).toLowerCase();
                  const monthName = getMonth(monthKey);
                  const year = currentDate.getFullYear();
                  return `${monthName} ${year}`;
                })()}
              </h2>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onNextMonth}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3"
              >
                {t('nextMonth')}
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </div>

            {/* Add Habit Button */}
            <HabitForm onSubmit={addHabit} />
          </div>
          
          {/* Calendar Container using CSS Grid for better RTL control */}
          <div className="grid ltr:grid-cols-[auto_1fr] rtl:grid-cols-[1fr_auto] border border-gray-200 rounded-lg overflow-hidden">
            {/* Fixed Day Column - Grid automatically positions based on column order */}
            <div className="bg-gray-50 border-gray-200 ltr:border-r ltr:order-1 rtl:border-l rtl:order-2">
              {/* Day Header */}
              <div className="h-12 flex items-center justify-center px-4 border-b border-gray-200 bg-emerald-50">
                <div className="font-medium text-emerald-800 text-sm text-start">{t('day')}</div>
              </div>
              
              {/* Day Numbers */}
              <div className="space-y-0">
                  {daysInMonth.map(date => {
                    const dateString = formatDateString(date);
                    const dayNumber = date.getDate();
                    const isToday = formatDateString(new Date()) === dateString;
                    
                    return (
                      <div
                        key={dateString}
                        className={`h-12 flex items-center justify-center px-4 border-b border-gray-100 ${
                          isToday ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {dayNumber}
                      </div>
                    );
                  })}
                </div>
              </div>

            {/* Scrollable Habits Section */}
            <div className="overflow-x-auto ltr:order-2 rtl:order-1">
              {/* Habits Header */}
              <div 
                className="h-12 flex bg-emerald-50 border-b border-gray-200"
                style={{ minWidth: `${totalHabitsWidth}px` }}
              >
                {visibleHabits.map((habit, index) => {
                  const completionPercentage = calculateCompletionPercentage(habit);
                  // Calculate available width for button (total width - badge width - gap)
                  const badgeWidth = 45; // Approximate width of percentage badge
                  const gapWidth = 2; // gap-0.5 = 2px
                  const availableButtonWidth = habitWidths[index] - badgeWidth - gapWidth;
                  
                  return (
                    <div 
                      key={habit.id} 
                      className="flex-shrink-0 flex items-center justify-center ltr:border-e rtl:border-s border-gray-200 ltr:last:border-e-0 rtl:first:border-s-0"
                      style={{ width: `${habitWidths[index]}px` }}
                    >
                      <div className="flex items-center gap-0.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 text-center text-xs font-medium text-emerald-700 hover:bg-emerald-100 px-2 py-1 min-w-0 cursor-pointer"
                              style={{ maxWidth: `${availableButtonWidth}px` }}
                            >
                              <span className="truncate block" title={habit.name}>
                                {habit.name}
                              </span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="center">
                            <DropdownMenuItem onClick={() => handleEditHabit(habit)}>
                              <Edit className="mr-2 h-4 w-4" />
                              {t('edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteHabit(habit)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t('delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <Badge
                          variant={completionPercentage >= 80 ? 'default' : completionPercentage >= 60 ? 'secondary' : 'outline'}
                          className={`text-xs flex-shrink-0 ${
                            completionPercentage >= 80
                              ? 'bg-emerald-600 text-white'
                              : completionPercentage >= 60
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {completionPercentage}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Habits Checkboxes */}
              <div 
                className="space-y-0"
                style={{ minWidth: `${totalHabitsWidth}px` }}
              >
                {daysInMonth.map(date => {
                  const dateString = formatDateString(date);
                  const isToday = formatDateString(new Date()) === dateString;
                  
                  return (
                    <div
                      key={dateString}
                      className={`h-12 flex border-b border-gray-100 ${
                        isToday ? 'bg-emerald-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      {visibleHabits.map((habit, index) => {
                        const shouldPerform = shouldHabitBePerformed(habit, date);
                        const isCompleted = getCompletion(habit.id, dateString);
                        const isFutureDate = date > today;
                        const isBeforeStart = isDateBeforeHabitStart(habit, date);
                        
                        return (
                          <div 
                            key={habit.id} 
                            className="flex-shrink-0 flex items-center justify-center ltr:border-e rtl:border-s border-gray-200 ltr:last:border-e-0 rtl:first:border-s-0"
                            style={{ width: `${habitWidths[index]}px` }}
                          >
                            {shouldPerform && !isBeforeStart && (
                              <Checkbox
                                checked={isCompleted}
                                disabled={isFutureDate}
                                onCheckedChange={() => toggleCompletion(habit.id, dateString)}
                                className="border-2 border-gray-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                              />
                            )}
                            {/* Empty space for days before start date - no visual indicator */}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      {editingHabit && (
        <HabitEditDialog
          habit={editingHabit}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onUpdate={updateHabit}
        />
      )}
    </div>
  );
}