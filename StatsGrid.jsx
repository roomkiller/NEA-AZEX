import React from 'react';
import { motion } from 'framer-motion';
import { useStaggerAnimation } from '../navigation/PageTransition';
import NeaCard from './NeaCard';

export default function StatsGrid({ stats }) {
    const { itemVariants } = useStaggerAnimation();

    if (!stats || stats.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <NeaCard className="p-6 hover:border-[var(--nea-primary-blue)] transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                {Icon && (
                                    <div className={`w-12 h-12 rounded-lg ${stat.iconBg || 'bg-[var(--nea-primary-blue)]/10'} flex items-center justify-center`}>
                                        <Icon className={`w-6 h-6 ${stat.iconColor || 'text-[var(--nea-primary-blue)]'}`} />
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                {stat.label}
                            </p>
                            <p className={`text-3xl font-bold ${stat.valueColor || 'text-gray-900 dark:text-white'}`}>
                                {stat.value}
                            </p>
                            {stat.subtitle && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                                    {stat.subtitle}
                                </p>
                            )}
                        </NeaCard>
                    </motion.div>
                );
            })}
        </div>
    );
}