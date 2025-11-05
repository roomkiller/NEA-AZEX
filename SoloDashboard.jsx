
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Target, BarChart, Zap, Activity, Database, TrendingUp, Layers, AlertTriangle } from "lucide-react";
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from "../components/ui/PageHeader";
import NeaCard from "../components/ui/NeaCard";
import { Badge } from "@/components/ui/badge";
import { useStaggerAnimation } from '../components/navigation/PageTransition';
import { formatLargeNumber } from '../components/utils/NumberFormatter';
import StatsCard from '../components/ui/StatsCard';
import LoadingTransition from '../components/transitions/LoadingTransition'; // Assuming path for LoadingTransition

// The soloMetrics constant is replaced by the new StatsCard structure
// const soloMetrics = [
//     { icon: Target, label: "Objectifs Personnels", value: "12/15", color: "text-blue-400" },
//     { icon: BarChart, label: "Analyses Effectuées", value: "234", color: "text-green-400" },
//     { icon: Activity, label: "Modules Actifs", value: "8", color: "text-purple-400" },
//     { icon: Zap, label: "Performance", value: "94%", color: "text-yellow-400" }
// ];

export default function SoloDashboard() {
    const { containerVariants, itemVariants } = useStaggerAnimation();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        activeModules: 0,
        totalModules: 0,
        activePredictions: 0,
        highProbPredictions: 0,
        totalScenarios: 0,
        activeAlerts: 0,
    });

    useEffect(() => {
        // Simulate fetching data
        const fetchData = async () => {
            // In a real application, you would fetch this data from an API
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

            setStats({
                activeModules: 8,
                totalModules: 12,
                activePredictions: 15,
                highProbPredictions: 7,
                totalScenarios: 124,
                activeAlerts: 3,
            });
            setIsLoading(false);
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <LoadingTransition message="Chargement Espace Solo..." />;
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Dashboard Solo", href: "/SoloDashboard" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<User className="w-8 h-8 text-blue-400" />}
                    title="Dashboard Solo"
                    subtitle="Espace de travail individuel optimisé"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
                    <div className="p-8 text-center">
                        <User className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Mode Solo Activé
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Configuration optimisée pour utilisateur individuel
                        </p>
                        <Badge className="mt-4 bg-blue-500/20 text-blue-400 border-blue-500/30">
                            Licence Solo
                        </Badge>
                    </div>
                </NeaCard>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Modules Actifs"
                        value={stats.activeModules}
                        icon={Database}
                        iconColor="text-purple-400"
                        iconBg="from-purple-500/20 to-purple-600/30"
                        borderColor="border-purple-500/30"
                        valueColor="text-purple-400"
                        subtitle={`sur ${stats.totalModules}`}
                        size="default"
                    />

                    <StatsCard
                        title="Prédictions Actives"
                        value={stats.activePredictions}
                        icon={TrendingUp}
                        iconColor="text-cyan-400"
                        iconBg="from-cyan-500/20 to-cyan-600/30"
                        borderColor="border-cyan-500/30"
                        valueColor="text-cyan-400"
                        badge={`${stats.highProbPredictions} >70%`}
                        badgeColor="bg-cyan-500/20 text-cyan-400"
                        size="default"
                    />

                    <StatsCard
                        title="Scénarios Générés"
                        value={stats.totalScenarios}
                        icon={Layers}
                        iconColor="text-blue-400"
                        iconBg="from-blue-500/20 to-blue-600/30"
                        borderColor="border-blue-500/30"
                        valueColor="text-blue-400"
                        subtitle="ce mois"
                        size="default"
                    />

                    <StatsCard
                        title="Alertes Actives"
                        value={stats.activeAlerts}
                        icon={AlertTriangle}
                        iconColor="text-orange-400"
                        iconBg="from-orange-500/20 to-orange-600/30"
                        borderColor="border-orange-500/30"
                        valueColor="text-orange-400"
                        badge={stats.activeAlerts > 0 ? "Nouveaux" : null}
                        badgeColor="bg-orange-500/20 text-orange-400"
                        size="default"
                    />
                </div>
            </motion.div>
            {/* The old soloMetrics map is removed as it's replaced by the StatsCard grid above */}
        </motion.div>
    );
}
