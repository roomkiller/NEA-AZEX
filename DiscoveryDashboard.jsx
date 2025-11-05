import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Compass, TrendingUp, Eye, Database, Activity, BookOpen, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import StatsCard from '../components/ui/StatsCard';
import { formatLargeNumber } from '../components/utils/NumberFormatter';

export default function DiscoveryDashboard() {
    const [predictions, setPredictions] = useState([]);
    const [signals, setSignals] = useState([]);
    const [trends, setTrends] = useState([]);
    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [predsData, signalsData, trendsData, modulesData] = await Promise.all([
                    base44.entities.EventPrediction.list('-probability_score', 10),
                    base44.entities.MediaSignal.list('-relevance_score', 10),
                    base44.entities.TrendAnalysis.list('-momentum_score', 10),
                    base44.entities.Module.list()
                ]);
                setPredictions(predsData);
                setSignals(signalsData);
                setTrends(trendsData);
                setModules(modulesData);
            } catch (error) {
                console.error("Erreur chargement Discovery Dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const stats = useMemo(() => ({
        availableModules: modules.filter(m => m.status === 'Active').length,
        totalPredictions: predictions.length,
        highProbPredictions: predictions.filter(p => p.probability_score >= 70).length,
        totalSignals: signals.length,
        highRelevanceSignals: signals.filter(s => s.relevance_score >= 80).length,
        activeTrends: trends.filter(t => t.status === 'Active').length
    }), [predictions, signals, trends, modules]);

    if (isLoading) {
        return <LoadingTransition message="Chargement Espace Découverte..." />;
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Espace Découverte", href: "DiscoveryDashboard" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Compass className="w-8 h-8 text-blue-400" />}
                    title="Espace Découverte"
                    subtitle="Explorez les capacités de NEA-AZEX"
                />
            </motion.div>

            {/* Welcome Card */}
            <motion.div variants={itemVariants}>
                <NeaCard className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-blue-500/20 rounded-xl">
                            <Compass className="w-8 h-8 text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Bienvenue dans l'Espace Découverte
                            </h3>
                            <p className="text-[var(--nea-text-secondary)]">
                                Explorez les capacités d'analyse prédictive, de détection de signaux faibles et de surveillance des tendances.
                            </p>
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-400 border-0 px-4 py-2 text-base">
                            Forfait Discovery
                        </Badge>
                    </div>
                </NeaCard>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Modules Disponibles"
                        value={stats.availableModules}
                        icon={Database}
                        iconColor="text-purple-400"
                        iconBg="from-purple-500/20 to-purple-600/30"
                        borderColor="border-purple-500/30"
                        valueColor="text-purple-400"
                        subtitle="actifs"
                        size="default"
                    />

                    <StatsCard
                        title="Prédictions"
                        value={stats.totalPredictions}
                        icon={TrendingUp}
                        iconColor="text-cyan-400"
                        iconBg="from-cyan-500/20 to-cyan-600/30"
                        borderColor="border-cyan-500/30"
                        valueColor="text-cyan-400"
                        badge={`${stats.highProbPredictions} >70%`}
                        badgeColor="bg-cyan-500/20 text-cyan-400"
                        size="default"
                    />

                    <StatsCard
                        title="Signaux Faibles"
                        value={stats.totalSignals}
                        icon={Eye}
                        iconColor="text-orange-400"
                        iconBg="from-orange-500/20 to-orange-600/30"
                        borderColor="border-orange-500/30"
                        valueColor="text-orange-400"
                        subtitle={`${stats.highRelevanceSignals} haute pertinence`}
                        size="default"
                    />

                    <StatsCard
                        title="Tendances Actives"
                        value={stats.activeTrends}
                        icon={Activity}
                        iconColor="text-green-400"
                        iconBg="from-green-500/20 to-green-600/30"
                        borderColor="border-green-500/30"
                        valueColor="text-green-400"
                        subtitle="en surveillance"
                        size="default"
                    />
                </div>
            </motion.div>

            {/* Main Features */}
            <div className="grid lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)] bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                                    Prédictions Récentes
                                </h3>
                                <Link to={createPageUrl('EventPredictions')}>
                                    <Badge className="bg-cyan-500/20 text-cyan-400 border-0 hover:bg-cyan-500/30 cursor-pointer">
                                        Explorer
                                    </Badge>
                                </Link>
                            </div>
                        </div>
                        <div className="p-6 space-y-3 max-h-96 overflow-y-auto styled-scrollbar">
                            {predictions.slice(0, 5).map((pred, index) => (
                                <motion.div
                                    key={pred.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)] hover:border-cyan-500/30 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <Badge className={`border-0 ${
                                            pred.probability_score >= 80 ? 'bg-green-500/20 text-green-400' :
                                            pred.probability_score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {pred.probability_score}% probabilité
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {pred.event_type}
                                        </Badge>
                                    </div>
                                    <h4 className="font-semibold text-[var(--nea-text-title)] mb-1">
                                        {pred.event_name}
                                    </h4>
                                    <p className="text-sm text-[var(--nea-text-secondary)]">
                                        {pred.prediction_summary?.substring(0, 100)}...
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </NeaCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)] bg-gradient-to-r from-orange-500/5 to-yellow-500/5">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-orange-400" />
                                    Signaux Faibles
                                </h3>
                                <Link to={createPageUrl('WeakSignals')}>
                                    <Badge className="bg-orange-500/20 text-orange-400 border-0 hover:bg-orange-500/30 cursor-pointer">
                                        Explorer
                                    </Badge>
                                </Link>
                            </div>
                        </div>
                        <div className="p-6 space-y-3 max-h-96 overflow-y-auto styled-scrollbar">
                            {signals.slice(0, 5).map((signal, index) => (
                                <motion.div
                                    key={signal.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)] hover:border-orange-500/30 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <Badge className={`border-0 ${
                                            signal.relevance_score >= 80 ? 'bg-orange-500/20 text-orange-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {signal.relevance_score}% pertinence
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {signal.signal_type}
                                        </Badge>
                                    </div>
                                    <h4 className="font-semibold text-[var(--nea-text-title)] mb-1">
                                        {signal.signal_title}
                                    </h4>
                                    <p className="text-sm text-[var(--nea-text-secondary)]">
                                        Source: {signal.source_platform}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </NeaCard>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
                <NeaCard className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-400" />
                        Actions Rapides
                    </h3>
                    <div className="grid md:grid-cols-4 gap-3">
                        <Link to={createPageUrl('EventPredictions')}>
                            <div className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)] hover:border-cyan-500 transition-all cursor-pointer">
                                <TrendingUp className="w-6 h-6 text-cyan-400 mb-2" />
                                <p className="font-semibold text-[var(--nea-text-title)] text-sm">Prédictions</p>
                            </div>
                        </Link>
                        <Link to={createPageUrl('WeakSignals')}>
                            <div className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)] hover:border-orange-500 transition-all cursor-pointer">
                                <Eye className="w-6 h-6 text-orange-400 mb-2" />
                                <p className="font-semibold text-[var(--nea-text-title)] text-sm">Signaux Faibles</p>
                            </div>
                        </Link>
                        <Link to={createPageUrl('TrendAnalysis')}>
                            <div className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)] hover:border-green-500 transition-all cursor-pointer">
                                <Activity className="w-6 h-6 text-green-400 mb-2" />
                                <p className="font-semibold text-[var(--nea-text-title)] text-sm">Tendances</p>
                            </div>
                        </Link>
                        <Link to={createPageUrl('Documentation')}>
                            <div className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)] hover:border-purple-500 transition-all cursor-pointer">
                                <BookOpen className="w-6 h-6 text-purple-400 mb-2" />
                                <p className="font-semibold text-[var(--nea-text-title)] text-sm">Documentation</p>
                            </div>
                        </Link>
                    </div>
                </NeaCard>
            </motion.div>

            {/* Upgrade CTA */}
            <motion.div variants={itemVariants}>
                <NeaCard className="p-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-3">
                            Passez au niveau supérieur
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Débloquez plus de fonctionnalités avec les forfaits Solo, Team ou Enterprise
                        </p>
                        <Link to={createPageUrl('Pricing')}>
                            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all">
                                Découvrir les Forfaits
                            </button>
                        </Link>
                    </div>
                </NeaCard>
            </motion.div>
        </motion.div>
    );
}