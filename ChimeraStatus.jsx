import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { Ghost, Shield, Activity, AlertTriangle, Zap, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const VERSION_CONFIG = {
    v1: {
        name: 'Chimère Passif',
        description: 'Mode observation et capture',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10'
    },
    v2: {
        name: 'Chimère Némésis (Actif)',
        description: 'Mode manipulation et contre-attaque',
        color: 'text-red-400',
        bg: 'bg-red-500/10'
    }
};

const STATUS_CONFIG = {
    Dormant: { 
        icon: Eye, 
        color: 'text-gray-400', 
        bg: 'bg-gray-500/10',
        label: 'En Veille'
    },
    Deploying: { 
        icon: Activity, 
        color: 'text-blue-400', 
        bg: 'bg-blue-500/10',
        label: 'Déploiement'
    },
    Active: { 
        icon: Zap, 
        color: 'text-green-400', 
        bg: 'bg-green-500/10',
        label: 'Actif'
    },
    Compromised: { 
        icon: AlertTriangle, 
        color: 'text-red-400', 
        bg: 'bg-red-500/10',
        label: 'Compromis'
    },
    Decommissioning: { 
        icon: Shield, 
        color: 'text-yellow-400', 
        bg: 'bg-yellow-500/10',
        label: 'Démantèlement'
    }
};

export default function ChimeraStatus({ system }) {
    const [stats, setStats] = useState({
        attacksCaptured: 0,
        intelligenceGathered: 0,
        threatLevel: 0
    });

    useEffect(() => {
        // Simulation de statistiques en temps réel
        const interval = setInterval(() => {
            if (system?.status === 'Active') {
                setStats(prev => ({
                    attacksCaptured: prev.attacksCaptured + Math.floor(Math.random() * 3),
                    intelligenceGathered: prev.intelligenceGathered + Math.floor(Math.random() * 5),
                    threatLevel: Math.min(100, Math.max(0, prev.threatLevel + (Math.random() - 0.5) * 10))
                }));
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [system]);

    if (!system) {
        return (
            <NeaCard>
                <div className="p-12 text-center">
                    <Ghost className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Aucun système Chimère déployé
                    </p>
                </div>
            </NeaCard>
        );
    }

    const versionConfig = VERSION_CONFIG[system.version] || VERSION_CONFIG.v1;
    const statusConfig = STATUS_CONFIG[system.status] || STATUS_CONFIG.Dormant;
    const StatusIcon = statusConfig.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <NeaCard>
                <div className="p-6 space-y-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-lg ${versionConfig.bg} flex items-center justify-center`}>
                                <Ghost className={`w-8 h-8 ${versionConfig.color}`} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                    {versionConfig.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {versionConfig.description}
                                </p>
                            </div>
                        </div>
                        <Badge className={`${statusConfig.bg} ${statusConfig.color} border-0 flex items-center gap-2`}>
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig.label}
                        </Badge>
                    </div>

                    {system.status === 'Active' && (
                        <div className="grid md:grid-cols-3 gap-4">
                            <NeaCard className="p-4 bg-[var(--nea-bg-surface-hover)]">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                    Attaques Capturées
                                </p>
                                <p className="text-3xl font-bold text-blue-400">
                                    {stats.attacksCaptured}
                                </p>
                            </NeaCard>
                            <NeaCard className="p-4 bg-[var(--nea-bg-surface-hover)]">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                    Intelligence Collectée
                                </p>
                                <p className="text-3xl font-bold text-purple-400">
                                    {stats.intelligenceGathered}
                                </p>
                            </NeaCard>
                            <NeaCard className="p-4 bg-[var(--nea-bg-surface-hover)]">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                    Niveau de Menace
                                </p>
                                <p className={`text-3xl font-bold ${
                                    stats.threatLevel > 70 ? 'text-red-400' :
                                    stats.threatLevel > 40 ? 'text-yellow-400' :
                                    'text-green-400'
                                }`}>
                                    {stats.threatLevel.toFixed(0)}%
                                </p>
                            </NeaCard>
                        </div>
                    )}

                    {system.attacker_ip && (
                        <div className="pt-4 border-t border-[var(--nea-border-subtle)]">
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-1">IP Cible</p>
                                    <p className="text-gray-900 dark:text-white font-mono">
                                        {system.attacker_ip}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-1">Signature d'Attaque</p>
                                    <p className="text-gray-900 dark:text-white font-mono truncate">
                                        {system.attack_signature}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {system.echo_chamber_active && (
                        <div className="pt-4 border-t border-[var(--nea-border-subtle)]">
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                🌀 Labyrinthe d'Échos Actif
                            </Badge>
                            {system.decoy_pages_generated > 0 && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                                    {system.decoy_pages_generated} pages de diversion générées
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </NeaCard>
        </motion.div>
    );
}