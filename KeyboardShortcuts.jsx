import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * GUIDE DES RACCOURCIS CLAVIER
 * Améliore l'accessibilité en affichant les raccourcis disponibles
 * Affichable avec Shift + ?
 */
const SHORTCUTS = [
    { keys: ['⌘', 'K'], description: 'Recherche globale' },
    { keys: ['⌘', '/'], description: 'Afficher ce guide' },
    { keys: ['Esc'], description: 'Fermer les modales' },
    { keys: ['Tab'], description: 'Navigation entre éléments' },
    { keys: ['Enter'], description: 'Activer l\'élément focus' },
    { keys: ['Space'], description: 'Activer boutons/checkboxes' },
    { keys: ['?'], description: 'Aide contextuelle' },
];

export default function KeyboardShortcuts() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Afficher le guide avec Cmd/Ctrl + /
            if ((e.metaKey || e.ctrlKey) && e.key === '/') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            
            // Fermer avec Escape
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-[9998]"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-lg"
                        role="dialog"
                        aria-labelledby="shortcuts-title"
                        aria-modal="true"
                    >
                        <div className="bg-[var(--nea-bg-surface)] border-2 border-[var(--nea-border-default)] rounded-lg shadow-2xl p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Command className="w-6 h-6 text-[var(--nea-primary-blue)]" aria-hidden="true" />
                                    <h2 id="shortcuts-title" className="text-xl font-bold text-[var(--nea-text-title)]">
                                        Raccourcis Clavier
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-[var(--nea-bg-surface-hover)] rounded-lg transition-colors"
                                    aria-label="Fermer le guide des raccourcis"
                                >
                                    <X className="w-5 h-5 text-[var(--nea-text-secondary)]" />
                                </button>
                            </div>

                            {/* Shortcuts List */}
                            <div className="space-y-3" role="list">
                                {SHORTCUTS.map((shortcut, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[var(--nea-bg-surface-hover)] transition-colors"
                                        role="listitem"
                                    >
                                        <span className="text-[var(--nea-text-primary)]">
                                            {shortcut.description}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {shortcut.keys.map((key, keyIndex) => (
                                                <kbd
                                                    key={keyIndex}
                                                    className={cn(
                                                        "px-2 py-1 text-xs font-semibold rounded",
                                                        "bg-[var(--nea-bg-deep-space)] border border-[var(--nea-border-default)]",
                                                        "text-[var(--nea-text-title)] shadow-sm"
                                                    )}
                                                >
                                                    {key}
                                                </kbd>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="mt-6 pt-4 border-t border-[var(--nea-border-subtle)] text-center">
                                <p className="text-xs text-[var(--nea-text-muted)]">
                                    Appuyez sur <kbd className="px-1.5 py-0.5 text-xs bg-[var(--nea-bg-deep-space)] border border-[var(--nea-border-default)] rounded">Esc</kbd> ou cliquez à l'extérieur pour fermer
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}