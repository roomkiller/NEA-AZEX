import React from 'react';
import { base44 } from '@/api/base44Client';
import { Cloud } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function ClimateWeatherCenter() {
    return (
        <ProfessionalCenterTemplate
            domain="Météorologie"
            title="Centre Météorologique"
            subtitle="Phénomènes météorologiques extrêmes et climat"
            icon={Cloud}
            iconColor="cyan"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'CLIMATIQUE' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Environnement' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Bulletins Actifs" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Phénomènes Extrêmes" },
                predictions: { value: relatedData.predictions.length, label: "Prédictions Climat" },
                custom: { value: Math.floor(Math.random() * 12) + 8, label: "Alertes Météo" }
            })}
        />
    );
}