import React from 'react';
import NeaCard from '../ui/NeaCard';
import EmptyState from '../ui/EmptyState';
import { LineChart } from 'lucide-react';
import NeaButton from '../ui/NeaButton';

const PaymentsTracker = () => {
    return (
        <NeaCard>
            <div className="p-4 border-b border-[var(--nea-border-default)]">
                <h3 className="font-bold text-white">Suivi des Paiements</h3>
            </div>
            <div className="p-8">
                <EmptyState 
                    icon={LineChart}
                    title="Aucun paiement à afficher"
                    description="L'historique des transactions financières sera disponible ici."
                    actionButton={<NeaButton disabled>Enregistrer un paiement</NeaButton>}
                />
            </div>
        </NeaCard>
    );
};

export default PaymentsTracker;