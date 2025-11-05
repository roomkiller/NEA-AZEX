import { useState, useEffect, useRef } from 'react';

/**
 * INTERSECTION OBSERVER HOOK
 * Détecte quand un élément entre dans le viewport
 */
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
        ...options
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [options.threshold, options.rootMargin, hasIntersected]);

  return { targetRef, isIntersecting, hasIntersected };
}

/**
 * LAZY LOAD HOOK
 * Charge le contenu uniquement quand visible
 */
export function useLazyLoad(options = {}) {
  const { targetRef, hasIntersected } = useIntersectionObserver(options);
  return { targetRef, shouldLoad: hasIntersected };
}

export default useIntersectionObserver;