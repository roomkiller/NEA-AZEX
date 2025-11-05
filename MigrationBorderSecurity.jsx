import React from 'react';
import { base44 } from '@/api/base44Client';
import { Users } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function MigrationBorderSecurity() {
    return (
        <ProfessionalCenterTemplate
            domain="Migration"
            title="Migration & Frontières"
            subtitle="Flux migratoires et sécurité frontalière"
            icon={Users}
            iconColor="purple"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'SOCIAL' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Société' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Rapports Migration" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Crises Humanitaires" },
                predictions: { value: relatedData.predictions.length, label: "Prédictions Flux" },
                custom: { value: Math.floor(Math.random() * 15) + 35, label: "Zones Frontalières" }
            })}
        />
    );
}