import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

/**
 * ENHANCED DIALOG - Modal Amélioré NEA-AZEX
 * Design cohérent et moderne pour toutes les modales du système
 */

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

export default function EnhancedDialog({ 
  open, 
  onOpenChange, 
  title, 
  description,
  icon: Icon,
  iconColor = "text-cyan-400",
  iconBg = "from-cyan-500/20 to-blue-500/30",
  children,
  size = "default", // "sm", "default", "lg", "xl", "full"
  className,
  headerGradient = "from-cyan-500/10 via-blue-500/10 to-purple-500/10",
  showCloseButton = true,
  footer
}) {
  const sizeClasses = {
    sm: "max-w-md",
    default: "max-w-2xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "max-w-7xl"
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "bg-[#1a1f2e] border-2 border-[var(--nea-border-default)] p-0 gap-0 rounded-2xl overflow-hidden shadow-2xl",
          "max-h-[90vh] overflow-y-auto styled-scrollbar",
          sizeClasses[size],
          className
        )}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={dialogVariants}
        >
          {/* Header avec gradient et pattern */}
          <div className={cn(
            "relative bg-gradient-to-r border-b border-[var(--nea-border-default)] p-6",
            headerGradient
          )}>
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
            
            <div className="relative flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                {Icon && (
                  <motion.div 
                    className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg flex-shrink-0",
                      iconBg
                    )}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  >
                    <Icon className={cn("w-6 h-6", iconColor)} />
                  </motion.div>
                )}
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-2xl font-bold text-[var(--nea-text-title)] mb-1">
                    {title}
                  </DialogTitle>
                  {description && (
                    <DialogDescription className="text-[var(--nea-text-secondary)]">
                      {description}
                    </DialogDescription>
                  )}
                </div>
              </div>
              
              {showCloseButton && (
                <button
                  onClick={() => onOpenChange(false)}
                  className="w-10 h-10 rounded-lg hover:bg-white/10 transition-all flex items-center justify-center group flex-shrink-0"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5 text-[var(--nea-text-secondary)] group-hover:text-[var(--nea-text-primary)] group-hover:rotate-90 transition-all" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 bg-[#1a1f2e]">
            {children}
          </div>

          {/* Footer (optional) */}
          {footer && (
            <div className="px-6 py-4 bg-[#151923] border-t border-[var(--nea-border-default)]">
              {footer}
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// Section component for better organization
export function DialogSection({ title, icon: Icon, children, className }) {
  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <div className="flex items-center gap-2 pb-2 border-b border-[var(--nea-border-subtle)]">
          {Icon && <Icon className="w-5 h-5 text-[var(--nea-primary-blue)]" />}
          <h3 className="text-sm font-semibold text-[var(--nea-text-primary)] uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}
      {children}
    </div>
  );
}

// Field component with enhanced styling
export function DialogField({ label, required, children, help, error }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold text-[var(--nea-text-primary)] block">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      {children}
      {help && (
        <p className="text-xs text-[var(--nea-text-secondary)] italic">
          {help}
        </p>
      )}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}

// Enhanced Input with NEA styling
export function EnhancedInput({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full px-4 py-2.5 rounded-lg",
        "bg-[var(--nea-bg-surface-hover)] border-2 border-[var(--nea-border-default)]",
        "text-[var(--nea-text-primary)] placeholder:text-[var(--nea-text-secondary)]",
        "focus:border-[var(--nea-primary-blue)] focus:ring-2 focus:ring-[var(--nea-primary-blue)]/30",
        "transition-all duration-200",
        "hover:border-[var(--nea-border-default)]/80",
        className
      )}
      {...props}
    />
  );
}

// Enhanced Textarea
export function EnhancedTextarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "w-full px-4 py-2.5 rounded-lg",
        "bg-[var(--nea-bg-surface-hover)] border-2 border-[var(--nea-border-default)]",
        "text-[var(--nea-text-primary)] placeholder:text-[var(--nea-text-secondary)]",
        "focus:border-[var(--nea-primary-blue)] focus:ring-2 focus:ring-[var(--nea-primary-blue)]/30",
        "transition-all duration-200",
        "hover:border-[var(--nea-border-default)]/80",
        "resize-none",
        className
      )}
      {...props}
    />
  );
}

// Enhanced Select Trigger
export function EnhancedSelectTrigger({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "w-full px-4 py-2.5 rounded-lg",
        "bg-[var(--nea-bg-surface-hover)] border-2 border-[var(--nea-border-default)]",
        "text-[var(--nea-text-primary)]",
        "focus:border-[var(--nea-primary-blue)] focus:ring-2 focus:ring-[var(--nea-primary-blue)]/30",
        "transition-all duration-200",
        "hover:border-[var(--nea-border-default)]/80",
        "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}