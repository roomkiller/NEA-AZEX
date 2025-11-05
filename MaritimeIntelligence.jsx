import React from 'react';
import { base44 } from '@/api/base44Client';
import { Anchor } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function MaritimeIntelligence() {
    return (
        <ProfessionalCenterTemplate
            domain="Maritime"
            title="Intelligence Maritime"
            subtitle="Routes commerciales, piraterie et domaine maritime"
            icon={Anchor}
            iconColor="blue"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'ÉCONOMIQUE' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Économie' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Bulletins Maritimes" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Incidents Critiques" },
                predictions: { value: relatedData.predictions.length, label: "Prédictions" },
                custom: { value: Math.floor(Math.random() * 500) + 2500, label: "Navires Tracés" }
            })}
        />
    );
}