import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, AlertTriangle } from 'lucide-react';

const SEVERITY_CONFIG = {
    'Faible': { color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: AlertTriangle },
    'Modéré': { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', icon: AlertTriangle },
    'Élevé': { color: 'bg-orange-500/10 text-orange-400 border-orange-500/30', icon: AlertTriangle },
    'Critique': { color: 'bg-red-500/10 text-red-400 border-red-500/30', icon: AlertTriangle },
    'Catastrophique': { color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', icon: AlertTriangle },
};

export default function CrisisCard({ crisis, onClick }) {
    const severityConfig = SEVERITY_CONFIG[crisis.severity_level] || SEVERITY_CONFIG['Modéré'];
    const SeverityIcon = severityConfig.icon;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <NeaCard 
                className={cn(
                    "cursor-pointer transition-all duration-300 hover:border-[var(--nea-primary-blue)]",
                    onClick && "hover:shadow-lg"
                )}
                onClick={onClick}
            >
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-[var(--nea-text-title)] mb-1">{crisis.simulation_name}</h3>
                            <div className="flex items-center gap-2">
                                <Badge className={`${severityConfig.color} border text-xs`}>
                                    <SeverityIcon className="w-3 h-3 mr-1" />
                                    {crisis.severity_level}
                                </Badge>
                                <Badge variant="outline" className="text-xs text-[var(--nea-text-secondary)]">
                                    {crisis.crisis_type}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {crisis.location && (
                        <div className="flex items-center gap-2 text-sm text-[var(--nea-text-secondary)] mb-3">
                            <MapPin className="w-4 h-4 text-[var(--nea-primary-blue)]" />
                            <span>{crisis.location.country} - {crisis.location.region}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-[var(--nea-text-secondary)]">Population affectée</p>
                            <p className="font-semibold text-[var(--nea-text-title)]">
                                {crisis.affected_population?.toLocaleString() || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-[var(--nea-text-secondary)]">Déplacés</p>
                            <p className="font-semibold text-[var(--nea-text-title)]">
                                {crisis.displaced_population?.toLocaleString() || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </NeaCard>
        </motion.div>
    );
}