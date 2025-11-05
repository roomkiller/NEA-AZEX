import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Calendar, Target } from 'lucide-react';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercentage } from '../utils/NumberFormatter';
import StatsCard from '../ui/StatsCard';

export default function ValuationProjection({ currentValue, projections }) {
    if (!projections || projections.length === 0) {
        return null;
    }

    const oneYearProjection = projections.find(p => p.year === 1);
    const threeYearProjection = projections.find(p => p.year === 3);
    const fiveYearProjection = projections.find(p => p.year === 5);

    return (
        <div className="space-y-6">
            {/* Current + Projections Grid */}
            <div className="grid md:grid-cols-4 gap-4">
                <StatsCard
                    title="Valorisation Actuelle"
                    value={currentValue}
                    icon={DollarSign}
                    iconColor="text-blue-400"
                    iconBg="from-blue-500/20 to-blue-600/30"
                    borderColor="border-blue-500/30"
                    valueColor="text-blue-400"
                    compact={true}
                    unit="CAD"
                    size="default"
                />

                {oneYearProjection && (
                    <StatsCard
                        title="Projection 1 an"
                        value={oneYearProjection.value}
                        icon={TrendingUp}
                        iconColor="text-green-400"
                        iconBg="from-green-500/20 to-green-600/30"
                        borderColor="border-green-500/30"
                        valueColor="text-green-400"
                        compact={true}
                        unit="CAD"
                        trend="up"
                        trendValue={oneYearProjection.growth_rate}
                        size="default"
                    />
                )}

                {threeYearProjection && (
                    <StatsCard
                        title="Projection 3 ans"
                        value={threeYearProjection.value}
                        icon={Target}
                        iconColor="text-cyan-400"
                        iconBg="from-cyan-500/20 to-cyan-600/30"
                        borderColor="border-cyan-500/30"
                        valueColor="text-cyan-400"
                        compact={true}
                        unit="CAD"
                        trend="up"
                        trendValue={threeYearProjection.growth_rate}
                        size="default"
                    />
                )}

                {fiveYearProjection && (
                    <StatsCard
                        title="Projection 5 ans"
                        value={fiveYearProjection.value}
                        icon={Calendar}
                        iconColor="text-purple-400"
                        iconBg="from-purple-500/20 to-purple-600/30"
                        borderColor="border-purple-500/30"
                        valueColor="text-purple-400"
                        compact={true}
                        unit="CAD"
                        trend="up"
                        trendValue={fiveYearProjection.growth_rate}
                        size="default"
                    />
                )}
            </div>

            {/* Detailed Timeline */}
            <NeaCard className="p-6">
                <h3 className="text-lg font-bold text-[var(--nea-text-title)] mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    Évolution Projetée
                </h3>
                <div className="space-y-3">
                    {projections.map((projection, index) => (
                        <motion.div
                            key={projection.year}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)] hover:border-blue-500/30 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/30 flex items-center justify-center">
                                            <span className="text-blue-400 font-bold">{projection.year}</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--nea-text-secondary)]">Année {projection.year}</p>
                                            <p className="text-sm font-semibold text-[var(--nea-text-primary)]">
                                                {formatCurrency(projection.value, 'CAD', { compact: true })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-green-500/20 text-green-400 border-0">
                                        {formatPercentage(projection.growth_rate, { showSign: true, decimals: 1 })}
                                    </Badge>
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                </div>
                            </div>
                            {projection.notes && (
                                <p className="text-xs text-[var(--nea-text-secondary)] mt-2 ml-14">
                                    {projection.notes}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </NeaCard>
        </div>
    );
}