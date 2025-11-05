import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * BOUTON ACCESSIBLE STANDARDISÉ
 * Inclut ARIA labels, loading states, et gestion du focus
 * 
 * @param {Object} props
 * @param {string} props.ariaLabel - Label ARIA descriptif
 * @param {boolean} props.isLoading - État de chargement
 * @param {string} props.loadingText - Texte pendant le chargement
 * @param {React.ReactNode} props.icon - Icône (composant Lucide)
 * @param {string} props.shortcut - Raccourci clavier (ex: "Ctrl+S")
 */
export default function AccessibleButton({
    children,
    ariaLabel,
    isLoading = false,
    loadingText = 'Chargement...',
    icon: Icon,
    shortcut,
    disabled,
    onClick,
    className,
    variant = 'default',
    size = 'default',
    ...props
}) {
    const handleClick = (e) => {
        if (isLoading || disabled) return;
        onClick?.(e);
    };

    const computedAriaLabel = ariaLabel || (typeof children === 'string' ? children : undefined);

    return (
        <Button
            onClick={handleClick}
            disabled={disabled || isLoading}
            aria-label={computedAriaLabel}
            aria-busy={isLoading}
            aria-disabled={disabled || isLoading}
            title={shortcut ? `${computedAriaLabel} (${shortcut})` : computedAriaLabel}
            className={cn(
                'transition-all focus:ring-2 focus:ring-offset-2 focus:ring-[var(--nea-primary-blue)]',
                isLoading && 'cursor-wait',
                className
            )}
            variant={variant}
            size={size}
            {...props}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                    <span>{loadingText}</span>
                </>
            ) : (
                <>
                    {Icon && <Icon className="w-4 h-4 mr-2" aria-hidden="true" />}
                    {children}
                    {shortcut && (
                        <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-white/10 rounded border border-white/20">
                            {shortcut}
                        </kbd>
                    )}
                </>
            )}
        </Button>
    );
}