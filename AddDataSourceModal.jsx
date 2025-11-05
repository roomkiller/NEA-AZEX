import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Database, Save, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import NeaButton from '../ui/NeaButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";

export default function AddDataSourceModal({ isOpen, onClose, onSuccess, source }) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'API_REST',
        endpoint: '',
        status: 'Inactive',
        update_frequency_seconds: 3600,
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (source) {
            setFormData({
                name: source.name || '',
                type: source.type || 'API_REST',
                endpoint: source.endpoint || '',
                status: source.status || 'Inactive',
                update_frequency_seconds: source.update_frequency_seconds || 3600,
            });
        } else {
            setFormData({
                name: '',
                type: 'API_REST',
                endpoint: '',
                status: 'Inactive',
                update_frequency_seconds: 3600,
            });
        }
    }, [source, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (source) {
                await base44.entities.DataSource.update(source.id, formData);
                toast.success("Source de données mise à jour avec succès !");
            } else {
                await base44.entities.DataSource.create(formData);
                toast.success("Source de données créée avec succès !");
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Erreur sauvegarde source de données:", error);
            toast.error("Échec de la sauvegarde de la source de données.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-2xl bg-[var(--nea-bg-surface)] border border-[var(--nea-border-primary)] rounded-2xl shadow-2xl"
                    >
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center justify-between p-6 border-b border-[var(--nea-border-secondary)]">
                                <div className="flex items-center gap-3">
                                    <Database className="w-6 h-6 text-[var(--nea-primary-blue)]" />
                                    <h2 className="text-xl font-bold text-white">{source ? 'Modifier la' : 'Ajouter une'} source de données</h2>
                                </div>
                                <NeaButton type="button" size="icon" variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </NeaButton>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="name" className="text-gray-300">Nom de la source</Label>
                                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-white/5 border-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type" className="text-gray-300">Type</Label>
                                    <Select name="type" value={formData.type} onValueChange={(v) => handleSelectChange('type', v)}>
                                        <SelectTrigger className="bg-white/5 border-white/10">
                                            <SelectValue placeholder="Sélectionner un type..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="API_REST">API REST</SelectItem>
                                            <SelectItem value="Database">Base de données</SelectItem>
                                            <SelectItem value="Web_Scraper">Web Scraper</SelectItem>
                                            <SelectItem value="File_Feed">Flux de Fichiers</SelectItem>
                                            <SelectItem value="Internal_Stream">Flux Interne</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status" className="text-gray-300">Statut</Label>
                                    <Select name="status" value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}>
                                        <SelectTrigger className="bg-white/5 border-white/10">
                                            <SelectValue placeholder="Sélectionner un statut..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="endpoint" className="text-gray-300">Endpoint / Chaîne de connexion</Label>
                                    <Input id="endpoint" name="endpoint" value={formData.endpoint} onChange={handleChange} required className="bg-white/5 border-white/10" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="update_frequency_seconds" className="text-gray-300">Fréquence de rafraîchissement (secondes)</Label>
                                    <Input id="update_frequency_seconds" name="update_frequency_seconds" type="number" value={formData.update_frequency_seconds} onChange={handleChange} required className="bg-white/5 border-white/10" />
                                </div>
                            </div>
                            
                            <div className="p-6 bg-black/20 border-t border-[var(--nea-border-secondary)] flex justify-end gap-3">
                                <NeaButton type="button" variant="secondary" onClick={onClose}>Annuler</NeaButton>
                                <NeaButton type="submit" variant="primary" disabled={isSaving}>
                                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    {source ? 'Enregistrer les modifications' : 'Créer la source'}
                                </NeaButton>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}