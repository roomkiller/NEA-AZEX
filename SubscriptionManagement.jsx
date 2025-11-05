
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, FileText, TrendingUp, Award, AlertTriangle } from 'lucide-react'; // Added Award, AlertTriangle
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlansManager from '../components/subscription/PlansManager';
import SubscriptionsTable from '../components/subscription/SubscriptionsTable';
import InvoicesManager from '../components/subscription/InvoicesManager';
import PaymentsTracker from '../components/subscription/PaymentsTracker';
import SubscriptionAnalytics from '../components/subscription/SubscriptionAnalytics'; // Keeping for now, but will be replaced by the grid
import { useStaggerAnimation } from '../components/navigation/PageTransition';
import { formatCurrency, formatLargeNumber, formatDate } from '../components/utils/NumberFormatter'; // New import
import StatsCard from '../components/ui/StatsCard'; // New import
import LoadingTransition from '../components/ui/LoadingTransition'; // New import

export default function SubscriptionManagement() {
    const [activeTab, setActiveTab] = useState('plans');
    const { containerVariants, itemVariants } = useStaggerAnimation();

    // New state for loading and analytics data
    const [isLoading, setIsLoading] = useState(true);
    const [analytics, setAnalytics] = useState({
        monthlyRevenue: 0,
        activeSubscriptions: 0,
        totalSubscriptions: 0,
        conversionRate: 0,
        churnRate: 0,
    });

    // Simulate data fetching
    useEffect(() => {
        const fetchAnalyticsData = async () => {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Dummy data for analytics
            setAnalytics({
                monthlyRevenue: 520000, // CAD
                activeSubscriptions: 1240,
                totalSubscriptions: 1500,
                conversionRate: 8.7, // %
                churnRate: 4.5, // %
            });
            setIsLoading(false);
        };

        fetchAnalyticsData();
    }, []);

    if (isLoading) {
        return <LoadingTransition message="Chargement gestion commerciale..." />;
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[
                    { name: "Administration" },
                    { name: "Gestion Commerciale", href: "SubscriptionManagement" }
                ]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<DollarSign className="w-8 h-8 text-green-400" />}
                    title="Gestion Commerciale"
                    subtitle="Administration des forfaits, abonnements et facturation"
                />
            </motion.div>

            {/* Analytics Grid */}
            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Revenue Mensuel"
                        value={formatCurrency(analytics.monthlyRevenue, 'CAD', 'fr-CA', 0)}
                        icon={DollarSign}
                        iconColor="text-green-400"
                        iconBg="from-green-500/20 to-green-600/30"
                        borderColor="border-green-500/30"
                        valueColor="text-green-400"
                        compact={true}
                        unit="CAD"
                        trend="up"
                        trendValue={12.5}
                        size="default"
                    />

                    <StatsCard
                        title="Abonnements Actifs"
                        value={formatLargeNumber(analytics.activeSubscriptions)}
                        icon={Award}
                        iconColor="text-blue-400"
                        iconBg="from-blue-500/20 to-blue-600/30"
                        borderColor="border-blue-500/30"
                        valueColor="text-blue-400"
                        subtitle={`${analytics.totalSubscriptions} total`}
                        size="default"
                    />

                    <StatsCard
                        title="Taux de Conversion"
                        value={analytics.conversionRate}
                        unit="%"
                        icon={TrendingUp}
                        iconColor="text-purple-400"
                        iconBg="from-purple-500/20 to-purple-600/30"
                        borderColor="border-purple-500/30"
                        valueColor="text-purple-400"
                        trend="up"
                        trendValue={3.2}
                        size="default"
                    />

                    <StatsCard
                        title="Churn Rate"
                        value={analytics.churnRate}
                        unit="%"
                        icon={AlertTriangle}
                        iconColor="text-orange-400"
                        iconBg="from-orange-500/20 to-orange-600/30"
                        borderColor="border-orange-500/30"
                        valueColor="text-orange-400"
                        trend={analytics.churnRate < 5 ? "down" : "up"}
                        trendValue={analytics.churnRate < 5 ? -0.5 : 1.2}
                        size="default"
                    />
                </div>
            </motion.div>

            {/* Original Analytics Overview - Replaced by the grid above */}
            {/* <motion.div variants={itemVariants}>
                <SubscriptionAnalytics />
            </motion.div> */}

            {/* Main Tabs */}
            <motion.div variants={itemVariants}>
                <NeaCard className="overflow-hidden">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <div className="p-4 bg-gradient-to-r from-green-500/5 to-emerald-500/5 border-b border-[var(--nea-border-default)]">
                            <TabsList className="bg-[var(--nea-bg-surface)] grid w-full grid-cols-4 p-1">
                                <TabsTrigger
                                    value="plans"
                                    className="data-[state=active]:bg-[var(--nea-primary-blue)] data-[state=active]:text-white"
                                >
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Forfaits
                                </TabsTrigger>
                                <TabsTrigger
                                    value="subscriptions"
                                    className="data-[state=active]:bg-[var(--nea-primary-blue)] data-[state=active]:text-white"
                                >
                                    <Users className="w-4 h-4 mr-2" />
                                    Abonnements
                                </TabsTrigger>
                                <TabsTrigger
                                    value="invoices"
                                    className="data-[state=active]:bg-[var(--nea-primary-blue)] data-[state=active]:text-white"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Factures
                                </TabsTrigger>
                                <TabsTrigger
                                    value="payments"
                                    className="data-[state=active]:bg-[var(--nea-primary-blue)] data-[state=active]:text-white"
                                >
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    Paiements
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="plans" className="p-6">
                            <PlansManager />
                        </TabsContent>

                        <TabsContent value="subscriptions" className="p-6">
                            <SubscriptionsTable />
                        </TabsContent>

                        <TabsContent value="invoices" className="p-6">
                            <InvoicesManager />
                        </TabsContent>

                        <TabsContent value="payments" className="p-6">
                            <PaymentsTracker />
                        </TabsContent>
                    </Tabs>
                </NeaCard>
            </motion.div>
        </motion.div>
    );
}
