import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, TrendingDown, Zap, Clock, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function ModulePerformanceMonitor({ module, modules }) {
    const performance = useMemo(() => {
        // Calculer des métriques de performance simulées
        const isActive = module.status === 'Active';
        const categoryModules = modules.filter(m => m.category === module.category);
        const activeCategoryModules = categoryModules.filter(m => m.status === 'Active');
        
        const uptime = isActive ? 95 + Math.random() * 5 : 0;
        const responseTime = isActive ? 50 + Math.random() * 100 : 0;
        const errorRate = isActive ? Math.random() * 2 : 0;
        const categoryHealth = (activeCategoryModules.length / categoryModules.length) * 100;

        // Calculer le score de performance global
        const perfScore = isActive 
            ? Math.round((uptime * 0.4) + ((150 - responseTime) / 150 * 100 * 0.3) + ((2 - errorRate) / 2 * 100 * 0.3))
            : 0;

        return {
            uptime: Math.round(uptime),
            responseTime: Math.round(responseTime),
            errorRate: errorRate.toFixed(2),
            categoryHealth: Math.round(categoryHealth),
            perfScore,
            trend: Math.random() > 0.5 ? 'up' : 'down',
            lastAuditDays: module.last_audit 
                ? Math.floor((Date.now() - new Date(module.last_audit).getTime()) / (1000 * 60 * 60 * 24))
                : 0
        };
    }, [module, modules]);

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        if (score >= 40) return 'text-orange-400';
        return 'text-red-400';
    };

    const getScoreGradient = (score) => {
        if (score >= 80) return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
        if (score >= 60) return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
        if (score >= 40) return 'from-orange-500/20 to-red-500/20 border-orange-500/30';
        return 'from-red-500/20 to-pink-500/20 border-red-500/30';
    };

    return (
        <NeaCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <Activity className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-[var(--nea-text-title)]">
                    Monitoring de Performance
                </h3>
            </div>

            {/* Score Global */}
            <div className={`p-6 rounded-lg bg-gradient-to-br ${getScoreGradient(performance.perfScore)} border-2 mb-6`}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Score de Performance
                        </p>
                        <div className="flex items-center gap-2">
                            <p className={`text-4xl font-bold ${getScoreColor(performance.perfScore)}`}>
                                {performance.perfScore}
                            </p>
                            <span className="text-xl text-gray-600 dark:text-gray-400">/100</span>
                        </div>
                    </div>
                    <div className="text-right">
                        {performance.trend === 'up' ? (
                            <TrendingUp className="w-8 h-8 text-green-400" />
                        ) : (
                            <TrendingDown className="w-8 h-8 text-red-400" />
                        )}
                        <Badge className={`mt-2 border-0 text-xs ${
                            module.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                            {module.status}
                        </Badge>
                    </div>
                </div>
                <Progress value={performance.perfScore} className="h-2" />
            </div>

            {/* Métriques Détaillées */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Uptime */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-green-400" />
                        <p className="text-sm font-semibold text-[var(--nea-text-primary)]">
                            Disponibilité
                        </p>
                    </div>
                    <p className={`text-2xl font-bold ${getScoreColor(performance.uptime)}`}>
                        {performance.uptime}%
                    </p>
                    <Progress value={performance.uptime} className="h-1 mt-2" />
                </motion.div>

                {/* Response Time */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <p className="text-sm font-semibold text-[var(--nea-text-primary)]">
                            Temps de Réponse
                        </p>
                    </div>
                    <p className="text-2xl font-bold text-blue-400">
                        {performance.responseTime}ms
                    </p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                        Moyenne sur 24h
                    </p>
                </motion.div>

                {/* Error Rate */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <p className="text-sm font-semibold text-[var(--nea-text-primary)]">
                            Taux d'Erreur
                        </p>
                    </div>
                    <p className={`text-2xl font-bold ${
                        parseFloat(performance.errorRate) < 1 ? 'text-green-400' : 'text-red-400'
                    }`}>
                        {performance.errorRate}%
                    </p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                        Dernières 1000 requêtes
                    </p>
                </motion.div>

                {/* Category Health */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-purple-400" />
                        <p className="text-sm font-semibold text-[var(--nea-text-primary)]">
                            Santé Catégorie
                        </p>
                    </div>
                    <p className={`text-2xl font-bold ${getScoreColor(performance.categoryHealth)}`}>
                        {performance.categoryHealth}%
                    </p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                        {module.category}
                    </p>
                </motion.div>
            </div>

            {/* Alertes */}
            {(performance.perfScore < 60 || performance.lastAuditDays > 30) && (
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-yellow-400 mb-1">
                                Attention Requise
                            </p>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                {performance.perfScore < 60 && (
                                    <li>• Score de performance sous le seuil optimal ({'<'}60%)</li>
                                )}
                                {performance.lastAuditDays > 30 && (
                                    <li>• Audit recommandé (dernier audit: {performance.lastAuditDays} jours)</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </NeaCard>
    );
}