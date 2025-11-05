import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { TrendingUp, Filter, Search, AlertTriangle, CheckCircle, Clock, ChevronDown } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { formatDate, formatPercentage } from '../components/utils/NumberFormatter';
import StatsCard from '../components/ui/StatsCard';

export default function EventPredictions() {
    const [predictions, setPredictions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterConfidence, setFilterConfidence] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        const loadPredictions = async () => {
            try {
                const data = await base44.entities.EventPrediction.list('-probability_score');
                setPredictions(data);
            } catch (error) {
                console.error("Erreur chargement prédictions:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadPredictions();
    }, []);

    const stats = useMemo(() => ({
        total: predictions.length,
        highProbability: predictions.filter(p => p.probability_score >= 70).length,
        mediumProbability: predictions.filter(p => p.probability_score >= 50 && p.probability_score < 70).length,
        lowProbability: predictions.filter(p => p.probability_score < 50).length,
        highConfidence: predictions.filter(p => p.confidence_level === 'Élevé').length,
        validated: predictions.filter(p => p.status === 'Validé' || p.status === 'Confirmé').length
    }), [predictions]);

    const filteredPredictions = useMemo(() => {
        return predictions.filter(pred => {
            const matchesSearch = pred.event_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                pred.prediction_summary?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || pred.event_type === filterType;
            const matchesStatus = filterStatus === 'all' || pred.status === filterStatus;
            const matchesConfidence = filterConfidence === 'all' || pred.confidence_level === filterConfidence;
            return matchesSearch && matchesType && matchesStatus && matchesConfidence;
        });
    }, [predictions, searchTerm, filterType, filterStatus, filterConfidence]);

    if (isLoading) {
        return <LoadingTransition message="Chargement des prédictions..." />;
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
                    { name: "Prédictions d'Événements", href: "EventPredictions" }
                ]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<TrendingUp className="w-8 h-8 text-purple-400" />}
                    title="Prédictions d'Événements"
                    subtitle="Anticipation d'événements majeurs par analyse prédictive"
                />
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Prédictions"
                        value={stats.total}
                        icon={TrendingUp}
                        iconColor="text-purple-400"
                        iconBg="from-purple-500/20 to-purple-600/30"
                        borderColor="border-purple-500/30"
                        valueColor="text-purple-400"
                        subtitle="actives"
                        size="default"
                    />

                    <StatsCard
                        title="Haute Probabilité"
                        value={stats.highProbability}
                        icon={AlertTriangle}
                        iconColor="text-red-400"
                        iconBg="from-red-500/20 to-red-600/30"
                        borderColor="border-red-500/30"
                        valueColor="text-red-400"
                        badge="≥70%"
                        badgeColor="bg-red-500/20 text-red-400"
                        size="default"
                    />

                    <StatsCard
                        title="Haute Confiance"
                        value={stats.highConfidence}
                        icon={CheckCircle}
                        iconColor="text-green-400"
                        iconBg="from-green-500/20 to-green-600/30"
                        borderColor="border-green-500/30"
                        valueColor="text-green-400"
                        subtitle="fiables"
                        size="default"
                    />

                    <StatsCard
                        title="Validées"
                        value={stats.validated}
                        icon={CheckCircle}
                        iconColor="text-blue-400"
                        iconBg="from-blue-500/20 to-blue-600/30"
                        borderColor="border-blue-500/30"
                        valueColor="text-blue-400"
                        subtitle="confirmées"
                        size="default"
                    />
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div variants={itemVariants}>
                <NeaCard className="p-4">
                    <div className="grid md:grid-cols-4 gap-4">
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
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les types</SelectItem>
                                <SelectItem value="GÉOPOLITIQUE">Géopolitique</SelectItem>
                                <SelectItem value="ÉCONOMIQUE">Économique</SelectItem>
                                <SelectItem value="SOCIAL">Social</SelectItem>
                                <SelectItem value="CLIMATIQUE">Climatique</SelectItem>
                                <SelectItem value="TECHNOLOGIQUE">Technologique</SelectItem>
                                <SelectItem value="SANITAIRE">Sanitaire</SelectItem>
                                <SelectItem value="SÉCURITAIRE">Sécuritaire</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="bg-[var(--nea-bg-surface-hover)]">
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                <SelectItem value="Détection">Détection</SelectItem>
                                <SelectItem value="Analyse">Analyse</SelectItem>
                                <SelectItem value="Validé">Validé</SelectItem>
                                <SelectItem value="Confirmé">Confirmé</SelectItem>
                                <SelectItem value="Infirmé">Infirmé</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filterConfidence} onValueChange={setFilterConfidence}>
                            <SelectTrigger className="bg-[var(--nea-bg-surface-hover)]">
                                <SelectValue placeholder="Confiance" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes</SelectItem>
                                <SelectItem value="Élevé">Élevé</SelectItem>
                                <SelectItem value="Moyen">Moyen</SelectItem>
                                <SelectItem value="Faible">Faible</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </NeaCard>
            </motion.div>

            {/* Predictions List */}
            <motion.div variants={itemVariants} className="space-y-4">
                {filteredPredictions.length === 0 ? (
                    <NeaCard className="p-12 text-center">
                        <TrendingUp className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                            Aucune prédiction ne correspond aux filtres
                        </p>
                    </NeaCard>
                ) : (
                    filteredPredictions.map((prediction, index) => (
                        <motion.div
                            key={prediction.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                        >
                            <NeaCard className="p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-xl font-bold text-[var(--nea-text-title)]">
                                                {prediction.event_name}
                                            </h3>
                                            <Badge className="bg-purple-500/20 text-purple-400 border-0">
                                                {prediction.event_type}
                                            </Badge>
                                        </div>
                                        <p className="text-[var(--nea-text-secondary)]">
                                            {prediction.prediction_summary}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-4 gap-4">
                                    <div className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]">
                                        <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Probabilité</p>
                                        <div className="flex items-center gap-2">
                                            <p className={`text-2xl font-bold ${
                                                prediction.probability_score >= 70 ? 'text-red-400' :
                                                prediction.probability_score >= 50 ? 'text-yellow-400' :
                                                'text-gray-400'
                                            }`}>
                                                {formatPercentage(prediction.probability_score, { decimals: 0 })}
                                            </p>
                                            {prediction.probability_score >= 70 && (
                                                <AlertTriangle className="w-4 h-4 text-red-400" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]">
                                        <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Confiance</p>
                                        <Badge className={`border-0 ${
                                            prediction.confidence_level === 'Élevé' ? 'bg-green-500/20 text-green-400' :
                                            prediction.confidence_level === 'Moyen' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {prediction.confidence_level}
                                        </Badge>
                                    </div>

                                    <div className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]">
                                        <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Date prévue</p>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-400" />
                                            <p className="text-sm font-medium text-[var(--nea-text-primary)]">
                                                {formatDate(prediction.predicted_date, 'medium')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]">
                                        <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Statut</p>
                                        <Badge className={`border-0 ${
                                            prediction.status === 'Confirmé' ? 'bg-green-500/20 text-green-400' :
                                            prediction.status === 'Validé' ? 'bg-blue-500/20 text-blue-400' :
                                            prediction.status === 'Infirmé' ? 'bg-red-500/20 text-red-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {prediction.status}
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