import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Activity, MessageSquare, Edit, History, Eye, Filter, RefreshCw } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import ActivityFeed from '../components/collaboration/ActivityFeed';
import ActivityFilters from '../components/collaboration/ActivityFilters';
import PresenceIndicator from '../components/collaboration/PresenceIndicator';

export default function CollaborationDashboard() {
    const [collaborations, setCollaborations] = useState([]);
    const [versions, setVersions] = useState([]);
    const [scenarios, setScenarios] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        scenario: 'all',
        user: 'all',
        actionType: 'all',
        timeframe: '24h'
    });
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        loadAllData();
        
        // Auto-refresh every 10 seconds
        const interval = setInterval(() => {
            loadAllData();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const loadAllData = async () => {
        try {
            const [collabData, versionData, scenarioData] = await Promise.all([
                base44.entities.ScenarioCollaboration.list('-created_date', 100),
                base44.entities.ScenarioVersion.list('-created_date', 50),
                base44.entities.Scenario.list('-updated_date', 50)
            ]);

            setCollaborations(collabData || []);
            setVersions(versionData || []);
            setScenarios(scenarioData || []);

            // Extract active users from recent collaborations
            const recentUsers = extractActiveUsers(collabData);
            setActiveUsers(recentUsers);
        } catch (error) {
            console.error('Error loading collaboration data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const extractActiveUsers = (collabs) => {
        const cutoff = new Date(Date.now() - 60 * 60 * 1000); // Last hour
        const recentCollabs = collabs.filter(c => 
            new Date(c.created_date) >= cutoff
        );

        const userMap = new Map();
        recentCollabs.forEach(collab => {
            if (!userMap.has(collab.user_email)) {
                userMap.set(collab.user_email, {
                    email: collab.user_email,
                    name: collab.user_name,
                    lastActivity: collab.created_date,
                    scenarioId: collab.scenario_id
                });
            }
        });

        return Array.from(userMap.values());
    };

    const getFilteredActivities = () => {
        const cutoffHours = filters.timeframe === '24h' ? 24 : 
                           filters.timeframe === '7d' ? 168 : 
                           filters.timeframe === '30d' ? 720 : 24;
        const cutoff = new Date(Date.now() - cutoffHours * 60 * 60 * 1000);

        // Combine collaborations and versions into a single activity stream
        let activities = [];

        // Add collaborations
        collaborations.forEach(collab => {
            if (new Date(collab.created_date) >= cutoff) {
                activities.push({
                    id: collab.id,
                    type: 'collaboration',
                    subType: collab.collaboration_type,
                    scenarioId: collab.scenario_id,
                    userEmail: collab.user_email,
                    userName: collab.user_name,
                    content: collab.content,
                    targetSection: collab.target_section,
                    status: collab.status,
                    timestamp: collab.created_date,
                    data: collab
                });
            }
        });

        // Add version changes
        versions.forEach(version => {
            if (new Date(version.created_date) >= cutoff) {
                activities.push({
                    id: version.id,
                    type: 'version',
                    subType: version.change_type,
                    scenarioId: version.scenario_id,
                    userEmail: version.modified_by,
                    userName: version.modified_by.split('@')[0],
                    content: version.change_summary,
                    versionName: version.version_name,
                    isBranch: version.is_branch,
                    timestamp: version.created_date,
                    data: version
                });
            }
        });

        // Sort by timestamp (most recent first)
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Apply filters
        if (filters.scenario !== 'all') {
            activities = activities.filter(a => a.scenarioId === filters.scenario);
        }

        if (filters.user !== 'all') {
            activities = activities.filter(a => a.userEmail === filters.user);
        }

        if (filters.actionType !== 'all') {
            if (filters.actionType === 'comments') {
                activities = activities.filter(a => 
                    a.type === 'collaboration' && a.subType === 'Comment'
                );
            } else if (filters.actionType === 'edits') {
                activities = activities.filter(a => 
                    a.type === 'collaboration' && a.subType === 'Edit'
                );
            } else if (filters.actionType === 'versions') {
                activities = activities.filter(a => a.type === 'version');
            }
        }

        return activities;
    };

    const stats = {
        totalActivities: collaborations.length + versions.length,
        recentComments: collaborations.filter(c => 
            c.collaboration_type === 'Comment' && 
            new Date(c.created_date) >= new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length,
        pendingProposals: collaborations.filter(c => 
            c.collaboration_type === 'Edit' && c.status === 'Pending'
        ).length,
        activeScenarios: new Set(collaborations.map(c => c.scenario_id)).size,
        activeUsers: activeUsers.length,
        recentVersions: versions.filter(v => 
            new Date(v.created_date) >= new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length
    };

    const filteredActivities = getFilteredActivities();

    if (isLoading) {
        return <LoadingTransition message="Chargement du tableau de collaboration..." />;
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[
                    { name: "Collaboration" },
                    { name: "Tableau de Collaboration", href: "CollaborationDashboard" }
                ]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Users className="w-8 h-8 text-purple-400" />}
                    title="Tableau de Collaboration Temps Réel"
                    subtitle="Vue centralisée de toutes les activités collaboratives"
                    actions={
                        <NeaButton variant="secondary" onClick={loadAllData}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Actualiser
                        </NeaButton>
                    }
                />
            </motion.div>

            {/* Stats Overview */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                <NeaCard className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-5 h-5 text-purple-400" />
                        <p className="text-sm text-[var(--nea-text-secondary)]">Activités Totales</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-400">{stats.totalActivities}</p>
                </NeaCard>

                <NeaCard className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
                    <div className="flex items-center gap-3 mb-2">
                        <MessageSquare className="w-5 h-5 text-blue-400" />
                        <p className="text-sm text-[var(--nea-text-secondary)]">Commentaires 24h</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">{stats.recentComments}</p>
                </NeaCard>

                <NeaCard className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/30">
                    <div className="flex items-center gap-3 mb-2">
                        <Edit className="w-5 h-5 text-yellow-400" />
                        <p className="text-sm text-[var(--nea-text-secondary)]">Propositions</p>
                    </div>
                    <p className="text-3xl font-bold text-yellow-400">{stats.pendingProposals}</p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">en attente</p>
                </NeaCard>

                <NeaCard className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
                    <div className="flex items-center gap-3 mb-2">
                        <History className="w-5 h-5 text-green-400" />
                        <p className="text-sm text-[var(--nea-text-secondary)]">Versions 24h</p>
                    </div>
                    <p className="text-3xl font-bold text-green-400">{stats.recentVersions}</p>
                </NeaCard>

                <NeaCard className="p-4 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/30">
                    <div className="flex items-center gap-3 mb-2">
                        <Eye className="w-5 h-5 text-cyan-400" />
                        <p className="text-sm text-[var(--nea-text-secondary)]">Scénarios Actifs</p>
                    </div>
                    <p className="text-3xl font-bold text-cyan-400">{stats.activeScenarios}</p>
                </NeaCard>

                <NeaCard className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/30">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-orange-400" />
                        <p className="text-sm text-[var(--nea-text-secondary)]">Utilisateurs</p>
                    </div>
                    <p className="text-3xl font-bold text-orange-400">{stats.activeUsers}</p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">actifs (1h)</p>
                </NeaCard>
            </motion.div>

            {/* Active Users Presence */}
            <motion.div variants={itemVariants}>
                <PresenceIndicator 
                    activeUsers={activeUsers}
                    scenarios={scenarios}
                />
            </motion.div>

            {/* Filters */}
            <motion.div variants={itemVariants}>
                <ActivityFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    scenarios={scenarios}
                    collaborations={collaborations}
                />
            </motion.div>

            {/* Live Activity Feed */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)] bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Activity className="w-6 h-6 text-purple-400" />
                                <div>
                                    <h3 className="font-bold text-[var(--nea-text-title)]">
                                        Flux d'Activités en Direct
                                    </h3>
                                    <p className="text-xs text-[var(--nea-text-secondary)]">
                                        {filteredActivities.length} activité{filteredActivities.length > 1 ? 's' : ''} • 
                                        Actualisation automatique toutes les 10s
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-xs text-green-400 font-semibold">DIRECT</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <ActivityFeed
                            activities={filteredActivities}
                            scenarios={scenarios}
                            onRefresh={loadAllData}
                        />
                    </div>
                </NeaCard>
            </motion.div>
        </motion.div>
    );
}