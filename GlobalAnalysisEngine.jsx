
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { BrainCircuit, Activity, TrendingUp, Zap, Play, Pause, Database, GitMerge, AlertTriangle } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { toast } from 'sonner';
import { formatLargeNumber, formatPercentage } from '../components/utils/NumberFormatter';
import StatsCard from '../components/ui/StatsCard';

export default function GlobalAnalysisEngine() {
    const [isRunning, setIsRunning] = useState(false);
    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [results, setResults] = useState(null);
    // New state variables for detailed stats
    const [predictions, setPredictions] = useState([]);
    const [signals, setSignals] = useState([]);
    const [trends, setTrends] = useState([]);
    const [correlationResults, setCorrelationResults] = useState([]);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        loadModules();
        // Simulate loading other data for stats
        setPredictions([{ probability_score: 85 }, { probability_score: 60 }]);
        setSignals([{ relevance_score: 90 }, { relevance_score: 70 }]);
        setTrends([{}, {}]);
        setCorrelationResults([{ strength: 0.8 }, { strength: 0.6 }, { strength: 0.75 }]);
    }, []);

    const loadModules = async () => {
        setIsLoading(true);
        try {
            const data = await base44.entities.Module.list();
            setModules(data);
        } catch (error) {
            console.error("Erreur chargement:", error);
            toast.error("Échec du chargement");
        } finally {
            setIsLoading(false);
        }
    };

    const startAnalysis = async () => {
        setIsRunning(true);
        setAnalysisProgress(0);
        setResults(null);

        try {
            const stats = {
                modulesAnalyzed: 0,
                correlationsFound: 0,
                anomaliesDetected: 0,
                predictionsGenerated: 0
            };

            for (let i = 0; i < modules.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 100));
                setAnalysisProgress(((i + 1) / modules.length) * 100);
                
                stats.modulesAnalyzed++;
                if (Math.random() > 0.7) stats.correlationsFound++;
                if (Math.random() > 0.85) stats.anomaliesDetected++;
                if (Math.random() > 0.6) stats.predictionsGenerated++;
            }

            setResults(stats);
            toast.success("Analyse globale terminée");
        } catch (error) {
            toast.error("Échec de l'analyse");
        } finally {
            setIsRunning(false);
        }
    };

    const stopAnalysis = () => {
        setIsRunning(false);
        toast.info("Analyse arrêtée");
    };

    const stats = useMemo(() => ({
        totalDataPoints: predictions.length + signals.length + trends.length + modules.length,
        correlations: correlationResults.length,
        highCorrelations: correlationResults.filter(c => c.strength >= 0.7).length,
        anomalies: predictions.filter(p => p.probability_score >= 80).length + 
                   signals.filter(s => s.relevance_score >= 80).length,
        activeModules: modules.filter(m => m.status === 'Active').length, // Assuming modules have a 'status' field
        analysisDepth: Math.min(100, (correlationResults.length / 50) * 100) // Example calculation for depth
    }), [predictions, signals, trends, modules, correlationResults]);

    if (isLoading) {
        return <LoadingTransition message="Initialisation Moteur d'Analyse Globale..." />;
    }

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Moteur d'Analyse Globale", href: "GlobalAnalysisEngine" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<BrainCircuit className="w-8 h-8 text-purple-400" />}
                    title="Moteur d'Analyse Globale"
                    subtitle="Intelligence artificielle pour analyse multi-modules"
                />
            </motion.div>

            {/* Stats Grid with StatsCard */}
            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Points de Données"
                        value={formatLargeNumber(stats.totalDataPoints)}
                        icon={Database}
                        iconColor="text-blue-400"
                        iconBg="from-blue-500/20 to-blue-600/30"
                        borderColor="border-blue-500/30"
                        valueColor="text-blue-400"
                        compact={true}
                        subtitle="analysés"
                        size="default"
                    />

                    <StatsCard
                        title="Corrélations"
                        value={formatLargeNumber(stats.correlations)}
                        icon={GitMerge}
                        iconColor="text-purple-400"
                        iconBg="from-purple-500/20 to-purple-600/30"
                        borderColor="border-purple-500/30"
                        valueColor="text-purple-400"
                        badge={`${formatLargeNumber(stats.highCorrelations)} fortes`}
                        badgeColor="bg-purple-500/20 text-purple-400"
                        size="default"
                    />

                    <StatsCard
                        title="Anomalies Détectées"
                        value={formatLargeNumber(stats.anomalies)}
                        icon={AlertTriangle}
                        iconColor="text-orange-400"
                        iconBg="from-orange-500/20 to-orange-600/30"
                        borderColor="border-orange-500/30"
                        valueColor="text-orange-400"
                        subtitle="haute priorité"
                        size="default"
                    />

                    <StatsCard
                        title="Profondeur Analyse"
                        value={formatPercentage(stats.analysisDepth)}
                        unit="" // Unit is now part of the formatted value from formatPercentage
                        icon={Activity}
                        iconColor="text-green-400"
                        iconBg="from-green-500/20 to-green-600/30"
                        borderColor="border-green-500/30"
                        valueColor="text-green-400"
                        trend={stats.analysisDepth >= 75 ? "up" : "neutral"}
                        trendValue={stats.analysisDepth >= 75 ? 5 : 0}
                        size="default"
                    />
                </div>
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard className={`transition-all duration-500 ${
                    isRunning ? 'border-2 border-purple-500 shadow-lg shadow-purple-500/20' : ''
                }`}>
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                                    isRunning ? 'bg-purple-500 animate-pulse' : 'bg-gray-500/20'
                                }`}>
                                    <BrainCircuit className={`w-10 h-10 ${
                                        isRunning ? 'text-white' : 'text-purple-400'
                                    }`} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                        {isRunning ? "Analyse en cours..." : "Moteur prêt"}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {modules.length} modules disponibles
                                    </p>
                                </div>
                            </div>
                            <Badge className={isRunning 
                                ? "bg-purple-500/20 text-purple-400 border-purple-500/30" 
                                : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                            }>
                                {isRunning ? "Actif" : "Inactif"}
                            </Badge>
                        </div>

                        <AnimatePresence>
                            {isRunning && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6"
                                >
                                    <Progress value={analysisProgress} className="h-3 mb-2" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                                        {analysisProgress.toFixed(0)}% - Analyse des modules et corrélations
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex gap-4">
                            <NeaButton
                                onClick={startAnalysis}
                                disabled={isRunning}
                                className="flex-1"
                                size="lg"
                            >
                                <Play className="w-5 h-5 mr-2" />
                                Lancer Analyse Globale
                            </NeaButton>
                            {isRunning && (
                                <NeaButton
                                    onClick={stopAnalysis}
                                    variant="destructive"
                                    size="lg"
                                >
                                    <Pause className="w-5 h-5 mr-2" />
                                    Arrêter
                                </NeaButton>
                            )}
                        </div>
                    </div>
                </NeaCard>
            </motion.div>

            <AnimatePresence>
                {results && (
                    <motion.div
                        variants={itemVariants}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <NeaCard>
                            <div className="p-4 border-b border-[var(--nea-border-default)]">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Résultats d'Analyse
                                </h3>
                            </div>
                            <div className="p-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { 
                                        label: "Modules Analysés", 
                                        value: results.modulesAnalyzed, 
                                        icon: Activity,
                                        color: "text-blue-400" 
                                    },
                                    { 
                                        label: "Corrélations", 
                                        value: results.correlationsFound, 
                                        icon: Zap,
                                        color: "text-yellow-400" 
                                    },
                                    { 
                                        label: "Anomalies", 
                                        value: results.anomaliesDetected, 
                                        icon: Activity,
                                        color: "text-red-400" 
                                    },
                                    { 
                                        label: "Prédictions", 
                                        value: results.predictionsGenerated, 
                                        icon: TrendingUp,
                                        color: "text-green-400" 
                                    }
                                ].map((metric, idx) => {
                                    const Icon = metric.icon;
                                    return (
                                        <div key={idx} className="text-center p-4 bg-[var(--nea-bg-surface-hover)] rounded-lg">
                                            <Icon className={`w-8 h-8 ${metric.color} mx-auto mb-2`} />
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                                {metric.value}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {metric.label}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </NeaCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
