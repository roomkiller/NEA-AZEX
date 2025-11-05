
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ShieldAlert, Plus, MapPin, Users, AlertTriangle } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import CrisisCard from '../components/crisis/CrisisCard';
import AddCrisisModal from '../components/crisis/AddCrisisModal';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';

export default function CrisisManager() {
    const [simulations, setSimulations] = useState([]);
    const [resourcePoints, setResourcePoints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [simsData, resourcesData] = await Promise.all([
                base44.entities.CrisisSimulation.list('-start_date'),
                base44.entities.ResourcePoint.list()
            ]);
            setSimulations(simsData);
            setResourcePoints(resourcesData);
        } catch (error) {
            console.error("Erreur chargement données crises:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = {
        total: simulations.length,
        active: simulations.filter(s => s.status === 'En cours').length,
        planned: simulations.filter(s => s.status === 'Planifiée').length,
        resolved: simulations.filter(s => s.status === 'Résolue').length,
        totalAffected: simulations.reduce((sum, s) => sum + (s.affected_population || 0), 0),
        totalDisplaced: simulations.reduce((sum, s) => sum + (s.displaced_population || 0), 0),
        resourcePoints: resourcePoints.length,
        operationalResources: resourcePoints.filter(r => r.status === 'Opérationnel').length
    };

    if (isLoading) {
        return <LoadingTransition message="Chargement du gestionnaire de crises..." />;
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Gestionnaire de Crises", href: "CrisisManager" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<ShieldAlert className="w-8 h-8 text-red-400" />}
                    title="Gestionnaire de Crises"
                    subtitle="Simulation et gestion des situations d'urgence"
                    actions={
                        <NeaButton onClick={() => setShowAddModal(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvelle Simulation
                        </NeaButton>
                    }
                />
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldAlert className="w-5 h-5 text-red-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Simulations Totales</p>
                    </div>
                    <p className="text-3xl font-bold text-red-400">{stats.total}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">En Cours</p>
                    </div>
                    <p className="text-3xl font-bold text-orange-400">{stats.active}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Population Affectée</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">
                        {(stats.totalAffected / 1000000).toFixed(1)}M
                    </p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <MapPin className="w-5 h-5 text-green-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Points de Ressources</p>
                    </div>
                    <p className="text-3xl font-bold text-green-400">{stats.resourcePoints}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {stats.operationalResources} opérationnels
                    </p>
                </NeaCard>
            </motion.div>

            {/* Statistiques Détaillées */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                            Vue d'Ensemble des Crises
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-4 gap-6">
                            <div className="text-center p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                                <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-orange-400">{stats.active}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">En Cours</p>
                            </div>

                            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <ShieldAlert className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-blue-400">{stats.planned}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Planifiées</p>
                            </div>

                            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                                <ShieldAlert className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Résolues</p>
                            </div>

                            <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-purple-400">
                                    {(stats.totalDisplaced / 1000000).toFixed(1)}M
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Déplacés</p>
                            </div>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>

            {/* Liste des Simulations */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 dark:text-white">
                                Simulations de Crises
                            </h3>
                            <Badge className="bg-red-500/20 text-red-400 border-0">
                                {simulations.length} simulations
                            </Badge>
                        </div>
                    </div>
                    <div className="p-6">
                        {simulations.length === 0 ? (
                            <div className="text-center py-12">
                                <ShieldAlert className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Aucune simulation active
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Créez une nouvelle simulation de crise pour commencer
                                </p>
                                <NeaButton onClick={() => setShowAddModal(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Créer une Simulation
                                </NeaButton>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                                {simulations.map((simulation, index) => (
                                    <CrisisCard
                                        key={simulation.id}
                                        crisis={simulation}
                                        index={index}
                                        onRefresh={loadData}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </NeaCard>
            </motion.div>

            {/* Points de Ressources */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-green-400" />
                                Points de Ressources d'Urgence
                            </h3>
                            <Badge className="bg-green-500/20 text-green-400 border-0">
                                {stats.operationalResources}/{stats.resourcePoints} opérationnels
                            </Badge>
                        </div>
                    </div>
                    <div className="p-6">
                        {resourcePoints.length === 0 ? (
                            <div className="text-center py-12">
                                <MapPin className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">
                                    Aucun point de ressource configuré
                                </p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {resourcePoints.map((resource, index) => (
                                    <motion.div
                                        key={resource.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <NeaCard className="p-4 hover:border-[var(--nea-primary-blue)] transition-all">
                                            <div className="mb-3">
                                                <h4 className="font-semibold text-[var(--nea-text-title)] mb-1 text-sm">
                                                    {resource.resource_name}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-[var(--nea-primary-blue)]/10 text-[var(--nea-primary-blue)] border-0 text-xs">
                                                        {resource.resource_type}
                                                    </Badge>
                                                    <Badge className={`border-0 text-xs ${
                                                        resource.status === 'Opérationnel' ? 'bg-green-500/20 text-green-400' :
                                                        resource.status === 'Capacité limitée' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        resource.status === 'Saturé' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                        {resource.status}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {resource.capacity && resource.current_stock && (
                                                <div className="space-y-2 text-xs">
                                                    {resource.capacity.water_liters > 0 && (
                                                        <div>
                                                            <div className="flex justify-between mb-1">
                                                                <span className="text-[var(--nea-text-secondary)]">Eau</span>
                                                                <span className="text-[var(--nea-text-primary)]">
                                                                    {(resource.current_stock.water_liters / 1000).toFixed(0)}/{(resource.capacity.water_liters / 1000).toFixed(0)}K L
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {resource.capacity.food_rations > 0 && (
                                                        <div>
                                                            <div className="flex justify-between mb-1">
                                                                <span className="text-[var(--nea-text-secondary)]">Rations</span>
                                                                <span className="text-[var(--nea-text-primary)]">
                                                                    {resource.current_stock.food_rations}/{resource.capacity.food_rations}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {resource.capacity.people_capacity > 0 && (
                                                        <div>
                                                            <div className="flex justify-between mb-1">
                                                                <span className="text-[var(--nea-text-secondary)]">Occupation</span>
                                                                <span className="text-[var(--nea-text-primary)]">
                                                                    {resource.current_stock.occupied_spots}/{resource.capacity.people_capacity}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="mt-3 pt-3 border-t border-[var(--nea-border-subtle)] text-xs">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[var(--nea-text-secondary)]">Accès:</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {resource.access_level}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </NeaCard>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </NeaCard>
            </motion.div>

            {/* Detailed Simulations List (Unchanged from original) */}
            <motion.div variants={itemVariants}>
                {simulations.length === 0 ? (
                    <NeaCard className="p-12">
                        <div className="text-center">
                            <ShieldAlert className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Aucune simulation de crise
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Créez votre première simulation pour commencer
                            </p>
                            <NeaButton onClick={() => setShowAddModal(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Créer une Simulation
                            </NeaButton>
                        </div>
                    </NeaCard>
                ) : (
                    <div className="space-y-4">
                        {simulations.map((simulation, index) => (
                            <motion.div
                                key={simulation.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <NeaCard className="p-6 hover:border-[var(--nea-primary-blue)] transition-all">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-[var(--nea-text-title)] mb-2">
                                                {simulation.simulation_name}
                                            </h3>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge className="bg-[var(--nea-primary-blue)]/10 text-[var(--nea-primary-blue)] border-0">
                                                    {simulation.crisis_type}
                                                </Badge>
                                                <Badge className={`border-0 ${
                                                    simulation.status === 'En cours' ? 'bg-orange-500/20 text-orange-400' :
                                                    simulation.status === 'Planifiée' ? 'bg-blue-500/20 text-blue-400' :
                                                    simulation.status === 'Résolue' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                    {simulation.status}
                                                </Badge>
                                                <Badge className={`border-0 ${
                                                    simulation.severity_level === 'Catastrophique' ? 'bg-red-500/20 text-red-400' :
                                                    simulation.severity_level === 'Critique' ? 'bg-orange-500/20 text-orange-400' :
                                                    simulation.severity_level === 'Élevé' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                    {simulation.severity_level}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Localisation</p>
                                            <p className="text-sm font-semibold text-[var(--nea-text-primary)]">
                                                {simulation.location?.region}, {simulation.location?.country}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Population Affectée</p>
                                            <p className="text-sm font-semibold text-blue-400">
                                                {(simulation.affected_population / 1000000).toFixed(2)}M
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Déplacés</p>
                                            <p className="text-sm font-semibold text-orange-400">
                                                {(simulation.displaced_population / 1000).toFixed(0)}K
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Période</p>
                                            <p className="text-sm font-semibold text-[var(--nea-text-primary)]">
                                                {new Date(simulation.start_date).toLocaleDateString('fr-CA')}
                                            </p>
                                        </div>
                                    </div>

                                    {simulation.notes && (
                                        <div className="pt-4 border-t border-[var(--nea-border-subtle)]">
                                            <p className="text-sm text-[var(--nea-text-secondary)] italic">
                                                {simulation.notes}
                                            </p>
                                        </div>
                                    )}
                                </NeaCard>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {showAddModal && (
                <AddCrisisModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        loadData();
                        setShowAddModal(false);
                    }}
                />
            )}
        </motion.div>
    );
}
