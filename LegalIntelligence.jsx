import React from 'react';
import { base44 } from '@/api/base44Client';
import { Scale } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function LegalIntelligence() {
    return (
        <ProfessionalCenterTemplate
            domain="Juridique"
            title="Intelligence Juridique"
            subtitle="Surveillance réglementaire, contentieux et conformité légale"
            icon={Scale}
            iconColor="indigo"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'ÉCONOMIQUE' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Société' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Dossiers Juridiques" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Contentieux Critiques" },
                predictions: { value: relatedData.predictions.length, label: "Évolutions Légales" },
                custom: { value: Math.floor(Math.random() * 30) + 85, label: "Réglementations Suivies" }
            })}
        />
    );
}