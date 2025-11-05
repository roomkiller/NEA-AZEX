import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CorrelationGraph({ correlations = [] }) {
  if (correlations.length === 0) {
    return (
      <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
        <CardContent className="p-8 text-center">
          <Activity className="w-12 h-12 mx-auto text-[var(--nea-text-muted)] mb-3" />
          <p className="text-[var(--nea-text-secondary)]">Aucune corrélation détectée</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Activity className="w-5 h-5 text-cyan-400" />
          Graphe de Corrélations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {correlations.map((correlation, index) => {
            const strength = correlation.strength || 0;
            const isStrong = strength > 0.7;
            const isModerate = strength > 0.4 && strength <= 0.7;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isStrong && <AlertTriangle className="w-4 h-4 text-red-400" />}
                    {isModerate && <TrendingUp className="w-4 h-4 text-yellow-400" />}
                    <h4 className="font-semibold text-white">{correlation.source}</h4>
                  </div>
                  <span className="text-sm text-[var(--nea-text-secondary)]">
                    ↔ {correlation.target}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[var(--nea-bg-deep-space)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${strength * 100}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`h-full ${
                        isStrong ? 'bg-red-500' : isModerate ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                    />
                  </div>
                  <span className="text-sm font-semibold text-white w-12 text-right">
                    {(strength * 100).toFixed(0)}%
                  </span>
                </div>

                {correlation.description && (
                  <p className="text-xs text-[var(--nea-text-secondary)] mt-2">
                    {correlation.description}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}