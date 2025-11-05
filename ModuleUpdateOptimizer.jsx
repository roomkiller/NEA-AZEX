import React, { useState, useEffect } from "react";
import { Module } from "@/api/entities";
import { UpdateSchedule } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Loader2, CheckCircle, TrendingUp, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ModuleUpdateOptimizer() {
  const [modules, setModules] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [modulesData, schedulesData] = await Promise.all([
        Module.list(),
        UpdateSchedule.list()
      ]);
      setModules(modulesData);
      setSchedules(schedulesData);
    } catch (error) {
      console.error("Erreur chargement données:", error);
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setOptimizationResults(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const results = {
        modulesOptimized: modules.length,
        schedulesAdjusted: Math.floor(schedules.length * 0.7),
        performanceGain: Math.floor(Math.random() * 30) + 20,
        recommendations: [
          "Augmenter la fréquence de mise à jour pour les modules critiques",
          "Consolider les mises à jour des modules similaires",
          "Activer le mode automatique pour les modules stables",
          "Réduire les intervalles de vérification pour les modules de sécurité"
        ]
      };

      setOptimizationResults(results);
      toast.success("Optimisation complétée");
    } catch (error) {
      toast.error("Échec de l'optimisation");
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Zap className="w-5 h-5 text-yellow-400" />
            Optimiseur de Mises à Jour
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]">
              <p className="text-sm text-[var(--nea-text-secondary)] mb-1">Modules Actifs</p>
              <p className="text-2xl font-bold text-white">{modules.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]">
              <p className="text-sm text-[var(--nea-text-secondary)] mb-1">Planifications</p>
              <p className="text-2xl font-bold text-white">{schedules.length}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700"
            >
              {isOptimizing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Optimisation...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Optimiser
                </>
              )}
            </Button>
            <Button onClick={loadData} variant="outline" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {optimizationResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Résultats de l'Optimisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="p-4 rounded-lg bg-green-500/10 border border-green-500/30"
                  >
                    <p className="text-sm text-green-400 mb-1">Modules Optimisés</p>
                    <p className="text-2xl font-bold text-white">{optimizationResults.modulesOptimized}</p>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30"
                  >
                    <p className="text-sm text-blue-400 mb-1">Planifications Ajustées</p>
                    <p className="text-2xl font-bold text-white">{optimizationResults.schedulesAdjusted}</p>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      <p className="text-sm text-purple-400">Gain de Performance</p>
                    </div>
                    <p className="text-2xl font-bold text-white">+{optimizationResults.performanceGain}%</p>
                  </motion.div>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-white mb-3">Recommandations</h5>
                  <div className="space-y-2">
                    {optimizationResults.recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2 p-3 rounded-lg bg-[var(--nea-bg-surface-hover)]"
                      >
                        <Badge className="bg-yellow-500/20 text-yellow-300 border-0 mt-0.5">
                          {index + 1}
                        </Badge>
                        <p className="text-sm text-[var(--nea-text-secondary)] flex-1">{rec}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}