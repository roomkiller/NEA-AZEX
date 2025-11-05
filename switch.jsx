import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * SWITCH COMPONENT
 * Toggle switch accessible
 */
export default function Switch({
  checked = false,
  onChange,
  disabled = false,
  label,
  description,
  size = 'md',
  className = ''
}) {
  const sizes = {
    sm: { switch: 'w-9 h-5', thumb: 'w-4 h-4', translate: 'translate-x-4' },
    md: { switch: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { switch: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' }
  };

  const sizeConfig = sizes[size];

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {(label || description) && (
        <div className="flex-1 mr-4">
          {label && (
            <label className="text-sm font-medium text-[var(--nea-text-primary)]">
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
              {description}
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={cn(
          "relative inline-flex items-center rounded-full transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-[var(--nea-primary-blue)] focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          sizeConfig.switch,
          checked
            ? "bg-[var(--nea-primary-blue)]"
            : "bg-[var(--nea-bg-surface-hover)]"
        )}
      >
        <motion.span
          animate={{
            x: checked ? sizeConfig.translate : '0.125rem'
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "inline-block rounded-full bg-white shadow-lg",
            sizeConfig.thumb
          )}
        />
      </button>
    </div>
  );
}