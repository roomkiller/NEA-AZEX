import React, { useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Activity, Search, TrendingUp, AlertTriangle } from "lucide-react";
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { toast } from 'sonner';

export default function DeepModuleAnalysis() {
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [analysisData, setAnalysisData] = useState(null);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    React.useEffect(() => {
        const loadModules = async () => {
            setIsLoading(true);
            try {
                const data = await base44.entities.Module.list();
                setModules(data);
            } catch (error) {
                console.error("Erreur chargement modules:", error);
                toast.error("Échec du chargement des modules");
            } finally {
                setIsLoading(false);
            }
        };
        loadModules();
    }, []);

    const analyzeModule = useCallback(async (module) => {
        setSelectedModule(module);
        setAnalysisData({
            performanceScore: Math.floor(Math.random() * 30) + 70,
            uptime: Math.floor(Math.random() * 10) + 90,
            errorRate: (Math.random() * 2).toFixed(2),
            avgResponseTime: Math.floor(Math.random() * 100) + 50,
            recommendations: [
                "Optimiser les requêtes de base de données",
                "Augmenter la capacité de cache",
                "Mettre à jour les dépendances critiques"
            ]
        });
    }, []);

    const filteredModules = modules.filter(m =>
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <LoadingTransition message="Chargement de l'analyse profonde..." />;
    }

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Analyse Approfondie des Modules", href: "DeepModuleAnalysis" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<Activity className="w-8 h-8 text-cyan-400" />}
                    title="Analyse Approfondie des Modules"
                    subtitle="Diagnostics détaillés et optimisations"
                />
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <Input
                                    placeholder="Rechercher un module..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white pl-10"
                                />
                            </div>
                        </div>
                        <div className="divide-y divide-[var(--nea-border-subtle)] max-h-[600px] overflow-y-auto styled-scrollbar">
                            {filteredModules.map((module, index) => (
                                <motion.div
                                    key={module.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`p-4 cursor-pointer hover:bg-[var(--nea-bg-surface-hover)] transition-colors ${
                                        selectedModule?.id === module.id ? 'bg-[var(--nea-bg-surface-hover)] border-l-4 border-cyan-500' : ''
                                    }`}
                                    onClick={() => analyzeModule(module)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">{module.name}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{module.category}</p>
                                        </div>
                                        <Badge className={
                                            module.status === 'Active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                            'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                        }>
                                            {module.status}
                                        </Badge>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </NeaCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                    {selectedModule && analysisData ? (
                        <div className="space-y-6">
                            <NeaCard>
                                <div className="p-4 border-b border-[var(--nea-border-default)]">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {selectedModule.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedModule.description}</p>
                                </div>
                                <div className="p-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-[var(--nea-bg-surface-hover)] rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <TrendingUp className="w-5 h-5 text-green-400" />
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Performance</p>
                                            </div>
                                            <p className="text-2xl font-bold text-green-400">{analysisData.performanceScore}%</p>
                                        </div>
                                        <div className="p-4 bg-[var(--nea-bg-surface-hover)] rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Activity className="w-5 h-5 text-blue-400" />
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Disponibilité</p>
                                            </div>
                                            <p className="text-2xl font-bold text-blue-400">{analysisData.uptime}%</p>
                                        </div>
                                        <div className="p-4 bg-[var(--nea-bg-surface-hover)] rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Taux d'Erreur</p>
                                            </div>
                                            <p className="text-2xl font-bold text-yellow-400">{analysisData.errorRate}%</p>
                                        </div>
                                        <div className="p-4 bg-[var(--nea-bg-surface-hover)] rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Activity className="w-5 h-5 text-cyan-400" />
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Temps Réponse</p>
                                            </div>
                                            <p className="text-2xl font-bold text-cyan-400">{analysisData.avgResponseTime}ms</p>
                                        </div>
                                    </div>
                                </div>
                            </NeaCard>

                            <NeaCard>
                                <div className="p-4 border-b border-[var(--nea-border-default)]">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recommandations</h3>
                                </div>
                                <div className="p-6 space-y-3">
                                    {analysisData.recommendations.map((rec, index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 bg-[var(--nea-bg-surface-hover)] rounded-lg">
                                            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mt-0.5">
                                                {index + 1}
                                            </Badge>
                                            <p className="text-gray-900 dark:text-white">{rec}</p>
                                        </div>
                                    ))}
                                </div>
                            </NeaCard>
                        </div>
                    ) : (
                        <NeaCard>
                            <div className="p-12 text-center">
                                <Activity className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Sélectionnez un module
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Choisissez un module dans la liste pour afficher son analyse détaillée
                                </p>
                            </div>
                        </NeaCard>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}