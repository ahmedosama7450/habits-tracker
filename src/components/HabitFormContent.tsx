import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from '@/hooks/useI18nTranslation';
import type { Habit, HabitSchedule } from '@/types';

interface FormData {
  name: string;
  scheduleType: 'weekly' | 'monthly';
  weekdays: number[];
  startDate: string;
  monthDays: number[];
}

interface HabitFormContentProps {
  habit?: Habit; // Optional for create mode
  onSubmit: (habit: Habit) => void;
  onCancel: () => void;
  submitButtonText: string;
  mode: 'create' | 'edit';
}

export function HabitFormContent({ 
  habit, 
  onSubmit, 
  onCancel, 
  submitButtonText, 
  mode 
}: HabitFormContentProps) {
  const [scheduleType, setScheduleType] = useState<'weekly' | 'monthly'>('weekly');
  const { t, getWeekday } = useTranslation();
  
  const { register, handleSubmit, reset, watch, setValue } = useForm<FormData>({
    defaultValues: {
      name: '',
      scheduleType: 'weekly',
      weekdays: [],
      startDate: new Date().toISOString().slice(0, 10),
      monthDays: [],
    },
  });

  const watchedWeekdays = watch('weekdays') || [];
  const watchedMonthDays = watch('monthDays') || [];

  // Reset form when habit changes (for edit mode)
  useEffect(() => {
    if (habit && mode === 'edit') {
      const schedule = habit.schedule;
      const type = schedule.type as 'weekly' | 'monthly';
      
      // Only allow weekly and monthly types
      if (type === 'weekly' || type === 'monthly') {
        setScheduleType(type);
        reset({
          name: habit.name,
          scheduleType: type,
          weekdays: schedule.weekdays || [],
          startDate: habit.startDate.toISOString().slice(0, 10),
          monthDays: schedule.monthDays || [],
        });
      } else {
        // If habit has custom type, default to weekly
        setScheduleType('weekly');
        reset({
          name: habit.name,
          scheduleType: 'weekly',
          weekdays: [],
          startDate: habit.startDate.toISOString().slice(0, 10),
          monthDays: [],
        });
      }
    }
  }, [habit, mode, reset]);

  const handleWeekdayChange = (dayIndex: number, checked: boolean) => {
    const current = watchedWeekdays || [];
    if (checked) {
      setValue('weekdays', [...current, dayIndex]);
    } else {
      setValue('weekdays', current.filter(day => day !== dayIndex));
    }
  };

  const handleMonthDayChange = (day: number, checked: boolean) => {
    const current = watchedMonthDays || [];
    if (checked) {
      setValue('monthDays', [...current, day]);
    } else {
      setValue('monthDays', current.filter(d => d !== day));
    }
  };

  const onFormSubmit = (data: FormData) => {
    let schedule: HabitSchedule;

    switch (data.scheduleType) {
      case 'weekly':
        schedule = {
          type: 'weekly',
          weekdays: data.weekdays.length > 0 ? data.weekdays : [ ], // Default to weekdays
        };
        break;
      case 'monthly':
        schedule = {
          type: 'monthly',
          monthDays: data.monthDays.length > 0 ? data.monthDays : [], // Default to first day
        };
        break;
    }

    const resultHabit: Habit = mode === 'edit' && habit
      ? {
          ...habit,
          name: data.name,
          schedule,
          startDate: new Date(data.startDate),
        }
      : {
          id: Date.now().toString(),
          name: data.name,
          schedule,
          startDate: new Date(data.startDate),
        };

    onSubmit(resultHabit);
  };

  const weekdays = [
    { index: 6, key: 'saturday' },
    { index: 0, key: 'sunday' },
    { index: 1, key: 'monday' },
    { index: 2, key: 'tuesday' },
    { index: 3, key: 'wednesday' },
    { index: 4, key: 'thursday' },
    { index: 5, key: 'friday' },
  ] as const;

  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 py-2">
      {/* Habit Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-start block font-medium">
          {t('habitName')}
        </Label>
        <Input
          id="name"
          {...register('name', { required: true })}
          placeholder={t('enterHabitName')}
          className="text-start"
        />
      </div>

      {/* Schedule Type */}
      <div className="space-y-2">
        <Label className="text-start block font-medium">
          {t('scheduleType')}
        </Label>
        <Select
          value={scheduleType}
          onValueChange={(value: 'weekly' | 'monthly') => {
            setScheduleType(value);
            setValue('scheduleType', value);
          }}
        >
          <SelectTrigger className="text-start">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">{t('weekly')}</SelectItem>
            <SelectItem value="monthly">{t('monthly')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Weekly Schedule */}
      {scheduleType === 'weekly' && (
        <div className="space-y-3">
          <Label className="text-start block font-medium">
            {t('selectDays')}
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {weekdays.map(({ index, key }) => (
              <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id={`weekday-${index}`}
                  checked={watchedWeekdays.includes(index)}
                  onCheckedChange={(checked) => handleWeekdayChange(index, !!checked)}
                  className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
                <Label htmlFor={`weekday-${index}`} className="text-sm text-start cursor-pointer">
                  {getWeekday(key)}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Schedule */}
      {scheduleType === 'monthly' && (
        <div className="space-y-3">
          <Label className="text-start block font-medium">
            {t('selectDaysOfMonth')}
          </Label>
          <div className="grid grid-cols-7 gap-2 max-h-40 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-900 rounded border">
            {monthDays.map(day => (
              <div key={day} className="flex flex-col items-center">
                <Checkbox
                  id={`monthday-${day}`}
                  checked={watchedMonthDays.includes(day)}
                  onCheckedChange={(checked) => handleMonthDayChange(day, !!checked)}
                  className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
                <Label 
                  htmlFor={`monthday-${day}`} 
                  className="text-xs mt-1 cursor-pointer"
                >
                  {day}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Start Date */}
      <div className="space-y-2">
        <Label htmlFor="startDate" className="text-start block font-medium">
          {t('startDate')}
        </Label>
        <Input
          id="startDate"
          type="date"
          {...register('startDate', { required: true })}
          className="text-start"
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          {t('cancel')}
        </Button>
        <Button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
}
