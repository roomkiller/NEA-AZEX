import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import NeaCard from '../ui/NeaCard';
import { DollarSign } from 'lucide-react';

export default function ValueByModuleChart({ data = [] }) {
    if (data.length === 0) {
        return (
            <NeaCard>
                <div className="p-8 text-center">
                    <DollarSign className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Aucune donnée de valorisation disponible
                    </p>
                </div>
            </NeaCard>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <NeaCard>
                <div className="p-4 border-b border-[var(--nea-border-default)]">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-400" />
                        Valeur par Module
                    </h3>
                </div>
                <div className="p-6">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--nea-border-subtle)" />
                            <XAxis 
                                dataKey="name" 
                                stroke="var(--nea-text-secondary)"
                                tick={{ fill: 'var(--nea-text-secondary)', fontSize: 12 }}
                            />
                            <YAxis 
                                stroke="var(--nea-text-secondary)"
                                tick={{ fill: 'var(--nea-text-secondary)', fontSize: 12 }}
                                label={{ 
                                    value: 'Valeur ($CAD)', 
                                    angle: -90, 
                                    position: 'insideLeft',
                                    style: { fill: 'var(--nea-text-secondary)' }
                                }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--nea-bg-surface)',
                                    border: '1px solid var(--nea-border-default)',
                                    borderRadius: '8px',
                                    color: 'var(--nea-text-primary)'
                                }}
                                formatter={(value) => `${value.toLocaleString('fr-CA')} $`}
                            />
                            <Legend 
                                wrapperStyle={{ 
                                    color: 'var(--nea-text-primary)',
                                    fontSize: '12px'
                                }}
                            />
                            <Bar 
                                dataKey="value" 
                                fill="hsl(var(--nea-primary-blue))"
                                name="Valeur ($CAD)"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </NeaCard>
        </motion.div>
    );
}