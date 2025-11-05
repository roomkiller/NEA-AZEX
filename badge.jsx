import React from 'react';
import { cn } from '@/lib/utils';

/**
 * BADGE COMPONENT ENHANCED
 * Version améliorée du badge avec plus de variants
 */
export default function BadgeEnhanced({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}) {
  const variants = {
    default: 'bg-[var(--nea-bg-surface-hover)] text-[var(--nea-text-primary)] border-[var(--nea-border-default)]',
    primary: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    outline: 'bg-transparent text-[var(--nea-text-primary)] border-[var(--nea-border-default)]'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-medium border transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// Export aussi le variant par défaut pour compatibilité
export { BadgeEnhanced as Badge };