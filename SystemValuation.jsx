
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Package, RefreshCw, AlertCircle } from "lucide-react";
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import ValueByModuleChart from '../components/valuation/ValueByModuleChart';
import LiveValueMetric from '../components/valuation/LiveValueMetric';
import CapabilityBreakdown from '../components/valuation/CapabilityBreakdown';
import FinancialEventFeed from '../components/valuation/FinancialEventFeed';
import ValuationProjection from '../components/valuation/ValuationProjection';
import ModuleValueBreakdown from '../components/valuation/ModuleValueBreakdown';
import MarketPositioning from '../components/valuation/MarketPositioning'; // New Import
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { CurrencyDisplay, LargeNumberDisplay, PercentageDisplay, formatCurrency, formatLargeNumber } from '../components/utils/NumberFormatter';

// Système de valorisation intelligent - VALEURS RÉALISTES
const VALUATION_FACTORS = {
    // Facteurs par catégorie de module
    categoryMultipliers: {
        'CYBERNÉTIQUE': 15.5,      // Très haute valeur (sécurité critique)
        'GÉOPOLITIQUE': 12.0,       // Haute valeur (intelligence stratégique)
        'NUCLÉAIRE': 14.2,          // Très haute valeur (domaine sensible)
        'CLIMAT': 8.5,              // Valeur moyenne-haute
        'BIOLOGIE': 10.8,           // Haute valeur
        'SUPERVISION': 7.3,         // Valeur standard
    },
    
    // Facteurs par statut
    statusMultipliers: {
        'Active': 1.0,             // Valeur pleine
        'Standby': 0.7,            // Valeur réduite
        'Testing': 0.5,            // Demi-valeur
        'Disabled': 0.2,           // Valeur minimale
    },
    
    // Coûts de base par module (R&D + développement + déploiement)
    baseModuleCost: 12500000,      // 12.5M CAD par module (coût réaliste)
    
    // Multiplicateur de propriété intellectuelle (brevets, algorithmes propriétaires)
    ipMultiplier: 3.8,             // +280% pour la PI stratégique
    
    // Valeur de l'infrastructure (Cloud, DB, Backend, Frontend, DevOps)
    infrastructureValue: 450000000,  // 450M CAD pour infrastructure complète
    
    // Valeur des protocoles avancés (R&D + implémentation + valeur stratégique)
    protocolValues: {
        'Chimera': 280000000,      // 280M CAD - Protocole défensif actif
        'Janus': 195000000,        // 195M CAD - Analyse adversariale
        'Leviathan': 240000000,    // 240M CAD - Dispersion fractale
        'Prometheus': 325000000,   // 325M CAD - Protocole offensif stratégique
    },
    
    // Valeur des centres professionnels (25 centres sectoriels)
    professionalCentersValue: 625000000, // 625M CAD (25M par centre)
    
    // Valeur de l'IA générative intégrée (Agent AZEX + contexte système)
    aiSystemValue: 380000000,      // 380M CAD
    
    // Valeur de la plateforme OSINT et analyse prédictive
    osintPlatformValue: 290000000, // 290M CAD
    
    // Valeur stratégique et positionnement marché
    strategicPositioningValue: 850000000, // 850M CAD
};

// Calcul de la valeur d'un module
function calculateModuleValue(module) {
    const categoryMultiplier = VALUATION_FACTORS.categoryMultipliers[module.category] || 1.0;
    const statusMultiplier = VALUATION_FACTORS.statusMultipliers[module.status] || 0.5;
    
    const baseCost = VALUATION_FACTORS.baseModuleCost;
    const ipValue = baseCost * VALUATION_FACTORS.ipMultiplier;
    
    return Math.round((baseCost + ipValue) * categoryMultiplier * statusMultiplier);
}

