import React from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ALERT COMPONENT
 * Messages d'alerte avec différents variants
 */
export default function Alert({ 
  variant = 'info',
  title,
  children,
  className = '',
  onClose
}) {
  const variants = {
    info: {
      icon: Info,
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      iconBg: 'bg-blue-500/20'
    },
    success: {
      icon: CheckCircle,
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      iconBg: 'bg-green-500/20'
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      iconBg: 'bg-yellow-500/20'
    },
    error: {
      icon: XCircle,
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      iconBg: 'bg-red-500/20'
    }
  };

  const config = variants[variant] || variants.info;
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 p-4 rounded-lg border",
        config.bg,
        config.border,
        className
      )}
    >
      <div className={cn("p-2 rounded-lg", config.iconBg)}>
        <Icon className={cn("w-5 h-5", config.text)} aria-hidden="true" />
      </div>
      
      <div className="flex-1 min-w-0">
        {title && (
          <h5 className={cn("font-semibold mb-1", config.text)}>
            {title}
          </h5>
        )}
        <div className="text-sm text-[var(--nea-text-primary)]">
          {children}
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-[var(--nea-bg-surface-hover)] rounded transition-colors"
          aria-label="Fermer l'alerte"
        >
          <XCircle className="w-4 h-4 text-[var(--nea-text-muted)]" />
        </button>
      )}
    </div>
  );
}