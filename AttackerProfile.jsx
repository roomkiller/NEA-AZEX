import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { User, Target, Wrench, Brain, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const SKILL_LEVEL_CONFIG = {
    'Novice': { color: 'text-green-400', bg: 'bg-green-500/10', score: 25 },
    'Intermédiaire': { color: 'text-blue-400', bg: 'bg-blue-500/10', score: 50 },
    'Expert': { color: 'text-orange-400', bg: 'bg-orange-500/10', score: 75 },
    'Élite/État': { color: 'text-red-400', bg: 'bg-red-500/10', score: 100 }
};

const AGGRESSIVENESS_CONFIG = {
    'Prudent': { color: 'text-blue-400', bg: 'bg-blue-500/10' },
    'Modéré': { color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    'Agressif': { color: 'text-red-400', bg: 'bg-red-500/10' }
};

const PSYCHOLOGICAL_STATE_CONFIG = {
    'Confiant': { color: 'text-green-400', icon: TrendingUp },
    'Frustré': { color: 'text-red-400', icon: Target },
    'Méthodique': { color: 'text-blue-400', icon: Brain },
    'Erratique': { color: 'text-orange-400', icon: Target }
};

export default function AttackerProfile({ profile }) {
    if (!profile) {
        return (
            <NeaCard>
                <div className="p-8 text-center">
                    <User className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Aucun profil d'attaquant disponible
                    </p>
                </div>
            </NeaCard>
        );
    }

    const skillConfig = SKILL_LEVEL_CONFIG[profile.skill_level] || SKILL_LEVEL_CONFIG['Novice'];
    const aggressivenessConfig = AGGRESSIVENESS_CONFIG[profile.aggressiveness] || AGGRESSIVENESS_CONFIG['Modéré'];
    const psychConfig = PSYCHOLOGICAL_STATE_CONFIG[profile.psychological_state] || PSYCHOLOGICAL_STATE_CONFIG['Confiant'];
    const PsychIcon = psychConfig.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <NeaCard>
                <div className="p-4 border-b border-[var(--nea-border-default)]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">
                                Profil Attaquant
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Analyse psychologique et technique
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Niveau de Compétence
                            </p>
                            <Badge className={`${skillConfig.bg} ${skillConfig.color} border-0`}>
                                {profile.skill_level}
                            </Badge>
                        </div>
                        <Progress value={skillConfig.score} className="h-3" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <NeaCard className="p-4 bg-[var(--nea-bg-surface-hover)]">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                Agressivité
                            </p>
                            <Badge className={`${aggressivenessConfig.bg} ${aggressivenessConfig.color} border-0`}>
                                {profile.aggressiveness}
                            </Badge>
                        </NeaCard>

                        <NeaCard className="p-4 bg-[var(--nea-bg-surface-hover)]">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                État Psychologique
                            </p>
                            <div className="flex items-center gap-2">
                                <PsychIcon className={`w-4 h-4 ${psychConfig.color}`} />
                                <span className={`text-sm font-semibold ${psychConfig.color}`}>
                                    {profile.psychological_state}
                                </span>
                            </div>
                        </NeaCard>
                    </div>

                    {profile.current_objective && (
                        <div className="pt-4 border-t border-[var(--nea-border-subtle)]">
                            <div className="flex items-start gap-3">
                                <Target className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                        Objectif Identifié
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {profile.current_objective}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {profile.identified_tools && profile.identified_tools.length > 0 && (
                        <div className="pt-4 border-t border-[var(--nea-border-subtle)]">
                            <div className="flex items-start gap-3">
                                <Wrench className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                        Outils Détectés
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.identified_tools.map((tool, idx) => (
                                            <Badge
                                                key={idx}
                                                className="bg-blue-500/10 text-blue-400 border-blue-500/30 border text-xs"
                                            >
                                                {tool}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </NeaCard>
        </motion.div>
    );
}