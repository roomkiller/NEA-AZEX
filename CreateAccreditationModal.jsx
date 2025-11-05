import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NeaButton from '../ui/NeaButton';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const ROLES = ['technician', 'developer', 'admin'];
const ACCESS_LEVELS = { technician: 2, developer: 3, admin: 4 };

// Fonction pour hasher le mot de passe avec l'API Web Crypto native
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export default function CreateAccreditationModal({ isOpen, onClose, onCreated }) {
    const [formData, setFormData] = useState({
        user_email: '',
        username: '',
        password: '',
        role: 'technician',
        access_level: 2,
        security_clearance: 'Restricted',
        department: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                user_email: '',
                username: '',
                password: '',
                role: 'technician',
                access_level: 2,
                security_clearance: 'Restricted',
                department: '',
            });
        }
    }, [isOpen]);

    const generateAccreditationNumber = () => {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `NEA-${timestamp}-${random}`;
    };

    const handleRoleChange = (role) => {
        setFormData({
            ...formData,
            role,
            access_level: ACCESS_LEVELS[role] || 2,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const passwordHash = await hashPassword(formData.password);
            const accreditationNumber = generateAccreditationNumber();
            const currentUser = await base44.auth.me();

            await base44.entities.AccreditationCredential.create({
                user_email: formData.user_email,
                username: formData.username,
                password_hash: passwordHash,
                accreditation_number: accreditationNumber,
                role: formData.role,
                access_level: formData.access_level,
                security_clearance: formData.security_clearance,
                department: formData.department,
                status: 'Active',
                issued_by: currentUser.email,
                issued_date: new Date().toISOString(),
            });

            toast.success("Accréditation créée avec succès");
            onCreated?.();
            onClose();
        } catch (error) {
            console.error("Failed to create accreditation:", error);
            toast.error("Échec de la création");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)] text-gray-900 dark:text-white max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white">Nouvelle Accréditation</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="user_email" className="text-gray-900 dark:text-white">Email utilisateur</Label>
                            <Input
                                id="user_email"
                                type="email"
                                value={formData.user_email}
                                onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                                required
                                className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <Label htmlFor="username" className="text-gray-900 dark:text-white">Nom d'utilisateur</Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                                className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="password" className="text-gray-900 dark:text-white">Mot de passe</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="role" className="text-gray-900 dark:text-white">Rôle</Label>
                            <Select value={formData.role} onValueChange={handleRoleChange}>
                                <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                                    {ROLES.map(role => (
                                        <SelectItem key={role} value={role} className="text-gray-900 dark:text-white focus:bg-[var(--nea-bg-surface-hover)] focus:text-gray-900 dark:focus:text-white">
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="security_clearance" className="text-gray-900 dark:text-white">Niveau d'habilitation</Label>
                            <Select
                                value={formData.security_clearance}
                                onValueChange={(value) => setFormData({ ...formData, security_clearance: value })}
                            >
                                <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                                    <SelectItem value="Restricted" className="text-gray-900 dark:text-white focus:bg-[var(--nea-bg-surface-hover)] focus:text-gray-900 dark:focus:text-white">
                                        Restreint
                                    </SelectItem>
                                    <SelectItem value="Confidential" className="text-gray-900 dark:text-white focus:bg-[var(--nea-bg-surface-hover)] focus:text-gray-900 dark:focus:text-white">
                                        Confidentiel
                                    </SelectItem>
                                    <SelectItem value="Secret" className="text-gray-900 dark:text-white focus:bg-[var(--nea-bg-surface-hover)] focus:text-gray-900 dark:focus:text-white">
                                        Secret
                                    </SelectItem>
                                    <SelectItem value="Top_Secret" className="text-gray-900 dark:text-white focus:bg-[var(--nea-bg-surface-hover)] focus:text-gray-900 dark:focus:text-white">
                                        Top Secret
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="department" className="text-gray-900 dark:text-white">Département</Label>
                        <Input
                            id="department"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <p className="text-sm text-gray-900 dark:text-white">
                            <strong>Niveau d'accès:</strong> {formData.access_level}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Un numéro d'accréditation unique sera généré automatiquement
                        </p>
                    </div>

                    <DialogFooter>
                        <NeaButton type="button" variant="secondary" onClick={onClose}>
                            Annuler
                        </NeaButton>
                        <NeaButton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Création...' : 'Créer l\'accréditation'}
                        </NeaButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}