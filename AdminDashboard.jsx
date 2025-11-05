
import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Shield, Users, Database, TrendingUp, AlertTriangle, Activity, Zap, CheckCircle, Grid3x3 } from 'lucide-react'; // Added Grid3x3
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { useCachedData } from '../components/performance/OptimizationProvider';
import { formatLargeNumber, formatDate } from '../components/utils/NumberFormatter';
import StatsCard from '../components/ui/StatsCard'; // SimpleStatsCard was also imported in outline but not directly used.

export default function AdminDashboard() {
    // Utiliser le cache pour les données du dashboard
    const { data: modules, isLoading: modulesLoading } = useCachedData(
        'admin_dashboard_modules',
        () => base44.entities.Module.list(),
        { ttlHours: 0.5, cacheType: 'Dashboard_Stats' }
    );

    const { data: users, isLoading: usersLoading } = useCachedData(
        'admin_dashboard_users',
        () => base44.entities.User.list(),
        { ttlHours: 0.5, cacheType: 'Dashboard_Stats' }
    );

    const { data: predictionsData, isLoading: predsLoading } = useCachedData(
        'admin_dashboard_predictions',
        () => base44.entities.EventPrediction.list('-probability_score', 20),
        { ttlHours: 0.25, cacheType: 'Dashboard_Stats' }
    );

    const { data: subscriptions, isLoading: subsLoading } = useCachedData(
        'admin_dashboard_subscriptions',
        () => base44.entities.Subscription.list(),
        { ttlHours: 1, cacheType: 'Dashboard_Stats' }
    );

    const { data: incidentsData, isLoading: incidentsLoading } = useCachedData(
        'admin_dashboard_incidents',
        () => base44.entities.SecurityIncident.list('-detected_timestamp', 20),
        { ttlHours: 0.1, cacheType: 'Dashboard_Stats' }
    );

    const { containerVariants, itemVariants } = useStaggerAnimation();

    // Adjusted isLoading to reflect useCachedData statuses
    const isLoading = modulesLoading || usersLoading || predsLoading || incidentsLoading || subsLoading;

    const stats = useMemo(() => {
        // Ensure all data are loaded before computing stats
        if (!modules || !users || !predictionsData || !incidentsData || !subscriptions) {
            return {
                totalUsers: 0,
                adminUsers: 0,
                developerUsers: 0,
                technicianUsers: 0,
                activeModules: 0,
                totalModules: 0,
                criticalIncidents: 0,
                recentIncidents: 0,
                highProbPredictions: 0,
                totalPredictions: 0,
                systemUptime: 0,
            };
        }

        const activeModules = modules.filter(m => m.status === 'Active').length;
        const totalModules = modules.length;
        const systemUptime = totalModules > 0 ? Math.round((activeModules / totalModules) * 100) : 100;

        return {
            totalUsers: users.length,
            adminUsers: users.filter(u => u.role === 'admin').length,
            developerUsers: users.filter(u => u.role === 'developer').length,
            technicianUsers: users.filter(u => u.role === 'technician').length,
            activeModules,
            totalModules,
            criticalIncidents: incidentsData.filter(i => i.severity === 'Critique').length,
            recentIncidents: incidentsData.length,
            highProbPredictions: predictionsData.filter(p => p.probability_score >= 70).length,
            totalPredictions: predictionsData.length,
            systemUptime
        };
    }, [users, modules, incidentsData, predictionsData, subscriptions]);

    // Simulated system health metrics (Uptime, Avg. Response Time, Success Rate)
    // These would typically come from a dedicated system monitoring service.
    const systemHealth = useMemo(() => {
        return {
            uptime: Math.floor(Math.random() * (100 - 95 + 1)) + 95, // 95-100% - NOTE: This is no longer used for 'Uptime Global'
            avgResponseTime: Math.floor(Math.random() * (150 - 50 + 1)) + 50, // 50-150 ms
            successRate: Math.floor(Math.random() * (100 - 90 + 1)) + 90 // 90-100%
        };
    }, []); // Empty dependency array means these values are stable after initial render

    // Map fetched incidentsData to recentSecurityEvents format
    const recentSecurityEvents = useMemo(() => {
        if (!incidentsData) return [];
        // Assuming incidentsData items have properties like 'severity', 'type', 'description', 'detected_timestamp', 'status'
        return incidentsData.map(incident => ({
            severity: incident.severity, // e.g., 'Critique', 'Élevée', 'Moyenne', 'Faible'
            incident_type: incident.type, // e.g., 'Phishing', 'Attaque DDoS'
            description: incident.description,
            detected_at: incident.detected_timestamp,
            status: incident.status // e.g., 'Résolu', 'En cours', 'Nouveau'
        }));
    }, [incidentsData]);


    if (isLoading) {
        return <LoadingTransition message="Chargement Pont de Commandement..." />;
    }

    return (
        <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Pont de Commandement", href: "AdminDashboard" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Shield className="w-8 h-8 text-red-400" />}
                    title="Pont de Commandement"
                    subtitle="Centre de contrôle administratif NEA-AZEX"
                />
            </motion.div>

            {/* Stats Grid with StatsCard */}
            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Utilisateurs Totaux"
                        value={stats.totalUsers}
                        icon={Users}
                        iconColor="text-blue-400"
                        iconBg="from-blue-500/20 to-blue-600/30"
                        borderColor="border-blue-500/30"
                        valueColor="text-blue-400"
                        badge={`${stats.adminUsers} admin`}
                        badgeColor="bg-red-500/20 text-red-400"
                        size="default"
                    />

                    <StatsCard
                        title="Modules Système"
                        value={stats.activeModules}
                        icon={Grid3x3}
                        iconColor="text-purple-400"
                        iconBg="from-purple-500/20 to-purple-600/30"
                        borderColor="border-purple-500/30"
                        valueColor="text-purple-400"
                        subtitle={`sur ${stats.totalModules} total`}
                        size="default"
                    />

                    <StatsCard
                        title="Incidents Critiques"
                        value={stats.criticalIncidents}
                        icon={AlertTriangle}
                        iconColor="text-red-400"
                        iconBg="from-red-500/20 to-red-600/30"
                        borderColor="border-red-500/30"
                        valueColor="text-red-400"
                        subtitle={`${stats.recentIncidents} total`}
                        size="default"
                    />

                    <StatsCard
                        title="Uptime Global"
                        value={stats.systemUptime}
                        unit="%"
                        icon={Activity}
                        iconColor="text-green-400"
                        iconBg="from-green-500/20 to-green-600/30"
                        borderColor="border-green-500/30"
                        valueColor="text-green-400"
                        trend={stats.systemUptime >= 95 ? "up" : "neutral"}
                        trendValue={stats.systemUptime >= 95 ? 2.3 : 0}
                        size="default"
                    />
                </div>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-6 border-b border-[var(--nea-border-default)] bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
                        <h3 className="text-xl font-bold text-[var(--nea-text-title)] flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-cyan-400" />
                            Métriques de Performance
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/30">
                                <p className="text-sm text-[var(--nea-text-secondary)] mb-2">Temps de Réponse Moyen</p>
                                <p className="text-4xl font-bold text-blue-400">{systemHealth.avgResponseTime}</p>
                                <p className="text-sm text-[var(--nea-text-muted)] mt-1">millisecondes</p>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30">
                                <p className="text-sm text-[var(--nea-text-secondary)] mb-2">Prédictions Générées</p>
                                <p className="text-4xl font-bold text-purple-400">{formatLargeNumber(stats.totalPredictions, { decimals: 0 })}</p>
                                <p className="text-sm text-[var(--nea-text-muted)] mt-1">ce mois-ci</p>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/30">
                                <p className="text-sm text-[var(--nea-text-secondary)] mb-2">Taux de Succès</p>
                                <p className="text-4xl font-bold text-green-400">{systemHealth.successRate}%</p>
                                <p className="text-sm text-[var(--nea-text-muted)] mt-1">des requêtes</p>
                            </div>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>

            {/* Management Tools Grid */}
            <motion.div variants={itemVariants}>
                <NeaCard className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-red-400" />
                        Gestion et Administration
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Link to={createPageUrl('UserManagement')}>
                            <div className="p-5 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer">
                                <Users className="w-8 h-8 text-blue-400 mb-3" />
                                <p className="font-bold text-[var(--nea-text-title)]">Utilisateurs</p>
                                <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                                    {stats.totalUsers} utilisateurs
                                </p>
                            </div>
                        </Link>

                        <Link to={createPageUrl('SubscriptionManagement')}>
                            <div className="p-5 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 hover:border-green-500 transition-all cursor-pointer">
                                <Zap className="w-8 h-8 text-green-400 mb-3" />
                                <p className="font-bold text-[var(--nea-text-title)]">Abonnements</p>
                                <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                                    Gestion commerciale
                                </p>
                            </div>
                        </Link>

                        <Link to={createPageUrl('AccreditationManagement')}>
                            <div className="p-5 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer">
                                <Shield className="w-8 h-8 text-purple-400 mb-3" />
                                <p className="font-bold text-[var(--nea-text-title)]">Accréditations</p>
                                <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                                    Gestion des accès
                                </p>
                            </div>
                        </Link>

                        <Link to={createPageUrl('Security')}>
                            <div className="p-5 rounded-lg bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 hover:border-red-500 transition-all cursor-pointer">
                                <AlertTriangle className="w-8 h-8 text-red-400 mb-3" />
                                <p className="font-bold text-[var(--nea-text-title)]">Sécurité</p>
                                <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                                    Hub sécurité
                                </p>
                            </div>
                        </Link>

                        <Link to={createPageUrl('CrisisManager')}>
                            <div className="p-5 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 hover:border-orange-500 transition-all cursor-pointer">
                                <AlertTriangle className="w-8 h-8 text-orange-400 mb-3" />
                                <p className="font-bold text-[var(--nea-text-title)]">Gestion de Crise</p>
                                <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                                    Simulations et réponse
                                </p>
                            </div>
                        </Link>

                        <Link to={createPageUrl('SystemAnalysis')}>
                            <div className="p-5 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 hover:border-cyan-500 transition-all cursor-pointer">
                                <Activity className="w-8 h-8 text-cyan-400 mb-3" />
                                <p className="font-bold text-[var(--nea-text-title)]">Analyse Système</p>
                                <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                                    Analyse approfondie
                                </p>
                            </div>
                        </Link>
                    </div>
                </NeaCard>
            </motion.div>

            {/* Recent Security Events */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-6 border-b border-[var(--nea-border-default)] bg-gradient-to-r from-red-500/5 to-orange-500/5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-[var(--nea-text-title)] flex items-center gap-2">
                                <AlertTriangle className="w-6 h-6 text-red-400" />
                                Événements de Sécurité Récents
                            </h3>
                            <Badge className={`${
                                recentSecurityEvents.length === 0 
                                    ? 'bg-green-500/20 text-green-400 border-0' 
                                    : 'bg-red-500/20 text-red-400 border-0'
                            }`}>
                                {recentSecurityEvents.length} {recentSecurityEvents.length === 1 ? 'événement' : 'événements'}
                            </Badge>
                        </div>
                    </div>
                    <div className="p-6">
                        {recentSecurityEvents.length === 0 ? (
                            <div className="text-center py-8">
                                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                <p className="text-[var(--nea-text-secondary)]">
                                    Aucun incident de sécurité récent
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentSecurityEvents.map((event, index) => (
                                    <div 
                                        key={index}
                                        className="p-4 bg-[var(--nea-bg-surface)] rounded-lg border border-[var(--nea-border-subtle)] hover:border-red-500/30 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge className={`${
                                                        event.severity === 'Critique' ? 'bg-red-500/20 text-red-400' :
                                                        event.severity === 'Élevée' ? 'bg-orange-500/20 text-orange-400' :
                                                        event.severity === 'Moyenne' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                    } border-0`}>
                                                        {event.severity}
                                                    </Badge>
                                                    <span className="text-xs text-[var(--nea-text-muted)]">
                                                        {formatDate(event.detected_at, 'datetime')}
                                                    </span>
                                                </div>
                                                <p className="font-semibold text-[var(--nea-text-primary)]">{event.incident_type}</p>
                                                <p className="text-sm text-[var(--nea-text-secondary)] mt-1">{event.description}</p>
                                            </div>
                                            <Badge className={`${
                                                event.status === 'Résolu' ? 'bg-green-500/20 text-green-400' :
                                                event.status === 'En cours' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                            } border-0 ml-4`}>
                                                {event.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </NeaCard>
            </motion.div>

            {/* Protocols Access */}
            <motion.div variants={itemVariants}>
                <NeaCard className="p-6 bg-gradient-to-r from-purple-500/5 to-blue-500/5 border-purple-500/20">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-400" />
                        Protocoles Avancés
                    </h3>
                    <div className="grid md:grid-cols-4 gap-3">
                        <Link to={createPageUrl('ChimeraProtocol')}>
                            <div className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)] hover:border-purple-500 transition-all cursor-pointer text-center">
                                <p className="font-bold text-[var(--nea-text-title)] text-sm">Chimère</p>
                                <p className="text-xs text-purple-400 mt-1">Honeypot IA</p>
                            </div>
                        </Link>
                        <Link to={createPageUrl('JanusProtocol')}>
                            <div className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)] hover:border-blue-500 transition-all cursor-pointer text-center">
                                <p className="font-bold text-[var(--nea-text-title)] text-sm">Janus</p>
                                <p className="text-xs text-blue-400 mt-1">Adversarial</p>
                            </div>
                        </Link>
                        <Link to={createPageUrl('LeviathanProtocol')}>
                            <div className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)] hover:border-cyan-500 transition-all cursor-pointer text-center">
                                <p className="font-bold text-[var(--nea-text-title)] text-sm">Léviathan</p>
                                <p className="text-xs text-cyan-400 mt-1">Dispersion</p>
                            </div>
                        </Link>
                        <Link to={createPageUrl('PrometheusProtocol')}>
                            <div className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)] hover:border-red-500 transition-all cursor-pointer text-center">
                                <p className="font-bold text-[var(--nea-text-title)] text-sm">Prométhée</p>
                                <p className="text-xs text-red-400 mt-1">Réponse</p>
                            </div>
                        </Link>
                    </div>
                </NeaCard>
            </motion.div>
        </motion.div>
    );
}
