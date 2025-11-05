import React from 'react';
import { motion } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { Crosshair, Bot, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const STRIKE_TYPE_CONFIG = {
    Automated: {
        icon: Bot,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        label: 'Automatisé'
    },
    Manual: {
        icon: Crosshair,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        label: 'Manuel'
    },
    Hybrid: {
        icon: AlertTriangle,
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        label: 'Hybride'
    }
};

export default function StrikePlanner({ plans = [] }) {
    if (plans.length === 0) {
        return (
            <NeaCard>
                <div className="p-8 text-center">
                    <Crosshair className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Aucun plan de frappe actif
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Les plans seront générés automatiquement en cas de menace
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
                        <Crosshair className="w-5 h-5 text-orange-400" />
                        Planification de Frappes
                    </h3>
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        {plans.length} plans
                    </Badge>
                </div>
            </div>

            <div className="p-6 space-y-4">
                {plans.map((plan, index) => {
                    const typeConfig = STRIKE_TYPE_CONFIG[plan.strike_type] || STRIKE_TYPE_CONFIG.Automated;
                    const TypeIcon = typeConfig.icon;
                    const readiness = plan.readiness || 0;

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
                                    <div className={`w-10 h-10 rounded-lg ${typeConfig.bg} flex items-center justify-center`}>
                                        <TypeIcon className={`w-5 h-5 ${typeConfig.color}`} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {plan.plan_name}
                                        </h4>
                                        <Badge className={`${typeConfig.bg} ${typeConfig.color} border-0 text-xs mt-1`}>
                                            {typeConfig.label}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {plan.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    {plan.description}
                                </p>
                            )}

                            <div className="space-y-2 mb-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-600 dark:text-gray-400">État de Préparation</span>
                                    <span className={`font-semibold ${
                                        readiness >= 90 ? 'text-green-400' :
                                        readiness >= 70 ? 'text-yellow-400' :
                                        'text-red-400'
                                    }`}>
                                        {readiness}%
                                    </span>
                                </div>
                                <Progress value={readiness} className="h-2" />
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-[var(--nea-border-subtle)] text-xs">
                                <div className="flex items-center gap-4">
                                    {plan.targets_count && (
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {plan.targets_count} cibles
                                        </span>
                                    )}
                                    {plan.estimated_time && (
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Durée: {plan.estimated_time}
                                        </span>
                                    )}
                                </div>
                                {readiness >= 90 && (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </NeaCard>
    );
}