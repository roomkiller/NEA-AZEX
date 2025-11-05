import React, { useState, useEffect, useRef } from 'react';
import { Loader2, ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * LAZY IMAGE
 * Charge les images uniquement quand elles entrent dans le viewport
 * Améliore les performances et réduit la bande passante
 */
export default function LazyImage({
    src,
    alt,
    className = '',
    width,
    height,
    fallbackSrc = null,
    onLoad = () => {},
    onError = () => {},
    threshold = 0.1
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(null);
    const imgRef = useRef(null);
    const observerRef = useRef(null);

    useEffect(() => {
        if (!imgRef.current) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !currentSrc) {
                        setCurrentSrc(src);
                    }
                });
            },
            { threshold }
        );

        observerRef.current.observe(imgRef.current);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [src, currentSrc, threshold]);

    const handleLoad = () => {
        setIsLoaded(true);
        setIsError(false);
        onLoad();
    };

    const handleError = () => {
        setIsError(true);
        setIsLoaded(true);
        if (fallbackSrc && currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
        } else {
            onError();
        }
    };

    return (
        <div
            ref={imgRef}
            className={cn("relative overflow-hidden bg-[var(--nea-bg-surface-hover)]", className)}
            style={{ width, height }}
            role="img"
            aria-label={alt}
        >
            {/* Loading State */}
            {!isLoaded && currentSrc && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[var(--nea-text-muted)] animate-spin" />
                </div>
            )}

            {/* Error State */}
            {isError && currentSrc === fallbackSrc && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--nea-text-muted)]">
                    <ImageOff className="w-8 h-8 mb-2" />
                    <span className="text-xs">Image non disponible</span>
                </div>
            )}

            {/* Actual Image */}
            {currentSrc && (
                <img
                    src={currentSrc}
                    alt={alt}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={cn(
                        "w-full h-full object-cover transition-opacity duration-300",
                        isLoaded && !isError ? "opacity-100" : "opacity-0"
                    )}
                    loading="lazy"
                />
            )}

            {/* Placeholder when no src loaded yet */}
            {!currentSrc && (
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--nea-bg-surface)] to-[var(--nea-bg-surface-hover)]" />
            )}
        </div>
    );
}