import React from 'react';
import { motion } from 'framer-motion';
import { FileQuestion, Inbox, Search, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NeaCard from './NeaCard';
import { cn } from '@/lib/utils';

/**
 * ENHANCED EMPTY STATE
 * État vide amélioré avec actions et illustrations
 */
export default function EmptyStateEnhanced({
  icon: CustomIcon,
  title = "Aucune donnée",
  description = "Il n'y a rien à afficher pour le moment",
  action,
  actionLabel,
  variant = 'default', // default, search, database, inbox
  className = ''
}) {
  const variants = {
    default: { icon: FileQuestion, color: 'text-gray-400' },
    search: { icon: Search, color: 'text-blue-400' },
    database: { icon: Database, color: 'text-purple-400' },
    inbox: { icon: Inbox, color: 'text-cyan-400' }
  };

  const config = variants[variant] || variants.default;
  const Icon = CustomIcon || config.icon;

  return (
    <NeaCard className={cn("p-12", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className={cn(
            "w-20 h-20 mx-auto rounded-full flex items-center justify-center",
            "bg-[var(--nea-bg-surface-hover)]"
          )}>
            <Icon className={cn("w-10 h-10", config.color)} aria-hidden="true" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-bold text-[var(--nea-text-title)] mb-2"
        >
          {title}
        </motion.h3>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[var(--nea-text-secondary)] mb-6"
        >
          {description}
        </motion.p>

        {/* Action Button */}
        {action && actionLabel && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button onClick={action} className="bg-[var(--nea-primary-blue)] hover:bg-blue-600">
              {actionLabel}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </NeaCard>
  );
}

/**
 * INLINE EMPTY STATE
 * Version compacte pour les listes
 */
export function InlineEmptyState({ icon: Icon = Inbox, message = "Aucun élément" }) {
  return (
    <div className="py-8 text-center">
      <Icon className="w-12 h-12 text-[var(--nea-text-muted)] mx-auto mb-3" aria-hidden="true" />
      <p className="text-[var(--nea-text-secondary)]">{message}</p>
    </div>
  );
}