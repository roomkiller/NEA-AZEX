import React from 'react';
import { cn } from '@/lib/utils';

/**
 * SKELETON LOADER
 * Composant de chargement élégant pour améliorer l'UX
 */
export default function Skeleton({ className = '', width, height, variant = 'default' }) {
    const variants = {
        default: 'rounded-lg',
        text: 'rounded h-4',
        circle: 'rounded-full',
        card: 'rounded-xl h-32'
    };

    return (
        <div
            className={cn(
                "animate-pulse bg-gradient-to-r from-[var(--nea-bg-surface-hover)] via-[var(--nea-bg-surface)] to-[var(--nea-bg-surface-hover)]",
                "bg-[length:200%_100%]",
                variants[variant],
                className
            )}
            style={{ 
                width, 
                height,
                animation: 'shimmer 2s infinite'
            }}
            role="status"
            aria-label="Chargement en cours"
        />
    );
}

export function SkeletonText({ lines = 3, className = '' }) {
    return (
        <div className={cn("space-y-2", className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    variant="text"
                    width={i === lines - 1 ? '70%' : '100%'}
                />
            ))}
        </div>
    );
}

export function SkeletonCard({ className = '' }) {
    return (
        <div className={cn("p-4 border border-[var(--nea-border-default)] rounded-xl", className)}>
            <div className="flex items-start gap-4">
                <Skeleton variant="circle" width={48} height={48} />
                <div className="flex-1 space-y-2">
                    <Skeleton width="60%" height={16} />
                    <Skeleton width="80%" height={12} />
                    <Skeleton width="40%" height={12} />
                </div>
            </div>
        </div>
    );
}