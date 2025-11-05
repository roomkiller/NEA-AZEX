import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import cacheService from './CacheService';

/**
 * OPTIMIZATION PROVIDER
 * Fournit un contexte global pour les optimisations de performance
 * Gère le cache, le lazy loading, et les métriques de performance
 */

const OptimizationContext = createContext(null);

export const useOptimization = () => {
    const context = useContext(OptimizationContext);
    if (!context) {
        throw new Error('useOptimization must be used within OptimizationProvider');
    }
    return context;
};

export function OptimizationProvider({ children }) {
    const [metrics, setMetrics] = useState({
        pageLoadTime: 0,
        apiCallCount: 0,
        cacheHitRate: '0%',
        averageResponseTime: 0
    });

    const [isLowPowerMode, setIsLowPowerMode] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        // Détecter les préférences utilisateur
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(motionQuery.matches);

        const handleChange = (e) => setPrefersReducedMotion(e.matches);
        motionQuery.addEventListener('change', handleChange);

        // Mesurer le temps de chargement initial
        if (performance.timing) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            setMetrics(prev => ({ ...prev, pageLoadTime: loadTime }));
        }

        return () => motionQuery.removeEventListener('change', handleChange);
    }, []);

    /**
     * Activer le mode économie d'énergie
     */
    const toggleLowPowerMode = useCallback(() => {
        setIsLowPowerMode(prev => !prev);
    }, []);

    /**
     * Obtenir les statistiques du cache
     */
    const getCacheStats = useCallback(() => {
        return cacheService.getStats();
    }, []);

    /**
     * Invalider le cache
     */
    const invalidateCache = useCallback(async (cacheKey) => {
        await cacheService.invalidate(cacheKey);
    }, []);

    /**
     * Nettoyer tous les caches
     */
    const clearAllCaches = useCallback(async () => {
        await cacheService.clearAll();
    }, []);

    /**
     * Optimiser les images pour le mode économie
     */
    const getOptimizedImageQuality = useCallback(() => {
        return isLowPowerMode ? 60 : 90;
    }, [isLowPowerMode]);

    /**
     * Décider si on doit précharger des ressources
     */
    const shouldPreload = useCallback(() => {
        // Ne pas précharger en mode économie ou sur connexion lente
        if (isLowPowerMode) return false;
        
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.saveData || connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
                return false;
            }
        }
        
        return true;
    }, [isLowPowerMode]);

    /**
     * Enregistrer une métrique de performance
     */
    const recordMetric = useCallback((metricName, value) => {
        setMetrics(prev => ({
            ...prev,
            [metricName]: value
        }));
    }, []);

    const value = {
        metrics,
        isLowPowerMode,
        prefersReducedMotion,
        toggleLowPowerMode,
        getCacheStats,
        invalidateCache,
        clearAllCaches,
        getOptimizedImageQuality,
        shouldPreload,
        recordMetric,
        cacheService
    };

    return (
        <OptimizationContext.Provider value={value}>
            {children}
        </OptimizationContext.Provider>
    );
}

/**
 * Hook pour utiliser le cache facilement - VERSION OPTIMISÉE
 */
export function useCachedData(cacheKey, fetchFn, options = {}) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

    useEffect(() => {
        let mounted = true;
        let retryTimeout = null;

        const loadData = async () => {
            // Si on a déjà chargé une fois, ne pas réafficher le loading
            if (!hasLoadedOnce) {
                setIsLoading(true);
            }

            try {
                const result = await cacheService.withCache(cacheKey, fetchFn, options);
                
                if (mounted) {
                    setData(result);
                    setError(null);
                    setHasLoadedOnce(true);
                }
            } catch (err) {
                if (mounted) {
                    setError(err);
                    console.error('[useCachedData] Error:', err);

                    // Retry avec backoff si rate limit
                    if (err.message && err.message.includes('Rate limit')) {
                        console.log('[useCachedData] Rate limit hit, will retry in 10s');
                        retryTimeout = setTimeout(() => {
                            if (mounted) {
                                loadData();
                            }
                        }, 10000);
                    }
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        loadData();

        return () => {
            mounted = false;
            if (retryTimeout) {
                clearTimeout(retryTimeout);
            }
        };
    }, [cacheKey]); // Retirer fetchFn et options des dépendances pour éviter boucles infinies

    const refresh = useCallback(async () => {
        await cacheService.invalidate(cacheKey);
        setIsLoading(true);
        
        try {
            const result = await cacheService.withCache(cacheKey, fetchFn, options);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [cacheKey, fetchFn, options]);

    return { data, isLoading, error, refresh };
}

export default OptimizationProvider;