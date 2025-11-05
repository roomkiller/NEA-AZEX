
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Crown } from 'lucide-react';
import {
  Shield, Target, Activity, Settings, Database, Grid3x3, DollarSign, BarChart, FileText,
  Hexagon, GitMerge, ShieldAlert, BrainCircuit, Bot, ShieldCheck, History, Ghost, Zap,
  Flame, Container, Layers, AlertTriangle, HeartPulse, Cpu, User as UserIcon, Globe, Cloud,
  Anchor, Rocket, Package, Building, Wheat, Radio, Users, Newspaper, Scale, Leaf,
  GraduationCap, Plane, Droplet, MapPin
} from 'lucide-react';

const MASTER_NAVIGATION = {
  main: [
    { title: "Nexus Master", url: "MasterDashboard", icon: Crown, description: "Centre de contrôle absolu" },
    { title: "System Nexus", url: "SystemNexus", icon: Hexagon, description: "Intelligence artificielle" },
    { title: "Index Système", url: "SystemIndex", icon: Grid3x3, description: "Architecture complète" },
  ],
  sections: [
    {
      id: 'professional',
      title: 'Centres Professionnels',
      icon: Target,
      color: 'text-cyan-400',
      items: [
        { title: "Intelligence Militaire", url: "MilitaryIntelligence", icon: Shield, description: "Renseignement stratégique" },
        { title: "Surveillance Santé Publique", url: "PublicHealthMonitor", icon: Activity, description: "Monitoring épidémiologique" },
        { title: "Investigation Journalistique", url: "InvestigativeJournalism", icon: FileText, description: "Pistes d'enquête OSINT" },
        { title: "Intelligence Diplomatique", url: "DiplomaticIntelligence", icon: Globe, description: "Médiation de crises" },
        { title: "Intelligence Financière", url: "FinancialIntelligence", icon: DollarSign, description: "Analyse de risques" },
        { title: "Centre Climatique", url: "ClimateWeatherCenter", icon: Cloud, description: "Météo extrême" },
        { title: "Forces de l'Ordre", url: "LawEnforcementCenter", icon: ShieldAlert, description: "Cybercriminalité" },
        { title: "Centre Énergétique", url: "EnergyCenter", icon: Zap, description: "Pétrole, gaz, électricité" },
        { title: "Intelligence Maritime", url: "MaritimeIntelligence", icon: Anchor, description: "Routes commerciales & piraterie" },
        { title: "Centre Spatial", url: "SpaceCenter", icon: Rocket, description: "Satellites & débris spatiaux" },
        { title: "Supply Chain Intelligence", url: "SupplyChainIntelligence", icon: Package, description: "Logistique mondiale" },
        { title: "Intelligence Corporative", url: "CorporateIntelligence", icon: Building, description: "Espionnage industriel" },
        { title: "Infrastructure Critique", url: "CriticalInfrastructure", icon: Database, description: "Infrastructures essentielles" },
        { title: "Sécurité Agricole", url: "AgricultureSecurityCenter", icon: Wheat, description: "Sécurité alimentaire" },
        { title: "Télécommunications", url: "TelecommunicationsCenter", icon: Radio, description: "Réseaux 5G & câbles" },
        { title: "Commerce International", url: "TradeIntelligence", icon: DollarSign, description: "Sanctions & guerres commerciales" },
        { title: "Migration & Frontières", url: "MigrationBorderSecurity", icon: Users, description: "Flux migratoires" },
        { title: "Tech & Innovation", url: "TechnologyInnovationCenter", icon: Cpu, description: "IA & disruptions" },
        { title: "Médias & Influence", url: "MediaInfluenceCenter", icon: Newspaper, description: "Désinformation & influence" },
        { title: "Intelligence Juridique", url: "LegalIntelligence", icon: Scale, description: "Réglementation & conformité" },
        { title: "Intelligence Environnementale", url: "EnvironmentalIntelligence", icon: Leaf, description: "Biodiversité & pollution" },
        { title: "Éducation & Recherche", url: "EducationResearchCenter", icon: GraduationCap, description: "Système éducatif" },
        { title: "Transport & Mobilité", url: "TransportMobilityCenter", icon: Plane, description: "Aviation, ferroviaire, routier" },
        { title: "Ressources Hydriques", url: "WaterResourcesCenter", icon: Droplet, description: "Gestion de l'eau" },
        { title: "Tourisme & Hôtellerie", url: "TourismHospitalityCenter", icon: MapPin, description: "Industrie touristique" }
      ]
    },
    {
      id: 'protocols',
      title: 'Protocoles Avancés',
      icon: Layers,
      color: 'text-purple-400',
      items: [
        { title: "Chimère", url: "ChimeraProtocol", icon: Ghost, description: "Système de leurre offensif" },
        { title: "Janus", url: "JanusProtocol", icon: Zap, description: "Entraînement adversarial" },
        { title: "Léviathan", url: "LeviathanProtocol", icon: Container, description: "Dispersion fractale" },
        { title: "Prométhée", url: "PrometheusProtocol", icon: Flame, description: "Frappe préventive" },
      ]
    },
    {
      id: 'analysis',
      title: 'Analyse & Prédictions',
      icon: BrainCircuit,
      color: 'text-blue-400',
      items: [
        { title: "Prédictions d'Événements", url: "EventPredictions", icon: BrainCircuit },
        { title: "Moteur de Prédiction", url: "PredictionEngine", icon: Activity },
        { title: "Signaux Faibles", url: "WeakSignals", icon: Activity },
        { title: "Analyse des Tendances", url: "TrendAnalysis", icon: BarChart },
        { title: "Analyse Globale", url: "SystemAnalysis", icon: Activity },
        { title: "Moteur d'Analyse Globale", url: "GlobalAnalysisEngine", icon: BrainCircuit },
        { title: "Analyse Approfondie", url: "DeepModuleAnalysis", icon: Activity },
        { title: "Analyse Ultra-Profonde", url: "UltraDeepAnalysis", icon: Activity },
        { title: "Accélérateur d'Analyse", url: "AnalysisAccelerator", icon: Zap },
        { title: "Moteur de Corrélation", url: "CorrelationEngine", icon: GitMerge },
      ]
    },
    {
      id: 'security',
      title: 'Sécurité & Audit',
      icon: ShieldAlert,
      color: 'text-red-400',
      items: [
        { title: "Hub Sécurité", url: "Security", icon: BarChart },
        { title: "Gestion de Crise", url: "CrisisManager", icon: ShieldAlert },
        { title: "Audit Système", url: "SystemAudit", icon: ShieldCheck },
        { title: "Anti-Piratage", url: "AntiPiracy", icon: Shield },
        { title: "Protocole Audit d'Urgence", url: "EmergencyAuditProtocol", icon: AlertTriangle },
      ]
    },
    {
      id: 'system',
      title: 'Gestion Système',
      icon: Settings,
      color: 'text-cyan-400',
      items: [
        { title: "Affichage Tactique", url: "TacticalDisplay", icon: Target },
        { title: "Statut Système", url: "SystemStatus", icon: HeartPulse },
        { title: "Modules", url: "Modules", icon: Grid3x3 },
        { title: "Configuration", url: "Configuration", icon: Settings },
        { title: "Gestionnaire Réseau", url: "NetworkManager", icon: Activity },
        { title: "Gestionnaire Sauvegardes", url: "BackupManager", icon: Database },
        { title: "Gestion des Mises à Jour", url: "UpdateManagement", icon: Activity },
        { title: "Tableau MAJ", url: "UpdateDashboard", icon: Activity },
      ]
    },
    {
      id: 'config',
      title: 'Configuration Avancée',
      icon: Settings,
      color: 'text-orange-400',
      items: [
        { title: "Sources de Données", url: "DataSourceConfiguration", icon: Database },
        { title: "Attribution OSINT", url: "OSINTSourceAssignment", icon: Activity },
        { title: "Activation Chiffrement", url: "EncryptionActivation", icon: Shield },
        { title: "Initialisation Système", url: "SystemInitialization", icon: Activity },
        { title: "Config Sources Complète", url: "ConfigurationSourcesComplete", icon: Database },
      ]
    },
    {
      id: 'automation',
      title: 'Automatisation',
      icon: Bot,
      color: 'text-green-400',
      items: [
        { title: "Générateur de Scénarios", url: "ScenarioGenerator", icon: BrainCircuit },
        { title: "Gestionnaire de Macros", url: "BotMacroManager", icon: Bot },
        { title: "Moteur d'exécution", url: "BotMacroExecutionEngine", icon: ShieldCheck },
        { title: "Prédiction en Cascade", url: "CascadePredictionSystem", icon: GitMerge },
        { title: "Autonomisation Modules", url: "ModuleAutonomization", icon: Cpu },
      ]
    },
    {
      id: 'docs',
      title: 'Documentation',
      icon: FileText,
      color: 'text-indigo-400',
      items: [
        { title: "Documentation", url: "Documentation", icon: FileText },
        { title: "Documentation Protocoles", url: "ProtocolDocumentation", icon: FileText },
      ]
    },
    {
      id: 'valuation',
      title: 'Valorisation & Commercial',
      icon: DollarSign,
      color: 'text-yellow-400',
      items: [
        { title: "Valorisation Système", url: "SystemValuation", icon: DollarSign },
        { title: "Valorisation Actifs", url: "SoftwareAssetValuation", icon: DollarSign },
        { title: "Valorisation Compétitive", url: "CompetitiveValuation", icon: BarChart },
        { title: "Post-Déploiement", url: "PostDeployment", icon: Activity },
      ]
    },
    {
      id: 'dashboards',
      title: 'Dashboards Spécialisés',
      icon: BarChart,
      color: 'text-pink-400',
      items: [
        { title: "Dashboard Découverte", url: "DiscoveryDashboard", icon: Target },
        { title: "Dashboard Solo", url: "SoloDashboard", icon: UserIcon },
        { title: "Dashboard Équipe", url: "TeamDashboard", icon: UserIcon },
        { title: "Dashboard Enterprise", url: "EnterpriseDashboard", icon: Shield },
      ]
    },
    {
      id: 'admin',
      title: 'Administration',
      icon: UserIcon,
      color: 'text-gray-400',
      items: [
        { title: "Gestion Commerciale", url: "SubscriptionManagement", icon: DollarSign },
        { title: "Configuration Stripe", url: "StripeSetup", icon: DollarSign },
        { title: "Gestion des Emails", url: "EmailManagement", icon: FileText },
        { title: "Utilisateurs", url: "UserManagement", icon: UserIcon },
        { title: "Accréditations", url: "AccreditationManagement", icon: ShieldCheck },
        { title: "Journal d'Activité", url: "UserActivityLog", icon: History },
      ]
    },
  ]
};

