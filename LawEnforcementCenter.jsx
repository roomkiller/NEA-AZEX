import React from 'react';
import { base44 } from '@/api/base44Client';
import { ShieldAlert } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function LawEnforcementCenter() {
    return (
        <ProfessionalCenterTemplate
            domain="Forces_Ordre"
            title="Forces de l'Ordre"
            subtitle="Cybercriminalité et criminalité organisée"
            icon={ShieldAlert}
            iconColor="orange"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'SÉCURITAIRE' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Technologie' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Dossiers Actifs" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Menaces Majeures" },
                predictions: { value: relatedData.predictions.length, label: "Tendances Crime" },
                custom: { value: Math.floor(Math.random() * 25) + 40, label: "Enquêtes en Cours" }
            })}
        />
    );
}