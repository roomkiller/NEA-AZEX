import React, { useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Wrench, AlertTriangle, CheckCircle, Clock, TrendingUp, Activity } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { formatLargeNumber } from '../components/utils/NumberFormatter';
import StatsCard from '../components/ui/StatsCard';

export default function TechnicianDashboard() {
    const { containerVariants, itemVariants } = useStaggerAnimation();

    const { data: incidents = [], isLoading: incidentsLoading } = useQuery({
        queryKey: ['incidents'],
        queryFn: () => base44.entities.SecurityIncident.list('-created_date', 50),
        refetchInterval: 30000
    });

    const { data: modules = [], isLoading: modulesLoading } = useQuery({
        queryKey: ['modules'],
        queryFn: () => base44.entities.Module.list(),
        refetchInterval: 60000
    });

    const { data: predictions = [], isLoading: predictionsLoading } = useQuery({
        queryKey: ['predictions'],
        queryFn: () => base44.entities.EventPrediction.list('-probability_score', 20),
        refetchInterval: 60000
    });

    const isLoading = incidentsLoading || modulesLoading || predictionsLoading;

    const stats = useMemo(() => ({
        totalIncidents: incidents.length,
        criticalIncidents: incidents.filter(i => i.severity === 'Critique').length,
        resolvedIncidents: incidents.filter(i => i.status === 'Résolu').length,
        activeModules: modules.filter(m => m.status === 'Active').length,
        totalModules: modules.length,
        highProbPredictions: predictions.filter(p => p.probability_score >= 70).length,
        resolutionRate: incidents.length > 0 ? 
            Math.round((incidents.filter(i => i.status === 'Résolu').length / incidents.length) * 100) : 0
    }), [incidents, modules, predictions]);

    if (isLoading) {
        return <LoadingTransition message="Chargement Poste Technique..." />;
    }

    return (
        <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Poste Technique", href: "TechnicianDashboard" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Wrench className="w-8 h-8 text-cyan-400" />}
                    title="Poste Technique"
                    subtitle="Supervision et maintenance opérationnelle du système"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Incidents Totaux"
                        value={stats.totalIncidents}
                        icon={AlertTriangle}
                        iconColor="text-orange-400"
                        iconBg="from-orange-500/20 to-orange-600/30"
                        borderColor="border-orange-500/30"
                        valueColor="text-orange-400"
                        badge={`${stats.criticalIncidents} critique`}
                        badgeColor="bg-red-500/20 text-red-400"
                        size="default"
                    />

                    <StatsCard
                        title="Modules Actifs"
                        value={stats.activeModules}
                        icon={Activity}
                        iconColor="text-green-400"
                        iconBg="from-green-500/20 to-green-600/30"
                        borderColor="border-green-500/30"
                        valueColor="text-green-400"
                        subtitle={`${stats.totalModules} total`}
                        size="default"
                    />

                    <StatsCard
                        title="Taux Résolution"
                        value={stats.resolutionRate}
                        unit="%"
                        icon={CheckCircle}
                        iconColor="text-blue-400"
                        iconBg="from-blue-500/20 to-blue-600/30"
                        borderColor="border-blue-500/30"
                        valueColor="text-blue-400"
                        trend={stats.resolutionRate >= 80 ? "up" : "neutral"}
                        trendValue={stats.resolutionRate >= 80 ? 5 : 0}
                        size="default"
                    />

                    <StatsCard
                        title="Alertes Prioritaires"
                        value={stats.highProbPredictions}
                        icon={TrendingUp}
                        iconColor="text-purple-400"
                        iconBg="from-purple-500/20 to-purple-600/30"
                        borderColor="border-purple-500/30"
                        valueColor="text-purple-400"
                        badge="≥70%"
                        badgeColor="bg-purple-500/20 text-purple-400"
                        size="default"
                    />
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)]">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-400" />
                                Incidents Récents
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            {incidents.slice(0, 8).map((incident, index) => (
                                <motion.div
                                    key={incident.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-[var(--nea-text-title)] text-sm mb-1">
                                                {incident.incident_type}
                                            </h4>
                                            <p className="text-xs text-[var(--nea-text-secondary)]">
                                                {incident.description?.substring(0, 60)}...
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 ml-3">
                                            <Badge className={`border-0 ${
                                                incident.severity === 'Critique' ? 'bg-red-500/20 text-red-400' :
                                                incident.severity === 'Élevé' ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                                {incident.severity}
                                            </Badge>
                                            <Badge className={`border-0 text-xs ${
                                                incident.status === 'Résolu' ? 'bg-green-500/20 text-green-400' :
                                                incident.status === 'En cours' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-gray-500/20 text-gray-400'
                                            }`}>
                                                {incident.status}
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
                                <Activity className="w-5 h-5 text-green-400" />
                                État des Modules
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            {modules.slice(0, 8).map((module, index) => (
                                <motion.div
                                    key={module.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
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
                                        <Badge className={`ml-2 border-0 ${
                                            module.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                                            module.status === 'Testing' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {module.status}
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