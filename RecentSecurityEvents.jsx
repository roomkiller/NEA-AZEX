import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Shield, Clock } from 'lucide-react';
import NeaButton from '../ui/NeaButton';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

const SEVERITY_CONFIG = {
    Critique: {
        icon: AlertTriangle,
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        label: 'Critique'
    },
    Élevé: {
        icon: AlertTriangle,
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        label: 'Élevé'
    },
    Moyen: {
        icon: ShieldCheck,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        label: 'Moyen'
    },
    Faible: {
        icon: ShieldCheck,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        label: 'Faible'
    },
    Info: {
        icon: Shield,
        color: 'text-gray-400',
        bg: 'bg-gray-500/10',
        label: 'Info'
    }
};

export default function RecentSecurityEvents({ events = [] }) {
    if (events.length === 0) {
        return (
            <NeaCard>
                <div className="p-8 text-center">
                    <ShieldCheck className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Aucun événement de sécurité récent
                    </p>
                </div>
            </NeaCard>
        );
    }

    const criticalCount = events.filter(e => e.severity === 'Critique').length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <NeaCard>
                <div className="p-4 border-b border-[var(--nea-border-default)]">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Shield className="w-5 h-5 text-red-400" />
                            Événements de Sécurité Récents
                        </h3>
                        <div className="flex items-center gap-2">
                            {criticalCount > 0 && (
                                <Badge className="bg-red-500/20 text-red-400 border-0">
                                    {criticalCount} critiques
                                </Badge>
                            )}
                            <Badge className="bg-[var(--nea-primary-blue)]/20 text-[var(--nea-primary-blue)] border-0">
                                {events.length} événements
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-3 max-h-[500px] overflow-y-auto styled-scrollbar">
                    <AnimatePresence>
                        {events.map((event, index) => {
                            const severityConfig = SEVERITY_CONFIG[event.severity] || SEVERITY_CONFIG.Info;
                            const SeverityIcon = severityConfig.icon;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`p-4 rounded-lg border ${severityConfig.bg} border-[var(--nea-border-default)] hover:border-red-500/30 transition-all`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3 flex-1">
                                            <SeverityIcon className={`w-6 h-6 ${severityConfig.color}`} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                                                        {event.incident_type}
                                                    </h4>
                                                    <Badge className={`${severityConfig.bg} ${severityConfig.color} border-0 text-xs`}>
                                                        {severityConfig.label}
                                                    </Badge>
                                                    {event.blocked && (
                                                        <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                                                            Bloqué
                                                        </Badge>
                                                    )}
                                                </div>
                                                {event.source_ip && (
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                                                        IP: {event.source_ip}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {event.attack_vector && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                            Vecteur: {event.attack_vector}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between pt-3 border-t border-[var(--nea-border-subtle)]">
                                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                            <Clock className="w-3 h-3" />
                                            <span>
                                                {new Date(event.detected_timestamp).toLocaleString('fr-CA')}
                                            </span>
                                        </div>
                                        {event.mitigation_action && (
                                            <Badge className="bg-blue-500/20 text-blue-400 border-0 text-xs">
                                                {event.mitigation_action}
                                            </Badge>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                <div className="p-4 border-t border-[var(--nea-border-default)]">
                    <Link to={createPageUrl('Security')}>
                        <NeaButton variant="secondary" size="sm" className="w-full">
                            Voir tous les incidents →
                        </NeaButton>
                    </Link>
                </div>
            </NeaCard>
        </motion.div>
    );
}