import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * STATUS INDICATOR
 * Indicateur de statut animé (online, offline, busy, etc.)
 */
export default function StatusIndicator({
  status = 'online',
  size = 'md',
  showLabel = false,
  label,
  animate = true,
  className = ''
}) {
  const statuses = {
    online: {
      color: 'bg-green-400',
      label: 'En ligne',
      pulse: true
    },
    offline: {
      color: 'bg-gray-500',
      label: 'Hors ligne',
      pulse: false
    },
    busy: {
      color: 'bg-red-400',
      label: 'Occupé',
      pulse: true
    },
    away: {
      color: 'bg-yellow-400',
      label: 'Absent',
      pulse: false
    },
    loading: {
      color: 'bg-blue-400',
      label: 'Chargement...',
      pulse: true
    }
  };

  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const config = statuses[status] || statuses.offline;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div className={cn("rounded-full", sizes[size], config.color)} />
        
        {animate && config.pulse && (
          <motion.div
            className={cn("absolute inset-0 rounded-full", config.color)}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
      
      {showLabel && (
        <span className="text-sm text-[var(--nea-text-secondary)]">
          {label || config.label}
        </span>
      )}
    </div>
  );
}