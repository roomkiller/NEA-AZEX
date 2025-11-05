
import React, { useState, useEffect } from 'react';
import { Configuration as ConfigEntity } from '@/api/entities';
import { motion } from 'framer-motion'; // motion is no longer directly used for the modal itself, but could be for internal elements if needed. Keep for now as it was in original.
import { X, Check, Loader2, Settings, Save } from 'lucide-react'; // Added Settings and Save icons
import { toast } from 'sonner';
import EnhancedDialog, { DialogSection, DialogField, EnhancedInput, EnhancedTextarea } from '../ui/EnhancedDialog'; // New imports
import NeaButton from '../ui/NeaButton'; // Existing import, confirmed
import { Input } from '@/components/ui/input'; // No longer directly used for config fields, but might be used internally in EnhancedInput/Textarea. Keep for now if not sure.
import { Textarea } from '@/components/ui/textarea'; // No longer directly used for config fields.
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label'; // Label is still useful for Switch components

const CATEGORIES = ["API", "Backend", "Database", "Security", "Network"];
const ENVIRONMENTS = ["Production", "Staging", "Development"];

export default function AddConfigModal({ isOpen, onClose, onSuccess, config }) {
  const [formData, setFormData] = useState({
    category: 'API',
    key: '',
    value: '',
    description: '',
    is_sensitive: false,
    is_active: true,
    environment: 'Production'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (config) {
      setFormData(config);
    } else {
      setFormData({
        category: 'API', key: '', value: '', description: '', is_sensitive: false, is_active: true, environment: 'Production'
      });
    }
  }, [config, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (config) {
        await ConfigEntity.update(config.id, formData);
        toast.success(`Configuration "${formData.key}" mise à jour.`);
      } else {
        await ConfigEntity.create(formData);
        toast.success(`Configuration "${formData.key}" créée.`);
      }
      onSuccess();
      onClose(); // Close the modal after successful operation
    } catch (error) {
      console.error("Erreur sauvegarde config:", error);
      toast.error("Échec de la sauvegarde de la configuration.");
    } finally {
      setIsSaving(false);
    }
  };

  // The modal itself is now controlled by EnhancedDialog's 'open' prop
  // No need for 'if (!isOpen) return null;' directly here.
  // The EnhancedDialog component should handle its own rendering based on the 'open' prop.

  return (
    <EnhancedDialog
      open={isOpen} // Pass the isOpen prop to control the dialog's visibility
      onOpenChange={onClose} // EnhancedDialog handles closing when clicking outside or pressing escape
      title={config ? 'Modifier la Configuration' : 'Nouvelle Configuration'} // Dynamic title based on config prop
      description="Gérez les paramètres de configuration de votre application." // More generic description
      icon={Settings}
      iconColor="text-purple-400"
      iconBg="from-purple-500/20 to-pink-500/30"
      headerGradient="from-purple-500/10 via-pink-500/10 to-blue-500/10"
      size="default"
      footer={
        <div className="flex justify-end gap-3">
          <NeaButton onClick={onClose} variant="ghost" disabled={isSaving}>
            Annuler
          </NeaButton>
          <NeaButton onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {config ? 'Sauvegarder' : 'Créer'}
          </NeaButton>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <DialogSection title="Détails de la Configuration" icon={Settings}> {/* Renamed title slightly */}
          <DialogField label="Catégorie" required>
            <Select value={formData.category} onValueChange={v => handleSelectChange('category', v)}>
              <SelectTrigger><SelectValue placeholder="Sélectionnez une catégorie" /></SelectTrigger>
              <SelectContent>{CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
            </Select>
          </DialogField>

          <DialogField label="Clé de Configuration" required>
            <EnhancedInput
              name="key"
              placeholder="Ex: API_RATE_LIMIT"
              value={formData.key}
              onChange={(e) => handleChange(e)}
              required
            />
          </DialogField>

          <DialogField label="Valeur" required>
            <EnhancedTextarea // Changed to EnhancedTextarea for value as per original logic
              name="value"
              placeholder="Ex: 1000 ou secret_key_XYZ"
              value={formData.value}
              onChange={(e) => handleChange(e)}
              required
            />
          </DialogField>

          <DialogField label="Description">
            <EnhancedTextarea
              name="description"
              placeholder="Description de l'utilisation de cette configuration"
              value={formData.description}
              onChange={(e) => handleChange(e)}
            />
          </DialogField>
          
          <DialogField label="Environnement" required>
            <Select value={formData.environment} onValueChange={v => handleSelectChange('environment', v)}>
              <SelectTrigger><SelectValue placeholder="Sélectionnez l'environnement" /></SelectTrigger>
              <SelectContent>{ENVIRONMENTS.map(env => <SelectItem key={env} value={env}>{env}</SelectItem>)}</SelectContent>
            </Select>
          </DialogField>

          <DialogField label="Options">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <Label htmlFor="is_sensitive" className="text-white text-sm">Valeur sensible (ex: mot de passe, clé API) ?</Label>
              <Switch id="is_sensitive" checked={formData.is_sensitive} onCheckedChange={c => handleSwitchChange('is_sensitive', c)} />
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg mt-2">
              <Label htmlFor="is_active" className="text-white text-sm">Activer la configuration ?</Label>
              <Switch id="is_active" checked={formData.is_active} onCheckedChange={c => handleSwitchChange('is_active', c)} />
            </div>
          </DialogField>
        </DialogSection>
      </form>
    </EnhancedDialog>
  );
}
