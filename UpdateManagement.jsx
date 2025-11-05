import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Bell, BookOpen, BarChart } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import UpdateScheduleManager from '../components/updates/UpdateScheduleManager';
import AlertDashboard from '../components/updates/AlertDashboard';
import ProcedureLibrary from '../components/updates/ProcedureLibrary';
import UpdateAnalytics from '../components/updates/UpdateAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStaggerAnimation } from '../components/navigation/PageTransition';

export default function UpdateManagement() {
    const { containerVariants, itemVariants } = useStaggerAnimation();

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Gestion des Mises à Jour", href: "UpdateManagement" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<Calendar className="w-8 h-8 text-green-400" />}
                    title="Gestion des Mises à Jour"
                    subtitle="Planification et suivi des actualisations système"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <Tabs defaultValue="schedule" className="w-full">
                    <TabsList className="bg-[var(--nea-bg-surface)] border border-[var(--nea-border-default)]">
                        <TabsTrigger value="schedule">
                            <Calendar className="w-4 h-4 mr-2" />
                            Planification
                        </TabsTrigger>
                        <TabsTrigger value="alerts">
                            <Bell className="w-4 h-4 mr-2" />
                            Alertes
                        </TabsTrigger>
                        <TabsTrigger value="procedures">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Procédures
                        </TabsTrigger>
                        <TabsTrigger value="analytics">
                            <BarChart className="w-4 h-4 mr-2" />
                            Analytiques
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="schedule" className="mt-6">
                        <UpdateScheduleManager />
                    </TabsContent>
                    <TabsContent value="alerts" className="mt-6">
                        <AlertDashboard />
                    </TabsContent>
                    <TabsContent value="procedures" className="mt-6">
                        <ProcedureLibrary />
                    </TabsContent>
                    <TabsContent value="analytics" className="mt-6">
                        <UpdateAnalytics />
                    </TabsContent>
                </Tabs>
            </motion.div>
        </motion.div>
    );
}