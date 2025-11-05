import React from 'react';
import { motion } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { Target, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function MarketPositioning({ positioning }) {
    if (!positioning) {
        return (
            <NeaCard>
                <div className="p-8 text-center">
                    <Target className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Aucune donnée de positionnement disponible
                    </p>
                </div>
            </NeaCard>
        );
    }

    const marketShare = positioning.market_share || 0;
    const growthRate = positioning.growth_rate || 0;
    const targetSegments = positioning.target_segments || [];
    const competitiveAdvantages = positioning.competitive_advantages || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <NeaCard>
                <div className="p-4 border-b border-[var(--nea-border-default)]">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        Positionnement sur le Marché
                    </h3>
                </div>

                <div className="p-6 space-y-6">
                    {/* Métriques Principales */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <NeaCard className="p-4 bg-[var(--nea-bg-surface-hover)]">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Part de Marché
                                    </p>
                                    <p className="text-2xl font-bold text-blue-400">
                                        {marketShare}%
                                    </p>
                                </div>
                            </div>
                            <Progress value={marketShare} className="h-2" />
                        </NeaCard>

                        <NeaCard className="p-4 bg-[var(--nea-bg-surface-hover)]">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Croissance Annuelle
                                    </p>
                                    <p className="text-2xl font-bold text-green-400">
                                        {growthRate > 0 ? '+' : ''}{growthRate}%
                                    </p>
                                </div>
                            </div>
                            <Progress value={Math.abs(growthRate)} className="h-2" />
                        </NeaCard>
                    </div>

                    {/* Segments Cibles */}
                    {targetSegments.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Users className="w-5 h-5 text-purple-400" />
                                Segments Cibles
                            </h4>
                            <div className="grid md:grid-cols-2 gap-3">
                                {targetSegments.map((segment, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-3 bg-[var(--nea-bg-surface-hover)] rounded-lg border border-[var(--nea-border-subtle)]"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                                                {segment.name}
                                            </h5>
                                            {segment.priority && (
                                                <Badge className="bg-purple-500/20 text-purple-400 border-0 text-xs">
                                                    {segment.priority}
                                                </Badge>
                                            )}
                                        </div>
                                        {segment.size && (
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                Taille: {segment.size.toLocaleString('fr-CA')} utilisateurs
                                            </p>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Avantages Compétitifs */}
                    {competitiveAdvantages.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-400" />
                                Avantages Compétitifs
                            </h4>
                            <div className="space-y-2">
                                {competitiveAdvantages.map((advantage, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 flex items-start gap-3"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-bold text-green-400">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                                {advantage.title}
                                            </p>
                                            {advantage.description && (
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    {advantage.description}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Position Stratégique */}
                    {positioning.strategic_position && (
                        <div className="pt-6 border-t border-[var(--nea-border-subtle)]">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Position Stratégique
                            </h4>
                            <Badge className={`
                                ${positioning.strategic_position === 'Leader' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                  positioning.strategic_position === 'Challenger' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                  positioning.strategic_position === 'Niche Player' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                                  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}
                                border text-lg px-4 py-2
                            `}>
                                {positioning.strategic_position}
                            </Badge>
                        </div>
                    )}
                </div>
            </NeaCard>
        </motion.div>
    );
}