import React from 'react';
import { base44 } from '@/api/base44Client';
import { Database } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function CriticalInfrastructure() {
    return (
        <ProfessionalCenterTemplate
            domain="Infrastructure"
            title="Infrastructure Critique"
            subtitle="Protection des infrastructures essentielles"
            icon={Database}
            iconColor="red"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'SÉCURITAIRE' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Technologie' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Rapports Sécurité" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Vulnérabilités Critiques" },
                predictions: { value: relatedData.predictions.length, label: "Prédictions" },
                custom: { value: Math.floor(Math.random() * 50) + 180, label: "Sites Protégés" }
            })}
        />
    );
}