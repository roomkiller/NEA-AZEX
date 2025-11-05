import React from 'react';
import { base44 } from '@/api/base44Client';
import { Radio } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function TelecommunicationsCenter() {
    return (
        <ProfessionalCenterTemplate
            domain="Télécom"
            title="Centre Télécommunications"
            subtitle="Réseaux 5G, câbles sous-marins et infrastructure télécom"
            icon={Radio}
            iconColor="cyan"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'TECHNOLOGIQUE' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Technologie' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Rapports Réseau" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Pannes Critiques" },
                predictions: { value: relatedData.predictions.length, label: "Prédictions" },
                custom: { value: Math.floor(Math.random() * 20) + 45, label: "Réseaux Monitorés" }
            })}
        />
    );
}