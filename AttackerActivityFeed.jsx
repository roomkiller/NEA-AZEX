import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { Terminal, Activity, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AttackerActivityFeed({ activityLog = [] }) {
    const [logs, setLogs] = useState(activityLog);

    useEffect(() => {
        setLogs(activityLog);
    }, [activityLog]);

    const getCommandColor = (command) => {
        const dangerousCommands = ['rm', 'delete', 'drop', 'format', 'exploit'];
        if (dangerousCommands.some(cmd => command.toLowerCase().includes(cmd))) {
            return 'text-red-400';
        }
        if (command.toLowerCase().includes('scan') || command.toLowerCase().includes('probe')) {
            return 'text-yellow-400';
        }
        return 'text-blue-400';
    };

    return (
        <NeaCard className="bg-black border-[var(--nea-border-default)]">
            <div className="p-4 border-b border-[var(--nea-border-default)] flex items-center justify-between">
                <h3 className="text-red-400 font-mono text-xs flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    Activité Attaquant • Live Feed
                </h3>
                {logs.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-red-400 animate-pulse" />
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                            {logs.length} actions
                        </Badge>
                    </div>
                )}
            </div>

            <div className="p-4 h-[500px] overflow-y-auto font-mono text-xs space-y-3 styled-scrollbar">
                {logs.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">
                        En attente d'activité...
                    </p>
                ) : (
                    <AnimatePresence>
                        {logs.map((log, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="p-3 bg-[var(--nea-bg-surface)]/30 rounded border border-[var(--nea-border-subtle)] hover:border-red-500/30 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <span className="text-gray-600 dark:text-gray-500 text-xs">
                                        [{new Date(log.timestamp).toLocaleTimeString('fr-CA')}]
                                    </span>
                                    {log.annotation && (
                                        <Badge className="bg-purple-500/20 text-purple-400 border-0 text-xs">
                                            IA Analyse
                                        </Badge>
                                    )}
                                </div>

                                <div className="mb-2">
                                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                                        Commande:
                                    </p>
                                    <p className={`font-bold ${getCommandColor(log.command)}`}>
                                        {log.command}
                                    </p>
                                </div>

                                {log.response && (
                                    <div className="mb-2">
                                        <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                                            Réponse:
                                        </p>
                                        <p className="text-green-400">
                                            {log.response}
                                        </p>
                                    </div>
                                )}

                                {log.annotation && (
                                    <div className="mt-3 pt-3 border-t border-[var(--nea-border-subtle)]">
                                        <div className="flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-purple-400 font-semibold text-xs mb-1">
                                                    Analyse IA:
                                                </p>
                                                <p className="text-gray-400 text-xs leading-relaxed">
                                                    {log.annotation}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </NeaCard>
    );
}