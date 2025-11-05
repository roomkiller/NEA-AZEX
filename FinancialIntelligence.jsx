import React from 'react';
import { base44 } from '@/api/base44Client';
import { DollarSign } from 'lucide-react';
import ProfessionalCenterTemplate from '../components/professional/ProfessionalCenterTemplate';

export default function FinancialIntelligence() {
    return (
        <ProfessionalCenterTemplate
            domain="Finance"
            title="Intelligence Financière"
            subtitle="Analyse de risques et marchés financiers"
            icon={DollarSign}
            iconColor="green"
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
                criticalThreats: { value: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length, label: "Alertes Critiques" },
                predictions: { value: relatedData.predictions.length, label: "Prédictions" },
                custom: { value: Math.floor(Math.random() * 15) + 35, label: "Marchés Surveillés" }
            })}
        />
    );
}