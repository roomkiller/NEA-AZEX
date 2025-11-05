import React, { useState, useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';

/**
 * VIRTUAL LIST
 * Optimise le rendu de grandes listes en ne rendant que les éléments visibles
 * Améliore drastiquement les performances pour 1000+ items
 */
export default function VirtualList({
    items = [],
    itemHeight = 80,
    containerHeight = 600,
    renderItem,
    overscan = 3,
    className = '',
    emptyMessage = "Aucun élément"
}) {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef(null);

    const handleScroll = (e) => {
        setScrollTop(e.target.scrollTop);
    };

    const { visibleItems, totalHeight, offsetY } = useMemo(() => {
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
        const endIndex = Math.min(
            items.length,
            Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
        );

        const visibleItems = items.slice(startIndex, endIndex).map((item, index) => ({
            item,
            index: startIndex + index
        }));

        const totalHeight = items.length * itemHeight;
        const offsetY = startIndex * itemHeight;

        return { visibleItems, totalHeight, offsetY };
    }, [items, scrollTop, itemHeight, containerHeight, overscan]);

    if (items.length === 0) {
        return (
            <div 
                className={cn(
                    "flex items-center justify-center text-[var(--nea-text-secondary)]",
                    className
                )}
                style={{ height: containerHeight }}
            >
                {emptyMessage}
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className={cn("overflow-y-auto styled-scrollbar", className)}
            style={{ height: containerHeight }}
            role="list"
            aria-label="Liste virtualisée"
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                <div style={{ transform: `translateY(${offsetY}px)` }}>
                    {visibleItems.map(({ item, index }) => (
                        <div
                            key={item.id || index}
                            style={{ height: itemHeight }}
                            role="listitem"
                        >
                            {renderItem(item, index)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}