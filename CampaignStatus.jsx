import React from 'react';
import { motion } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { Zap, Calendar, Target, TrendingUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const STATUS_CONFIG = {
    Active: { 
        icon: Zap, 
        color: 'text-green-400', 
        bg: 'bg-green-500/10',
        label: 'Active'
    },
    Planned: { 
        icon: Calendar, 
        color: 'text-blue-400', 
        bg: 'bg-blue-500/10',
        label: 'Planifiée'
    },
    Completed: { 
        icon: CheckCircle, 
        color: 'text-green-400', 
        bg: 'bg-green-500/10',
        label: 'Terminée'
    },
    Paused: { 
        icon: Clock, 
        color: 'text-yellow-400', 
        bg: 'bg-yellow-500/10',
        label: 'En Pause'
    }
};

export default function CampaignStatus({ campaigns = [] }) {
    if (campaigns.length === 0) {
        return (
            <NeaCard>
                <div className="p-8 text-center">
                    <Target className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Aucune campagne d'entraînement active
                    </p>
                </div>
            </NeaCard>
        );
    }

    return (
        <NeaCard>
            <div className="p-4 border-b border-[var(--nea-border-default)]">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-yellow-400" />
                    Campagnes d'Entraînement
                </h3>
            </div>

            <div className="p-6 space-y-4">
                {campaigns.map((campaign, index) => {
                    const statusConfig = STATUS_CONFIG[campaign.status] || STATUS_CONFIG.Planned;
                    const StatusIcon = statusConfig.icon;
                    const completion = campaign.progress || 0;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 rounded-lg border border-[var(--nea-border-default)] bg-[var(--nea-bg-surface-hover)]"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg ${statusConfig.bg} flex items-center justify-center`}>
                                        <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {campaign.name}
                                        </h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {campaign.description || 'Aucune description'}
                                        </p>
                                    </div>
                                </div>
                                <Badge className={`${statusConfig.bg} ${statusConfig.color} border-0`}>
                                    {statusConfig.label}
                                </Badge>
                            </div>

                            {campaign.status === 'Active' && (
                                <div className="space-y-2 mb-3">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600 dark:text-gray-400">Progression</span>
                                        <span className="font-semibold text-[var(--nea-primary-blue)]">
                                            {completion}%
                                        </span>
                                    </div>
                                    <Progress value={completion} className="h-2" />
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-3 border-t border-[var(--nea-border-subtle)] text-xs">
                                <div className="flex items-center gap-4">
                                    {campaign.attacks_generated && (
                                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                            <Target className="w-4 h-4" />
                                            <span>{campaign.attacks_generated} attaques</span>
                                        </div>
                                    )}
                                    {campaign.models_improved && (
                                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                            <TrendingUp className="w-4 h-4" />
                                            <span>{campaign.models_improved} modèles</span>
                                        </div>
                                    )}
                                </div>
                                {campaign.start_date && (
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {new Date(campaign.start_date).toLocaleDateString('fr-CA')}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </NeaCard>
    );
}