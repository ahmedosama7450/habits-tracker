import { Settings, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/UserAvatar';
import { useTranslation } from '@/hooks/useI18nTranslation';
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onSettingsClick?: () => void;
  showSignIn?: boolean;
}

export function Header({ onSettingsClick, showSignIn = false }: HeaderProps) {
  const { t } = useTranslation();
  const { user, isAuthenticated, signOut } = useAuth();
  const location = useLocation();
  const isSignInPage = location.pathname === '/signin';

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-emerald-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-emerald-100 transition-colors">
          {t('appTitle')}
        </Link>
        
        <div className="flex items-center gap-3">
          {/* User Information - Show when authenticated */}
          {isAuthenticated && user && (
            <div className="hidden md:flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <UserAvatar name={user.fullName} avatar={user.avatarUrl} size="md" />
                <div className="text-start">
                  <div className="font-medium">{user.fullName || 'User'}</div>
                  <div className="text-emerald-100 text-xs">{user.email}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile User Info - Show only avatar on small screens */}
          {isAuthenticated && user && (
            <div className="md:hidden flex items-center">
              <UserAvatar name={user.fullName} avatar={user.avatarUrl} size="md" />
            </div>
          )}

          {/* Show Sign In button if not authenticated and not on sign in page */}
          {!isAuthenticated && showSignIn && !isSignInPage && (
            <Link to="/signin">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-emerald-700 hover:text-white"
              >
                <LogIn className="h-5 w-5 me-2" />
                {t('auth.signIn')}
              </Button>
            </Link>
          )}
          
          {/* Show Settings button if provided */}
          {onSettingsClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettingsClick}
              className="text-white hover:bg-emerald-700 hover:text-white"
            >
              <Settings className="h-5 w-5 me-2" />
              <span className="hidden sm:inline">{t('settings')}</span>
            </Button>
          )}

          {/* Show Sign Out button if authenticated */}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-white hover:bg-emerald-700 hover:text-white"
            >
              <LogOut className="h-5 w-5 me-2" />
              <span className="hidden sm:inline">{t('auth.signOut')}</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
