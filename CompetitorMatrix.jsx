import React from 'react';
import { motion } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function CompetitorMatrix({ competitors = [] }) {
    if (competitors.length === 0) {
        return (
            <NeaCard>
                <div className="p-8 text-center">
                    <TrendingUp className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Aucune donnée de comparaison disponible
                    </p>
                </div>
            </NeaCard>
        );
    }

    const getComparisonIcon = (comparison) => {
        if (comparison > 0) return TrendingUp;
        if (comparison < 0) return TrendingDown;
        return Minus;
    };

    const getComparisonColor = (comparison) => {
        if (comparison > 0) return 'text-green-400';
        if (comparison < 0) return 'text-red-400';
        return 'text-gray-400';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <NeaCard>
                <div className="p-4 border-b border-[var(--nea-border-default)]">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                        Matrice Concurrentielle
                    </h3>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[var(--nea-border-default)]">
                                    <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">
                                        Concurrent
                                    </th>
                                    <th className="text-right py-3 px-4 text-gray-900 dark:text-white font-semibold">
                                        Valeur Estimée
                                    </th>
                                    <th className="text-center py-3 px-4 text-gray-900 dark:text-white font-semibold">
                                        Comparaison
                                    </th>
                                    <th className="text-center py-3 px-4 text-gray-900 dark:text-white font-semibold">
                                        Position
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {competitors.map((competitor, index) => {
                                    const ComparisonIcon = getComparisonIcon(competitor.comparison);
                                    const comparisonColor = getComparisonColor(competitor.comparison);

                                    return (
                                        <motion.tr
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="border-b border-[var(--nea-border-subtle)] hover:bg-[var(--nea-bg-surface-hover)] transition-colors"
                                        >
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {competitor.name}
                                                    </p>
                                                    {competitor.description && (
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                            {competitor.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <p className="font-bold text-gray-900 dark:text-white">
                                                    {competitor.value?.toLocaleString('fr-CA')} $
                                                </p>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <div className={`flex items-center justify-center gap-1 ${comparisonColor}`}>
                                                    <ComparisonIcon className="w-4 h-4" />
                                                    <span className="font-semibold">
                                                        {competitor.comparison > 0 ? '+' : ''}
                                                        {competitor.comparison}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <Badge className={`
                                                    ${competitor.position === 'Leader' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                                      competitor.position === 'Challenger' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                                      competitor.position === 'Follower' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                                      'bg-gray-500/20 text-gray-400 border-gray-500/30'}
                                                    border
                                                `}>
                                                    {competitor.position}
                                                </Badge>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </NeaCard>
        </motion.div>
    );
}