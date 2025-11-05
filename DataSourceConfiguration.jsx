import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Database, Plus, Search, Filter, CheckCircle, AlertCircle, Activity, Globe } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AddDataSourceModal from '../components/datasource/AddDataSourceModal';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { toast } from 'sonner';

const TYPE_ICONS = {
    'API_REST': '🔌',
    'Database': '🗄️',
    'Web_Scraper': '🕷️',
    'File_Feed': '📁',
    'Internal_Stream': '🔄'
};

const TYPE_COLORS = {
    'API_REST': 'text-blue-400',
    'Database': 'text-purple-400',
    'Web_Scraper': 'text-green-400',
    'File_Feed': 'text-yellow-400',
    'Internal_Stream': 'text-cyan-400'
};

export default function DataSourceConfiguration() {
    const [dataSources, setDataSources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        loadDataSources();
    }, []);

    const loadDataSources = async () => {
        try {
            const data = await base44.entities.DataSource.list();
            setDataSources(data);
        } catch (error) {
            console.error("Erreur chargement sources:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredSources = useMemo(() => {
        return dataSources.filter(source => {
            const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                source.endpoint?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || source.type === filterType;
            const matchesStatus = filterStatus === 'all' || source.status === filterStatus;
            
            return matchesSearch && matchesType && matchesStatus;
        });
    }, [dataSources, searchTerm, filterType, filterStatus]);

    const stats = useMemo(() => ({
        total: dataSources.length,
        active: dataSources.filter(s => s.status === 'Active').length,
        inactive: dataSources.filter(s => s.status === 'Inactive').length,
        testing: dataSources.filter(s => s.status === 'Testing').length,
        error: dataSources.filter(s => s.status === 'Error').length,
        successfulConnections: dataSources.filter(s => s.last_connection_status === 'Success').length
    }), [dataSources]);

    const sourceTypes = useMemo(() => {
        return [...new Set(dataSources.map(s => s.type))];
    }, [dataSources]);

    const handleTestConnection = async (source) => {
        toast.info(`Test de connexion en cours pour ${source.name}...`);
        // Simulation du test - dans un vrai système, cela appellerait une API
        setTimeout(() => {
            toast.success(`Connexion réussie à ${source.name}`);
        }, 2000);
    };

    if (isLoading) {
        return <LoadingTransition message="Chargement des sources de données..." />;
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Sources de Données", href: "DataSourceConfiguration" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Database className="w-8 h-8 text-cyan-400" />}
                    title="Configuration des Sources de Données"
                    subtitle="Gestion des connexions et flux de données externes"
                    actions={
                        <NeaButton onClick={() => setShowAddModal(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter Source
                        </NeaButton>
                    }
                />
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-5 gap-4">
                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Database className="w-5 h-5 text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sources Totales</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Actives</p>
                    </div>
                    <p className="text-3xl font-bold text-green-400">{stats.active}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-5 h-5 text-yellow-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">En Test</p>
                    </div>
                    <p className="text-3xl font-bold text-yellow-400">{stats.testing}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Erreurs</p>
                    </div>
                    <p className="text-3xl font-bold text-red-400">{stats.error}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Globe className="w-5 h-5 text-purple-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Connexions OK</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-400">{stats.successfulConnections}</p>
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
                                placeholder="Rechercher une source..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les types</SelectItem>
                                {sourceTypes.map(type => (
                                    <SelectItem key={type} value={type}>
                                        {TYPE_ICONS[type]} {type.replace(/_/g, ' ')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                                <SelectItem value="Testing">Testing</SelectItem>
                                <SelectItem value="Error">Error</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {(searchTerm || filterType !== 'all' || filterStatus !== 'all') && (
                        <div className="mt-3">
                            <Badge className="bg-[var(--nea-primary-blue)]/10 text-[var(--nea-primary-blue)] border-0">
                                {filteredSources.length} résultat{filteredSources.length > 1 ? 's' : ''}
                            </Badge>
                        </div>
                    )}
                </NeaCard>
            </motion.div>

            {/* Liste des Sources */}
            <motion.div variants={itemVariants}>
                {filteredSources.length === 0 ? (
                    <NeaCard className="p-12">
                        <div className="text-center">
                            <Database className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Aucune source trouvée
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {searchTerm ? "Essayez de modifier vos filtres" : "Configurez votre première source de données"}
                            </p>
                            <NeaButton onClick={() => setShowAddModal(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Ajouter une Source
                            </NeaButton>
                        </div>
                    </NeaCard>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSources.map((source, index) => (
                            <motion.div
                                key={source.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <NeaCard className="p-5 h-full hover:border-[var(--nea-primary-blue)] transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{TYPE_ICONS[source.type]}</span>
                                            <Badge className={`${TYPE_COLORS[source.type]} bg-transparent border border-current text-xs`}>
                                                {source.type.replace(/_/g, ' ')}
                                            </Badge>
                                        </div>
                                        <Badge className={`border-0 text-xs ${
                                            source.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                                            source.status === 'Testing' ? 'bg-yellow-500/20 text-yellow-400' :
                                            source.status === 'Error' ? 'bg-red-500/20 text-red-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {source.status}
                                        </Badge>
                                    </div>

                                    <h3 className="text-base font-bold text-[var(--nea-text-title)] mb-2">
                                        {source.name}
                                    </h3>

                                    <div className="p-3 bg-[var(--nea-bg-surface-hover)] rounded-lg border border-[var(--nea-border-subtle)] mb-4">
                                        <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Endpoint:</p>
                                        <p className="text-xs font-mono text-[var(--nea-primary-blue)] break-all">
                                            {source.endpoint}
                                        </p>
                                    </div>

                                    <div className="space-y-2 text-xs">
                                        {source.authentication && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-[var(--nea-text-secondary)]">Auth:</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {source.authentication.auth_type}
                                                </Badge>
                                            </div>
                                        )}
                                        {source.update_frequency_seconds && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-[var(--nea-text-secondary)]">Fréquence:</span>
                                                <span className="font-semibold text-[var(--nea-text-primary)]">
                                                    {source.update_frequency_seconds < 60 
                                                        ? `${source.update_frequency_seconds}s`
                                                        : source.update_frequency_seconds < 3600
                                                            ? `${Math.round(source.update_frequency_seconds / 60)}min`
                                                            : `${Math.round(source.update_frequency_seconds / 3600)}h`
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        {source.assigned_module_id && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-[var(--nea-text-secondary)]">Module:</span>
                                                <Badge className="bg-[var(--nea-primary-blue)]/10 text-[var(--nea-primary-blue)] border-0 text-xs">
                                                    {source.assigned_module_id}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    {source.last_connection_test && (
                                        <div className="mt-4 pt-4 border-t border-[var(--nea-border-subtle)]">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-[var(--nea-text-secondary)]">Dernier test:</span>
                                                <div className="flex items-center gap-2">
                                                    {source.last_connection_status === 'Success' ? (
                                                        <CheckCircle className="w-3 h-3 text-green-400" />
                                                    ) : source.last_connection_status === 'Failed' ? (
                                                        <AlertCircle className="w-3 h-3 text-red-400" />
                                                    ) : (
                                                        <Activity className="w-3 h-3 text-yellow-400" />
                                                    )}
                                                    <span className="font-semibold text-[var(--nea-text-primary)]">
                                                        {new Date(source.last_connection_test).toLocaleTimeString('fr-CA')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {source.error_message && (
                                        <div className="mt-3 p-2 bg-red-500/10 rounded border border-red-500/20">
                                            <p className="text-xs text-red-400">
                                                {source.error_message}
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-4 flex items-center gap-2">
                                        <NeaButton 
                                            variant="secondary" 
                                            size="sm"
                                            className="flex-1 text-xs"
                                            onClick={() => handleTestConnection(source)}
                                        >
                                            Tester Connexion
                                        </NeaButton>
                                    </div>
                                </NeaCard>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {showAddModal && (
                <AddDataSourceModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        loadDataSources();
                        setShowAddModal(false);
                    }}
                />
            )}
        </motion.div>
    );
}