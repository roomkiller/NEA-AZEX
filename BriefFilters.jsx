import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import NeaCard from '../ui/NeaCard';

export default function BriefFilters({ filters, onFilterChange, onReset }) {
    return (
        <NeaCard className="p-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Priorité */}
                <div>
                    <label className="text-xs font-semibold text-[var(--nea-text-secondary)] mb-2 block">
                        Priorité
                    </label>
                    <Select value={filters.priority} onValueChange={(value) => onFilterChange('priority', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Toutes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes</SelectItem>
                            <SelectItem value="Flash">Flash</SelectItem>
                            <SelectItem value="Critique">Critique</SelectItem>
                            <SelectItem value="Urgent">Urgent</SelectItem>
                            <SelectItem value="Attention">Attention</SelectItem>
                            <SelectItem value="Routine">Routine</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Période */}
                <div>
                    <label className="text-xs font-semibold text-[var(--nea-text-secondary)] mb-2 block">
                        Période
                    </label>
                    <Select value={filters.period} onValueChange={(value) => onFilterChange('period', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Tout" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tout</SelectItem>
                            <SelectItem value="today">Aujourd'hui</SelectItem>
                            <SelectItem value="7days">7 derniers jours</SelectItem>
                            <SelectItem value="30days">30 derniers jours</SelectItem>
                            <SelectItem value="custom">Personnalisé</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Région */}
                <div>
                    <label className="text-xs font-semibold text-[var(--nea-text-secondary)] mb-2 block">
                        Région
                    </label>
                    <Input 
                        placeholder="Filtrer par région..."
                        value={filters.region}
                        onChange={(e) => onFilterChange('region', e.target.value)}
                    />
                </div>

                {/* Niveau de confiance */}
                <div>
                    <label className="text-xs font-semibold text-[var(--nea-text-secondary)] mb-2 block">
                        Confiance minimale
                    </label>
                    <Select value={filters.confidence} onValueChange={(value) => onFilterChange('confidence', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Tous" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous</SelectItem>
                            <SelectItem value="90">≥ 90%</SelectItem>
                            <SelectItem value="75">≥ 75%</SelectItem>
                            <SelectItem value="50">≥ 50%</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Date personnalisée */}
            {filters.period === 'custom' && (
                <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[var(--nea-border-default)]">
                    <div>
                        <label className="text-xs font-semibold text-[var(--nea-text-secondary)] mb-2 block">
                            Date de début
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {filters.startDate ? format(new Date(filters.startDate), 'PPP', { locale: fr }) : 'Sélectionner'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={filters.startDate ? new Date(filters.startDate) : undefined}
                                    onSelect={(date) => onFilterChange('startDate', date?.toISOString())}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-[var(--nea-text-secondary)] mb-2 block">
                            Date de fin
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {filters.endDate ? format(new Date(filters.endDate), 'PPP', { locale: fr }) : 'Sélectionner'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={filters.endDate ? new Date(filters.endDate) : undefined}
                                    onSelect={(date) => onFilterChange('endDate', date?.toISOString())}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            )}

            {/* Bouton reset */}
            <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" onClick={onReset}>
                    <X className="w-4 h-4 mr-2" />
                    Réinitialiser
                </Button>
            </div>
        </NeaCard>
    );
}