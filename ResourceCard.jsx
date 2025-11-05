import React from 'react';
import { motion } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { Droplet, Utensils, Heart, Zap, MapPin } from 'lucide-react';

const RESOURCE_ICONS = {
    'Eau Potable': Droplet,
    'Nourriture': Utensils,
    'Médicaments': Heart,
    'Énergie': Zap,
    'Mixte': MapPin,
};

const STATUS_CONFIG = {
    'Opérationnel': { color: 'bg-green-500/10 text-green-400 border-green-500/30' },
    'Capacité limitée': { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
    'Saturé': { color: 'bg-red-500/10 text-red-400 border-red-500/30' },
    'Hors service': { color: 'bg-gray-500/10 text-gray-400 border-gray-500/30' },
};

export default function ResourceCard({ resource, onClick }) {
    const ResourceIcon = RESOURCE_ICONS[resource.resource_type] || MapPin;
    const statusConfig = STATUS_CONFIG[resource.status] || STATUS_CONFIG['Opérationnel'];

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <NeaCard 
                className="cursor-pointer transition-all duration-300 hover:border-[var(--nea-primary-blue)] hover:shadow-lg"
                onClick={onClick}
            >
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[var(--nea-primary-blue)]/10 flex items-center justify-center">
                                <ResourceIcon className="w-5 h-5 text-[var(--nea-primary-blue)]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[var(--nea-text-title)]">{resource.resource_name}</h3>
                                <Badge className={`${statusConfig.color} border text-xs mt-1`}>
                                    {resource.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {resource.location?.address && (
                        <div className="flex items-center gap-2 text-sm text-[var(--nea-text-secondary)] mb-3">
                            <MapPin className="w-4 h-4 text-[var(--nea-primary-blue)]" />
                            <span className="truncate">{resource.location.address}</span>
                        </div>
                    )}

                    {resource.capacity && (
                        <div className="space-y-2 text-sm">
                            {resource.capacity.water_liters && (
                                <div className="flex justify-between">
                                    <span className="text-[var(--nea-text-secondary)]">Eau:</span>
                                    <span className="text-[var(--nea-text-primary)] font-medium">
                                        {resource.current_stock?.water_liters || 0} / {resource.capacity.water_liters} L
                                    </span>
                                </div>
                            )}
                            {resource.capacity.food_rations && (
                                <div className="flex justify-between">
                                    <span className="text-[var(--nea-text-secondary)]">Rations:</span>
                                    <span className="text-[var(--nea-text-primary)] font-medium">
                                        {resource.current_stock?.food_rations || 0} / {resource.capacity.food_rations}
                                    </span>
                                </div>
                            )}
                            {resource.capacity.people_capacity && (
                                <div className="flex justify-between">
                                    <span className="text-[var(--nea-text-secondary)]">Capacité:</span>
                                    <span className="text-[var(--nea-text-primary)] font-medium">
                                        {resource.current_stock?.occupied_spots || 0} / {resource.capacity.people_capacity}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </NeaCard>
        </motion.div>
    );
}