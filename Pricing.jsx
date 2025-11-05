import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Shield, Crown, TrendingUp, Users, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { CurrencyDisplay, formatCurrency } from '../components/utils/NumberFormatter';
import { toast } from 'sonner';

export default function Pricing() {
    const [plans, setPlans] = useState([]);
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const currentUser = await base44.auth.me().catch(() => null);
                setUser(currentUser);

                const plansData = await base44.entities.SubscriptionPlan.filter({ status: 'Active' });
                const sortedPlans = plansData.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
                setPlans(sortedPlans);
            } catch (error) {
                console.error('Error loading pricing:', error);
                toast.error('Erreur lors du chargement des forfaits');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSelectPlan = async (plan) => {
        if (!user) {
            base44.auth.redirectToLogin();
            return;
        }

        // Redirect to subscription management or payment
        navigate(createPageUrl('MySubscription'));
        toast.info(`Forfait ${plan.plan_name} sélectionné`);
    };

    const getPrice = (plan) => {
        return billingCycle === 'monthly' ? plan.monthly_price : plan.yearly_price;
    };

    const getSavings = (plan) => {
        if (billingCycle === 'yearly' && plan.yearly_price && plan.monthly_price) {
            return Math.round(((plan.monthly_price * 12) - plan.yearly_price) / (plan.monthly_price * 12) * 100);
        }
        return 0;
    };

    const planColors = {
        'DISCOVERY': { border: 'border-blue-500/30', gradient: 'from-blue-500/10 to-cyan-500/10', icon: Zap, iconColor: 'text-blue-400' },
        'SOLO': { border: 'border-purple-500/30', gradient: 'from-purple-500/10 to-blue-500/10', icon: Users, iconColor: 'text-purple-400' },
        'TEAM': { border: 'border-cyan-500/30', gradient: 'from-cyan-500/10 to-teal-500/10', icon: TrendingUp, iconColor: 'text-cyan-400' },
        'ENTERPRISE': { border: 'border-yellow-500/30', gradient: 'from-yellow-500/10 to-orange-500/10', icon: Crown, iconColor: 'text-yellow-400' }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Chargement des forfaits...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-4">
                        Tarification Transparente
                    </Badge>
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Choisissez Votre Forfait
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Plans flexibles adaptés à tous les besoins, de l'analyste solo aux grandes organisations
                    </p>
                </motion.div>

                {/* Billing Cycle Toggle */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center mb-12"
                >
                    <div className="bg-[var(--nea-bg-surface)] p-2 rounded-xl border border-[var(--nea-border-default)] inline-flex">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                billingCycle === 'monthly'
                                    ? 'bg-[var(--nea-primary-blue)] text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Mensuel
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all relative ${
                                billingCycle === 'yearly'
                                    ? 'bg-[var(--nea-primary-blue)] text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Annuel
                            <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs border-0">
                                -20%
                            </Badge>
                        </button>
                    </div>
                </motion.div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {plans.map((plan, index) => {
                        const colorConfig = planColors[plan.plan_code] || planColors['DISCOVERY'];
                        const Icon = colorConfig.icon;
                        const savings = getSavings(plan);

                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={plan.is_popular ? 'lg:scale-105' : ''}
                            >
                                <NeaCard className={`relative overflow-hidden h-full border-2 ${colorConfig.border} ${
                                    plan.is_popular ? 'shadow-2xl shadow-purple-500/20' : ''
                                }`}>
                                    {plan.is_popular && (
                                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2 text-sm font-bold">
                                            <Star className="inline-block w-4 h-4 mr-1" />
                                            PLUS POPULAIRE
                                        </div>
                                    )}

                                    <div className={`p-6 bg-gradient-to-br ${colorConfig.gradient} ${plan.is_popular ? 'pt-14' : ''}`}>
                                        {/* Icon */}
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorConfig.gradient} border-2 ${colorConfig.border} flex items-center justify-center mb-4`}>
                                            <Icon className={`w-7 h-7 ${colorConfig.iconColor}`} />
                                        </div>

                                        {/* Plan Name */}
                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            {plan.plan_name}
                                        </h3>
                                        <p className="text-sm text-gray-400 mb-6 h-12">
                                            {plan.description}
                                        </p>

                                        {/* Price */}
                                        <div className="mb-6">
                                            <CurrencyDisplay
                                                value={getPrice(plan)}
                                                currency={plan.currency}
                                                size="xl"
                                                className={colorConfig.iconColor}
                                            />
                                            <p className="text-sm text-gray-400 mt-2">
                                                par {billingCycle === 'monthly' ? 'mois' : 'année'}
                                            </p>
                                            {savings > 0 && (
                                                <Badge className="bg-green-500/20 text-green-400 border-0 mt-2">
                                                    Économisez {savings}%
                                                </Badge>
                                            )}
                                        </div>

                                        {/* CTA Button */}
                                        <NeaButton
                                            onClick={() => handleSelectPlan(plan)}
                                            className="w-full mb-6"
                                            variant={plan.is_popular ? 'primary' : 'secondary'}
                                        >
                                            {user ? 'Choisir ce forfait' : 'Commencer'}
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </NeaButton>

                                        {/* Quotas */}
                                        <div className="space-y-3 mb-6 pb-6 border-b border-gray-700">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-400">Utilisateurs</span>
                                                <span className="font-bold text-white">
                                                    {plan.max_users === 0 ? 'Illimité' : plan.max_users}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-400">Prédictions/mois</span>
                                                <span className="font-bold text-white">
                                                    {plan.max_predictions === 0 ? 'Illimité' : plan.max_predictions}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-400">Modules actifs</span>
                                                <span className="font-bold text-white">
                                                    {plan.max_modules === 0 ? 'Illimité' : plan.max_modules}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Features */}
                                        <div className="space-y-2">
                                            {plan.features?.slice(0, 5).map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-2">
                                                    <Check className={`w-5 h-5 ${colorConfig.iconColor} flex-shrink-0 mt-0.5`} />
                                                    <span className="text-sm text-gray-300">{feature}</span>
                                                </div>
                                            ))}
                                            {plan.features?.length > 5 && (
                                                <p className="text-xs text-gray-500 italic ml-7">
                                                    +{plan.features.length - 5} autres fonctionnalités
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </NeaCard>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Comparison Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-12"
                >
                    <h2 className="text-3xl font-bold text-white text-center mb-8">
                        Comparaison Détaillée
                    </h2>
                    <NeaCard className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-[var(--nea-border-default)]">
                                    <th className="text-left py-4 px-6 text-white font-bold">Fonctionnalité</th>
                                    {plans.map(plan => (
                                        <th key={plan.id} className="text-center py-4 px-6 font-bold text-white">
                                            {plan.plan_name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-[var(--nea-border-subtle)]">
                                    <td className="py-4 px-6 text-gray-300 font-medium">Prix mensuel</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center py-4 px-6 font-bold text-white">
                                            {formatCurrency(plan.monthly_price, plan.currency)}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-[var(--nea-border-subtle)]">
                                    <td className="py-4 px-6 text-gray-300 font-medium">Accès Prédictions</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center py-4 px-6">
                                            {plan.restrictions?.can_access_predictions ? (
                                                <Check className="w-6 h-6 text-green-400 mx-auto" />
                                            ) : (
                                                <span className="text-gray-600">—</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-[var(--nea-border-subtle)]">
                                    <td className="py-4 px-6 text-gray-300 font-medium">Accès Scénarios</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center py-4 px-6">
                                            {plan.restrictions?.can_access_scenarios ? (
                                                <Check className="w-6 h-6 text-green-400 mx-auto" />
                                            ) : (
                                                <span className="text-gray-600">—</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-[var(--nea-border-subtle)]">
                                    <td className="py-4 px-6 text-gray-300 font-medium">Gestionnaire de Crises</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center py-4 px-6">
                                            {plan.restrictions?.can_access_crisis_manager ? (
                                                <Check className="w-6 h-6 text-green-400 mx-auto" />
                                            ) : (
                                                <span className="text-gray-600">—</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-[var(--nea-border-subtle)]">
                                    <td className="py-4 px-6 text-gray-300 font-medium">Accès API</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center py-4 px-6">
                                            {plan.restrictions?.can_use_api ? (
                                                <Check className="w-6 h-6 text-green-400 mx-auto" />
                                            ) : (
                                                <span className="text-gray-600">—</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="py-4 px-6 text-gray-300 font-medium">Support</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center py-4 px-6 text-white font-medium">
                                            {plan.support_level?.replace(/_/g, ' ')}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </NeaCard>
                </motion.div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-center"
                >
                    <h3 className="text-2xl font-bold text-white mb-4">
                        Questions ?
                    </h3>
                    <p className="text-gray-400 mb-6">
                        Contactez notre équipe pour un forfait personnalisé ou pour toute question
                    </p>
                    <NeaButton variant="secondary" onClick={() => navigate(createPageUrl('FAQ'))}>
                        Consulter la FAQ
                    </NeaButton>
                </motion.div>
            </div>
        </div>
    );
}