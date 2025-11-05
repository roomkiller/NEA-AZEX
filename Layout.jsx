

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import {
  Shield, Target, Wrench, Cpu, User as UserIcon, LogOut, Home, LogIn, ChevronDown, Settings, Database, Grid3x3, DollarSign, BarChart, FileText, Activity, Hexagon, GitMerge, ShieldAlert, BrainCircuit, Menu, Loader2, Bot, ShieldCheck, History, Award, Ghost, Zap, Flame, Container, Layers, AlertTriangle, HeartPulse, Crown, Globe, Cloud, Anchor, Rocket, Package, Building, Wheat, Radio, Users, Newspaper, Scale, Leaf, GraduationCap, Plane, Droplet, MapPin, Palette, ChevronRight, Search, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import GlobalUpdateProvider, { useUpdates } from "./components/updates/GlobalUpdateProvider";
import SystemStatusFace from "./components/ui/SystemStatusFace";
import MasterNavigation from "./components/navigation/MasterNavigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { base44 as telemetryBase44 } from "@/api/base44Client";
import SkipToContent from "./components/ui/SkipToContent";
import KeyboardShortcuts from "./components/navigation/KeyboardShortcuts";
import ErrorBoundary from './components/errors/ErrorBoundary';
import DebugPanel from './components/debug/DebugPanel';
import QuickRoleSwitcher from './components/navigation/QuickRoleSwitcher';
import { RoleGuard } from "./components/auth/RoleGuard";
import OptimizationProvider from "./components/performance/OptimizationProvider";

const ROLE_CONFIG = {
  user: { icon: UserIcon, title: "Utilisateur", textColor: "text-blue-400" },
  technician: { icon: Wrench, title: "Technicien", textColor: "text-cyan-400" },
  developer: { icon: Cpu, title: "Développeur", textColor: "text-purple-400" },
  admin: { icon: Shield, title: "Administrateur", textColor: "text-red-400" },
  master: { icon: Crown, title: "Master", textColor: "text-yellow-400" }
};

// Admin peut accéder à Master (niveaux équivalents pour l'administrateur souverain)
const ROLE_HIERARCHY = { user: 1, technician: 2, developer: 3, admin: 5, master: 5 };

// Pages publiques - Les centres professionnels nécessitent maintenant une authentification
const publicPages = ["Home", "Pricing", "LegalNotice"];

const NAVIGATION_ITEMS = {
  user: [
    { type: 'link', title: "Poste de Veille", url: "UserDashboard", icon: Target },
    { type: 'link', title: "System Nexus", url: "SystemNexus", icon: Hexagon },
    { type: 'link', title: "Index Système", url: "SystemIndex", icon: Grid3x3 },
    { type: 'link', title: "Recherche Globale", url: "GlobalSearch", icon: Search },
    { type: 'link', title: "Notifications", url: "NotificationCenter", icon: Bell },
    { type: 'link', title: "Mes Favoris", url: "MyFavorites", icon: Award },
    { type: 'link', title: "Collaboration", url: "CollaborationDashboard", icon: Users },
    { type: 'group', title: 'Intelligence Sectorielle', icon: Target,
      items: [
        { title: "Intelligence Militaire", url: "MilitaryIntelligence", icon: Shield },
        { title: "Santé Publique", url: "PublicHealthMonitor", icon: Activity },
        { title: "Investigation", url: "InvestigativeJournalism", icon: FileText },
        { title: "Diplomatie", url: "DiplomaticIntelligence", icon: Globe },
        { title: "Finance", url: "FinancialIntelligence", icon: DollarSign },
        { title: "Météorologie", url: "ClimateWeatherCenter", icon: Cloud },
        { title: "Forces de l'Ordre", url: "LawEnforcementCenter", icon: ShieldAlert },
        { title: "Énergie", url: "EnergyCenter", icon: Zap },
        { title: "Maritime", url: "MaritimeIntelligence", icon: Anchor },
        { title: "Spatial", url: "SpaceCenter", icon: Rocket },
        { title: "Supply Chain", url: "SupplyChainIntelligence", icon: Package },
        { title: "Corporatif", url: "CorporateIntelligence", icon: Building },
        { title: "Infrastructure", url: "CriticalInfrastructure", icon: Database },
        { title: "Agriculture", url: "AgricultureSecurityCenter", icon: Wheat },
        { title: "Télécom", url: "TelecommunicationsCenter", icon: Radio },
        { title: "Commerce", url: "TradeIntelligence", icon: DollarSign },
        { title: "Migration", url: "MigrationBorderSecurity", icon: Users },
        { title: "Tech & Innovation", url: "TechnologyInnovationCenter", icon: Cpu },
        { title: "Médias", url: "MediaInfluenceCenter", icon: Newspaper },
        { title: "Juridique", url: "LegalIntelligence", icon: Scale },
        { title: "Environnement", url: "EnvironmentalIntelligence", icon: Leaf },
        { title: "Éducation & Recherche", url: "EducationResearchCenter", icon: GraduationCap },
        { title: "Transport & Mobilité", url: "TransportMobilityCenter", icon: Plane },
        { title: "Ressources Hydriques", url: "WaterResourcesCenter", icon: Droplet },
        { title: "Tourisme & Hôtellerie", url: "TourismHospitalityCenter", icon: MapPin }
      ]
    },
  ],
  technician: [
    { type: 'link', title: "Centre de Contrôle", url: "TechnicianDashboard", icon: Wrench },
    { type: 'link', title: "System Nexus", url: "SystemNexus", icon: Hexagon },
    { type: 'link', title: "Index Système", url: "SystemIndex", icon: Grid3x3 },
    { type: 'link', title: "Recherche Globale", url: "GlobalSearch", icon: Search },
    { type: 'link', title: "Notifications", url: "NotificationCenter", icon: Bell },
    { type: 'link', title: "Mes Favoris", url: "MyFavorites", icon: Award },
    { type: 'link', title: "Collaboration", url: "CollaborationDashboard", icon: Users },
    { type: 'group', title: 'Intelligence Sectorielle', icon: Target,
      items: [
        { title: "Intelligence Militaire", url: "MilitaryIntelligence", icon: Shield },
        { title: "Santé Publique", url: "PublicHealthMonitor", icon: Activity },
        { title: "Investigation", url: "InvestigativeJournalism", icon: FileText },
        { title: "Diplomatie", url: "DiplomaticIntelligence", icon: Globe },
        { title: "Finance", url: "FinancialIntelligence", icon: DollarSign },
        { title: "Météorologie", url: "ClimateWeatherCenter", icon: Cloud },
        { title: "Forces de l'Ordre", url: "LawEnforcementCenter", icon: ShieldAlert },
        { title: "Énergie", url: "EnergyCenter", icon: Zap },
        { title: "Maritime", url: "MaritimeIntelligence", icon: Anchor },
        { title: "Spatial", url: "SpaceCenter", icon: Rocket },
        { title: "Supply Chain", url: "SupplyChainIntelligence", icon: Package },
        { title: "Corporatif", url: "CorporateIntelligence", icon: Building },
        { title: "Infrastructure", url: "CriticalInfrastructure", icon: Database },
        { title: "Agriculture", url: "AgricultureSecurityCenter", icon: Wheat },
        { title: "Télécom", url: "TelecommunicationsCenter", icon: Radio },
        { title: "Commerce", url: "TradeIntelligence", icon: DollarSign },
        { title: "Migration", url: "MigrationBorderSecurity", icon: Users },
        { title: "Tech & Innovation", url: "TechnologyInnovationCenter", icon: Cpu },
        { title: "Médias", url: "MediaInfluenceCenter", icon: Newspaper },
        { title: "Juridique", url: "LegalIntelligence", icon: Scale },
        { title: "Environnement", url: "EnvironmentalIntelligence", icon: Leaf },
        { title: "Éducation & Recherche", url: "EducationResearchCenter", icon: GraduationCap },
        { title: "Transport & Mobilité", url: "TransportMobilityCenter", icon: Plane },
        { title: "Ressources Hydriques", url: "WaterResourcesCenter", icon: Droplet },
        { title: "Tourisme & Hôtellerie", url: "TourismHospitalityCenter", icon: MapPin }
      ]
    },
    { type: 'group', title: 'Système', icon: Settings,
      items: [
        { title: "Statut Système", url: "SystemStatus", icon: HeartPulse },
        { title: "Modules", url: "Modules", icon: Grid3x3 },
        { title: "Récupération Modules", url: "ModuleRecoverySystem", icon: Package },
        { title: "Documentation", url: "Documentation", icon: FileText },
      ]
    },
  ],
  developer: [
    { type: 'link', title: "Atelier de Développement", url: "DeveloperDashboard", icon: Cpu },
    { type: 'link', title: "System Nexus", url: "SystemNexus", icon: Hexagon },
    { type: 'link', title: "Index Système", url: "SystemIndex", icon: Grid3x3 },
    { type: 'link', title: "Recherche Globale", url: "GlobalSearch", icon: Search },
    { type: 'link', title: "Notifications", url: "NotificationCenter", icon: Bell },
    { type: 'link', title: "Mes Favoris", url: "MyFavorites", icon: Award },
    { type: 'link', title: "Collaboration", url: "CollaborationDashboard", icon: Users },
    { type: 'group', title: 'Intelligence Sectorielle', icon: Target,
      items: [
        { title: "Intelligence Militaire", url: "MilitaryIntelligence", icon: Shield },
        { title: "Santé Publique", url: "PublicHealthMonitor", icon: Activity },
        { title: "Investigation", url: "InvestigativeJournalism", icon: FileText },
        { title: "Diplomatie", url: "DiplomaticIntelligence", icon: Globe },
        { title: "Finance", url: "FinancialIntelligence", icon: DollarSign },
        { title: "Météorologie", url: "ClimateWeatherCenter", icon: Cloud },
        { title: "Forces de l'Ordre", url: "LawEnforcementCenter", icon: ShieldAlert },
        { title: "Énergie", url: "EnergyCenter", icon: Zap },
        { title: "Maritime", url: "MaritimeIntelligence", icon: Anchor },
        { title: "Spatial", url: "SpaceCenter", icon: Rocket },
        { title: "Supply Chain", url: "SupplyChainIntelligence", icon: Package },
        { title: "Corporatif", url: "CorporateIntelligence", icon: Building },
        { title: "Infrastructure", url: "CriticalInfrastructure", icon: Database },
        { title: "Agriculture", url: "AgricultureSecurityCenter", icon: Wheat },
        { title: "Télécom", url: "TelecommunicationsCenter", icon: Radio },
        { title: "Commerce", url: "TradeIntelligence", icon: DollarSign },
        { title: "Migration", url: "MigrationBorderSecurity", icon: Users },
        { title: "Tech & Innovation", url: "TechnologyInnovationCenter", icon: Cpu },
        { title: "Médias", url: "MediaInfluenceCenter", icon: Newspaper },
        { title: "Juridique", url: "LegalIntelligence", icon: Scale },
        { title: "Environnement", url: "EnvironmentalIntelligence", icon: Leaf },
        { title: "Éducation & Recherche", url: "EducationResearchCenter", icon: GraduationCap },
        { title: "Transport & Mobilité", url: "TransportMobilityCenter", icon: Plane },
        { title: "Ressources Hydriques", url: "WaterResourcesCenter", icon: Droplet },
        { title: "Tourisme & Hôtellerie", url: "TourismHospitalityCenter", icon: MapPin }
      ]
    },
    { type: 'group', title: 'Analyse', icon: Activity,
      items: [
        { title: "Analyse Globale", url: "SystemAnalysis", icon: Activity },
        { title: "Moteur d'Analyse Globale", url: "GlobalAnalysisEngine", icon: BrainCircuit },
        { title: "Moteur de Corrélation", url: "CorrelationEngine", icon: GitMerge },
      ]
    },
    { type: 'group', title: 'Intelligence Artificielle', icon: BrainCircuit,
      items: [
        { title: "Centre de Contrôle IA", url: "AIControlCenter", icon: BrainCircuit },
        { title: "Générateur Scénarios IA", url: "AIScenarioBuilder", icon: Layers },
      ]
    },
    { type: 'group', title: 'Automatisation', icon: Bot,
      items: [
        { title: "Générateur de Scénarios", url: "ScenarioGenerator", icon: BrainCircuit },
        { title: "Gestionnaire de Macros", url: "BotMacroManager", icon: Bot },
        { title: "Moteur d'exécution", url: "BotMacroExecutionEngine", icon: ShieldCheck },
      ]
    },
     { type: 'group', title: 'Système', icon: Settings,
      items: [
        { title: "Statut Système", url: "SystemStatus", icon: HeartPulse },
        { title: "Modules", url: "Modules", icon: Grid3x3 },
        { title: "Récupération Modules", url: "ModuleRecoverySystem", icon: Package },
        { title: "Performance", url: "PerformanceMonitoring", icon: Zap },
        { title: "Guide Optimisation", url: "OptimizationGuide", icon: FileText },
        { title: "Documentation", url: "Documentation", icon: FileText },
      ]
    },
  ],
  admin: [
    { type: 'link', title: "Pont de Commandement", url: "AdminDashboard", icon: Shield },
    { type: 'link', title: "System Nexus", url: "SystemNexus", icon: Hexagon },
    { type: 'link', title: "Index Système", url: "SystemIndex", icon: Grid3x3 },
    { type: 'link', title: "Recherche Globale", url: "GlobalSearch", icon: Search },
    { type: 'link', title: "Notifications", url: "NotificationCenter", icon: Bell },
    { type: 'link', title: "Mes Favoris", url: "MyFavorites", icon: Award },
    { type: 'link', title: "Collaboration", url: "CollaborationDashboard", icon: Users },
    { type: 'group', title: 'Intelligence Sectorielle', icon: Target,
      items: [
        { title: "Intelligence Militaire", url: "MilitaryIntelligence", icon: Shield },
        { title: "Santé Publique", url: "PublicHealthMonitor", icon: Activity },
        { title: "Investigation", url: "InvestigativeJournalism", icon: FileText },
        { title: "Diplomatie", url: "DiplomaticIntelligence", icon: Globe },
        { title: "Finance", url: "FinancialIntelligence", icon: DollarSign },
        { title: "Météorologie", url: "ClimateWeatherCenter", icon: Cloud },
        { title: "Forces de l'Ordre", url: "LawEnforcementCenter", icon: ShieldAlert },
        { title: "Énergie", url: "EnergyCenter", icon: Zap },
        { title: "Maritime", url: "MaritimeIntelligence", icon: Anchor },
        { title: "Spatial", url: "SpaceCenter", icon: Rocket },
        { title: "Supply Chain", url: "SupplyChainIntelligence", icon: Package },
        { title: "Corporatif", url: "CorporateIntelligence", icon: Building },
        { title: "Infrastructure", url: "CriticalInfrastructure", icon: Database },
        { title: "Agriculture", url: "AgricultureSecurityCenter", icon: Wheat },
        { title: "Télécom", url: "TelecommunicationsCenter", icon: Radio },
        { title: "Commerce", url: "TradeIntelligence", icon: DollarSign },
        { title: "Migration", url: "MigrationBorderSecurity", icon: Users },
        { title: "Tech & Innovation", url: "TechnologyInnovationCenter", icon: Cpu },
        { title: "Médias", url: "MediaInfluenceCenter", icon: Newspaper },
        { title: "Juridique", url: "LegalIntelligence", icon: Scale },
        { title: "Environnement", url: "EnvironmentalIntelligence", icon: Leaf },
        { title: "Éducation & Recherche", url: "EducationResearchCenter", icon: GraduationCap },
        { title: "Transport & Mobilité", url: "TransportMobilityCenter", icon: Plane },
        { title: "Ressources Hydriques", url: "WaterResourcesCenter", icon: Droplet },
        { title: "Tourisme & Hôtellerie", url: "TourismHospitalityCenter", icon: MapPin }
      ]
    },
    { type: 'group', title: 'Protocoles', icon: Layers,
      items: [
        { title: "Chimère", url: "ChimeraProtocol", icon: Ghost },
        { title: "Janus", url: "JanusProtocol", icon: Zap },
        { title: "Léviathan", url: "LeviathanProtocol", icon: Container },
        { title: "Prométhée", url: "PrometheusProtocol", icon: Flame },
      ]
    },
    { type: 'group', title: 'Analyse & Sécurité', icon: BarChart,
      items: [
        { title: "Gestion de Crise", url: "CrisisManager", icon: ShieldAlert },
        { title: "Moteur de Corrélation", url: "CorrelationEngine", icon: GitMerge },
        { title: "Analyse Globale", url: "SystemAnalysis", icon: Activity },
        { title: "Hub Sécurité", url: "Security", icon: BarChart },
      ]
    },
    { type: 'group', title: 'Intelligence Artificielle', icon: BrainCircuit,
      items: [
        { title: "Centre de Contrôle IA", url: "AIControlCenter", icon: BrainCircuit },
        { title: "Générateur Scénarios IA", url: "AIScenarioBuilder", icon: Layers },
      ]
    },
    { type: 'group', title: 'Automatisation', icon: Bot,
      items: [
        { title: "Générateur de Scénarios", url: "ScenarioGenerator", icon: BrainCircuit },
        { title: "Gestionnaire de Macros", url: "BotMacroManager", icon: Bot },
        { title: "Moteur d'exécution", url: "BotMacroExecutionEngine", icon: ShieldCheck },
      ]
    },
     { type: 'group', title: 'Administration', icon: UserIcon,
      items: [
        { title: "Gestion Commerciale", url: "SubscriptionManagement", icon: DollarSign },
        { title: "Utilisateurs", url: "UserManagement", icon: UserIcon },
        { title: "Accréditations", url: "AccreditationManagement", icon: ShieldCheck },
        { title: "Journal d'Activité", url: "UserActivityLog", icon: History },
        { title: "Initialisation Données", url: "SystemDataSeeder", icon: Database },
      ]
    },
    { type: 'group', title: 'Configuration Système', icon: Settings,
      items: [
        { title: "Statut Système", url: "SystemStatus", icon: HeartPulse },
        { title: "Modules", url: "Modules", icon: Grid3x3 },
        { title: "Récupération Modules", url: "ModuleRecoverySystem", icon: Package },
        { title: "Performance", url: "PerformanceMonitoring", icon: Zap },
        { title: "Guide Optimisation", url: "OptimizationGuide", icon: FileText },
        { title: "Configuration", url: "Configuration", icon: Settings },
        { title: "Sources de Données", url: "DataSourceConfiguration", icon: Database },
        { title: "Documentation", url: "Documentation", icon: FileText },
      ]
    },
  ],
  master: []
};

const NavItem = ({ item, location, closeSidebar }) => {
  const isActive = location.pathname === createPageUrl(item.url);
  return (
    <Link to={createPageUrl(item.url)} onClick={closeSidebar}>
      <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[var(--nea-primary-blue)]/20 text-[var(--nea-text-title)]' : 'text-[var(--nea-text-secondary)] hover:bg-[var(--nea-bg-surface-hover)] hover:text-[var(--nea-text-primary)]'}`}>
        <item.icon className="w-5 h-5" />
        <span>{item.title}</span>
      </div>
    </Link>
  );
};

const NavGroup = ({ group, location, closeSidebar }) => {
  const isAnyChildActive = useMemo(() => group.items.some(child => location.pathname === createPageUrl(child.url)), [group.items, location.pathname]);
  const [isOpen, setIsOpen] = useState(isAnyChildActive);

  useEffect(() => {
      setIsOpen(isAnyChildActive);
  }, [isAnyChildActive]);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors text-[var(--nea-text-primary)] hover:bg-[var(--nea-bg-surface-hover)]"
      >
        <div className="flex items-center gap-3">
          <group.icon className="w-5 h-5 text-[var(--nea-text-secondary)]" />
          <span>{group.title}</span>
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
            className="pl-4 mt-1 space-y-1 overflow-hidden"
          >
            {group.items.map(item => {
              const isActive = location.pathname === createPageUrl(item.url);
              return (
                 <Link key={item.url} to={createPageUrl(item.url)} onClick={closeSidebar}>
                    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${isActive ? 'text-[var(--nea-text-title)]' : 'text-[var(--nea-text-secondary)] hover:text-[var(--nea-text-primary)]'}`}>
                      <span className={`absolute left-0 h-full w-0.5 rounded-full ${isActive ? 'bg-[var(--nea-primary-blue)]' : ''}`}></span>
                      <item.icon className="w-4 h-4 ml-1" />
                      <span>{item.title}</span>
                    </div>
                  </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarTitle = () => {
    const { systemStatus } = useUpdates();

    const statusInfo = useMemo(() => {
        switch (systemStatus) {
            case 'critical':
                return { text: "ALERTE CRITIQUE", color: "text-red-500", glow: "text-shadow-red" };
            case 'warning':
                return { text: "AVERTISSEMENT", color: "text-yellow-400", glow: "text-shadow-yellow" };
            default:
                return { text: "NEA-AZEX", color: "text-[var(--nea-text-title)]", glow: "" };
        }
    }, [systemStatus]);

    return (
        <h2 className={cn("font-bold text-xl transition-colors duration-500", statusInfo.color, statusInfo.glow)}>
            {statusInfo.text}
        </h2>
    );
};

const SidebarContent = ({ navigationItems, user, roleConfig, handleLogout, handleStopImpersonation, realUserRole, location, navigate, setIsSidebarOpen, userRole }) => {
  const { systemStatus } = useUpdates();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
  <>
    <div className="flex items-center justify-center gap-3 mb-8">
      <SystemStatusFace status={systemStatus} size={32} />
      <div className="text-center">
        <SidebarTitle />
        <p className={`text-sm font-semibold ${roleConfig.textColor}`}>{roleConfig.title}</p>
      </div>
    </div>

    {/* Quick Role Switcher Button */}
    {user && (
      <div className="mb-4 px-2">
        <button
          onClick={() => setShowRoleSwitcher(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 hover:from-purple-500/20 hover:to-blue-500/20 hover:border-purple-500/50 transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-600/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Palette className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-[var(--nea-text-primary)]">Changer d'Interface</p>
            <p className="text-xs text-[var(--nea-text-secondary)]">Adapter votre vue</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[var(--nea-text-secondary)] group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
        </button>
      </div>
    )}

    {userRole === 'master' ? (
      <MasterNavigation closeSidebar={closeSidebar} />
    ) : (
      <nav className="flex-1 space-y-2 overflow-y-auto styled-scrollbar pr-2">
        {(navigationItems || []).map((item, index) => {
          if (item.type === 'link') {
            return <NavItem key={item.url || index} item={item} location={location} closeSidebar={closeSidebar} />;
          }
          if (item.type === 'group') {
            return <NavGroup key={item.title || index} group={item} location={location} closeSidebar={closeSidebar} />;
          }
          return null;
        })}
      </nav>
    )}

    <div className="mt-auto pt-4 border-t border-[var(--nea-border-subtle)]">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--nea-bg-surface-hover)] transition-all text-left group">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0 ${
                roleConfig.textColor === 'text-blue-400' ? 'from-blue-500/20 to-blue-600/30' :
                roleConfig.textColor === 'text-cyan-400' ? 'from-cyan-500/20 to-cyan-600/30' :
                roleConfig.textColor === 'text-purple-400' ? 'from-purple-500/20 to-purple-600/30' :
                roleConfig.textColor === 'text-red-400' ? 'from-red-500/20 to-red-600/30' :
                'from-yellow-500/20 to-yellow-600/30'
              }`}>
                <roleConfig.icon className={`w-5 h-5 ${roleConfig.textColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[var(--nea-text-primary)] text-sm font-semibold truncate">
                  {user?.full_name || user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-[var(--nea-text-secondary)] truncate">
                  {user?.email}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-[var(--nea-text-muted)] group-hover:text-[var(--nea-primary-blue)] transition-colors flex-shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-72 bg-[var(--nea-bg-surface)] backdrop-blur-xl border-2 border-[var(--nea-border-default)] shadow-2xl rounded-xl p-2"
            align="end"
            sideOffset={8}
          >
            <div className="px-3 py-3 border-b border-[var(--nea-border-subtle)] mb-2">
              <p className="text-sm font-bold text-[var(--nea-text-title)]">{user?.full_name}</p>
              <p className="text-xs text-[var(--nea-text-secondary)] mt-0.5">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={`${
                  roleConfig.textColor === 'text-blue-400' ? 'bg-blue-500/20 text-blue-400' :
                  roleConfig.textColor === 'text-cyan-400' ? 'bg-cyan-500/20 text-cyan-400' :
                  roleConfig.textColor === 'text-purple-400' ? 'bg-purple-500/20 text-purple-400' :
                  roleConfig.textColor === 'text-red-400' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                } border-0 text-xs font-semibold`}>
                  <roleConfig.icon className="w-3 h-3 mr-1" />
                  {roleConfig.title}
                </Badge>
                {roleConfig.title !== ROLE_CONFIG[realUserRole].title && (
                  <Badge className="bg-orange-500/20 text-orange-400 border-0 text-xs font-semibold">
                    Usurpation
                  </Badge>
                )}
              </div>
            </div>

            <DropdownMenuItem
              onClick={() => setShowRoleSwitcher(true)}
              className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-[var(--nea-bg-surface-hover)] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Palette className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--nea-text-primary)]">Changer d'Interface</p>
                  <p className="text-xs text-[var(--nea-text-secondary)]">Adapter votre vue</p>
                </div>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link to={createPageUrl("Home")} className="flex items-center cursor-pointer rounded-lg px-3 py-2.5 hover:bg-[var(--nea-bg-surface-hover)] transition-colors group">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Home className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--nea-text-primary)]">Interface de Connexion</p>
                    <p className="text-xs text-[var(--nea-text-secondary)]">Page d'accueil</p>
                  </div>
                </div>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link to={createPageUrl("MySubscription")} className="flex items-center cursor-pointer rounded-lg px-3 py-2.5 hover:bg-[var(--nea-bg-surface-hover)] transition-colors group">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--nea-text-primary)]">Mon Abonnement</p>
                    <p className="text-xs text-[var(--nea-text-secondary)]">Gérer mon forfait</p>
                  </div>
                </div>
              </Link>
            </DropdownMenuItem>

            {roleConfig.title !== ROLE_CONFIG[realUserRole].title && (
              <>
                <DropdownMenuSeparator className="bg-[var(--nea-border-subtle)] my-2" />
                <DropdownMenuItem
                  onClick={handleStopImpersonation}
                  className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-yellow-500/10 focus:bg-yellow-500/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Shield className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-yellow-400">Quitter l'usurpation</p>
                      <p className="text-xs text-[var(--nea-text-secondary)]">Retour à {ROLE_CONFIG[realUserRole].title}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator className="bg-[var(--nea-border-subtle)] my-2" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer rounded-lg px-3 py-2.5 hover:bg-red-500/10 focus:bg-red-500/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LogOut className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-400">Déconnexion</p>
                  <p className="text-xs text-[var(--nea-text-secondary)]">Quitter le système</p>
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={() => navigate(createPageUrl("Home"))} className="w-full"><LogIn className="w-4 h-4 mr-2" />Connexion</Button>
      )}
    </div>

    {/* Quick Role Switcher Modal */}
    {user && (
      <QuickRoleSwitcher
        currentUserRole={realUserRole}
        currentDisplayRole={userRole}
        isOpen={showRoleSwitcher}
        onClose={() => setShowRoleSwitcher(false)}
      />
    )}
  </>
)};

const MobileHeaderContent = () => {
    const { systemStatus } = useUpdates();
    return (
        <div className="flex items-center gap-2">
           <SystemStatusFace status={systemStatus} size={24} />
           <h2 className="font-bold text-[var(--nea-text-title)] text-lg">NEA-AZEX</h2>
        </div>
    );
};

const SystemAlertBanner = () => {
    const { systemStatus } = useUpdates();

    if (systemStatus !== 'critical' && systemStatus !== 'warning') {
        return null;
    }

    const config = {
        critical: {
            bg: 'bg-red-500/10 border-red-500',
            text: 'text-red-300',
            message: 'Alerte Critique : Menace système détectée. Intégrité potentiellement compromise.',
        },
        warning: {
            bg: 'bg-yellow-500/10 border-yellow-500',
            text: 'text-yellow-300',
            message: 'Avertissement : Anomalies détectées. Surveillance accrue requise.',
        }
    }[systemStatus];

    return (
        <div className={`border-b-2 px-4 py-2 text-center text-sm font-semibold ${config.bg} ${config.text}`}>
            <AlertTriangle className="inline-block w-4 h-4 mr-2" />
            {config.message}
        </div>
    );
};

const AuthenticatedLayout = ({ children, currentPageName }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("user");
  const [realUserRole, setRealUserRole] = useState("user");
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { systemStatus } = useUpdates();
  const [lastLoggedPath, setLastLoggedPath] = useState('');

  const logPageView = useCallback(async () => {
    if (location.pathname && location.pathname !== lastLoggedPath) {
      try {
        await telemetryBase44.entities.TelemetryLog.create({
          module_name: currentPageName || 'Unknown Page',
          event_type: 'page_view',
          event_action: `navigation_to_${currentPageName}`,
          timestamp: new Date().toISOString(),
          metadata: {
            page_url: location.pathname,
            user_agent: navigator.userAgent
          }
        });
        setLastLoggedPath(location.pathname);
      } catch (error) {
        console.error("Failed to log page view:", error);
      }
    }
  }, [location.pathname, currentPageName, lastLoggedPath]);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        const realRole = currentUser?.role || "user";
        setRealUserRole(realRole);

        const impersonatedRole = localStorage.getItem('impersonated_role');
        if (impersonatedRole && (ROLE_HIERARCHY[realRole] >= ROLE_HIERARCHY[impersonatedRole])) {
          setUserRole(impersonatedRole);
        } else {
          setUserRole(realRole);
          localStorage.removeItem('impersonated_role');
        }
      } catch (error) {
        setUser(null);
        setUserRole("user");
        setRealUserRole("user");
        localStorage.removeItem('impersonated_role');
        navigate(createPageUrl("Home"));
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (!isLoading && user) {
      logPageView();
    }
  }, [isLoading, user, logPageView]);

  const handleLogout = async () => {
    await base44.auth.logout();
    localStorage.removeItem('impersonated_role');
    navigate(createPageUrl("Home"));
  };

  const handleStopImpersonation = () => {
    localStorage.removeItem('impersonated_role');
    const newRole = realUserRole || 'user';
    setUserRole(newRole);
    const dashboardMap = {
      user: "UserDashboard",
      technician: "TechnicianDashboard",
      developer: "DeveloperDashboard",
      admin: "AdminDashboard",
      master: "MasterDashboard"
    };
    const targetDashboard = dashboardMap[newRole] || 'UserDashboard';
    navigate(createPageUrl(targetDashboard));
  };

  const navigationItems = useMemo(() => NAVIGATION_ITEMS[userRole] || NAVIGATION_ITEMS.user, [userRole]);
  const roleConfig = useMemo(() => ROLE_CONFIG[userRole] || ROLE_CONFIG.user, [userRole]);

  const sidebarGlowClass = useMemo(() => {
    if (systemStatus === 'critical') return 'sidebar-glow-critical';
    if (systemStatus === 'warning') return 'sidebar-glow-warning';
    if (userRole === 'master') return 'border-l-4 border-yellow-400 shadow-lg shadow-yellow-400/20';
    return '';
  }, [systemStatus, userRole]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-[#0a0a0a]"><Loader2 className="animate-spin text-[var(--nea-primary-blue)]" /></div>;
  }

  return (
    <div className="min-h-screen w-full bg-[var(--nea-bg-deep-space)]">
      {/* Skip to content link for accessibility */}
      <SkipToContent targetId="main-content" />

      {/* Keyboard shortcuts guide */}
      <KeyboardShortcuts />

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn("fixed top-0 left-0 h-full w-64 bg-[var(--nea-bg-surface)] border-r border-[var(--nea-border-default)] flex flex-col p-4 z-40 lg:hidden", sidebarGlowClass)}
              role="navigation"
              aria-label="Navigation principale mobile"
            >
              <SidebarContent {...{ navigationItems, user, roleConfig, handleLogout, handleStopImpersonation, realUserRole, location, navigate, setIsSidebarOpen, currentPageName, userRole }} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside
        className={cn("hidden lg:flex fixed top-0 left-0 h-full w-64 bg-[var(--nea-bg-surface)] border-r border-[var(--nea-border-default)] flex-col p-4", sidebarGlowClass)}
        role="navigation"
        aria-label="Navigation principale"
      >
         <SidebarContent {...{ navigationItems, user, roleConfig, handleLogout, handleStopImpersonation, realUserRole, location, navigate, setIsSidebarOpen: () => {}, userRole }} />
      </aside>

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="lg:hidden sticky top-0 bg-[var(--nea-bg-surface)]/80 backdrop-blur-sm border-b border-[var(--nea-border-default)] px-4 py-2 flex items-center justify-between z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Ouvrir le menu de navigation"
            aria-expanded={isSidebarOpen}
            aria-controls="mobile-nav"
          >
            <Menu className="w-6 h-6 text-[var(--nea-text-primary)]" />
          </Button>
          <MobileHeaderContent />
          <div className="w-10"></div>
        </header>

        <main
          id="main-content"
          className="flex-1 flex flex-col overflow-auto bg-[var(--nea-bg-steel-gray)]"
          role="main"
          tabIndex={-1}
        >
          <SystemAlertBanner />
          {user && userRole !== realUserRole && (
            <div
              className="bg-yellow-500/10 border-b-2 border-yellow-500 text-yellow-300 px-4 py-2 text-center text-sm font-semibold"
              role="alert"
              aria-live="polite"
            >
              Vous usurpez le rôle <span className="font-bold uppercase">{userRole || 'N/A'}</span>.
              <button
                onClick={handleStopImpersonation}
                className="ml-4 underline hover:text-yellow-100 focus:ring-2 focus:ring-yellow-400 rounded px-1"
                aria-label="Retourner à mon rôle d'origine"
              >
                Retourner à mon interface
              </button>
            </div>
          )}
          <div className="p-4 sm:p-6 flex-1 flex flex-col">
            {children}
          </div>
        </main>
      </div>
      <Toaster position="bottom-right" theme="dark" richColors />
    </div>
  );
};

const LayoutWrapper = ({children, currentPageName}) => {
  const location = useLocation();
  const isPublicPage = publicPages.includes(currentPageName) || location.pathname === "/";

  if (isPublicPage) {
    return (
      <div className="min-h-screen w-full bg-[var(--nea-bg-deep-space)]">
        <Toaster position="top-right" richColors />
        {children}
      </div>
    );
  }

  return <AuthenticatedLayout currentPageName={currentPageName}>{children}</AuthenticatedLayout>
}

function Layout({ children, currentPageName }) {
  return (
    <GlobalUpdateProvider>
      <OptimizationProvider>
        <LayoutWrapper currentPageName={currentPageName}>
          {children}
        </LayoutWrapper>
        {/* Debug Panel - visible seulement en développement ou pour les développeurs */}
        <DebugPanel />
      </OptimizationProvider>
    </GlobalUpdateProvider>
  );
}

// Wrap Layout with ErrorBoundary
function LayoutWithErrorBoundary({ children, currentPageName }) {
  return (
    <ErrorBoundary>
      <Layout currentPageName={currentPageName}>{children}</Layout>
    </ErrorBoundary>
  );
}

export default LayoutWithErrorBoundary;

