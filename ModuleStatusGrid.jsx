import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import NeaCard from '../ui/NeaCard';
import { Grid3x3, CheckCircle, AlertTriangle, XCircle, Clock, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const STATUS_CONFIG = {
    Active: {
        icon: CheckCircle,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        label: 'Actif'
    },
    Standby: {
        icon: Clock,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        label: 'Veille'
    },
    Testing: {
        icon: AlertTriangle,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        label: 'Test'
    },
    Disabled: {
        icon: XCircle,
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        label: 'Désactivé'
    }
};

export default function ModuleStatusGrid() {
    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadModules = async () => {
            try {
                const data = await base44.entities.Module.list();
                setModules(data);
            } catch (error) {
                console.error("Erreur chargement modules:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadModules();
    }, []);

    if (isLoading) {
        return (
            <NeaCard>
                <div className="p-12 flex justify-center">
                    <Loader2 className="w-8 h-8 text-[var(--nea-primary-blue)] animate-spin" />
                </div>
            </NeaCard>
        );
    }

    if (modules.length === 0) {
        return (
            <NeaCard>
                <div className="p-8 text-center">
                    <Grid3x3 className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Aucun module disponible
                    </p>
                </div>
            </NeaCard>
        );
    }

    const statusCounts = modules.reduce((acc, module) => {
        acc[module.status] = (acc[module.status] || 0) + 1;
        return acc;
    }, {});

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <NeaCard>
                <div className="p-4 border-b border-[var(--nea-border-default)]">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Grid3x3 className="w-5 h-5 text-[var(--nea-primary-blue)]" />
                            Statut des Modules
                        </h3>
                        <Badge className="bg-[var(--nea-primary-blue)]/20 text-[var(--nea-primary-blue)] border-0">
                            {modules.length} modules
                        </Badge>
                    </div>
                </div>

                {/* Résumé des Statuts */}
                <div className="p-6 border-b border-[var(--nea-border-subtle)]">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(STATUS_CONFIG).map(([status, config]) => {
                            const StatusIcon = config.icon;
                            const count = statusCounts[status] || 0;
                            return (
                                <div key={status} className={`p-3 rounded-lg ${config.bg}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <StatusIcon className={`w-4 h-4 ${config.color}`} />
                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                            {config.label}
                                        </span>
                                    </div>
                                    <p className={`text-2xl font-bold ${config.color}`}>
                                        {count}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Grille des Modules */}
                <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto styled-scrollbar">
                    <AnimatePresence>
                        {modules.map((module, index) => {
                            const statusConfig = STATUS_CONFIG[module.status] || STATUS_CONFIG.Standby;
                            const StatusIcon = statusConfig.icon;

                            return (
                                <motion.div
                                    key={module.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <NeaCard className={`p-4 ${statusConfig.bg} border ${statusConfig.bg} hover:border-[var(--nea-primary-blue)] transition-all`}>
                                        <div className="flex items-start justify-between mb-3">
                                            <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
                                            <Badge className={`${statusConfig.bg} ${statusConfig.color} border-0 text-xs`}>
                                                {statusConfig.label}
                                            </Badge>
                                        </div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">
                                            {module.name}
                                        </h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                                            {module.description}
                                        </p>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {module.category}
                                            </span>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                v{module.version}
                                            </span>
                                        </div>
                                    </NeaCard>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </NeaCard>
        </motion.div>
    );
}