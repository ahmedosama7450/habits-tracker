import { useForm } from 'react-hook-form';
import { Settings, Save, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useTranslation } from '@/hooks/useI18nTranslation';
import { clearAllData } from '@/utils/storage';
import type { AppSettings } from '@/types';

interface SettingsDialogProps {
  settings: AppSettings;
  onSettingsChange: (settings: Partial<AppSettings>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  language: 'en' | 'ar';
  firstTrackingMonth: string;
}

export function SettingsDialog({
  settings,
  onSettingsChange,
  open,
  onOpenChange,
}: SettingsDialogProps) {
  const { t } = useTranslation();
  
  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      language: settings.language,
      firstTrackingMonth: settings.firstTrackingMonth,
    },
  });

  const watchedLanguage = watch('language');

  const onFormSubmit = (data: FormData) => {
    onSettingsChange({
      language: data.language,
      firstTrackingMonth: data.firstTrackingMonth,
    });
    onOpenChange(false);
  };

  const handleClearData = () => {
    if (window.confirm(t('confirmClearData'))) {
      clearAllData();
      window.location.reload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-start">
            <Settings className="h-5 w-5" />
            {t('settings')}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="language" className="text-start">{t('language')}</Label>
            <Select
              value={watchedLanguage}
              onValueChange={(value: 'en' | 'ar') => setValue('language', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstTrackingMonth" className="text-start">{t('firstTrackingMonth')}</Label>
            <Input
              id="firstTrackingMonth"
              type="month"
              {...register('firstTrackingMonth')}
            />
          </div>

          <DialogFooter className="flex justify-between items-center">
            <Button type="button" variant="destructive" onClick={handleClearData} size="sm">
              <Trash2 className="h-4 w-4 me-2" />
              {t('clearData')}
            </Button>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4 me-2" />
                {t('cancel')}
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="h-4 w-4 me-2" />
                {t('save')}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
