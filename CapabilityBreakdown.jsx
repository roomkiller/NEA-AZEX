import React from "react";
import { motion } from "framer-motion";
import NeaCard from "../ui/NeaCard";
import { Shield, Brain, Target, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const CAPABILITY_ICONS = {
    'Sécurité': Shield,
    'Intelligence': Brain,
    'Analyse': Target,
    'Automatisation': Zap
};

export default function CapabilityBreakdown({ capabilities = [] }) {
    if (capabilities.length === 0) {
        return (
            <NeaCard>
                <div className="p-8 text-center">
                    <Brain className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Aucune capacité évaluée
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
                    <h3 className="font-bold text-gray-900 dark:text-white">
                        Répartition des Capacités
                    </h3>
                </div>
                <div className="p-6 space-y-4">
                    {capabilities.map((capability, index) => {
                        const Icon = CAPABILITY_ICONS[capability.name] || Shield;
                        const score = capability.score || 0;
                        const value = capability.value || 0;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 bg-[var(--nea-bg-surface-hover)] rounded-lg border border-[var(--nea-border-subtle)]"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[var(--nea-primary-blue)]/10 flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-[var(--nea-primary-blue)]" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {capability.name}
                                            </h4>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {value.toLocaleString('fr-CA')} $ CAD
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-lg font-bold text-[var(--nea-primary-blue)]">
                                        {score}%
                                    </span>
                                </div>
                                <Progress value={score} className="h-2" />
                            </motion.div>
                        );
                    })}
                </div>
            </NeaCard>
        </motion.div>
    );
}