
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, Target, Wrench, Cpu, Crown, 
    ChevronRight, Zap, TrendingUp, Eye, Activity,
    Lock, CheckCircle, Users, Award, DollarSign, Star,
    Quote, BookOpen, HelpCircle, Play, X, Check
} from 'lucide-react';
import NeaCard from '../components/ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const ROLE_DASHBOARDS = {
    user: { url: 'UserDashboard', title: 'Poste de Veille', icon: Target, color: 'blue' },
    technician: { url: 'TechnicianDashboard', title: 'Centre de Contrôle', icon: Wrench, color: 'cyan' },
    developer: { url: 'DeveloperDashboard', title: 'Atelier de Développement', icon: Cpu, color: 'purple' },
    admin: { url: 'AdminDashboard', title: 'Pont de Commandement', icon: Shield, color: 'red' },
    master: { url: 'MasterDashboard', title: 'Nexus Master', icon: Crown, color: 'yellow' }
};

const TESTIMONIALS = [
    {
        name: "Col. Alexandre Martin",
        role: "Commandant, Forces Armées Canadiennes",
        organization: "Défense Nationale Canada",
        avatar: "🎖️",
        content: "NEA-AZEX a transformé notre capacité de prévision stratégique. Les prédictions géopolitiques nous permettent d'anticiper les crises avec 48h d'avance en moyenne.",
        rating: 5
    },
    {
        name: "Dr. Sophie Lavoie",
        role: "Directrice Santé Publique",
        organization: "INSPQ Québec",
        avatar: "🏥",
        content: "Le système de détection des signaux faibles nous a permis d'identifier 3 éclosions majeures avant leur propagation. Un outil indispensable pour la santé publique.",
        rating: 5
    },
    {
        name: "Marc-André Dubois",
        role: "Analyste Senior",
        organization: "Desjardins Groupe",
        avatar: "💼",
        content: "L'intelligence financière de NEA-AZEX surpasse tout ce que nous avions. Les corrélations détectées ont généré 2.3M$ d'économies en risques évités.",
        rating: 5
    },
    {
        name: "Julie Tremblay",
        role: "Journaliste d'Investigation",
        organization: "Radio-Canada",
        avatar: "📰",
        content: "Les capacités OSINT sont exceptionnelles. J'ai pu recouper des informations en 2h au lieu de 3 semaines. Un gain de temps phénoménal pour l'investigation.",
        rating: 5
    }
];

const COMPETITORS = [
    {
        name: "Palantir Foundry",
        price: "$2000+",
        users: "Enterprise",
        prediction: false,
        osint: true,
        realtime: true,
        ai: false,
        support: "Business",
        deployment: "Cloud"
    },
    {
        name: "IBM Watson",
        price: "$1500+",
        users: "50+",
        prediction: true,
        osint: false,
        realtime: false,
        ai: true,
        support: "Standard",
        deployment: "Hybrid"
    },
    {
        name: "Recorded Future",
        price: "$3000+",
        users: "Enterprise",
        prediction: false,
        osint: true,
        realtime: true,
        ai: false,
        support: "Premium",
        deployment: "Cloud"
    },
    {
        name: "NEA-AZEX",
        price: "$19-499",
        users: "1-25+",
        prediction: true,
        osint: true,
        realtime: true,
        ai: true,
        support: "24/7 VIP",
        deployment: "Hybrid+On-Premise",
        isOurs: true
    }
];

