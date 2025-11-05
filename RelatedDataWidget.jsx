import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { TrendingUp, Eye, Activity, Info, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '../utils/NumberFormatter';

export default function RelatedDataWidget({ briefId }) {
    const [predictions, setPredictions] = useState([]);
    const [signals, setSignals] = useState([]);
    const [trends, setTrends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadRelatedData = async () => {
            if (!briefId) return;
            
            setIsLoading(true);
            try {
                const [predsData, signalsData, trendsData] = await Promise.all([
                    base44.entities.EventPrediction.list('-probability_score', 5).catch(() => []),
                    base44.entities.MediaSignal.list('-relevance_score', 5).catch(() => []),
                    base44.entities.TrendAnalysis.list('-momentum_score', 5).catch(() => [])
                ]);

                setPredictions(predsData);
                setSignals(signalsData);
                setTrends(trendsData);
            } catch (error) {
                console.error("Erreur chargement données liées:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadRelatedData();
    }, [briefId]);

    const formatPercentage = (value) => {
        if (!value) return '0%';
        return `${Math.round(value)}%`;
    };

    if (isLoading) {
        return (
            <div className="p-4 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-[var(--nea-primary-blue)]" />
                <p className="text-sm text-[var(--nea-text-secondary)] mt-2">Chargement données liées...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Predictions */}
            {predictions.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                        <h4 className="text-sm font-semibold text-[var(--nea-text-primary)]">
                            Prédictions Liées ({predictions.length})
                        </h4>
                    </div>
                    <div className="space-y-2">
                        {predictions.map((pred, idx) => (
                            <motion.div
                                key={pred.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-3 rounded-lg bg-[var(--nea-bg-surface)] border border-[var(--nea-border-subtle)] hover:border-purple-500/30 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <p className="text-sm font-medium text-[var(--nea-text-primary)] flex-1">
                                        {pred.event_name}
                                    </p>
                                    <Badge className={`ml-2 border-0 text-xs ${
                                        pred.probability_score >= 80 ? 'bg-green-500/20 text-green-400' :
                                        pred.probability_score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-gray-500/20 text-gray-400'
                                    }`}>
                                        {formatPercentage(pred.probability_score)}
                                    </Badge>
                                </div>
                                <p className="text-xs text-[var(--nea-text-secondary)]">
                                    {formatDate(pred.predicted_date, 'medium')}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Signals */}
            {signals.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Eye className="w-4 h-4 text-orange-400" />
                        <h4 className="text-sm font-semibold text-[var(--nea-text-primary)]">
                            Signaux Faibles ({signals.length})
                        </h4>
                    </div>
                    <div className="space-y-2">
                        {signals.map((signal, idx) => (
                            <motion.div
                                key={signal.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-3 rounded-lg bg-[var(--nea-bg-surface)] border border-[var(--nea-border-subtle)] hover:border-orange-500/30 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <p className="text-sm font-medium text-[var(--nea-text-primary)] flex-1">
                                        {signal.signal_title}
                                    </p>
                                    <Badge className={`ml-2 border-0 text-xs ${
                                        signal.relevance_score >= 80 ? 'bg-orange-500/20 text-orange-400' :
                                        'bg-gray-500/20 text-gray-400'
                                    }`}>
                                        {formatPercentage(signal.relevance_score)}
                                    </Badge>
                                </div>
                                <p className="text-xs text-[var(--nea-text-secondary)]">
                                    {signal.source_platform} • {formatDate(signal.detection_timestamp, 'datetime')}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Trends */}
            {trends.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Activity className="w-4 h-4 text-green-400" />
                        <h4 className="text-sm font-semibold text-[var(--nea-text-primary)]">
                            Tendances ({trends.length})
                        </h4>
                    </div>
                    <div className="space-y-2">
                        {trends.map((trend, idx) => (
                            <motion.div
                                key={trend.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-3 rounded-lg bg-[var(--nea-bg-surface)] border border-[var(--nea-border-subtle)] hover:border-green-500/30 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <p className="text-sm font-medium text-[var(--nea-text-primary)] flex-1">
                                        {trend.trend_name}
                                    </p>
                                    <Badge className="ml-2 bg-green-500/20 text-green-400 border-0 text-xs">
                                        {formatPercentage(trend.momentum_score)}
                                    </Badge>
                                </div>
                                <p className="text-xs text-[var(--nea-text-secondary)]">
                                    {trend.domain}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {predictions.length === 0 && signals.length === 0 && trends.length === 0 && (
                <div className="text-center py-8">
                    <Info className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-[var(--nea-text-secondary)]">
                        Aucune donnée liée pour le moment
                    </p>
                </div>
            )}
        </div>
    );
}