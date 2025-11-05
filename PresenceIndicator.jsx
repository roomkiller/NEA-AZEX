import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Eye, ExternalLink, ChevronDown } from 'lucide-react';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';

export default function PresenceIndicator({ activeUsers, scenarios }) {
    const [expanded, setExpanded] = useState(true);

    // Group users by scenario
    const usersByScenario = React.useMemo(() => {
        const grouped = new Map();
        
        activeUsers.forEach(user => {
            if (!grouped.has(user.scenarioId)) {
                grouped.set(user.scenarioId, []);
            }
            grouped.get(user.scenarioId).push(user);
        });

        return grouped;
    }, [activeUsers]);

    const getScenarioName = (scenarioId) => {
        const scenario = scenarios.find(s => s.id === scenarioId);
        return scenario?.scenario_name || 'Scénario inconnu';
    };

    const getUserInitials = (name) => {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    if (activeUsers.length === 0) {
        return (
            <NeaCard className="p-4 bg-gradient-to-r from-gray-500/5 to-gray-500/10 border-gray-500/30">
                <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-sm font-semibold text-[var(--nea-text-primary)]">
                            Aucun utilisateur actif
                        </p>
                        <p className="text-xs text-[var(--nea-text-secondary)]">
                            Les utilisateurs actifs dans la dernière heure apparaîtront ici
                        </p>
                    </div>
                </div>
            </NeaCard>
        );
    }

    return (
        <NeaCard className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
            <div 
                className="p-4 cursor-pointer hover:bg-purple-500/5 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Users className="w-6 h-6 text-purple-400" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[var(--nea-bg-surface)] animate-pulse" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[var(--nea-text-primary)]">
                                Présence en Temps Réel
                            </p>
                            <p className="text-xs text-[var(--nea-text-secondary)]">
                                {activeUsers.length} utilisateur{activeUsers.length > 1 ? 's' : ''} actif{activeUsers.length > 1 ? 's' : ''} • 
                                {' '}{usersByScenario.size} scénario{usersByScenario.size > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-[var(--nea-text-secondary)] transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-3">
                            {Array.from(usersByScenario.entries()).map(([scenarioId, users]) => (
                                <div key={scenarioId} className="p-3 rounded-lg bg-[var(--nea-bg-surface)] border border-[var(--nea-border-subtle)]">
                                    <Link 
                                        to={`${createPageUrl('CollaborativeScenarioView')}?id=${scenarioId}`}
                                        className="hover:text-[var(--nea-primary-blue)] transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Eye className="w-4 h-4 text-cyan-400" />
                                                <span className="text-sm font-semibold text-[var(--nea-text-primary)]">
                                                    {getScenarioName(scenarioId)}
                                                </span>
                                                <ExternalLink className="w-3 h-3 text-[var(--nea-text-secondary)]" />
                                            </div>
                                            <Badge className="bg-cyan-500/20 text-cyan-400 border-0 text-xs">
                                                {users.length} actif{users.length > 1 ? 's' : ''}
                                            </Badge>
                                        </div>
                                    </Link>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        {users.map((user, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2 px-2 py-1 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
                                                title={`${user.name} (${user.email})`}
                                            >
                                                <div className="relative">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center">
                                                        <span className="text-xs font-bold text-purple-400">
                                                            {getUserInitials(user.name)}
                                                        </span>
                                                    </div>
                                                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[var(--nea-bg-surface)]" />
                                                </div>
                                                <span className="text-xs text-[var(--nea-text-primary)]">
                                                    {user.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </NeaCard>
    );
}