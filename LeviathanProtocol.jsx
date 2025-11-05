import React from 'react';
import { motion } from 'framer-motion';
import { Container, Database, Activity, Shield } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import LeviathanStatus from '../components/leviathan/LeviathanStatus';
import FractalDataVisualizer from '../components/leviathan/FractalDataVisualizer';
import DispersalLog from '../components/leviathan/DispersalLog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStaggerAnimation } from '../components/navigation/PageTransition';

export default function LeviathanProtocol() {
    const { containerVariants, itemVariants } = useStaggerAnimation();

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Protocole Léviathan", href: "LeviathanProtocol" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<Container className="w-8 h-8 text-blue-400" />}
                    title="Protocole Léviathan"
                    subtitle="Dispersion fractale et résilience des données"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <LeviathanStatus />
            </motion.div>

            <motion.div variants={itemVariants}>
                <Tabs defaultValue="visualizer" className="w-full">
                    <TabsList className="bg-[var(--nea-bg-surface)] border border-[var(--nea-border-default)]">
                        <TabsTrigger value="visualizer">
                            <Database className="w-4 h-4 mr-2" />
                            Visualisateur
                        </TabsTrigger>
                        <TabsTrigger value="dispersal">
                            <Activity className="w-4 h-4 mr-2" />
                            Dispersion
                        </TabsTrigger>
                        <TabsTrigger value="security">
                            <Shield className="w-4 h-4 mr-2" />
                            Sécurité
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="visualizer" className="mt-6">
                        <FractalDataVisualizer />
                    </TabsContent>
                    <TabsContent value="dispersal" className="mt-6">
                        <DispersalLog />
                    </TabsContent>
                    <TabsContent value="security" className="mt-6">
                        <FractalDataVisualizer />
                    </TabsContent>
                </Tabs>
            </motion.div>
        </motion.div>
    );
}