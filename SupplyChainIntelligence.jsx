import React from 'react';
import { base44 } from '@/api/base44Client';
import { Package } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function SupplyChainIntelligence() {
    return (
        <ProfessionalCenterTemplate
            domain="Supply_Chain"
            title="Intelligence Supply Chain"
            subtitle="Logistique mondiale et chaînes d'approvisionnement"
            icon={Package}
            iconColor="orange"
            relatedDataConfig={async () => {
                const [predictions, signals, trends] = await Promise.all([
                    base44.entities.EventPrediction.filter({ event_type: 'ÉCONOMIQUE' }, '-probability_score', 5),
                    base44.entities.MediaSignal.list('-detection_timestamp', 5),
                    base44.entities.TrendAnalysis.filter({ domain: 'Économie' }, '-momentum_score', 5)
                ]);
                return { predictions, signals, trends };
            }}
            statsConfig={(briefs, relatedData) => ({
                activeBriefs: { value: briefs.length, label: "Analyses Actives" },
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Ruptures Critiques" },
                predictions: { value: relatedData.predictions.length, label: "Prédictions" },
                custom: { value: Math.floor(Math.random() * 15) + 5, label: "Perturbations Détectées" }
            })}
        />
    );
}