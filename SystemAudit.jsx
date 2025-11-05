import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ShieldCheck, RefreshCw, Search, CheckCircle, AlertTriangle } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { toast } from 'sonner';

export default function SystemAudit() {
    const [auditLogs, setAuditLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const { containerVariants, itemVariants } = useStaggerAnimation();

    const loadAuditLogs = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await base44.entities.DataIntegrityCheck.list('-check_timestamp', 50);
            setAuditLogs(data);
        } catch (error) {
            console.error("Erreur chargement audits:", error);
            toast.error("Échec du chargement");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAuditLogs();
    }, [loadAuditLogs]);

    const filteredLogs = auditLogs.filter(log => {
        const matchesSearch = log.entity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.check_type?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: auditLogs.length,
        passed: auditLogs.filter(l => l.status === 'Pass').length,
        failed: auditLogs.filter(l => l.status === 'Fail').length,
        warnings: auditLogs.filter(l => l.status === 'Warning').length
    };

    const statusColors = {
        'Pass': 'bg-green-500/20 text-green-400 border-green-500/30',
        'Fail': 'bg-red-500/20 text-red-400 border-red-500/30',
        'Warning': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'Skipped': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        'Repaired': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };

    if (isLoading) {
        return <LoadingTransition message="Chargement de l'audit système..." />;
    }

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Audit Système", href: "SystemAudit" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<ShieldCheck className="w-8 h-8 text-green-400" />}
                    title="Audit Système"
                    subtitle="Vérification d'intégrité et conformité"
                    actions={
                        <NeaButton onClick={loadAuditLogs}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Actualiser
                        </NeaButton>
                    }
                />
            </motion.div>

            <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Vérifications</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </NeaCard>
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Réussies</p>
                    <p className="text-3xl font-bold text-green-400">{stats.passed}</p>
                </NeaCard>
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Échecs</p>
                    <p className="text-3xl font-bold text-red-400">{stats.failed}</p>
                </NeaCard>
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avertissements</p>
                    <p className="text-3xl font-bold text-yellow-400">{stats.warnings}</p>
                </NeaCard>
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <Input
                                    placeholder="Rechercher un audit..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white pl-10"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-48 bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white">
                                    <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous statuts</SelectItem>
                                    <SelectItem value="Pass">Réussi</SelectItem>
                                    <SelectItem value="Fail">Échec</SelectItem>
                                    <SelectItem value="Warning">Avertissement</SelectItem>
                                    <SelectItem value="Repaired">Réparé</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="divide-y divide-[var(--nea-border-subtle)] max-h-[600px] overflow-y-auto styled-scrollbar">
                        {filteredLogs.map((log, index) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className="p-4 hover:bg-[var(--nea-bg-surface-hover)] transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {log.status === 'Pass' && <CheckCircle className="w-5 h-5 text-green-400" />}
                                            {log.status === 'Fail' && <AlertTriangle className="w-5 h-5 text-red-400" />}
                                            {log.status === 'Warning' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {log.entity_name}
                                            </h4>
                                            <Badge className={statusColors[log.status]}>
                                                {log.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            Type: {log.check_type}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                                            <span>Score: {log.integrity_score}%</span>
                                            <span>•</span>
                                            <span>{new Date(log.check_timestamp).toLocaleString('fr-CA')}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </NeaCard>
            </motion.div>
        </motion.div>
    );
}