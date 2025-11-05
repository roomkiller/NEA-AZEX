
import React, { useState } from 'react';
import { FileText, Save, Grid3x3 } from 'lucide-react';

import EnhancedDialog, { DialogSection, DialogField, EnhancedInput, EnhancedTextarea } from '../ui/EnhancedDialog';
import NeaButton from '../ui/NeaButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreateModuleModal({ onClose, onCreate }) {
    const [formData, setFormData] = useState({
        name: '',
        category: 'GÉOPOLITIQUE',
        version: '1.0.0',
        description: '',
        status: 'Active'
    });

    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when field is edited
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
        if (!formData.description.trim()) newErrors.description = 'La description est requise';
        if (!formData.version.trim()) newErrors.version = 'La version est requise';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // The handleSubmit function is called directly by the onClick of the footer button.
    // The <form> element is a child of EnhancedDialog, but the submit button is in the footer prop,
    // which means it's outside the <form> in the DOM structure.
    // Therefore, the form's onSubmit event will not be triggered by the footer button,
    // and `e.preventDefault()` is not applicable here as the event would be a MouseEvent.
    const handleSubmit = () => {
        if (validate()) {
            onCreate(formData);
        }
    };

    return (
        <EnhancedDialog
            open={true}
            onOpenChange={onClose}
            title="Nouveau Module Système"
            description="Créez un nouveau module fonctionnel pour NEA-AZEX"
            icon={Grid3x3}
            iconColor="text-cyan-400"
            iconBg="from-cyan-500/20 to-blue-500/30"
            headerGradient="from-cyan-500/10 via-blue-500/10 to-indigo-500/10"
            size="lg"
            footer={
                <div className="flex justify-end gap-3">
                    <NeaButton onClick={onClose} variant="ghost">
                        Annuler
                    </NeaButton>
                    <NeaButton onClick={handleSubmit}>
                        <Save className="w-4 h-4 mr-2" />
                        Créer le Module
                    </NeaButton>
                </div>
            }
        >
            {/* The form element is used for semantic grouping and validation display.
                The actual submission is triggered by the button in the dialog's footer. */}
            <form className="space-y-6">
                <DialogSection title="Identification" icon={FileText}>
                    <DialogField label="Nom du Module" required error={errors.name}>
                        <EnhancedInput
                            placeholder="Ex: PRÉDICTION-SISMIQUE-V2"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </DialogField>

                    <DialogField label="Description" required error={errors.description}>
                        <EnhancedTextarea
                            placeholder="Description détaillée du module..."
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={3}
                        />
                    </DialogField>
                </DialogSection>

                <DialogSection title="Paramètres Généraux">
                    <div className="grid md:grid-cols-3 gap-4">
                        <DialogField label="Catégorie" required>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleChange('category', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GÉOPOLITIQUE">Géopolitique</SelectItem>
                                    <SelectItem value="NUCLÉAIRE">Nucléaire</SelectItem>
                                    <SelectItem value="CLIMAT">Climat</SelectItem>
                                    <SelectItem value="BIOLOGIE">Biologie</SelectItem>
                                    <SelectItem value="CYBERNÉTIQUE">Cybernétique</SelectItem>
                                    <SelectItem value="SUPERVISION">Supervision</SelectItem>
                                </SelectContent>
                            </Select>
                        </DialogField>

                        <DialogField label="Version" required error={errors.version}>
                            <EnhancedInput
                                placeholder="1.0.0"
                                value={formData.version}
                                onChange={(e) => handleChange('version', e.target.value)}
                            />
                        </DialogField>

                        <DialogField label="Statut initial">
                            <Select
                                value={formData.status}
                                onValueChange={(value) => handleChange('status', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Actif</SelectItem>
                                    <SelectItem value="Standby">En pause</SelectItem>
                                    <SelectItem value="Testing">En test</SelectItem>
                                    <SelectItem value="Disabled">Désactivé</SelectItem>
                                </SelectContent>
                            </Select>
                        </DialogField>
                    </div>
                </DialogSection>
            </form>
        </EnhancedDialog>
    );
}
