import React from 'react';
import { motion } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { Activity, Cpu, Database, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function SystemHealthCard({ health = 95 }) {
    const getHealthStatus = () => {
        if (health >= 90) return { 
            label: 'Excellent', 
            color: 'text-green-400',
            icon: CheckCircle,
            progressColor: 'bg-green-500'
        };
        if (health >= 70) return { 
            label: 'Bon', 
            color: 'text-yellow-400',
            icon: Activity,
            progressColor: 'bg-yellow-500'
        };
        return { 
            label: 'Critique', 
            color: 'text-red-400',
            icon: AlertTriangle,
            progressColor: 'bg-red-500'
        };
    };

    const status = getHealthStatus();
    const StatusIcon = status.icon;

    const metrics = [
        { icon: Cpu, label: 'CPU', value: '23%', color: 'text-blue-400' },
        { icon: Database, label: 'Mémoire', value: '45%', color: 'text-purple-400' },
        { icon: Shield, label: 'Sécurité', value: '100%', color: 'text-green-400' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <NeaCard>
                <div className="p-4 border-b border-[var(--nea-border-default)]">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Santé du Système
                    </h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <StatusIcon className={`w-16 h-16 ${status.color} mx-auto mb-4`} />
                        <p className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                            {health}%
                        </p>
                        <p className={`text-lg font-semibold ${status.color}`}>
                            {status.label}
                        </p>
                    </div>
                    
                    <Progress value={health} className="h-3" />

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--nea-border-subtle)]">
                        {metrics.map((metric, idx) => {
                            const Icon = metric.icon;
                            return (
                                <div key={idx} className="text-center">
                                    <Icon className={`w-5 h-5 ${metric.color} mx-auto mb-2`} />
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        {metric.label}
                                    </p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                        {metric.value}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </NeaCard>
        </motion.div>
    );
}