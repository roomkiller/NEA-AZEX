import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * MESSAGE D'ERREUR/ALERTE STANDARDISÉ
 * Remplace les messages génériques par des messages contextuels détaillés
 * 
 * @param {Object} props
 * @param {string} props.type - "error", "warning", "info", "success"
 * @param {string} props.title - Titre du message
 * @param {string} props.message - Message détaillé
 * @param {string} props.action - Texte du bouton d'action (optionnel)
 * @param {Function} props.onAction - Callback du bouton d'action
 * @param {boolean} props.showIcon - Afficher l'icône (default: true)
 */
export default function ErrorMessage({
  type = 'error',
  title,
  message,
  action,
  onAction,
  showIcon = true,
  className = ''
}) {
  const config = {
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      iconColor: 'text-red-400',
      titleColor: 'text-red-300'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      iconColor: 'text-yellow-400',
      titleColor: 'text-yellow-300'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-300'
    },
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      iconColor: 'text-green-400',
      titleColor: 'text-green-300'
    }
  };

  const { icon: Icon, bgColor, borderColor, iconColor, titleColor } = config[type];

  return (
    <div 
      className={cn(
        'rounded-lg border-2 p-4',
        bgColor,
        borderColor,
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {showIcon && <Icon className={cn('w-6 h-6 flex-shrink-0 mt-0.5', iconColor)} />}
        
        <div className="flex-1">
          {title && (
            <h4 className={cn('font-semibold mb-1', titleColor)}>
              {title}
            </h4>
          )}
          
          {message && (
            <p className="text-sm text-[var(--nea-text-primary)]">
              {message}
            </p>
          )}
          
          {action && onAction && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAction}
              className="mt-3"
            >
              {action}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}