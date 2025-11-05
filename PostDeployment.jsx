import React, { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, CheckCircle2, AlertCircle } from "lucide-react";
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from "../components/ui/PageHeader";
import NeaCard from "../components/ui/NeaCard";
import NeaButton from "../components/ui/NeaButton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useStaggerAnimation } from '../components/navigation/PageTransition';

const deploymentSteps = [
    {
        phase: "Initialisation",
        tasks: [
            { name: "Configuration serveurs", status: "completed" },
            { name: "Chargement modules", status: "completed" },
            { name: "Vérification dépendances", status: "completed" },
            { name: "Tests connectivité", status: "completed" }
        ]
    },
    {
        phase: "Déploiement",
        tasks: [
            { name: "Migration base de données", status: "completed" },
            { name: "Déploiement API", status: "completed" },
            { name: "Configuration réseau", status: "completed" },
            { name: "Activation modules", status: "in_progress" }
        ]
    },
    {
        phase: "Validation",
        tasks: [
            { name: "Tests d'intégration", status: "pending" },
            { name: "Validation sécurité", status: "pending" },
            { name: "Tests performance", status: "pending" },
            { name: "Certification finale", status: "pending" }
        ]
    }
];

export default function PostDeployment() {
    const { containerVariants, itemVariants } = useStaggerAnimation();
    const [selectedPhase, setSelectedPhase] = useState(deploymentSteps[0]);

    const overallProgress = deploymentSteps.reduce((total, phase) => {
        const phaseProgress = phase.tasks.filter(t => t.status === 'completed').length / phase.tasks.length;
        return total + phaseProgress;
    }, 0) / deploymentSteps.length * 100;

    const statusColors = {
        completed: "bg-green-500/20 text-green-400 border-green-500/30",
        in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        pending: "bg-gray-500/20 text-gray-400 border-gray-500/30"
    };

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Post-Déploiement", href: "PostDeployment" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<Rocket className="w-8 h-8 text-blue-400" />}
                    title="Post-Déploiement"
                    subtitle="Suivi et validation du déploiement système"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Progression Globale
                            </h3>
                            <span className="text-3xl font-bold text-[var(--nea-primary-blue)]">
                                {overallProgress.toFixed(0)}%
                            </span>
                        </div>
                        <Progress value={overallProgress} className="h-3" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                            Déploiement en cours - Phase de validation à venir
                        </p>
                    </div>
                </NeaCard>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="lg:col-span-1">
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)]">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Phases</h3>
                        </div>
                        <div className="divide-y divide-[var(--nea-border-subtle)]">
                            {deploymentSteps.map((phase, index) => {
                                const phaseProgress = phase.tasks.filter(t => t.status === 'completed').length / phase.tasks.length * 100;
                                return (
                                    <div
                                        key={index}
                                        className={`p-4 cursor-pointer hover:bg-[var(--nea-bg-surface-hover)] transition-colors ${
                                            selectedPhase === phase ? 'bg-[var(--nea-bg-surface-hover)] border-l-4 border-blue-500' : ''
                                        }`}
                                        onClick={() => setSelectedPhase(phase)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-gray-900 dark:text-white">{phase.phase}</h4>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                {phaseProgress.toFixed(0)}%
                                            </span>
                                        </div>
                                        <Progress value={phaseProgress} className="h-2" />
                                    </div>
                                );
                            })}
                        </div>
                    </NeaCard>
                </motion.div>

                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)]">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {selectedPhase.phase}
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {selectedPhase.tasks.map((task, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-[var(--nea-bg-surface-hover)] rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        {task.status === 'completed' && (
                                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                                        )}
                                        {task.status === 'in_progress' && (
                                            <AlertCircle className="w-5 h-5 text-yellow-400 animate-pulse" />
                                        )}
                                        {task.status === 'pending' && (
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                                        )}
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {task.name}
                                        </span>
                                    </div>
                                    <Badge className={statusColors[task.status]}>
                                        {task.status === 'completed' && 'Terminé'}
                                        {task.status === 'in_progress' && 'En cours'}
                                        {task.status === 'pending' && 'En attente'}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </NeaCard>
                </motion.div>
            </div>
        </motion.div>
    );
}