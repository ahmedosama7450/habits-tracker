import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useI18nTranslation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Target, TrendingUp, Calendar, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SignIn() {
  const { t } = useTranslation();
  const { signInWithGoogle, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
      navigate('/'); // Redirect to home page
    } catch (err) {
      console.error('Sign-in error:', err);
      setError(err instanceof Error ? err.message : t('auth.signInError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking authentication status
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center">
        <div className="text-center space-y-4 text-white">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg mx-auto">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          </div>
          <p className="text-white font-medium text-lg">{t('auth.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Side - Hero Section */}
      <div className="flex-1 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 relative overflow-hidden flex items-center justify-center p-8 lg:p-12 min-h-[60vh] lg:min-h-screen">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-12 -end-12 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-16 -start-16 w-[32rem] h-[32rem] bg-teal-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 start-1/3 w-64 h-64 bg-emerald-300/20 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 text-white max-w-lg text-center lg:text-start">
          {/* App Logo */}
          <div className="mb-8 flex justify-center lg:justify-start">
            <div className="relative inline-block">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -end-1 w-5 h-5 bg-green-300 rounded-full flex items-center justify-center">
                <Star className="w-2.5 h-2.5 text-emerald-700" />
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {t('auth.buildBetter')}
              <span className="block text-emerald-200">{t('auth.habits')}</span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-emerald-100 leading-relaxed">
              {t('auth.heroDescription')}
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 gap-4 mt-8">
              <div className="flex items-center gap-3 text-emerald-100 justify-center lg:justify-start">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg">{t('auth.trackProgress')}</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-100 justify-center lg:justify-start">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg">{t('auth.buildStreaks')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-[480px] flex items-center justify-center p-8 lg:p-12 bg-gray-50 min-h-[40vh] lg:min-h-screen">
        <div className="w-full max-w-sm space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              {t('auth.welcome')}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t('auth.signInDescription')}
            </p>
          </div>

          {/* Sign In Form */}
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-in slide-in-from-top duration-300">
                <p className="text-sm text-red-600 text-start">{error}</p>
              </div>
            )}

            {/* Google Sign In Button */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm disabled:opacity-50 h-14 text-base font-medium transition-all duration-300 hover:shadow-md"
              size="lg"
            >
              <div className="flex items-center gap-3">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  /* Google Icon */
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span>
                  {isLoading ? t('auth.signingIn') : t('auth.signInWithGoogle')}
                </span>
              </div>
            </Button>

            {/* Privacy Note */}
            <p className="text-sm text-gray-500 text-center leading-relaxed">
              {t('auth.privacyNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
