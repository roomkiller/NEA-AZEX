import React from 'react';
import { base44 } from '@/api/base44Client';
import { Newspaper } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function MediaInfluenceCenter() {
    return (
        <ProfessionalCenterTemplate
            domain="Médias"
            title="Médias & Influence"
            subtitle="Désinformation, influence et opérations narratives"
            icon={Newspaper}
            iconColor="orange"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'SOCIAL' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Société' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Analyses Médias" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Campagnes Actives" },
                predictions: { value: relatedData.predictions.length, label: "Narratives Émergentes" },
                custom: { value: Math.floor(Math.random() * 30) + 15, label: "Opérations Détectées" }
            })}
        />
    );
}