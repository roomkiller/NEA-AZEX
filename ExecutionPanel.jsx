import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { Terminal, Activity } from 'lucide-react';

export default function ExecutionPanel({ logs = [], isExecuting = false }) {
    const terminalRef = useRef(null);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <NeaCard className="bg-black border-[var(--nea-border-default)]">
            <div className="p-4 border-b border-[var(--nea-border-default)] flex items-center justify-between">
                <h3 className="text-green-400 font-mono text-xs flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    Terminal Exécution
                </h3>
                {isExecuting && (
                    <div className="flex items-center gap-2 text-green-400 text-xs">
                        <Activity className="w-4 h-4 animate-pulse" />
                        En cours...
                    </div>
                )}
            </div>
            
            <div 
                ref={terminalRef}
                className="p-4 h-[400px] overflow-y-auto font-mono text-xs styled-scrollbar"
            >
                <AnimatePresence>
                    {logs.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400">
                            En attente d'exécution...
                        </p>
                    ) : (
                        logs.map((log, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`mb-1 ${
                                    log.type === 'error' ? 'text-red-400' :
                                    log.type === 'success' ? 'text-green-400' :
                                    log.type === 'warning' ? 'text-yellow-400' :
                                    'text-gray-400'
                                }`}
                            >
                                <span className="text-gray-600 dark:text-gray-500">[{log.timestamp}]</span> {log.message}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
                
                {isExecuting && (
                    <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="text-green-400"
                    >
                        ▊
                    </motion.div>
                )}
            </div>
        </NeaCard>
    );
}