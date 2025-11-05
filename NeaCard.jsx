
import React from 'react';
import { cn } from '@/lib/utils';

const NeaCard = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-[var(--nea-bg-surface)] border border-[var(--nea-border-default)] rounded-xl shadow-lg transition-all hover:shadow-xl",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

NeaCard.displayName = "NeaCard";

export default NeaCard;
