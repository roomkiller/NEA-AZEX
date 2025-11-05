import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import {
  Home, Shield, Wrench, Cpu, User,
  Activity, Target, Grid3x3, FileText, Settings,
  Database, BarChart, Zap, GitMerge, BrainCircuit,
  Bot, ShieldCheck, ShieldAlert, Flame, Container,
  Ghost, Layers, DollarSign, Award, History, 
  TrendingUp, Rss, Bell, Map, TestTube,
  Workflow, Users, HeartPulse
} from "lucide-react";
import NeaButton from "../ui/NeaButton";

const ROLE_PAGES = {
  user: [
    { name: "Poste de Veille", url: "UserDashboard", icon: Target, description: "Interface principale utilisateur" }
  ],
  technician: [
    { name: "Centre de Contrôle", url: "TechnicianDashboard", icon: Wrench, description: "Monitoring système" },
    { name: "Modules", url: "Modules", icon: Grid3x3, description: "Gestion des modules" },
    { name: "Statut Système", url: "SystemStatus", icon: HeartPulse, description: "Surveillance globale" },
    { name: "Documentation", url: "Documentation", icon: FileText, description: "Ressources techniques" }
  ],
  developer: [
    { name: "Atelier de Développement", url: "DeveloperDashboard", icon: Cpu, description: "Dashboard développeur" },
    { name: "Analyse Globale", url: "SystemAnalysis", icon: Activity, description: "Analyse système" },
    { name: "Moteur de Corrélation", url: "CorrelationEngine", icon: GitMerge, description: "Corrélation des données" },
    { name: "Générateur de Scénarios", url: "ScenarioGenerator", icon: BrainCircuit, description: "IA générative" },
    { name: "Gestionnaire de Macros", url: "BotMacroManager", icon: Bot, description: "Automatisation" },
    { name: "Moteur d'exécution", url: "BotMacroExecutionEngine", icon: ShieldCheck, description: "Exécution des macros" }
  ],
  admin: [
    { name: "Pont de Commandement", url: "AdminDashboard", icon: Shield, description: "Administration centrale" },
    { name: "Chimère", url: "ChimeraProtocol", icon: Ghost, description: "Défense active" },
    { name: "Janus", url: "JanusProtocol", icon: Zap, description: "Prédiction adversariale" },
    { name: "Léviathan", url: "LeviathanProtocol", icon: Container, description: "Dispersion des données" },
    { name: "Prométhée", url: "PrometheusProtocol", icon: Flame, description: "Protocole d'attaque" },
    { name: "Gestion de Crise", url: "CrisisManager", icon: ShieldAlert, description: "Simulations de crise" },
    { name: "Hub Sécurité", url: "Security", icon: BarChart, description: "Monitoring sécuritaire" },
    { name: "Générateur de Scénarios", url: "ScenarioGenerator", icon: BrainCircuit, description: "IA générative" },
    { name: "Gestionnaire de Macros", url: "BotMacroManager", icon: Bot, description: "Automatisation" },
    { name: "Gestion Commerciale", url: "SubscriptionManagement", icon: DollarSign, description: "Abonnements" },
    { name: "Utilisateurs", url: "UserManagement", icon: Users, description: "Gestion des utilisateurs" },
    { name: "Accréditations", url: "AccreditationManagement", icon: ShieldCheck, description: "Niveaux d'accès" },
    { name: "Journal d'Activité", url: "UserActivityLog", icon: History, description: "Logs système" },
    { name: "Configuration", url: "Configuration", icon: Settings, description: "Paramètres système" },
    { name: "Sources de Données", url: "DataSourceConfiguration", icon: Database, description: "Gestion des sources" }
  ]
};

export default function NavigationBridge({ currentRole = "user" }) {
  const navigate = useNavigate();
  const pages = ROLE_PAGES[currentRole] || ROLE_PAGES.user;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-white">Navigation Rapide</h2>
          <p className="text-[var(--nea-text-secondary)] mt-1">
            Accès direct aux modules disponibles pour votre niveau d'accréditation
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {pages.map((page, index) => {
          const Icon = page.icon;
          return (
            <motion.div
              key={page.url}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)] hover:border-[var(--nea-primary-blue)] transition-all cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--nea-primary-blue)]/10 group-hover:bg-[var(--nea-primary-blue)]/20 transition-colors">
                      <Icon className="w-5 h-5 text-[var(--nea-primary-blue)]" />
                    </div>
                    <CardTitle className="text-white text-base">{page.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--nea-text-secondary)] mb-4">{page.description}</p>
                  <NeaButton
                    onClick={() => navigate(createPageUrl(page.url))}
                    variant="secondary"
                    className="w-full"
                  >
                    Accéder
                  </NeaButton>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <Link to={createPageUrl("Home")}>
          <NeaButton variant="outline">
            <Home className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </NeaButton>
        </Link>
      </motion.div>
    </div>
  );
}