import React from 'react';
import { Activity, BrainCircuit } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import SystemMetrics from '../components/analysis/SystemMetrics';
import ModuleStatusGrid from '../components/analysis/ModuleStatusGrid';
import ApiEndpointHealth from '../components/analysis/ApiEndpointHealth';
import RecentSecurityEvents from '../components/analysis/RecentSecurityEvents';
import { motion } from 'framer-motion';
import { useStaggerAnimation } from '../components/navigation/PageTransition';

export default function SystemAnalysis() {
    const { containerVariants, itemVariants } = useStaggerAnimation();

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Analyse Système", href: "SystemAnalysis" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<Activity className="w-8 h-8 text-cyan-400" />}
                    title="Analyse Système"
                    subtitle="Vue d'ensemble des métriques et performances"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <SystemMetrics />
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                    <ModuleStatusGrid />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <ApiEndpointHealth />
                </motion.div>
            </div>

            <motion.div variants={itemVariants}>
                <RecentSecurityEvents />
            </motion.div>
        </motion.div>
    );
}