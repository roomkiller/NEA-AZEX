
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
    MessageSquare, 
    Edit, 
    History, 
    GitBranch, 
    CheckCircle, 
    XCircle, 
    Clock,
    ExternalLink,
    User,
    Activity
} from 'lucide-react';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import NeaButton from '../ui/NeaButton';

export default function ActivityFeed({ activities, scenarios, onRefresh }) {
    const getActivityIcon = (activity) => {
        if (activity.type === 'collaboration') {
            switch (activity.subType) {
                case 'Comment': return MessageSquare;
                case 'Edit': return Edit;
                case 'Suggestion': return MessageSquare;
                default: return MessageSquare;
            }
        } else if (activity.type === 'version') {
            return activity.isBranch ? GitBranch : History;
        }
        return Activity;
    };

    const getActivityColor = (activity) => {
        if (activity.type === 'collaboration') {
            switch (activity.subType) {
                case 'Comment': return 'text-blue-400';
                case 'Edit': return 'text-purple-400';
                case 'Suggestion': return 'text-cyan-400';
                default: return 'text-gray-400';
            }
        } else if (activity.type === 'version') {
            return activity.isBranch ? 'text-yellow-400' : 'text-green-400';
        }
        return 'text-gray-400';
    };

    const getStatusBadge = (activity) => {
        if (activity.type === 'collaboration') {
            switch (activity.status) {
                case 'Pending':
                    return <Badge className="bg-yellow-500/20 text-yellow-400 border-0 text-xs">En attente</Badge>;
                case 'Approved':
                    return <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">Approuvé</Badge>;
                case 'Rejected':
                    return <Badge className="bg-red-500/20 text-red-400 border-0 text-xs">Rejeté</Badge>;
                case 'Implemented':
                    return <Badge className="bg-blue-500/20 text-blue-400 border-0 text-xs">Implémenté</Badge>;
                default:
                    return null;
            }
        } else if (activity.type === 'version') {
            if (activity.isBranch) {
                return <Badge className="bg-yellow-500/20 text-yellow-400 border-0 text-xs">Branche</Badge>;
            }
            return <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">{activity.versionName}</Badge>;
        }
        return null;
    };

    const getScenarioName = (scenarioId) => {
        const scenario = scenarios.find(s => s.id === scenarioId);
        return scenario?.scenario_name || 'Scénario inconnu';
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const past = new Date(timestamp);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'À l\'instant';
        if (diffMins < 60) return `Il y a ${diffMins}min`;
        if (diffHours < 24) return `Il y a ${diffHours}h`;
        return `Il y a ${diffDays}j`;
    };

    if (activities.length === 0) {
        return (
            <div className="text-center py-12">
                <Activity className="w-16 h-16 text-[var(--nea-text-secondary)] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[var(--nea-text-title)] mb-2">
                    Aucune activité récente
                </h3>
                <p className="text-[var(--nea-text-secondary)]">
                    Les activités collaboratives apparaîtront ici en temps réel
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <AnimatePresence>
                {activities.map((activity, index) => {
                    const Icon = getActivityIcon(activity);
                    const color = getActivityColor(activity);

                    return (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.03 }}
                        >
                            <div className="p-4 rounded-lg bg-[var(--nea-bg-surface)] border border-[var(--nea-border-subtle)] hover:border-[var(--nea-primary-blue)] transition-all">
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={`p-2 rounded-lg bg-[var(--nea-bg-surface-hover)] ${color} flex-shrink-0`}>
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        {/* Header */}
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-semibold text-[var(--nea-text-primary)] text-sm">
                                                    {activity.userName}
                                                </span>
                                                <span className="text-xs text-[var(--nea-text-secondary)]">
                                                    {activity.type === 'collaboration' ? (
                                                        activity.subType === 'Comment' ? 'a commenté' :
                                                        activity.subType === 'Edit' ? 'a proposé une édition' :
                                                        'a suggéré'
                                                    ) : (
                                                        activity.isBranch ? 'a créé une branche' : 'a créé une version'
                                                    )}
                                                </span>
                                                {getStatusBadge(activity)}
                                            </div>
                                            <span className="text-xs text-[var(--nea-text-muted)] flex items-center gap-1 flex-shrink-0">
                                                <Clock className="w-3 h-3" />
                                                {getTimeAgo(activity.timestamp)}
                                            </span>
                                        </div>

                                        {/* Scenario Name */}
                                        <Link to={`${createPageUrl('CollaborativeScenarioView')}?id=${activity.scenarioId}`}>
                                            <div className="flex items-center gap-2 mb-2 hover:text-[var(--nea-primary-blue)] transition-colors">
                                                <span className="text-xs font-semibold text-[var(--nea-text-primary)]">
                                                    📋 {getScenarioName(activity.scenarioId)}
                                                </span>
                                                <ExternalLink className="w-3 h-3" />
                                            </div>
                                        </Link>

                                        {/* Section Tag (for collaborations) */}
                                        {activity.targetSection && (
                                            <Badge variant="outline" className="text-xs mb-2">
                                                {activity.targetSection.replace(/_/g, ' ')}
                                            </Badge>
                                        )}

                                        {/* Content */}
                                        <p className="text-sm text-[var(--nea-text-secondary)] mb-2 line-clamp-2">
                                            {activity.content}
                                        </p>

                                        {/* Edit Proposal Preview */}
                                        {activity.type === 'collaboration' && activity.data.edit_proposal && (
                                            <div className="p-2 rounded bg-purple-500/10 border border-purple-500/30 text-xs mb-2">
                                                <span className="text-purple-400 font-semibold">
                                                    {activity.data.edit_proposal.field}:
                                                </span>
                                                <span className="text-[var(--nea-text-secondary)] ml-2">
                                                    {activity.data.edit_proposal.proposed_value}
                                                </span>
                                            </div>
                                        )}

                                        {/* Version Diff Preview */}
                                        {activity.type === 'version' && activity.data.diff_from_previous && (
                                            <div className="flex gap-2 text-xs">
                                                {activity.data.diff_from_previous.added?.length > 0 && (
                                                    <Badge className="bg-green-500/20 text-green-400 border-0">
                                                        +{activity.data.diff_from_previous.added.length}
                                                    </Badge>
                                                )}
                                                {activity.data.diff_from_previous.modified?.length > 0 && (
                                                    <Badge className="bg-yellow-500/20 text-yellow-400 border-0">
                                                        ~{activity.data.diff_from_previous.modified.length}
                                                    </Badge>
                                                )}
                                                {activity.data.diff_from_previous.deleted?.length > 0 && (
                                                    <Badge className="bg-red-500/20 text-red-400 border-0">
                                                        -{activity.data.diff_from_previous.deleted.length}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}

                                        {/* Action Button */}
                                        <div className="mt-3">
                                            <Link to={`${createPageUrl('CollaborativeScenarioView')}?id=${activity.scenarioId}`}>
                                                <NeaButton size="sm" variant="ghost" className="text-xs">
                                                    <ExternalLink className="w-3 h-3 mr-1" />
                                                    Voir dans le scénario
                                                </NeaButton>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
