
import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { HeartPulse, Activity, AlertTriangle, CheckCircle, Database, Cpu, Zap } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { formatLargeNumber, formatDate } from '../components/utils/NumberFormatter';
import StatsCard from '../components/ui/StatsCard';

export default function SystemStatus() {
    const [modules, setModules] = useState([]);
    const [dataSources, setDataSources] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [modulesData, dsData, incidentsData] = await Promise.all([
                    base44.entities.Module.list(),
                    base44.entities.DataSource.list(),
                    base44.entities.SecurityIncident.list('-detected_timestamp', 10)
                ]);
                setModules(modulesData);
                setDataSources(dsData);
                setIncidents(incidentsData);
            } catch (error) {
                console.error("Erreur chargement statut système:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();

        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, []);

    const systemHealth = useMemo(() => {
        const activeModules = modules.filter(m => m.status === 'Active').length;
        const totalModules = modules.length;
        const activeSources = dataSources.filter(ds => ds.status === 'Active').length;
        const totalSources = dataSources.length;
        
        const moduleHealth = totalModules > 0 ? (activeModules / totalModules) * 100 : 0;
        const sourceHealth = totalSources > 0 ? (activeSources / totalSources) * 100 : 0;
        
        // Placeholder/dummy data for new StatsCards as per requirements.
        // In a real application, these would come from an API or other monitoring services.
        const uptime = 99.9; // Example uptime
        const avgLatency = 45; // Example average latency in ms
        const requestsPerMin = 1250; // Example requests per minute
        const errorRate = 0.8; // Example error rate in percentage

        return {
            overallHealthPercentage: Math.round((moduleHealth + sourceHealth) / 2),
            uptime: uptime,
            avgLatency: avgLatency,
            requestsPerMin: requestsPerMin,
            errorRate: errorRate
        };
    }, [modules, dataSources]);

    const stats = useMemo(() => ({
        activeModules: modules.filter(m => m.status === 'Active').length,
        totalModules: modules.length,
        activeSources: dataSources.filter(ds => ds.status === 'Active').length,
        totalSources: dataSources.length,
        recentIncidents: incidents.length,
        criticalIncidents: incidents.filter(i => i.severity === 'Critique').length
    }), [modules, dataSources, incidents]);

    if (isLoading) {
        return <LoadingTransition message="Chargement statut système..." />;
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[
                    { name: "Système" },
                    { name: "Statut Système", href: "SystemStatus" }
                ]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<HeartPulse className="w-8 h-8 text-purple-400" />}
                    title="Statut Système"
                    subtitle="Surveillance de la santé globale NEA-AZEX"
                />
            </motion.div>

            {/* System Health Stats */}
            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Uptime Système"
                        value={systemHealth.uptime}
                        unit="%"
                        icon={HeartPulse}
                        iconColor="text-green-400"
                        iconBg="from-green-500/20 to-green-600/30"
                        borderColor="border-green-500/30"
                        valueColor="text-green-400"
                        trend={systemHealth.uptime >= 99.9 ? "up" : "neutral"}
                        trendValue={0.05}
                        size="default"
                    />

                    <StatsCard
                        title="Latence Moyenne"
                        value={systemHealth.avgLatency}
                        unit="ms"
                        icon={Zap}
                        iconColor="text-blue-400"
                        iconBg="from-blue-500/20 to-blue-600/30"
                        borderColor="border-blue-500/30"
                        valueColor="text-blue-400"
                        trend={systemHealth.avgLatency < 100 ? "down" : "up"}
                        trendValue={systemHealth.avgLatency < 100 ? -2.5 : 5.3}
                        size="default"
                    />

                    <StatsCard
                        title="Requêtes/minute"
                        value={systemHealth.requestsPerMin}
                        icon={Activity}
                        iconColor="text-purple-400"
                        iconBg="from-purple-500/20 to-purple-600/30"
                        borderColor="border-purple-500/30"
                        valueColor="text-purple-400"
                        compact={true}
                        size="default"
                    />

                    <StatsCard
                        title="Taux d'Erreur"
                        value={systemHealth.errorRate}
                        unit="%"
                        icon={AlertTriangle}
                        iconColor={systemHealth.errorRate > 1 ? "text-red-400" : "text-green-400"}
                        iconBg={systemHealth.errorRate > 1 ? "from-red-500/20 to-red-600/30" : "from-green-500/20 to-green-600/30"}
                        borderColor={systemHealth.errorRate > 1 ? "border-red-500/30" : "border-green-500/30"}
                        valueColor={systemHealth.errorRate > 1 ? "text-red-400" : "text-green-400"}
                        badge={systemHealth.errorRate > 1 ? "Attention" : "Normal"}
                        badgeColor={systemHealth.errorRate > 1 ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}
                        size="default"
                    />
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-4">
                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Cpu className="w-5 h-5 text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Modules Actifs</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">{stats.activeModules}</p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                        sur {stats.totalModules} total
                    </p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Database className="w-5 h-5 text-green-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sources Actives</p>
                    </div>
                    <p className="text-3xl font-bold text-green-400">{stats.activeSources}</p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                        sur {stats.totalSources} total
                    </p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Incidents</p>
                    </div>
                    <p className="text-3xl font-bold text-red-400">{stats.criticalIncidents}</p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                        {stats.recentIncidents} au total
                    </p>
                </NeaCard>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)]">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-400" />
                                État des Modules
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            {modules.map((module, index) => (
                                <motion.div
                                    key={module.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-[var(--nea-text-title)] text-sm mb-1">
                                                {module.name}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {module.category}
                                                </Badge>
                                                <span className="text-xs text-[var(--nea-text-secondary)]">
                                                    v{module.version}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {module.status === 'Active' ? (
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                            )}
                                            <Badge className={`border-0 text-xs ${
                                                module.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                                                module.status === 'Standby' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-gray-500/20 text-gray-400'
                                            }`}>
                                                {module.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </NeaCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)]">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Database className="w-5 h-5 text-green-400" />
                                Sources de Données
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            {dataSources.map((source, index) => (
                                <motion.div
                                    key={source.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-[var(--nea-text-title)] text-sm mb-1">
                                                {source.name}
                                            </h4>
                                            <Badge variant="outline" className="text-xs">
                                                {source.type}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {source.status === 'Active' ? (
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <AlertTriangle className="w-5 h-5 text-red-400" />
                                            )}
                                            <Badge className={`border-0 text-xs ${
                                                source.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                                                source.status === 'Error' ? 'bg-red-500/20 text-red-400' :
                                                'bg-gray-500/20 text-gray-400'
                                            }`}>
                                                {source.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </NeaCard>
                </motion.div>
            </div>
        </motion.div>
    );
}
