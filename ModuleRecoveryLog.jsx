import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { History, CheckCircle, XCircle, AlertTriangle, Info, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ModuleRecoveryLog({ logs }) {
    const getIconForType = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-4 h-4 text-green-400" />;
            case 'error':
                return <XCircle className="w-4 h-4 text-red-400" />;
            case 'warning':
                return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
            case 'info':
            default:
                return <Info className="w-4 h-4 text-blue-400" />;
        }
    };

    const getBadgeColor = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-500/20 text-green-400';
            case 'error':
                return 'bg-red-500/20 text-red-400';
            case 'warning':
                return 'bg-yellow-500/20 text-yellow-400';
            case 'info':
            default:
                return 'bg-blue-500/20 text-blue-400';
        }
    };

    if (logs.length === 0) {
        return (
            <NeaCard className="p-12 text-center">
                <History className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Aucun journal d'activité
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Les opérations de récupération seront enregistrées ici
                </p>
            </NeaCard>
        );
    }

    return (
        <NeaCard>
            <div className="p-4 border-b border-[var(--nea-border-default)]">
                <div className="flex items-center gap-3">
                    <History className="w-6 h-6 text-cyan-400" />
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                            Journal de Récupération ({logs.length})
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Historique complet des opérations de restauration
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="p-6">
                <div className="space-y-3 max-h-[600px] overflow-y-auto styled-scrollbar">
                    <AnimatePresence mode="popLayout">
                        {logs.map((log, index) => (
                            <motion.div
                                key={index}
                                layout
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                        {getIconForType(log.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className={`${getBadgeColor(log.type)} border-0 text-xs`}>
                                                {log.type.toUpperCase()}
                                            </Badge>
                                            <span className="flex items-center gap-1 text-xs text-[var(--nea-text-secondary)]">
                                                <Clock className="w-3 h-3" />
                                                {formatDistanceToNow(new Date(log.timestamp), { 
                                                    addSuffix: true,
                                                    locale: fr 
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--nea-text-primary)] break-words">
                                            {log.message}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </NeaCard>
    );
}