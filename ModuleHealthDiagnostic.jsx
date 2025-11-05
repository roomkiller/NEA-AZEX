import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Activity, Database } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function ModuleHealthDiagnostic({ 
    modules, 
    referenceModules, 
    missingModules, 
    conflictingModules 
}) {
    const diagnostic = useMemo(() => {
        const totalRef = referenceModules.length;
        const presentCount = modules.length;
        const missingCount = missingModules.length;
        const conflictCount = conflictingModules.length;
        
        // Score de santé global (0-100)
        const healthScore = Math.round(
            ((presentCount - conflictCount) / totalRef) * 100
        );
        
        // Modules critiques manquants (P0 et P1)
        const criticalMissing = missingModules.filter(m => m.priority <= 1);
        
        // Analyse par catégorie
        const categoryHealth = {};
        referenceModules.forEach(ref => {
            if (!categoryHealth[ref.category]) {
                categoryHealth[ref.category] = {
                    total: 0,
                    present: 0,
                    missing: 0,
                    conflicts: 0
                };
            }
            categoryHealth[ref.category].total++;
            
            const exists = modules.find(m => m.name === ref.name);
            if (exists) {
                categoryHealth[ref.category].present++;
                if (conflictingModules.find(c => c.module.name === ref.name)) {
                    categoryHealth[ref.category].conflicts++;
                }
            } else {
                categoryHealth[ref.category].missing++;
            }
        });
        
        // Recommandations
        const recommendations = [];
        if (criticalMissing.length > 0) {
            recommendations.push({
                type: 'critical',
                message: `${criticalMissing.length} module(s) critique(s) manquant(s) - Restauration urgente recommandée`,
                action: 'restore_critical'
            });
        }
        if (conflictCount > 0) {
            recommendations.push({
                type: 'warning',
                message: `${conflictCount} conflit(s) de version détecté(s) - Mise à jour recommandée`,
                action: 'update_versions'
            });
        }
        if (healthScore >= 90) {
            recommendations.push({
                type: 'success',
                message: 'Système en excellent état - Aucune action requise',
                action: null
            });
        }
        
        return {
            healthScore,
            criticalMissing: criticalMissing.length,
            categoryHealth,
            recommendations
        };
    }, [modules, referenceModules, missingModules, conflictingModules]);

    const getHealthColor = (score) => {
        if (score >= 90) return 'text-green-400';
        if (score >= 70) return 'text-yellow-400';
        if (score >= 50) return 'text-orange-400';
        return 'text-red-400';
    };

    const getHealthGradient = (score) => {
        if (score >= 90) return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
        if (score >= 70) return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
        if (score >= 50) return 'from-orange-500/20 to-red-500/20 border-orange-500/30';
        return 'from-red-500/20 to-pink-500/20 border-red-500/30';
    };

    const getHealthStatus = (score) => {
        if (score >= 90) return 'EXCELLENT';
        if (score >= 70) return 'BON';
        if (score >= 50) return 'DÉGRADÉ';
        return 'CRITIQUE';
    };

    return (
        <NeaCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-[var(--nea-text-title)]">
                    Diagnostic de Santé Système
                </h3>
            </div>

            {/* Score Global */}
            <div className={`p-6 rounded-lg bg-gradient-to-br ${getHealthGradient(diagnostic.healthScore)} border-2 mb-6`}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Santé Globale du Système
                        </p>
                        <div className="flex items-center gap-3">
                            <p className={`text-5xl font-bold ${getHealthColor(diagnostic.healthScore)}`}>
                                {diagnostic.healthScore}%
                            </p>
                            <Badge className={`border-0 text-sm ${
                                diagnostic.healthScore >= 90 ? 'bg-green-500/20 text-green-400' :
                                diagnostic.healthScore >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                                diagnostic.healthScore >= 50 ? 'bg-orange-500/20 text-orange-400' :
                                'bg-red-500/20 text-red-400'
                            }`}>
                                {getHealthStatus(diagnostic.healthScore)}
                            </Badge>
                        </div>
                    </div>
                    <Activity className={`w-16 h-16 ${getHealthColor(diagnostic.healthScore)}`} />
                </div>
                <Progress value={diagnostic.healthScore} className="h-3" />
            </div>

            {/* Recommandations */}
            {diagnostic.recommendations.length > 0 && (
                <div className="space-y-3 mb-6">
                    <h4 className="text-sm font-bold text-[var(--nea-text-title)]">
                        Recommandations
                    </h4>
                    {diagnostic.recommendations.map((rec, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-3 rounded-lg border ${
                                rec.type === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                                rec.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                                'bg-green-500/10 border-green-500/30'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                {rec.type === 'critical' ? (
                                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                ) : rec.type === 'warning' ? (
                                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                ) : (
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                )}
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {rec.message}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Métriques Détaillées */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]">
                    <div className="flex items-center gap-2 mb-2">
                        <Database className="w-4 h-4 text-blue-400" />
                        <p className="text-sm font-semibold text-[var(--nea-text-primary)]">
                            Modules Présents
                        </p>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">
                        {modules.length}/{referenceModules.length}
                    </p>
                    <Progress 
                        value={(modules.length / referenceModules.length) * 100} 
                        className="h-1 mt-2" 
                    />
                </div>

                <div className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <p className="text-sm font-semibold text-[var(--nea-text-primary)]">
                            Critiques Manquants
                        </p>
                    </div>
                    <p className={`text-3xl font-bold ${diagnostic.criticalMissing > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {diagnostic.criticalMissing}
                    </p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                        Priorité 0-1
                    </p>
                </div>

                <div className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-yellow-400" />
                        <p className="text-sm font-semibold text-[var(--nea-text-primary)]">
                            Conflits Version
                        </p>
                    </div>
                    <p className={`text-3xl font-bold ${conflictingModules.length > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {conflictingModules.length}
                    </p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                        À mettre à jour
                    </p>
                </div>
            </div>

            {/* Santé par Catégorie */}
            <div>
                <h4 className="text-sm font-bold text-[var(--nea-text-title)] mb-3">
                    Santé par Catégorie
                </h4>
                <div className="space-y-3">
                    {Object.entries(diagnostic.categoryHealth).map(([category, stats]) => {
                        const healthPercent = Math.round((stats.present / stats.total) * 100);
                        const isHealthy = healthPercent >= 80;
                        
                        return (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-[var(--nea-text-title)]">
                                            {category}
                                        </span>
                                        {!isHealthy && (
                                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs">
                                        <span className="text-green-400">{stats.present} présents</span>
                                        {stats.missing > 0 && (
                                            <span className="text-red-400">{stats.missing} manquants</span>
                                        )}
                                        {stats.conflicts > 0 && (
                                            <span className="text-yellow-400">{stats.conflicts} conflits</span>
                                        )}
                                    </div>
                                </div>
                                <div className="relative">
                                    <Progress value={healthPercent} className="h-2" />
                                    <span className="absolute right-0 -top-5 text-xs text-[var(--nea-text-secondary)]">
                                        {healthPercent}%
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </NeaCard>
    );
}