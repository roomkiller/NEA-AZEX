import React from 'react';
import { base44 } from '@/api/base44Client';
import { GraduationCap } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function EducationResearchCenter() {
    return (
        <ProfessionalCenterTemplate
            domain="Éducation_Recherche"
            title="Éducation & Recherche"
            subtitle="Système éducatif, recherche scientifique et innovation académique"
            icon={GraduationCap}
            iconColor="violet"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'TECHNOLOGIQUE' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Technologie' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Analyses Académiques" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Crises Éducatives" },
                predictions: { value: relatedData.predictions.length, label: "Tendances Recherche" },
                custom: { value: Math.floor(Math.random() * 100) + 450, label: "Institutions Suivies" }
            })}
        />
    );
}