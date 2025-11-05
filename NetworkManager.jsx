import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Activity, Wifi, WifiOff, Plus, Signal, Server, Shield } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import NetworkConnectionManager from '../components/network/NetworkConnectionManager';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';

const CONNECTION_STATUS_COLORS = {
    'Connected': { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400', icon: Wifi },
    'Disconnected': { bg: 'bg-gray-500/10', border: 'border-gray-500/20', text: 'text-gray-400', icon: WifiOff },
    'Connecting': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', icon: Signal },
    'Error': { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', icon: WifiOff }
};

const SECURITY_LEVEL_COLORS = {
    'Level_1_Public': 'text-blue-400',
    'Level_2_Secured': 'text-yellow-400',
    'Level_3_Classified': 'text-red-400'
};

export default function NetworkManager() {
    const [connections, setConnections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        loadConnections();
        
        // Auto-refresh toutes les 15 secondes
        const interval = setInterval(loadConnections, 15000);
        return () => clearInterval(interval);
    }, []);

    const loadConnections = async () => {
        try {
            const data = await base44.entities.NetworkConnection.list('-last_connected');
            setConnections(data);
        } catch (error) {
            console.error("Erreur chargement connexions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = useMemo(() => ({
        total: connections.length,
        connected: connections.filter(c => c.status === 'Connected').length,
        disconnected: connections.filter(c => c.status === 'Disconnected').length,
        connecting: connections.filter(c => c.status === 'Connecting').length,
        encrypted: connections.filter(c => c.encryption_enabled === true).length,
        totalBandwidth: connections
            .filter(c => c.status === 'Connected')
            .reduce((sum, c) => sum + (c.bandwidth_limit_mbps || 0), 0)
    }), [connections]);

    const connectionsByType = useMemo(() => {
        return connections.reduce((acc, conn) => {
            acc[conn.connection_type] = (acc[conn.connection_type] || 0) + 1;
            return acc;
        }, {});
    }, [connections]);

    if (isLoading) {
        return <LoadingTransition message="Chargement du gestionnaire réseau..." />;
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Gestionnaire Réseau", href: "NetworkManager" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Activity className="w-8 h-8 text-green-400" />}
                    title="Gestionnaire Réseau"
                    subtitle="Surveillance et gestion des connexions réseau"
                />
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-5 gap-4">
                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-5 h-5 text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Connexions</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Wifi className="w-5 h-5 text-green-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Connectées</p>
                    </div>
                    <p className="text-3xl font-bold text-green-400">{stats.connected}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Signal className="w-5 h-5 text-yellow-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">En cours</p>
                    </div>
                    <p className="text-3xl font-bold text-yellow-400">{stats.connecting}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-purple-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Chiffrées</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-400">{stats.encrypted}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Server className="w-5 h-5 text-cyan-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Bande Passante</p>
                    </div>
                    <p className="text-3xl font-bold text-cyan-400">{stats.totalBandwidth}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Mbps actifs</p>
                </NeaCard>
            </motion.div>

            {/* Types de Connexion */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                            Répartition par Type
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-4 gap-4">
                            {Object.entries(connectionsByType).map(([type, count]) => (
                                <div 
                                    key={type}
                                    className="text-center p-4 bg-[var(--nea-bg-surface-hover)] rounded-lg border border-[var(--nea-border-subtle)]"
                                >
                                    <p className="text-2xl font-bold text-[var(--nea-primary-blue)]">{count}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{type}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </NeaCard>
            </motion.div>

            {/* Liste des Connexions */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 dark:text-white">
                                Connexions Réseau
                            </h3>
                            <Badge className="bg-[var(--nea-primary-blue)]/20 text-[var(--nea-primary-blue)] border-0">
                                {connections.length} connexions
                            </Badge>
                        </div>
                    </div>
                    <div className="p-6">
                        {connections.length === 0 ? (
                            <div className="text-center py-12">
                                <Activity className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Aucune connexion réseau
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Configurez une nouvelle connexion pour commencer
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {connections.map((connection, index) => {
                                    const statusConfig = CONNECTION_STATUS_COLORS[connection.status] || CONNECTION_STATUS_COLORS['Disconnected'];
                                    const StatusIcon = statusConfig.icon;

                                    return (
                                        <motion.div
                                            key={connection.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`p-5 rounded-lg border ${statusConfig.border} ${statusConfig.bg}`}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <StatusIcon className={`w-8 h-8 ${statusConfig.text}`} />
                                                    <div>
                                                        <h4 className="font-bold text-[var(--nea-text-title)] mb-1">
                                                            {connection.connection_name}
                                                        </h4>
                                                        <div className="flex items-center gap-2">
                                                            <Badge className={`border-0 text-xs ${statusConfig.text} bg-transparent border border-current`}>
                                                                {connection.status}
                                                            </Badge>
                                                            <Badge variant="outline" className="text-xs">
                                                                {connection.connection_type}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge className={`${SECURITY_LEVEL_COLORS[connection.security_level]} bg-transparent border border-current text-xs`}>
                                                    {connection.security_level.replace(/_/g, ' ')}
                                                </Badge>
                                            </div>

                                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                                                {connection.ip_address && (
                                                    <div>
                                                        <span className="text-[var(--nea-text-secondary)]">IP:</span>
                                                        <span className="ml-1 font-mono font-semibold text-[var(--nea-text-primary)]">
                                                            {connection.ip_address}
                                                        </span>
                                                    </div>
                                                )}
                                                {connection.gateway && (
                                                    <div>
                                                        <span className="text-[var(--nea-text-secondary)]">Gateway:</span>
                                                        <span className="ml-1 font-mono font-semibold text-[var(--nea-text-primary)]">
                                                            {connection.gateway}
                                                        </span>
                                                    </div>
                                                )}
                                                {connection.bandwidth_limit_mbps && (
                                                    <div>
                                                        <span className="text-[var(--nea-text-secondary)]">Bande passante:</span>
                                                        <span className="ml-1 font-semibold text-[var(--nea-text-primary)]">
                                                            {connection.bandwidth_limit_mbps} Mbps
                                                        </span>
                                                    </div>
                                                )}
                                                {connection.last_connected && (
                                                    <div>
                                                        <span className="text-[var(--nea-text-secondary)]">Dernière connexion:</span>
                                                        <span className="ml-1 font-semibold text-[var(--nea-text-primary)]">
                                                            {new Date(connection.last_connected).toLocaleTimeString('fr-CA')}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Autorisations Volets */}
                                            <div className="mt-4 pt-4 border-t border-[var(--nea-border-subtle)]">
                                                <p className="text-xs text-[var(--nea-text-secondary)] mb-2">Autorisations:</p>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={`text-xs border-0 ${
                                                        connection.authorization_volet_1 
                                                            ? 'bg-green-500/20 text-green-400' 
                                                            : 'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                        Volet 1 {connection.authorization_volet_1 ? '✓' : '✗'}
                                                    </Badge>
                                                    <Badge className={`text-xs border-0 ${
                                                        connection.authorization_volet_2 
                                                            ? 'bg-green-500/20 text-green-400' 
                                                            : 'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                        Volet 2 {connection.authorization_volet_2 ? '✓' : '✗'}
                                                    </Badge>
                                                    <Badge className={`text-xs border-0 ${
                                                        connection.authorization_volet_3 
                                                            ? 'bg-green-500/20 text-green-400' 
                                                            : 'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                        Volet 3 {connection.authorization_volet_3 ? '✓' : '✗'}
                                                    </Badge>
                                                    {connection.encryption_enabled && (
                                                        <Badge className="bg-purple-500/20 text-purple-400 border-0 text-xs">
                                                            <Shield className="w-3 h-3 mr-1" />
                                                            Chiffré
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </NeaCard>
            </motion.div>
        </motion.div>
    );
}