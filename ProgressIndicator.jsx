import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * PROGRESS INDICATOR
 * Barre de progression élégante avec animations
 */
export default function ProgressIndicator({
  value = 0,
  max = 100,
  label = '',
  showPercentage = true,
  variant = 'default', // default, success, warning, danger
  size = 'md', // sm, md, lg
  animated = true,
  className = ''
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variantClasses = {
    default: 'bg-[var(--nea-primary-blue)]',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  };

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const getVariantByValue = () => {
    if (variant !== 'default') return variant;
    if (percentage >= 90) return 'success';
    if (percentage >= 70) return 'warning';
    if (percentage < 50) return 'danger';
    return 'default';
  };

  const currentVariant = getVariantByValue();

  return (
    <div className={cn("w-full", className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm text-[var(--nea-text-primary)]">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-semibold text-[var(--nea-text-title)]">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={cn(
        "w-full bg-[var(--nea-bg-surface-hover)] rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.5, ease: 'easeOut' } : { duration: 0 }}
          className={cn(
            "h-full rounded-full",
            variantClasses[currentVariant]
          )}
        />
      </div>
    </div>
  );
}

/**
 * CIRCULAR PROGRESS
 * Indicateur circulaire de progression
 */
export function CircularProgress({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  label = '',
  showPercentage = true,
  variant = 'default'
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const variantColors = {
    default: 'stroke-[var(--nea-primary-blue)]',
    success: 'stroke-green-500',
    warning: 'stroke-yellow-500',
    danger: 'stroke-red-500'
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--nea-bg-surface-hover)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={variantColors[variant]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className="text-2xl font-bold text-[var(--nea-text-title)]">
            {Math.round(percentage)}%
          </span>
        )}
        {label && (
          <span className="text-xs text-[var(--nea-text-secondary)] mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}