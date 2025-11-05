import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResourcePoint } from '@/api/entities';
import { toast } from 'sonner';
import { Package, Save } from 'lucide-react';

const RESOURCE_TYPES = ['Eau Potable', 'Nourriture', 'Médicaments', 'Abri', 'Énergie', 'Mixte'];
const STATUS_OPTIONS = ['Opérationnel', 'Capacité limitée', 'Saturé', 'Hors service'];
const ACCESS_LEVELS = ['Public', 'Restreint', 'Militaire', 'Urgence uniquement'];

export default function AddResourceModal({ isOpen, onClose, existingResource = null }) {
  const [formData, setFormData] = useState({
    resource_name: '',
    resource_type: 'Eau Potable',
    location: { address: '', coordinates: { lat: 0, lng: 0 } },
    capacity: { water_liters: 0, food_rations: 0, people_capacity: 0 },
    current_stock: { water_liters: 0, food_rations: 0, occupied_spots: 0 },
    status: 'Opérationnel',
    access_level: 'Public',
    contact_info: { responsible: '', phone: '', emergency_contact: '' }
  });

  useEffect(() => {
    if (existingResource) {
      setFormData(existingResource);
    }
  }, [existingResource]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.resource_name || !formData.location.address) {
      toast.error('Veuillez remplir les champs requis');
      return;
    }

    try {
      if (existingResource) {
        await ResourcePoint.update(existingResource.id, formData);
        toast.success('Point de ressource mis à jour');
      } else {
        await ResourcePoint.create(formData);
        toast.success('Point de ressource créé');
      }
      onClose();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)] text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="w-6 h-6 text-[var(--nea-primary-blue)]" />
            {existingResource ? 'Modifier le Point de Ressource' : 'Nouveau Point de Ressource'}
          </DialogTitle>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--nea-primary-blue)]">Informations de Base</h3>
            
            <div>
              <Label htmlFor="resource_name">Nom du Point *</Label>
              <Input
                id="resource_name"
                value={formData.resource_name}
                onChange={(e) => setFormData({ ...formData, resource_name: e.target.value })}
                className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1"
                placeholder="Ex: Centre d'Approvisionnement Nord"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="resource_type">Type de Ressource</Label>
                <Select
                  value={formData.resource_type}
                  onValueChange={(value) => setFormData({ ...formData, resource_type: value })}
                >
                  <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                    {RESOURCE_TYPES.map(type => (
                      <SelectItem key={type} value={type} className="text-white">{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                    {STATUS_OPTIONS.map(status => (
                      <SelectItem key={status} value={status} className="text-white">{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--nea-primary-blue)]">Localisation</h3>
            
            <div>
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                value={formData.location.address}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, address: e.target.value }
                })}
                className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1"
                placeholder="Adresse complète"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="0.0001"
                  value={formData.location.coordinates.lat}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: {
                      ...formData.location,
                      coordinates: { ...formData.location.coordinates, lat: parseFloat(e.target.value) || 0 }
                    }
                  })}
                  className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1"
                />
              </div>

              <div>
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  step="0.0001"
                  value={formData.location.coordinates.lng}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: {
                      ...formData.location,
                      coordinates: { ...formData.location.coordinates, lng: parseFloat(e.target.value) || 0 }
                    }
                  })}
                  className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--nea-primary-blue)]">Capacités</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="water_capacity">Eau (Litres)</Label>
                <Input
                  id="water_capacity"
                  type="number"
                  value={formData.capacity.water_liters}
                  onChange={(e) => setFormData({
                    ...formData,
                    capacity: { ...formData.capacity, water_liters: parseInt(e.target.value) || 0 }
                  })}
                  className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1"
                />
              </div>

              <div>
                <Label htmlFor="food_capacity">Rations</Label>
                <Input
                  id="food_capacity"
                  type="number"
                  value={formData.capacity.food_rations}
                  onChange={(e) => setFormData({
                    ...formData,
                    capacity: { ...formData.capacity, food_rations: parseInt(e.target.value) || 0 }
                  })}
                  className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1"
                />
              </div>

              <div>
                <Label htmlFor="people_capacity">Personnes</Label>
                <Input
                  id="people_capacity"
                  type="number"
                  value={formData.capacity.people_capacity}
                  onChange={(e) => setFormData({
                    ...formData,
                    capacity: { ...formData.capacity, people_capacity: parseInt(e.target.value) || 0 }
                  })}
                  className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--nea-primary-blue)]">Stock Actuel</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="water_stock">Eau (Litres)</Label>
                <Input
                  id="water_stock"
                  type="number"
                  value={formData.current_stock.water_liters}
                  onChange={(e) => setFormData({
                    ...formData,
                    current_stock: { ...formData.current_stock, water_liters: parseInt(e.target.value) || 0 }
                  })}
                  className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1"
                />
              </div>

              <div>
                <Label htmlFor="food_stock">Rations</Label>
                <Input
                  id="food_stock"
                  type="number"
                  value={formData.current_stock.food_rations}
                  onChange={(e) => setFormData({
                    ...formData,
                    current_stock: { ...formData.current_stock, food_rations: parseInt(e.target.value) || 0 }
                  })}
                  className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1"
                />
              </div>

              <div>
                <Label htmlFor="occupied">Personnes</Label>
                <Input
                  id="occupied"
                  type="number"
                  value={formData.current_stock.occupied_spots}
                  onChange={(e) => setFormData({
                    ...formData,
                    current_stock: { ...formData.current_stock, occupied_spots: parseInt(e.target.value) || 0 }
                  })}
                  className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--nea-primary-blue)]">Contact & Accès</h3>
            
            <div>
              <Label htmlFor="access_level">Niveau d'Accès</Label>
              <Select
                value={formData.access_level}
                onValueChange={(value) => setFormData({ ...formData, access_level: value })}
              >
                <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                  {ACCESS_LEVELS.map(level => (
                    <SelectItem key={level} value={level} className="text-white">{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="responsible">Responsable</Label>
                <Input
                  id="responsible"
                  value={formData.contact_info.responsible}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact_info: { ...formData.contact_info, responsible: e.target.value }
                  })}
                  className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1"
                  placeholder="Nom du responsable"
                />
              </div>

              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.contact_info.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact_info: { ...formData.contact_info, phone: e.target.value }
                  })}
                  className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="emergency_contact">Contact d'Urgence</Label>
              <Input
                id="emergency_contact"
                value={formData.contact_info.emergency_contact}
                onChange={(e) => setFormData({
                  ...formData,
                  contact_info: { ...formData.contact_info, emergency_contact: e.target.value }
                })}
                className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1"
                placeholder="Contact en cas d'urgence"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--nea-border-default)]">
            <Button type="button" onClick={onClose} variant="outline">
              Annuler
            </Button>
            <Button type="submit" className="bg-[var(--nea-primary-blue)] hover:bg-sky-500">
              <Save className="w-4 h-4 mr-2" />
              {existingResource ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}