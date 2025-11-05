import React from 'react';
import { motion } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import NeaButton from '../ui/NeaButton';
import { Bot, Play, Edit, Trash2, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '../StatusBadge';

const TRIGGER_TYPES = {
    Manual: { icon: Play, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    Scheduled: { icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    Webhook: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10' }
};

const STATUS_ICONS = {
    Success: CheckCircle,
    Failed: XCircle,
    Running: Clock,
    NeverRun: Clock
};

const STATUS_COLORS = {
    Success: 'text-green-400',
    Failed: 'text-red-400',
    Running: 'text-blue-400',
    NeverRun: 'text-gray-400'
};

export default function MacroCard({ macro, onEdit, onDelete, onExecute, index = 0 }) {
    const triggerConfig = TRIGGER_TYPES[macro.trigger_type] || TRIGGER_TYPES.Manual;
    const TriggerIcon = triggerConfig.icon;
    const StatusIcon = STATUS_ICONS[macro.last_run_status] || Clock;
    const statusColor = STATUS_COLORS[macro.last_run_status] || 'text-gray-400';

    const getStatusBadge = () => {
        const badges = {
            Draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
            Active: 'bg-green-500/20 text-green-400 border-green-500/30',
            Disabled: 'bg-red-500/20 text-red-400 border-red-500/30'
        };
        return badges[macro.status] || badges.Draft;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <NeaCard className="p-6 hover:border-[var(--nea-primary-blue)] transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-lg ${triggerConfig.bg} flex items-center justify-center flex-shrink-0`}>
                            <Bot className={`w-5 h-5 ${triggerConfig.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate">
                                {macro.name}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge className={`${getStatusBadge()} border text-xs`}>
                                    {macro.status}
                                </Badge>
                                <Badge className={`${triggerConfig.bg} ${triggerConfig.color} border-0 text-xs`}>
                                    <TriggerIcon className="w-3 h-3 mr-1" />
                                    {macro.trigger_type}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {macro.description || 'Aucune description'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--nea-border-subtle)]">
                    <div className="flex items-center gap-2">
                        <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                        <span className={`text-xs font-semibold ${statusColor}`}>
                            {macro.last_run_status === 'NeverRun' ? 'Jamais exécuté' : macro.last_run_status}
                        </span>
                        {macro.last_run_timestamp && (
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                • {new Date(macro.last_run_timestamp).toLocaleString('fr-CA')}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {macro.status === 'Active' && onExecute && (
                            <NeaButton
                                size="sm"
                                onClick={() => onExecute(macro)}
                            >
                                <Play className="w-4 h-4 mr-1" />
                                Exécuter
                            </NeaButton>
                        )}
                        {onEdit && (
                            <NeaButton
                                size="sm"
                                variant="secondary"
                                onClick={() => onEdit(macro)}
                            >
                                <Edit className="w-4 h-4" />
                            </NeaButton>
                        )}
                        {onDelete && (
                            <NeaButton
                                size="sm"
                                variant="ghost"
                                onClick={() => onDelete(macro)}
                                className="text-red-400 hover:text-red-300"
                            >
                                <Trash2 className="w-4 h-4" />
                            </NeaButton>
                        )}
                    </div>
                </div>

                {macro.execution_history && macro.execution_history.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[var(--nea-border-subtle)]">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            Dernières exécutions:
                        </p>
                        <div className="flex gap-1">
                            {macro.execution_history.slice(-10).map((exec, idx) => {
                                const execStatusColor = STATUS_COLORS[exec.status] || 'bg-gray-400';
                                return (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full ${
                                            exec.status === 'Success' ? 'bg-green-400' :
                                            exec.status === 'Failed' ? 'bg-red-400' :
                                            'bg-gray-400'
                                        }`}
                                        title={`${exec.status} - ${new Date(exec.run_timestamp).toLocaleString('fr-CA')}`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </NeaCard>
        </motion.div>
    );
}