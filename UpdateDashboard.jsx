import React from "react";
import { motion } from "framer-motion";
import { Calendar, Activity } from "lucide-react";
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from "../components/ui/PageHeader";
import UpdateScheduleManager from '../components/updates/UpdateScheduleManager';
import { useStaggerAnimation } from '../components/navigation/PageTransition';

export default function UpdateDashboard() {
    const { containerVariants, itemVariants } = useStaggerAnimation();

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Tableau de Bord MAJ", href: "UpdateDashboard" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<Calendar className="w-8 h-8 text-green-400" />}
                    title="Tableau de Bord Mises à Jour"
                    subtitle="Vue d'ensemble des actualisations système"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <UpdateScheduleManager />
            </motion.div>
        </motion.div>
    );
}