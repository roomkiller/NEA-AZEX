import React from 'react';
import NeaCard from '../ui/NeaCard';
import EmptyState from '../ui/EmptyState';
import { FileText } from 'lucide-react';
import NeaButton from '../ui/NeaButton';

const InvoicesManager = () => {
    return (
        <NeaCard>
            <div className="p-4 border-b border-[var(--nea-border-default)]">
                <h3 className="font-bold text-white">Factures</h3>
            </div>
            <div className="p-8">
                 <EmptyState 
                    icon={FileText}
                    title="Aucune facture à afficher"
                    description="La gestion des factures sera implémentée prochainement."
                    actionButton={<NeaButton disabled>Générer une facture</NeaButton>}
                 />
            </div>
        </NeaCard>
    );
};

export default InvoicesManager;