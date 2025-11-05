import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * RÉGION LIVE ARIA
 * Annonce les changements dynamiques aux lecteurs d'écran
 * 
 * @param {Object} props
 * @param {string} props.message - Message à annoncer
 * @param {string} props.politeness - "polite", "assertive", "off"
 * @param {boolean} props.atomic - Annoncer le message complet (default: true)
 * @param {boolean} props.visible - Afficher visuellement (default: false)
 */
export default function LiveRegion({
    message,
    politeness = 'polite',
    atomic = true,
    visible = false,
    className = ''
}) {
    const previousMessage = useRef('');

    useEffect(() => {
        // Ne pas annoncer si le message n'a pas changé
        if (message === previousMessage.current) return;
        previousMessage.current = message;
    }, [message]);

    if (!message) return null;

    return (
        <div
            role="status"
            aria-live={politeness}
            aria-atomic={atomic}
            className={cn(
                !visible && 'sr-only',
                'transition-opacity duration-200',
                className
            )}
        >
            {message}
        </div>
    );
}

/**
 * HOOK POUR ANNONCER DES MESSAGES
 * Usage: const announce = useAnnounce();
 *        announce('Données chargées avec succès');
 */
export function useAnnounce() {
    const [announcement, setAnnouncement] = React.useState('');

    const announce = React.useCallback((message, delay = 100) => {
        // Clear précédent
        setAnnouncement('');
        
        // Petit délai pour forcer la relecture
        setTimeout(() => {
            setAnnouncement(message);
        }, delay);
    }, []);

    return { announcement, announce };
}