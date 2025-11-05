import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
    BookOpen, ChevronDown, ChevronRight, BarChart, Target, Wrench, Cpu, Shield, Crown,
    Globe, BrainCircuit, Layers, ShieldAlert, Settings, Bot, Database, FileText, DollarSign,
    Grid3x3, Activity, Hexagon, GitMerge, Ghost, Zap, Flame, Container, Users, Award,
    CreditCard, Mail, History, HeartPulse, Lock, Eye, TrendingUp, Anchor, Rocket, Package,
    Building, Wheat, Radio, Newspaper, Scale, Leaf, GraduationCap, Plane, Droplet, MapPin,
    Cloud, Search
} from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useStaggerAnimation } from '../components/navigation/PageTransition';
import { cn } from '@/lib/utils';

const SYSTEM_TREE = {
    dashboards: {
        title: "Tableaux de Bord",
        icon: BarChart,
        color: "blue",
        description: "Interfaces utilisateur par rôle",
        items: [
            { name: "Dashboard Principal", url: "Dashboard", icon: BarChart, role: "all" },
            { name: "Poste de Veille - Utilisateur", url: "UserDashboard", icon: Target, role: "user" },
            { name: "Centre de Contrôle - Technicien", url: "TechnicianDashboard", icon: Wrench, role: "technician" },
            { name: "Atelier - Développeur", url: "DeveloperDashboard", icon: Cpu, role: "developer" },
            { name: "Pont de Commandement - Admin", url: "AdminDashboard", icon: Shield, role: "admin" },
            { name: "Nexus Master", url: "MasterDashboard", icon: Crown, role: "master" }
        ]
    },
    intelligence: {
        title: "Intelligence & Analyse",
        icon: BrainCircuit,
        color: "cyan",
        description: "Systèmes d'analyse et de prédiction",
        children: {
            core: {
                title: "Systèmes Centraux",
                items: [
                    { name: "System Nexus", url: "SystemNexus", icon: Hexagon, description: "Intelligence artificielle centrale" },
                    { name: "Index Système", url: "SystemIndex", icon: Grid3x3, description: "Navigation complète" },
                    { name: "Moteur de Prédiction", url: "PredictionEngine", icon: Activity, description: "Génération de prédictions" }
                ]
            },
            analysis: {
                title: "Analyse Avancée",
                items: [
                    { name: "Prédictions d'Événements", url: "EventPredictions", icon: TrendingUp, description: "Événements futurs" },
                    { name: "Signaux Faibles", url: "WeakSignals", icon: Eye, description: "Détection OSINT" },
                    { name: "Analyse des Tendances", url: "TrendAnalysis", icon: BarChart, description: "Tendances globales" },
                    { name: "Analyse Système", url: "SystemAnalysis", icon: Activity, description: "Santé système" },
                    { name: "Moteur d'Analyse Globale", url: "GlobalAnalysisEngine", icon: BrainCircuit, description: "Analyse exhaustive" },
                    { name: "Analyse Approfondie", url: "DeepModuleAnalysis", icon: Activity, description: "Module par module" },
                    { name: "Analyse Ultra-Profonde", url: "UltraDeepAnalysis", icon: Activity, description: "500x iterations" },
                    { name: "Accélérateur d'Analyse", url: "AnalysisAccelerator", icon: Zap, description: "Optimisation cache" },
                    { name: "Moteur de Corrélation", url: "CorrelationEngine", icon: GitMerge, description: "Corrélations inter-modules" }
                ]
            }
        }
    },
    professional: {
        title: "Centres Professionnels",
        icon: Globe,
        color: "purple",
        description: "25 centres d'intelligence sectorielle",
        items: [
            { name: "Intelligence Militaire", url: "MilitaryIntelligence", icon: Shield },
            { name: "Santé Publique", url: "PublicHealthMonitor", icon: Activity },
            { name: "Investigation Journalistique", url: "InvestigativeJournalism", icon: FileText },
            { name: "Intelligence Diplomatique", url: "DiplomaticIntelligence", icon: Globe },
            { name: "Intelligence Financière", url: "FinancialIntelligence", icon: DollarSign },
            { name: "Centre Climatique & Météo", url: "ClimateWeatherCenter", icon: Cloud },
            { name: "Forces de l'Ordre", url: "LawEnforcementCenter", icon: ShieldAlert },
            { name: "Centre Énergétique", url: "EnergyCenter", icon: Zap },
            { name: "Intelligence Maritime", url: "MaritimeIntelligence", icon: Anchor },
            { name: "Centre Spatial", url: "SpaceCenter", icon: Rocket },
            { name: "Supply Chain Intelligence", url: "SupplyChainIntelligence", icon: Package },
            { name: "Intelligence Corporative", url: "CorporateIntelligence", icon: Building },
            { name: "Infrastructure Critique", url: "CriticalInfrastructure", icon: Database },
            { name: "Sécurité Agricole", url: "AgricultureSecurityCenter", icon: Wheat },
            { name: "Centre Télécommunications", url: "TelecommunicationsCenter", icon: Radio },
            { name: "Commerce International", url: "TradeIntelligence", icon: DollarSign },
            { name: "Migration & Frontières", url: "MigrationBorderSecurity", icon: Users },
            { name: "Tech & Innovation", url: "TechnologyInnovationCenter", icon: Cpu },
            { name: "Médias & Influence", url: "MediaInfluenceCenter", icon: Newspaper },
            { name: "Intelligence Juridique", url: "LegalIntelligence", icon: Scale },
            { name: "Intelligence Environnementale", url: "EnvironmentalIntelligence", icon: Leaf },
            { name: "Éducation & Recherche", url: "EducationResearchCenter", icon: GraduationCap },
            { name: "Transport & Mobilité", url: "TransportMobilityCenter", icon: Plane },
            { name: "Ressources Hydriques", url: "WaterResourcesCenter", icon: Droplet },
            { name: "Tourisme & Hôtellerie", url: "TourismHospitalityCenter", icon: MapPin }
        ]
    },
    protocols: {
        title: "Protocoles Avancés",
        icon: Layers,
        color: "red",
        description: "Systèmes de défense et d'attaque",
        items: [
            { name: "Protocole Chimère", url: "ChimeraProtocol", icon: Ghost, description: "Système de leurre offensif" },
            { name: "Protocole Janus", url: "JanusProtocol", icon: Zap, description: "Entraînement adversarial" },
            { name: "Protocole Léviathan", url: "LeviathanProtocol", icon: Container, description: "Dispersion fractale" },
            { name: "Protocole Prométhée", url: "PrometheusProtocol", icon: Flame, description: "Frappe préventive" }
        ]
    },
    security: {
        title: "Sécurité & Audit",
        icon: ShieldAlert,
        color: "orange",
        description: "Protection et surveillance système",
        items: [
            { name: "Hub Sécurité", url: "Security", icon: Shield, description: "Centre de sécurité" },
            { name: "Gestion de Crise", url: "CrisisManager", icon: ShieldAlert, description: "Simulations de crise" },
            { name: "Audit Système", url: "SystemAudit", icon: FileText, description: "Vérification complète" },
            { name: "Anti-Piratage", url: "AntiPiracy", icon: Lock, description: "Protection IP" },
            { name: "Protocole Audit d'Urgence", url: "EmergencyAuditProtocol", icon: ShieldAlert, description: "Audit critique" }
        ]
    },
    system: {
        title: "Gestion Système",
        icon: Settings,
        color: "gray",
        description: "Administration et configuration",
        children: {
            core: {
                title: "Systèmes Principaux",
                items: [
                    { name: "Statut Système", url: "SystemStatus", icon: HeartPulse },
                    { name: "Modules", url: "Modules", icon: Grid3x3 },
                    { name: "Récupération Modules", url: "ModuleRecoverySystem", icon: Package },
                    { name: "Configuration", url: "Configuration", icon: Settings },
                    { name: "Gestionnaire Réseau", url: "NetworkManager", icon: Activity },
                    { name: "Affichage Tactique", url: "TacticalDisplay", icon: Target }
                ]
            },
            updates: {
                title: "Mises à Jour",
                items: [
                    { name: "Gestion des MAJ", url: "UpdateManagement", icon: Activity },
                    { name: "Tableau MAJ", url: "UpdateDashboard", icon: Activity },
                    { name: "Gestionnaire Sauvegardes", url: "BackupManager", icon: Database }
                ]
            },
            config: {
                title: "Configuration Avancée",
                items: [
                    { name: "Sources de Données", url: "DataSourceConfiguration", icon: Database },
                    { name: "Attribution OSINT", url: "OSINTSourceAssignment", icon: Activity },
                    { name: "Activation Chiffrement", url: "EncryptionActivation", icon: Lock },
                    { name: "Initialisation Système", url: "SystemInitialization", icon: Activity },
                    { name: "Config Sources Complète", url: "ConfigurationSourcesComplete", icon: Database }
                ]
            }
        }
    },
    automation: {
        title: "Automatisation",
        icon: Bot,
        color: "green",
        description: "Systèmes automatisés et macros",
        items: [
            { name: "Générateur de Scénarios", url: "ScenarioGenerator", icon: BrainCircuit, description: "Génération IA" },
            { name: "Gestionnaire de Macros", url: "BotMacroManager", icon: Bot, description: "Automation" },
            { name: "Moteur d'Exécution", url: "BotMacroExecutionEngine", icon: Shield, description: "Runtime macros" },
            { name: "Prédiction en Cascade", url: "CascadePredictionSystem", icon: GitMerge, description: "Algorithme cascade" },
            { name: "Autonomisation Modules", url: "ModuleAutonomization", icon: Cpu, description: "Modules autonomes" }
        ]
    },
    administration: {
        title: "Administration",
        icon: Users,
        color: "yellow",
        description: "Gestion utilisateurs et abonnements",
        children: {
            users: {
                title: "Gestion Utilisateurs",
                items: [
                    { name: "Gestion Utilisateurs", url: "UserManagement", icon: Users },
                    { name: "Accréditations", url: "AccreditationManagement", icon: Shield },
                    { name: "Journal d'Activité", url: "UserActivityLog", icon: History }
                ]
            },
            subscriptions: {
                title: "Gestion Commerciale",
                items: [
                    { name: "Gestion Abonnements", url: "SubscriptionManagement", icon: DollarSign },
                    { name: "Mon Abonnement", url: "MySubscription", icon: Award },
                    { name: "Tarifs", url: "Pricing", icon: DollarSign },
                    { name: "Configuration Stripe", url: "StripeSetup", icon: CreditCard },
                    { name: "Gestion des Emails", url: "EmailManagement", icon: Mail }
                ]
            }
        }
    },
    documentation: {
        title: "Documentation",
        icon: FileText,
        color: "pink",
        description: "Guides et références",
        items: [
            { name: "Documentation Système", url: "Documentation", icon: FileText },
            { name: "Documentation Protocoles", url: "ProtocolDocumentation", icon: FileText },
            { name: "Index Système", url: "SystemIndex", icon: Grid3x3 },
            { name: "Table des Matières", url: "SystemTableOfContents", icon: BookOpen }
        ]
    },
    valuation: {
        title: "Valorisation",
        icon: DollarSign,
        color: "emerald",
        description: "Évaluation et compétitivité",
        items: [
            { name: "Valorisation Système", url: "SystemValuation", icon: DollarSign },
            { name: "Valorisation Actifs", url: "SoftwareAssetValuation", icon: DollarSign },
            { name: "Valorisation Compétitive", url: "CompetitiveValuation", icon: BarChart },
            { name: "Post-Déploiement", url: "PostDeployment", icon: Activity }
        ]
    }
};

