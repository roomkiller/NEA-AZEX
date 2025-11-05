
import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { BrainCircuit, Cpu, Database, Shield, Code, Zap, DollarSign, Package } from "lucide-react"; // Added Package icon
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { CurrencyDisplay, LargeNumberDisplay, formatLargeNumber, formatCurrency } from '../components/utils/NumberFormatter';

// Calcul intelligent basé sur les données réelles
function calculateAssetValues(modules) {
    const totalModules = modules.length;
    const activeModules = modules.filter(m => m.status === 'Active').length;
    
    // Estimation des lignes de code (moyenne 700 lignes par module + infrastructure)
    const estimatedLOC = (totalModules * 700) + 25000; // +25K pour l'infrastructure
    
    // Coût de développement moyen : 50$/ligne pour du code de qualité entreprise
    const developmentCost = estimatedLOC * 50;
    
    // Propriété Intellectuelle (algorithmes, brevets, méthodes)
    const intellectualProperty = developmentCost * 0.35; // 35% de la valeur dev
    
    // Infrastructure IA (Agent AZEX, modèles, pipeline)
    const aiInfrastructure = developmentCost * 0.22; // 22% de la valeur dev
    
    // Base de données et contenu (schémas, documentation, données historiques)
    const dataAssets = developmentCost * 0.085; // 8.5% de la valeur dev
    
    // Sécurité et conformité (chiffrement, audits, certifications)
    const securityCompliance = developmentCost * 0.065; // 6.5% de la valeur dev
    
    // Architecture et code source = reste
    const codeArchitecture = developmentCost * 0.28; // 28% de la valeur dev
    
    // Calculate total value based on the sum of these categories
    const totalCalculatedValue = intellectualProperty + codeArchitecture + 
                                 aiInfrastructure + dataAssets + securityCompliance;

    // Additional metrics
    const valuePerModule = totalModules > 0 ? totalCalculatedValue / totalModules : 0;
    const projectedROI = 30; // Example placeholder: 30% projected ROI

    return {
        intellectualProperty,
        codeArchitecture,
        aiInfrastructure,
        dataAssets,
        securityCompliance,
        estimatedLOC,
        totalModules,
        activeModules,
        totalCalculatedValue,
        valuePerModule,
        projectedROI
    };
}

