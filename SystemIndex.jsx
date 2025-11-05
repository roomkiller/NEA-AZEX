
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
    Search, Book, Shield, Target, Activity, Globe, DollarSign, Cloud, ShieldAlert,
    Wrench, Cpu, Crown, Grid3x3, Settings, Database, FileText, BarChart, Hexagon,
    GitMerge, BrainCircuit, Bot, Ghost, Zap, Flame, Container, AlertTriangle,
    TrendingUp, Eye, Users, Award, CreditCard, Mail, Lock, History, HeartPulse,
    Anchor, Rocket, Package, Building, Wheat, Radio, Newspaper, Scale, Leaf,
    GraduationCap, Plane, Droplet, MapPin
} from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useStaggerAnimation } from '../components/navigation/PageTransition';
import { cn } from '@/lib/utils';

const SYSTEM_STRUCTURE = {
    dashboards: {
        title: "Tableaux de Bord",
        icon: BarChart,
        color: "blue",
        pages: [
            { name: "Dashboard Principal", url: "Dashboard", icon: BarChart, role: "user" },
            { name: "Utilisateur", url: "UserDashboard", icon: Target, role: "user" },
            { name: "Technicien", url: "TechnicianDashboard", icon: Wrench, role: "technician" },
            { name: "Développeur", url: "DeveloperDashboard", icon: Cpu, role: "developer" },
            { name: "Administrateur", url: "AdminDashboard", icon: Shield, role: "admin" },
            { name: "Master", url: "MasterDashboard", icon: Crown, role: "master" }
        ]
    },
    professional: {
        title: "Centres Professionnels",
        icon: Globe,
        color: "purple",
        pages: [
            { name: "Intelligence Militaire", url: "MilitaryIntelligence", icon: Shield, role: "user" },
            { name: "Santé Publique", url: "PublicHealthMonitor", icon: Activity, role: "user" },
            { name: "Investigation", url: "InvestigativeJournalism", icon: FileText, role: "user" },
            { name: "Diplomatie", url: "DiplomaticIntelligence", icon: Globe, role: "user" },
            { name: "Finance", url: "FinancialIntelligence", icon: DollarSign, role: "user" },
            { name: "Météorologie", url: "ClimateWeatherCenter", icon: Cloud, role: "user" },
            { name: "Forces de l'Ordre", url: "LawEnforcementCenter", icon: ShieldAlert, role: "user" },
            { name: "Centre Énergétique", url: "EnergyCenter", icon: Zap, role: "user" },
            { name: "Intelligence Maritime", url: "MaritimeIntelligence", icon: Anchor, role: "user" },
            { name: "Centre Spatial", url: "SpaceCenter", icon: Rocket, role: "user" },
            { name: "Supply Chain Intelligence", url: "SupplyChainIntelligence", icon: Package, role: "user" },
            { name: "Intelligence Corporative", url: "CorporateIntelligence", icon: Building, role: "user" },
            { name: "Infrastructure Critique", url: "CriticalInfrastructure", icon: Database, role: "user" },
            { name: "Sécurité Agricole", url: "AgricultureSecurityCenter", icon: Wheat, role: "user" },
            { name: "Télécommunications", url: "TelecommunicationsCenter", icon: Radio, role: "user" },
            { name: "Commerce International", url: "TradeIntelligence", icon: DollarSign, role: "user" },
            { name: "Migration & Frontières", url: "MigrationBorderSecurity", icon: Users, role: "user" },
            { name: "Tech & Innovation", url: "TechnologyInnovationCenter", icon: Cpu, role: "user" },
            { name: "Médias & Influence", url: "MediaInfluenceCenter", icon: Newspaper, role: "user" },
            { name: "Intelligence Juridique", url: "LegalIntelligence", icon: Scale, role: "user" },
            { name: "Intelligence Environnementale", url: "EnvironmentalIntelligence", icon: Leaf, role: "user" },
            { name: "Éducation & Recherche", url: "EducationResearchCenter", icon: GraduationCap, role: "user" },
            { name: "Transport & Mobilité", url: "TransportMobilityCenter", icon: Plane, role: "user" },
            { name: "Ressources Hydriques", url: "WaterResourcesCenter", icon: Droplet, role: "user" },
            { name: "Tourisme & Hôtellerie", url: "TourismHospitalityCenter", icon: MapPin, role: "user" }
        ]
    },
    intelligence: {
        title: "Intelligence & Analyse",
        icon: BrainCircuit,
        color: "cyan",
        pages: [
            { name: "System Nexus", url: "SystemNexus", icon: Hexagon, role: "user" },
            { name: "Prédictions d'Événements", url: "EventPredictions", icon: TrendingUp, role: "user" },
            { name: "Moteur de Prédiction", url: "PredictionEngine", icon: Activity, role: "developer" },
            { name: "Signaux Faibles", url: "WeakSignals", icon: Eye, role: "user" },
            { name: "Analyse des Tendances", url: "TrendAnalysis", icon: BarChart, role: "user" },
            { name: "Analyse Système", url: "SystemAnalysis", icon: Activity, role: "technician" },
            { name: "Analyse Globale", url: "GlobalAnalysisEngine", icon: BrainCircuit, role: "developer" },
            { name: "Analyse Approfondie", url: "DeepModuleAnalysis", icon: Activity, role: "developer" },
            { name: "Analyse Ultra-Profonde", url: "UltraDeepAnalysis", icon: Activity, role: "developer" },
            { name: "Accélérateur d'Analyse", url: "AnalysisAccelerator", icon: Zap, role: "admin" },
            { name: "Moteur de Corrélation", url: "CorrelationEngine", icon: GitMerge, role: "developer" }
        ]
    },
    protocols: {
        title: "Protocoles Avancés",
        icon: Shield,
        color: "red",
        pages: [
            { name: "Protocole Chimère", url: "ChimeraProtocol", icon: Ghost, role: "admin" },
            { name: "Protocole Janus", url: "JanusProtocol", icon: Zap, role: "admin" },
            { name: "Protocole Léviathan", url: "LeviathanProtocol", icon: Container, role: "admin" },
            { name: "Protocole Prométhée", url: "PrometheusProtocol", icon: Flame, role: "admin" }
        ]
    },
    security: {
        title: "Sécurité & Audit",
        icon: ShieldAlert,
        color: "orange",
        pages: [
            { name: "Hub Sécurité", url: "Security", icon: Shield, role: "technician" },
            { name: "Gestion de Crise", url: "CrisisManager", icon: AlertTriangle, role: "technician" },
            { name: "Audit Système", url: "SystemAudit", icon: FileText, role: "admin" },
            { name: "Anti-Piratage", url: "AntiPiracy", icon: Lock, role: "admin" },
            { name: "Protocole Audit d'Urgence", url: "EmergencyAuditProtocol", icon: AlertTriangle, role: "admin" }
        ]
    },
    system: {
        title: "Gestion Système",
        icon: Settings,
        color: "gray",
        pages: [
            { name: "Statut Système", url: "SystemStatus", icon: HeartPulse, role: "technician" },
            { name: "Modules", url: "Modules", icon: Grid3x3, role: "technician" },
            { name: "Configuration", url: "Configuration", icon: Settings, role: "admin" },
            { name: "Gestionnaire Réseau", url: "NetworkManager", icon: Activity, role: "admin" },
            { name: "Gestionnaire Sauvegardes", url: "BackupManager", icon: Database, role: "admin" },
            { name: "Gestion MAJ", url: "UpdateManagement", icon: Activity, role: "admin" },
            { name: "Tableau MAJ", url: "UpdateDashboard", icon: Activity, role: "admin" },
            { name: "Affichage Tactique", url: "TacticalDisplay", icon: Target, role: "technician" }
        ]
    },
    automation: {
        title: "Automatisation",
        icon: Bot,
        color: "green",
        pages: [
            { name: "Générateur de Scénarios", url: "ScenarioGenerator", icon: BrainCircuit, role: "developer" },
            { name: "Gestionnaire de Macros", url: "BotMacroManager", icon: Bot, role: "developer" },
            { name: "Moteur d'Exécution", url: "BotMacroExecutionEngine", icon: Shield, role: "developer" },
            { name: "Prédiction en Cascade", url: "CascadePredictionSystem", icon: GitMerge, role: "developer" },
            { name: "Autonomisation Modules", url: "ModuleAutonomization", icon: Cpu, role: "developer" }
        ]
    },
    configuration: {
        title: "Configuration Avancée",
        icon: Database,
        color: "indigo",
        pages: [
            { name: "Sources de Données", url: "DataSourceConfiguration", icon: Database, role: "admin" },
            { name: "Attribution OSINT", url: "OSINTSourceAssignment", icon: Activity, role: "admin" },
            { name: "Activation Chiffrement", url: "EncryptionActivation", icon: Lock, role: "admin" },
            { name: "Initialisation Système", url: "SystemInitialization", icon: Activity, role: "admin" },
            { name: "Config Sources Complète", url: "ConfigurationSourcesComplete", icon: Database, role: "admin" }
        ]
    },
    administration: {
        title: "Administration",
        icon: Users,
        color: "yellow",
        pages: [
            { name: "Gestion Utilisateurs", url: "UserManagement", icon: Users, role: "admin" },
            { name: "Gestion Commerciale", url: "SubscriptionManagement", icon: DollarSign, role: "admin" },
            { name: "Mon Abonnement", url: "MySubscription", icon: Award, role: "user" },
            { name: "Configuration Stripe", url: "StripeSetup", icon: CreditCard, role: "admin" },
            { name: "Gestion Emails", url: "EmailManagement", icon: Mail, role: "admin" },
            { name: "Accréditations", url: "AccreditationManagement", icon: Shield, role: "admin" },
            { name: "Journal d'Activité", url: "UserActivityLog", icon: History, role: "admin" }
        ]
    },
    documentation: {
        title: "Documentation",
        icon: FileText,
        color: "pink",
        pages: [
            { name: "Documentation Système", url: "Documentation", icon: FileText, role: "user" },
            { name: "Documentation Protocoles", url: "ProtocolDocumentation", icon: FileText, role: "technician" }
        ]
    },
    valuation: {
        title: "Valorisation",
        icon: DollarSign,
        color: "emerald",
        pages: [
            { name: "Valorisation Système", url: "SystemValuation", icon: DollarSign, role: "admin" },
            { name: "Valorisation Actifs", url: "SoftwareAssetValuation", icon: DollarSign, role: "admin" },
            { name: "Valorisation Compétitive", url: "CompetitiveValuation", icon: BarChart, role: "admin" },
            { name: "Post-Déploiement", url: "PostDeployment", icon: Activity, role: "admin" }
        ]
    },
    public: {
        title: "Pages Publiques",
        icon: Globe,
        color: "slate",
        pages: [
            { name: "Accueil", url: "Home", icon: Globe, role: "public" },
            { name: "Tarifs", url: "Pricing", icon: DollarSign, role: "public" },
            { name: "Mentions Légales", url: "LegalNotice", icon: FileText, role: "public" }
        ]
    }
};

