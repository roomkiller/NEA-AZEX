import React from 'react';
import { motion } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import { Zap, Target, Shield, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function AdversarialTrainingVisual({ progress = 0, stage = 'Initialization' }) {
    const stages = [
        { name: 'Initialization', icon: Shield, progress: 0 },
        { name: 'Attack Generation', icon: Target, progress: 25 },
        { name: 'Defense Testing', icon: Shield, progress: 50 },
        { name: 'Model Refinement', icon: TrendingUp, progress: 75 },
        { name: 'Validation', icon: Zap, progress: 100 }
    ];

    const currentStageIndex = stages.findIndex(s => s.name === stage);
    const currentProgress = currentStageIndex >= 0 ? stages[currentStageIndex].progress : 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <NeaCard>
                <div className="p-4 border-b border-[var(--nea-border-default)]">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        Entraînement Adversarial en Cours
                    </h3>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Progression Globale
                            </span>
                            <span className="text-sm font-bold text-[var(--nea-primary-blue)]">
                                {currentProgress}%
                            </span>
                        </div>
                        <Progress value={currentProgress} className="h-3" />
                    </div>

                    <div className="space-y-4">
                        {stages.map((stageItem, index) => {
                            const StageIcon = stageItem.icon;
                            const isActive = stageItem.name === stage;
                            const isCompleted = index < currentStageIndex;

                            return (
                                <motion.div
                                    key={stageItem.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                                        isActive
                                            ? 'bg-[var(--nea-primary-blue)]/10 border-[var(--nea-primary-blue)]'
                                            : isCompleted
                                            ? 'bg-green-500/10 border-green-500/30'
                                            : 'bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-subtle)]'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        isActive ? 'bg-[var(--nea-primary-blue)]/20' :
                                        isCompleted ? 'bg-green-500/20' :
                                        'bg-gray-500/20'
                                    }`}>
                                        <StageIcon className={`w-5 h-5 ${
                                            isActive ? 'text-[var(--nea-primary-blue)]' :
                                            isCompleted ? 'text-green-400' :
                                            'text-gray-400'
                                        }`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-semibold ${
                                            isActive ? 'text-[var(--nea-primary-blue)]' :
                                            isCompleted ? 'text-green-400' :
                                            'text-gray-600 dark:text-gray-400'
                                        }`}>
                                            {stageItem.name}
                                        </p>
                                    </div>
                                    {isActive && (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                                        >
                                            <Zap className="w-5 h-5 text-[var(--nea-primary-blue)]" />
                                        </motion.div>
                                    )}
                                    {isCompleted && (
                                        <Shield className="w-5 h-5 text-green-400" />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </NeaCard>
        </motion.div>
    );
}