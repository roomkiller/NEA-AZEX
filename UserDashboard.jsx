
import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Eye, Activity, Layers, Radio, FileText, ArrowRight, Bell } from 'lucide-react'; // Added Bell
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { useCachedData } from '../components/performance/OptimizationProvider';
import PredictionCard from '../components/predictions/PredictionCard';
import SignalFeedItem from '../components/signals/SignalFeedItem';
import { formatLargeNumber, formatDate } from '../components/utils/NumberFormatter';
import StatsCard from '../components/ui/StatsCard';
import { Link } from 'react-router-dom';
import NeaButton from '../components/ui/NeaButton';

// Mock function for createPageUrl if not globally available, adjust as per project routing
const createPageUrl = (pageName) => `/${pageName.toLowerCase().replace(/\s/g, '')}`;

export default function UserDashboard() {
    // Cache optimisé pour les données utilisateur
    const { data: predictions, isLoading: predsLoading } = useCachedData(
        'user_dashboard_predictions',
        () => base44.entities.EventPrediction.list('-probability_score', 10),
        { ttlHours: 0.25, cacheType: 'Dashboard_Stats' }
    );

    const { data: signals, isLoading: signalsLoading } = useCachedData(
        'user_dashboard_signals',
        () => base44.entities.MediaSignal.list('-detection_timestamp', 10),
        { ttlHours: 0.25, cacheType: 'Dashboard_Stats' }
    );

    const { data: trends, isLoading: trendsLoading } = useCachedData(
        'user_dashboard_trends',
        () => base44.entities.TrendAnalysis.list('-momentum_score', 5),
        { ttlHours: 0.5, cacheType: 'Dashboard_Stats' }
    );

    // New data fetches for briefs and notifications
    const { data: briefs, isLoading: briefsLoading } = useCachedData(
        'user_dashboard_briefs',
        () => base44.entities.IntelligenceBrief.list('-creation_date', 10), // Assuming an IntelligenceBrief entity
        { ttlHours: 0.5, cacheType: 'Dashboard_Stats' }
    );

    const { data: notifications, isLoading: notificationsLoading } = useCachedData(
        'user_dashboard_notifications',
        () => base44.entities.Notification.list('-timestamp', 10), // Assuming a Notification entity
        { ttlHours: 0.1, cacheType: 'Dashboard_Stats' }
    );

    const { containerVariants, itemVariants } = useStaggerAnimation();

    const isLoading = predsLoading || signalsLoading || trendsLoading || briefsLoading || notificationsLoading;

    const stats = useMemo(() => {
        // Ensure data arrays are initialized to empty arrays if null/undefined to prevent errors
        const safeBriefs = briefs || [];
        const safeNotifications = notifications || [];
        const safePredictions = predictions || [];
        const safeSignals = signals || [];
        const safeTrends = trends || [];

        return {
            totalBriefs: safeBriefs.length,
            urgentBriefs: safeBriefs.filter(b => b.priority_level === 'Urgent' || b.priority_level === 'Critique').length,
            unreadNotifications: safeNotifications.filter(n => !n.is_read).length,
            activePredictions: safePredictions.filter(p => p.status !== 'Archivé').length, // Assuming 'status' field for predictions
            highProbPredictions: safePredictions.filter(p => p.probability_score >= 70).length,
            recentSignals: safeSignals.length,
            activeTrends: safeTrends.filter(t => t.status === 'Active').length
        };
    }, [briefs, notifications, predictions, signals, trends]);

    // Use predictions for the "Prédictions Récentes" section as well
    const recentPredictions = predictions || [];

    if (isLoading) {
        return <LoadingTransition message="Chargement Poste de Veille..." />;
    }

    return (
        <motion.div
            className="space-y-8" // Changed from space-y-6 to space-y-8
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Poste de Veille", href: "UserDashboard" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Target className="w-8 h-8 text-blue-400" />}
                    title="Poste de Veille"
                    subtitle="Vue d'overview des renseignements stratégiques"
                />
            </motion.div>

            {/* Stats Grid with StatsCard */}
            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Briefings"
                        value={stats.totalBriefs}
                        icon={FileText}
                        iconColor="text-blue-400"
                        iconBg="from-blue-500/20 to-blue-600/30"
                        borderColor="border-blue-500/30"
                        valueColor="text-blue-400"
                        badge={stats.urgentBriefs > 0 ? `${stats.urgentBriefs} urgent` : "À jour"}
                        badgeColor={stats.urgentBriefs > 0 ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}
                        size="default"
                    />

                    <StatsCard
                        title="Prédictions Actives"
                        value={stats.activePredictions}
                        icon={TrendingUp}
                        iconColor="text-purple-400"
                        iconBg="from-purple-500/20 to-purple-600/30"
                        borderColor="border-purple-500/30"
                        valueColor="text-purple-400"
                        badge={`${stats.highProbPredictions} >70%`}
                        badgeColor="bg-purple-500/20 text-purple-400"
                        size="default"
                    />

                    <StatsCard
                        title="Signaux Récents"
                        value={stats.recentSignals}
                        icon={Radio}
                        iconColor="text-orange-400"
                        iconBg="from-orange-500/20 to-orange-600/30"
                        borderColor="border-orange-500/30"
                        valueColor="text-orange-400"
                        subtitle="dernières 24h"
                        size="default"
                    />

                    <StatsCard
                        title="Notifications"
                        value={stats.unreadNotifications}
                        icon={Bell}
                        iconColor="text-cyan-400"
                        iconBg="from-cyan-500/20 to-cyan-600/30"
                        borderColor="border-cyan-500/30"
                        valueColor="text-cyan-400"
                        badge={stats.unreadNotifications > 0 ? "Non lues" : "À jour"}
                        badgeColor={stats.unreadNotifications > 0 ? "bg-cyan-500/20 text-cyan-400" : "bg-green-500/20 text-green-400"}
                        size="default"
                    />
                </div>
            </motion.div>

            {/* Recent Predictions */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-6 border-b border-[var(--nea-border-default)] bg-gradient-to-r from-purple-500/5 to-blue-500/5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-[var(--nea-text-title)] flex items-center gap-2">
                                <TrendingUp className="w-6 h-6 text-purple-400" />
                                Prédictions Récentes
                            </h3>
                            <Link to={createPageUrl('EventPredictions')}>
                                <NeaButton variant="ghost" size="sm">
                                    Voir tout
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </NeaButton>
                            </Link>
                        </div>
                    </div>
                    <div className="p-6">
                        {recentPredictions.length === 0 ? (
                            <div className="text-center py-8">
                                <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <p className="text-[var(--nea-text-secondary)]">
                                    Aucune prédiction récente
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentPredictions.map((prediction, index) => (
                                    <div 
                                        key={prediction.id || index} // Use prediction.id if available, otherwise index as fallback
                                        className="p-4 bg-[var(--nea-bg-surface)] rounded-lg border border-[var(--nea-border-subtle)] hover:border-purple-500/30 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge className={`${
                                                        prediction.probability_score >= 80 ? 'bg-green-500/20 text-green-400' :
                                                        prediction.probability_score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                    } border-0`}>
                                                        {prediction.probability_score}% confiance
                                                    </Badge>
                                                    <span className="text-xs text-[var(--nea-text-muted)]">
                                                        {formatDate(prediction.prediction_date, 'medium')}
                                                    </span>
                                                </div>
                                                <p className="font-semibold text-[var(--nea-text-primary)]">{prediction.event_type}</p>
                                                <p className="text-sm text-[var(--nea-text-secondary)] mt-1">{prediction.event_description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </NeaCard>
            </motion.div>

            {/* Old "Signaux Faibles" and "Prédictions Récentes" (now removed as per changes) */}
            {/* The original code had a second grid for "Prédictions Récentes" and "Signaux Faibles".
                The "Prédictions Récentes" block was replaced by the new, more detailed one above.
                The "Signaux Faibles" block needs to be preserved as it was not replaced. */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* The "Prédictions Récentes" block that used PredictionCard was removed. */}
                {/* The new "Prédictions Récentes" block above replaces it. */}

                <motion.div variants={itemVariants}>
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)]">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Eye className="w-5 h-5 text-cyan-400" />
                                Signaux Faibles
                            </h3>
                        </div>
                        <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto styled-scrollbar">
                            {signals && signals.length > 0 ? (
                                signals.map((signal, index) => (
                                    <SignalFeedItem key={signal.id} signal={signal} index={index} />
                                ))
                            ) : (
                                <p className="text-center text-[var(--nea-text-secondary)] py-8">
                                    Aucun signal détecté
                                </p>
                            )}
                        </div>
                    </NeaCard>
                </motion.div>
            </div>
        </motion.div>
    );
}