export default function SystemIndex() {
    const [searchTerm, setSearchTerm] = useState('');
    const { containerVariants, itemVariants } = useStaggerAnimation();

    const filteredStructure = useMemo(() => {
        if (!searchTerm) return SYSTEM_STRUCTURE;
        
        const filtered = {};
        Object.entries(SYSTEM_STRUCTURE).forEach(([key, section]) => {
            const matchingPages = section.pages.filter(page =>
                page.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (matchingPages.length > 0) {
                filtered[key] = { ...section, pages: matchingPages };
            }
        });
        return filtered;
    }, [searchTerm]);

    const totalPages = useMemo(() => 
        Object.values(SYSTEM_STRUCTURE).reduce((sum, section) => sum + section.pages.length, 0)
    , []);

    const roleColors = {
        public: "bg-gray-500/20 text-gray-400",
        user: "bg-blue-500/20 text-blue-400",
        technician: "bg-cyan-500/20 text-cyan-400",
        developer: "bg-purple-500/20 text-purple-400",
        admin: "bg-red-500/20 text-red-400",
        master: "bg-yellow-500/20 text-yellow-400"
    };

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Index Système", href: "SystemIndex" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Book className="w-8 h-8 text-purple-400" />}
                    title="Index Système NEA-AZEX"
                    subtitle={`Architecture complète - ${totalPages} pages disponibles`}
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard className="p-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--nea-text-secondary)]" />
                        <Input
                            placeholder="Rechercher une page..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </NeaCard>
            </motion.div>

            {Object.entries(filteredStructure).map(([sectionKey, section], sectionIndex) => {
                const SectionIcon = section.icon;
                return (
                    <motion.div key={sectionKey} variants={itemVariants}>
                        <NeaCard>
                            <div className={`p-4 border-b border-[var(--nea-border-default)] bg-${section.color}-500/5`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 bg-${section.color}-500/10 rounded-lg`}>
                                        <SectionIcon className={`w-6 h-6 text-${section.color}-400`} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[var(--nea-text-title)]">
                                            {section.title}
                                        </h3>
                                        <p className="text-xs text-[var(--nea-text-secondary)]">
                                            {section.pages.length} page{section.pages.length > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {section.pages.map((page, pageIndex) => {
                                        const PageIcon = page.icon;
                                        return (
                                            <motion.div
                                                key={page.url}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: pageIndex * 0.02 }}
                                            >
                                                <Link to={createPageUrl(page.url)}>
                                                    <div className="p-4 rounded-lg border border-[var(--nea-border-default)] hover:border-[var(--nea-primary-blue)] hover:bg-[var(--nea-bg-surface-hover)] transition-all cursor-pointer group">
                                                        <div className="flex items-start gap-3">
                                                            <PageIcon className="w-5 h-5 text-[var(--nea-text-secondary)] group-hover:text-[var(--nea-primary-blue)] transition-colors mt-0.5" />
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-sm font-semibold text-[var(--nea-text-title)] group-hover:text-[var(--nea-primary-blue)] transition-colors truncate">
                                                                    {page.name}
                                                                </h4>
                                                                <Badge className={`${roleColors[page.role]} border-0 text-xs mt-1`}>
                                                                    {page.role === 'public' ? 'Public' : page.role}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </NeaCard>
                    </motion.div>
                );
            })}

            {Object.keys(filteredStructure).length === 0 && (
                <motion.div variants={itemVariants}>
                    <NeaCard className="p-12 text-center">
                        <Search className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-[var(--nea-text-title)] mb-2">
                            Aucun résultat
                        </h3>
                        <p className="text-[var(--nea-text-secondary)]">
                            Aucune page ne correspond à votre recherche
                        </p>
                    </NeaCard>
                </motion.div>
            )}
        </motion.div>
    );
}
