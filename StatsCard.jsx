import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import NeaCard from './NeaCard';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LargeNumberDisplay, PercentageDisplay } from '../utils/NumberFormatter';

/**
 * STATS CARD - Card universelle pour afficher des métriques
 * Utilisée dans tous les dashboards pour cohérence visuelle
 */

export default function StatsCard({
    title,
    value,
    unit = '',
    icon: Icon,
    iconColor = 'text-blue-400',
    iconBg = 'from-blue-500/20 to-blue-600/30',
    gradient = 'from-blue-500/10 to-cyan-500/10',
    borderColor = 'border-blue-500/30',
    subtitle,
    trend, // 'up', 'down', 'neutral'
    trendValue, // percentage
    badge,
    badgeColor = 'bg-blue-500/20 text-blue-400',
    onClick,
    className,
    size = 'default', // 'sm', 'default', 'lg'
    valueColor = 'text-blue-400',
    compact = false,
    animate = true
}) {
    const sizes = {
        sm: {
            padding: 'p-4',
            iconSize: 'w-5 h-5',
            iconBoxSize: 'w-10 h-10',
            valueSize: 'text-2xl',
            titleSize: 'text-xs'
        },
        default: {
            padding: 'p-6',
            iconSize: 'w-6 h-6',
            iconBoxSize: 'w-12 h-12',
            valueSize: 'text-3xl',
            titleSize: 'text-sm'
        },
        lg: {
            padding: 'p-8',
            iconSize: 'w-8 h-8',
            iconBoxSize: 'w-16 h-16',
            valueSize: 'text-5xl',
            titleSize: 'text-base'
        }
    };

    const sizeConfig = sizes[size];

    const content = (
        <NeaCard 
            className={cn(
                'overflow-hidden border-2 transition-all',
                borderColor,
                onClick && 'cursor-pointer hover:shadow-xl hover:scale-105',
                className
            )}
            onClick={onClick}
        >
            <div className={cn('bg-gradient-to-br', gradient, sizeConfig.padding)}>
                <div className="flex items-start justify-between mb-4">
                    {Icon && (
                        <div className={cn(
                            'rounded-xl bg-gradient-to-br flex items-center justify-center',
                            iconBg,
                            sizeConfig.iconBoxSize
                        )}>
                            <Icon className={cn(iconColor, sizeConfig.iconSize)} />
                        </div>
                    )}
                    {badge && (
                        <Badge className={cn('border-0', badgeColor)}>
                            {badge}
                        </Badge>
                    )}
                </div>

                <div className="space-y-2">
                    <p className={cn(
                        'text-[var(--nea-text-secondary)] font-medium uppercase tracking-wide',
                        sizeConfig.titleSize
                    )}>
                        {title}
                    </p>

                    <div className="flex items-baseline gap-2">
                        {compact ? (
                            <LargeNumberDisplay
                                value={value}
                                unit={unit}
                                size={size === 'lg' ? 'xl' : size === 'sm' ? 'default' : 'lg'}
                                color={valueColor}
                                animate={animate}
                            />
                        ) : (
                            <span className={cn('font-bold', sizeConfig.valueSize, valueColor)}>
                                {typeof value === 'number' ? value.toLocaleString() : value}
                                {unit && <span className="text-lg ml-2">{unit}</span>}
                            </span>
                        )}

                        {trend && trendValue !== undefined && (
                            <div className="flex items-center gap-1">
                                {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                                {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                                <PercentageDisplay
                                    value={trendValue}
                                    size="xs"
                                    showSign={true}
                                    trend={trend}
                                />
                            </div>
                        )}
                    </div>

                    {subtitle && (
                        <p className="text-xs text-[var(--nea-text-muted)]">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </NeaCard>
    );

    if (animate) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={onClick ? { scale: 1.02 } : {}}
                transition={{ duration: 0.3 }}
            >
                {content}
            </motion.div>
        );
    }

    return content;
}

// Variante simple pour métriques rapides
export function SimpleStatsCard({ icon: Icon, title, value, color = 'blue' }) {
    const colorMap = {
        blue: { icon: 'text-blue-400', bg: 'from-blue-500/20 to-blue-600/30', border: 'border-blue-500/30', value: 'text-blue-400' },
        purple: { icon: 'text-purple-400', bg: 'from-purple-500/20 to-purple-600/30', border: 'border-purple-500/30', value: 'text-purple-400' },
        cyan: { icon: 'text-cyan-400', bg: 'from-cyan-500/20 to-cyan-600/30', border: 'border-cyan-500/30', value: 'text-cyan-400' },
        green: { icon: 'text-green-400', bg: 'from-green-500/20 to-green-600/30', border: 'border-green-500/30', value: 'text-green-400' },
        red: { icon: 'text-red-400', bg: 'from-red-500/20 to-red-600/30', border: 'border-red-500/30', value: 'text-red-400' },
        yellow: { icon: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-600/30', border: 'border-yellow-500/30', value: 'text-yellow-400' },
    };

    const colors = colorMap[color];

    return (
        <StatsCard
            title={title}
            value={value}
            icon={Icon}
            iconColor={colors.icon}
            iconBg={colors.bg}
            borderColor={colors.border}
            valueColor={colors.value}
            size="sm"
        />
    );
}