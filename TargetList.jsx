import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { ListFilter, Target, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TARGET_STATUS_CONFIG = {
    Identified: {
        icon: Target,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        label: 'Identifiée'
    },
    Validated: {
        icon: CheckCircle,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        label: 'Validée'
    },
    Pending: {
        icon: Clock,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        label: 'En attente'
    },
    HighThreat: {
        icon: AlertTriangle,
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        label: 'Menace Élevée'
    }
};

const PRIORITY_CONFIG = {
    Critical: { color: 'text-red-400', bg: 'bg-red-500/10' },
    High: { color: 'text-orange-400', bg: 'bg-orange-500/10' },
    Medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    Low: { color: 'text-blue-400', bg: 'bg-blue-500/10' }
};

export default function TargetList({ targets = [] }) {
    if (targets.length === 0) {
        return (
            <NeaCard>
                <div className="p-8 text-center">
                    <ListFilter className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Aucune cible identifiée
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Les cibles seront ajoutées automatiquement par le système
                    </p>
                </div>
            </NeaCard>
        );
    }

    return (
        <NeaCard>
            <div className="p-4 border-b border-[var(--nea-border-default)]">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-red-400" />
                        Liste des Cibles
                    </h3>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        {targets.length} cibles
                    </Badge>
                </div>
            </div>

            <div className="p-6 space-y-3 max-h-[600px] overflow-y-auto styled-scrollbar">
                <AnimatePresence>
                    {targets.map((target, index) => {
                        const statusConfig = TARGET_STATUS_CONFIG[target.status] || TARGET_STATUS_CONFIG.Pending;
                        const priorityConfig = PRIORITY_CONFIG[target.priority] || PRIORITY_CONFIG.Medium;
                        const StatusIcon = statusConfig.icon;
                        const threatLevel = target.threat_level || 0;

                        return (
                            <motion.div
                                key={target.id || index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                                className={`p-4 rounded-lg border ${statusConfig.bg} border-[var(--nea-border-default)] hover:border-red-500/30 transition-all`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`w-8 h-8 rounded-lg ${statusConfig.bg} flex items-center justify-center flex-shrink-0`}>
                                            <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">
                                                {target.target_name || `Cible #${index + 1}`}
                                            </h4>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge className={`${statusConfig.bg} ${statusConfig.color} border-0 text-xs`}>
                                                    {statusConfig.label}
                                                </Badge>
                                                <Badge className={`${priorityConfig.bg} ${priorityConfig.color} border-0 text-xs`}>
                                                    {target.priority}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {target.description && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                        {target.description}
                                    </p>
                                )}

                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    {target.ip_address && (
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400 mb-1">IP</p>
                                            <p className="text-gray-900 dark:text-white font-mono">
                                                {target.ip_address}
                                            </p>
                                        </div>
                                    )}
                                    {target.location && (
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400 mb-1">Localisation</p>
                                            <p className="text-gray-900 dark:text-white">
                                                {target.location}
                                            </p>
                                        </div>
                                    )}
                                    {threatLevel > 0 && (
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400 mb-1">Niveau de Menace</p>
                                            <p className={`font-bold ${
                                                threatLevel >= 80 ? 'text-red-400' :
                                                threatLevel >= 60 ? 'text-orange-400' :
                                                threatLevel >= 40 ? 'text-yellow-400' :
                                                'text-blue-400'
                                            }`}>
                                                {threatLevel}%
                                            </p>
                                        </div>
                                    )}
                                    {target.identified_date && (
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-400 mb-1">Identifiée le</p>
                                            <p className="text-gray-900 dark:text-white">
                                                {new Date(target.identified_date).toLocaleDateString('fr-CA')}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {target.vulnerabilities && target.vulnerabilities.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-[var(--nea-border-subtle)]">
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                            Vulnérabilités Détectées:
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {target.vulnerabilities.map((vuln, idx) => (
                                                <Badge
                                                    key={idx}
                                                    className="bg-red-500/10 text-red-400 border-red-500/30 border text-xs"
                                                >
                                                    {vuln}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </NeaCard>
    );
}