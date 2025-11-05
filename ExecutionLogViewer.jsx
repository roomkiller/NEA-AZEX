import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, CheckCircle, XCircle, Clock, Activity } from 'lucide-react';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';

const STATUS_CONFIG = {
    Success: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
    Failed: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
    Running: { icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' }
};

export default function ExecutionLogViewer({ executions = [] }) {
    if (executions.length === 0) {
        return (
            <NeaCard>
                <div className="p-12 text-center">
                    <Terminal className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Aucune exécution enregistrée
                    </p>
                </div>
            </NeaCard>
        );
    }

    return (
        <NeaCard>
            <div className="p-4 border-b border-[var(--nea-border-default)]">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Terminal className="w-5 h-5" />
                    Historique d'Exécution
                </h3>
            </div>
            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto styled-scrollbar">
                {executions.map((exec, index) => {
                    const config = STATUS_CONFIG[exec.status] || STATUS_CONFIG.Running;
                    const StatusIcon = config.icon;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 rounded-lg border ${config.bg} border-[var(--nea-border-default)]`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <StatusIcon className={`w-5 h-5 ${config.color}`} />
                                    <Badge className={`${config.bg} ${config.color} border-0`}>
                                        {exec.status}
                                    </Badge>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {new Date(exec.run_timestamp).toLocaleString('fr-CA')}
                                    </p>
                                    {exec.duration_ms && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Durée: {exec.duration_ms}ms
                                        </p>
                                    )}
                                </div>
                            </div>

                            {exec.output_log && (
                                <div className="mt-3 p-3 bg-black/50 rounded border border-[var(--nea-border-subtle)]">
                                    <pre className="text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
                                        {exec.output_log}
                                    </pre>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </NeaCard>
    );
}