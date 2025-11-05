import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { HardDrive, Plus, CheckCircle, AlertCircle, Clock, Database } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import BackupCard from '../components/backup/BackupCard';
import CreateBackupModal from '../components/backup/CreateBackupModal';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';

export default function BackupManager() {
    const [backups, setBackups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        loadBackups();
    }, []);

    const loadBackups = async () => {
        try {
            const data = await base44.entities.BackupLog.list('-start_time');
            setBackups(data);
        } catch (error) {
            console.error("Erreur chargement backups:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = useMemo(() => ({
        total: backups.length,
        completed: backups.filter(b => b.status === 'Completed').length,
        failed: backups.filter(b => b.status === 'Failed').length,
        inProgress: backups.filter(b => b.status === 'In_Progress').length,
        totalSize: backups
            .filter(b => b.status === 'Completed')
            .reduce((sum, b) => sum + (b.total_size_mb || 0), 0),
        avgDuration: backups.filter(b => b.status === 'Completed' && b.duration_seconds).length > 0
            ? Math.round(
                backups
                    .filter(b => b.status === 'Completed' && b.duration_seconds)
                    .reduce((sum, b) => sum + b.duration_seconds, 0) / 
                backups.filter(b => b.status === 'Completed' && b.duration_seconds).length
              )
            : 0
    }), [backups]);

    if (isLoading) {
        return <LoadingTransition message="Chargement du gestionnaire de backups..." />;
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Gestionnaire de Backups", href: "BackupManager" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<HardDrive className="w-8 h-8 text-purple-400" />}
                    title="Gestionnaire de Backups"
                    subtitle="Sauvegarde et restauration des données système"
                    actions={
                        <NeaButton onClick={() => setShowCreateModal(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Créer Backup
                        </NeaButton>
                    }
                />
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-5 gap-4">
                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <HardDrive className="w-5 h-5 text-purple-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Backups Totaux</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-400">{stats.total}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Complétés</p>
                    </div>
                    <p className="text-3xl font-bold text-green-400">{stats.completed}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Échecs</p>
                    </div>
                    <p className="text-3xl font-bold text-red-400">{stats.failed}</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Database className="w-5 h-5 text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Taille Totale</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">
                        {(stats.totalSize / 1024).toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">GB sauvegardés</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5 text-yellow-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Durée Moyenne</p>
                    </div>
                    <p className="text-3xl font-bold text-yellow-400">
                        {Math.floor(stats.avgDuration / 60)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">minutes</p>
                </NeaCard>
            </motion.div>

            {/* Liste des Backups */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                            Historique des Sauvegardes
                        </h3>
                    </div>
                    <div className="p-6">
                        {backups.length === 0 ? (
                            <div className="text-center py-12">
                                <HardDrive className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Aucune sauvegarde
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Créez votre première sauvegarde système
                                </p>
                                <NeaButton onClick={() => setShowCreateModal(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Créer Backup
                                </NeaButton>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {backups.map((backup, index) => (
                                    <motion.div
                                        key={backup.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)] hover:border-[var(--nea-primary-blue)] transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge className="bg-gray-500/20 text-gray-400 border-0 text-xs">
                                                        {backup.backup_type.replace(/_/g, ' ')}
                                                    </Badge>
                                                    <Badge className={`border-0 text-xs ${
                                                        backup.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                                                        backup.status === 'Failed' ? 'bg-red-500/20 text-red-400' :
                                                        backup.status === 'In_Progress' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                        {backup.status}
                                                    </Badge>
                                                    {backup.encryption_enabled && (
                                                        <Badge className="bg-purple-500/20 text-purple-400 border-0 text-xs">
                                                            Chiffré
                                                        </Badge>
                                                    )}
                                                    {backup.auto_backup && (
                                                        <Badge className="bg-cyan-500/20 text-cyan-400 border-0 text-xs">
                                                            Auto
                                                        </Badge>
                                                    )}
                                                </div>
                                                <h4 className="font-semibold text-[var(--nea-text-title)] mb-1">
                                                    {backup.backup_name}
                                                </h4>
                                            </div>
                                            <div className="text-right ml-4">
                                                <div className="text-2xl font-bold text-[var(--nea-primary-blue)]">
                                                    {backup.total_size_mb >= 1024 
                                                        ? `${(backup.total_size_mb / 1024).toFixed(1)} GB`
                                                        : `${backup.total_size_mb} MB`
                                                    }
                                                </div>
                                                <div className="text-xs text-[var(--nea-text-secondary)]">
                                                    Taille
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-4 gap-3 text-xs">
                                            <div>
                                                <span className="text-[var(--nea-text-secondary)]">Destination:</span>
                                                <span className="ml-1 font-semibold text-[var(--nea-text-primary)]">
                                                    {backup.destination?.destination_type?.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                            {backup.duration_seconds && (
                                                <div>
                                                    <span className="text-[var(--nea-text-secondary)]">Durée:</span>
                                                    <span className="ml-1 font-semibold text-[var(--nea-text-primary)]">
                                                        {Math.floor(backup.duration_seconds / 60)}m {backup.duration_seconds % 60}s
                                                    </span>
                                                </div>
                                            )}
                                            {backup.compression_ratio && (
                                                <div>
                                                    <span className="text-[var(--nea-text-secondary)]">Compression:</span>
                                                    <span className="ml-1 font-semibold text-green-400">
                                                        {backup.compression_ratio}x
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-[var(--nea-text-secondary)]">Heure:</span>
                                                <span className="ml-1 font-semibold text-[var(--nea-text-primary)]">
                                                    {new Date(backup.start_time).toLocaleTimeString('fr-CA')}
                                                </span>
                                            </div>
                                        </div>

                                        {backup.error_log && (
                                            <div className="mt-3 pt-3 border-t border-[var(--nea-border-subtle)]">
                                                <p className="text-xs text-red-400 italic flex items-center gap-2">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {backup.error_log}
                                                </p>
                                            </div>
                                        )}

                                        {backup.verification_hash && (
                                            <div className="mt-3 pt-3 border-t border-[var(--nea-border-subtle)]">
                                                <p className="text-xs text-[var(--nea-text-secondary)]">
                                                    Hash: <span className="font-mono text-[var(--nea-text-muted)]">{backup.verification_hash}</span>
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

            {showCreateModal && (
                <CreateBackupModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        loadBackups();
                        setShowCreateModal(false);
                    }}
                />
            )}
        </motion.div>
    );
}