
import React, { useState, useEffect } from 'react';
import EnhancedDialog, { DialogSection, DialogField, EnhancedInput, EnhancedTextarea } from '../ui/EnhancedDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NeaButton from '../ui/NeaButton';
import { Loader2, Save, Bot, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function MacroEditorModal({ macro, isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'Draft',
        macro_script: '',
        trigger_type: 'Manual',
        version: 1
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (macro) {
            setFormData({
                name: macro.name || '',
                description: macro.description || '',
                status: macro.status || 'Draft',
                macro_script: macro.macro_script || '',
                trigger_type: macro.trigger_type || 'Manual',
                version: macro.version || 1
            });
        } else {
            setFormData({
                name: '',
                description: '',
                status: 'Draft',
                macro_script: '',
                trigger_type: 'Manual',
                version: 1
            });
        }
    }, [macro, isOpen]);

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error("Le nom est requis");
            return;
        }

        if (!formData.macro_script.trim()) {
            toast.error("Le script est requis");
            return;
        }

        setIsSaving(true);
        try {
            await onSave(formData);
            onClose();
            toast.success(macro ? "Macro mise à jour" : "Macro créée");
        } catch (error) {
            console.error("Erreur sauvegarde macro:", error);
            toast.error("Échec de la sauvegarde");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <EnhancedDialog
            open={isOpen}
            onOpenChange={onClose}
            title={macro ? "Éditer la Macro" : "Nouvelle Macro"}
            description="Définissez une séquence d'actions automatisées pour le système"
            icon={Bot}
            iconColor="text-cyan-400"
            iconBg="from-cyan-500/20 to-blue-500/30"
            headerGradient="from-cyan-500/10 via-blue-500/10 to-purple-500/10"
            size="xl"
            footer={
                <div className="flex justify-end gap-3">
                    <NeaButton onClick={onClose} variant="ghost">
                        Annuler
                    </NeaButton>
                    <NeaButton onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Sauvegarde...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                {macro ? 'Mettre à Jour' : 'Créer la Macro'}
                            </>
                        )}
                    </NeaButton>
                </div>
            }
        >
            <form onSubmit={handleSave} className="space-y-6">
                <DialogSection title="Configuration" icon={Settings}>
                    <DialogField label="Nom de la Macro" required>
                        <EnhancedInput
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Analyse Quotidienne Automatique"
                        />
                    </DialogField>

                    <DialogField label="Statut">
                        <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                                <SelectItem value="Draft">Brouillon</SelectItem>
                                <SelectItem value="Active">Actif</SelectItem>
                                <SelectItem value="Disabled">Désactivé</SelectItem>
                            </SelectContent>
                        </Select>
                    </DialogField>
                    
                    <DialogField label="Type de Déclenchement">
                        <Select
                            value={formData.trigger_type}
                            onValueChange={(value) => setFormData({ ...formData, trigger_type: value })}
                        >
                            <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                                <SelectItem value="Manual">Manuel</SelectItem>
                                <SelectItem value="Scheduled">Planifié</SelectItem>
                                <SelectItem value="Webhook">Webhook</SelectItem>
                            </SelectContent>
                        </Select>
                    </DialogField>

                    <DialogField label="Description">
                        <EnhancedTextarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Décrivez ce que fait cette macro"
                            rows={3}
                        />
                    </DialogField>

                    <DialogField label="Script" required>
                        <EnhancedTextarea
                            id="macro_script"
                            value={formData.macro_script}
                            onChange={(e) => setFormData({ ...formData, macro_script: e.target.value })}
                            placeholder="Entrez le script YAML/JSON de la macro"
                            rows={12}
                            className="font-mono text-sm"
                        />
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            Format: YAML ou JSON. Définissez les étapes d'exécution de la macro.
                        </p>
                    </DialogField>
                </DialogSection>
            </form>
        </EnhancedDialog>
    );
}
