
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Lock, Cpu, HeartPulse, Shield, Users, Database, Building, Activity } from "lucide-react";
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from "../components/ui/PageHeader";
import NeaCard from "../components/ui/NeaCard";
import { Badge } from "@/components/ui/badge";
import { useStaggerAnimation } from '../components/navigation/PageTransition';
import { formatLargeNumber, formatCurrency } from '../components/utils/NumberFormatter'; // Added
import StatsCard from '../components/ui/StatsCard'; // Added

// Placeholder for LoadingTransition component if it's not defined elsewhere
// In a real application, this would be an actual component from your UI library
const LoadingTransition = ({ message }) => (
    <div className="flex items-center justify-center h-64 text-lg text-gray-600 dark:text-gray-400">
        <svg className="animate-spin h-5 w-5 mr-3 text-purple-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {message}
    </div>
);


export default function EnterpriseDashboard() {
    const { containerVariants, itemVariants } = useStaggerAnimation();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        deployedModules: 0,
        activeCenters: 0,
        apiCallsToday: 0,
    });

    useEffect(() => {
        // Simulate fetching data
        const fetchData = async () => {
            // In a real app, you would make an API call here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
            setStats({
                totalUsers: 12450,
                activeUsers: 8900,
                deployedModules: 28,
                activeCenters: 5,
                apiCallsToday: 128475,
            });
            setIsLoading(false);
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <LoadingTransition message="Chargement Espace Enterprise..." />;
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Dashboard Enterprise", href: "EnterpriseDashboard" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Building2 className="w-8 h-8 text-purple-400" />}
                    title="Dashboard Enterprise"
                    subtitle="Gestion d'entreprise et sécurité renforcée"
                />
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Utilisateurs Totaux"
                        value={formatLargeNumber(stats.totalUsers)}
                        icon={Users}
                        iconColor="text-purple-400"
                        iconBg="from-purple-500/20 to-purple-600/30"
                        borderColor="border-purple-500/30"
                        valueColor="text-purple-400"
                        subtitle={`${formatLargeNumber(stats.activeUsers)} actifs`}
                        trend="up"
                        trendValue={8.5}
                        size="default"
                    />

                    <StatsCard
                        title="Modules Déployés"
                        value={stats.deployedModules}
                        icon={Database}
                        iconColor="text-blue-400"
                        iconBg="from-blue-500/20 to-blue-600/30"
                        borderColor="border-blue-500/30"
                        valueColor="text-blue-400"
                        subtitle="infrastructure complète"
                        size="default"
                    />

                    <StatsCard
                        title="Centres Professionnels"
                        value={stats.activeCenters}
                        icon={Building}
                        iconColor="text-cyan-400"
                        iconBg="from-cyan-500/20 to-cyan-600/30"
                        borderColor="border-cyan-500/30"
                        valueColor="text-cyan-400"
                        subtitle="accès illimité"
                        size="default"
                    />

                    <StatsCard
                        title="Appels API/jour"
                        value={formatLargeNumber(stats.apiCallsToday)}
                        icon={Activity}
                        iconColor="text-green-400"
                        iconBg="from-green-500/20 to-green-600/30"
                        borderColor="border-green-500/30"
                        valueColor="text-green-400"
                        compact={true}
                        subtitle="illimités"
                        size="default"
                    />
                </div>
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
                    <div className="p-8 text-center">
                        <Building2 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Mode Enterprise Activé
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Infrastructure complète avec sécurité maximale
                        </p>
                        <div className="flex gap-2 justify-center mt-4">
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                Licence Enterprise
                            </Badge>
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                                <Shield className="w-3 h-3 mr-1 inline" />
                                Sécurité Max
                            </Badge>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>
        </motion.div>
    );
}
