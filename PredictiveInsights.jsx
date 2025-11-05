import React from 'react';
import NeaCard from '../ui/NeaCard';
import { Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function PredictiveInsights({ insights = [] }) {
  if (insights.length === 0) {
    return (
      <NeaCard className="p-8 text-center">
        <Lightbulb className="w-12 h-12 mx-auto text-[var(--nea-text-muted)] mb-3" />
        <p className="text-[var(--nea-text-secondary)]">Aucune prédiction disponible</p>
      </NeaCard>
    );
  }

  return (
    <NeaCard>
      <div className="p-4 border-b border-[var(--nea-border-default)]">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          Insights Prédictifs
        </h3>
      </div>
      <div className="divide-y divide-[var(--nea-border-default)]">
        {insights.map((insight, index) => {
          const confidence = insight.confidence || 0;
          const isHighConfidence = confidence > 0.7;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 hover:bg-[var(--nea-bg-surface-hover)] transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-white flex-1">{insight.title || `Insight ${index + 1}`}</h4>
                <Badge className={`${isHighConfidence ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'} border-0`}>
                  {(confidence * 100).toFixed(0)}% confiance
                </Badge>
              </div>
              <p className="text-sm text-[var(--nea-text-secondary)]">
                {insight.description || 'Aucune description disponible'}
              </p>
            </motion.div>
          );
        })}
      </div>
    </NeaCard>
  );
}