const MasterNavItem = ({ item, isActive, onClick }) => (
  <Link to={createPageUrl(item.url)} onClick={onClick}>
    <motion.div
      whileHover={{ x: 4 }}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? 'bg-yellow-500/20 text-yellow-400 border-l-4 border-yellow-400'
          : 'text-[var(--nea-text-secondary)] hover:bg-[var(--nea-bg-surface-hover)] hover:text-[var(--nea-text-primary)] border-l-4 border-transparent'
      }`}
    >
      <item.icon className={`w-4 h-4 ${isActive ? 'text-yellow-400' : ''}`} />
      <div className="flex-1">
        <div className={isActive ? 'font-bold' : ''}>{item.title}</div>
        {item.description && (
          <div className="text-xs text-[var(--nea-text-muted)] mt-0.5">{item.description}</div>
        )}
      </div>
    </motion.div>
  </Link>
);

const MasterNavSection = ({ section, location, closeSidebar }) => {
  const isAnyActive = section.items.some(item => location.pathname === createPageUrl(item.url));
  const [isOpen, setIsOpen] = useState(isAnyActive);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
          isAnyActive ? 'text-yellow-400' : 'text-[var(--nea-text-primary)]'
        } hover:bg-[var(--nea-bg-surface-hover)]`}
      >
        <div className="flex items-center gap-3">
          <section.icon className={`w-5 h-5 ${section.color}`} />
          <span>{section.title}</span>
          <span className="text-xs text-[var(--nea-text-muted)]">({section.items.length})</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 space-y-1 overflow-hidden"
          >
            {section.items.map(item => {
              const isActive = location.pathname === createPageUrl(item.url);
              return (
                <MasterNavItem
                  key={item.url}
                  item={item}
                  isActive={isActive}
                  onClick={closeSidebar}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function MasterNavigation({ closeSidebar = () => {} }) {
  const location = useLocation();

  return (
    <nav className="flex-1 overflow-y-auto styled-scrollbar pr-2">
      {/* Pages principales */}
      <div className="mb-6">
        <div className="flex items-center gap-2 px-3 py-2 mb-3">
          <Crown className="w-5 h-5 text-yellow-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-400">Accès Principal</h3>
        </div>
        <div className="space-y-1">
          {MASTER_NAVIGATION.main.map(item => {
            const isActive = location.pathname === createPageUrl(item.url);
            return (
              <MasterNavItem
                key={item.url}
                item={item}
                isActive={isActive}
                onClick={closeSidebar}
              />
            );
          })}
        </div>
      </div>

      {/* Séparateur */}
      <div className="border-t border-[var(--nea-border-default)] my-4"></div>

      {/* Sections */}
      <div>
        <div className="flex items-center gap-2 px-3 py-2 mb-3">
          <Layers className="w-5 h-5 text-yellow-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-400">Modules Système</h3>
        </div>
        {MASTER_NAVIGATION.sections.map(section => (
          <MasterNavSection
            key={section.id}
            section={section}
            location={location}
            closeSidebar={closeSidebar}
          />
        ))}
      </div>

      {/* Footer stats */}
      <div className="mt-6 mb-4 px-3 py-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-bold text-yellow-400">Mode Master Actif</span>
        </div>
        <div className="text-xs text-[var(--nea-text-muted)] space-y-1">
          <div className="flex justify-between">
            <span>Pages totales :</span>
            <span className="font-semibold text-[var(--nea-text-primary)]">
              {MASTER_NAVIGATION.main.length + MASTER_NAVIGATION.sections.reduce((acc, s) => acc + s.items.length, 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Sections :</span>
            <span className="font-semibold text-[var(--nea-text-primary)]">
              {MASTER_NAVIGATION.sections.length}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
