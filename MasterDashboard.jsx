import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Crown, Shield, Activity, Users, Zap, TrendingUp } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { formatLargeNumber, formatPercentage } from '../components/utils/NumberFormatter';
import StatsCard from '../components/ui/StatsCard';

export default function MasterDashboard() {
    const [modules, setModules] = useState([]);
    const [users, setUsers] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [modulesData, usersData, predsData, incidentsData] = await Promise.all([
                    base44.entities.Module.list(),
                    base44.entities.User.list(),
                    base44.entities.EventPrediction.list('-probability_score', 50),
                    base44.entities.SecurityIncident.list('-created_date', 50)
                ]);
                setModules(modulesData);
                setUsers(usersData);
                setPredictions(predsData);
                setIncidents(incidentsData);
            } catch (error) {
                console.error("Erreur chargement Master Dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();

        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, []);

    const stats = useMemo(() => ({
        totalUsers: users.length,
        adminUsers: users.filter(u => u.role === 'admin').length,
        activeModules: modules.filter(m => m.status === 'Active').length,
        totalModules: modules.length,
        criticalPredictions: predictions.filter(p => p.probability_score >= 80).length,
        criticalIncidents: incidents.filter(i => i.severity === 'Critique').length,
        systemHealth: modules.length > 0 ? 
            Math.round((modules.filter(m => m.status === 'Active').length / modules.length) * 100) : 100,
        predictionAccuracy: 94.7
    }), [users, modules, predictions, incidents]);

    if (isLoading) {
        return <LoadingTransition message="Chargement Quartier Général..." />;
    }

    return (
        <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Quartier Général", href: "MasterDashboard" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Crown className="w-8 h-8 text-yellow-400" />}
                    title="Quartier Général"
                    subtitle="Centre de Commandement Stratégique NEA-AZEX"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Santé Système"
                        value={stats.systemHealth}
                        unit="%"
                        icon={Shield}
                        iconColor="text-green-400"
                        iconBg="from-green-500/20 to-green-600/30"
                        borderColor="border-green-500/30"
                        valueColor="text-green-400"
                        trend={stats.systemHealth >= 95 ? "up" : "neutral"}
                        trendValue={stats.systemHealth >= 95 ? 3.2 : 0}
                        size="default"
                    />

                    <StatsCard
                        title="Modules Actifs"
                        value={stats.activeModules}
                        icon={Activity}
                        iconColor="text-blue-400"
                        iconBg="from-blue-500/20 to-blue-600/30"
                        borderColor="border-blue-500/30"
                        valueColor="text-blue-400"
                        subtitle={`${stats.totalModules} total`}
                        size="default"
                    />

                    <StatsCard
                        title="Utilisateurs"
                        value={stats.totalUsers}
                        icon={Users}
                        iconColor="text-purple-400"
                        iconBg="from-purple-500/20 to-purple-600/30"
                        borderColor="border-purple-500/30"
                        valueColor="text-purple-400"
                        badge={`${stats.adminUsers} admin`}
                        badgeColor="bg-red-500/20 text-red-400"
                        size="default"
                    />

                    <StatsCard
                        title="Précision Prédictions"
                        value={stats.predictionAccuracy}
                        unit="%"
                        icon={TrendingUp}
                        iconColor="text-cyan-400"
                        iconBg="from-cyan-500/20 to-cyan-600/30"
                        borderColor="border-cyan-500/30"
                        valueColor="text-cyan-400"
                        trend="up"
                        trendValue={2.8}
                        size="default"
                    />
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
                <motion.div variants={itemVariants}>
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)]">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-400" />
                                Alertes Critiques
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            {predictions.filter(p => p.probability_score >= 80).slice(0, 5).map((pred, index) => (
                                <motion.div
                                    key={pred.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-3 rounded-lg bg-red-500/10 border border-red-500/30"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-red-400 mb-1">
                                                {pred.event_name}
                                            </p>
                                            <Badge className="bg-red-500/20 text-red-400 border-0 text-xs">
                                                {pred.event_type}
                                            </Badge>
                                        </div>
                                        <span className="text-lg font-bold text-red-400 ml-2">
                                            {formatPercentage(pred.probability_score, { decimals: 0 })}
                                        </span>
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
                                <Activity className="w-5 h-5 text-blue-400" />
                                Modules Stratégiques
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            {modules.filter(m => m.status === 'Active').slice(0, 5).map((module, index) => (
                                <motion.div
                                    key={module.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-[var(--nea-text-primary)] mb-1">
                                                {module.name}
                                            </p>
                                            <p className="text-xs text-[var(--nea-text-secondary)]">
                                                {module.category} • v{module.version}
                                            </p>
                                        </div>
                                        <Badge className="bg-green-500/20 text-green-400 border-0 ml-2">
                                            Active
                                        </Badge>
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
                                <Shield className="w-5 h-5 text-orange-400" />
                                Incidents Récents
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            {incidents.slice(0, 5).map((incident, index) => (
                                <motion.div
                                    key={incident.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-[var(--nea-text-primary)] mb-1">
                                                {incident.incident_type}
                                            </p>
                                            <p className="text-xs text-[var(--nea-text-secondary)]">
                                                {incident.description?.substring(0, 50)}...
                                            </p>
                                        </div>
                                        <Badge className={`ml-2 border-0 ${
                                            incident.severity === 'Critique' ? 'bg-red-500/20 text-red-400' :
                                            incident.severity === 'Élevé' ? 'bg-orange-500/20 text-orange-400' :
                                            'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                            {incident.severity}
                                        </Badge>
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