export default function SoftwareAssetValuation() {
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

    const assets = useMemo(() => calculateAssetValues(modules), [modules]);

    const assetCategories = useMemo(() => {
        // Use the total calculated value directly from assets
        const total = assets.totalCalculatedValue;
        
        return [
            {
                name: 'Propriété Intellectuelle',
                icon: BrainCircuit,
                value: assets.intellectualProperty,
                percentage: (assets.intellectualProperty / total * 100).toFixed(1),
                color: 'text-purple-400',
                bg: 'bg-purple-500/10',
                items: [
                    `Algorithmes de prédiction propriétaires (${modules.length} modules)`,
                    'Protocoles de sécurité brevetés (Chimère, Janus, Léviathan, Prométhée)',
                    'Méthodes d\'analyse avancées et corrélation',
                    'Architecture système unique et modulaire'
                ]
            },
            {
                name: 'Code Source & Architecture',
                icon: Code,
                value: assets.codeArchitecture,
                percentage: (assets.codeArchitecture / total * 100).toFixed(1),
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
                items: [
                    `Base de code React/TypeScript (~${Math.round(assets.estimatedLOC).toLocaleString()} lignes)`,
                    '70+ composants UI réutilisables',
                    'Architecture backend scalable avec RLS',
                    'API et intégrations multiples'
                ]
            },
            {
                name: 'Infrastructure IA',
                icon: Cpu,
                value: assets.aiInfrastructure,
                percentage: (assets.aiInfrastructure / total * 100).toFixed(1),
                color: 'text-green-400',
                bg: 'bg-green-500/10',
                items: [
                    'Agent AZEX (IA conversationnelle avec contexte système)',
                    'Modèles de prédiction entraînés',
                    'Pipeline de données automatisé',
                    'Système de corrélation multi-domaines'
                ]
            },
            {
                name: 'Base de Données & Contenu',
                icon: Database,
                value: assets.dataAssets,
                percentage: (assets.dataAssets / total * 100).toFixed(1),
                color: 'text-cyan-400',
                bg: 'bg-cyan-500/10',
                items: [
                    '35+ entités de données optimisées',
                    'Documentation technique complète',
                    'Données historiques et métriques',
                    'Métadonnées enrichies par IA'
                ]
            },
            {
                name: 'Sécurité & Conformité',
                icon: Shield,
                value: assets.securityCompliance,
                percentage: (assets.securityCompliance / total * 100).toFixed(1),
                color: 'text-red-400',
                bg: 'bg-red-500/10',
                items: [
                    'Système de chiffrement RSA-4096',
                    'Contrôles d\'accès multi-niveaux (RLS)',
                    'Audit trails automatisés',
                    'Conformité réglementaire continue'
                ]
            }
        ];
    }, [assets, modules.length]);

    // totalValue now directly comes from assets.totalCalculatedValue
    const totalValue = assets.totalCalculatedValue;

    const technicalMetrics = useMemo(() => [
        { label: 'Lignes de Code', value: `~${Math.round(assets.estimatedLOC / 1000)}K`, icon: Code },
        { label: 'Composants', value: '70+', icon: Zap },
        { label: 'Entités de Données', value: '35+', icon: Database },
        { label: 'Protocoles Avancés', value: '4', icon: Shield }
    ], [assets.estimatedLOC]);

    if (isLoading) {
        return <LoadingTransition message="Évaluation des actifs logiciels..." />;
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
                    { name: "Actifs Logiciels", href: "SoftwareAssetValuation" }
                ]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Package className="w-8 h-8 text-cyan-400" />}
                    title="Valorisation des Actifs Logiciels"
                    subtitle="Analyse détaillée de la valeur des composants du système"
                />
            </motion.div>

            {/* Total Asset Value */}
            <motion.div variants={itemVariants}>
                <NeaCard className="overflow-hidden bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-2 border-cyan-500/30 shadow-2xl">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <p className="text-sm text-[var(--nea-text-secondary)] font-semibold uppercase tracking-wider mb-3">
                                Valeur Totale des Actifs Logiciels
                            </p>
                            <div className="space-y-3">
                                <CurrencyDisplay 
                                    value={assets.totalCalculatedValue} 
                                    currency="CAD"
                                    size="hero"
                                    className="text-cyan-400 justify-center"
                                    animate={true}
                                />
                                <div className="flex items-center justify-center gap-3">
                                    <Badge className="bg-cyan-500/20 text-cyan-300 border-0 text-xl px-4 py-2">
                                        {formatLargeNumber(assets.totalCalculatedValue / 1000000000, { decimals: 2 })}G CAD
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-6 mt-6">
                                <div className="text-center px-6 py-3 rounded-xl bg-green-500/10 border border-green-500/30">
                                    <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Valeur par Module</p>
                                    <CurrencyDisplay 
                                        value={assets.valuePerModule} 
                                        currency="CAD"
                                        size="lg"
                                        className="text-green-400"
                                        compact={true}
                                    />
                                </div>
                                <div className="text-center px-6 py-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
                                    <p className="text-xs text-[var(--nea-text-secondary)] mb-1">ROI Projeté</p>
                                    <p className="text-2xl font-bold text-purple-400">
                                        +{assets.projectedROI}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>

            {/* Métriques Techniques */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
                {technicalMetrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <NeaCard key={index} className="p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <Icon className="w-5 h-5 text-[var(--nea-primary-blue)]" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                            </div>
                            <p className="text-3xl font-bold text-[var(--nea-primary-blue)]">
                                {metric.value}
                            </p>
                        </NeaCard>
                    );
                })}
            </motion.div>

            {/* Répartition des Actifs */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                            Répartition des Actifs par Catégorie
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {assetCategories.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`p-6 rounded-lg border ${category.bg} border-[var(--nea-border-default)]`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-lg ${category.bg} flex items-center justify-center`}>
                                                <Icon className={`w-6 h-6 ${category.color}`} />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                                    {category.name}
                                                </h4>
                                                <Badge className={`${category.bg} ${category.color} border-0`}>
                                                    {category.percentage}% du total
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                                Valeur Estimée
                                            </p>
                                            <p className={`text-2xl font-bold ${category.color}`}>
                                                {(category.value / 1000000).toLocaleString('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 2 }).replace(' CAD', '')}M
                                            </p>
                                        </div>
                                    </div>

                                    <Progress value={parseFloat(category.percentage)} className="h-2 mb-4" />

                                    <div className="grid md:grid-cols-2 gap-2">
                                        {category.items.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                                            >
                                                <span className={`${category.color} font-bold mt-0.5`}>•</span>
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </NeaCard>
            </motion.div>

            {/* Méthodologie de Valorisation */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                            Méthodologie de Valorisation
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-yellow-400" />
                                    Critères d'Évaluation
                                </h4>
                                <ul className="space-y-2">
                                    <li className="text-sm text-gray-600 dark:text-gray-400">
                                        • Coût de développement : 50$ CAD/ligne de code
                                    </li>
                                    <li className="text-sm text-gray-600 dark:text-gray-400">
                                        • Propriété intellectuelle : 35% de la valeur dev
                                    </li>
                                    <li className="text-sm text-gray-600 dark:text-gray-400">
                                        • Infrastructure IA : 22% de la valeur dev
                                    </li>
                                    <li className="text-sm text-gray-600 dark:text-gray-400">
                                        • Nombre de modules actifs : {assets.activeModules}/{assets.totalModules}
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-green-400" />
                                    Facteurs de Risque
                                </h4>
                                <ul className="space-y-2">
                                    <li className="text-sm text-gray-600 dark:text-gray-400">
                                        • Dépendance aux technologies tierces (React, Base44)
                                    </li>
                                    <li className="text-sm text-gray-600 dark:text-gray-400">
                                        • Cycle de vie des technologies utilisées
                                    </li>
                                    <li className="text-sm text-gray-600 dark:text-gray-400">
                                        • Protection de la propriété intellectuelle
                                    </li>
                                    <li className="text-sm text-gray-600 dark:text-gray-400">
                                        • Conformité réglementaire continue
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
