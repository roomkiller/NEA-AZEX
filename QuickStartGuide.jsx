
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
    Rocket, CheckCircle, ArrowRight, Target, Wrench, Cpu, Shield,
    BookOpen, TrendingUp, MessageCircle, Crown, Zap, Settings, BarChart,
    Globe, HelpCircle
} from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { useStaggerAnimation } from '../components/navigation/PageTransition';
import { cn } from '@/lib/utils';

const QUICK_START_STEPS = [
    {
        step: 1,
        title: "Créez votre compte",
        description: "Choisissez votre forfait et créez votre compte en moins de 2 minutes",
        icon: Rocket,
        color: "blue",
        actions: [
            { text: "Accédez à la page d'accueil", link: "Home" },
            { text: "Cliquez sur 'Créer un compte'", link: null },
            { text: "Sélectionnez votre forfait (essai gratuit inclus)", link: "Pricing" },
            { text: "Remplissez vos informations", link: null },
            { text: "Confirmez votre email", link: null }
        ],
        tip: "💡 Tous les forfaits incluent une période d'essai gratuite de 14 à 30 jours"
    },
    {
        step: 2,
        title: "Choisissez votre interface",
        description: "Sélectionnez l'interface adaptée à votre usage",
        icon: Target,
        color: "purple",
        actions: [
            { text: "Page Welcome vous guide automatiquement", link: "Welcome" },
            { text: "Choisissez parmi : Utilisateur, Technicien, Développeur, Admin", link: null },
            { text: "Vous pouvez changer d'interface à tout moment", link: null }
        ],
        tip: "🎯 Commencez avec l'interface Utilisateur si vous débutez, puis explorez les autres"
    },
    {
        step: 3,
        title: "Explorez le tableau de bord",
        description: "Familiarisez-vous avec votre espace de travail",
        icon: BarChart,
        color: "cyan",
        actions: [
            { text: "Consultez les statistiques globales", link: null },
            { text: "Explorez les prédictions récentes", link: "EventPredictions" },
            { text: "Vérifiez les signaux faibles OSINT", link: "WeakSignals" },
            { text: "Analysez les tendances mondiales", link: "TrendAnalysis" }
        ],
        tip: "📊 Les données sont mises à jour en temps réel - revenez régulièrement"
    },
    {
        step: 4,
        title: "Découvrez System Nexus",
        description: "Interagissez avec l'intelligence artificielle centrale",
        icon: MessageCircle,
        color: "green",
        actions: [
            { text: "Accédez à System Nexus", link: "SystemNexus" },
            { text: "Créez votre première conversation", link: null },
            { text: "Posez des questions sur des événements spécifiques", link: null },
            { text: "Demandez des analyses approfondies", link: null }
        ],
        tip: "🤖 System Nexus peut rechercher des informations tant dans la base de données que sur internet en temps réel"
    },
    {
        step: 5,
        title: "Explorez les centres professionnels",
        description: "Accédez aux 25 centres d'intelligence sectorielle",
        icon: Globe,
        color: "yellow",
        actions: [
            { text: "Choisissez un centre selon votre domaine", link: null },
            { text: "Consultez les briefings stratégiques", link: null },
            { text: "Configurez vos alertes personnalisées", link: null },
            { text: "Exportez les rapports en PDF", link: null }
        ],
        tip: "🌍 Chaque centre agrège des données spécifiques à son secteur d'activité"
    },
    {
        step: 6,
        title: "Personnalisez votre expérience",
        description: "Configurez vos préférences et alertes",
        icon: Settings,
        color: "orange",
        actions: [
            { text: "Configurez vos alertes par email", link: null },
            { text: "Choisissez vos régions d'intérêt", link: null },
            { text: "Définissez vos mots-clés de surveillance", link: null },
            { text: "Ajustez la fréquence de notifications", link: null }
        ],
        tip: "⚙️ Une configuration initiale de 5 minutes vous fera gagner des heures d'analyse"
    }
];

const INTERFACE_GUIDES = [
    {
        role: "Utilisateur",
        icon: Target,
        color: "blue",
        description: "Interface de consultation basique",
        features: ["Prédictions d'événements", "Signaux faibles OSINT", "Centres professionnels", "System Nexus IA"],
        bestFor: "Professionnels cherchant une vue d'ensemble stratégique",
        dashboard: "UserDashboard"
    },
    {
        role: "Technicien",
        icon: Wrench,
        color: "cyan",
        description: "Surveillance système avancée",
        features: ["Tout Utilisateur +", "Statut système temps réel", "Gestion des modules", "Configuration réseau"],
        bestFor: "Techniciens responsables de la surveillance opérationnelle",
        dashboard: "TechnicianDashboard"
    },
    {
        role: "Développeur",
        icon: Cpu,
        color: "purple",
        description: "Analyse approfondie + automatisation",
        features: ["Tout Technicien +", "Générateur de scénarios", "Gestionnaire de macros", "Moteur de corrélation"],
        bestFor: "Développeurs créant des analyses et automatisations avancées",
        dashboard: "DeveloperDashboard"
    },
    {
        role: "Admin",
        icon: Shield,
        color: "red",
        description: "Contrôle total du système",
        features: ["Tout Développeur +", "Protocoles avancés", "Gestion utilisateurs", "Gestion commerciale"],
        bestFor: "Administrateurs gérant l'organisation et la sécurité",
        dashboard: "AdminDashboard"
    }
];

