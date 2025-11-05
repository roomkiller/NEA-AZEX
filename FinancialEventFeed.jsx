import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

const EVENT_TYPE_CONFIG = {
    Investment: {
        icon: DollarSign,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        label: 'Investissement'
    },
    Acquisition: {
        icon: CheckCircle,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        label: 'Acquisition'
    },
    Valuation: {
        icon: TrendingUp,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        label: 'Évaluation'
    },
    Alert: {
        icon: AlertCircle,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        label: 'Alerte'
    }
};

export default function FinancialEventFeed({ events = [] }) {
    // S'assurer que events est toujours un tableau
    const safeEvents = Array.isArray(events) ? events : [];

    if (safeEvents.length === 0) {
        return (
            <NeaCard>
                <div className="p-8 text-center">
                    <TrendingUp className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Aucun événement financier récent
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
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        Événements Financiers
                    </h3>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {safeEvents.length} événements
                    </Badge>
                </div>
            </div>

            <div className="p-6 space-y-3 max-h-[500px] overflow-y-auto styled-scrollbar">
                <AnimatePresence>
                    {safeEvents.map((event, index) => {
                        const eventConfig = EVENT_TYPE_CONFIG[event.type] || EVENT_TYPE_CONFIG.Valuation;
                        const EventIcon = eventConfig.icon;
                        const impact = event.impact || 0;
                        const isPositive = impact >= 0;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                                className={`p-4 rounded-lg border ${eventConfig.bg} border-[var(--nea-border-default)] hover:border-[var(--nea-primary-blue)] transition-all`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`w-10 h-10 rounded-lg ${eventConfig.bg} flex items-center justify-center flex-shrink-0`}>
                                            <EventIcon className={`w-5 h-5 ${eventConfig.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                                                {event.title}
                                            </h4>
                                            <Badge className={`${eventConfig.bg} ${eventConfig.color} border-0 text-xs`}>
                                                {eventConfig.label}
                                            </Badge>
                                        </div>
                                    </div>
                                    {impact !== 0 && (
                                        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                            {isPositive ? (
                                                <TrendingUp className="w-5 h-5" />
                                            ) : (
                                                <TrendingDown className="w-5 h-5" />
                                            )}
                                            <span className="text-sm font-bold">
                                                {isPositive ? '+' : ''}{impact}%
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {event.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        {event.description}
                                    </p>
                                )}

                                {event.amount && (
                                    <div className="flex items-center justify-between pt-3 border-t border-[var(--nea-border-subtle)]">
                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                            Montant
                                        </span>
                                        <span className="text-sm font-bold text-green-400">
                                            {event.amount.toLocaleString('fr-CA')} $ CAD
                                        </span>
                                    </div>
                                )}

                                {event.date && (
                                    <div className="text-xs text-gray-600 dark:text-gray-400 text-right mt-2">
                                        {new Date(event.date).toLocaleDateString('fr-CA')}
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