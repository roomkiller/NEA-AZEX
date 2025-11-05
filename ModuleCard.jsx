import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import NeaCard from '../ui/NeaCard';
import NeaButton from '../ui/NeaButton';
import { Play, Pause, Power, TestTube, Eye, MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categoryColors = {
    'GÉOPOLITIQUE': 'bg-blue-500/20 text-blue-400',
    'NUCLÉAIRE': 'bg-red-500/20 text-red-400',
    'CLIMAT': 'bg-green-500/20 text-green-400',
    'BIOLOGIE': 'bg-purple-500/20 text-purple-400',
    'CYBERNÉTIQUE': 'bg-cyan-500/20 text-cyan-400',
    'SUPERVISION': 'bg-yellow-500/20 text-yellow-400'
};

const statusConfig = {
    'Active': { color: 'bg-green-500/20 text-green-400', icon: Power },
    'Standby': { color: 'bg-yellow-500/20 text-yellow-400', icon: Pause },
    'Testing': { color: 'bg-orange-500/20 text-orange-400', icon: TestTube },
    'Disabled': { color: 'bg-gray-500/20 text-gray-400', icon: Power }
};

export default function ModuleCard({ module, index, onAction, onViewDetails }) {
    const StatusIcon = statusConfig[module.status]?.icon || Power;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
        >
            <NeaCard className="p-5 h-full hover:border-[var(--nea-primary-blue)] transition-all group">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Badge className={`${categoryColors[module.category] || 'bg-gray-500/20 text-gray-400'} border-0`}>
                            {module.category}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className={`border-0 text-xs flex items-center gap-1 ${statusConfig[module.status]?.color || 'bg-gray-500/20 text-gray-400'}`}>
                            <StatusIcon className="w-3 h-3" />
                            {module.status}
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="p-1 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                                <DropdownMenuItem onClick={() => onViewDetails(module)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Voir détails
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-[var(--nea-border-subtle)]" />
                                {module.status !== 'Active' && (
                                    <DropdownMenuItem onClick={() => onAction('activate', module)} className="text-green-400">
                                        <Play className="w-4 h-4 mr-2" />
                                        Activer
                                    </DropdownMenuItem>
                                )}
                                {module.status !== 'Standby' && (
                                    <DropdownMenuItem onClick={() => onAction('pause', module)} className="text-yellow-400">
                                        <Pause className="w-4 h-4 mr-2" />
                                        Mettre en pause
                                    </DropdownMenuItem>
                                )}
                                {module.status !== 'Testing' && (
                                    <DropdownMenuItem onClick={() => onAction('test', module)} className="text-orange-400">
                                        <TestTube className="w-4 h-4 mr-2" />
                                        Mode test
                                    </DropdownMenuItem>
                                )}
                                {module.status !== 'Disabled' && (
                                    <DropdownMenuItem onClick={() => onAction('deactivate', module)} className="text-red-400">
                                        <Power className="w-4 h-4 mr-2" />
                                        Désactiver
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <h3 className="text-lg font-bold text-[var(--nea-text-title)] mb-2">
                    {module.name}
                </h3>
                <p className="text-sm text-[var(--nea-text-secondary)] mb-3 line-clamp-2">
                    {module.description}
                </p>
                <div className="flex items-center justify-between text-xs text-[var(--nea-text-secondary)]">
                    <span>Version {module.version}</span>
                    {module.last_audit && (
                        <span>
                            Audit: {new Date(module.last_audit).toLocaleDateString('fr-CA')}
                        </span>
                    )}
                </div>
            </NeaCard>
        </motion.div>
    );
}