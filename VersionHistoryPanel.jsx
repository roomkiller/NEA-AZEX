
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, History, RotateCcw, Eye, GitMerge, FileText } from 'lucide-react';
import NeaCard from '../ui/NeaCard';
import NeaButton from '../ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import collaborativeScenarioService from '../ai/CollaborativeScenarioService';

export default function VersionHistoryPanel({ scenarioId, onRestore }) {
    const [versions, setVersions] = useState([]);
    const [branches, setBranches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedVersion, setExpandedVersion] = useState(null);

    useEffect(() => {
        loadVersions();
    }, [scenarioId]);

    const loadVersions = async () => {
        try {
            const [versionData, branchData] = await Promise.all([
                collaborativeScenarioService.getVersionHistory(scenarioId),
                collaborativeScenarioService.getBranches(scenarioId)
            ]);
            setVersions(versionData);
            setBranches(branchData);
        } catch (error) {
            console.error('Error loading versions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestore = async (versionId) => {
        try {
            const restored = await collaborativeScenarioService.restoreVersion(versionId);
            toast.success('Version restaurée avec succès');
            loadVersions();
            if (onRestore) onRestore(restored);
        } catch (error) {
            console.error('Error restoring version:', error);
            toast.error('Erreur lors de la restauration');
        }
    };

    const handleMergeBranch = async (branchId) => {
        try {
            const merged = await collaborativeScenarioService.mergeBranch(branchId, 'Fusion de la branche what-if');
            toast.success('Branche fusionnée avec succès');
            loadVersions();
            if (onRestore) onRestore(merged);
        } catch (error) {
            console.error('Error merging branch:', error);
            toast.error('Erreur lors de la fusion');
        }
    };

    const getChangeTypeColor = (type) => {
        switch (type) {
            case 'Major': return 'bg-red-500/20 text-red-400';
            case 'Minor': return 'bg-blue-500/20 text-blue-400';
            case 'Patch': return 'bg-green-500/20 text-green-400';
            case 'AI_Enhancement': return 'bg-purple-500/20 text-purple-400';
            case 'Collaboration': return 'bg-cyan-500/20 text-cyan-400';
            case 'Branch': return 'bg-yellow-500/20 text-yellow-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="space-y-4">
            {/* Branches */}
            {branches.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <GitBranch className="w-5 h-5 text-yellow-400" />
                        <h4 className="font-semibold text-[var(--nea-text-primary)]">
                            Branches What-If ({branches.length})
                        </h4>
                    </div>
                    <div className="space-y-2">
                        {branches.map((branch) => (
                            <NeaCard key={branch.id} className="p-4 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border-yellow-500/30">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className="bg-yellow-500/20 text-yellow-400 border-0">
                                                {branch.branch_name}
                                            </Badge>
                                            <span className="text-xs text-[var(--nea-text-secondary)]">
                                                v{branch.version_number}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--nea-text-primary)] mb-1">
                                            {branch.branch_hypothesis}
                                        </p>
                                        <p className="text-xs text-[var(--nea-text-secondary)]">
                                            Par {branch.modified_by} • {new Date(branch.created_date).toLocaleString('fr-FR')}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <NeaButton
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => handleMergeBranch(branch.id)}
                                        >
                                            <GitMerge className="w-3 h-3 mr-1" />
                                            Fusionner
                                        </NeaButton>
                                    </div>
                                </div>
                            </NeaCard>
                        ))}
                    </div>
                </div>
            )}

            {/* Version History */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <History className="w-5 h-5 text-blue-400" />
                    <h4 className="font-semibold text-[var(--nea-text-primary)]">
                        Historique des Versions ({versions.length})
                    </h4>
                </div>
                <div className="space-y-2">
                    <AnimatePresence>
                        {versions.map((version, index) => (
                            <motion.div
                                key={version.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                <NeaCard className={`p-4 ${version.is_current ? 'border-2 border-blue-500' : ''}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className="font-bold text-[var(--nea-text-title)]">
                                                    {version.version_name}
                                                </span>
                                                {version.is_current && (
                                                    <Badge className="bg-blue-500/20 text-blue-400 border-0 text-xs">
                                                        ACTUELLE
                                                    </Badge>
                                                )}
                                                <Badge className={`${getChangeTypeColor(version.change_type)} border-0 text-xs`}>
                                                    {version.change_type.replace(/_/g, ' ')}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-[var(--nea-text-primary)] mb-1">
                                                {version.change_summary}
                                            </p>
                                            {version.commit_message && (
                                                <p className="text-xs text-[var(--nea-text-secondary)] italic">
                                                    "{version.commit_message}"
                                                </p>
                                            )}
                                            <p className="text-xs text-[var(--nea-text-secondary)] mt-2">
                                                Par {version.modified_by} • {new Date(version.created_date).toLocaleString('fr-FR')}
                                            </p>

                                            {/* Diff Preview */}
                                            {expandedVersion === version.id && version.diff_from_previous && (
                                                <div className="mt-3 p-3 rounded-lg bg-[var(--nea-bg-surface)] border border-[var(--nea-border-subtle)]">
                                                    <p className="text-xs font-semibold text-[var(--nea-text-primary)] mb-2">
                                                        Changements:
                                                    </p>
                                                    {version.diff_from_previous.modified?.length > 0 && (
                                                        <div className="mb-2">
                                                            <p className="text-xs text-yellow-400 mb-1">Modifié:</p>
                                                            {version.diff_from_previous.modified.map((mod, i) => (
                                                                <p key={i} className="text-xs text-[var(--nea-text-secondary)] ml-2">
                                                                    • {mod.field}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {version.diff_from_previous.added?.length > 0 && (
                                                        <div className="mb-2">
                                                            <p className="text-xs text-green-400 mb-1">Ajouté:</p>
                                                            {version.diff_from_previous.added.map((add, i) => (
                                                                <p key={i} className="text-xs text-[var(--nea-text-secondary)] ml-2">
                                                                    • {add.field}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {version.diff_from_previous.deleted?.length > 0 && (
                                                        <div>
                                                            <p className="text-xs text-red-400 mb-1">Supprimé:</p>
                                                            {version.diff_from_previous.deleted.map((del, i) => (
                                                                <p key={i} className="text-xs text-[var(--nea-text-secondary)] ml-2">
                                                                    • {del.field}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <NeaButton
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setExpandedVersion(
                                                    expandedVersion === version.id ? null : version.id
                                                )}
                                            >
                                                <Eye className="w-3 h-3" />
                                            </NeaButton>
                                            {!version.is_current && (
                                                <NeaButton
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => handleRestore(version.id)}
                                                >
                                                    <RotateCcw className="w-3 h-3 mr-1" />
                                                    Restaurer
                                                </NeaButton>
                                            )}
                                        </div>
                                    </div>
                                </NeaCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
