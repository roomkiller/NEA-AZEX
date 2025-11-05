import React from 'react';
import { base44 } from '@/api/base44Client';
import { Leaf } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function EnvironmentalIntelligence() {
    return (
        <ProfessionalCenterTemplate
            domain="Environnement"
            title="Intelligence Environnementale"
            subtitle="Biodiversité, pollution et gestion des ressources naturelles"
            icon={Leaf}
            iconColor="emerald"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'CLIMATIQUE' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Environnement' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Rapports Écologiques" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Crises Environnementales" },
                predictions: { value: relatedData.predictions.length, label: "Prédictions" },
                custom: { value: Math.floor(Math.random() * 50) + 200, label: "Zones Surveillées" }
            })}
        />
    );
}