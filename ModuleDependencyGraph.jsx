import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { GitMerge, AlertTriangle, CheckCircle, Link2 } from 'lucide-react';

export default function ModuleDependencyGraph({ module, allModules }) {
    const dependencies = useMemo(() => {
        // Identifier les dépendances basées sur la catégorie et les liens logiques
        const sameCategoryModules = allModules.filter(m => 
            m.id !== module.id && m.category === module.category
        );

        const supervisionModules = allModules.filter(m =>
            m.category === 'SUPERVISION'
        );

        const criticalModules = allModules.filter(m =>
            ['GÉOPOLITIQUE', 'NUCLÉAIRE'].includes(m.category) && m.id !== module.id
        );

        return {
            direct: sameCategoryModules.slice(0, 3),
            supervision: supervisionModules.slice(0, 2),
            critical: criticalModules.slice(0, 2)
        };
    }, [module, allModules]);

    const getDependencyHealth = () => {
        const allDeps = [...dependencies.direct, ...dependencies.supervision, ...dependencies.critical];
        const activeDeps = allDeps.filter(m => m.status === 'Active');
        return Math.round((activeDeps.length / Math.max(allDeps.length, 1)) * 100);
    };

    const healthScore = getDependencyHealth();

    const getHealthColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <NeaCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <GitMerge className="w-6 h-6 text-purple-400" />
                    <h3 className="text-xl font-bold text-[var(--nea-text-title)]">
                        Graphe de Dépendances
                    </h3>
                </div>
                <div className="text-right">
                    <p className={`text-2xl font-bold ${getHealthColor(healthScore)}`}>
                        {healthScore}%
                    </p>
                    <p className="text-xs text-[var(--nea-text-secondary)]">
                        Santé des dépendances
                    </p>
                </div>
            </div>

            {/* Module Central */}
            <div className="flex justify-center mb-6">
                <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500">
                    <div className="text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Module Actuel</p>
                        <p className="font-bold text-[var(--nea-text-title)]">{module.name}</p>
                        <Badge className={`mt-2 border-0 text-xs ${
                            module.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                            module.status === 'Standby' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                        }`}>
                            {module.status}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Dépendances Directes */}
            {dependencies.direct.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-bold text-[var(--nea-text-title)] mb-3 flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-blue-400" />
                        Dépendances Directes (même catégorie)
                    </h4>
                    <div className="grid md:grid-cols-3 gap-3">
                        {dependencies.direct.map(dep => (
                            <motion.div
                                key={dep.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-[var(--nea-text-title)] truncate">
                                            {dep.name}
                                        </p>
                                        <p className="text-xs text-[var(--nea-text-secondary)]">
                                            v{dep.version}
                                        </p>
                                    </div>
                                    {dep.status === 'Active' ? (
                                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 ml-2" />
                                    ) : (
                                        <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 ml-2" />
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Supervision */}
            {dependencies.supervision.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-bold text-[var(--nea-text-title)] mb-3 flex items-center gap-2">
                        <GitMerge className="w-4 h-4 text-purple-400" />
                        Modules de Supervision
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                        {dependencies.supervision.map(dep => (
                            <motion.div
                                key={dep.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-[var(--nea-text-title)] truncate">
                                            {dep.name}
                                        </p>
                                        <p className="text-xs text-[var(--nea-text-secondary)]">
                                            Supervision globale
                                        </p>
                                    </div>
                                    {dep.status === 'Active' ? (
                                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 ml-2" />
                                    ) : (
                                        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 ml-2" />
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modules Critiques */}
            {dependencies.critical.length > 0 && (
                <div>
                    <h4 className="text-sm font-bold text-[var(--nea-text-title)] mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        Modules Critiques Connexes
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                        {dependencies.critical.map(dep => (
                            <motion.div
                                key={dep.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-3 rounded-lg bg-red-500/10 border border-red-500/30"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-[var(--nea-text-title)] truncate">
                                            {dep.name}
                                        </p>
                                        <Badge variant="outline" className="text-xs mt-1">
                                            {dep.category}
                                        </Badge>
                                    </div>
                                    {dep.status === 'Active' ? (
                                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 ml-2" />
                                    ) : (
                                        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 ml-2" />
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {dependencies.direct.length === 0 && 
             dependencies.supervision.length === 0 && 
             dependencies.critical.length === 0 && (
                <div className="text-center py-8">
                    <GitMerge className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-[var(--nea-text-secondary)]">
                        Aucune dépendance détectée
                    </p>
                </div>
            )}
        </NeaCard>
    );
}