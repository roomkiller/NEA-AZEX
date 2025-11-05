import React from "react";
import { motion } from "framer-motion";
import NeaCard from "./ui/NeaCard";

export default function MetricCard({ 
    icon: Icon, 
    title, 
    value, 
    subtitle, 
    trend,
    iconColor = "text-[var(--nea-primary-blue)]",
    iconBg = "bg-[var(--nea-primary-blue)]/10",
    valueColor = "text-gray-900 dark:text-white",
    delay = 0
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <NeaCard className="p-6 hover:border-[var(--nea-primary-blue)] transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center`}>
                        {Icon && <Icon className={`w-6 h-6 ${iconColor}`} />}
                    </div>
                    {trend && (
                        <span className={`text-sm font-semibold ${
                            trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-gray-400'
                        }`}>
                            {trend > 0 ? '+' : ''}{trend}%
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {title}
                </p>
                <p className={`text-3xl font-bold ${valueColor}`}>
                    {value}
                </p>
                {subtitle && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {subtitle}
                    </p>
                )}
            </NeaCard>
        </motion.div>
    );
}