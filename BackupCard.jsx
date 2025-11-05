import React from 'react';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { HardDrive, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const STATUS_CONFIG = {
    'In_Progress': { color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: Clock, label: 'En cours' },
    'Completed': { color: 'bg-green-500/10 text-green-400 border-green-500/30', icon: CheckCircle, label: 'Complété' },
    'Failed': { color: 'bg-red-500/10 text-red-400 border-red-500/30', icon: XCircle, label: 'Échec' },
    'Partial': { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', icon: Clock, label: 'Partiel' },
};

const TYPE_LABELS = {
    'Full_System': 'Système complet',
    'Incremental': 'Incrémentiel',
    'Differential': 'Différentiel',
    'Selective_Reports': 'Rapports sélectifs',
    'Configuration_Only': 'Configuration uniquement',
};

export default function BackupCard({ backup }) {
    const statusConfig = STATUS_CONFIG[backup.status] || STATUS_CONFIG['In_Progress'];
    const StatusIcon = statusConfig.icon;

    return (
        <NeaCard className="overflow-hidden">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--nea-primary-blue)]/10 flex items-center justify-center">
                            <HardDrive className="w-5 h-5 text-[var(--nea-primary-blue)]" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[var(--nea-text-title)]">{backup.backup_name}</h3>
                            <p className="text-xs text-[var(--nea-text-muted)]">
                                {format(new Date(backup.start_time), 'dd MMM yyyy HH:mm', { locale: fr })}
                            </p>
                        </div>
                    </div>
                    <Badge className={`${statusConfig.color} border flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                    </Badge>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-[var(--nea-text-secondary)]">Type:</span>
                        <span className="text-[var(--nea-text-primary)] font-medium">
                            {TYPE_LABELS[backup.backup_type] || backup.backup_type}
                        </span>
                    </div>
                    {backup.total_size_mb && (
                        <div className="flex justify-between">
                            <span className="text-[var(--nea-text-secondary)]">Taille:</span>
                            <span className="text-[var(--nea-text-primary)] font-medium">
                                {backup.total_size_mb.toFixed(2)} MB
                            </span>
                        </div>
                    )}
                    {backup.duration_seconds && (
                        <div className="flex justify-between">
                            <span className="text-[var(--nea-text-secondary)]">Durée:</span>
                            <span className="text-[var(--nea-text-primary)] font-medium">
                                {Math.floor(backup.duration_seconds / 60)}m {backup.duration_seconds % 60}s
                            </span>
                        </div>
                    )}
                    {backup.encryption_enabled && (
                        <div className="flex items-center gap-2 pt-2">
                            <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-500/30">
                                Chiffré
                            </Badge>
                        </div>
                    )}
                </div>
            </div>
        </NeaCard>
    );
}