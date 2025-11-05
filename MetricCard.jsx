import React from 'react';
import { motion } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function MetricCard({ 
    icon: Icon, 
    label, 
    value, 
    change,
    changeLabel = "vs période précédente",
    iconColor = "text-[var(--nea-primary-blue)]",
    iconBg = "bg-[var(--nea-primary-blue)]/10",
    valueColor,
    delay = 0 
}) {
    const getTrendIcon = () => {
        if (!change) return null;
        if (change > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
        if (change < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
        return <Minus className="w-4 h-4 text-gray-400" />;
    };

    const getTrendColor = () => {
        if (!change) return 'text-gray-400';
        if (change > 0) return 'text-green-400';
        if (change < 0) return 'text-red-400';
        return 'text-gray-400';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <NeaCard className="p-6 hover:border-[var(--nea-primary-blue)] transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                    {Icon && (
                        <div className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${iconColor}`} />
                        </div>
                    )}
                    {change !== undefined && (
                        <div className={`flex items-center gap-1 ${getTrendColor()}`}>
                            {getTrendIcon()}
                            <span className="text-sm font-semibold">
                                {change > 0 ? '+' : ''}{change}%
                            </span>
                        </div>
                    )}
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {label}
                </p>
                
                <p className={`text-3xl font-bold ${valueColor || 'text-gray-900 dark:text-white'}`}>
                    {value}
                </p>

                {change !== undefined && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {changeLabel}
                    </p>
                )}
            </NeaCard>
        </motion.div>
    );
}