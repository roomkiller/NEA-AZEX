import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * FORMATAGE DES NOMBRES - Système Universel NEA-AZEX
 * Fonctions de formatage cohérentes pour tous les nombres, devises, dates et pourcentages
 */

// ============ FONCTIONS DE FORMATAGE ============

/**
 * Formate une devise avec symbole et échelle automatique
 */
export function formatCurrency(value, currency = 'CAD', options = {}) {
    const {
        compact = false,
        decimals = 0,
        showSymbol = true,
        locale = 'fr-CA'
    } = options;

    if (value === null || value === undefined || isNaN(value)) {
        return showSymbol ? `0 ${currency}` : '0';
    }

    // Format compact (K, M, G, T)
    if (compact) {
        return formatLargeNumber(value, { decimals, unit: currency, locale });
    }

    // Format standard avec séparateurs
    const formatted = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);

    return showSymbol ? formatted : formatted.replace(/[^\d,.\s]/g, '').trim();
}

/**
 * Formate un grand nombre avec échelles (K, M, G, T)
 */
export function formatLargeNumber(value, options = {}) {
    const {
        precision = 2,
        decimals = 2,
        unit = '',
        locale = 'fr-CA',
        forceScale = null // 'K', 'M', 'G', 'T' pour forcer une échelle
    } = options;

    if (value === null || value === undefined || isNaN(value)) {
        return unit ? `0 ${unit}` : '0';
    }

    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    let scale = '';
    let scaledValue = absValue;

    if (forceScale) {
        const scales = { 'K': 1e3, 'M': 1e6, 'G': 1e9, 'T': 1e12 };
        scaledValue = absValue / scales[forceScale];
        scale = forceScale;
    } else {
        if (absValue >= 1e12) {
            scaledValue = absValue / 1e12;
            scale = 'T';
        } else if (absValue >= 1e9) {
            scaledValue = absValue / 1e9;
            scale = 'G';
        } else if (absValue >= 1e6) {
            scaledValue = absValue / 1e6;
            scale = 'M';
        } else if (absValue >= 1e3) {
            scaledValue = absValue / 1e3;
            scale = 'K';
        }
    }

    const formatted = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
    }).format(scaledValue);

    return `${sign}${formatted}${scale}${unit ? ' ' + unit : ''}`;
}

/**
 * Formate un pourcentage
 */
export function formatPercentage(value, options = {}) {
    const {
        decimals = 1,
        showSign = false,
        locale = 'fr-CA'
    } = options;

    if (value === null || value === undefined || isNaN(value)) {
        return '0%';
    }

    const sign = showSign && value > 0 ? '+' : '';
    const formatted = new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);

    return `${sign}${formatted}%`;
}

/**
 * Formate une date
 */
