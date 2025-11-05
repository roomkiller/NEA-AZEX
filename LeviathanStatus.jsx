import React from 'react';
import { motion } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { Shield, ServerOff, Loader2, Container, Layers, CheckCircle, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const STATUS_CONFIG = {
    Dormant: {
        icon: ServerOff,
        color: 'text-gray-400',
        bg: 'bg-gray-500/10',
        label: 'En Veille'
    },
    Dispersing: {
        icon: Loader2,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        label: 'Dispersion',
        animated: true
    },
    Active: {
        icon: CheckCircle,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        label: 'Actif'
    },
    Recovering: {
        icon: Activity,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        label: 'Récupération'
    },
    Compromised: {
        icon: Shield,
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        label: 'Compromis'
    }
};

export default function LeviathanStatus({ system }) {
    if (!system) {
        return (
            <NeaCard>
                <div className="p-12 text-center">
                    <Container className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Aucun système Léviathan déployé
                    </p>
                </div>
            </NeaCard>
        );
    }

    const statusConfig = STATUS_CONFIG[system.status] || STATUS_CONFIG.Dormant;
    const StatusIcon = statusConfig.icon;
    const dispersalProgress = system.dispersal_progress || 0;
    const fragmentsCount = system.fragments_count || 0;
    const integrityScore = system.integrity_score || 100;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <NeaCard>
                <div className="p-6 space-y-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-lg ${statusConfig.bg} flex items-center justify-center`}>
                                <Container className={`w-8 h-8 text-cyan-400 ${statusConfig.animated ? 'animate-pulse' : ''}`} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                    Protocole Léviathan
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Dispersion fractale des données
                                </p>
                            </div>
                        </div>
                        <Badge className={`${statusConfig.bg} ${statusConfig.color} border-0 flex items-center gap-2`}>
                            <StatusIcon className={`w-4 h-4 ${statusConfig.animated ? 'animate-spin' : ''}`} />
                            {statusConfig.label}
                        </Badge>
                    </div>

                    {system.status === 'Active' || system.status === 'Dispersing' ? (
                        <>
                            <div className="grid md:grid-cols-3 gap-4">
                                <NeaCard className="p-4 bg-[var(--nea-bg-surface-hover)]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Layers className="w-5 h-5 text-purple-400" />
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Fragments Actifs
                                        </p>
                                    </div>
                                    <p className="text-3xl font-bold text-purple-400">
                                        {fragmentsCount}
                                    </p>
                                </NeaCard>

                                <NeaCard className="p-4 bg-[var(--nea-bg-surface-hover)]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield className="w-5 h-5 text-green-400" />
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Intégrité
                                        </p>
                                    </div>
                                    <p className={`text-3xl font-bold ${
                                        integrityScore >= 90 ? 'text-green-400' :
                                        integrityScore >= 70 ? 'text-yellow-400' :
                                        'text-red-400'
                                    }`}>
                                        {integrityScore}%
                                    </p>
                                </NeaCard>

                                <NeaCard className="p-4 bg-[var(--nea-bg-surface-hover)]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Activity className="w-5 h-5 text-blue-400" />
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Progression
                                        </p>
                                    </div>
                                    <p className="text-3xl font-bold text-blue-400">
                                        {dispersalProgress}%
                                    </p>
                                </NeaCard>
                            </div>

                            {system.status === 'Dispersing' && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Dispersion en cours...
                                        </span>
                                        <span className="font-semibold text-[var(--nea-primary-blue)]">
                                            {dispersalProgress}%
                                        </span>
                                    </div>
                                    <Progress value={dispersalProgress} className="h-3" />
                                </div>
                            )}

                            {system.locations && system.locations.length > 0 && (
                                <div className="pt-4 border-t border-[var(--nea-border-subtle)]">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                        Emplacements de Dispersion:
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-2">
                                        {system.locations.map((location, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2 p-2 bg-[var(--nea-bg-surface-hover)] rounded border border-[var(--nea-border-subtle)]"
                                            >
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                <span className="text-sm text-gray-900 dark:text-white truncate">
                                                    {location}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {system.encryption_level && (
                                <div className="pt-4 border-t border-[var(--nea-border-subtle)]">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Niveau de Chiffrement:
                                        </span>
                                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                                            {system.encryption_level}
                                        </Badge>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                Système en attente d'activation
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Le protocole Léviathan dispersera automatiquement les données en cas de menace
                            </p>
                        </div>
                    )}
                </div>
            </NeaCard>
        </motion.div>
    );
}