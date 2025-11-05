import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Lock, Activity, Eye, Search, Filter } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SecurityMonitor from '../components/security/SecurityMonitor';
import ThreatDashboard from '../components/security/ThreatDashboard';
import IPBlacklistManager from '../components/security/IPBlacklistManager';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SEVERITY_COLORS = {
    'Critique': '#ef4444',
    'Élevé': '#f97316',
    'Moyen': '#eab308',
    'Faible': '#3b82f6',
    'Info': '#6b7280'
};

export default function Security() {
    const [incidents, setIncidents] = useState([]);
    const [blacklist, setBlacklist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSeverity, setFilterSeverity] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [incidentsData, blacklistData] = await Promise.all([
                    base44.entities.SecurityIncident.list('-detected_timestamp'),
                    base44.entities.IPBlacklist.list('-ban_start')
                ]);
                setIncidents(incidentsData);
                setBlacklist(blacklistData);
            } catch (error) {
                console.error("Erreur chargement données sécurité:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredIncidents = useMemo(() => {
        return incidents.filter(incident => {
            const matchesSearch = incident.incident_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                incident.source_ip.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSeverity = filterSeverity === 'all' || incident.severity === filterSeverity;
            const matchesType = filterType === 'all' || incident.incident_type === filterType;
            
            return matchesSearch && matchesSeverity && matchesType;
        });
    }, [incidents, searchTerm, filterSeverity, filterType]);

    const stats = useMemo(() => ({
        total: incidents.length,
        critical: incidents.filter(i => i.severity === 'Critique').length,
        blocked: incidents.filter(i => i.blocked === true).length,
        avgThreatScore: incidents.length > 0 
            ? Math.round(incidents.reduce((sum, i) => sum + i.threat_score, 0) / incidents.length)
            : 0,
        blacklistedIPs: blacklist.length
    }), [incidents, blacklist]);

    const incidentsBySeverity = useMemo(() => {
        const severityCount = {};
        incidents.forEach(incident => {
            severityCount[incident.severity] = (severityCount[incident.severity] || 0) + 1;
        });
        return Object.entries(severityCount).map(([severity, count]) => ({
            name: severity,
            value: count
        }));
    }, [incidents]);

    const incidentsByType = useMemo(() => {
        const typeCount = {};
        incidents.forEach(incident => {
            typeCount[incident.incident_type] = (typeCount[incident.incident_type] || 0) + 1;
        });
        return Object.entries(typeCount)
            .map(([type, count]) => ({ type, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }, [incidents]);

    const incidentTypes = useMemo(() => {
        return [...new Set(incidents.map(i => i.incident_type))];
    }, [incidents]);

    if (isLoading) {
        return <LoadingTransition message="Chargement du hub sécurité..." />;
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Hub Sécurité", href: "Security" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Shield className="w-8 h-8 text-red-400" />}
                    title="Hub Sécurité"
                    subtitle="Surveillance et réponse aux incidents de sécurité"
                />
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-5 gap-4">
                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Incidents Totaux</p>
                    </div>
                    <p className="text-3xl font-bold text-red-400">{stats.total}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Critiques</p>
                    </div>
                    <p className="text-3xl font-bold text-orange-400">{stats.critical}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-green-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Bloqués</p>
                    </div>
                    <p className="text-3xl font-bold text-green-400">{stats.blocked}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-5 h-5 text-purple-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Score Menace Moy.</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-400">{stats.avgThreatScore}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Lock className="w-5 h-5 text-yellow-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">IPs Blacklistées</p>
                    </div>
                    <p className="text-3xl font-bold text-yellow-400">{stats.blacklistedIPs}</p>
                </NeaCard>
            </motion.div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)]">
                            <h3 className="font-bold text-gray-900 dark:text-white">
                                Incidents par Sévérité
                            </h3>
                        </div>
                        <div className="p-6">
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={incidentsBySeverity}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={(entry) => `${entry.name}: ${entry.value}`}
                                    >
                                        {incidentsBySeverity.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name] || '#6b7280'} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--nea-bg-surface)',
                                            border: '1px solid var(--nea-border-default)',
                                            borderRadius: '8px',
                                            color: 'var(--nea-text-primary)'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </NeaCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)]">
                            <h3 className="font-bold text-gray-900 dark:text-white">
                                Top 10 Types d'Incidents
                            </h3>
                        </div>
                        <div className="p-6">
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={incidentsByType}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--nea-border-subtle)" />
                                    <XAxis 
                                        dataKey="type" 
                                        stroke="var(--nea-text-secondary)"
                                        tick={{ fill: 'var(--nea-text-secondary)', fontSize: 9 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={100}
                                    />
                                    <YAxis 
                                        stroke="var(--nea-text-secondary)"
                                        tick={{ fill: 'var(--nea-text-secondary)', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--nea-bg-surface)',
                                            border: '1px solid var(--nea-border-default)',
                                            borderRadius: '8px',
                                            color: 'var(--nea-text-primary)'
                                        }}
                                    />
                                    <Bar dataKey="count" fill="hsl(0, 70%, 60%)" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </NeaCard>
                </motion.div>
            </div>

            {/* Filtres */}
            <motion.div variants={itemVariants}>
                <NeaCard className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-[var(--nea-primary-blue)]" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Filtres et Recherche</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Rechercher incident ou IP..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sévérité" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les sévérités</SelectItem>
                                <SelectItem value="Critique">Critique</SelectItem>
                                <SelectItem value="Élevé">Élevé</SelectItem>
                                <SelectItem value="Moyen">Moyen</SelectItem>
                                <SelectItem value="Faible">Faible</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Type d'incident" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les types</SelectItem>
                                {incidentTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {(searchTerm || filterSeverity !== 'all' || filterType !== 'all') && (
                        <div className="mt-3">
                            <Badge className="bg-[var(--nea-primary-blue)]/10 text-[var(--nea-primary-blue)] border-0">
                                {filteredIncidents.length} résultat{filteredIncidents.length > 1 ? 's' : ''}
                            </Badge>
                        </div>
                    )}
                </NeaCard>
            </motion.div>

            {/* Liste des Incidents */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Eye className="w-5 h-5 text-red-400" />
                                Incidents de Sécurité
                            </h3>
                            <Badge className="bg-red-500/20 text-red-400 border-0">
                                {filteredIncidents.length} incident{filteredIncidents.length > 1 ? 's' : ''}
                            </Badge>
                        </div>
                    </div>
                    <div className="p-6">
                        {filteredIncidents.length === 0 ? (
                            <div className="text-center py-12">
                                <Shield className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Aucun incident trouvé
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Le système est sécurisé
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredIncidents.map((incident, index) => (
                                    <motion.div
                                        key={incident.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)] hover:border-[var(--nea-primary-blue)] transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge className="bg-gray-500/20 text-gray-400 border-0 text-xs font-mono">
                                                        {incident.incident_id}
                                                    </Badge>
                                                    <Badge className={`border-0 text-xs ${
                                                        incident.severity === 'Critique' ? 'bg-red-500/20 text-red-400' :
                                                        incident.severity === 'Élevé' ? 'bg-orange-500/20 text-orange-400' :
                                                        incident.severity === 'Moyen' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                        {incident.severity}
                                                    </Badge>
                                                    {incident.blocked && (
                                                        <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                                                            Bloqué
                                                        </Badge>
                                                    )}
                                                </div>
                                                <h4 className="font-semibold text-[var(--nea-text-title)] mb-1">
                                                    {incident.incident_type.replace(/_/g, ' ')}
                                                </h4>
                                                <p className="text-sm text-[var(--nea-text-secondary)] mb-2">
                                                    {incident.attack_vector}
                                                </p>
                                            </div>
                                            <div className="text-right ml-4">
                                                <div className={`text-2xl font-bold ${
                                                    incident.threat_score >= 90 ? 'text-red-400' :
                                                    incident.threat_score >= 75 ? 'text-orange-400' :
                                                    incident.threat_score >= 50 ? 'text-yellow-400' :
                                                    'text-blue-400'
                                                }`}>
                                                    {incident.threat_score}
                                                </div>
                                                <div className="text-xs text-[var(--nea-text-secondary)]">
                                                    Score
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-3 text-xs">
                                            <div>
                                                <span className="text-[var(--nea-text-secondary)]">Source IP:</span>
                                                <span className="ml-1 font-mono font-semibold text-[var(--nea-text-primary)]">
                                                    {incident.source_ip}
                                                </span>
                                            </div>
                                            {incident.source_geolocation && (
                                                <div>
                                                    <span className="text-[var(--nea-text-secondary)]">Localisation:</span>
                                                    <span className="ml-1 font-semibold text-[var(--nea-text-primary)]">
                                                        {incident.source_geolocation.city}, {incident.source_geolocation.country}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-[var(--nea-text-secondary)]">Action:</span>
                                                <span className="ml-1 font-semibold text-[var(--nea-text-primary)]">
                                                    {incident.mitigation_action?.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                        </div>

                                        {incident.notes && (
                                            <div className="mt-3 pt-3 border-t border-[var(--nea-border-subtle)]">
                                                <p className="text-xs text-[var(--nea-text-secondary)] italic">
                                                    {incident.notes}
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </NeaCard>
            </motion.div>

            {/* IP Blacklist Manager */}
            <motion.div variants={itemVariants}>
                <IPBlacklistManager blacklist={blacklist} />
            </motion.div>
        </motion.div>
    );
}