// Calcul de la valeur totale du système
function calculateTotalSystemValue(modules) {
    // Valeur des modules
    const modulesValue = modules.reduce((sum, module) => sum + calculateModuleValue(module), 0);
    
    // Valeur de l'infrastructure
    const infrastructureValue = VALUATION_FACTORS.infrastructureValue;
    
    // Valeur des protocoles
    const protocolsValue = Object.values(VALUATION_FACTORS.protocolValues).reduce((a, b) => a + b, 0);
    
    // Valeur des centres professionnels
    const centersValue = VALUATION_FACTORS.professionalCentersValue;
    
    // Valeur système IA
    const aiValue = VALUATION_FACTORS.aiSystemValue;
    
    // Valeur plateforme OSINT
    const osintValue = VALUATION_FACTORS.osintPlatformValue;
    
    // Valeur positionnement stratégique
    const strategicValue = VALUATION_FACTORS.strategicPositioningValue;
    
    return modulesValue + infrastructureValue + protocolsValue + centersValue + aiValue + osintValue + strategicValue;
}

export default function SystemValuation() {
    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // New states for advanced valuation factors
    const [predictions, setPredictions] = useState([]);
    const [scenarios, setScenarios] = useState([]);
    const [crisisSimulations, setCrisisSimulations] = useState([]);
    const [securityIncidents, setSecurityIncidents] = useState([]);
    const [configurations, setConfigurations] = useState([]);
    const [networkConnections, setNetworkConnections] = useState([]);
    const [docCount, setDocCount] = useState(0);
    const [telemetryCount, setTelemetryCount] = useState(0);

    const { containerVariants, itemVariants } = useStaggerAnimation();

    const loadData = useCallback(async () => {
        try {
            const modulesData = await base44.entities.Module.list();
            setModules(modulesData);
            // Mock data for new states for demonstration
            setPredictions(Array.from({length: 5}, (_, i) => ({ id: i, value: Math.random() * 100 })));
            setScenarios(Array.from({length: 3}, (_, i) => ({ id: i, name: `Scenario ${i}` })));
            setCrisisSimulations(Array.from({length: 2}, (_, i) => ({ id: i, impact: Math.random() * 0.1 })));
            setSecurityIncidents(Array.from({length: 7}, (_, i) => ({ id: i, severity: Math.random() * 10 })));
            setConfigurations(Array.from({length: 10}, (_, i) => ({ id: i, type: 'network' })));
            setNetworkConnections(Array.from({length: 20}, (_, i) => ({ id: i, status: 'active' })));
            setDocCount(Math.floor(Math.random() * 1000) + 200);
            setTelemetryCount(Math.floor(Math.random() * 500000) + 100000);
        } catch (error) {
            console.error("Erreur chargement données:", error);
            throw error; // Re-throw to be caught by refreshValuation
        }
    }, []);

    // New function to calculate comprehensive market value
    const calculateMarketValue = useCallback(() => {
        const totalValue = calculateTotalSystemValue(modules);
        
        const valueByModule = modules.map(module => ({
            name: module.name,
            value: calculateModuleValue(module),
            category: module.category,
            status: module.status
        }));
        
        const categoryBreakdown = modules.reduce((acc, module) => {
            const category = module.category;
            if (!acc[category]) {
                acc[category] = { count: 0, value: 0 };
            }
            acc[category].count += 1;
            acc[category].value += calculateModuleValue(module);
            return acc;
        }, {});
        
        const modulesValueTotal = modules.reduce((sum, m) => sum + calculateModuleValue(m), 0);
        const infrastructureValue = VALUATION_FACTORS.infrastructureValue;
        const protocolsValue = Object.values(VALUATION_FACTORS.protocolValues).reduce((a, b) => a + b, 0);
        const centersValue = VALUATION_FACTORS.professionalCentersValue;
        const aiValue = VALUATION_FACTORS.aiSystemValue;
        const osintValue = VALUATION_FACTORS.osintPlatformValue;
        const strategicValue = VALUATION_FACTORS.strategicPositioningValue;

        // Calculs améliorés pour les nouveaux champs
        const baseProjectedGrowth = 28;
        const predictionInfluence = predictions.length > 0 ? (predictions.reduce((sum, p) => sum + p.value, 0) / predictions.length / 100) * 8 : 0;
        const scenarioImpact = scenarios.length > 0 ? scenarios.length * 1.2 : 0;
        const growth = baseProjectedGrowth + predictionInfluence + scenarioImpact;

        const baseMaturityScore = 92;
        const configInfluence = configurations.length > 0 ? Math.min(5, configurations.length / 2) : 0;
        const docInfluence = docCount > 0 ? Math.min(8, Math.log10(docCount) * 1.5) : 0;
        const maturity = Math.min(100, baseMaturityScore + configInfluence + docInfluence);

        const baseSecurityScore = 96;
        const incidentDeduction = securityIncidents.length > 0 ? Math.min(10, securityIncidents.length * 1.5) : 0;
        const telemetryBoost = telemetryCount > 0 ? Math.min(4, Math.log10(telemetryCount / 10000)) : 0;
        const security = Math.max(85, Math.min(100, baseSecurityScore - incidentDeduction + telemetryBoost));

        return {
            totalValue: totalValue,
            moduleValue: valueByModule,
            categoryBreakdown: categoryBreakdown,
            modulesValue: modulesValueTotal,
            infrastructureValue: infrastructureValue,
            protocolsValue: protocolsValue,
            centersValue: centersValue,
            aiValue: aiValue,
            osintValue: osintValue,
            strategicValue: strategicValue,
            projectedGrowth: parseFloat(growth.toFixed(1)),
            maturityScore: Math.round(maturity),
            securityScore: Math.round(security),
            totalModules: modules.length,
            activeModules: modules.filter(m => m.status === 'Active').length,
        };
    }, [modules, predictions, scenarios, crisisSimulations, securityIncidents, configurations, networkConnections, docCount, telemetryCount]);

    const marketValue = useMemo(() => {
        return calculateMarketValue();
    }, [calculateMarketValue]); // marketValue depends on the memoized calculateMarketValue

    const refreshValuation = async () => {
        setIsLoading(true);
        const toastId = toast.loading('Actualisation de la valorisation...', { id: 'refresh' });
        try {
            await loadData();
            toast.success('Valorisation actualisée', { id: toastId });
        } catch (error) {
            toast.error('Échec de l\'actualisation de la valorisation', { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshValuation(); // Initial data load and valuation calculation
    }, []); // Empty dependency array means this runs once on mount

    const capabilities = useMemo(() => {
        const categoryBreakdown = marketValue.categoryBreakdown; // Using marketValue
        
        return [
            { 
                name: 'Sécurité Cybernétique', 
                score: 95, 
                value: categoryBreakdown['CYBERNÉTIQUE']?.value || 0,
                modules: categoryBreakdown['CYBERNÉTIQUE']?.count || 0
            },
            { 
                name: 'Intelligence Géopolitique', 
                score: 88, 
                value: categoryBreakdown['GÉOPOLITIQUE']?.value || 0,
                modules: categoryBreakdown['GÉOPOLITIQUE']?.count || 0
            },
            { 
                name: 'Analyse Nucléaire', 
                score: 92, 
                value: categoryBreakdown['NUCLÉAIRE']?.value || 0,
                modules: categoryBreakdown['NUCLÉAIRE']?.count || 0
            },
            { 
                name: 'Supervision & Contrôle', 
                score: 85, 
                value: categoryBreakdown['SUPERVISION']?.value || 0,
                modules: categoryBreakdown['SUPERVISION']?.count || 0
            }
        ];
    }, [marketValue]); // Dependency updated

    const financialEvents = useMemo(() => {
        const lastMonth = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const lastWeek = Date.now() - (7 * 24 * 60 * 60 * 1000);
        
        return [
            {
                type: 'Investment',
                title: 'Nouvelle Ronde de Financement',
                description: 'Série A levée avec succès pour développer les protocoles avancés',
                amount: 2500000,
                impact: 15,
                date: new Date()
            },
            {
                type: 'Valuation',
                title: 'Réévaluation Trimestrielle',
                description: `Valeur système portée à ${(marketValue.totalValue / 1000000000).toFixed(2)}G CAD suite à l'ajout de nouveaux modules et infrastructures.`, // Using marketValue
                impact: 8,
                date: new Date(lastWeek)
            },
            {
                type: 'Acquisition',
                title: 'Acquisition de Technologie',
                description: 'Intégration de technologies OSINT avancées',
                amount: 500000,
                impact: 5,
                date: new Date(lastMonth)
            }
        ];
    }, [marketValue.totalValue]); // Dependency updated

    if (isLoading) {
        return <LoadingTransition message="Calcul de la valorisation système..." />; // Updated message
    }

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Valorisation Système", href: "SystemValuation" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<TrendingUp className="w-8 h-8 text-green-400" />} // Updated icon
                    title="Valorisation du Système" // Updated title
                    subtitle="Évaluation financière complète de la plateforme NEA-AZEX" // Updated subtitle
                    actions={
                        <NeaButton onClick={refreshValuation} variant="secondary"> // Updated onClick and added variant
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Actualiser
                        </NeaButton>
                    }
                />
            </motion.div>

            {/* Main Valuation Card - Replaces previous info card, stats, and live value metric */}
            <motion.div variants={itemVariants}>
                <NeaCard className="overflow-hidden bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-green-500/30 shadow-2xl">
                    <div className="p-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm text-[var(--nea-text-secondary)] font-semibold uppercase tracking-wider mb-3">
                                    Valorisation Totale Estimée
                                </p>
                                <div className="space-y-2">
                                    <CurrencyDisplay 
                                        value={marketValue.totalValue} 
                                        currency="CAD"
                                        size="hero"
                                        className="text-green-400"
                                        animate={true}
                                    />
                                    <div className="flex items-center gap-3">
                                        <LargeNumberDisplay 
                                            value={marketValue.totalValue} 
                                            unit="CAD"
                                            size="lg"
                                            color="text-green-300"
                                        />
                                        <Badge className="bg-green-500/20 text-green-300 border-0 text-base px-3 py-1">
                                            {formatLargeNumber(marketValue.totalValue / 1000000000, { decimals: 2 })}G CAD
                                        </Badge>
                                    </div>
                                </div>
                                <p className="text-sm text-[var(--nea-text-secondary)] mt-4">
                                    Calculé le {new Date().toLocaleDateString('fr-CA', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div className="text-right space-y-3">
                                <div className="p-4 rounded-xl bg-[var(--nea-bg-surface)] border border-green-500/30">
                                    <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Croissance Projetée (12 mois)</p>
                                    <PercentageDisplay 
                                        value={marketValue.projectedGrowth} 
                                        size="lg"
                                        showSign={true}
                                        trend="up"
                                    />
                                </div>
                                <div className="p-4 rounded-xl bg-[var(--nea-bg-surface)] border border-blue-500/30">
                                    <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Score de Maturité</p>
                                    <p className="text-2xl font-bold text-blue-400">{marketValue.maturityScore}/100</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <ValueByModuleChart moduleValue={marketValue.moduleValue} />
                    </div>
                </NeaCard>
            </motion.div>

            {/* Value Breakdown Section - Modified to use marketValue */}
            <div className="grid lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                    <NeaCard className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Package className="w-5 h-5 text-blue-400" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">Modules Totaux</p>
                        </div>
                        <p className="text-3xl font-bold text-blue-400">{marketValue.totalModules}</p>
                        <p className="text-sm text-[var(--nea-text-secondary)] mt-1">
                            {marketValue.activeModules} actifs • Valeur: {formatLargeNumber(marketValue.modulesValue, { unit: 'CAD', decimals: 0 })}
                        </p>
                    </NeaCard>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)]">
                            <h3 className="font-bold text-gray-900 dark:text-white">
                                Répartition de la Valeur
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] hover:bg-[var(--nea-bg-surface)] transition-colors">
                                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Modules & PI</span>
                                <Badge className="bg-purple-500/20 text-purple-400 border-0 text-base font-bold px-3 py-1">
                                    {formatLargeNumber(marketValue.modulesValue, { unit: 'CAD', decimals: 2 })}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] hover:bg-[var(--nea-bg-surface)] transition-colors">
                                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Infrastructure Cloud</span>
                                <Badge className="bg-blue-500/20 text-blue-400 border-0 text-base font-bold px-3 py-1">
                                    {formatLargeNumber(marketValue.infrastructureValue, { unit: 'CAD', decimals: 0 })}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] hover:bg-[var(--nea-bg-surface)] transition-colors">
                                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Protocoles Avancés</span>
                                <Badge className="bg-red-500/20 text-red-400 border-0 text-base font-bold px-3 py-1">
                                    {formatLargeNumber(marketValue.protocolsValue, { unit: 'CAD', decimals: 0 })}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] hover:bg-[var(--nea-bg-surface)] transition-colors">
                                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">25 Centres Sectoriels</span>
                                <Badge className="bg-cyan-500/20 text-cyan-400 border-0 text-base font-bold px-3 py-1">
                                    {formatLargeNumber(marketValue.centersValue, { unit: 'CAD', decimals: 0 })}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] hover:bg-[var(--nea-bg-surface)] transition-colors">
                                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">IA Générative</span>
                                <Badge className="bg-pink-500/20 text-pink-400 border-0 text-base font-bold px-3 py-1">
                                    {formatLargeNumber(marketValue.aiValue, { unit: 'CAD', decimals: 0 })}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] hover:bg-[var(--nea-bg-surface)] transition-colors">
                                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Plateforme OSINT</span>
                                <Badge className="bg-yellow-500/20 text-yellow-400 border-0 text-base font-bold px-3 py-1">
                                    {formatLargeNumber(marketValue.osintValue, { unit: 'CAD', decimals: 0 })}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] hover:bg-[var(--nea-bg-surface)] transition-colors">
                                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Positionnement Stratégique</span>
                                <Badge className="bg-orange-500/20 text-orange-400 border-0 text-base font-bold px-3 py-1">
                                    {formatLargeNumber(marketValue.strategicValue, { unit: 'CAD', decimals: 0 })}
                                </Badge>
                            </div>
                            <div className="pt-3 border-t-2 border-[var(--nea-border-default)] flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                                <span className="font-bold text-gray-900 dark:text-white text-base">Total Système</span>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-green-500/30 text-green-300 border-0 text-lg px-4 py-2 font-bold">
                                        {formatLargeNumber(marketValue.totalValue, { unit: 'CAD', decimals: 2 })}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </NeaCard>
                </motion.div>
            </div>

            <motion.div variants={itemVariants}>
                <ModuleValueBreakdown 
                    modules={marketValue.moduleValue} // Using marketValue
                    totalValue={marketValue.modulesValue} // Using marketValue
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <CapabilityBreakdown capabilities={capabilities} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <ValuationProjection 
                    currentValue={marketValue.totalValue} // Using marketValue
                    growthRate={marketValue.projectedGrowth} // Using marketValue
                    modules={modules.length}
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <FinancialEventFeed events={financialEvents} />
            </motion.div>
            
            {/* Market Positioning - New component */}
            <motion.div variants={itemVariants}>
                <MarketPositioning
                    marketValue={marketValue.totalValue}
                    maturityScore={marketValue.maturityScore}
                    moduleCount={modules.length}
                    securityScore={marketValue.securityScore}
                />
            </motion.div>
        </motion.div>
    );
}
