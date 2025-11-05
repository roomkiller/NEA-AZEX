
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Database, Cpu, HardDrive, TrendingUp, RefreshCw } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStaggerAnimation } from '../components/navigation/PageTransition';
import { useOptimization } from '../components/performance/OptimizationProvider';
import { formatLargeNumber, formatPercentage } from '../components/utils/NumberFormatter';
import StatsCard from '../components/ui/StatsCard';

export default function PerformanceMonitoring() {
    const [performanceData, setPerformanceData] = useState({
        memory: { used: 0, total: 0 },
        fps: 60,
        loadTime: 0,
        apiLatency: 0,
        bundleSize: 0
    });
    const [cacheStats, setCacheStats] = useState(null);
    const { containerVariants, itemVariants } = useStaggerAnimation();
    const optimization = useOptimization(); // Get the full optimization object
    const { metrics, isLowPowerMode, toggleLowPowerMode, clearAllCaches } = optimization; // Destructure for convenience

    useEffect(() => {
        const updateInitialAndPeriodicData = () => {
            // Update Memory usage
            if (performance.memory) {
                setPerformanceData(prev => ({
                    ...prev,
                    memory: {
                        used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                        total: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
                    }
                }));
            }

            // Update Load Time (only makes sense once on initial load, but included here for "Actualiser" button logic consistency if triggered)
            if (performance.timing) {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                setPerformanceData(prev => ({ ...prev, loadTime }));
            }

            // Update Cache Stats from optimization context
            if (optimization && optimization.getCacheStats) {
                setCacheStats(optimization.getCacheStats());
            }
        };

        // Call once initially
        updateInitialAndPeriodicData();

        // Set up interval for periodic updates (memory, cache stats)
        const interval = setInterval(updateInitialAndPeriodicData, 2000);

        // FPS measurement (continuous loop using requestAnimationFrame)
        let animationFrameId;
        let lastTimeFPS = performance.now();
        let frames = 0;
        const measureFPS = () => {
            frames++;
            const currentTime = performance.now();
            if (currentTime >= lastTimeFPS + 1000) {
                setPerformanceData(prev => ({ ...prev, fps: frames }));
                frames = 0;
                lastTimeFPS = currentTime;
            }
            animationFrameId = requestAnimationFrame(measureFPS);
        };
        animationFrameId = requestAnimationFrame(measureFPS); // Start the FPS loop

        // Cleanup function for useEffect
        return () => {
            clearInterval(interval); // Clear the periodic data update interval
            cancelAnimationFrame(animationFrameId); // Cancel the FPS animation frame loop
        };
    }, [optimization]); // Depend on optimization object

    const updatePerformanceData = () => {
        // This function is triggered by the "Actualiser" button
        // It updates memory, load time, and cache stats on demand.
        // FPS is handled by a separate requestAnimationFrame loop and doesn't need to be triggered here.

        // Update Memory
        if (performance.memory) {
            setPerformanceData(prev => ({
                ...prev,
                memory: {
                    used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                    total: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
                }
            }));
        }

        // Update Load Time
        if (performance.timing) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            setPerformanceData(prev => ({ ...prev, loadTime }));
        }

        // Update Cache Stats
        if (optimization && optimization.getCacheStats) {
            setCacheStats(optimization.getCacheStats());
        }
    };

    const handleClearCache = async () => {
        await optimization.clearAllCaches();
        setCacheStats(optimization.getCacheStats());
    };

    const memoryUsagePercent = performanceData.memory.total > 0
        ? (performanceData.memory.used / performanceData.memory.total) * 100
        : 0;

    const getHealthColor = (value, thresholds) => {
        if (value >= thresholds.good) return 'text-green-400';
        if (value >= thresholds.warning) return 'text-yellow-400';
        return 'text-red-400';
    };

    const performanceStats = useMemo(() => {
        const currentOptimizationCacheStats = optimization?.getCacheStats();
        return {
            cacheHits: currentOptimizationCacheStats?.memoryCacheSize || 0,
            queueSize: currentOptimizationCacheStats?.writeQueueSize || 0,
            avgResponseTime: metrics?.averageResponseTime || 0,
            apiCallCount: metrics?.apiCallCount || 0,
            cacheEfficiency: currentOptimizationCacheStats?.memoryCacheSize > 0 ?
                Math.min(100, (currentOptimizationCacheStats.memoryCacheSize / (currentOptimizationCacheStats.memoryCacheSize + 10)) * 100) : 0
        };
    }, [optimization, metrics]);

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[
                    { name: "Performance" },
                    { name: "Monitoring Performance", href: "PerformanceMonitoring" }
                ]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Zap className="w-8 h-8 text-yellow-400" />}
                    title="Monitoring Performance"
                    subtitle="Surveillance des performances système en temps réel"
                    actions={
                        <div className="flex gap-2">
                            <NeaButton
                                variant="secondary"
                                onClick={toggleLowPowerMode}
                                size="sm"
                            >
                                {isLowPowerMode ? 'Désactiver' : 'Activer'} Mode Économie
                            </NeaButton>
                            <NeaButton
                                variant="secondary"
                                onClick={updatePerformanceData}
                                size="sm"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Actualiser
                            </NeaButton>
                        </div>
                    }
                />
            </motion.div>

            {/* Performance Stats */}
            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Cache Mémoire"
                        value={performanceStats.cacheHits}
                        icon={Database}
                        iconColor="text-purple-400"
                        iconBg="from-purple-500/20 to-purple-600/30"
                        borderColor="border-purple-500/30"
                        valueColor="text-purple-400"
                        subtitle="entrées"
                        size="default"
                    />

                    <StatsCard
                        title="Efficacité Cache"
                        value={performanceStats.cacheEfficiency}
                        unit="%"
                        icon={Zap}
                        iconColor="text-green-400"
                        iconBg="from-green-500/20 to-green-600/30"
                        borderColor="border-green-500/30"
                        valueColor="text-green-400"
                        trend={performanceStats.cacheEfficiency >= 80 ? "up" : "neutral"}
                        trendValue={performanceStats.cacheEfficiency >= 80 ? 2.5 : 0}
                        size="default"
                    />

                    <StatsCard
                        title="Temps Réponse Moy."
                        value={performanceStats.avgResponseTime}
                        unit="ms"
                        icon={Activity}
                        iconColor="text-blue-400"
                        iconBg="from-blue-500/20 to-blue-600/30"
                        borderColor="border-blue-500/30"
                        valueColor="text-blue-400"
                        trend={performanceStats.avgResponseTime < 200 ? "down" : "up"}
                        trendValue={performanceStats.avgResponseTime < 200 ? -5 : 3}
                        size="default"
                    />

                    <StatsCard
                        title="Appels API"
                        value={performanceStats.apiCallCount}
                        icon={Activity}
                        iconColor="text-cyan-400"
                        iconBg="from-cyan-500/20 to-cyan-600/30"
                        borderColor="border-cyan-500/30"
                        valueColor="text-cyan-400"
                        compact={true}
                        subtitle="aujourd'hui"
                        size="default"
                    />
                </div>
            </motion.div>

            {isLowPowerMode && (
                <motion.div variants={itemVariants}>
                    <NeaCard className="p-4 bg-yellow-500/10 border-yellow-500/30">
                        <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            <p className="text-sm text-yellow-400">
                                Mode Économie d'Énergie activé - Animations réduites, qualité des images optimisée
                            </p>
                        </div>
                    </NeaCard>
                </motion.div>
            )}

            <motion.div variants={itemVariants} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <NeaCard className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5">
                    <div className="flex items-center gap-3 mb-3">
                        <Activity className="w-5 h-5 text-green-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">FPS</p>
                    </div>
                    <p className={`text-3xl font-bold ${getHealthColor(performanceData.fps, { good: 55, warning: 30 })}`}>
                        {performanceData.fps}
                    </p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                        Images par seconde
                    </p>
                </NeaCard>

                <NeaCard className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                    <div className="flex items-center gap-3 mb-3">
                        <HardDrive className="w-5 h-5 text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Mémoire</p>
                    </div>
                    <p className={`text-3xl font-bold ${getHealthColor(100 - memoryUsagePercent, { good: 50, warning: 20 })}`}>
                        {performanceData.memory.used} MB
                    </p>
                    <Progress value={memoryUsagePercent} className="h-2 mt-2" />
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                        {performanceData.memory.total} MB disponible
                    </p>
                </NeaCard>

                <NeaCard className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                    <div className="flex items-center gap-3 mb-3">
                        <Cpu className="w-5 h-5 text-purple-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Temps de Chargement</p>
                    </div>
                    <p className={`text-3xl font-bold ${getHealthColor(5000 - performanceData.loadTime, { good: 3000, warning: 1000 })}`}>
                        {(performanceData.loadTime / 1000).toFixed(2)}s
                    </p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                        Page initiale
                    </p>
                </NeaCard>

                <NeaCard className="p-4 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5">
                    <div className="flex items-center gap-3 mb-3">
                        <Database className="w-5 h-5 text-cyan-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Cache</p>
                    </div>
                    <p className="text-3xl font-bold text-cyan-400">
                        {cacheStats?.hitRate || '0%'}
                    </p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                        Taux de réussite
                    </p>
                </NeaCard>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)]">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Database className="w-5 h-5 text-cyan-400" />
                                Statistiques du Cache
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {cacheStats && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[var(--nea-text-secondary)]">Succès (Hits)</span>
                                        <Badge className="bg-green-500/20 text-green-400 border-0">
                                            {cacheStats.hits}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[var(--nea-text-secondary)]">Échecs (Misses)</span>
                                        <Badge className="bg-red-500/20 text-red-400 border-0">
                                            {cacheStats.misses}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[var(--nea-text-secondary)]">Taille mémoire</span>
                                        <Badge className="bg-blue-500/20 text-blue-400 border-0">
                                            {cacheStats.memoryCacheSize} entrées
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[var(--nea-text-secondary)]">Taux de réussite</span>
                                        <Badge className="bg-purple-500/20 text-purple-400 border-0">
                                            {cacheStats.hitRate}
                                        </Badge>
                                    </div>
                                    <NeaButton
                                        onClick={handleClearCache}
                                        variant="destructive"
                                        className="w-full mt-4"
                                    >
                                        Vider tout le cache
                                    </NeaButton>
                                </>
                            )}
                        </div>
                    </NeaCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)]">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                                Recommandations d'Optimisation
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            {performanceData.fps < 55 && (
                                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                                    <p className="text-sm text-yellow-400 font-semibold mb-1">
                                        ⚠️ FPS faible détecté
                                    </p>
                                    <p className="text-xs text-[var(--nea-text-secondary)]">
                                        Activez le mode économie d'énergie pour améliorer les performances
                                    </p>
                                </div>
                            )}
                            {memoryUsagePercent > 80 && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                                    <p className="text-sm text-red-400 font-semibold mb-1">
                                        🔴 Utilisation mémoire élevée
                                    </p>
                                    <p className="text-xs text-[var(--nea-text-secondary)]">
                                        Fermez des onglets ou redémarrez l'application
                                    </p>
                                </div>
                            )}
                            {cacheStats && parseFloat(cacheStats.hitRate) < 50 && (
                                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                                    <p className="text-sm text-blue-400 font-semibold mb-1">
                                        ℹ️ Cache peu efficace
                                    </p>
                                    <p className="text-xs text-[var(--nea-text-secondary)]">
                                        Le cache se remplit progressivement lors de l'utilisation
                                    </p>
                                </div>
                            )}
                            {performanceData.fps >= 55 && memoryUsagePercent < 80 && cacheStats && parseFloat(cacheStats.hitRate) >= 50 && (
                                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                                    <p className="text-sm text-green-400 font-semibold mb-1">
                                        ✅ Performances optimales
                                    </p>
                                    <p className="text-xs text-[var(--nea-text-secondary)]">
                                        Le système fonctionne de manière optimale
                                    </p>
                                </div>
                            )}
                        </div>
                    </NeaCard>
                </motion.div>
            </div>
        </motion.div>
    );
}
