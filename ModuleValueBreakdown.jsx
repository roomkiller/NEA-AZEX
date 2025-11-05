import React from 'react';
import { motion } from 'framer-motion';
import { Grid3x3, DollarSign, TrendingUp, Percent } from 'lucide-react';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatPercentage } from '../utils/NumberFormatter';

export default function ModuleValueBreakdown({ modules, totalValue }) {
    if (!modules || modules.length === 0) {
        return null;
    }

    // Calculer les pourcentages
    const modulesWithPercentage = modules.map(module => ({
        ...module,
        percentage: totalValue > 0 ? (module.value / totalValue) * 100 : 0
    })).sort((a, b) => b.value - a.value);

    // Top 5 modules par valeur
    const topModules = modulesWithPercentage.slice(0, 5);
    const othersValue = modulesWithPercentage.slice(5).reduce((sum, m) => sum + m.value, 0);
    const othersPercentage = totalValue > 0 ? (othersValue / totalValue) * 100 : 0;

    const getCategoryColor = (category) => {
        const colors = {
            'GÉOPOLITIQUE': 'from-red-500/20 to-red-600/30',
            'NUCLÉAIRE': 'from-orange-500/20 to-orange-600/30',
            'CLIMAT': 'from-green-500/20 to-green-600/30',
            'BIOLOGIE': 'from-teal-500/20 to-teal-600/30',
            'CYBERNÉTIQUE': 'from-purple-500/20 to-purple-600/30',
            'SUPERVISION': 'from-blue-500/20 to-blue-600/30'
        };
        return colors[category] || 'from-gray-500/20 to-gray-600/30';
    };

    const getCategoryTextColor = (category) => {
        const colors = {
            'GÉOPOLITIQUE': 'text-red-400',
            'NUCLÉAIRE': 'text-orange-400',
            'CLIMAT': 'text-green-400',
            'BIOLOGIE': 'text-teal-400',
            'CYBERNÉTIQUE': 'text-purple-400',
            'SUPERVISION': 'text-blue-400'
        };
        return colors[category] || 'text-gray-400';
    };

    return (
        <NeaCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[var(--nea-text-title)] flex items-center gap-2">
                    <Grid3x3 className="w-5 h-5 text-blue-400" />
                    Répartition par Module
                </h3>
                <Badge className="bg-blue-500/20 text-blue-400 border-0">
                    {modules.length} modules
                </Badge>
            </div>

            <div className="space-y-4">
                {topModules.map((module, index) => (
                    <motion.div
                        key={module.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="space-y-2"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center ${getCategoryColor(module.category)}`}>
                                    <Grid3x3 className={`w-5 h-5 ${getCategoryTextColor(module.category)}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-[var(--nea-text-primary)] truncate">
                                        {module.name}
                                    </p>
                                    <p className="text-xs text-[var(--nea-text-secondary)]">
                                        {module.category}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 ml-4">
                                <div className="text-right">
                                    <p className="text-sm font-bold text-[var(--nea-text-primary)]">
                                        {formatCurrency(module.value, 'CAD', { compact: true })}
                                    </p>
                                    <p className="text-xs text-[var(--nea-text-secondary)]">
                                        {formatPercentage(module.percentage, { decimals: 1 })}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Progress value={module.percentage} className="h-2" />
                    </motion.div>
                ))}

                {othersValue > 0 && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: topModules.length * 0.05 }}
                        className="space-y-2 pt-2 border-t border-[var(--nea-border-subtle)]"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-500/20 to-gray-600/30 flex items-center justify-center">
                                    <Grid3x3 className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-[var(--nea-text-primary)]">
                                        Autres modules
                                    </p>
                                    <p className="text-xs text-[var(--nea-text-secondary)]">
                                        {modules.length - 5} modules
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 ml-4">
                                <div className="text-right">
                                    <p className="text-sm font-bold text-[var(--nea-text-primary)]">
                                        {formatCurrency(othersValue, 'CAD', { compact: true })}
                                    </p>
                                    <p className="text-xs text-[var(--nea-text-secondary)]">
                                        {formatPercentage(othersPercentage, { decimals: 1 })}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Progress value={othersPercentage} className="h-2" />
                    </motion.div>
                )}
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-blue-400" />
                        <span className="text-sm font-semibold text-[var(--nea-text-primary)]">
                            Valeur Totale
                        </span>
                    </div>
                    <span className="text-lg font-bold text-blue-400">
                        {formatCurrency(totalValue, 'CAD', { compact: true })}
                    </span>
                </div>
            </div>
        </NeaCard>
    );
}