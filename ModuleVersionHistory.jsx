import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Clock, User, GitBranch, RotateCcw, Check, X } from 'lucide-react';
import NeaCard from '../ui/NeaCard';
import NeaButton from '../ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ModuleVersionHistory({ module, onRestore }) {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVersion, setSelectedVersion] = useState(null);

    useEffect(() => {
        loadHistory();
    }, [module.id]);

    const loadHistory = async () => {
        setIsLoading(true);
        try {
            // Simuler l'historique basé sur les audits
            const mockHistory = [
                {
                    version: module.version,
                    timestamp: module.last_audit || new Date().toISOString(),
                    modified_by: module.created_by,
                    changes: ['Version actuelle'],
                    status: module.status
                }
            ];
            setHistory(mockHistory);
        } catch (error) {
            console.error("Erreur chargement historique:", error);
            toast.error("Impossible de charger l'historique");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestore = async (version) => {
        if (window.confirm(`Restaurer la version ${version.version} ? Cette action est irréversible.`)) {
            try {
                await onRestore(version);
                toast.success("Version restaurée avec succès");
                loadHistory();
            } catch (error) {
                console.error("Erreur restauration:", error);
                toast.error("Échec de la restauration");
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'text-green-400';
            case 'Standby': return 'text-yellow-400';
            case 'Testing': return 'text-orange-400';
            case 'Disabled': return 'text-gray-400';
            default: return 'text-gray-400';
        }
    };

    if (isLoading) {
        return (
            <NeaCard className="p-6">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
                </div>
            </NeaCard>
        );
    }

    return (
        <NeaCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <History className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-bold text-[var(--nea-text-title)]">
                    Historique des Versions
                </h3>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {history.map((version, index) => (
                        <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={`p-4 rounded-lg border-2 transition-all ${
                                selectedVersion === version
                                    ? 'border-cyan-500 bg-cyan-500/10'
                                    : 'border-[var(--nea-border-default)] bg-[var(--nea-bg-surface-hover)]'
                            }`}
                            onClick={() => setSelectedVersion(version)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <GitBranch className="w-4 h-4 text-cyan-400" />
                                        <span className="font-bold text-[var(--nea-text-title)]">
                                            Version {version.version}
                                        </span>
                                        {index === 0 && (
                                            <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                                                ACTUELLE
                                            </Badge>
                                        )}
                                        <Badge className={`border-0 text-xs ${getStatusColor(version.status)}`}>
                                            {version.status}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-[var(--nea-text-secondary)] mb-3">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(version.timestamp).toLocaleString('fr-CA')}
                                        </div>
                                        {version.modified_by && (
                                            <div className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                {version.modified_by}
                                            </div>
                                        )}
                                    </div>

                                    {version.changes && version.changes.length > 0 && (
                                        <div className="space-y-1">
                                            {version.changes.map((change, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-xs">
                                                    <Check className="w-3 h-3 text-green-400" />
                                                    <span className="text-[var(--nea-text-secondary)]">{change}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {index !== 0 && (
                                    <NeaButton
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRestore(version);
                                        }}
                                        className="ml-4"
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Restaurer
                                    </NeaButton>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {history.length === 0 && (
                <div className="text-center py-8">
                    <History className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-[var(--nea-text-secondary)]">
                        Aucun historique disponible
                    </p>
                </div>
            )}
        </NeaCard>
    );
}