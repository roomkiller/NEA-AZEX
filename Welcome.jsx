import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle, ArrowRight, Target, Wrench, Cpu, Shield, 
    Rocket, BookOpen, Zap, Award, TrendingUp, Users
} from 'lucide-react';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const ONBOARDING_STEPS = [
    {
        id: 'welcome',
        title: 'Bienvenue dans NEA-AZEX',
        icon: Rocket,
        color: 'blue'
    },
    {
        id: 'subscription',
        title: 'Votre Abonnement',
        icon: Award,
        color: 'purple'
    },
    {
        id: 'interface',
        title: 'Choisir votre Interface',
        icon: Target,
        color: 'cyan'
    },
    {
        id: 'tour',
        title: 'Visite Guidée',
        icon: BookOpen,
        color: 'green'
    },
    {
        id: 'complete',
        title: 'Prêt à Commencer',
        icon: CheckCircle,
        color: 'green'
    }
];

const INTERFACE_OPTIONS = [
    { role: 'user', icon: Target, title: 'Utilisateur', subtitle: 'Poste de Veille', description: 'Interface simple pour consultation', color: 'blue' },
    { role: 'technician', icon: Wrench, title: 'Technicien', subtitle: 'Centre de Contrôle', description: 'Surveillance système avancée', color: 'cyan' },
    { role: 'developer', icon: Cpu, title: 'Développeur', subtitle: 'Atelier de Développement', description: 'Analyse approfondie et automatisation', color: 'purple' },
    { role: 'admin', icon: Shield, title: 'Admin', subtitle: 'Pont de Commandement', description: 'Contrôle total du système', color: 'red' }
];

