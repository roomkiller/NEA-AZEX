import React from 'react';
import { Filter } from 'lucide-react';
import NeaCard from '../ui/NeaCard';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

export default function ActivityFilters({ filters, onFiltersChange, scenarios, collaborations }) {
    // Get unique users from collaborations
    const uniqueUsers = React.useMemo(() => {
        const usersMap = new Map();
        collaborations.forEach(collab => {
            if (!usersMap.has(collab.user_email)) {
                usersMap.set(collab.user_email, {
                    email: collab.user_email,
                    name: collab.user_name
                });
            }
        });
        return Array.from(usersMap.values());
    }, [collaborations]);

    const handleFilterChange = (key, value) => {
        onFiltersChange(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <NeaCard className="p-4">
            <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-[var(--nea-primary-blue)]" />
                <h4 className="font-semibold text-[var(--nea-text-primary)]">Filtres</h4>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Scenario Filter */}
                <div>
                    <label className="text-xs text-[var(--nea-text-secondary)] mb-2 block">
                        Scénario
                    </label>
                    <Select
                        value={filters.scenario}
                        onValueChange={(value) => handleFilterChange('scenario', value)}
                    >
                        <SelectTrigger className="bg-[var(--nea-bg-surface-hover)]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les scénarios</SelectItem>
                            {scenarios.map(scenario => (
                                <SelectItem key={scenario.id} value={scenario.id}>
                                    {scenario.scenario_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* User Filter */}
                <div>
                    <label className="text-xs text-[var(--nea-text-secondary)] mb-2 block">
                        Utilisateur
                    </label>
                    <Select
                        value={filters.user}
                        onValueChange={(value) => handleFilterChange('user', value)}
                    >
                        <SelectTrigger className="bg-[var(--nea-bg-surface-hover)]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les utilisateurs</SelectItem>
                            {uniqueUsers.map(user => (
                                <SelectItem key={user.email} value={user.email}>
                                    {user.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Action Type Filter */}
                <div>
                    <label className="text-xs text-[var(--nea-text-secondary)] mb-2 block">
                        Type d'Action
                    </label>
                    <Select
                        value={filters.actionType}
                        onValueChange={(value) => handleFilterChange('actionType', value)}
                    >
                        <SelectTrigger className="bg-[var(--nea-bg-surface-hover)]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes les actions</SelectItem>
                            <SelectItem value="comments">Commentaires</SelectItem>
                            <SelectItem value="edits">Propositions d'édition</SelectItem>
                            <SelectItem value="versions">Versions</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Timeframe Filter */}
                <div>
                    <label className="text-xs text-[var(--nea-text-secondary)] mb-2 block">
                        Période
                    </label>
                    <Select
                        value={filters.timeframe}
                        onValueChange={(value) => handleFilterChange('timeframe', value)}
                    >
                        <SelectTrigger className="bg-[var(--nea-bg-surface-hover)]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="24h">Dernières 24h</SelectItem>
                            <SelectItem value="7d">7 derniers jours</SelectItem>
                            <SelectItem value="30d">30 derniers jours</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </NeaCard>
    );
}