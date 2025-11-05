import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

/**
 * MODAL COMPONENT
 * Modale réutilisable avec animations et accessibilité
 */
export default function Modal({
  open = false,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md', // sm, md, lg, xl, full
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = ''
}) {
  const modalRef = React.useRef(null);

  useOnClickOutside(modalRef, () => {
    if (closeOnOverlayClick && open) {
      onClose();
    }
  });

  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose, closeOnEscape]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "relative w-full bg-[var(--nea-bg-surface)] rounded-lg shadow-2xl",
                  "border border-[var(--nea-border-default)]",
                  sizeClasses[size],
                  className
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "modal-title" : undefined}
                aria-describedby={description ? "modal-description" : undefined}
              >
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-start justify-between p-6 border-b border-[var(--nea-border-default)]">
                    <div className="flex-1">
                      {title && (
                        <h2
                          id="modal-title"
                          className="text-xl font-bold text-[var(--nea-text-title)]"
                        >
                          {title}
                        </h2>
                      )}
                      {description && (
                        <p
                          id="modal-description"
                          className="mt-1 text-sm text-[var(--nea-text-secondary)]"
                        >
                          {description}
                        </p>
                      )}
                    </div>
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="ml-4 p-2 hover:bg-[var(--nea-bg-surface-hover)] rounded-lg transition-colors"
                        aria-label="Fermer la modale"
                      >
                        <X className="w-5 h-5 text-[var(--nea-text-secondary)]" />
                      </button>
                    )}
                  </div>
                )}

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)] styled-scrollbar">
                  {children}
                </div>

                {/* Footer */}
                {footer && (
                  <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--nea-border-default)]">
                    {footer}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}