
import React, { useState } from 'react';
import { BackupLog } from '@/api/entities';
import EnhancedDialog, { DialogSection, DialogField, EnhancedInput, EnhancedTextarea } from '../ui/EnhancedDialog';
import NeaButton from '../ui/NeaButton';
import { Label } from '@/components/ui/label'; // Keep Label for Select components if needed internally by Select
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { HardDrive, Save, Loader2, Database, Settings } from 'lucide-react'; // Added Database and Settings icons
import { motion } from 'framer-motion'; // motion.form removed, but framer-motion import remains if used elsewhere

const BACKUP_TYPES = ['Full_System', 'Incremental', 'Differential', 'Selective_Reports', 'Configuration_Only'];
const DESTINATION_TYPES = ['Local_Storage', 'Cloud_Storage', 'External_Drive', 'Network_Share', 'Off_Site_Vault'];

export default function CreateBackupModal({ isOpen, onClose }) {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    backup_name: '',
    backup_type: 'Full_System',
    destination: {
      destination_type: 'Local_Storage',
      path: '',
      connection_protocol: ''
    },
    encryption_enabled: true,
    auto_backup: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.backup_name || !formData.destination.path) {
      toast.error('Veuillez remplir les champs requis');
      return;
    }

    setIsCreating(true);

    try {
      await BackupLog.create({
        ...formData,
        status: 'In_Progress',
        start_time: new Date().toISOString()
      });
      toast.success('Sauvegarde lancée');
      onClose();
    } catch (error) {
      toast.error('Erreur lors de la création de la sauvegarde');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <EnhancedDialog
      open={isOpen} // Changed from `true` in outline to `isOpen` to maintain existing dialog behavior
      onOpenChange={onClose}
      title="Nouvelle Sauvegarde Système"
      description="Créez une sauvegarde complète ou sélective des données critiques"
      icon={Database}
      iconColor="text-green-400"
      iconBg="from-green-500/20 to-emerald-500/30"
      headerGradient="from-green-500/10 via-emerald-500/10 to-teal-500/10"
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <NeaButton onClick={onClose} variant="ghost">
            Annuler
          </NeaButton>
          <NeaButton onClick={handleSubmit} disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Lancer la Sauvegarde
              </>
            )}
          </NeaButton>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <DialogSection title="Configuration" icon={Settings}>
          <DialogField label="Nom de la Sauvegarde" required>
            <EnhancedInput
              id="backup_name" // Keep ID for accessibility
              placeholder="Ex: Backup Complet - 2025-01-15"
              value={formData.backup_name}
              onChange={(e) => setFormData({ ...formData, backup_name: e.target.value })}
            />
          </DialogField>

          <div className="grid grid-cols-2 gap-4">
            <DialogField label="Type de Sauvegarde">
              <Select
                value={formData.backup_type}
                onValueChange={(value) => setFormData({ ...formData, backup_type: value })}
              >
                <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                  {BACKUP_TYPES.map(type => (
                    <SelectItem key={type} value={type} className="text-white">
                      {type.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DialogField>

            <DialogField label="Destination">
              <Select
                value={formData.destination.destination_type}
                onValueChange={(value) => setFormData({
                  ...formData,
                  destination: { ...formData.destination, destination_type: value }
                })}
              >
                <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                  {DESTINATION_TYPES.map(type => (
                    <SelectItem key={type} value={type} className="text-white">
                      {type.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DialogField>
          </div>

          <DialogField label="Chemin de Destination" required>
            <EnhancedInput
              id="path" // Keep ID for accessibility
              value={formData.destination.path}
              onChange={(e) => setFormData({
                ...formData,
                destination: { ...formData.destination, path: e.target.value }
              })}
              placeholder="/backups/system/"
            />
          </DialogField>

          <div className="space-y-3">
            {/* These DialogFields will likely render the label/description above the switch.
                If a "label on left, control on right" layout is needed, DialogField would need to support it
                via props or a custom component. For now, this is the most direct application. */}
            <DialogField label="Chiffrement Activé" description="Sécurise les données sauvegardées">
              <Switch
                id="encryption"
                checked={formData.encryption_enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, encryption_enabled: checked })}
              />
            </DialogField>

            <DialogField label="Sauvegarde Automatique" description="Planifier des sauvegardes récurrentes">
              <Switch
                id="auto_backup"
                checked={formData.auto_backup}
                onCheckedChange={(checked) => setFormData({ ...formData, auto_backup: checked })}
              />
            </DialogField>
          </div>
        </DialogSection>
      </form>
    </EnhancedDialog>
  );
}
