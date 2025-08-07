import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HabitFormContent } from '@/components/HabitFormContent';
import { useTranslation } from '@/hooks/useI18nTranslation';
import type { Habit } from '@/types';

interface HabitEditDialogProps {
  habit: Habit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<Omit<Habit, 'id' | 'userId'>>) => Promise<void>;
}

export function HabitEditDialog({ habit, open, onOpenChange, onUpdate }: HabitEditDialogProps) {
  const { t } = useTranslation();

  const handleSubmit = async (updatedHabit: Habit) => {
    try {
      await onUpdate(habit.id, {
        name: updatedHabit.name,
        schedule: updatedHabit.schedule,
        startDate: updatedHabit.startDate,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update habit:', error);
      // You could add error handling here, like showing a toast
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-start text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t('editHabit')}
          </DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-start">
            {t('editingHabit') || 'Editing'}: <span className="font-medium">"{habit.name}"</span>
          </p>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          <HabitFormContent
            habit={habit}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitButtonText={t('updateHabit')}
            mode="edit"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
