import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NeaCard from './NeaCard';
import { cn } from '@/lib/utils';

/**
 * CONFIRM DIALOG
 * Dialogue de confirmation élégant
 */
export default function ConfirmDialog({
  open = false,
  onClose,
  onConfirm,
  title = "Confirmer l'action",
  message = "Êtes-vous sûr de vouloir continuer ?",
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "default", // default, danger, warning, info
  isLoading = false
}) {
  if (!open) return null;

  const variants = {
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-red-400',
      iconBg: 'bg-red-500/20',
      confirmClass: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-500/20',
      confirmClass: 'bg-yellow-600 hover:bg-yellow-700'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
      confirmClass: 'bg-blue-600 hover:bg-blue-700'
    },
    default: {
      icon: Info,
      iconColor: 'text-[var(--nea-primary-blue)]',
      iconBg: 'bg-blue-500/20',
      confirmClass: 'bg-[var(--nea-primary-blue)] hover:bg-blue-600'
    }
  };

  const config = variants[variant] || variants.default;
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[9998]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-md"
            role="dialog"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
            aria-modal="true"
          >
            <NeaCard>
              <div className="p-6">
                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={cn("p-3 rounded-lg", config.iconBg)}>
                    <Icon className={cn("w-6 h-6", config.iconColor)} aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h2 id="dialog-title" className="text-xl font-bold text-[var(--nea-text-title)] mb-2">
                      {title}
                    </h2>
                    <p id="dialog-description" className="text-[var(--nea-text-primary)]">
                      {message}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-[var(--nea-bg-surface-hover)] rounded transition-colors"
                    aria-label="Fermer le dialogue"
                  >
                    <X className="w-5 h-5 text-[var(--nea-text-secondary)]" />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    disabled={isLoading}
                  >
                    {cancelText}
                  </Button>
                  <Button
                    onClick={onConfirm}
                    className={config.confirmClass}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Chargement...' : confirmText}
                  </Button>
                </div>
              </div>
            </NeaCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}