import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import NeaCard from "./NeaCard";

export default function LoadingState({ message = "Chargement...", size = "default" }) {
    const sizeClasses = {
        sm: "h-[200px]",
        default: "h-[400px]",
        lg: "h-[600px]",
        full: "min-h-screen"
    };

    const iconSizes = {
        sm: "w-6 h-6",
        default: "w-8 h-8",
        lg: "w-12 h-12",
        full: "w-16 h-16"
    };

    return (
        <NeaCard className={`flex items-center justify-center ${sizeClasses[size]}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center"
            >
                <Loader2 className={`${iconSizes[size]} text-[var(--nea-primary-blue)] animate-spin mx-auto mb-4`} />
                <p className="text-gray-600 dark:text-gray-400 text-sm">{message}</p>
            </motion.div>
        </NeaCard>
    );
}