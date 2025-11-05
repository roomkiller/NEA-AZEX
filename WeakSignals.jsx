import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Eye, Radio, Search, Filter, Clock, TrendingUp } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { formatDate, formatPercentage } from '../components/utils/NumberFormatter';
import StatsCard from '../components/ui/StatsCard';

export default function WeakSignals() {
    const [signals, setSignals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        const loadSignals = async () => {
            try {
                const data = await base44.entities.MediaSignal.list('-relevance_score');
                setSignals(data);
            } catch (error) {
                console.error("Erreur chargement signaux:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSignals();
    }, []);

    const stats = useMemo(() => ({
        total: signals.length,
        highRelevance: signals.filter(s => s.relevance_score >= 80).length,
        mediumRelevance: signals.filter(s => s.relevance_score >= 60 && s.relevance_score < 80).length,
        critical: signals.filter(s => s.priority_level === 'Critique').length,
        highPriority: signals.filter(s => s.priority_level === 'Élevé').length
    }), [signals]);

    const filteredSignals = useMemo(() => {
        return signals.filter(signal => {
            const matchesSearch = signal.signal_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                signal.content_summary?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || signal.signal_type === filterType;
            const matchesPriority = filterPriority === 'all' || signal.priority_level === filterPriority;
            return matchesSearch && matchesType && matchesPriority;
        });
    }, [signals, searchTerm, filterType, filterPriority]);

    if (isLoading) {
        return <LoadingTransition message="Chargement des signaux faibles..." />;
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
                    { name: "Analyse" },
                    { name: "Signaux Faibles", href: "WeakSignals" }
                ]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Eye className="w-8 h-8 text-orange-400" />}
                    title="Signaux Faibles"
                    subtitle="Détection précoce d'anomalies et tendances émergentes"
                />
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Signaux"
                        value={stats.total}
                        icon={Radio}
                        iconColor="text-orange-400"
                        iconBg="from-orange-500/20 to-orange-600/30"
                        borderColor="border-orange-500/30"
                        valueColor="text-orange-400"
                        subtitle="détectés"
                        size="default"
                    />

                    <StatsCard
                        title="Haute Pertinence"
                        value={stats.highRelevance}
                        icon={TrendingUp}
                        iconColor="text-red-400"
                        iconBg="from-red-500/20 to-red-600/30"
                        borderColor="border-red-500/30"
                        valueColor="text-red-400"
                        badge="≥80%"
                        badgeColor="bg-red-500/20 text-red-400"
                        size="default"
                    />

                    <StatsCard
                        title="Priorité Critique"
                        value={stats.critical}
                        icon={Eye}
                        iconColor="text-purple-400"
                        iconBg="from-purple-500/20 to-purple-600/30"
                        borderColor="border-purple-500/30"
                        valueColor="text-purple-400"
                        subtitle="urgent"
                        size="default"
                    />

                    <StatsCard
                        title="Priorité Élevée"
                        value={stats.highPriority}
                        icon={Eye}
                        iconColor="text-yellow-400"
                        iconBg="from-yellow-500/20 to-yellow-600/30"
                        borderColor="border-yellow-500/30"
                        valueColor="text-yellow-400"
                        subtitle="important"
                        size="default"
                    />
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div variants={itemVariants}>
                <NeaCard className="p-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--nea-text-secondary)]" />
                            <Input
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-[var(--nea-bg-surface-hover)]"
                            />
                        </div>

                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="bg-[var(--nea-bg-surface-hover)]">
                                <SelectValue placeholder="Type de signal" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les types</SelectItem>
                                <SelectItem value="OSINT">OSINT</SelectItem>
                                <SelectItem value="Social_Media">Réseaux sociaux</SelectItem>
                                <SelectItem value="Dark_Web">Dark Web</SelectItem>
                                <SelectItem value="Anomalie_Statistique">Anomalie statistique</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filterPriority} onValueChange={setFilterPriority}>
                            <SelectTrigger className="bg-[var(--nea-bg-surface-hover)]">
                                <SelectValue placeholder="Priorité" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les priorités</SelectItem>
                                <SelectItem value="Critique">Critique</SelectItem>
                                <SelectItem value="Élevé">Élevé</SelectItem>
                                <SelectItem value="Moyen">Moyen</SelectItem>
                                <SelectItem value="Bas">Bas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </NeaCard>
            </motion.div>

            {/* Signals List */}
            <motion.div variants={itemVariants} className="space-y-4">
                {filteredSignals.length === 0 ? (
                    <NeaCard className="p-12 text-center">
                        <Eye className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                            Aucun signal ne correspond aux filtres
                        </p>
                    </NeaCard>
                ) : (
                    filteredSignals.map((signal, index) => (
                        <motion.div
                            key={signal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                        >
                            <NeaCard className="p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-xl font-bold text-[var(--nea-text-title)]">
                                                {signal.signal_title}
                                            </h3>
                                            <Badge className="bg-orange-500/20 text-orange-400 border-0">
                                                {signal.signal_type}
                                            </Badge>
                                        </div>
                                        <p className="text-[var(--nea-text-secondary)]">
                                            {signal.content_summary}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-4 gap-4">
                                    <div className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]">
                                        <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Pertinence</p>
                                        <p className={`text-2xl font-bold ${
                                            signal.relevance_score >= 80 ? 'text-orange-400' :
                                            signal.relevance_score >= 60 ? 'text-yellow-400' :
                                            'text-gray-400'
                                        }`}>
                                            {formatPercentage(signal.relevance_score, { decimals: 0 })}
                                        </p>
                                    </div>

                                    <div className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]">
                                        <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Priorité</p>
                                        <Badge className={`border-0 ${
                                            signal.priority_level === 'Critique' ? 'bg-red-500/20 text-red-400' :
                                            signal.priority_level === 'Élevé' ? 'bg-orange-500/20 text-orange-400' :
                                            signal.priority_level === 'Moyen' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {signal.priority_level}
                                        </Badge>
                                    </div>

                                    <div className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]">
                                        <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Source</p>
                                        <p className="text-sm font-medium text-[var(--nea-text-primary)]">
                                            {signal.source_platform}
                                        </p>
                                    </div>

                                    <div className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]">
                                        <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Détection</p>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-400" />
                                            <p className="text-sm font-medium text-[var(--nea-text-primary)]">
                                                {formatDate(signal.detection_timestamp, 'datetime')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </NeaCard>
                        </motion.div>
                    ))
                )}
            </motion.div>
        </motion.div>
    );
}