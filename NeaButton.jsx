import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const variants = {
  primary: 'bg-gradient-to-r from-[var(--nea-primary-blue)] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]',
  secondary: 'bg-[var(--nea-bg-surface-hover)] hover:bg-[var(--nea-border-default)] border-2 border-[var(--nea-border-default)] hover:border-[var(--nea-primary-blue)] text-[var(--nea-text-primary)] font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
  destructive: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98]',
  ghost: 'hover:bg-white/10 text-[var(--nea-text-primary)] hover:text-white font-medium hover:scale-[1.02] active:scale-[0.98]',
  success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02] active:scale-[0.98]',
};

const NeaButton = React.forwardRef(({ className, variant = 'primary', children, ...props }, ref) => {
  return (
    <Button
      className={cn(
        'transition-all duration-200 ease-out',
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </Button>
  );
});

NeaButton.displayName = 'NeaButton';

export default NeaButton;