import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { History, Search, RefreshCw, Filter } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { toast } from 'sonner';

export default function UserActivityLog() {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [eventTypeFilter, setEventTypeFilter] = useState('all');
    const { containerVariants, itemVariants } = useStaggerAnimation();

    const loadLogs = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await base44.entities.TelemetryLog.list('-timestamp', 100);
            setLogs(data);
        } catch (error) {
            console.error("Erreur chargement logs:", error);
            toast.error("Échec du chargement");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.module_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.event_action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.created_by?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = eventTypeFilter === 'all' || log.event_type === eventTypeFilter;
        return matchesSearch && matchesType;
    });

    const eventTypes = [...new Set(logs.map(l => l.event_type).filter(Boolean))].sort();

    const stats = {
        total: logs.length,
        pageViews: logs.filter(l => l.event_type === 'page_view').length,
        interactions: logs.filter(l => l.event_type === 'interaction').length,
        errors: logs.filter(l => l.event_type === 'error').length
    };

    const eventTypeColors = {
        'page_view': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'interaction': 'bg-green-500/20 text-green-400 border-green-500/30',
        'error': 'bg-red-500/20 text-red-400 border-red-500/30',
        'search': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        'filter': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        'export': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        'api_call': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'performance': 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    };

    if (isLoading) {
        return <LoadingTransition message="Chargement du journal d'activité..." />;
    }

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Journal d'Activité", href: "UserActivityLog" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<History className="w-8 h-8 text-cyan-400" />}
                    title="Journal d'Activité Utilisateur"
                    subtitle="Historique des actions et événements"
                    actions={
                        <NeaButton onClick={loadLogs}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Actualiser
                        </NeaButton>
                    }
                />
            </motion.div>

            <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Événements</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </NeaCard>
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Vues de Pages</p>
                    <p className="text-3xl font-bold text-blue-400">{stats.pageViews}</p>
                </NeaCard>
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Interactions</p>
                    <p className="text-3xl font-bold text-green-400">{stats.interactions}</p>
                </NeaCard>
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Erreurs</p>
                    <p className="text-3xl font-bold text-red-400">{stats.errors}</p>
                </NeaCard>
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <Input
                                    placeholder="Rechercher dans les logs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white pl-10"
                                />
                            </div>
                            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                                <SelectTrigger className="w-full md:w-48 bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white">
                                    <SelectValue placeholder="Type d'événement" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous types</SelectItem>
                                    {eventTypes.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="divide-y divide-[var(--nea-border-subtle)] max-h-[600px] overflow-y-auto styled-scrollbar">
                        {filteredLogs.map((log, index) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className="p-4 hover:bg-[var(--nea-bg-surface-hover)] transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Badge className={eventTypeColors[log.event_type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                                                {log.event_type}
                                            </Badge>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {log.module_name}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                            {log.event_action}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                                            <span>
                                                {log.created_by}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                {new Date(log.timestamp).toLocaleString('fr-CA')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </NeaCard>
            </motion.div>
        </motion.div>
    );
}