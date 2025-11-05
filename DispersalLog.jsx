import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { ListCollapse, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const EVENT_TYPE_CONFIG = {
    Dispersal: {
        icon: ListCollapse,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        label: 'Dispersion'
    },
    Sync: {
        icon: CheckCircle,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        label: 'Synchronisation'
    },
    Error: {
        icon: XCircle,
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        label: 'Erreur'
    },
    Warning: {
        icon: AlertTriangle,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        label: 'Avertissement'
    }
};

export default function DispersalLog({ logs = [] }) {
    if (logs.length === 0) {
        return (
            <NeaCard>
                <div className="p-8 text-center">
                    <ListCollapse className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Aucun événement enregistré
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Les événements de dispersion seront affichés ici
                    </p>
                </div>
            </NeaCard>
        );
    }

    return (
        <NeaCard className="bg-black border-[var(--nea-border-default)]">
            <div className="p-4 border-b border-[var(--nea-border-default)] flex items-center justify-between">
                <h3 className="text-cyan-400 font-mono text-xs flex items-center gap-2">
                    <ListCollapse className="w-4 h-4" />
                    Journal de Dispersion
                </h3>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                    {logs.length} événements
                </Badge>
            </div>

            <div className="p-4 h-[500px] overflow-y-auto font-mono text-xs space-y-2 styled-scrollbar">
                <AnimatePresence>
                    {logs.map((log, index) => {
                        const eventConfig = EVENT_TYPE_CONFIG[log.event_type] || EVENT_TYPE_CONFIG.Dispersal;
                        const EventIcon = eventConfig.icon;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className={`p-3 rounded border ${eventConfig.bg} border-[var(--nea-border-subtle)] hover:border-cyan-500/30 transition-colors`}
                            >
                                <div className="flex items-start gap-3">
                                    <EventIcon className={`w-4 h-4 ${eventConfig.color} flex-shrink-0 mt-0.5`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <Badge className={`${eventConfig.bg} ${eventConfig.color} border-0 text-xs`}>
                                                {eventConfig.label}
                                            </Badge>
                                            <span className="text-gray-600 dark:text-gray-500 text-xs">
                                                {new Date(log.timestamp).toLocaleString('fr-CA')}
                                            </span>
                                        </div>
                                        <p className={`${eventConfig.color} mb-2`}>
                                            {log.message}
                                        </p>
                                        {log.details && (
                                            <div className="bg-[var(--nea-bg-surface)]/30 rounded p-2 text-gray-400">
                                                {log.details}
                                            </div>
                                        )}
                                        {log.fragment_id && (
                                            <div className="mt-2 text-gray-600 dark:text-gray-400">
                                                Fragment: <span className="text-cyan-400">#{log.fragment_id}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </NeaCard>
    );
}