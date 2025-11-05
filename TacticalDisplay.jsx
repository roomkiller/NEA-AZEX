import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Target, Activity, Zap, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import LiveActivityFeed from '../components/tactical/LiveActivityFeed';
import MetricsPanel from '../components/tactical/MetricsPanel';
import SystemStatus from '../components/tactical/SystemStatus';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';

export default function TacticalDisplay() {
    const [tacticalLogs, setTacticalLogs] = useState([]);
    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [logsData, modulesData] = await Promise.all([
                    base44.entities.TacticalLog.list('-timestamp', 20),
                    base44.entities.Module.list()
                ]);
                setTacticalLogs(logsData);
                setModules(modulesData);
            } catch (error) {
                console.error("Erreur chargement données tactiques:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();

        // Auto-refresh toutes les 30 secondes
        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, []);

    const stats = useMemo(() => {
        const successOps = tacticalLogs.filter(log => log.status === 'Success').length;
        const warningOps = tacticalLogs.filter(log => log.status === 'Warning').length;
        const errorOps = tacticalLogs.filter(log => log.status === 'Error').length;
        const processingOps = tacticalLogs.filter(log => log.status === 'Processing').length;

        const avgDuration = tacticalLogs.length > 0 && tacticalLogs.filter(log => log.metrics?.duration_ms).length > 0
            ? Math.round(
                tacticalLogs
                    .filter(log => log.metrics?.duration_ms)
                    .reduce((sum, log) => sum + log.metrics.duration_ms, 0) / 
                tacticalLogs.filter(log => log.metrics?.duration_ms).length
              )
            : 0;

        const avgAccuracy = tacticalLogs.length > 0 && tacticalLogs.filter(log => log.metrics?.accuracy).length > 0
            ? Math.round(
                tacticalLogs
                    .filter(log => log.metrics?.accuracy)
                    .reduce((sum, log) => sum + log.metrics.accuracy, 0) / 
                tacticalLogs.filter(log => log.metrics?.accuracy).length * 10
              ) / 10
            : 0;

        const avgCPU = tacticalLogs.length > 0 && tacticalLogs.filter(log => log.metrics?.cpu_usage).length > 0
            ? Math.round(
                tacticalLogs
                    .filter(log => log.metrics?.cpu_usage)
                    .reduce((sum, log) => sum + log.metrics.cpu_usage, 0) / 
                tacticalLogs.filter(log => log.metrics?.cpu_usage).length * 10
              ) / 10
            : 0;

        return {
            totalOps: tacticalLogs.length,
            successOps,
            warningOps,
            errorOps,
            processingOps,
            avgDuration,
            avgAccuracy,
            avgCPU,
            activeModules: modules.filter(m => m.status === 'Active').length,
            totalModules: modules.length
        };
    }, [tacticalLogs, modules]);

    const recentActivity = useMemo(() => {
        return tacticalLogs.slice(0, 10);
    }, [tacticalLogs]);

    if (isLoading) {
        return <LoadingTransition message="Chargement de l'affichage tactique..." />;
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Affichage Tactique", href: "TacticalDisplay" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Target className="w-8 h-8 text-blue-400" />}
                    title="Affichage Tactique"
                    subtitle="Surveillance en temps réel des opérations système"
                />
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-5 h-5 text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Opérations Totales</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">{stats.totalOps}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Succès</p>
                    </div>
                    <p className="text-3xl font-bold text-green-400">{stats.successOps}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Avertissements</p>
                    </div>
                    <p className="text-3xl font-bold text-yellow-400">{stats.warningOps}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Erreurs</p>
                    </div>
                    <p className="text-3xl font-bold text-red-400">{stats.errorOps}</p>
                </NeaCard>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            Métriques de Performance
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center p-6 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                                <p className="text-3xl font-bold text-blue-400">{stats.avgDuration}ms</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Durée Moyenne
                                </p>
                            </div>

                            <div className="text-center p-6 bg-green-500/10 rounded-lg border border-green-500/20">
                                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                                <p className="text-3xl font-bold text-green-400">{stats.avgAccuracy}%</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Précision Moyenne
                                </p>
                            </div>

                            <div className="text-center p-6 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                <Activity className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                                <p className="text-3xl font-bold text-purple-400">{stats.avgCPU}%</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Utilisation CPU
                                </p>
                            </div>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>

            {/* System Status */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-cyan-400" />
                            Statut des Modules
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="mb-4 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Modules Opérationnels
                            </p>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-4xl font-bold text-green-400">
                                    {stats.activeModules}
                                </span>
                                <span className="text-2xl text-gray-600 dark:text-gray-400">
                                    / {stats.totalModules}
                                </span>
                            </div>
                            <Badge className="mt-2 bg-green-500/20 text-green-400 border-0">
                                {Math.round((stats.activeModules / stats.totalModules) * 100)}% opérationnel
                            </Badge>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>

            {/* Activité Récente */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-400" />
                                Activité Récente
                            </h3>
                            <Badge className="bg-blue-500/20 text-blue-400 border-0">
                                Dernières 10 opérations
                            </Badge>
                        </div>
                    </div>
                    <div className="p-6">
                        {recentActivity.length === 0 ? (
                            <div className="text-center py-12">
                                <Activity className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">
                                    Aucune activité récente
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentActivity.map((log, index) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)] hover:border-[var(--nea-primary-blue)] transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge className="bg-gray-500/20 text-gray-400 border-0 text-xs">
                                                        {log.module_name}
                                                    </Badge>
                                                    <Badge className={`border-0 text-xs ${
                                                        log.status === 'Success' ? 'bg-green-500/20 text-green-400' :
                                                        log.status === 'Warning' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        log.status === 'Error' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                        {log.status}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        {log.operation_type}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-[var(--nea-text-primary)] font-medium">
                                                    {log.message}
                                                </p>
                                            </div>
                                            {log.timestamp && (
                                                <span className="text-xs text-[var(--nea-text-muted)] ml-4">
                                                    {new Date(log.timestamp).toLocaleTimeString('fr-CA')}
                                                </span>
                                            )}
                                        </div>

                                        {log.metrics && (
                                            <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-[var(--nea-border-subtle)]">
                                                {log.metrics.duration_ms !== undefined && (
                                                    <div className="text-center">
                                                        <p className="text-xs text-[var(--nea-text-secondary)]">Durée</p>
                                                        <p className="text-sm font-semibold text-[var(--nea-text-primary)]">
                                                            {log.metrics.duration_ms}ms
                                                        </p>
                                                    </div>
                                                )}
                                                {log.metrics.accuracy !== undefined && (
                                                    <div className="text-center">
                                                        <p className="text-xs text-[var(--nea-text-secondary)]">Précision</p>
                                                        <p className="text-sm font-semibold text-green-400">
                                                            {log.metrics.accuracy}%
                                                        </p>
                                                    </div>
                                                )}
                                                {log.metrics.cpu_usage !== undefined && (
                                                    <div className="text-center">
                                                        <p className="text-xs text-[var(--nea-text-secondary)]">CPU</p>
                                                        <p className={`text-sm font-semibold ${
                                                            log.metrics.cpu_usage > 80 ? 'text-red-400' :
                                                            log.metrics.cpu_usage > 60 ? 'text-yellow-400' :
                                                            'text-green-400'
                                                        }`}>
                                                            {log.metrics.cpu_usage}%
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </NeaCard>
            </motion.div>

            {/* Opérations par Type */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                            Répartition par Type d'Opération
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {['Analyse', 'Prédiction', 'Surveillance', 'Transmission', 'Correction', 'Optimisation'].map(type => {
                                const count = tacticalLogs.filter(log => log.operation_type === type).length;
                                if (count === 0) return null;
                                
                                return (
                                    <div 
                                        key={type}
                                        className="text-center p-4 bg-[var(--nea-bg-surface-hover)] rounded-lg border border-[var(--nea-border-subtle)]"
                                    >
                                        <p className="text-2xl font-bold text-[var(--nea-primary-blue)]">{count}</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{type}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </NeaCard>
            </motion.div>
        </motion.div>
    );
}