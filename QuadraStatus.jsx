import React from "react";
import { motion } from "framer-motion";
import { Activity, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import NeaCard from "../ui/NeaCard";
import { Badge } from "@/components/ui/badge";

export default function QuadraStatus({ modules }) {
    const statusCounts = {
        Active: 0,
        Standby: 0,
        Testing: 0,
        Disabled: 0
    };

    modules.forEach(m => {
        if (statusCounts.hasOwnProperty(m.status)) {
            statusCounts[m.status]++;
        }
    });

    const statusConfig = {
        Active: { 
            icon: CheckCircle, 
            color: "text-green-400",
            bgColor: "bg-green-500/10",
            borderColor: "border-green-500/30"
        },
        Standby: { 
            icon: Activity, 
            color: "text-yellow-400",
            bgColor: "bg-yellow-500/10",
            borderColor: "border-yellow-500/30"
        },
        Testing: { 
            icon: AlertCircle, 
            color: "text-blue-400",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/30"
        },
        Disabled: { 
            icon: XCircle, 
            color: "text-red-400",
            bgColor: "bg-red-500/10",
            borderColor: "border-red-500/30"
        }
    };

    return (
        <NeaCard>
            <div className="p-4 border-b border-[var(--nea-border-default)]">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Statut des Modules
                </h3>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(statusCounts).map(([status, count], index) => {
                    const config = statusConfig[status];
                    const Icon = config.icon;
                    
                    return (
                        <motion.div
                            key={status}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}
                        >
                            <Icon className={`w-6 h-6 ${config.color} mb-3`} />
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                {count}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {status}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </NeaCard>
    );
}