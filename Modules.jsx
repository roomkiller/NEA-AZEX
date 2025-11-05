import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Grid3x3, Search, Filter, Plus, RefreshCw, Settings } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { toast } from 'sonner';
import ModuleCard from '../components/modules/ModuleCard';
import ModuleDetailsModal from '../components/modules/ModuleDetailsModal';
import ModuleAnalysisPanel from '../components/modules/ModuleAnalysisPanel';
import CreateModuleModal from '../components/modules/CreateModuleModal';

export default function Modules() {
    const [modules, setModules] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedModule, setSelectedModule] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        loadModules();
    }, []);

    const loadModules = async () => {
        setIsLoading(true);
        try {
            const data = await base44.entities.Module.list();
            setModules(data);
        } catch (error) {
            console.error("Erreur chargement modules:", error);
            toast.error("Échec du chargement des modules");
        } finally {
            setIsLoading(false);
        }
    };

    const handleModuleAction = async (action, module) => {
        try {
            let newStatus = module.status;
            
            switch(action) {
                case 'activate':
                    newStatus = 'Active';
                    break;
                case 'deactivate':
                    newStatus = 'Disabled';
                    break;
                case 'pause':
                    newStatus = 'Standby';
                    break;
                case 'test':
                    newStatus = 'Testing';
                    break;
            }

            await base44.entities.Module.update(module.id, {
                ...module,
                status: newStatus,
                last_audit: new Date().toISOString()
            });

            toast.success(`Module ${module.name} - ${action === 'activate' ? 'activé' : action === 'deactivate' ? 'désactivé' : action === 'pause' ? 'mis en pause' : 'en test'}`);
            await loadModules();
        } catch (error) {
            console.error(`Erreur ${action}:`, error);
            toast.error(`Échec de l'action: ${action}`);
        }
    };

    const handleViewDetails = (module) => {
        setSelectedModule(module);
        setShowDetailsModal(true);
    };

    const handleUpdateModule = async (moduleId, updates) => {
        try {
            await base44.entities.Module.update(moduleId, updates);
            toast.success("Module mis à jour avec succès");
            await loadModules();
            setShowDetailsModal(false);
        } catch (error) {
            console.error("Erreur mise à jour:", error);
            toast.error("Échec de la mise à jour");
        }
    };

    const handleCreateModule = async (moduleData) => {
        try {
            await base44.entities.Module.create({
                ...moduleData,
                last_audit: new Date().toISOString()
            });
            toast.success("Module créé avec succès");
            await loadModules();
            setShowCreateModal(false);
        } catch (error) {
            console.error("Erreur création:", error);
            toast.error("Échec de la création");
        }
    };

    const filteredModules = useMemo(() => {
        let filtered = modules;

        if (searchTerm) {
            filtered = filtered.filter(m =>
                m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterCategory !== 'all') {
            filtered = filtered.filter(m => m.category === filterCategory);
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(m => m.status === filterStatus);
        }

        return filtered;
    }, [modules, searchTerm, filterCategory, filterStatus]);

    const stats = useMemo(() => ({
        total: modules.length,
        active: modules.filter(m => m.status === 'Active').length,
        standby: modules.filter(m => m.status === 'Standby').length,
        testing: modules.filter(m => m.status === 'Testing').length,
        disabled: modules.filter(m => m.status === 'Disabled').length
    }), [modules]);

    if (isLoading) {
        return <LoadingTransition message="Chargement des modules..." />;
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[
                    { name: "Système" },
                    { name: "Modules", href: "Modules" }
                ]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Grid3x3 className="w-8 h-8 text-cyan-400" />}
                    title="Modules Système"
                    subtitle="Gestion et surveillance des modules NEA-AZEX"
                    actions={
                        <div className="flex gap-2">
                            <NeaButton
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowAnalysis(!showAnalysis)}
                            >
                                <Settings className="w-4 h-4 mr-2" />
                                Analyse
                            </NeaButton>
                            <NeaButton
                                variant="outline"
                                size="sm"
                                onClick={loadModules}
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Actualiser
                            </NeaButton>
                            <NeaButton
                                size="sm"
                                onClick={() => setShowCreateModal(true)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Nouveau Module
                            </NeaButton>
                        </div>
                    }
                />
            </motion.div>

            <motion.div variants={itemVariants} className="grid md:grid-cols-5 gap-4">
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total</p>
                    <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
                </NeaCard>
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Actifs</p>
                    <p className="text-3xl font-bold text-green-400">{stats.active}</p>
                </NeaCard>
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">En Pause</p>
                    <p className="text-3xl font-bold text-yellow-400">{stats.standby}</p>
                </NeaCard>
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">En Test</p>
                    <p className="text-3xl font-bold text-orange-400">{stats.testing}</p>
                </NeaCard>
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Désactivés</p>
                    <p className="text-3xl font-bold text-red-400">{stats.disabled}</p>
                </NeaCard>
            </motion.div>

            {showAnalysis && (
                <motion.div variants={itemVariants}>
                    <ModuleAnalysisPanel modules={modules} />
                </motion.div>
            )}

            <motion.div variants={itemVariants}>
                <NeaCard className="p-6">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--nea-text-secondary)]" />
                            <Input
                                placeholder="Rechercher un module..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les catégories</SelectItem>
                                <SelectItem value="GÉOPOLITIQUE">Géopolitique</SelectItem>
                                <SelectItem value="NUCLÉAIRE">Nucléaire</SelectItem>
                                <SelectItem value="CLIMAT">Climat</SelectItem>
                                <SelectItem value="BIOLOGIE">Biologie</SelectItem>
                                <SelectItem value="CYBERNÉTIQUE">Cybernétique</SelectItem>
                                <SelectItem value="SUPERVISION">Supervision</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                <SelectItem value="Active">Actif</SelectItem>
                                <SelectItem value="Standby">En pause</SelectItem>
                                <SelectItem value="Testing">En test</SelectItem>
                                <SelectItem value="Disabled">Désactivé</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </NeaCard>
            </motion.div>

            <motion.div variants={itemVariants}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredModules.map((module, index) => (
                        <ModuleCard
                            key={module.id}
                            module={module}
                            index={index}
                            onAction={handleModuleAction}
                            onViewDetails={handleViewDetails}
                        />
                    ))}
                </div>

                {filteredModules.length === 0 && (
                    <NeaCard className="p-12 text-center">
                        <Filter className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Aucun module trouvé
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Essayez de modifier vos filtres ou créez un nouveau module
                        </p>
                    </NeaCard>
                )}
            </motion.div>

            {/* Module Details Modal */}
            {showDetailsModal && selectedModule && (
                <ModuleDetailsModal
                    module={selectedModule}
                    modules={modules}
                    onClose={() => setShowDetailsModal(false)}
                    onUpdate={handleUpdateModule}
                    onAction={handleModuleAction}
                />
            )}

            {/* Create Module Modal */}
            {showCreateModal && (
                <CreateModuleModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateModule}
                />
            )}
        </motion.div>
    );
}