const TreeNode = ({ node, level = 0, searchTerm }) => {
    const [isExpanded, setIsExpanded] = useState(level === 0);
    const Icon = node.icon;

    const hasMatch = (item) => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return item.name?.toLowerCase().includes(search) || 
               item.title?.toLowerCase().includes(search) ||
               item.description?.toLowerCase().includes(search);
    };

    const filteredItems = node.items?.filter(hasMatch) || [];
    const filteredChildren = node.children ? Object.entries(node.children).filter(([_, child]) => {
        return child.items?.some(hasMatch);
    }) : [];

    if (searchTerm && filteredItems.length === 0 && filteredChildren.length === 0) {
        return null;
    }

    return (
        <div className={cn("transition-all", level > 0 && "ml-6 mt-2")}>
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-all group",
                    level === 0 ? "bg-[var(--nea-bg-surface)] border border-[var(--nea-border-default)] hover:border-[var(--nea-primary-blue)] shadow-md" : "hover:bg-[var(--nea-bg-surface-hover)]"
                )}
            >
                <div className={cn(
                    "p-2 rounded-lg transition-transform",
                    level === 0 && `bg-${node.color}-500/10 group-hover:scale-110`
                )}>
                    <Icon className={cn("w-5 h-5", level === 0 ? `text-${node.color}-400` : "text-[var(--nea-text-secondary)]")} />
                </div>
                <div className="flex-1 text-left">
                    <h3 className={cn(
                        "font-bold",
                        level === 0 ? "text-lg text-[var(--nea-text-title)]" : "text-sm text-[var(--nea-text-primary)]"
                    )}>
                        {node.title}
                    </h3>
                    {node.description && level === 0 && (
                        <p className="text-xs text-[var(--nea-text-secondary)] mt-0.5">{node.description}</p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {(filteredItems.length > 0 || filteredChildren.length > 0) && (
                        <Badge className="bg-[var(--nea-primary-blue)]/20 text-[var(--nea-primary-blue)] border-0 text-xs">
                            {filteredItems.length + filteredChildren.length}
                        </Badge>
                    )}
                    {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-[var(--nea-text-secondary)]" />
                    ) : (
                        <ChevronRight className="w-5 h-5 text-[var(--nea-text-secondary)]" />
                    )}
                </div>
            </button>

            {/* Children */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className={cn("mt-2 space-y-1", level > 0 && "ml-4 border-l-2 border-[var(--nea-border-subtle)] pl-4")}>
                            {/* Direct items */}
                            {filteredItems.map((item, idx) => {
                                const ItemIcon = item.icon;
                                return (
                                    <Link key={idx} to={createPageUrl(item.url)}>
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.02 }}
                                            className="flex items-center gap-3 p-3 rounded-lg border border-[var(--nea-border-subtle)] hover:border-[var(--nea-primary-blue)] hover:bg-[var(--nea-bg-surface-hover)] transition-all group cursor-pointer"
                                        >
                                            <ItemIcon className="w-4 h-4 text-[var(--nea-text-secondary)] group-hover:text-[var(--nea-primary-blue)] transition-colors" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-[var(--nea-text-primary)] group-hover:text-[var(--nea-primary-blue)] transition-colors truncate">
                                                    {item.name}
                                                </p>
                                                {item.description && (
                                                    <p className="text-xs text-[var(--nea-text-secondary)] truncate">
                                                        {item.description}
                                                    </p>
                                                )}
                                                {item.role && (
                                                    <Badge className="mt-1 bg-blue-500/20 text-blue-400 border-0 text-xs">
                                                        {item.role}
                                                    </Badge>
                                                )}
                                            </div>
                                        </motion.div>
                                    </Link>
                                );
                            })}

                            {/* Nested children */}
                            {filteredChildren.map(([key, child]) => (
                                <TreeNode key={key} node={child} level={level + 1} searchTerm={searchTerm} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function SystemTableOfContents() {
    const [searchTerm, setSearchTerm] = useState('');
    const { containerVariants, itemVariants } = useStaggerAnimation();

    const totalPages = Object.values(SYSTEM_TREE).reduce((sum, section) => {
        let count = section.items?.length || 0;
        if (section.children) {
            Object.values(section.children).forEach(child => {
                count += child.items?.length || 0;
            });
        }
        return sum + count;
    }, 0);

    return (
        <motion.div
            className="space-y-6 pb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Table des Matières", href: "SystemTableOfContents" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<BookOpen className="w-8 h-8 text-purple-400" />}
                    title="Table des Matières & Arborescence"
                    subtitle={`Navigation complète du système NEA-AZEX - ${totalPages} pages disponibles`}
                />
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
                <NeaCard className="p-4 bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/30">
                    <div className="flex items-center gap-3 mb-2">
                        <BarChart className="w-5 h-5 text-blue-400" />
                        <p className="text-sm text-[var(--nea-text-secondary)]">Sections</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">{Object.keys(SYSTEM_TREE).length}</p>
                </NeaCard>

                <NeaCard className="p-4 bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/30">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-purple-400" />
                        <p className="text-sm text-[var(--nea-text-secondary)]">Pages Total</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-400">{totalPages}</p>
                </NeaCard>

                <NeaCard className="p-4 bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/30">
                    <div className="flex items-center gap-3 mb-2">
                        <Globe className="w-5 h-5 text-green-400" />
                        <p className="text-sm text-[var(--nea-text-secondary)]">Centres Pro</p>
                    </div>
                    <p className="text-3xl font-bold text-green-400">25</p>
                </NeaCard>

                <NeaCard className="p-4 bg-gradient-to-br from-red-500/5 to-red-500/10 border-red-500/30">
                    <div className="flex items-center gap-3 mb-2">
                        <Layers className="w-5 h-5 text-red-400" />
                        <p className="text-sm text-[var(--nea-text-secondary)]">Protocoles</p>
                    </div>
                    <p className="text-3xl font-bold text-red-400">4</p>
                </NeaCard>
            </motion.div>

            {/* Search */}
            <motion.div variants={itemVariants}>
                <NeaCard className="p-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--nea-text-secondary)]" />
                        <Input
                            placeholder="Rechercher dans l'arborescence..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </NeaCard>
            </motion.div>

            {/* Tree Structure */}
            <motion.div variants={itemVariants} className="space-y-4">
                {Object.entries(SYSTEM_TREE).map(([key, section]) => (
                    <TreeNode key={key} node={section} level={0} searchTerm={searchTerm} />
                ))}
            </motion.div>

            {/* Footer Info */}
            <motion.div variants={itemVariants}>
                <NeaCard className="p-6 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border-cyan-500/20">
                    <div className="flex items-start gap-3">
                        <BookOpen className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-[var(--nea-text-title)] mb-2">
                                Navigation Interactive
                            </h3>
                            <p className="text-sm text-[var(--nea-text-secondary)] leading-relaxed">
                                Cette table des matières présente l'architecture complète du système NEA-AZEX. 
                                Cliquez sur les sections pour les développer et accéder directement aux pages. 
                                Utilisez la recherche pour filtrer rapidement les contenus.
                            </p>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>
        </motion.div>
    );
}