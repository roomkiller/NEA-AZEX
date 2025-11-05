import React from 'react';
import { motion } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { Activity, Cpu, Database, HardDrive } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import AnimatedMetric from '../security/AnimatedMetric';

export default function SystemMetrics({ metrics }) {
    if (!metrics) {
        return (
            <NeaCard>
                <div className="p-8 text-center">
                    <Activity className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Aucune métrique système disponible
                    </p>
                </div>
            </NeaCard>
        );
    }

    const metricItems = [
        {
            icon: Cpu,
            label: 'Utilisation CPU',
            value: metrics.cpu_usage || 0,
            unit: '%',
            color: metrics.cpu_usage >= 80 ? 'text-red-400' : 
                   metrics.cpu_usage >= 60 ? 'text-yellow-400' : 'text-green-400'
        },
        {
            icon: Database,
            label: 'Mémoire RAM',
            value: metrics.memory_usage || 0,
            unit: '%',
            color: metrics.memory_usage >= 80 ? 'text-red-400' : 
                   metrics.memory_usage >= 60 ? 'text-yellow-400' : 'text-blue-400'
        },
        {
            icon: HardDrive,
            label: 'Stockage',
            value: metrics.disk_usage || 0,
            unit: '%',
            color: metrics.disk_usage >= 80 ? 'text-red-400' : 
                   metrics.disk_usage >= 60 ? 'text-yellow-400' : 'text-purple-400'
        },
        {
            icon: Activity,
            label: 'Réseau',
            value: metrics.network_throughput || 0,
            unit: ' Mbps',
            color: 'text-cyan-400'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <NeaCard>
                <div className="p-4 border-b border-[var(--nea-border-default)]">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[var(--nea-primary-blue)]" />
                        Métriques Système
                    </h3>
                </div>

                <div className="p-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metricItems.map((metric, index) => {
                        const MetricIcon = metric.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <NeaCard className="p-4 bg-[var(--nea-bg-surface-hover)]">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-10 h-10 rounded-lg bg-[var(--nea-bg-surface)] flex items-center justify-center`}>
                                            <MetricIcon className={`w-5 h-5 ${metric.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                                {metric.label}
                                            </p>
                                            <div className="flex items-baseline gap-1">
                                                <AnimatedMetric
                                                    value={metric.value}
                                                    duration={1.5}
                                                    className={`text-2xl font-bold ${metric.color}`}
                                                />
                                                <span className={`text-sm ${metric.color}`}>
                                                    {metric.unit}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {metric.unit === '%' && (
                                        <Progress value={metric.value} className="h-2" />
                                    )}
                                </NeaCard>
                            </motion.div>
                        );
                    })}
                </div>

                {metrics.uptime && (
                    <div className="px-6 pb-6">
                        <div className="pt-4 border-t border-[var(--nea-border-subtle)] flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Temps de Fonctionnement
                            </span>
                            <span className="text-sm font-semibold text-[var(--nea-primary-blue)]">
                                {metrics.uptime}
                            </span>
                        </div>
                    </div>
                )}
            </NeaCard>
        </motion.div>
    );
}