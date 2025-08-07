import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home } from 'lucide-react';

export function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md p-8 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-emerald-200 dark:border-gray-700">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">404</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('notFound.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {t('notFound.description')}
          </p>
        </div>

        <div className="space-y-3">
          <Button 
            asChild 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Link to="/" className="flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              {t('notFound.backToHome')}
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
