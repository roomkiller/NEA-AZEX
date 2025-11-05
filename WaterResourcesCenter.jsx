import React from 'react';
import { base44 } from '@/api/base44Client';
import { Droplet } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function WaterResourcesCenter() {
    return (
        <ProfessionalCenterTemplate
            domain="Ressources_Hydriques"
            title="Ressources Hydriques"
            subtitle="Gestion de l'eau, barrages, irrigation et sécurité hydrique"
            icon={Droplet}
            iconColor="blue"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'CLIMATIQUE' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Environnement' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Rapports Hydriques" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Stress Hydrique" },
                predictions: { value: relatedData.predictions.length, label: "Prédictions Disponibilité" },
                custom: { value: Math.floor(Math.random() * 80) + 320, label: "Bassins Surveillés" }
            })}
        />
    );
}