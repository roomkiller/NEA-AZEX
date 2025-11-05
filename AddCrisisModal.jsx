import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { AlertTriangle, Save, MapPin, Users, Calendar, Info } from 'lucide-react';
import EnhancedDialog, { DialogSection, DialogField, EnhancedInput, EnhancedTextarea } from '../ui/EnhancedDialog';
import NeaButton from '../ui/NeaButton';

const CRISIS_TYPES = [
  'Catastrophe Naturelle',
  'Conflit Armé',
  'Pandémie',
  'Accident Industriel',
  'Attentat',
  'Cyberattaque Massive',
  'Pénurie Alimentaire'
];

const SEVERITY_LEVELS = ['Faible', 'Modéré', 'Élevé', 'Critique', 'Catastrophique'];
const STATUS_OPTIONS = ['Planifiée', 'En cours', 'Résolue', 'Archivée'];

export default function AddCrisisModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    simulation_name: '',
    crisis_type: 'Catastrophe Naturelle',
    location: { country: '', region: '', coordinates: { lat: 0, lng: 0 } },
    affected_population: 0,
    displaced_population: 0,
    severity_level: 'Modéré',
    status: 'Planifiée',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.simulation_name || !formData.location.country) {
      toast.error('Veuillez remplir les champs requis');
      return;
    }

    try {
      const dataToSave = {
        ...formData,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : new Date().toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : undefined
      };

      await base44.entities.CrisisSimulation.create(dataToSave);
      toast.success('Simulation créée avec succès');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating crisis:', error);
      toast.error('Erreur lors de la création de la simulation');
    }
  };

  return (
    <EnhancedDialog
      open={true}
      onOpenChange={onClose}
      title="Nouvelle Simulation de Crise"
      description="Créez un scénario de gestion de crise pour entraînement et planification"
      icon={AlertTriangle}
      iconColor="text-red-400"
      iconBg="from-red-500/20 to-orange-500/30"
      headerGradient="from-red-500/10 via-orange-500/10 to-yellow-500/10"
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <NeaButton type="button" onClick={onClose} variant="ghost">
            Annuler
          </NeaButton>
          <NeaButton type="submit" onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            Créer la Simulation
          </NeaButton>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de Base */}
        <DialogSection title="Informations de Base" icon={Info}>
          <DialogField label="Nom de la Simulation" required>
            <EnhancedInput
              placeholder="Ex: Séisme Majeur - Tokyo 2025"
              value={formData.simulation_name}
              onChange={(e) => setFormData({ ...formData, simulation_name: e.target.value })}
            />
          </DialogField>

          <div className="grid grid-cols-2 gap-4">
            <DialogField label="Type de Crise">
              <Select
                value={formData.crisis_type}
                onValueChange={(value) => setFormData({ ...formData, crisis_type: value })}
              >
                <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-2 border-[var(--nea-border-default)] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                  {CRISIS_TYPES.map(type => (
                    <SelectItem key={type} value={type} className="text-white hover:bg-[var(--nea-bg-surface-hover)]">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DialogField>

            <DialogField label="Niveau de Gravité">
              <Select
                value={formData.severity_level}
                onValueChange={(value) => setFormData({ ...formData, severity_level: value })}
              >
                <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-2 border-[var(--nea-border-default)] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                  {SEVERITY_LEVELS.map(level => (
                    <SelectItem key={level} value={level} className="text-white hover:bg-[var(--nea-bg-surface-hover)]">
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DialogField>
          </div>
        </DialogSection>

        {/* Localisation */}
        <DialogSection title="Localisation" icon={MapPin}>
          <div className="grid grid-cols-2 gap-4">
            <DialogField label="Pays" required>
              <EnhancedInput
                placeholder="Ex: Japon"
                value={formData.location.country}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, country: e.target.value }
                })}
              />
            </DialogField>

            <DialogField label="Région">
              <EnhancedInput
                placeholder="Ex: Tokyo"
                value={formData.location.region}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, region: e.target.value }
                })}
              />
            </DialogField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DialogField label="Latitude" help="Coordonnées GPS (optionnel)">
              <EnhancedInput
                type="number"
                step="0.0001"
                placeholder="35.6762"
                value={formData.location.coordinates.lat}
                onChange={(e) => setFormData({
                  ...formData,
                  location: {
                    ...formData.location,
                    coordinates: { ...formData.location.coordinates, lat: parseFloat(e.target.value) || 0 }
                  }
                })}
              />
            </DialogField>

            <DialogField label="Longitude">
              <EnhancedInput
                type="number"
                step="0.0001"
                placeholder="139.6503"
                value={formData.location.coordinates.lng}
                onChange={(e) => setFormData({
                  ...formData,
                  location: {
                    ...formData.location,
                    coordinates: { ...formData.location.coordinates, lng: parseFloat(e.target.value) || 0 }
                  }
                })}
              />
            </DialogField>
          </div>
        </DialogSection>

        {/* Impact */}
        <DialogSection title="Impact Humanitaire" icon={Users}>
          <div className="grid grid-cols-2 gap-4">
            <DialogField label="Population Affectée" help="Nombre total de personnes impactées">
              <EnhancedInput
                type="number"
                placeholder="0"
                value={formData.affected_population}
                onChange={(e) => setFormData({ ...formData, affected_population: parseInt(e.target.value) || 0 })}
              />
            </DialogField>

            <DialogField label="Population Déplacée" help="Nombre de personnes déplacées">
              <EnhancedInput
                type="number"
                placeholder="0"
                value={formData.displaced_population}
                onChange={(e) => setFormData({ ...formData, displaced_population: parseInt(e.target.value) || 0 })}
              />
            </DialogField>
          </div>
        </DialogSection>

        {/* Chronologie */}
        <DialogSection title="Chronologie" icon={Calendar}>
          <div className="grid grid-cols-3 gap-4">
            <DialogField label="Statut">
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-2 border-[var(--nea-border-default)] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                  {STATUS_OPTIONS.map(status => (
                    <SelectItem key={status} value={status} className="text-white hover:bg-[var(--nea-bg-surface-hover)]">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DialogField>

            <DialogField label="Date de Début">
              <EnhancedInput
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </DialogField>

            <DialogField label="Date de Fin">
              <EnhancedInput
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </DialogField>
          </div>
        </DialogSection>

        {/* Notes */}
        <DialogField label="Notes et Observations">
          <EnhancedTextarea
            placeholder="Détails supplémentaires, contraintes spécifiques, objectifs de la simulation..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
          />
        </DialogField>
      </form>
    </EnhancedDialog>
  );
}