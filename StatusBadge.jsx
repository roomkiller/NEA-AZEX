import React from 'react';
import { Badge } from '@/components/ui/badge';

const STATUS_CONFIG = {
    // Module statuses
    Active: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Actif' },
    Standby: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'En Attente' },
    Testing: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Test' },
    Disabled: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Désactivé' },
    
    // Prediction statuses
    Détection: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Détection' },
    Analyse: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'Analyse' },
    Validé: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Validé' },
    Confirmé: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Confirmé' },
    Infirmé: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'Infirmé' },
    Archivé: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'Archivé' },
    
    // Generic statuses
    Success: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Succès' },
    Warning: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Attention' },
    Error: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Erreur' },
    Processing: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'En cours' },
    Pending: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'En attente' },
    
    // Confidence levels
    Faible: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Faible' },
    Moyen: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Moyen' },
    Élevé: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Élevé' },
};

export default function StatusBadge({ status, className = '' }) {
    if (!status) return null;
    
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
    
    return (
        <Badge className={`${config.color} border ${className}`}>
            {config.label}
        </Badge>
    );
}