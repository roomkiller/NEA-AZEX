import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function ModuleAnalysisPanel({ modules }) {
    const analysis = useMemo(() => {
        const byCategory = {};
        modules.forEach(m => {
            if (!byCategory[m.category]) {
                byCategory[m.category] = {
                    total: 0,
                    active: 0,
                    standby: 0,
                    disabled: 0,
                    testing: 0
                };
            }
            byCategory[m.category].total++;
            byCategory[m.category][m.status.toLowerCase()]++;
        });

        // Calcul de santé globale
        const totalModules = modules.length;
        const activeModules = modules.filter(m => m.status === 'Active').length;
        const healthScore = totalModules > 0 ? Math.round((activeModules / totalModules) * 100) : 0;

        // Modules nécessitant attention
        const needsAttention = modules.filter(m => {
            const lastAudit = new Date(m.last_audit);
            const daysSinceAudit = (Date.now() - lastAudit.getTime()) / (1000 * 60 * 60 * 24);
            return daysSinceAudit > 30 || m.status === 'Disabled';
        });

        // Catégories critiques
        const criticalCategories = Object.entries(byCategory).filter(([_, stats]) => {
            const activePercent = (stats.active / stats.total) * 100;
            return activePercent < 50;
        });

        return {
            byCategory,
            healthScore,
            needsAttention,
            criticalCategories
        };
    }, [modules]);

    const getHealthColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getHealthIcon = (score) => {
        if (score >= 80) return CheckCircle;
        if (score >= 50) return Clock;
        return AlertTriangle;
    };

    const HealthIcon = getHealthIcon(analysis.healthScore);

    return (
        <NeaCard className="p-6">
            <h3 className="text-xl font-bold text-[var(--nea-text-title)] mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                Analyse Système
            </h3>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
                {/* Health Score */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30">
                    <div className="flex items-center gap-3 mb-2">
                        <HealthIcon className={`w-6 h-6 ${getHealthColor(analysis.healthScore)}`} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Santé Globale</span>
                    </div>
                    <p className={`text-4xl font-bold ${getHealthColor(analysis.healthScore)}`}>
                        {analysis.healthScore}%
                    </p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                        {modules.filter(m => m.status === 'Active').length}/{modules.length} modules actifs
                    </p>
                </div>

                {/* Attention Required */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-6 h-6 text-yellow-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Nécessitent Attention</span>
                    </div>
                    <p className="text-4xl font-bold text-yellow-400">
                        {analysis.needsAttention.length}
                    </p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                        Modules désactivés ou non audités
                    </p>
                </div>

                {/* Critical Categories */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/30">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingDown className="w-6 h-6 text-red-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Catégories Critiques</span>
                    </div>
                    <p className="text-4xl font-bold text-red-400">
                        {analysis.criticalCategories.length}
                    </p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                        {'<'} 50% modules actifs
                    </p>
                </div>
            </div>

            {/* Category Breakdown */}
            <div>
                <h4 className="text-lg font-bold text-[var(--nea-text-title)] mb-4">
                    Répartition par Catégorie
                </h4>
                <div className="space-y-3">
                    {Object.entries(analysis.byCategory).map(([category, stats]) => {
                        const activePercent = Math.round((stats.active / stats.total) * 100);
                        const isCritical = activePercent < 50;
                        
                        return (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-[var(--nea-text-title)]">
                                            {category}
                                        </span>
                                        {isCritical && (
                                            <Badge className="bg-red-500/20 text-red-400 border-0 text-xs">
                                                Critique
                                            </Badge>
                                        )}
                                    </div>
                                    <span className="text-sm text-[var(--nea-text-secondary)]">
                                        {stats.total} modules
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                                        {stats.active} Actifs
                                    </Badge>
                                    <Badge className="bg-yellow-500/20 text-yellow-400 border-0 text-xs">
                                        {stats.standby} Pause
                                    </Badge>
                                    <Badge className="bg-orange-500/20 text-orange-400 border-0 text-xs">
                                        {stats.testing} Test
                                    </Badge>
                                    <Badge className="bg-gray-500/20 text-gray-400 border-0 text-xs">
                                        {stats.disabled} Désactivés
                                    </Badge>
                                </div>
                                <div className="mt-3">
                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${
                                                activePercent >= 80 ? 'bg-green-500' :
                                                activePercent >= 50 ? 'bg-yellow-500' :
                                                'bg-red-500'
                                            }`}
                                            style={{ width: `${activePercent}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                                        {activePercent}% modules actifs
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Modules nécessitant attention */}
            {analysis.needsAttention.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-lg font-bold text-[var(--nea-text-title)] mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        Modules Nécessitant Attention ({analysis.needsAttention.length})
                    </h4>
                    <div className="space-y-2">
                        {analysis.needsAttention.slice(0, 5).map(module => (
                            <div
                                key={module.id}
                                className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-[var(--nea-text-title)] text-sm">
                                            {module.name}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {module.status === 'Disabled' ? 'Module désactivé' : 
                                             `Dernier audit: ${Math.floor((Date.now() - new Date(module.last_audit).getTime()) / (1000 * 60 * 60 * 24))} jours`}
                                        </p>
                                    </div>
                                    <Badge className={`border-0 text-xs ${
                                        module.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                                        module.status === 'Standby' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-gray-500/20 text-gray-400'
                                    }`}>
                                        {module.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                        {analysis.needsAttention.length > 5 && (
                            <p className="text-xs text-[var(--nea-text-secondary)] text-center py-2">
                                ... et {analysis.needsAttention.length - 5} autre(s)
                            </p>
                        )}
                    </div>
                </div>
            )}
        </NeaCard>
    );
}