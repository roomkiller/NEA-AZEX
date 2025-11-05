
import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { BarChart2, Zap, TrendingUp, Target } from "lucide-react";
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import CompetitorMatrix from '../components/valuation/CompetitorMatrix';
import MarketPositioning from '../components/valuation/MarketPositioning';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { Badge } from '@/components/ui/badge'; // Added import for Badge component
import { CurrencyDisplay, formatLargeNumber, formatCurrency } from '../components/utils/NumberFormatter';

export default function CompetitiveValuation() {
    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        const loadModules = async () => {
            try {
                const data = await base44.entities.Module.list();
                setModules(data);
            } catch (error) {
                console.error("Erreur chargement modules:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadModules();
    }, []);

    // Calcul de notre valeur réelle basée sur les modules
    const ourValue = useMemo(() => {
        // Valeur simplifiée : nombre de modules × 150K + infrastructure
        return (modules.length * 150000) + 1200000 + 1760000; // modules + infra + protocoles
    }, [modules.length]);

    const competitors = useMemo(() => [
        {
            name: 'Palantir Technologies',
            value: 45000000000,
            comparison: -15,
            position: 'Leader',
            description: 'Plateforme d\'analyse de données pour gouvernements et entreprises'
        },
        {
            name: 'Recorded Future',
            value: 1200000000,
            comparison: 5,
            position: 'Challenger',
            description: 'Intelligence des menaces et surveillance OSINT'
        },
        {
            name: 'Dataminr',
            value: 4600000000,
            comparison: -8,
            position: 'Leader',
            description: 'Détection en temps réel d\'événements via IA'
        },
        {
            name: 'NEA-AZEX',
            value: ourValue,
            comparison: 0,
            position: 'Challenger',
            description: `Système intégré avec ${modules.length} modules de commandement et analyse multi-domaines`,
            highlight: true
        },
        {
            name: 'Flashpoint',
            value: 315000000,
            comparison: 3,
            position: 'Follower',
            description: 'Renseignements sur les menaces et Dark Web'
        }
    ], [ourValue, modules.length]);

    const positioning = useMemo(() => ({
        market_share: 2.5,
        growth_rate: 35,
        strategic_position: 'Challenger',
        target_segments: [
            { name: 'Agences Gouvernementales', size: 2500, priority: 'Haute' },
            { name: 'Défense & Sécurité', size: 1800, priority: 'Critique' },
            { name: 'Entreprises Fortune 500', size: 5000, priority: 'Moyenne' },
            { name: 'Centres de Recherche', size: 850, priority: 'Moyenne' }
        ],
        competitive_advantages: [
            {
                title: 'Intégration Multi-Protocoles',
                description: 'Protocoles avancés Chimère, Janus, Léviathan et Prométhée intégrés nativement'
            },
            {
                title: 'IA Générative Contextuelle',
                description: 'Agent AZEX avec accès aux données système en temps réel'
            },
            {
                title: 'Analyse Prédictive Avancée',
                description: `Moteur de prédiction basé sur ${modules.length} modules d'analyse multi-domaines`
            },
            {
                title: 'Architecture Modulaire',
                description: 'Déploiement flexible et évolutif selon les besoins spécifiques'
            }
        ]
    }), [modules.length]);

    const marketStats = useMemo(() => [
        { label: 'Taille du Marché Total', value: '$28.5B', icon: Target, color: 'text-blue-400' },
        { label: 'Croissance Annuelle', value: '+18.2%', icon: TrendingUp, color: 'text-green-400' },
        { label: 'Notre Valeur', value: `$${(ourValue / 1000000).toFixed(1)}M`, icon: BarChart2, color: 'text-purple-400' },
        { label: 'Potentiel de Croissance', value: '5x', icon: Zap, color: 'text-yellow-400' }
    ], [ourValue]);

    if (isLoading) {
        return <LoadingTransition message="Analyse compétitive en cours..." />;
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
                    { name: "Valorisation", href: "SystemValuation" },
                    { name: "Analyse Compétitive", href: "CompetitiveValuation" }
                ]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<Target className="w-8 h-8 text-purple-400" />}
                    title="Analyse Compétitive du Marché"
                    subtitle="Positionnement de NEA-AZEX face aux solutions concurrentes"
                />
            </motion.div>

            <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
                {marketStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <NeaCard key={index} className="p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <Icon className={`w-5 h-5 ${stat.color}`} />
                                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                            </div>
                            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                        </NeaCard>
                    );
                })}
            </motion.div>

            {/* Market Value Comparison */}
            <motion.div variants={itemVariants}>
                <NeaCard className="overflow-hidden border-2 border-purple-500/30 shadow-xl">
                    <div className="p-6 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-b border-[var(--nea-border-default)]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/30 shadow-lg">
                                    <TrendingUp className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-[var(--nea-text-title)]">
                                        Comparaison de Valeur Marchée
                                    </h3>
                                    <p className="text-sm text-[var(--nea-text-secondary)] mt-1">
                                        Position de NEA-AZEX vs compétiteurs • Valorisation: <span className="font-bold text-purple-400">{formatLargeNumber(ourValue, { unit: 'CAD', decimals: 2 })}</span>
                                    </p>
                                </div>
                            </div>
                            <Badge className="bg-green-500/20 text-green-400 border-0 px-4 py-2 text-base font-bold">
                                Leader du Marché
                            </Badge>
                        </div>
                    </div>
                    <div className="p-8">
                        <CompetitorMatrix systemValue={ourValue} />
                    </div>
                </NeaCard>
            </motion.div>

            <motion.div variants={itemVariants}>
                <CompetitorMatrix competitors={competitors} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <MarketPositioning positioning={positioning} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            Stratégie de Différenciation
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                    Forces Clés
                                </h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="text-green-400 font-bold">•</span>
                                        <span>Protocoles de sécurité avancés uniques sur le marché</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="text-green-400 font-bold">•</span>
                                        <span>Intégration IA générative contextuelle (Agent AZEX)</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="text-green-400 font-bold">•</span>
                                        <span>Architecture modulaire et évolutive ({modules.length} modules)</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="text-green-400 font-bold">•</span>
                                        <span>Analyse prédictive multi-domaines</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                    Opportunités de Croissance
                                </h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="text-blue-400 font-bold">•</span>
                                        <span>Expansion vers les marchés gouvernementaux internationaux</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="text-blue-400 font-bold">•</span>
                                        <span>Partenariats stratégiques avec agences de défense</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="text-blue-400 font-bold">•</span>
                                        <span>Développement de modules sectoriels spécialisés</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="text-blue-400 font-bold">•</span>
                                        <span>Certification et accréditations gouvernementales</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>
        </motion.div>
    );
}
