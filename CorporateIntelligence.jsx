import React from 'react';
import { base44 } from '@/api/base44Client';
import { Building } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function CorporateIntelligence() {
    return (
        <ProfessionalCenterTemplate
            domain="Corporatif"
            title="Intelligence Corporative"
            subtitle="Espionnage industriel et sécurité d'entreprise"
            icon={Building}
            iconColor="gray"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'ÉCONOMIQUE' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Économie' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Dossiers Actifs" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Menaces Détectées" },
                predictions: { value: relatedData.predictions.length, label: "Prédictions" },
                custom: { value: Math.floor(Math.random() * 200) + 350, label: "Entreprises Surveillées" }
            })}
        />
    );
}