export default function Welcome() {
    const [currentStep, setCurrentStep] = useState(0);
    const [user, setUser] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [selectedInterface, setSelectedInterface] = useState('user');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const currentUser = await base44.auth.me();
                setUser(currentUser);

                const subs = await base44.entities.Subscription.filter({ user_email: currentUser.email });
                if (subs.length > 0) {
                    setSubscription(subs[0]);
                }

                // Si l'utilisateur a déjà un rôle d'impersonation, le sélectionner
                const savedRole = localStorage.getItem('impersonated_role');
                if (savedRole) {
                    setSelectedInterface(savedRole);
                }
            } catch (error) {
                console.error("Erreur chargement données:", error);
                toast.error("Impossible de charger vos informations");
            } finally {
                setIsLoading(false);
            }
        };
        loadUserData();
    }, []);

    const handleNext = () => {
        if (currentStep < ONBOARDING_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleInterfaceSelect = (role) => {
        setSelectedInterface(role);
        localStorage.setItem('impersonated_role', role);
    };

    const handleComplete = () => {
        toast.success("Configuration terminée ! Bienvenue dans NEA-AZEX 🚀");
        
        const dashboardMap = {
            user: "UserDashboard",
            technician: "TechnicianDashboard",
            developer: "DeveloperDashboard",
            admin: "AdminDashboard"
        };
        
        navigate(createPageUrl(dashboardMap[selectedInterface] || 'UserDashboard'));
    };

    const progressPercentage = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Préparation de votre expérience...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] p-6">
            <div className="max-w-4xl mx-auto">
                {/* Progress Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        {ONBOARDING_STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    index <= currentStep 
                                        ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                                        : 'bg-gray-700'
                                }`}>
                                    <step.icon className="w-5 h-5 text-white" />
                                </div>
                                {index < ONBOARDING_STEPS.length - 1 && (
                                    <div className={`h-1 w-12 mx-2 ${
                                        index < currentStep ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-700'
                                    }`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <p className="text-center text-gray-400 mt-2 text-sm">
                        Étape {currentStep + 1} sur {ONBOARDING_STEPS.length}
                    </p>
                </motion.div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <NeaCard className="p-8 md:p-12 min-h-[400px] flex flex-col">
                            {/* Step 0: Welcome */}
                            {currentStep === 0 && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                        className="mb-6"
                                    >
                                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                            <Rocket className="w-12 h-12 text-white" />
                                        </div>
                                    </motion.div>
                                    <h1 className="text-4xl font-bold text-white mb-4">
                                        Bienvenue dans NEA-AZEX
                                    </h1>
                                    <p className="text-xl text-gray-300 mb-2">
                                        Bonjour, {user?.full_name || user?.email}
                                    </p>
                                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                                        Vous venez de rejoindre la plateforme d'intelligence stratégique 
                                        la plus avancée. Nous allons vous guider à travers quelques étapes 
                                        pour personnaliser votre expérience.
                                    </p>
                                </div>
                            )}

                            {/* Step 1: Subscription */}
                            {currentStep === 1 && subscription && (
                                <div className="flex-1">
                                    <div className="text-center mb-8">
                                        <Award className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                                        <h2 className="text-3xl font-bold text-white mb-2">
                                            Votre Abonnement
                                        </h2>
                                        <p className="text-gray-400">
                                            Récapitulatif de votre forfait
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 border-2 border-purple-500/30 mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-2xl font-bold text-white">
                                                {subscription.plan_name}
                                            </h3>
                                            <Badge className="bg-green-500/20 text-green-400 border-0">
                                                {subscription.status}
                                            </Badge>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Prix :</span>
                                                <span className="text-white font-semibold">${subscription.monthly_price} CAD</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Cycle :</span>
                                                <span className="text-white font-semibold">{subscription.billing_cycle}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Début :</span>
                                                <span className="text-white font-semibold">
                                                    {new Date(subscription.start_date).toLocaleDateString('fr-CA')}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Renouvellement :</span>
                                                <span className="text-white font-semibold">
                                                    {new Date(subscription.end_date).toLocaleDateString('fr-CA')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                                            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                            <p className="text-gray-400 text-xs mb-1">Utilisateurs</p>
                                            <p className="text-white font-bold">Accès complet</p>
                                        </div>
                                        <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                                            <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                                            <p className="text-gray-400 text-xs mb-1">Prédictions</p>
                                            <p className="text-white font-bold">Illimité</p>
                                        </div>
                                        <div className="text-center p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                                            <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                                            <p className="text-gray-400 text-xs mb-1">Modules</p>
                                            <p className="text-white font-bold">Tous actifs</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Interface Selection */}
                            {currentStep === 2 && (
                                <div className="flex-1">
                                    <div className="text-center mb-8">
                                        <Target className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                                        <h2 className="text-3xl font-bold text-white mb-2">
                                            Choisir votre Interface
                                        </h2>
                                        <p className="text-gray-400">
                                            Sélectionnez l'interface adaptée à votre usage
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        {INTERFACE_OPTIONS.map((option) => (
                                            <motion.button
                                                key={option.role}
                                                onClick={() => handleInterfaceSelect(option.role)}
                                                className={`p-6 rounded-xl border-2 text-left transition-all ${
                                                    selectedInterface === option.role
                                                        ? `border-${option.color}-500 bg-${option.color}-500/10`
                                                        : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                                                }`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-3 rounded-lg bg-${option.color}-500/20`}>
                                                        <option.icon className={`w-8 h-8 text-${option.color}-400`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-white mb-1">
                                                            {option.title}
                                                        </h3>
                                                        <p className={`text-${option.color}-400 text-sm font-semibold mb-2`}>
                                                            {option.subtitle}
                                                        </p>
                                                        <p className="text-gray-400 text-sm">
                                                            {option.description}
                                                        </p>
                                                    </div>
                                                    {selectedInterface === option.role && (
                                                        <CheckCircle className={`w-6 h-6 text-${option.color}-400`} />
                                                    )}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>

                                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                        <p className="text-sm text-gray-300">
                                            💡 <strong>Conseil :</strong> Vous pourrez changer d'interface 
                                            à tout moment depuis votre profil.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Tour */}
                            {currentStep === 3 && (
                                <div className="flex-1">
                                    <div className="text-center mb-8">
                                        <BookOpen className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                        <h2 className="text-3xl font-bold text-white mb-2">
                                            Visite Guidée
                                        </h2>
                                        <p className="text-gray-400">
                                            Découvrez les fonctionnalités principales
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { icon: TrendingUp, title: 'Prédictions d\'Événements', desc: 'Anticipez les événements géopolitiques et économiques majeurs' },
                                            { icon: Zap, title: 'Signaux Faibles OSINT', desc: 'Détectez les tendances émergentes avant qu\'elles ne deviennent critiques' },
                                            { icon: Target, title: 'Centres d\'Intelligence', desc: '25 centres sectoriels couvrant tous les domaines stratégiques' },
                                            { icon: Rocket, title: 'System Nexus', desc: 'IA conversationnelle pour requêtes et analyses en langage naturel' }
                                        ].map((feature, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                                            >
                                                <div className="p-3 bg-blue-500/20 rounded-lg">
                                                    <feature.icon className="w-6 h-6 text-blue-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white mb-1">{feature.title}</h4>
                                                    <p className="text-sm text-gray-400">{feature.desc}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                        <p className="text-sm text-gray-300">
                                            📚 Consultez la <strong>Documentation</strong> pour des guides détaillés 
                                            et des tutoriels vidéo.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Complete */}
                            {currentStep === 4 && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                        className="mb-6"
                                    >
                                        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-12 h-12 text-white" />
                                        </div>
                                    </motion.div>
                                    <h1 className="text-4xl font-bold text-white mb-4">
                                        Tout est Prêt ! 🎉
                                    </h1>
                                    <p className="text-xl text-gray-300 mb-6">
                                        Votre système NEA-AZEX est configuré
                                    </p>
                                    <div className="max-w-md">
                                        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/30 mb-6">
                                            <p className="text-sm text-gray-300 leading-relaxed">
                                                Vous êtes maintenant prêt à exploiter toute la puissance 
                                                de l'intelligence stratégique. Votre interface 
                                                <strong className="text-blue-400"> {selectedInterface}</strong> est activée.
                                            </p>
                                        </div>
                                        <p className="text-gray-400 text-sm">
                                            Besoin d'aide ? Notre équipe de support est disponible 24/7.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </NeaCard>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-6">
                            <NeaButton
                                variant="secondary"
                                onClick={handlePrevious}
                                disabled={currentStep === 0}
                                className="px-6 py-3"
                            >
                                Précédent
                            </NeaButton>

                            {currentStep < ONBOARDING_STEPS.length - 1 ? (
                                <NeaButton
                                    onClick={handleNext}
                                    className="px-6 py-3"
                                >
                                    Suivant
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </NeaButton>
                            ) : (
                                <NeaButton
                                    onClick={handleComplete}
                                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                >
                                    Commencer
                                    <Rocket className="w-4 h-4 ml-2" />
                                </NeaButton>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}