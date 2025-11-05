import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * STEP PROGRESS
 * Indicateur de progression par étapes
 */
export default function StepProgress({
  steps = [],
  currentStep = 0,
  onStepClick,
  className = ''
}) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = onStepClick && (isCompleted || index === currentStep);

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1">
                {/* Step Circle */}
                <button
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={!isClickable}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--nea-primary-blue)] focus:ring-offset-2",
                    isCompleted && "bg-green-500 border-green-500",
                    isCurrent && "bg-[var(--nea-primary-blue)] border-[var(--nea-primary-blue)]",
                    !isCompleted && !isCurrent && "bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]",
                    isClickable && "cursor-pointer hover:scale-110",
                    !isClickable && "cursor-default"
                  )}
                  aria-label={`Étape ${index + 1}: ${step.title}`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span className={cn(
                      "text-sm font-bold",
                      isCurrent ? "text-white" : "text-[var(--nea-text-muted)]"
                    )}>
                      {index + 1}
                    </span>
                  )}
                </button>

                {/* Step Label */}
                <div className="text-center max-w-[120px]">
                  <p className={cn(
                    "text-xs font-medium",
                    isCurrent ? "text-[var(--nea-text-title)]" : "text-[var(--nea-text-secondary)]"
                  )}>
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-[var(--nea-text-muted)] mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mb-10">
                  <div className="h-full bg-[var(--nea-border-default)] relative overflow-hidden">
                    {index < currentStep && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        className="h-full bg-green-500"
                      />
                    )}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}