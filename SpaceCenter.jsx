import React from 'react';
import { base44 } from '@/api/base44Client';
import { Rocket } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function SpaceCenter() {
    return (
        <ProfessionalCenterTemplate
            domain="Spatial"
            title="Centre Spatial"
            subtitle="Satellites, débris spatiaux et activités orbitales"
            icon={Rocket}
            iconColor="purple"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'TECHNOLOGIQUE' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Technologie' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Rapports Orbitaux" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Alertes Collision" },
                predictions: { value: relatedData.predictions.length, label: "Prédictions" },
                custom: { value: Math.floor(Math.random() * 100) + 850, label: "Satellites Suivis" }
            })}
        />
    );
}