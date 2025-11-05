import React from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * AVATAR COMPONENT
 * Avatar utilisateur avec initiales ou image
 */
export default function Avatar({
  src,
  alt,
  name,
  size = 'md',
  status,
  className = ''
}) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const statusColors = {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    busy: 'bg-red-400',
    away: 'bg-yellow-400'
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <div
        className={cn(
          "rounded-full overflow-hidden flex items-center justify-center font-semibold",
          "bg-gradient-to-br from-[var(--nea-primary-blue)] to-purple-500",
          "text-white",
          sizes[size]
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
          />
        ) : name ? (
          <span>{getInitials(name)}</span>
        ) : (
          <User className="w-1/2 h-1/2" />
        )}
      </div>

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[var(--nea-bg-surface)]",
            statusColors[status]
          )}
          aria-label={`Statut: ${status}`}
        />
      )}
    </div>
  );
}

/**
 * AVATAR GROUP
 * Groupe d'avatars avec compteur
 */
export function AvatarGroup({ users = [], max = 3, size = 'md', className = '' }) {
  const displayedUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {displayedUsers.map((user, index) => (
        <div
          key={user.id || index}
          className="ring-2 ring-[var(--nea-bg-surface)] rounded-full"
          style={{ zIndex: displayedUsers.length - index }}
        >
          <Avatar
            src={user.avatar}
            name={user.name}
            size={size}
          />
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div
          className={cn(
            "rounded-full flex items-center justify-center font-semibold",
            "bg-[var(--nea-bg-surface-hover)] border-2 border-[var(--nea-bg-surface)]",
            "text-[var(--nea-text-secondary)]",
            size === 'sm' && 'w-8 h-8 text-xs',
            size === 'md' && 'w-10 h-10 text-sm',
            size === 'lg' && 'w-12 h-12 text-base'
          )}
          title={`+${remainingCount} autres`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}