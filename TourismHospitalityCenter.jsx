import React from 'react';
import { base44 } from '@/api/base44Client';
import { MapPin } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function TourismHospitalityCenter() {
    return (
        <ProfessionalCenterTemplate
            domain="Tourisme_Hôtellerie"
            title="Tourisme & Hôtellerie"
            subtitle="Industrie touristique, événements et sécurité des voyageurs"
            icon={MapPin}
            iconColor="pink"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'ÉCONOMIQUE' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Société' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Rapports Sectoriels" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Alertes Destinations" },
                predictions: { value: relatedData.predictions.length, label: "Tendances Tourisme" },
                custom: { value: Math.floor(Math.random() * 150) + 550, label: "Destinations Suivies" }
            })}
        />
    );
}