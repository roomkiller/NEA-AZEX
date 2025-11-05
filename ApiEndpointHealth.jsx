import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import NeaCard from '../ui/NeaCard';
import { Link, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';

const STATUS_CONFIG = {
    Healthy: {
        icon: CheckCircle,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        label: 'Sain'
    },
    Degraded: {
        icon: AlertTriangle,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        label: 'Dégradé'
    },
    Down: {
        icon: XCircle,
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        label: 'Hors Service'
    },
    Unknown: {
        icon: Clock,
        color: 'text-gray-400',
        bg: 'bg-gray-500/10',
        label: 'Inconnu'
    }
};

export default function ApiEndpointHealth({ endpoints = [] }) {
    if (endpoints.length === 0) {
        return (
            <NeaCard>
                <div className="p-8 text-center">
                    <Link className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Aucun endpoint API configuré
                    </p>
                </div>
            </NeaCard>
        );
    }

    const healthyCount = endpoints.filter(e => e.status === 'Healthy').length;
    const healthPercentage = ((healthyCount / endpoints.length) * 100).toFixed(0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <NeaCard>
                <div className="p-4 border-b border-[var(--nea-border-default)]">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Link className="w-5 h-5 text-[var(--nea-primary-blue)]" />
                            Santé des API
                        </h3>
                        <div className="flex items-center gap-2">
                            <Badge className={`${
                                healthPercentage >= 90 ? 'bg-green-500/20 text-green-400' :
                                healthPercentage >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                            } border-0`}>
                                {healthPercentage}% Opérationnel
                            </Badge>
                            <Badge className="bg-[var(--nea-primary-blue)]/20 text-[var(--nea-primary-blue)] border-0">
                                {endpoints.length} endpoints
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-3 max-h-[500px] overflow-y-auto styled-scrollbar">
                    <AnimatePresence>
                        {endpoints.map((endpoint, index) => {
                            const statusConfig = STATUS_CONFIG[endpoint.status] || STATUS_CONFIG.Unknown;
                            const StatusIcon = statusConfig.icon;
                            const responseTime = endpoint.response_time_ms || 0;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`p-4 rounded-lg border ${statusConfig.bg} border-[var(--nea-border-default)] hover:border-[var(--nea-primary-blue)] transition-all`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                                                        {endpoint.name}
                                                    </h4>
                                                    <Badge className={`${statusConfig.bg} ${statusConfig.color} border-0 text-xs`}>
                                                        {statusConfig.label}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono truncate">
                                                    {endpoint.path}
                                                </p>
                                            </div>
                                        </div>
                                        {responseTime > 0 && (
                                            <div className="text-right ml-4">
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    Temps de réponse
                                                </p>
                                                <p className={`text-sm font-bold ${
                                                    responseTime < 100 ? 'text-green-400' :
                                                    responseTime < 300 ? 'text-yellow-400' :
                                                    'text-red-400'
                                                }`}>
                                                    {responseTime}ms
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {endpoint.last_check && (
                                        <div className="mt-3 pt-3 border-t border-[var(--nea-border-subtle)] text-xs text-gray-600 dark:text-gray-400">
                                            Dernière vérification: {new Date(endpoint.last_check).toLocaleString('fr-CA')}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </NeaCard>
        </motion.div>
    );
}