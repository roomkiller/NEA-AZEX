import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react';

/**
 * TOOLTIP D'AIDE CONTEXTUELLE
 * Composant standardisé pour afficher des infobulles d'aide
 * Améliore l'accessibilité et la documentation in-app
 * 
 * @param {Object} props
 * @param {string} props.content - Contenu du tooltip (texte d'aide)
 * @param {string} props.title - Titre optionnel (en gras)
 * @param {React.ReactNode} props.children - Élément déclencheur (par défaut: icône ?)
 * @param {string} props.side - Position: "top", "right", "bottom", "left"
 */
export default function HelpTooltip({
  content,
  title,
  children,
  side = 'right'
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          {children || (
            <button 
              type="button"
              className="inline-flex items-center justify-center text-[var(--nea-text-muted)] hover:text-[var(--nea-text-primary)] transition-colors"
              aria-label="Aide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent 
          side={side}
          className="max-w-xs bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)] text-[var(--nea-text-primary)]"
        >
          {title && (
            <p className="font-semibold mb-1 text-[var(--nea-text-title)]">
              {title}
            </p>
          )}
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}