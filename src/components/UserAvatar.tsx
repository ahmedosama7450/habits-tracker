import { User } from 'lucide-react';

interface UserAvatarProps {
  name?: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ name, avatar, size = 'md' }: UserAvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6'
  };

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={`${name || 'User'} avatar`}
        className={`${sizeClasses[size]} rounded-full object-cover bg-emerald-500`}
      />
    );
  }

  const initials = name ? getInitials(name) : '';

  return (
    <div className={`${sizeClasses[size]} bg-emerald-500 rounded-full flex items-center justify-center font-medium text-white`}>
      {initials || <User className={iconSizes[size]} />}
    </div>
  );
}
