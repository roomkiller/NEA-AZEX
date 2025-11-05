import React from 'react';

export default function PageHeader({ title, subtitle, icon, actions }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
                {icon && <div className="flex-shrink-0">{icon}</div>}
                <div>
                    <h1 className="text-3xl font-bold text-[var(--nea-text-title)] text-glow">{title}</h1>
                    {subtitle && (
                        <p className="text-[var(--nea-text-secondary)] mt-1">{subtitle}</p>
                    )}
                </div>
            </div>
            {actions && (
                <div className="flex-shrink-0">{actions}</div>
            )}
        </div>
    );
}