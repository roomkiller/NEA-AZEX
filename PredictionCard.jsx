import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PredictionCard({ prediction }) {
    const getConfidenceColor = (level) => {
        switch (level) {
            case 'Élevé': return 'bg-green-500/20 text-green-400';
            case 'Moyen': return 'bg-yellow-500/20 text-yellow-400';
            case 'Faible': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getTypeColor = (type) => {
        const colors = {
            'GÉOPOLITIQUE': 'bg-blue-500/20 text-blue-400',
            'ÉCONOMIQUE': 'bg-green-500/20 text-green-400',
            'SOCIAL': 'bg-purple-500/20 text-purple-400',
            'CLIMATIQUE': 'bg-cyan-500/20 text-cyan-400',
            'TECHNOLOGIQUE': 'bg-orange-500/20 text-orange-400',
            'SANITAIRE': 'bg-red-500/20 text-red-400',
            'SÉCURITAIRE': 'bg-red-500/20 text-red-400'
        };
        return colors[type] || 'bg-gray-500/20 text-gray-400';
    };

    const getProbabilityColor = (score) => {
        if (score >= 80) return 'text-red-400';
        if (score >= 60) return 'text-orange-400';
        if (score >= 40) return 'text-yellow-400';
        return 'text-green-400';
    };

    return (
        <div className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)] hover:border-[var(--nea-primary-blue)] transition-all">
            <div className="flex items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${getTypeColor(prediction.event_type)} border-0 text-xs`}>
                            {prediction.event_type}
                        </Badge>
                        <Badge className={`${getConfidenceColor(prediction.confidence_level)} border-0 text-xs`}>
                            {prediction.confidence_level}
                        </Badge>
                        {prediction.status && (
                            <Badge className={`border-0 text-xs ${
                                prediction.status === 'Confirmé' ? 'bg-red-500 text-white' :
                                prediction.status === 'Validé' ? 'bg-orange-500/20 text-orange-400' :
                                'bg-blue-500/20 text-blue-400'
                            }`}>
                                {prediction.status}
                            </Badge>
                        )}
                    </div>
                    <h3 className="text-lg font-bold text-[var(--nea-text-title)] mb-2">
                        {prediction.event_name}
                    </h3>
                    <p className="text-sm text-[var(--nea-text-primary)] mb-3">
                        {prediction.prediction_summary}
                    </p>
                    {prediction.predicted_date && (
                        <div className="flex items-center gap-2 text-xs text-[var(--nea-text-secondary)]">
                            <Calendar className="w-3 h-3" />
                            <span>Échéance: {new Date(prediction.predicted_date).toLocaleDateString('fr-CA')}</span>
                        </div>
                    )}
                </div>
                <div className="text-center shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-4 border-purple-400/30 flex items-center justify-center">
                        <p className={`text-2xl font-bold ${getProbabilityColor(prediction.probability_score)}`}>
                            {prediction.probability_score}%
                        </p>
                    </div>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                        Probabilité
                    </p>
                </div>
            </div>
        </div>
    );
}