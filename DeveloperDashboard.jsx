import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Cpu, Grid3x3, TrendingUp, Radio, Zap, Activity, FileText, Shield, Database } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { formatLargeNumber } from '../components/utils/NumberFormatter';
import StatsCard from '../components/ui/StatsCard';

export default function DeveloperDashboard() {
    const [modules, setModules] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [signals, setSignals] = useState([]);
    const [trends, setTrends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [modulesData, predsData, signalsData, trendsData] = await Promise.all([
                    base44.entities.Module.list(),
                    base44.entities.EventPrediction.list('-probability_score', 20),
                    base44.entities.MediaSignal.list('-relevance_score', 20),
                    base44.entities.TrendAnalysis.list('-momentum_score', 20)
                ]);
                setModules(modulesData);
                setPredictions(predsData);
                setSignals(signalsData);
                setTrends(trendsData);
            } catch (error) {
                console.error("Erreur chargement Developer Dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();

        const interval = setInterval(loadData, 60000);
        return () => clearInterval(interval);
    }, []);

    const stats = useMemo(() => ({
        totalModules: modules.length,
        activeModules: modules.filter(m => m.status === 'Active').length,
        testingModules: modules.filter(m => m.status === 'Testing').length,
        totalPredictions: predictions.length,
        highProbability: predictions.filter(p => p.probability_score >= 70).length,
        totalSignals: signals.length,
        highRelevance: signals.filter(s => s.relevance_score >= 80).length,
        activeTrends: trends.filter(t => t.status === 'Active').length,
        apiHealth: 98.5
    }), [modules, predictions, signals, trends]);

    if (isLoading) {
        return <LoadingTransition message="Chargement Atelier de Développement..." />;
    }

    return (
        <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Atelier de Développement", href: "DeveloperDashboard" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Cpu className="w-8 h-8 text-purple-400" />}
                    title="Atelier de Développement"
                    subtitle="Développement et analyse approfondie du système NEA-AZEX"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Modules Actifs"
                        value={stats.activeModules}
                        icon={Grid3x3}
                        iconColor="text-purple-400"
                        iconBg="from-purple-500/20 to-purple-600/30"
                        borderColor="border-purple-500/30"
                        valueColor="text-purple-400"
                        subtitle={`${stats.totalModules} total`}
                        size="default"
                    />

                    <StatsCard
                        title="Prédictions"
                        value={stats.totalPredictions}
                        icon={TrendingUp}
                        iconColor="text-blue-400"
                        iconBg="from-blue-500/20 to-blue-600/30"
                        borderColor="border-blue-500/30"
                        valueColor="text-blue-400"
                        badge={`${stats.highProbability} >70%`}
                        badgeColor="bg-blue-500/20 text-blue-400"
                        size="default"
                    />

                    <StatsCard
                        title="Signaux Détectés"
                        value={stats.totalSignals}
                        icon={Radio}
                        iconColor="text-orange-400"
                        iconBg="from-orange-500/20 to-orange-600/30"
                        borderColor="border-orange-500/30"
                        valueColor="text-orange-400"
                        badge={`${stats.highRelevance} forte`}
                        badgeColor="bg-orange-500/20 text-orange-400"
                        size="default"
                    />

                    <StatsCard
                        title="Santé API"
                        value={stats.apiHealth}
                        unit="%"
                        icon={Zap}
                        iconColor="text-green-400"
                        iconBg="from-green-500/20 to-green-600/30"
                        borderColor="border-green-500/30"
                        valueColor="text-green-400"
                        trend="up"
                        trendValue={1.2}
                        size="default"
                    />
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)]">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Grid3x3 className="w-5 h-5 text-purple-400" />
                                État des Modules
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            {modules.slice(0, 6).map((module, index) => (
                                <motion.div
                                    key={module.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-[var(--nea-text-title)] text-sm mb-1">
                                                {module.name}
                                            </h4>
                                            <p className="text-xs text-[var(--nea-text-secondary)]">
                                                {module.category} • v{module.version}
                                            </p>
                                        </div>
                                        <Badge className={`border-0 ${
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

                <motion.div variants={itemVariants}>
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)]">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-400" />
                                Prédictions Récentes
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            {predictions.slice(0, 6).map((pred, index) => (
                                <motion.div
                                    key={pred.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-[var(--nea-text-primary)] mb-1">
                                                {pred.event_name}
                                            </p>
                                            <Badge className="bg-purple-500/20 text-purple-400 border-0 text-xs">
                                                {pred.event_type}
                                            </Badge>
                                        </div>
                                        <Badge className={`ml-2 border-0 ${
                                            pred.probability_score >= 80 ? 'bg-red-500/20 text-red-400' :
                                            pred.probability_score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {Math.round(pred.probability_score)}%
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