import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Shield, Target, Activity } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import AuthorizationSeal from '../components/prometheus/AuthorizationSeal';
import StrikePlanner from '../components/prometheus/StrikePlanner';
import TargetList from '../components/prometheus/TargetList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStaggerAnimation } from '../components/navigation/PageTransition';

export default function PrometheusProtocol() {
    const { containerVariants, itemVariants } = useStaggerAnimation();

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Protocole Prométhée", href: "PrometheusProtocol" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<Flame className="w-8 h-8 text-orange-400" />}
                    title="Protocole Prométhée"
                    subtitle="Frappe préventive et neutralisation de menaces"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <AuthorizationSeal />
            </motion.div>

            <motion.div variants={itemVariants}>
                <Tabs defaultValue="planner" className="w-full">
                    <TabsList className="bg-[var(--nea-bg-surface)] border border-[var(--nea-border-default)]">
                        <TabsTrigger value="planner">
                            <Activity className="w-4 h-4 mr-2" />
                            Planificateur
                        </TabsTrigger>
                        <TabsTrigger value="targets">
                            <Target className="w-4 h-4 mr-2" />
                            Cibles
                        </TabsTrigger>
                        <TabsTrigger value="authorization">
                            <Shield className="w-4 h-4 mr-2" />
                            Autorisations
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="planner" className="mt-6">
                        <StrikePlanner />
                    </TabsContent>
                    <TabsContent value="targets" className="mt-6">
                        <TargetList />
                    </TabsContent>
                    <TabsContent value="authorization" className="mt-6">
                        <AuthorizationSeal />
                    </TabsContent>
                </Tabs>
            </motion.div>
        </motion.div>
    );
}