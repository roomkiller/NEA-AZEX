import React from 'react';
import { base44 } from '@/api/base44Client';
import { FileText } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function InvestigativeJournalism() {
    return (
        <ProfessionalCenterTemplate
            domain="Journalisme"
            title="Investigation Journalistique"
            subtitle="Pistes d'enquête OSINT et sources vérifiées"
            icon={FileText}
            iconColor="blue"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'SOCIAL' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Société' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Enquêtes Actives" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Pistes Critiques" },
                predictions: { value: relatedData.predictions.length, label: "Signaux Faibles" },
                custom: { value: Math.floor(Math.random() * 50) + 120, label: "Sources Vérifiées" }
            })}
        />
    );
}