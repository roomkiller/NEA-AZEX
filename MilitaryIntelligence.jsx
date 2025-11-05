import React from 'react';
import { base44 } from '@/api/base44Client';
import { Shield } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function MilitaryIntelligence() {
    return (
        <ProfessionalCenterTemplate
            domain="Militaire"
            title="Intelligence Militaire"
            subtitle="Surveillance des théâtres d'opération et menaces stratégiques"
            icon={Shield}
            iconColor="red"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'GÉOPOLITIQUE' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Géopolitique' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Rapports Actifs" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Menaces Critiques" },
                predictions: { value: relatedData.predictions.length, label: "Prédictions" },
                custom: { value: Math.floor(Math.random() * 8) + 12, label: "Théâtres d'Opération" }
            })}
        />
    );
}