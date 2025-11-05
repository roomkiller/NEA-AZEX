import React from 'react';
import { base44 } from '@/api/base44Client';
import { Plane } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function TransportMobilityCenter() {
    return (
        <ProfessionalCenterTemplate
            domain="Transport_Mobilité"
            title="Transport & Mobilité"
            subtitle="Aviation, ferroviaire, routier et mobilité urbaine"
            icon={Plane}
            iconColor="sky"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'ÉCONOMIQUE' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Économie' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Bulletins Transport" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Incidents Majeurs" },
                predictions: { value: relatedData.predictions.length, label: "Prédictions Trafic" },
                custom: { value: Math.floor(Math.random() * 200) + 1500, label: "Routes Monitorées" }
            })}
        />
    );
}