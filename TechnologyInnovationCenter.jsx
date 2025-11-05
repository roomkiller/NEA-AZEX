import React from 'react';
import { base44 } from '@/api/base44Client';
import { Cpu } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function TechnologyInnovationCenter() {
    return (
        <ProfessionalCenterTemplate
            domain="Technologie"
            title="Tech & Innovation"
            subtitle="IA, disruptions technologiques et innovations"
            icon={Cpu}
            iconColor="blue"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'TECHNOLOGIQUE' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Technologie' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Veilles Tech" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Disruptions Majeures" },
                predictions: { value: relatedData.predictions.length, label: "Tendances IA" },
                custom: { value: Math.floor(Math.random() * 100) + 250, label: "Innovations Tracées" }
            })}
        />
    );
}