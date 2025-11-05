import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Award, Calendar, CreditCard, CheckCircle, AlertCircle, Info, TrendingUp, Shield, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import RoleSwitcher from '../components/navigation/RoleSwitcher';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { toast } from 'sonner';
import { CurrencyDisplay, formatDate } from '../components/utils/NumberFormatter';

const PLAN_INTERFACES = {
    'DISCOVERY': ['user'],
    'SOLO': ['user', 'technician'],
    'TEAM': ['user', 'technician', 'developer'],
    'ENTERPRISE': ['user', 'technician', 'developer', 'admin']
};

export default function MySubscription() {
    const [subscription, setSubscription] = useState(null);
    const [plan, setPlan] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        const loadSubscription = async () => {
            setIsLoading(true);
            try {
                const currentUser = await base44.auth.me();
                setUser(currentUser);
                
                const subs = await base44.entities.Subscription.filter({ user_email: currentUser.email });
                if (subs.length > 0) {
                    setSubscription(subs[0]);
                    const plans = await base44.entities.SubscriptionPlan.filter({ plan_code: subs[0].plan_code });
                    if (plans.length > 0) {
                        setPlan(plans[0]);
                    }
                }
            } catch (error) {
                console.error("Erreur chargement abonnement:", error);
                toast.error("Échec du chargement de l'abonnement");
            } finally {
                setIsLoading(false);
            }
        };
        loadSubscription();
    }, []);

    if (isLoading) {
        return <LoadingTransition message="Chargement de votre abonnement..." />;
    }

    const statusColors = {
        'Active': 'bg-green-500/20 text-green-400 border-green-500/30',
        'Trial': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'Expired': 'bg-red-500/20 text-red-400 border-red-500/30',
        'Suspended': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'Pending': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };

    const daysRemaining = subscription ? Math.ceil((new Date(subscription.end_date) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
    const totalDays = subscription ? Math.ceil((new Date(subscription.end_date) - new Date(subscription.start_date)) / (1000 * 60 * 60 * 24)) : 30;
    const progressPercentage = subscription ? Math.max(0, Math.min(100, (daysRemaining / totalDays) * 100)) : 0;
    const displayRole = localStorage.getItem('impersonated_role') || user?.role || 'user';

    return (
        <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Mon Abonnement", href: "MySubscription" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<Award className="w-8 h-8 text-purple-400" />}
                    title="Mon Abonnement"
                    subtitle="Gérez votre forfait NEA-AZEX et vos paramètres de facturation"
                />
            </motion.div>

            {subscription ? (
                <>
                    {/* Main Subscription Card */}
                    <motion.div variants={itemVariants}>
                        <NeaCard className="overflow-hidden bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5 border-2 border-purple-500/30 shadow-2xl shadow-purple-500/10">
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h2 className="text-4xl font-bold text-[var(--nea-text-title)]">
                                                {subscription.plan_name}
                                            </h2>
                                            <Badge className={`${statusColors[subscription.status]} border text-sm font-bold px-3 py-1`}>
                                                {subscription.status}
                                            </Badge>
                                        </div>
                                        <p className="text-[var(--nea-text-secondary)] text-lg">
                                            Forfait {subscription.billing_cycle === 'Monthly' ? 'Mensuel' : 'Annuel'}
                                        </p>
                                    </div>
                                    <div className="text-right bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-6 rounded-2xl border border-purple-500/30">
                                        <p className="text-sm text-[var(--nea-text-secondary)] mb-1">Prix</p>
                                        <CurrencyDisplay
                                            value={subscription.monthly_price}
                                            currency={subscription.currency || 'CAD'}
                                            size="xl"
                                            className="text-purple-400"
                                        />
                                        <p className="text-sm text-[var(--nea-text-muted)] mt-1">
                                            {subscription.currency || 'CAD'} /{subscription.billing_cycle === 'Monthly' ? 'mois' : 'an'}
                                        </p>
                                    </div>
                                </div>

                                {/* Time Remaining */}
                                <div className="mb-6 p-6 bg-[var(--nea-bg-surface)] rounded-xl border border-[var(--nea-border-default)]">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-cyan-400" />
                                            <span className="text-sm font-semibold text-[var(--nea-text-primary)]">Période d'abonnement</span>
                                        </div>
                                        <span className="text-2xl font-bold text-cyan-400">
                                            {daysRemaining} jours restants
                                        </span>
                                    </div>
                                    <Progress value={progressPercentage} className="h-3 mb-2" />
                                    <div className="flex justify-between text-xs text-[var(--nea-text-muted)]">
                                        <span>{formatDate(subscription.start_date, 'medium')}</span>
                                        <span>{formatDate(subscription.end_date, 'medium')}</span>
                                    </div>
                                </div>

                                {/* Dates Grid */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-4 p-4 bg-[var(--nea-bg-surface)] rounded-xl border border-[var(--nea-border-subtle)]">
                                        <div className="p-3 bg-blue-500/20 rounded-lg">
                                            <Calendar className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--nea-text-muted)] font-medium uppercase tracking-wide">Début d'abonnement</p>
                                            <p className="text-lg font-bold text-[var(--nea-text-title)] mt-1">
                                                {formatDate(subscription.start_date, 'long')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-[var(--nea-bg-surface)] rounded-xl border border-[var(--nea-border-subtle)]">
                                        <div className="p-3 bg-orange-500/20 rounded-lg">
                                            <Calendar className="w-6 h-6 text-orange-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--nea-text-muted)] font-medium uppercase tracking-wide">Renouvellement</p>
                                            <p className="text-lg font-bold text-[var(--nea-text-title)] mt-1">
                                                {formatDate(subscription.end_date, 'long')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </NeaCard>
                    </motion.div>

                    {/* Interfaces Disponibles */}
                    <motion.div variants={itemVariants}>
                        <NeaCard className="overflow-hidden border-2 border-cyan-500/30 shadow-lg">
                            <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-[var(--nea-border-default)]">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="w-6 h-6 text-cyan-400" />
                                    <div>
                                        <h3 className="text-xl font-bold text-[var(--nea-text-title)]">
                                            Interfaces Disponibles avec Votre Forfait
                                        </h3>
                                        <p className="text-sm text-[var(--nea-text-secondary)] mt-1">
                                            Changez d'interface selon vos besoins professionnels
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                <RoleSwitcher 
                                    currentUserRole={user?.role || 'user'}
                                    currentDisplayRole={displayRole}
                                    subscription={subscription}
                                />
                            </div>
                        </NeaCard>
                    </motion.div>

                    {/* Features */}
                    {plan && plan.features && (
                        <motion.div variants={itemVariants}>
                            <NeaCard className="overflow-hidden">
                                <div className="p-6 bg-gradient-to-r from-green-500/5 to-emerald-500/5 border-b border-[var(--nea-border-default)]">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-6 h-6 text-green-400" />
                                        <h3 className="text-xl font-bold text-[var(--nea-text-title)]">
                                            Fonctionnalités Incluses
                                        </h3>
                                    </div>
                                    <p className="text-sm text-[var(--nea-text-secondary)] mt-2">
                                        Toutes les capacités disponibles avec votre forfait {subscription.plan_name}
                                    </p>
                                </div>
                                <div className="p-8 grid md:grid-cols-2 gap-4">
                                    {plan.features.map((feature, index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--nea-bg-surface-hover)] transition-colors">
                                            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-[var(--nea-text-primary)] font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </NeaCard>
                        </motion.div>
                    )}

                    {/* Payment Info */}
                    <motion.div variants={itemVariants}>
                        <NeaCard className="overflow-hidden">
                            <div className="p-6 bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-b border-[var(--nea-border-default)]">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-6 h-6 text-purple-400" />
                                    <h3 className="text-xl font-bold text-[var(--nea-text-title)]">
                                        Informations de Paiement
                                    </h3>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 bg-[var(--nea-bg-surface)] rounded-lg">
                                            <span className="text-[var(--nea-text-secondary)] font-medium">Méthode de paiement</span>
                                            <span className="font-bold text-[var(--nea-text-title)]">
                                                {subscription.payment_method || 'Non configuré'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-[var(--nea-bg-surface)] rounded-lg">
                                            <span className="text-[var(--nea-text-secondary)] font-medium">Renouvellement auto</span>
                                            <Badge className={subscription.auto_renew ? 'bg-green-500/20 text-green-400 border-0' : 'bg-gray-500/20 text-gray-400 border-0'}>
                                                {subscription.auto_renew ? 'Activé' : 'Désactivé'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 bg-[var(--nea-bg-surface)] rounded-lg">
                                            <span className="text-[var(--nea-text-secondary)] font-medium">Prochain paiement</span>
                                            <span className="font-bold text-[var(--nea-text-title)]">
                                                {subscription.next_billing_date ? 
                                                    formatDate(subscription.next_billing_date, 'medium') : 
                                                    'N/A'
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/30">
                                            <span className="text-green-400 font-medium">Total payé</span>
                                            <CurrencyDisplay
                                                value={subscription.total_paid || 0}
                                                currency={subscription.currency || 'CAD'}
                                                size="lg"
                                                className="text-green-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="mt-6 pt-6 border-t border-[var(--nea-border-subtle)] flex gap-4">
                                    <Link to={createPageUrl('Pricing')} className="flex-1">
                                        <NeaButton variant="secondary" className="w-full py-6 text-base font-semibold">
                                            <TrendingUp className="w-5 h-5 mr-2" />
                                            Changer de Forfait
                                        </NeaButton>
                                    </Link>
                                    <NeaButton className="flex-1 py-6 text-base font-semibold shadow-lg">
                                        <Shield className="w-5 h-5 mr-2" />
                                        Gérer le Paiement
                                    </NeaButton>
                                </div>
                            </div>
                        </NeaCard>
                    </motion.div>

                    {/* Usage Stats */}
                    {subscription.usage_stats && (
                        <motion.div variants={itemVariants}>
                            <NeaCard>
                                <div className="p-6 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border-b border-[var(--nea-border-default)]">
                                    <div className="flex items-center gap-3">
                                        <TrendingUp className="w-6 h-6 text-blue-400" />
                                        <h3 className="text-xl font-bold text-[var(--nea-text-title)]">
                                            Utilisation du Forfait
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-8 grid md:grid-cols-3 gap-6">
                                    <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/30">
                                        <p className="text-sm text-[var(--nea-text-secondary)] mb-2">Prédictions utilisées</p>
                                        <p className="text-4xl font-bold text-purple-400">
                                            {subscription.usage_stats.predictions_used || 0}
                                        </p>
                                        {plan?.max_predictions && plan.max_predictions > 0 && (
                                            <p className="text-xs text-[var(--nea-text-muted)] mt-2">
                                                sur {plan.max_predictions}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-center p-6 bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 rounded-xl border border-cyan-500/30">
                                        <p className="text-sm text-[var(--nea-text-secondary)] mb-2">Modules actifs</p>
                                        <p className="text-4xl font-bold text-cyan-400">
                                            {subscription.usage_stats.modules_active || 0}
                                        </p>
                                        {plan?.max_modules && plan.max_modules > 0 && (
                                            <p className="text-xs text-[var(--nea-text-muted)] mt-2">
                                                sur {plan.max_modules}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/30">
                                        <p className="text-sm text-[var(--nea-text-secondary)] mb-2">Appels API aujourd'hui</p>
                                        <p className="text-4xl font-bold text-blue-400">
                                            {subscription.usage_stats.api_calls_today || 0}
                                        </p>
                                        {plan?.restrictions?.max_api_calls_per_day && plan.restrictions.max_api_calls_per_day > 0 && (
                                            <p className="text-xs text-[var(--nea-text-muted)] mt-2">
                                                sur {plan.restrictions.max_api_calls_per_day}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </NeaCard>
                        </motion.div>
                    )}
                </>
            ) : (
                <motion.div variants={itemVariants}>
                    <NeaCard className="border-2 border-yellow-500/30">
                        <div className="p-16 text-center">
                            <AlertCircle className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
                            <h3 className="text-3xl font-bold text-[var(--nea-text-title)] mb-4">
                                Aucun Abonnement Actif
                            </h3>
                            <p className="text-[var(--nea-text-secondary)] mb-8 text-lg max-w-2xl mx-auto">
                                Vous n'avez pas encore d'abonnement actif au système NEA-AZEX. 
                                Consultez nos forfaits pour accéder à l'intelligence stratégique de pointe.
                            </p>
                            <Link to={createPageUrl('Pricing')}>
                                <NeaButton className="px-10 py-6 text-lg font-bold shadow-xl">
                                    <Award className="w-6 h-6 mr-3" />
                                    Découvrir les Forfaits
                                    <ArrowRight className="w-6 h-6 ml-3" />
                                </NeaButton>
                            </Link>
                        </div>
                    </NeaCard>
                </motion.div>
            )}
        </motion.div>
    );
}