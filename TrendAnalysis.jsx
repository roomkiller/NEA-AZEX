import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Search, Filter, BarChart } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { formatDate, formatPercentage } from '../components/utils/NumberFormatter';
import StatsCard from '../components/ui/StatsCard';

export default function TrendAnalysis() {
    const [trends, setTrends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDomain, setFilterDomain] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        const loadTrends = async () => {
            try {
                const data = await base44.entities.TrendAnalysis.list('-momentum_score');
                setTrends(data);
            } catch (error) {
                console.error("Erreur chargement tendances:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadTrends();
    }, []);

    const stats = useMemo(() => ({
        total: trends.length,
        active: trends.filter(t => t.status === 'Active').length,
        highMomentum: trends.filter(t => t.momentum_score >= 75).length,
        mediumMomentum: trends.filter(t => t.momentum_score >= 50 && t.momentum_score < 75).length,
        monitoring: trends.filter(t => t.status === 'Monitoring').length
    }), [trends]);

    const filteredTrends = useMemo(() => {
        return trends.filter(trend => {
            const matchesSearch = trend.trend_name?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDomain = filterDomain === 'all' || trend.domain === filterDomain;
            const matchesStatus = filterStatus === 'all' || trend.status === filterStatus;
            return matchesSearch && matchesDomain && matchesStatus;
        });
    }, [trends, searchTerm, filterDomain, filterStatus]);

    if (isLoading) {
        return <LoadingTransition message="Chargement des tendances..." />;
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
                    { name: "Analyse des Tendances", href: "TrendAnalysis" }
                ]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Activity className="w-8 h-8 text-green-400" />}
                    title="Analyse des Tendances"
                    subtitle="Surveillance et analyse des tendances émergentes"
                />
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Tendances"
                        value={stats.total}
                        icon={Activity}
                        iconColor="text-green-400"
                        iconBg="from-green-500/20 to-green-600/30"
                        borderColor="border-green-500/30"
                        valueColor="text-green-400"
                        subtitle="suivies"
                        size="default"
                    />

                    <StatsCard
                        title="Actives"
                        value={stats.active}
                        icon={TrendingUp}
                        iconColor="text-blue-400"
                        iconBg="from-blue-500/20 to-blue-600/30"
                        borderColor="border-blue-500/30"
                        valueColor="text-blue-400"
                        subtitle="confirmées"
                        size="default"
                    />

                    <StatsCard
                        title="Forte Dynamique"
                        value={stats.highMomentum}
                        icon={BarChart}
                        iconColor="text-purple-400"
                        iconBg="from-purple-500/20 to-purple-600/30"
                        borderColor="border-purple-500/30"
                        valueColor="text-purple-400"
                        badge="≥75%"
                        badgeColor="bg-purple-500/20 text-purple-400"
                        size="default"
                    />

                    <StatsCard
                        title="En Surveillance"
                        value={stats.monitoring}
                        icon={Activity}
                        iconColor="text-cyan-400"
                        iconBg="from-cyan-500/20 to-cyan-600/30"
                        borderColor="border-cyan-500/30"
                        valueColor="text-cyan-400"
                        subtitle="monitoring"
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

                        <Select value={filterDomain} onValueChange={setFilterDomain}>
                            <SelectTrigger className="bg-[var(--nea-bg-surface-hover)]">
                                <SelectValue placeholder="Domaine" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les domaines</SelectItem>
                                <SelectItem value="Géopolitique">Géopolitique</SelectItem>
                                <SelectItem value="Économie">Économie</SelectItem>
                                <SelectItem value="Société">Société</SelectItem>
                                <SelectItem value="Technologie">Technologie</SelectItem>
                                <SelectItem value="Environnement">Environnement</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="bg-[var(--nea-bg-surface-hover)]">
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Monitoring">Monitoring</SelectItem>
                                <SelectItem value="Archived">Archivée</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </NeaCard>
            </motion.div>

            {/* Trends List */}
            <motion.div variants={itemVariants} className="space-y-4">
                {filteredTrends.length === 0 ? (
                    <NeaCard className="p-12 text-center">
                        <Activity className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                            Aucune tendance ne correspond aux filtres
                        </p>
                    </NeaCard>
                ) : (
                    filteredTrends.map((trend, index) => (
                        <motion.div
                            key={trend.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                        >
                            <NeaCard className="p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-xl font-bold text-[var(--nea-text-title)]">
                                                {trend.trend_name}
                                            </h3>
                                            <Badge className="bg-green-500/20 text-green-400 border-0">
                                                {trend.domain}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-4 gap-4">
                                    <div className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]">
                                        <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Score Momentum</p>
                                        <p className={`text-2xl font-bold ${
                                            trend.momentum_score >= 75 ? 'text-green-400' :
                                            trend.momentum_score >= 50 ? 'text-yellow-400' :
                                            'text-gray-400'
                                        }`}>
                                            {formatPercentage(trend.momentum_score, { decimals: 0 })}
                                        </p>
                                    </div>

                                    <div className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]">
                                        <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Croissance</p>
                                        <p className="text-2xl font-bold text-blue-400">
                                            {formatPercentage(trend.growth_rate || 0, { decimals: 1, showSign: true })}
                                        </p>
                                        <p className="text-xs text-[var(--nea-text-secondary)]">par jour</p>
                                    </div>

                                    <div className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]">
                                        <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Période</p>
                                        <p className="text-sm font-medium text-[var(--nea-text-primary)]">
                                            {trend.analysis_period?.start_date && trend.analysis_period?.end_date ? (
                                                <>
                                                    {formatDate(trend.analysis_period.start_date, 'short')} - {formatDate(trend.analysis_period.end_date, 'short')}
                                                </>
                                            ) : 'N/A'}
                                        </p>
                                    </div>

                                    <div className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]">
                                        <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Statut</p>
                                        <Badge className={`border-0 ${
                                            trend.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                                            trend.status === 'Monitoring' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {trend.status}
                                        </Badge>
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