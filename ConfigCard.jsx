
import React, { useState } from 'react';
import { Configuration } from '@/api/entities';
import NeaCard from '../ui/NeaCard';
import NeaButton from '../ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function ConfigCard({ config, onEdit, onDelete }) {
  const [showValue, setShowValue] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la clé "${config.key}" ?`)) {
      setIsDeleting(true);
      try {
        await Configuration.delete(config.id);
        toast.success(`La clé "${config.key}" a été supprimée.`);
        onDelete();
      } catch (error) {
        toast.error(`Erreur lors de la suppression de la clé.`);
        console.error("Delete config error:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(config.value);
    setCopied(true);
    toast.success("Valeur copiée dans le presse-papiers.");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!config) return null;

  return (
    <NeaCard className="p-4 flex flex-col h-full">
      <div className="flex items-start justify-between">
        <div>
          <Badge variant="outline" className="border-white/20 text-white/60 mb-2">{config.category || 'N/A'}</Badge>
          <h4 className="font-bold text-white break-all">{config.key || 'Clé non définie'}</h4>
        </div>
        <div className="flex items-center gap-1">
          <NeaButton variant="secondary" size="icon" className="h-8 w-8" onClick={() => onEdit(config)}>
            <Pencil className="w-4 h-4" />
          </NeaButton>
          <NeaButton variant="destructive" size="icon" className="h-8 w-8" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 className="w-4 h-4" />
          </NeaButton>
        </div>
      </div>
      <div className="flex-grow my-3">
        {config.is_sensitive && !showValue ? (
          <div className="flex items-center gap-2 bg-black/20 p-2 rounded-md">
            <span className="text-sm text-[var(--nea-text-secondary)] flex-grow">********************</span>
            <NeaButton variant="secondary" size="sm" onClick={() => setShowValue(true)}>
              <Eye className="w-4 h-4 mr-2" /> Révéler
            </NeaButton>
          </div>
        ) : (
          <div className="relative group">
            <pre className="text-sm text-cyan-300 bg-black/20 p-2 rounded-md whitespace-pre-wrap break-all styled-scrollbar">
              {config.value || ''}
            </pre>
            <NeaButton
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={handleCopy}
            >
              {copied ? <Check className="w-3 h-3 text-green-400"/> : <Copy className="w-3 h-3"/>}
            </NeaButton>
          </div>
        )}
      </div>
      <p className="text-xs text-[var(--nea-text-muted)] line-clamp-2 mb-3">{config.description || 'Aucune description.'}</p>
      <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Badge className={`${config.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {config.is_active ? 'Actif' : 'Inactif'}
          </Badge>
          <Badge variant="outline" className="border-white/20 text-white/60">{config.environment || 'N/A'}</Badge>
        </div>
      </div>
    </NeaCard>
  );
}
