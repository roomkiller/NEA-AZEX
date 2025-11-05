import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/components/hooks/useDebounce';

/**
 * SEARCH INPUT
 * Input de recherche avec debounce et gestion du focus
 */
export default function SearchInput({
    value = '',
    onChange,
    onClear,
    placeholder = "Rechercher...",
    debounceMs = 300,
    isLoading = false,
    className = '',
    autoFocus = false,
    disabled = false
}) {
    const [localValue, setLocalValue] = useState(value);
    const debouncedValue = useDebounce(localValue, debounceMs);
    const inputRef = useRef(null);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useEffect(() => {
        if (debouncedValue !== value) {
            onChange?.(debouncedValue);
        }
    }, [debouncedValue]);

    const handleClear = () => {
        setLocalValue('');
        onChange?.('');
        onClear?.();
        inputRef.current?.focus();
    };

    return (
        <div className={cn("relative", className)}>
            {/* Search Icon */}
            <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--nea-text-muted)]"
                aria-hidden="true"
            />

            {/* Input */}
            <input
                ref={inputRef}
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                autoFocus={autoFocus}
                className={cn(
                    "w-full pl-10 pr-10 py-2 rounded-lg",
                    "bg-[var(--nea-bg-surface)] border border-[var(--nea-border-default)]",
                    "text-[var(--nea-text-primary)] placeholder:text-[var(--nea-text-muted)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--nea-primary-blue)] focus:border-transparent",
                    "transition-all",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                aria-label={placeholder}
            />

            {/* Loading/Clear Icon */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isLoading ? (
                    <Loader2 className="w-4 h-4 text-[var(--nea-text-muted)] animate-spin" />
                ) : localValue ? (
                    <button
                        onClick={handleClear}
                        className="p-1 hover:bg-[var(--nea-bg-surface-hover)] rounded transition-colors"
                        aria-label="Effacer la recherche"
                        type="button"
                    >
                        <X className="w-3 h-3 text-[var(--nea-text-muted)]" />
                    </button>
                ) : null}
            </div>
        </div>
    );
}