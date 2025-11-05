import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Settings, Filter, Search, Plus, Edit, Trash2 } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ConfigCard from '../components/config/ConfigCard';
import AddConfigModal from '../components/config/AddConfigModal';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { toast } from 'sonner';

const CATEGORY_ICONS = {
    'API': '🔌',
    'Backend': '⚙️',
    'Database': '🗄️',
    'Security': '🔒',
    'Network': '🌐'
};

const CATEGORY_COLORS = {
    'API': 'text-blue-400',
    'Backend': 'text-purple-400',
    'Database': 'text-cyan-400',
    'Security': 'text-red-400',
    'Network': 'text-green-400'
};

export default function Configuration() {
    const [configs, setConfigs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterEnvironment, setFilterEnvironment] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        loadConfigs();
    }, []);

    const loadConfigs = async () => {
        try {
            const data = await base44.entities.Configuration.list();
            setConfigs(data);
        } catch (error) {
            console.error("Erreur chargement configurations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredConfigs = useMemo(() => {
        return configs.filter(config => {
            const matchesSearch = config.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                config.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filterCategory === 'all' || config.category === filterCategory;
            const matchesEnvironment = filterEnvironment === 'all' || config.environment === filterEnvironment;
            
            return matchesSearch && matchesCategory && matchesEnvironment;
        });
    }, [configs, searchTerm, filterCategory, filterEnvironment]);

    const stats = useMemo(() => ({
        total: configs.length,
        active: configs.filter(c => c.is_active === true).length,
        sensitive: configs.filter(c => c.is_sensitive === true).length,
        byCategory: configs.reduce((acc, config) => {
            acc[config.category] = (acc[config.category] || 0) + 1;
            return acc;
        }, {})
    }), [configs]);

    const categories = useMemo(() => {
        return [...new Set(configs.map(c => c.category))];
    }, [configs]);

    const handleDelete = async (id) => {
        try {
            await base44.entities.Configuration.delete(id);
            await loadConfigs();
            toast.success("Configuration supprimée");
        } catch (error) {
            console.error("Erreur suppression:", error);
            toast.error("Échec de la suppression");
        }
    };

    if (isLoading) {
        return <LoadingTransition message="Chargement des configurations..." />;
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Configuration Système", href: "Configuration" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Settings className="w-8 h-8 text-purple-400" />}
                    title="Configuration Système"
                    subtitle="Gestion des paramètres et configurations"
                    actions={
                        <NeaButton onClick={() => setShowAddModal(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter Configuration
                        </NeaButton>
                    }
                />
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Settings className="w-5 h-5 text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Configurations</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Settings className="w-5 h-5 text-green-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Actives</p>
                    </div>
                    <p className="text-3xl font-bold text-green-400">{stats.active}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Settings className="w-5 h-5 text-red-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sensibles</p>
                    </div>
                    <p className="text-3xl font-bold text-red-400">{stats.sensitive}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Settings className="w-5 h-5 text-purple-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Catégories</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-400">{Object.keys(stats.byCategory).length}</p>
                </NeaCard>
            </motion.div>

            {/* Répartition par Catégorie */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                            Répartition par Catégorie
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-5 gap-4">
                            {Object.entries(stats.byCategory).map(([category, count]) => (
                                <div 
                                    key={category}
                                    className="text-center p-4 bg-[var(--nea-bg-surface-hover)] rounded-lg border border-[var(--nea-border-subtle)]"
                                >
                                    <span className="text-3xl mb-2 block">{CATEGORY_ICONS[category]}</span>
                                    <p className="text-2xl font-bold text-[var(--nea-primary-blue)]">{count}</p>
                                    <p className={`text-xs mt-1 ${CATEGORY_COLORS[category]}`}>{category}</p>
                                </div>
                            ))}
                        </div>
                    </div>
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
                                placeholder="Rechercher une clé..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les catégories</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat} value={cat}>
                                        {CATEGORY_ICONS[cat]} {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={filterEnvironment} onValueChange={setFilterEnvironment}>
                            <SelectTrigger>
                                <SelectValue placeholder="Environnement" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les environnements</SelectItem>
                                <SelectItem value="Production">Production</SelectItem>
                                <SelectItem value="Staging">Staging</SelectItem>
                                <SelectItem value="Development">Development</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {(searchTerm || filterCategory !== 'all' || filterEnvironment !== 'all') && (
                        <div className="mt-3">
                            <Badge className="bg-[var(--nea-primary-blue)]/10 text-[var(--nea-primary-blue)] border-0">
                                {filteredConfigs.length} résultat{filteredConfigs.length > 1 ? 's' : ''}
                            </Badge>
                        </div>
                    )}
                </NeaCard>
            </motion.div>

            {/* Liste des Configurations */}
            <motion.div variants={itemVariants}>
                {filteredConfigs.length === 0 ? (
                    <NeaCard className="p-12">
                        <div className="text-center">
                            <Settings className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Aucune configuration trouvée
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Essayez de modifier vos filtres de recherche
                            </p>
                            <NeaButton onClick={() => setShowAddModal(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Créer une Configuration
                            </NeaButton>
                        </div>
                    </NeaCard>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredConfigs.map((config, index) => (
                            <motion.div
                                key={config.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <NeaCard className="p-5 h-full hover:border-[var(--nea-primary-blue)] transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{CATEGORY_ICONS[config.category]}</span>
                                            <Badge className={`${CATEGORY_COLORS[config.category]} bg-transparent border border-current text-xs`}>
                                                {config.category}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {config.is_active && (
                                                <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                                                    Active
                                                </Badge>
                                            )}
                                            {config.is_sensitive && (
                                                <Badge className="bg-red-500/20 text-red-400 border-0 text-xs">
                                                    Sensible
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-base font-bold text-[var(--nea-text-title)] mb-2 font-mono">
                                        {config.key}
                                    </h3>

                                    <p className="text-sm text-[var(--nea-text-secondary)] mb-3">
                                        {config.description}
                                    </p>

                                    <div className="p-3 bg-[var(--nea-bg-surface-hover)] rounded-lg border border-[var(--nea-border-subtle)] mb-4">
                                        <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Valeur:</p>
                                        <p className="text-sm font-mono font-bold text-[var(--nea-primary-blue)]">
                                            {config.is_sensitive ? '••••••••' : config.value}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-[var(--nea-border-subtle)]">
                                        <Badge variant="outline" className="text-xs">
                                            {config.environment}
                                        </Badge>
                                        <div className="flex items-center gap-2">
                                            <NeaButton variant="ghost" size="icon" className="h-8 w-8">
                                                <Edit className="w-3 h-3" />
                                            </NeaButton>
                                            <NeaButton 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-red-400 hover:text-red-300"
                                                onClick={() => handleDelete(config.id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </NeaButton>
                                        </div>
                                    </div>
                                </NeaCard>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {showAddModal && (
                <AddConfigModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        loadConfigs();
                        setShowAddModal(false);
                    }}
                />
            )}
        </motion.div>
    );
}