
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Share2, GitMerge, MessageSquare, TrendingUp, Database, FileText } from "lucide-react";
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from "../components/ui/PageHeader";
import NeaCard from "../components/ui/NeaCard";
import { Badge } from "@/components/ui/badge";
import { useStaggerAnimation } from '../components/navigation/PageTransition';
import { formatLargeNumber } from '../components/utils/NumberFormatter';
import StatsCard from '../components/ui/StatsCard';

// Mock LoadingTransition component for demonstration
const LoadingTransition = ({ message }) => (
    <div className="flex justify-center items-center h-64 text-lg text-gray-500 dark:text-gray-400">
        <p>{message}</p>
    </div>
);

export default function TeamDashboard() {
    const { containerVariants, itemVariants } = useStaggerAnimation();

    // Placeholder for state and hooks as per outline
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        teamMembers: 0,
        activeMembers: 0,
        deployedModules: 0,
        maxModules: 0,
        collaborativeScenarios: 0,
        reportsGenerated: 0,
    });

    useEffect(() => {
        // Simulate data loading
        const fetchData = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            setStats({
                teamMembers: formatLargeNumber(12),
                activeMembers: 9,
                deployedModules: formatLargeNumber(34),
                maxModules: formatLargeNumber(50),
                collaborativeScenarios: formatLargeNumber(78),
                reportsGenerated: formatLargeNumber(123),
            });
            setIsLoading(false);
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <LoadingTransition message="Chargement Espace Team..." />;
    }

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Dashboard Équipe", href: "TeamDashboard" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<Users className="w-8 h-8 text-green-400" />}
                    title="Dashboard Équipe"
                    subtitle="Collaboration et gestion d'équipe"
                />
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Membres Équipe"
                        value={stats.teamMembers}
                        icon={Users}
                        iconColor="text-purple-400"
                        iconBg="from-purple-500/20 to-purple-600/30"
                        borderColor="border-purple-500/30"
                        valueColor="text-purple-400"
                        subtitle={`${stats.activeMembers} actifs`}
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
                        subtitle={`sur ${stats.maxModules} autorisés`}
                        size="default"
                    />

                    <StatsCard
                        title="Scénarios Collaboratifs"
                        value={stats.collaborativeScenarios}
                        icon={GitMerge}
                        iconColor="text-cyan-400"
                        iconBg="from-cyan-500/20 to-cyan-600/30"
                        borderColor="border-cyan-500/30"
                        valueColor="text-cyan-400"
                        subtitle="en cours"
                        size="default"
                    />

                    <StatsCard
                        title="Rapports Générés"
                        value={stats.reportsGenerated}
                        icon={FileText}
                        iconColor="text-green-400"
                        iconBg="from-green-500/20 to-green-600/30"
                        borderColor="border-green-500/30"
                        valueColor="text-green-400"
                        subtitle="ce mois"
                        size="default"
                    />
                </div>
            </motion.div>

            {/* The rest of the page, adapted or removed based on the outline */}
            {/* The original 'Mode Équipe Activé' NeaCard and teamMetrics grid are removed as per instructions. */}
            {/* If there were other sections, they would be placed here. For this specific outline, the file ends here after the stats grid. */}
        </motion.div>
    );
}
