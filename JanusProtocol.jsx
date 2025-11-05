import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Activity, TrendingUp } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import AdversarialTrainingVisual from '../components/janus/AdversarialTrainingVisual';
import CampaignStatus from '../components/janus/CampaignStatus';
import PredictionFeed from '../components/janus/PredictionFeed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStaggerAnimation } from '../components/navigation/PageTransition';

export default function JanusProtocol() {
    const { containerVariants, itemVariants } = useStaggerAnimation();

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Protocole Janus", href: "JanusProtocol" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<Zap className="w-8 h-8 text-yellow-400" />}
                    title="Protocole Janus"
                    subtitle="Entraînement adversarial et prédiction d'attaques"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <CampaignStatus />
            </motion.div>

            <motion.div variants={itemVariants}>
                <Tabs defaultValue="training" className="w-full">
                    <TabsList className="bg-[var(--nea-bg-surface)] border border-[var(--nea-border-default)]">
                        <TabsTrigger value="training">
                            <Shield className="w-4 h-4 mr-2" />
                            Entraînement
                        </TabsTrigger>
                        <TabsTrigger value="predictions">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Prédictions
                        </TabsTrigger>
                        <TabsTrigger value="metrics">
                            <Activity className="w-4 h-4 mr-2" />
                            Métriques
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="training" className="mt-6">
                        <AdversarialTrainingVisual />
                    </TabsContent>
                    <TabsContent value="predictions" className="mt-6">
                        <PredictionFeed />
                    </TabsContent>
                    <TabsContent value="metrics" className="mt-6">
                        <AdversarialTrainingVisual />
                    </TabsContent>
                </Tabs>
            </motion.div>
        </motion.div>
    );
}