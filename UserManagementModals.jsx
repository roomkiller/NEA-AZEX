import React, { useState, useEffect } from 'react';
import { X, Loader2, Mail, Shield, AlertTriangle } from 'lucide-react';
import NeaButton from '../ui/NeaButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { User } from '@/api/entities';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const ROLES = [
  { value: 'user', label: 'Utilisateur' },
  { value: 'technician', label: 'Technicien' },
  { value: 'developer', label: 'Développeur' },
  { value: 'admin', label: 'Administrateur' },
];

export function AddUserModal({ isOpen, onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("L'adresse email est requise.");
      return;
    }
    setIsSaving(true);
    try {
      // La plateforme gère normalement l'invitation et la création de compte.
      // Ici, on simule une invitation en créant directement l'utilisateur.
      // Dans un vrai scénario, on appellerait une fonction d'invitation.
      await User.create({ email, role, full_name: email.split('@')[0] });
      toast.success(`Invitation envoyée à ${email}`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur d'invitation:", error);
      toast.error("Échec de l'envoi de l'invitation.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-secondary)] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Mail className="text-[var(--nea-primary-blue)]"/> Inviter un nouvel utilisateur</DialogTitle>
          <DialogDescription className="text-[var(--nea-text-secondary)]">
            L'utilisateur recevra une invitation pour rejoindre la plateforme.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="email">Adresse Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                className="bg-white/5 mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Rôle</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role" className="bg-white/5 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--nea-bg-surface-solid)] border-[var(--nea-border-primary)] text-white">
                  {ROLES.map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <NeaButton type="button" variant="secondary" onClick={onClose}>Annuler</NeaButton>
            <NeaButton type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Envoyer l'invitation
            </NeaButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditUserModal({ user, isOpen, onClose, onSuccess }) {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setRole(user.role || 'user');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await User.update(user.id, { full_name: fullName, role });
      toast.success(`Utilisateur ${fullName} mis à jour.`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur mise à jour utilisateur:", error);
      toast.error("Échec de la mise à jour.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-secondary)] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Shield className="text-[var(--nea-primary-blue)]"/> Modifier l'utilisateur</DialogTitle>
          <DialogDescription className="text-[var(--nea-text-secondary)]">
            Modification des informations pour {user?.email}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="email-edit">Adresse Email</Label>
              <Input
                id="email-edit"
                type="email"
                value={user?.email || ''}
                className="bg-white/5 mt-1 text-[var(--nea-text-secondary)]"
                disabled
              />
            </div>
             <div>
              <Label htmlFor="full_name">Nom Complet</Label>
              <Input
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-white/5 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="role-edit">Rôle</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role-edit" className="bg-white/5 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--nea-bg-surface-solid)] border-[var(--nea-border-primary)] text-white">
                  {ROLES.map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <NeaButton type="button" variant="secondary" onClick={onClose}>Annuler</NeaButton>
            <NeaButton type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Sauvegarder
            </NeaButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeletionConfirmationDialog({ isOpen, onClose, onConfirm, itemType = 'élément', itemName }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
  }

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-secondary)] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle /> Confirmation de suppression
          </DialogTitle>
          <DialogDescription className="text-[var(--nea-text-secondary)] pt-2">
            Êtes-vous absolument certain de vouloir supprimer cet {itemType} ?
            {itemName && <strong className="block text-white mt-2 break-all">{itemName}</strong>}
            <br/>Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <NeaButton type="button" variant="secondary" onClick={onClose} disabled={isDeleting}>
            Annuler
          </NeaButton>
          <NeaButton variant="destructive" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirmer la suppression
          </NeaButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}