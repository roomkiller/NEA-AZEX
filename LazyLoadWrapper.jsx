import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * LAZY LOAD WRAPPER
 * Wrapper universel pour le chargement paresseux de composants
 * Réduit la taille du bundle initial et améliore le temps de chargement
 */

const DefaultLoadingFallback = ({ message = "Chargement..." }) => (
    <div className="flex-1 flex justify-center items-center h-full min-h-[400px]">
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4"
        >
            <Loader2 className="w-8 h-8 text-[var(--nea-primary-blue)] animate-spin mx-auto" />
            <p className="text-[var(--nea-text-primary)]">{message}</p>
        </motion.div>
    </div>
);

/**
 * Crée un composant lazy-loaded avec fallback personnalisé
 */
export function createLazyComponent(importFn, options = {}) {
    const {
        fallback = null,
        errorBoundary = true,
        loadingMessage = "Chargement du module...",
        preload = false
    } = options;

    const LazyComponent = lazy(importFn);

    // Précharger si demandé
    if (preload) {
        importFn();
    }

    const WrappedComponent = (props) => (
        <Suspense fallback={fallback || <DefaultLoadingFallback message={loadingMessage} />}>
            <LazyComponent {...props} />
        </Suspense>
    );

    // Ajouter une fonction de préchargement
    WrappedComponent.preload = () => importFn();

    return WrappedComponent;
}

/**
 * Hook pour précharger des composants au survol
 */
export function usePreloadOnHover(preloadFn) {
    const handleMouseEnter = React.useCallback(() => {
        if (preloadFn) {
            preloadFn();
        }
    }, [preloadFn]);

    return { onMouseEnter: handleMouseEnter };
}

/**
 * HOC pour rendre un composant lazy
 */
export function withLazyLoad(Component, options = {}) {
    return createLazyComponent(() => Promise.resolve({ default: Component }), options);
}

export default createLazyComponent;