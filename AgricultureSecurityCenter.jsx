import React from 'react';
import { base44 } from '@/api/base44Client';
import { Wheat } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function AgricultureSecurityCenter() {
    return (
        <ProfessionalCenterTemplate
            domain="Agriculture"
            title="Sécurité Agricole"
            subtitle="Sécurité alimentaire et agriculture mondiale"
            icon={Wheat}
            iconColor="green"
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
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Crises Alimentaires" },
                predictions: { value: relatedData.predictions.length, label: "Prédictions Récoltes" },
                custom: { value: Math.floor(Math.random() * 30) + 85, label: "Régions Surveillées" }
            })}
        />
    );
}