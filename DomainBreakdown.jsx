import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import NeaCard from '../ui/NeaCard';

const DOMAIN_COLORS = {
    'GÉOPOLITIQUE': '#3b82f6',
    'NUCLÉAIRE': '#ef4444',
    'CLIMAT': '#10b981',
    'BIOLOGIE': '#8b5cf6',
    'CYBERNÉTIQUE': '#f59e0b',
    'SUPERVISION': '#06b6d4'
};

export default function DomainBreakdown({ modules }) {
    const data = useMemo(() => {
        const counts = {};
        modules.forEach(m => {
            const cat = m.category || 'NON CLASSÉ';
            counts[cat] = (counts[cat] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [modules]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <NeaCard>
                <div className="p-4 border-b border-[var(--nea-border-default)]">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Répartition par Domaine
                    </h3>
                </div>
                <div className="p-6">
                    {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={({ name, percent }) => 
                                        `${name} (${(percent * 100).toFixed(0)}%)`
                                    }
                                    labelLine={{ stroke: 'var(--nea-text-secondary)', strokeWidth: 1 }}
                                >
                                    {data.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={DOMAIN_COLORS[entry.name] || '#64748b'} 
                                        />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: 'var(--nea-bg-surface)',
                                        border: '1px solid var(--nea-border-default)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend 
                                    wrapperStyle={{
                                        fontSize: '12px',
                                        color: 'var(--nea-text-primary)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600 dark:text-gray-400">
                                Aucune donnée disponible
                            </p>
                        </div>
                    )}
                </div>
            </NeaCard>
        </motion.div>
    );
}