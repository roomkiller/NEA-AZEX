import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Bot, Plus, Filter, Search, Activity, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MacroCard from '../components/macros/MacroCard';
import MacroEditorModal from '../components/macros/MacroEditorModal';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';

export default function BotMacroManager() {
    const [macros, setMacros] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterTrigger, setFilterTrigger] = useState('all');
    const [showEditorModal, setShowEditorModal] = useState(false);
    const [editingMacro, setEditingMacro] = useState(null);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        loadMacros();
    }, []);

    const loadMacros = async () => {
        try {
            const data = await base44.entities.BotMacro.list('-created_date');
            setMacros(data);
        } catch (error) {
            console.error("Erreur chargement macros:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredMacros = useMemo(() => {
        return macros.filter(macro => {
            const matchesSearch = macro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                macro.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || macro.status === filterStatus;
            const matchesTrigger = filterTrigger === 'all' || macro.trigger_type === filterTrigger;
            
            return matchesSearch && matchesStatus && matchesTrigger;
        });
    }, [macros, searchTerm, filterStatus, filterTrigger]);

    const stats = useMemo(() => ({
        total: macros.length,
        active: macros.filter(m => m.status === 'Active').length,
        draft: macros.filter(m => m.status === 'Draft').length,
        disabled: macros.filter(m => m.status === 'Disabled').length,
        successfulRuns: macros.reduce((sum, m) => 
            sum + (m.execution_history?.filter(h => h.status === 'Success').length || 0), 0
        ),
        failedRuns: macros.reduce((sum, m) => 
            sum + (m.execution_history?.filter(h => h.status === 'Failed').length || 0), 0
        )
    }), [macros]);

    const handleEdit = (macro) => {
        setEditingMacro(macro);
        setShowEditorModal(true);
    };

    const handleCreate = () => {
        setEditingMacro(null);
        setShowEditorModal(true);
    };

    if (isLoading) {
        return <LoadingTransition message="Chargement du gestionnaire de macros..." />;
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Gestionnaire de Macros", href: "BotMacroManager" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Bot className="w-8 h-8 text-cyan-400" />}
                    title="Gestionnaire de Macros"
                    subtitle="Automatisation et orchestration des tâches système"
                    actions={
                        <NeaButton onClick={handleCreate}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvelle Macro
                        </NeaButton>
                    }
                />
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Bot className="w-5 h-5 text-cyan-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Macros Totales</p>
                    </div>
                    <p className="text-3xl font-bold text-cyan-400">{stats.total}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-5 h-5 text-green-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Actives</p>
                    </div>
                    <p className="text-3xl font-bold text-green-400">{stats.active}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-5 h-5 text-yellow-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Brouillons</p>
                    </div>
                    <p className="text-3xl font-bold text-yellow-400">{stats.draft}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-5 h-5 text-gray-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Désactivées</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-400">{stats.disabled}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Succès</p>
                    </div>
                    <p className="text-3xl font-bold text-green-400">{stats.successfulRuns}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Échecs</p>
                    </div>
                    <p className="text-3xl font-bold text-red-400">{stats.failedRuns}</p>
                </NeaCard>
            </motion.div>

            {/* Filtres */}
            <motion.div variants={itemVariants}>
                <NeaCard className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-[var(--nea-primary-blue)]" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Filtres et Recherche</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Rechercher une macro..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Draft">Brouillon</SelectItem>
                                <SelectItem value="Disabled">Désactivée</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filterTrigger} onValueChange={setFilterTrigger}>
                            <SelectTrigger>
                                <SelectValue placeholder="Déclencheur" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les déclencheurs</SelectItem>
                                <SelectItem value="Manual">Manuel</SelectItem>
                                <SelectItem value="Scheduled">Planifié</SelectItem>
                                <SelectItem value="Webhook">Webhook</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {(searchTerm || filterStatus !== 'all' || filterTrigger !== 'all') && (
                        <div className="mt-3">
                            <Badge className="bg-[var(--nea-primary-blue)]/10 text-[var(--nea-primary-blue)] border-0">
                                {filteredMacros.length} résultat{filteredMacros.length > 1 ? 's' : ''}
                            </Badge>
                        </div>
                    )}
                </NeaCard>
            </motion.div>

            {/* Liste des Macros */}
            <motion.div variants={itemVariants}>
                {filteredMacros.length === 0 ? (
                    <NeaCard className="p-12">
                        <div className="text-center">
                            <Bot className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Aucune macro trouvée
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {searchTerm ? "Essayez de modifier vos filtres" : "Créez votre première macro d'automatisation"}
                            </p>
                            <NeaButton onClick={handleCreate}>
                                <Plus className="w-4 h-4 mr-2" />
                                Créer une Macro
                            </NeaButton>
                        </div>
                    </NeaCard>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {filteredMacros.map((macro, index) => (
                            <MacroCard
                                key={macro.id}
                                macro={macro}
                                index={index}
                                onEdit={handleEdit}
                                onRefresh={loadMacros}
                            />
                        ))}
                    </div>
                )}
            </motion.div>

            {showEditorModal && (
                <MacroEditorModal
                    macro={editingMacro}
                    onClose={() => {
                        setShowEditorModal(false);
                        setEditingMacro(null);
                    }}
                    onSuccess={() => {
                        loadMacros();
                        setShowEditorModal(false);
                        setEditingMacro(null);
                    }}
                />
            )}
        </motion.div>
    );
}