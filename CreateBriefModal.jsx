
import React, { useState } from 'react';
import EnhancedDialog, { DialogSection, DialogField, EnhancedInput, EnhancedTextarea } from '@/components/ui/EnhancedDialog';
import NeaButton from '@/components/ui/NeaButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { FileText, Loader2, Save } from 'lucide-react';

export default function CreateBriefModal({ domain, onClose, onSuccess }) {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        brief_title: '',
        executive_summary: '',
        priority_level: 'Routine',
        classification: 'Restreint',
        domain: domain || 'Militaire'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        try {
            await base44.entities.IntelligenceBrief.create({
                ...formData,
                confidence_score: 75,
                key_findings: [],
                actionable_intelligence: []
            });
            toast.success('Brief créé avec succès');
            onClose();
            onSuccess(); // Call onSuccess after successful creation
            setFormData({
                brief_title: '',
                executive_summary: '',
                priority_level: 'Routine',
                classification: 'Restreint',
                domain: domain || 'Militaire'
            });
        } catch (error) {
            console.error('Erreur création brief:', error);
            toast.error('Échec de la création du brief');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <EnhancedDialog
            open={true}
            onOpenChange={onClose}
            title={`Nouveau Briefing - ${domain}`}
            description="Créez un rapport d'intelligence sectorielle structuré"
            icon={FileText}
            iconColor="text-blue-400"
            iconBg="from-blue-500/20 to-cyan-500/30"
            headerGradient="from-blue-500/10 via-cyan-500/10 to-purple-500/10"
            size="xl"
            footer={
                <div className="flex justify-end gap-3">
                    <NeaButton onClick={onClose} variant="ghost">
                        Annuler
                    </NeaButton>
                    <NeaButton onClick={handleSubmit} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Création...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Créer le Briefing
                            </>
                        )}
                    </NeaButton>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <DialogSection title="Informations Principales" icon={FileText}>
                    <DialogField label="Titre du Briefing" required>
                        <EnhancedInput
                            placeholder="Ex: Analyse tensions Détroit d'Ormuz - Janvier 2025"
                            value={formData.brief_title}
                            onChange={(e) => setFormData({ ...formData, brief_title: e.target.value })}
                        />
                    </DialogField>

                    <div className="grid grid-cols-2 gap-4">
                        <DialogField label="Niveau de Priorité">
                            <Select 
                                value={formData.priority_level} 
                                onValueChange={(value) => setFormData({ ...formData, priority_level: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Routine">Routine</SelectItem>
                                    <SelectItem value="Attention">Attention</SelectItem>
                                    <SelectItem value="Urgent">Urgent</SelectItem>
                                    <SelectItem value="Critique">Critique</SelectItem>
                                    <SelectItem value="Flash">Flash</SelectItem>
                                </SelectContent>
                            </Select>
                        </DialogField>

                        <DialogField label="Classification">
                            <Select 
                                value={formData.classification} 
                                onValueChange={(value) => setFormData({ ...formData, classification: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Public">Public</SelectItem>
                                    <SelectItem value="Restreint">Restreint</SelectItem>
                                    <SelectItem value="Confidentiel">Confidentiel</SelectItem>
                                    <SelectItem value="Secret">Secret</SelectItem>
                                    <SelectItem value="Très_Secret">Très Secret</SelectItem>
                                </SelectContent>
                            </Select>
                        </DialogField>
                    </div>

                    <DialogField label="Résumé Exécutif" required>
                        <EnhancedTextarea
                            placeholder="Résumé en 2-3 phrases des conclusions principales..."
                            value={formData.executive_summary}
                            onChange={(e) => setFormData({ ...formData, executive_summary: e.target.value })}
                            rows={3}
                        />
                    </DialogField>
                </DialogSection>
            </form>
        </EnhancedDialog>
    );
}
