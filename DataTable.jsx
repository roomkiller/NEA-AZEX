import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import NeaCard from './NeaCard';

/**
 * DATA TABLE
 * Tableau de données avec tri, pagination et responsive
 */
export default function DataTable({
    data = [],
    columns = [],
    sortable = true,
    pageSize = 10,
    emptyMessage = "Aucune donnée",
    className = ''
}) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);

    // Tri des données
    const sortedData = useMemo(() => {
        if (!sortConfig.key || !sortable) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig, sortable]);

    // Pagination
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return sortedData.slice(startIndex, startIndex + pageSize);
    }, [sortedData, currentPage, pageSize]);

    const totalPages = Math.ceil(sortedData.length / pageSize);

    const handleSort = (key) => {
        if (!sortable) return;

        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getSortIcon = (key) => {
        if (!sortable) return null;
        
        if (sortConfig.key !== key) {
            return <ChevronsUpDown className="w-4 h-4 text-[var(--nea-text-muted)]" />;
        }
        
        return sortConfig.direction === 'asc' 
            ? <ChevronUp className="w-4 h-4 text-[var(--nea-primary-blue)]" />
            : <ChevronDown className="w-4 h-4 text-[var(--nea-primary-blue)]" />;
    };

    if (data.length === 0) {
        return (
            <NeaCard className={cn("p-8 text-center", className)}>
                <p className="text-[var(--nea-text-secondary)]">{emptyMessage}</p>
            </NeaCard>
        );
    }

    return (
        <div className={className}>
            <NeaCard className="overflow-hidden">
                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full" role="table">
                        <thead className="bg-[var(--nea-bg-surface-hover)] border-b border-[var(--nea-border-default)]">
                            <tr role="row">
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        onClick={() => handleSort(column.key)}
                                        className={cn(
                                            "px-4 py-3 text-left text-sm font-semibold text-[var(--nea-text-primary)]",
                                            sortable && "cursor-pointer hover:bg-[var(--nea-bg-surface)] transition-colors"
                                        )}
                                        role="columnheader"
                                        aria-sort={
                                            sortConfig.key === column.key
                                                ? sortConfig.direction === 'asc' ? 'ascending' : 'descending'
                                                : 'none'
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            {column.label}
                                            {getSortIcon(column.key)}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((row, rowIndex) => (
                                <tr
                                    key={row.id || rowIndex}
                                    className="border-b border-[var(--nea-border-subtle)] hover:bg-[var(--nea-bg-surface-hover)] transition-colors"
                                    role="row"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="px-4 py-3 text-sm text-[var(--nea-text-primary)]"
                                            role="cell"
                                        >
                                            {column.render 
                                                ? column.render(row[column.key], row)
                                                : row[column.key]
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--nea-border-default)]">
                        <p className="text-sm text-[var(--nea-text-secondary)]">
                            Affichage {(currentPage - 1) * pageSize + 1} à {Math.min(currentPage * pageSize, sortedData.length)} sur {sortedData.length} résultats
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={cn(
                                    "px-3 py-1 rounded border transition-colors",
                                    currentPage === 1
                                        ? "border-[var(--nea-border-default)] text-[var(--nea-text-muted)] cursor-not-allowed"
                                        : "border-[var(--nea-primary-blue)] text-[var(--nea-primary-blue)] hover:bg-[var(--nea-primary-blue)] hover:text-white"
                                )}
                                aria-label="Page précédente"
                            >
                                Précédent
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className={cn(
                                    "px-3 py-1 rounded border transition-colors",
                                    currentPage === totalPages
                                        ? "border-[var(--nea-border-default)] text-[var(--nea-text-muted)] cursor-not-allowed"
                                        : "border-[var(--nea-primary-blue)] text-[var(--nea-primary-blue)] hover:bg-[var(--nea-primary-blue)] hover:text-white"
                                )}
                                aria-label="Page suivante"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                )}
            </NeaCard>
        </div>
    );
}