import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, Circle, Clock } from 'lucide-react';

/**
 * TIMELINE COMPONENT
 * Affiche une timeline d'événements
 */
export default function Timeline({ items = [], className = '' }) {
  return (
    <div className={cn("space-y-6 relative", className)} role="list">
      {/* Ligne verticale */}
      <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-[var(--nea-border-default)]" />

      {items.map((item, index) => (
        <TimelineItem
          key={item.id || index}
          item={item}
          index={index}
        />
      ))}
    </div>
  );
}

function TimelineItem({ item, index }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          icon: Check,
          color: 'bg-green-500 border-green-400',
          iconColor: 'text-white'
        };
      case 'current':
        return {
          icon: Circle,
          color: 'bg-blue-500 border-blue-400',
          iconColor: 'text-white'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]',
          iconColor: 'text-[var(--nea-text-muted)]'
        };
      default:
        return {
          icon: Circle,
          color: 'bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]',
          iconColor: 'text-[var(--nea-text-muted)]'
        };
    }
  };

  const config = getStatusConfig(item.status);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-10"
      role="listitem"
    >
      {/* Icon */}
      <div
        className={cn(
          "absolute left-0 top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center z-10",
          config.color
        )}
      >
        <Icon className={cn("w-4 h-4", config.iconColor)} />
      </div>

      {/* Content */}
      <div className="pb-6">
        <div className="flex items-start justify-between gap-4 mb-1">
          <h4 className="font-semibold text-[var(--nea-text-title)]">
            {item.title}
          </h4>
          {item.timestamp && (
            <span className="text-xs text-[var(--nea-text-muted)] whitespace-nowrap">
              {new Date(item.timestamp).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          )}
        </div>
        
        {item.description && (
          <p className="text-sm text-[var(--nea-text-secondary)] mb-2">
            {item.description}
          </p>
        )}

        {item.metadata && (
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(item.metadata).map(([key, value]) => (
              <span
                key={key}
                className="text-xs px-2 py-1 rounded bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)] text-[var(--nea-text-secondary)]"
              >
                {key}: {value}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}