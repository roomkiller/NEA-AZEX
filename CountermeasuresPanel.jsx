import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import NeaButton from '../ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, CheckCircle, Clock, Play, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const STATUS_CONFIG = {
    Recommended: {
        icon: AlertTriangle,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        label: 'Recommandée'
    },
    Active: {
        icon: Zap,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        label: 'Active'
    },
    Pending: {
        icon: Clock,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        label: 'En attente'
    },
    Completed: {
        icon: CheckCircle,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        label: 'Terminée'
    }
};

const PRIORITY_CONFIG = {
    Critical: { color: 'text-red-400', bg: 'bg-red-500/10' },
    High: { color: 'text-orange-400', bg: 'bg-orange-500/10' },
    Medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    Low: { color: 'text-blue-400', bg: 'bg-blue-500/10' }
};

export default function CountermeasuresPanel({ countermeasures = [], onActivate }) {
    if (countermeasures.length === 0) {
        return (
            <NeaCard>
                <div className="p-8 text-center">
                    <Shield className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Aucune contre-mesure disponible
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Les contre-mesures seront générées automatiquement
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
                        <Shield className="w-5 h-5 text-blue-400" />
                        Contre-Mesures
                    </h3>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {countermeasures.length} disponibles
                    </Badge>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <AnimatePresence>
                    {countermeasures.map((measure, index) => {
                        const statusConfig = STATUS_CONFIG[measure.status] || STATUS_CONFIG.Pending;
                        const priorityConfig = PRIORITY_CONFIG[measure.priority] || PRIORITY_CONFIG.Medium;
                        const StatusIcon = statusConfig.icon;
                        const effectiveness = measure.effectiveness || 0;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 rounded-lg border border-[var(--nea-border-default)] bg-[var(--nea-bg-surface-hover)] hover:border-[var(--nea-primary-blue)] transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`w-10 h-10 rounded-lg ${statusConfig.bg} flex items-center justify-center flex-shrink-0`}>
                                            <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                {measure.name}
                                            </h4>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge className={`${statusConfig.bg} ${statusConfig.color} border-0 text-xs`}>
                                                    {statusConfig.label}
                                                </Badge>
                                                <Badge className={`${priorityConfig.bg} ${priorityConfig.color} border-0 text-xs`}>
                                                    Priorité: {measure.priority}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {measure.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        {measure.description}
                                    </p>
                                )}

                                {effectiveness > 0 && (
                                    <div className="mb-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                Efficacité Estimée
                                            </span>
                                            <span className={`text-sm font-bold ${
                                                effectiveness >= 80 ? 'text-green-400' :
                                                effectiveness >= 60 ? 'text-yellow-400' :
                                                'text-red-400'
                                            }`}>
                                                {effectiveness}%
                                            </span>
                                        </div>
                                        <Progress value={effectiveness} className="h-2" />
                                    </div>
                                )}

                                {measure.steps && measure.steps.length > 0 && (
                                    <div className="mb-3 pt-3 border-t border-[var(--nea-border-subtle)]">
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                            Étapes d'Activation:
                                        </p>
                                        <ul className="space-y-1">
                                            {measure.steps.map((step, idx) => (
                                                <li key={idx} className="text-xs text-gray-900 dark:text-white flex items-start gap-2">
                                                    <span className="text-[var(--nea-primary-blue)] font-bold">{idx + 1}.</span>
                                                    <span>{step}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-3 border-t border-[var(--nea-border-subtle)]">
                                    {measure.estimated_duration && (
                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                            Durée: {measure.estimated_duration}
                                        </span>
                                    )}
                                    {measure.status === 'Recommended' && onActivate && (
                                        <NeaButton
                                            size="sm"
                                            onClick={() => onActivate(measure)}
                                        >
                                            <Play className="w-4 h-4 mr-1" />
                                            Activer
                                        </NeaButton>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </NeaCard>
    );
}