export default function Home() {
    const [user, setUser] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [stats, setStats] = useState({
        modules: 0,
        predictions: 0,
        signals: 0,
        users: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const currentUser = await base44.auth.me().catch(() => null);
                setUser(currentUser);

                if (currentUser) {
                    const [subs, modules, predictions, signals, users] = await Promise.all([
                        base44.entities.Subscription.filter({ user_email: currentUser.email }).catch(() => []),
                        base44.entities.Module.list().catch(() => []),
                        base44.entities.EventPrediction.list().catch(() => []),
                        base44.entities.MediaSignal.list().catch(() => []),
                        base44.entities.User.list().catch(() => [])
                    ]);

                    if (subs.length > 0) {
                        setSubscription(subs[0]);
                    }

                    setStats({
                        modules: modules.length,
                        predictions: predictions.length,
                        signals: signals.length,
                        users: users.length
                    });
                }
            } catch (error) {
                console.error("Erreur chargement données Home:", error);
                setError("Impossible de charger certaines données");
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const handleNavigateToDashboard = () => {
        if (user) {
            const role = user.role || 'user';
            const impersonatedRole = localStorage.getItem('impersonated_role');
            const effectiveRole = impersonatedRole || role;
            
            // Admin accède au Master par défaut
            const targetDashboard = effectiveRole === 'admin' && !impersonatedRole 
                ? ROLE_DASHBOARDS.master.url
                : ROLE_DASHBOARDS[effectiveRole]?.url || ROLE_DASHBOARDS.user.url;
            
            navigate(createPageUrl(targetDashboard));
        } else {
            base44.auth.redirectToLogin();
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Initialisation NEA-AZEX...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
            {/* Error Banner */}
            {error && (
                <div className="bg-yellow-500/10 border-b border-yellow-500/30 px-4 py-3 text-center">
                    <p className="text-yellow-400 text-sm">
                        ⚠️ {error}
                    </p>
                </div>
            )}

            {/* Hero Section */}
            <motion.section 
                className="relative overflow-hidden py-20 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center mb-16"
                    >
                        <motion.div variants={itemVariants} className="mb-6">
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-sm px-4 py-2">
                                🚀 Système d'Intelligence Stratégique de Nouvelle Génération
                            </Badge>
                        </motion.div>

                        <motion.h1 
                            variants={itemVariants}
                            className="text-6xl md:text-7xl font-bold text-white mb-6"
                        >
                            NEA-AZEX
                        </motion.h1>

                        <motion.p 
                            variants={itemVariants}
                            className="text-2xl md:text-3xl text-gray-300 mb-4"
                        >
                            Nexus d'Excellence Analytique
                        </motion.p>

                        <motion.p 
                            variants={itemVariants}
                            className="text-lg text-gray-400 max-w-3xl mx-auto mb-8"
                        >
                            Anticipez l'avenir avec la plateforme d'intelligence stratégique la plus avancée. 
                            Analyse prédictive IA, OSINT temps réel, et 25 centres d'intelligence sectoriels.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 flex-wrap">
                            <Button
                                onClick={handleNavigateToDashboard}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
                            >
                                {user ? 'Accéder au Système' : 'Démarrer Gratuitement'}
                                <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                            {!user && (
                                <>
                                    <Button
                                        onClick={() => navigate(createPageUrl('Pricing'))}
                                        variant="outline"
                                        className="border-blue-500 text-blue-400 hover:bg-blue-500/10 px-8 py-6 text-lg"
                                    >
                                        Voir les Tarifs
                                    </Button>
                                    <Button
                                        onClick={() => setShowVideoModal(true)}
                                        variant="outline"
                                        className="border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-6 text-lg"
                                    >
                                        <Play className="mr-2 w-5 h-5" />
                                        Voir la Démo
                                    </Button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>

                    {/* Stats Grid */}
                    {user && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid md:grid-cols-4 gap-6 mb-16"
                        >
                            <motion.div variants={itemVariants}>
                                <NeaCard className="p-6 text-center bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
                                    <Cpu className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                                    <p className="text-3xl font-bold text-white mb-1">{stats.modules}</p>
                                    <p className="text-sm text-gray-400">Modules Système</p>
                                </NeaCard>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <NeaCard className="p-6 text-center bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
                                    <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                                    <p className="text-3xl font-bold text-white mb-1">{stats.predictions}</p>
                                    <p className="text-sm text-gray-400">Prédictions Actives</p>
                                </NeaCard>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <NeaCard className="p-6 text-center bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/30">
                                    <Eye className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                                    <p className="text-3xl font-bold text-white mb-1">{stats.signals}</p>
                                    <p className="text-sm text-gray-400">Signaux Détectés</p>
                                </NeaCard>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <NeaCard className="p-6 text-center bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
                                    <Users className="w-12 h-12 text-green-400 mx-auto mb-3" />
                                    <p className="text-3xl font-bold text-white mb-1">{stats.users}</p>
                                    <p className="text-sm text-gray-400">Utilisateurs</p>
                                </NeaCard>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Capabilities Section */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid md:grid-cols-3 gap-6"
                    >
                        <motion.div variants={itemVariants}>
                            <NeaCard className="p-8 h-full hover:border-blue-500 transition-all">
                                <div className="p-3 bg-blue-500/20 rounded-lg inline-flex mb-4">
                                    <TrendingUp className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Analyse Prédictive</h3>
                                <p className="text-gray-400">
                                    Moteur d'intelligence artificielle pour l'anticipation d'événements 
                                    géopolitiques, économiques et sécuritaires
                                </p>
                            </NeaCard>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <NeaCard className="p-8 h-full hover:border-cyan-500 transition-all">
                                <div className="p-3 bg-cyan-500/20 rounded-lg inline-flex mb-4">
                                    <Eye className="w-8 h-8 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">OSINT Avancé</h3>
                                <p className="text-gray-400">
                                    Collecte et analyse de renseignement en sources ouvertes avec 
                                    détection de signaux faibles multi-sources
                                </p>
                            </NeaCard>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <NeaCard className="p-8 h-full hover:border-purple-500 transition-all">
                                <div className="p-3 bg-purple-500/20 rounded-lg inline-flex mb-4">
                                    <Activity className="w-8 h-8 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Monitoring 24/7</h3>
                                <p className="text-gray-400">
                                    Surveillance continue multi-domaines avec alertes en temps réel 
                                    et tableaux de bord personnalisables
                                </p>
                            </NeaCard>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Testimonials Section */}
            {!user && (
                <motion.section 
                    className="py-20 px-4 bg-black/20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-4">
                                Témoignages Clients
                            </Badge>
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Ils Nous Font Confiance
                            </h2>
                            <p className="text-gray-400 text-lg">
                                Des professionnels de secteurs critiques utilisent NEA-AZEX quotidiennement
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {TESTIMONIALS.map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <NeaCard className="p-6 h-full hover:border-purple-500 transition-all">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="text-4xl">{testimonial.avatar}</div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-white mb-1">{testimonial.name}</h4>
                                                <p className="text-sm text-gray-400 mb-1">{testimonial.role}</p>
                                                <p className="text-xs text-gray-500">{testimonial.organization}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                ))}
                                            </div>
                                        </div>
                                        <Quote className="w-8 h-8 text-purple-500/30 mb-2" />
                                        <p className="text-gray-300 italic leading-relaxed">
                                            "{testimonial.content}"
                                        </p>
                                    </NeaCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>
            )}

            {/* Comparison Section */}
            {!user && (
                <motion.section 
                    className="py-20 px-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mb-4">
                                Comparaison Compétitive
                            </Badge>
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Pourquoi Choisir NEA-AZEX ?
                            </h2>
                            <p className="text-gray-400 text-lg">
                                Comparaison avec les principales plateformes concurrentes
                            </p>
                        </div>

                        <NeaCard className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b-2 border-[var(--nea-border-default)]">
                                        <th className="text-left py-4 px-6 text-white font-bold">Fonctionnalité</th>
                                        {COMPETITORS.map((comp, i) => (
                                            <th key={i} className={`text-center py-4 px-6 font-bold ${comp.isOurs ? 'text-cyan-400' : 'text-gray-400'}`}>
                                                {comp.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-[var(--nea-border-subtle)] hover:bg-[var(--nea-bg-surface-hover)]">
                                        <td className="py-4 px-6 text-gray-300 font-medium">Prix Mensuel</td>
                                        {COMPETITORS.map((comp, i) => (
                                            <td key={i} className={`text-center py-4 px-6 ${comp.isOurs ? 'text-green-400 font-bold' : 'text-gray-400'}`}>
                                                {comp.price}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b border-[var(--nea-border-subtle)] hover:bg-[var(--nea-bg-surface-hover)]">
                                        <td className="py-4 px-6 text-gray-300 font-medium">Utilisateurs</td>
                                        {COMPETITORS.map((comp, i) => (
                                            <td key={i} className="text-center py-4 px-6 text-gray-400">
                                                {comp.users}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b border-[var(--nea-border-subtle)] hover:bg-[var(--nea-bg-surface-hover)]">
                                        <td className="py-4 px-6 text-gray-300 font-medium">Analyse Prédictive IA</td>
                                        {COMPETITORS.map((comp, i) => (
                                            <td key={i} className="text-center py-4 px-6">
                                                {comp.prediction ? (
                                                    <Check className={`w-6 h-6 mx-auto ${comp.isOurs ? 'text-cyan-400' : 'text-green-400'}`} />
                                                ) : (
                                                    <X className="w-6 h-6 mx-auto text-red-400" />
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b border-[var(--nea-border-subtle)] hover:bg-[var(--nea-bg-surface-hover)]">
                                        <td className="py-4 px-6 text-gray-300 font-medium">OSINT Avancé</td>
                                        {COMPETITORS.map((comp, i) => (
                                            <td key={i} className="text-center py-4 px-6">
                                                {comp.osint ? (
                                                    <Check className={`w-6 h-6 mx-auto ${comp.isOurs ? 'text-cyan-400' : 'text-green-400'}`} />
                                                ) : (
                                                    <X className="w-6 h-6 mx-auto text-red-400" />
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b border-[var(--nea-border-subtle)] hover:bg-[var(--nea-bg-surface-hover)]">
                                        <td className="py-4 px-6 text-gray-300 font-medium">Monitoring Temps Réel</td>
                                        {COMPETITORS.map((comp, i) => (
                                            <td key={i} className="text-center py-4 px-6">
                                                {comp.realtime ? (
                                                    <Check className={`w-6 h-6 mx-auto ${comp.isOurs ? 'text-cyan-400' : 'text-green-400'}`} />
                                                ) : (
                                                    <X className="w-6 h-6 mx-auto text-red-400" />
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b border-[var(--nea-border-subtle)] hover:bg-[var(--nea-bg-surface-hover)]">
                                        <td className="py-4 px-6 text-gray-300 font-medium">IA Conversationnelle</td>
                                        {COMPETITORS.map((comp, i) => (
                                            <td key={i} className="text-center py-4 px-6">
                                                {comp.ai ? (
                                                    <Check className={`w-6 h-6 mx-auto ${comp.isOurs ? 'text-cyan-400' : 'text-green-400'}`} />
                                                ) : (
                                                    <X className="w-6 h-6 mx-auto text-red-400" />
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b border-[var(--nea-border-subtle)] hover:bg-[var(--nea-bg-surface-hover)]">
                                        <td className="py-4 px-6 text-gray-300 font-medium">Support</td>
                                        {COMPETITORS.map((comp, i) => (
                                            <td key={i} className={`text-center py-4 px-6 ${comp.isOurs ? 'text-cyan-400 font-bold' : 'text-gray-400'}`}>
                                                {comp.support}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="hover:bg-[var(--nea-bg-surface-hover)]">
                                        <td className="py-4 px-6 text-gray-300 font-medium">Déploiement</td>
                                        {COMPETITORS.map((comp, i) => (
                                            <td key={i} className={`text-center py-4 px-6 ${comp.isOurs ? 'text-cyan-400 font-bold' : 'text-gray-400'}`}>
                                                {comp.deployment}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </NeaCard>

                        <div className="text-center mt-8">
                            <Button
                                onClick={() => navigate(createPageUrl('Pricing'))}
                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-6 text-lg"
                            >
                                Voir Nos Forfaits
                                <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </motion.section>
            )}

            {/* User Info Section */}
            {user && (
                <motion.section 
                    className="py-16 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="max-w-7xl mx-auto">
                        <NeaCard className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        Bienvenue, {user.full_name || user.email}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <Badge className={`${
                                            user.role === 'master' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                            user.role === 'admin' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                            user.role === 'developer' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                                            user.role === 'technician' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' :
                                            'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                        }`}>
                                            {user.role === 'master' && <Crown className="w-3 h-3 mr-1" />}
                                            {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                                            {user.role === 'developer' && <Cpu className="w-3 h-3 mr-1" />}
                                            {user.role === 'technician' && <Wrench className="w-3 h-3 mr-1" />}
                                            {user.role === 'user' && <Target className="w-3 h-3 mr-1" />}
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </Badge>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleNavigateToDashboard}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Accéder au Dashboard
                                    <ChevronRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>

                            {subscription && (
                                <div className="border-t border-gray-700 pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-400 mb-1">Plan actuel</p>
                                            <p className="text-xl font-bold text-white">{subscription.plan_code}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-400 mb-1">Statut</p>
                                            <Badge className={`${
                                                subscription.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                                                'bg-gray-500/20 text-gray-400'
                                            } border-0`}>
                                                {subscription.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </NeaCard>
                    </div>
                </motion.section>
            )}

            {/* CTA Section */}
            {!user && (
                <motion.section 
                    className="py-20 px-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <div className="max-w-4xl mx-auto">
                        <NeaCard className="p-12 text-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Prêt à Anticiper l'Avenir ?
                            </h2>
                            <p className="text-xl text-gray-300 mb-8">
                                Rejoignez les organisations qui utilisent NEA-AZEX pour prendre des décisions stratégiques éclairées
                            </p>
                            <div className="flex items-center justify-center gap-4 flex-wrap">
                                <Button
                                    onClick={() => base44.auth.redirectToLogin()}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-6 text-lg"
                                >
                                    Commencer Gratuitement
                                    <ChevronRight className="ml-2 w-5 h-5" />
                                </Button>
                                <Button
                                    onClick={() => navigate(createPageUrl('QuickStartGuide'))}
                                    variant="outline"
                                    className="border-purple-500 text-purple-400 hover:bg-purple-500/10 px-10 py-6 text-lg"
                                >
                                    <BookOpen className="mr-2 w-5 h-5" />
                                    Guide de Démarrage
                                </Button>
                            </div>
                            <p className="text-sm text-gray-500 mt-6">
                                14 jours d'essai gratuit • Aucune carte de crédit requise • Annulation à tout moment
                            </p>
                        </NeaCard>
                    </div>
                </motion.section>
            )}

            {/* Footer */}
            <motion.footer 
                className="py-12 px-4 border-t border-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-white font-bold mb-4">NEA-AZEX</h3>
                            <p className="text-gray-500 text-sm">
                                Plateforme d'intelligence stratégique de nouvelle génération
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm">Produit</h4>
                            <ul className="space-y-2">
                                <li>
                                    <button onClick={() => navigate(createPageUrl('Pricing'))} className="text-gray-500 hover:text-blue-400 text-sm transition-colors">
                                        Tarifs
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => navigate(createPageUrl('SystemIndex'))} className="text-gray-500 hover:text-blue-400 text-sm transition-colors">
                                        Fonctionnalités
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => navigate(createPageUrl('Documentation'))} className="text-gray-500 hover:text-blue-400 text-sm transition-colors">
                                        Documentation
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm">Ressources</h4>
                            <ul className="space-y-2">
                                <li>
                                    <button onClick={() => navigate(createPageUrl('QuickStartGuide'))} className="text-gray-500 hover:text-blue-400 text-sm transition-colors">
                                        Guide de Démarrage
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => navigate(createPageUrl('FAQ'))} className="text-gray-500 hover:text-blue-400 text-sm transition-colors">
                                        FAQ
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => navigate(createPageUrl('SystemTableOfContents'))} className="text-gray-500 hover:text-blue-400 text-sm transition-colors">
                                        Table des Matières
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-sm">Légal</h4>
                            <ul className="space-y-2">
                                <li>
                                    <button onClick={() => navigate(createPageUrl('LegalNotice'))} className="text-gray-500 hover:text-blue-400 text-sm transition-colors">
                                        Mentions Légales
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-center pt-8 border-t border-gray-800">
                        <p className="text-gray-500 text-sm">
                            © 2025 NEA-AZEX Command System • Système d'Intelligence Stratégique
                        </p>
                    </div>
                </div>
            </motion.footer>

            {/* Video Modal */}
            <AnimatePresence>
                {showVideoModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowVideoModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-[#1a1f2e] rounded-2xl p-8 max-w-4xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-white">Démo NEA-AZEX</h3>
                                <button
                                    onClick={() => setShowVideoModal(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
                                <p className="text-gray-400">
                                    Vidéo de démonstration à venir
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
