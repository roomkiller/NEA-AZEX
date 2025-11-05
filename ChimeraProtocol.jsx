import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Ghost, Shield, Activity, Brain } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import ChimeraStatus from '../components/chimera/ChimeraStatus';
import AttackerActivityFeed from '../components/chimera/AttackerActivityFeed';
import IntelligenceBrief from '../components/chimera/IntelligenceBrief';
import AttackerProfile from '../components/chimera/AttackerProfile';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';

export default function ChimeraProtocol() {
    const [chimeraSystems, setChimeraSystems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        loadData();
        
        // Auto-refresh toutes les 10 secondes pour activité temps réel
        const interval = setInterval(loadData, 10000);
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        try {
            const data = await base44.entities.ChimeraSystem.list('-deployment_timestamp');
            setChimeraSystems(data);
        } catch (error) {
            console.error("Erreur chargement Chimère:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = {
        total: chimeraSystems.length,
        active: chimeraSystems.filter(s => s.status === 'Active').length,
        deploying: chimeraSystems.filter(s => s.status === 'Deploying').length,
        totalDecoyPages: chimeraSystems.reduce((sum, s) => sum + (s.decoy_pages_generated || 0), 0),
        echoChamberActive: chimeraSystems.filter(s => s.echo_chamber_active).length
    };

    if (isLoading) {
        return <LoadingTransition message="Initialisation Protocole Chimère..." />;
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Protocole Chimère", href: "ChimeraProtocol" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Ghost className="w-8 h-8 text-purple-400" />}
                    title="Protocole Chimère"
                    subtitle="Système de leurre offensif et intelligence adversariale"
                />
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-5 gap-4">
                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Ghost className="w-5 h-5 text-purple-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Systèmes Chimère</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-400">{stats.total}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-5 h-5 text-green-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Actifs</p>
                    </div>
                    <p className="text-3xl font-bold text-green-400">{stats.active}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-5 h-5 text-yellow-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">En Déploiement</p>
                    </div>
                    <p className="text-3xl font-bold text-yellow-400">{stats.deploying}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-cyan-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pages Leurres</p>
                    </div>
                    <p className="text-3xl font-bold text-cyan-400">{stats.totalDecoyPages}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Brain className="w-5 h-5 text-pink-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Labyrinthes Actifs</p>
                    </div>
                    <p className="text-3xl font-bold text-pink-400">{stats.echoChamberActive}</p>
                </NeaCard>
            </motion.div>

            {/* Description Protocole */}
            <motion.div variants={itemVariants}>
                <NeaCard className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
                    <div className="flex items-start gap-4">
                        <Ghost className="w-12 h-12 text-purple-400 flex-shrink-0" />
                        <div>
                            <h3 className="text-xl font-bold text-[var(--nea-text-title)] mb-2">
                                Protocole Chimère - Intelligence Défensive Active
                            </h3>
                            <p className="text-[var(--nea-text-primary)] mb-3">
                                Système avancé de honeypot adaptatif qui piège les attaquants dans des environnements 
                                contrôlés pour collecter leur TTPs (Tactics, Techniques, Procedures) et générer des 
                                contre-mesures automatisées.
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge className="bg-purple-500/20 text-purple-400 border-0">
                                    v1: Passif (Observation)
                                </Badge>
                                <Badge className="bg-pink-500/20 text-pink-400 border-0">
                                    v2: Némésis (Manipulation Active)
                                </Badge>
                                <Badge className="bg-cyan-500/20 text-cyan-400 border-0">
                                    Labyrinthe d'Échos
                                </Badge>
                            </div>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>

            {/* Systèmes Actifs */}
            {chimeraSystems.length === 0 ? (
                <motion.div variants={itemVariants}>
                    <NeaCard className="p-12">
                        <div className="text-center">
                            <Ghost className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Aucun Système Chimère Actif
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Les honeypots seront déployés automatiquement lors de la détection d'intrusions
                            </p>
                        </div>
                    </NeaCard>
                </motion.div>
            ) : (
                chimeraSystems.map((system, index) => (
                    <motion.div
                        key={system.id}
                        variants={itemVariants}
                        className="space-y-4"
                    >
                        {/* Statut Principal */}
                        <ChimeraStatus system={system} />

                        <div className="grid lg:grid-cols-2 gap-4">
                            {/* Activité Attaquant */}
                            <AttackerActivityFeed system={system} />

                            {/* Profil Attaquant */}
                            <AttackerProfile system={system} />
                        </div>

                        {/* Brief Intelligence */}
                        <IntelligenceBrief system={system} />
                    </motion.div>
                ))
            )}
        </motion.div>
    );
}