export function formatDate(date, format = 'long', locale = 'fr-CA') {
    if (!date) return 'N/A';

    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) return 'Date invalide';

    const formats = {
        'short': { year: 'numeric', month: '2-digit', day: '2-digit' },
        'medium': { year: 'numeric', month: 'short', day: 'numeric' },
        'long': { year: 'numeric', month: 'long', day: 'numeric' },
        'full': { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
        'time': { hour: '2-digit', minute: '2-digit' },
        'datetime': { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    };

    return new Intl.DateTimeFormat(locale, formats[format] || formats.long).format(dateObj);
}

/**
 * Formate un nombre standard avec séparateurs
 */
export function formatNumber(value, options = {}) {
    const {
        decimals = 0,
        locale = 'fr-CA'
    } = options;

    if (value === null || value === undefined || isNaN(value)) {
        return '0';
    }

    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

// ============ COMPOSANTS VISUELS ============

/**
 * Affichage d'une devise avec animation et tailles personnalisables
 */
export function CurrencyDisplay({ 
    value, 
    currency = 'CAD', 
    size = 'default',
    compact = false,
    animate = true,
    className,
    showLabel = false,
    label = '',
    trend = null // 'up', 'down', 'neutral'
}) {
    const sizes = {
        'xs': 'text-sm',
        'sm': 'text-lg',
        'default': 'text-2xl',
        'lg': 'text-4xl',
        'xl': 'text-5xl',
        'hero': 'text-6xl'
    };

    const formatted = formatCurrency(value, currency, { compact, decimals: compact ? 2 : 0 });

    const content = (
        <div className={cn("flex flex-col", className)}>
            {showLabel && label && (
                <span className="text-xs text-[var(--nea-text-secondary)] font-medium uppercase tracking-wider mb-1">
                    {label}
                </span>
            )}
            <div className="flex items-baseline gap-2">
                <span className={cn("font-bold", sizes[size])}>
                    {formatted}
                </span>
                {trend && (
                    <div className="flex items-center gap-1">
                        {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                        {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                        {trend === 'neutral' && <Minus className="w-4 h-4 text-gray-400" />}
                    </div>
                )}
            </div>
        </div>
    );

    if (animate) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                {content}
            </motion.div>
        );
    }

    return content;
}

/**
 * Affichage d'un grand nombre avec échelle
 */
export function LargeNumberDisplay({ 
    value, 
    unit = '',
    size = 'default',
    animate = true,
    className,
    showLabel = false,
    label = '',
    color = 'text-[var(--nea-text-primary)]'
}) {
    const sizes = {
        'xs': 'text-sm',
        'sm': 'text-lg',
        'default': 'text-2xl',
        'lg': 'text-4xl',
        'xl': 'text-5xl',
        'hero': 'text-6xl'
    };

    const formatted = formatLargeNumber(value, { unit, decimals: 2 });

    const content = (
        <div className={cn("flex flex-col", className)}>
            {showLabel && label && (
                <span className="text-xs text-[var(--nea-text-secondary)] font-medium uppercase tracking-wider mb-1">
                    {label}
                </span>
            )}
            <span className={cn("font-bold", sizes[size], color)}>
                {formatted}
            </span>
        </div>
    );

    if (animate) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {content}
            </motion.div>
        );
    }

    return content;
}

/**
 * Affichage d'un pourcentage avec tendance
 */
export function PercentageDisplay({ 
    value, 
    size = 'default',
    animate = true,
    className,
    showLabel = false,
    label = '',
    showSign = true,
    trend = null // 'up', 'down', 'neutral'
}) {
    const sizes = {
        'xs': 'text-sm',
        'sm': 'text-lg',
        'default': 'text-2xl',
        'lg': 'text-4xl',
        'xl': 'text-5xl'
    };

    // Déterminer la couleur basée sur la valeur
    const getColor = () => {
        if (trend === 'up' || (trend === null && value > 0)) return 'text-green-400';
        if (trend === 'down' || (trend === null && value < 0)) return 'text-red-400';
        return 'text-gray-400';
    };

    const formatted = formatPercentage(value, { showSign, decimals: 1 });

    const content = (
        <div className={cn("flex flex-col", className)}>
            {showLabel && label && (
                <span className="text-xs text-[var(--nea-text-secondary)] font-medium uppercase tracking-wider mb-1">
                    {label}
                </span>
            )}
            <div className="flex items-baseline gap-2">
                <span className={cn("font-bold", sizes[size], getColor())}>
                    {formatted}
                </span>
                {trend && (
                    <>
                        {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                        {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                        {trend === 'neutral' && <Minus className="w-4 h-4 text-gray-400" />}
                    </>
                )}
            </div>
        </div>
    );

    if (animate) {
        return (
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                {content}
            </motion.div>
        );
    }

    return content;
}

/**
 * Affichage d'une date formatée
 */
export function DateDisplay({ 
    date, 
    format = 'long',
    className,
    showLabel = false,
    label = ''
}) {
    const formatted = formatDate(date, format);

    return (
        <div className={cn("flex flex-col", className)}>
            {showLabel && label && (
                <span className="text-xs text-[var(--nea-text-secondary)] font-medium uppercase tracking-wider mb-1">
                    {label}
                </span>
            )}
            <span className="text-sm text-[var(--nea-text-primary)]">
                {formatted}
            </span>
        </div>
    );
}

/**
 * Hook pour animer un nombre avec compteur
 */
export function useCountUp(end, duration = 1000, start = 0) {
    const [count, setCount] = React.useState(start);

    React.useEffect(() => {
        let startTime = null;
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            // Easing function (ease-out)
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            setCount(Math.floor(start + (end - start) * easeProgress));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration, start]);

    return count;
}

export default {
    formatCurrency,
    formatLargeNumber,
    formatPercentage,
    formatDate,
    formatNumber,
    CurrencyDisplay,
    LargeNumberDisplay,
    PercentageDisplay,
    DateDisplay,
    useCountUp
};