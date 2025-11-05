import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, X, Info, AlertTriangle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NeaCard from '../ui/NeaCard';

/**
 * DEBUG PANEL
 * Panneau de débogage pour les développeurs
 * Affiche les performances, erreurs et warnings en temps réel
 * Activable avec Ctrl + Shift + D
 */
export default function DebugPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({
        fps: 60,
        memory: 0,
        renderTime: 0
    });

    useEffect(() => {
        // Shortcut pour ouvrir/fermer
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        // Surveillance des performances
        let frameCount = 0;
        let lastTime = performance.now();

        const measurePerformance = () => {
            const now = performance.now();
            frameCount++;

            if (now >= lastTime + 1000) {
                setStats(prev => ({
                    ...prev,
                    fps: Math.round((frameCount * 1000) / (now - lastTime))
                }));
                frameCount = 0;
                lastTime = now;
            }

            if (isOpen) {
                requestAnimationFrame(measurePerformance);
            }
        };

        measurePerformance();

        // Mesure mémoire si disponible
        if (performance.memory) {
            const memInterval = setInterval(() => {
                setStats(prev => ({
                    ...prev,
                    memory: Math.round(performance.memory.usedJSHeapSize / 1048576)
                }));
            }, 2000);
            return () => clearInterval(memInterval);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        // Intercepter les console.log, warn, error
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        console.log = (...args) => {
            originalLog(...args);
            addLog('info', args.join(' '));
        };

        console.warn = (...args) => {
            originalWarn(...args);
            addLog('warning', args.join(' '));
        };

        console.error = (...args) => {
            originalError(...args);
            addLog('error', args.join(' '));
        };

        return () => {
            console.log = originalLog;
            console.warn = originalWarn;
            console.error = originalError;
        };
    }, [isOpen]);

    const addLog = (type, message) => {
        setLogs(prev => [
            { type, message, timestamp: new Date().toISOString() },
            ...prev.slice(0, 49) // Keep last 50 logs
        ]);
    };

    const clearLogs = () => setLogs([]);

    if (!isOpen) return null;

    const getLogIcon = (type) => {
        switch (type) {
            case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
            default: return <Info className="w-4 h-4 text-blue-400" />;
        }
    };

    const getLogColor = (type) => {
        switch (type) {
            case 'error': return 'border-red-500/30 bg-red-500/5';
            case 'warning': return 'border-yellow-500/30 bg-yellow-500/5';
            default: return 'border-blue-500/30 bg-blue-500/5';
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-4 right-4 z-[9999] w-96 max-h-[600px] overflow-hidden"
                role="complementary"
                aria-label="Panneau de débogage"
            >
                <NeaCard className="border-2 border-purple-500/30">
                    {/* Header */}
                    <div className="p-4 border-b border-[var(--nea-border-default)] bg-purple-500/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Bug className="w-5 h-5 text-purple-400" />
                                <h3 className="font-bold text-[var(--nea-text-title)]">Debug Panel</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-[var(--nea-bg-surface-hover)] rounded transition-colors"
                                aria-label="Fermer le panneau de débogage"
                            >
                                <X className="w-4 h-4 text-[var(--nea-text-secondary)]" />
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 mt-3">
                            <div className="text-center">
                                <p className="text-xs text-[var(--nea-text-muted)]">FPS</p>
                                <p className={`text-lg font-bold ${stats.fps >= 55 ? 'text-green-400' : stats.fps >= 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {stats.fps}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-[var(--nea-text-muted)]">Memory</p>
                                <p className="text-lg font-bold text-[var(--nea-text-title)]">
                                    {stats.memory}MB
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-[var(--nea-text-muted)]">Logs</p>
                                <p className="text-lg font-bold text-[var(--nea-text-title)]">
                                    {logs.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Logs */}
                    <div className="p-4 max-h-[400px] overflow-y-auto styled-scrollbar">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-[var(--nea-text-primary)]">Console Logs</h4>
                            <Button
                                onClick={clearLogs}
                                size="sm"
                                variant="outline"
                                className="text-xs h-7"
                            >
                                Clear
                            </Button>
                        </div>

                        {logs.length === 0 ? (
                            <div className="text-center py-8 text-[var(--nea-text-muted)] text-sm">
                                Aucun log
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {logs.map((log, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 rounded border ${getLogColor(log.type)}`}
                                    >
                                        <div className="flex items-start gap-2">
                                            {getLogIcon(log.type)}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-[var(--nea-text-primary)] break-words">
                                                    {log.message}
                                                </p>
                                                <p className="text-xs text-[var(--nea-text-muted)] mt-1">
                                                    {new Date(log.timestamp).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-2 border-t border-[var(--nea-border-default)] bg-[var(--nea-bg-surface-hover)]">
                        <p className="text-xs text-[var(--nea-text-muted)] text-center">
                            Press <kbd className="px-1 py-0.5 bg-[var(--nea-bg-deep-space)] border border-[var(--nea-border-default)] rounded text-xs">Ctrl+Shift+D</kbd> to toggle
                        </p>
                    </div>
                </NeaCard>
            </motion.div>
        </AnimatePresence>
    );
}