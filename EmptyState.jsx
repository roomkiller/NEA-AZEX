import React from 'react';
import { motion } from 'framer-motion';
import NeaCard from './NeaCard';

export default function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <NeaCard className="p-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                {Icon && <Icon className="w-16 h-16 mx-auto text-[var(--nea-text-muted)] mb-4" />}
                <h3 className="text-xl font-bold text-[var(--nea-text-title)] mb-2">{title}</h3>
                {description && (
                    <p className="text-[var(--nea-text-secondary)] mb-6">{description}</p>
                )}
                {action && (
                    <div>{action}</div>
                )}
            </motion.div>
        </NeaCard>
    );
}