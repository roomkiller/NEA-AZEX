import React from 'react';
import { cn } from '@/lib/utils';

/**
 * LIEN "PASSER AU CONTENU"
 * Améliore l'accessibilité keyboard en permettant de sauter la navigation
 * Visible uniquement au focus clavier
 */
export default function SkipToContent({ targetId = 'main-content' }) {
    const handleClick = (e) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
            target.focus();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <a
            href={`#${targetId}`}
            onClick={handleClick}
            className={cn(
                'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999]',
                'bg-[var(--nea-primary-blue)] text-white px-4 py-2 rounded-lg',
                'font-semibold shadow-lg',
                'focus:ring-4 focus:ring-blue-400/50'
            )}
        >
            Passer au contenu principal
        </a>
    );
}