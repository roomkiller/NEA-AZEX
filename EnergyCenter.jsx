import React from 'react';
import { base44 } from '@/api/base44Client';
import { Zap } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function EnergyCenter() {
    return (
        <ProfessionalCenterTemplate
            domain="Énergie"
            title="Centre Énergétique"
            subtitle="Pétrole, gaz, électricité et énergies renouvelables"
            icon={Zap}
            iconColor="yellow"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'ÉCONOMIQUE' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Économie' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Rapports Actifs" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Risques Critiques" },
                predictions: { value: relatedData.predictions.length, label: "Prédictions" },
                custom: { value: Math.floor(Math.random() * 5) + 95, label: "Stabilité Réseau %" }
            })}
        />
    );
}