const StepCard = ({ step, index }) => {
    const Icon = step.icon;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <NeaCard className={cn(
                "p-6 border-2 transition-all hover:shadow-xl",
                `border-${step.color}-500/30 hover:border-${step.color}-500`
            )}>
                <div className="flex items-start gap-4 mb-4">
                    <div className={cn(
                        "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
                        `bg-${step.color}-500/20`
                    )}>
                        <Icon className={cn("w-6 h-6", `text-${step.color}-400`)} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className={cn(`bg-${step.color}-500/20 text-${step.color}-400 border-0`)}>
                                Étape {step.step}
                            </Badge>
                        </div>
                        <h3 className="text-xl font-bold text-[var(--nea-text-title)] mb-2">
                            {step.title}
                        </h3>
                        <p className="text-[var(--nea-text-secondary)]">
                            {step.description}
                        </p>
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    {step.actions.map((action, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--nea-bg-surface-hover)]">
                            <CheckCircle className={cn("w-5 h-5 flex-shrink-0 mt-0.5", `text-${step.color}-400`)} />
                            {action.link ? (
                                <Link to={createPageUrl(action.link)} className="text-[var(--nea-text-primary)] hover:text-[var(--nea-primary-blue)] transition-colors font-medium">
                                    {action.text} <ArrowRight className="w-4 h-4 inline ml-1" />
                                </Link>
                            ) : (
                                <span className="text-[var(--nea-text-primary)]">{action.text}</span>
                            )}
                        </div>
                    ))}
                </div>

                <div className={cn(
                    "p-3 rounded-lg border",
                    `bg-${step.color}-500/5 border-${step.color}-500/30`
                )}>
                    <p className="text-sm text-[var(--nea-text-primary)]">{step.tip}</p>
                </div>
            </NeaCard>
        </motion.div>
    );
};

export default function QuickStartGuide() {
    const { containerVariants, itemVariants } = useStaggerAnimation();

    return (
        <motion.div
            className="min-h-screen bg-[var(--nea-bg-deep-space)] p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-6xl mx-auto">
                <motion.div variants={itemVariants}>
                    <Breadcrumbs pages={[{ name: "Guide de Démarrage Rapide", href: "QuickStartGuide" }]} />
                </motion.div>

                <motion.div variants={itemVariants} className="mt-6">
                    <PageHeader
                        icon={<Rocket className="w-8 h-8 text-blue-400" />}
                        title="Guide de Démarrage Rapide"
                        subtitle="Commencez avec NEA-AZEX en 6 étapes simples"
                    />
                </motion.div>

                <motion.div variants={itemVariants} className="mt-8">
                    <NeaCard className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
                        <div className="flex items-start gap-4">
                            <Zap className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold text-[var(--nea-text-title)] mb-2">
                                    Prêt en 10 minutes
                                </h3>
                                <p className="text-[var(--nea-text-secondary)] leading-relaxed">
                                    Suivez ce guide pour maîtriser rapidement NEA-AZEX. Chaque étape prend 1-2 minutes. 
                                    Vous serez opérationnel pour analyser des événements stratégiques en moins de 10 minutes.
                                </p>
                            </div>
                        </div>
                    </NeaCard>
                </motion.div>

                <div className="mt-8 space-y-6">
                    {QUICK_START_STEPS.map((step, index) => (
                        <StepCard key={step.step} step={step} index={index} />
                    ))}
                </div>

                <motion.div variants={itemVariants} className="mt-12">
                    <h2 className="text-2xl font-bold text-[var(--nea-text-title)] mb-6">
                        Choisir la bonne interface
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {INTERFACE_GUIDES.map((guide, index) => {
                            const Icon = guide.icon;
                            return (
                                <motion.div
                                    key={guide.role}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <NeaCard className={cn(
                                        "p-6 h-full border-2 transition-all hover:shadow-xl",
                                        `border-${guide.color}-500/30 hover:border-${guide.color}-500`
                                    )}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                                `bg-${guide.color}-500/20`
                                            )}>
                                                <Icon className={cn("w-6 h-6", `text-${guide.color}-400`)} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-[var(--nea-text-title)]">
                                                    {guide.role}
                                                </h3>
                                                <p className="text-xs text-[var(--nea-text-secondary)]">
                                                    {guide.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            {guide.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <CheckCircle className={cn("w-4 h-4", `text-${guide.color}-400`)} />
                                                    <span className="text-sm text-[var(--nea-text-primary)]">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className={cn(
                                            "p-3 rounded-lg mb-4",
                                            `bg-${guide.color}-500/5 border border-${guide.color}-500/30`
                                        )}>
                                            <p className="text-xs text-[var(--nea-text-secondary)]">
                                                <strong className={`text-${guide.color}-400`}>Idéal pour :</strong> {guide.bestFor}
                                            </p>
                                        </div>

                                        <Link to={createPageUrl(guide.dashboard)}>
                                            <NeaButton className="w-full">
                                                Accéder au Dashboard
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </NeaButton>
                                        </Link>
                                    </NeaCard>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-12">
                    <NeaCard className="p-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-[var(--nea-text-title)] mb-4">
                                Besoin d'aide supplémentaire ?
                            </h3>
                            <p className="text-[var(--nea-text-secondary)] mb-6 max-w-2xl mx-auto">
                                Explorez notre documentation complète, consultez la FAQ, ou contactez notre équipe de support
                            </p>
                            <div className="flex items-center justify-center gap-4 flex-wrap">
                                <Link to={createPageUrl('Documentation')}>
                                    <NeaButton>
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Documentation
                                    </NeaButton>
                                </Link>
                                <Link to={createPageUrl('FAQ')}>
                                    <NeaButton variant="secondary">
                                        <HelpCircle className="w-4 h-4 mr-2" />
                                        FAQ
                                    </NeaButton>
                                </Link>
                                <Link to={createPageUrl('SystemNexus')}>
                                    <NeaButton variant="secondary">
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        System Nexus
                                    </NeaButton>
                                </Link>
                            </div>
                        </div>
                    </NeaCard>
                </motion.div>
            </div>
        </motion.div>
    );
}
