import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const SEVERITY_CONFIG = {
    Critical: { 
        color: 'text-red-400', 
        bg: 'bg-red-500/10',
        icon: AlertTriangle,
        label: 'Critique'
    },
    High: { 
        color: 'text-orange-400', 
        bg: 'bg-orange-500/10',
        icon: TrendingUp,
        label: 'Élevé'
    },
    Medium: { 
        color: 'text-yellow-400', 
        bg: 'bg-yellow-500/10',
        icon: Clock,
        label: 'Moyen'
    },
    Low: { 
        color: 'text-blue-400', 
        bg: 'bg-blue-500/10',
        icon: CheckCircle,
        label: 'Faible'
    }
};

export default function PredictionFeed({ predictions = [] }) {
    if (predictions.length === 0) {
        return (
            <NeaCard>
                <div className="p-8 text-center">
                    <Brain className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Aucune prédiction générée
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Les prédictions apparaîtront pendant l'entraînement
                    </p>
                </div>
            </NeaCard>
        );
    }

    return (
        <NeaCard>
            <div className="p-4 border-b border-[var(--nea-border-default)]">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-400" />
                        Prédictions d'Attaques
                    </h3>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        {predictions.length} prédictions
                    </Badge>
                </div>
            </div>

            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto styled-scrollbar">
                <AnimatePresence>
                    {predictions.map((prediction, index) => {
                        const severityConfig = SEVERITY_CONFIG[prediction.severity] || SEVERITY_CONFIG.Low;
                        const SeverityIcon = severityConfig.icon;
                        const confidence = prediction.confidence || 0;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                                className={`p-4 rounded-lg border ${severityConfig.bg} border-[var(--nea-border-default)] hover:border-[var(--nea-primary-blue)] transition-all`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`w-10 h-10 rounded-lg ${severityConfig.bg} flex items-center justify-center flex-shrink-0`}>
                                            <SeverityIcon className={`w-5 h-5 ${severityConfig.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                                                {prediction.attack_type || 'Type d\'attaque inconnu'}
                                            </h4>
                                            <Badge className={`${severityConfig.bg} ${severityConfig.color} border-0 text-xs`}>
                                                Sévérité: {severityConfig.label}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {prediction.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        {prediction.description}
                                    </p>
                                )}

                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                Confiance de Prédiction
                                            </span>
                                            <span className={`text-sm font-bold ${
                                                confidence >= 80 ? 'text-green-400' :
                                                confidence >= 60 ? 'text-yellow-400' :
                                                'text-red-400'
                                            }`}>
                                                {confidence}%
                                            </span>
                                        </div>
                                        <Progress value={confidence} className="h-2" />
                                    </div>

                                    {prediction.mitigation && (
                                        <div className="pt-3 border-t border-[var(--nea-border-subtle)]">
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                                Contre-mesures Suggérées:
                                            </p>
                                            <p className="text-sm text-[var(--nea-primary-blue)]">
                                                {prediction.mitigation}
                                            </p>
                                        </div>
                                    )}

                                    {prediction.timestamp && (
                                        <div className="flex items-center justify-between pt-3 border-t border-[var(--nea-border-subtle)] text-xs text-gray-600 dark:text-gray-400">
                                            <span>Générée le</span>
                                            <span>{new Date(prediction.timestamp).toLocaleString('fr-CA')}</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </NeaCard>
    );
}