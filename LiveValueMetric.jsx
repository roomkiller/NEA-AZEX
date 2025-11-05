import React from 'react';
import { motion } from 'framer-motion';
import { useCountUp, formatCurrency } from '../utils/NumberFormatter';

export default function LiveValueMetric({ value, className = '' }) {
    const animatedValue = useCountUp(value, 2000, 0);

    return (
        <motion.span
            className={className}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
        >
            {formatCurrency(animatedValue, 'CAD', { compact: false, decimals: 0, showSymbol: false })}
        </motion.span>
    );
}