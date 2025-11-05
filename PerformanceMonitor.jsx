import { useEffect, useRef } from 'react';

/**
 * PERFORMANCE MONITOR
 * Hook pour surveiller les performances des composants
 * Utile pour identifier les bottlenecks
 */
export function usePerformanceMonitor(componentName, enabled = true) {
    const renderCount = useRef(0);
    const lastRenderTime = useRef(performance.now());

    useEffect(() => {
        if (!enabled) return;

        renderCount.current += 1;
        const now = performance.now();
        const timeSinceLastRender = now - lastRenderTime.current;
        
        if (renderCount.current > 1) {
            console.log(`[Performance] ${componentName}:`, {
                renderCount: renderCount.current,
                timeSinceLastRender: `${timeSinceLastRender.toFixed(2)}ms`,
                fps: timeSinceLastRender > 0 ? (1000 / timeSinceLastRender).toFixed(1) : 'N/A'
            });
        }

        lastRenderTime.current = now;
    });

    return renderCount.current;
}

/**
 * MEASURE RENDER TIME
 * Mesure le temps de rendu d'un composant
 */
export function useMeasureRenderTime(componentName, enabled = true) {
    const startTime = useRef(performance.now());

    useEffect(() => {
        if (!enabled) return;

        const endTime = performance.now();
        const renderTime = endTime - startTime.current;

        if (renderTime > 16.67) { // Plus de 60 FPS
            console.warn(`[Performance Warning] ${componentName} slow render: ${renderTime.toFixed(2)}ms`);
        } else if (enabled) {
            console.log(`[Performance] ${componentName} render: ${renderTime.toFixed(2)}ms`);
        }
    });
}

/**
 * LOG COMPONENT LIFECYCLE
 * Log les phases du lifecycle pour debugging
 */
export function useLifecycleLogger(componentName, enabled = false) {
    useEffect(() => {
        if (!enabled) return;

        console.log(`[Lifecycle] ${componentName} mounted`);

        return () => {
            console.log(`[Lifecycle] ${componentName} unmounted`);
        };
    }, [componentName, enabled]);

    useEffect(() => {
        if (enabled) {
            console.log(`[Lifecycle] ${componentName} updated`);
        }
    });
}

export default {
    usePerformanceMonitor,
    useMeasureRenderTime,
    useLifecycleLogger
};