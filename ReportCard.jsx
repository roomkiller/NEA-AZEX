import React from 'react';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import NeaButton from '../ui/NeaButton';

const TYPE_LABELS = {
    'Scenario_Analysis': 'Analyse de Scénario',
    'Crisis_Simulation': 'Simulation de Crise',
    'Module_Audit': 'Audit de Module',
    'Network_Log': 'Journal Réseau',
    'Security_Report': 'Rapport de Sécurité',
    'Tactical_Brief': 'Brief Tactique',
    'Configuration_Snapshot': 'Snapshot Config',
};

const CLASSIFICATION_CONFIG = {
    'Public': { color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    'Restricted': { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
    'Confidential': { color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
    'Secret': { color: 'bg-red-500/10 text-red-400 border-red-500/30' },
    'Top_Secret': { color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
};

export default function ReportCard({ report }) {
    const classificationConfig = CLASSIFICATION_CONFIG[report.classification_level] || CLASSIFICATION_CONFIG['Restricted'];

    return (
        <NeaCard className="overflow-hidden">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--nea-primary-blue)]/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-[var(--nea-primary-blue)]" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[var(--nea-text-title)]">{report.report_name}</h3>
                            <p className="text-xs text-[var(--nea-text-muted)]">
                                {format(new Date(report.generation_timestamp), 'dd MMM yyyy HH:mm', { locale: fr })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                        <Badge className={`${classificationConfig.color} border text-xs`}>
                            {report.classification_level}
                        </Badge>
                        {report.encryption_status && (
                            <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-500/30 flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                Chiffré
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                        <span className="text-[var(--nea-text-secondary)]">Type:</span>
                        <span className="text-[var(--nea-text-primary)] font-medium">
                            {TYPE_LABELS[report.report_type] || report.report_type}
                        </span>
                    </div>
                    {report.file_size_kb && (
                        <div className="flex justify-between">
                            <span className="text-[var(--nea-text-secondary)]">Taille:</span>
                            <span className="text-[var(--nea-text-primary)] font-medium">
                                {(report.file_size_kb / 1024).toFixed(2)} MB
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-[var(--nea-text-secondary)]">Format:</span>
                        <span className="text-[var(--nea-text-primary)] font-medium uppercase">
                            {report.format || 'JSON'}
                        </span>
                    </div>
                </div>

                <NeaButton size="sm" variant="secondary" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                </NeaButton>
            </div>
        </NeaCard>
    );
}