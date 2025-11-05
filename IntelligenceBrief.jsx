import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import NeaButton from '../ui/NeaButton';
import { Brain, Download, Copy, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function IntelligenceBrief({ summary, onExport }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        if (summary) {
            navigator.clipboard.writeText(summary);
            setIsCopied(true);
            toast.success('Copié dans le presse-papiers');
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    if (!summary) {
        return (
            <NeaCard>
                <div className="p-8 text-center">
                    <Brain className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Aucune intelligence collectée
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
                <div className="p-4 border-b border-[var(--nea-border-default)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">
                                Résumé d'Intelligence
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Informations apprises de l'attaquant
                            </p>
                        </div>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        Analyse IA
                    </Badge>
                </div>

                <div className="p-6">
                    <div className="bg-[var(--nea-bg-surface-hover)] rounded-lg p-4 mb-4 border border-[var(--nea-border-subtle)]">
                        <p className="text-sm text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap">
                            {summary}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <NeaButton
                            size="sm"
                            variant="secondary"
                            onClick={handleCopy}
                        >
                            {isCopied ? (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                                    Copié
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copier
                                </>
                            )}
                        </NeaButton>
                        
                        {onExport && (
                            <NeaButton
                                size="sm"
                                onClick={onExport}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Exporter
                            </NeaButton>
                        )}
                    </div>
                </div>
            </NeaCard>
        </motion.div>
    );
}