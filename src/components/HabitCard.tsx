import { useState } from 'react';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HabitEditDialog } from '@/components/HabitEditDialog';
import { useTranslation } from '@/hooks/useI18nTranslation';
import type { Habit } from '@/types';

interface HabitCardProps {
  habit: Habit;
  onUpdate: (id: string, updates: Partial<Omit<Habit, 'id' | 'userId'>>) => Promise<void>;
  onDelete: (habitId: string) => Promise<void>;
}

export function HabitCard({ habit, onUpdate, onDelete }: HabitCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        await onDelete(habit.id);
      } catch (error) {
        console.error('Failed to delete habit:', error);
      }
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Omit<Habit, 'id' | 'userId'>>) => {
    try {
      await onUpdate(id, updates);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update habit:', error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-200">
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 px-3 py-1">
          {habit.name}
        </Badge>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="ms-2">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="h-4 w-4 me-2" />
              {t('edit')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash2 className="h-4 w-4 me-2" />
              {t('delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <HabitEditDialog
        habit={habit}
        open={isEditing}
        onOpenChange={setIsEditing}
        onUpdate={handleUpdate}
      />
    </>
  );
}
