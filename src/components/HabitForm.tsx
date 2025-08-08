import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HabitFormContent } from '@/components/HabitFormContent';
import { useTranslation } from '@/hooks/useI18nTranslation';
import type { Habit } from '@/types';

interface HabitFormProps {
  onSubmit: (habit: Omit<Habit, 'id' | 'userId'>) => Promise<void>;
}

export function HabitForm({ onSubmit }: HabitFormProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (habit: Habit) => {
    try {
      // Extract only the fields we need for creating a new habit
      const habitData = {
        name: habit.name,
        schedule: habit.schedule,
        startDate: habit.startDate,
      };
      await onSubmit(habitData);
      setOpen(false);
    } catch (error) {
      console.error('Failed to add habit:', error);
      // You could add error handling here, like showing a toast
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 h-11 sm:h-12 font-medium w-full sm:w-auto max-w-full">
          <Plus className="h-4 w-4 me-2" />
          {t('addHabit')}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-start text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t('addHabit')}
          </DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-start">
            {t('createNewHabitDescription') || 'Create a new habit to track your progress'}
          </p>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          <HabitFormContent
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitButtonText={t('save')}
            mode="create"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
