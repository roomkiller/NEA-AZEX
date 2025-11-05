import React from 'react';
import { motion } from 'framer-motion';
import { GitMerge } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import CorrelationGraph from '../components/correlation/CorrelationGraph';
import CorrelationMatrix from '../components/correlation/CorrelationMatrix';
import PredictiveInsights from '../components/correlation/PredictiveInsights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStaggerAnimation } from '../components/navigation/PageTransition';

export default function CorrelationEngine() {
    const { containerVariants, itemVariants } = useStaggerAnimation();

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Moteur de Corrélation", href: "CorrelationEngine" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<GitMerge className="w-8 h-8 text-purple-400" />}
                    title="Moteur de Corrélation"
                    subtitle="Analyse des relations entre données et événements"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <Tabs defaultValue="graph" className="w-full">
                    <TabsList className="bg-[var(--nea-bg-surface)] border border-[var(--nea-border-default)]">
                        <TabsTrigger value="graph">Graphe de Corrélation</TabsTrigger>
                        <TabsTrigger value="matrix">Matrice</TabsTrigger>
                        <TabsTrigger value="insights">Insights Prédictifs</TabsTrigger>
                    </TabsList>
                    <TabsContent value="graph" className="mt-6">
                        <CorrelationGraph />
                    </TabsContent>
                    <TabsContent value="matrix" className="mt-6">
                        <CorrelationMatrix />
                    </TabsContent>
                    <TabsContent value="insights" className="mt-6">
                        <PredictiveInsights />
                    </TabsContent>
                </Tabs>
            </motion.div>
        </motion.div>
    );
}