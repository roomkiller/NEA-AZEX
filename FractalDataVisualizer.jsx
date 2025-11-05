import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { Layers, Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const FRAGMENT_STATUS_CONFIG = {
    Active: {
        icon: CheckCircle,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        label: 'Actif'
    },
    Syncing: {
        icon: Layers,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        label: 'Sync'
    },
    Warning: {
        icon: AlertTriangle,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        label: 'Attention'
    },
    Error: {
        icon: XCircle,
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        label: 'Erreur'
    }
};

export default function FractalDataVisualizer({ fragments = [] }) {
    if (fragments.length === 0) {
        return (
            <NeaCard>
                <div className="p-8 text-center">
                    <Layers className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Aucun fragment de données dispersé
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Les fragments seront créés lors de la dispersion
                    </p>
                </div>
            </NeaCard>
        );
    }

    const totalSize = fragments.reduce((sum, f) => sum + (f.size_mb || 0), 0);
    const activeCount = fragments.filter(f => f.status === 'Active').length;

    return (
        <NeaCard>
            <div className="p-4 border-b border-[var(--nea-border-default)]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Layers className="w-5 h-5 text-cyan-400" />
                        <h3 className="font-bold text-gray-900 dark:text-white">
                            Visualisation Fractale
                        </h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                            {fragments.length} fragments
                        </Badge>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            {totalSize.toFixed(2)} MB
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <NeaCard className="p-4 bg-[var(--nea-bg-surface-hover)]">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Fragments</p>
                        <p className="text-2xl font-bold text-cyan-400">{fragments.length}</p>
                    </NeaCard>
                    <NeaCard className="p-4 bg-[var(--nea-bg-surface-hover)]">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Actifs</p>
                        <p className="text-2xl font-bold text-green-400">{activeCount}</p>
                    </NeaCard>
                    <NeaCard className="p-4 bg-[var(--nea-bg-surface-hover)]">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Taille Totale</p>
                        <p className="text-2xl font-bold text-blue-400">{totalSize.toFixed(2)} MB</p>
                    </NeaCard>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto styled-scrollbar">
                    <AnimatePresence>
                        {fragments.map((fragment, index) => {
                            const statusConfig = FRAGMENT_STATUS_CONFIG[fragment.status] || FRAGMENT_STATUS_CONFIG.Active;
                            const StatusIcon = statusConfig.icon;

                            return (
                                <motion.div
                                    key={fragment.id || index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`p-4 rounded-lg border ${statusConfig.bg} border-[var(--nea-border-default)] hover:border-cyan-500/50 transition-all`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg ${statusConfig.bg} flex items-center justify-center`}>
                                                <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                                                    Fragment #{fragment.fragment_id || index + 1}
                                                </h4>
                                                <Badge className={`${statusConfig.bg} ${statusConfig.color} border-0 text-xs mt-1`}>
                                                    {statusConfig.label}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Taille</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                {fragment.size_mb?.toFixed(2) || '0.00'} MB
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                        {fragment.location && (
                                            <div>
                                                <p className="text-gray-600 dark:text-gray-400 mb-1">Emplacement</p>
                                                <p className="text-gray-900 dark:text-white font-mono truncate">
                                                    {fragment.location}
                                                </p>
                                            </div>
                                        )}
                                        {fragment.encryption && (
                                            <div>
                                                <p className="text-gray-600 dark:text-gray-400 mb-1">Chiffrement</p>
                                                <Badge className="bg-cyan-500/20 text-cyan-400 border-0 text-xs">
                                                    {fragment.encryption}
                                                </Badge>
                                            </div>
                                        )}
                                        {fragment.redundancy_level && (
                                            <div>
                                                <p className="text-gray-600 dark:text-gray-400 mb-1">Redondance</p>
                                                <p className="text-gray-900 dark:text-white">{fragment.redundancy_level}x</p>
                                            </div>
                                        )}
                                        {fragment.last_sync && (
                                            <div>
                                                <p className="text-gray-600 dark:text-gray-400 mb-1">Dernière Sync</p>
                                                <p className="text-gray-900 dark:text-white">
                                                    {new Date(fragment.last_sync).toLocaleTimeString('fr-CA')}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {fragment.checksum && (
                                        <div className="mt-3 pt-3 border-t border-[var(--nea-border-subtle)]">
                                            <div className="flex items-center gap-2">
                                                <Shield className="w-4 h-4 text-green-400" />
                                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                                    Checksum:
                                                </span>
                                                <span className="text-xs text-gray-900 dark:text-white font-mono">
                                                    {fragment.checksum.substring(0, 16)}...
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </NeaCard>
    );
}