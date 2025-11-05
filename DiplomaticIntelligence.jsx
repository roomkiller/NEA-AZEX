import React from 'react';
import { base44 } from '@/api/base44Client';
import { Globe } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function DiplomaticIntelligence() {
    return (
        <ProfessionalCenterTemplate
            domain="Diplomatie"
            title="Intelligence Diplomatique"
            subtitle="Médiation de crises et relations internationales"
            icon={Globe}
            iconColor="purple"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'GÉOPOLITIQUE' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Géopolitique' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Briefings Actifs" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Crises en Cours" },
                predictions: { value: relatedData.predictions.length, label: "Prédictions" },
                custom: { value: Math.floor(Math.random() * 20) + 45, label: "Négociations Suivies" }
            })}
        />
    );
}