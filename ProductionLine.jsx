import React, { useState } from "react";
import { Module } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Factory, Loader2, CheckCircle, Cog, Play } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductionLine({ testResults }) {
  const [isProducing, setIsProducing] = useState(false);
  const [productionStatus, setProductionStatus] = useState(null);
  const [progress, setProgress] = useState(0);

  const productionSteps = [
    { id: 1, name: "Initialisation Ligne", duration: 2000 },
    { id: 2, name: "Compilation Modules", duration: 3000 },
    { id: 3, name: "Injection Autonomie", duration: 2500 },
    { id: 4, name: "Tests Qualité", duration: 2000 },
    { id: 5, name: "Packaging Final", duration: 1500 }
  ];

  const handleStartProduction = async () => {
    if (!testResults || testResults.length === 0) {
      toast.error("Veuillez d'abord exécuter les tests du prototype");
      return;
    }

    const passRate = (testResults.filter(t => t.passed).length / testResults.length) * 100;
    if (passRate < 80) {
      toast.error("Taux de réussite insuffisant pour la production (< 80%)");
      return;
    }

    setIsProducing(true);
    setProductionStatus([]);
    setProgress(0);

    const statuses = [];

    for (let i = 0; i < productionSteps.length; i++) {
      const step = productionSteps[i];
      const startProgress = (i / productionSteps.length) * 100;
      const endProgress = ((i + 1) / productionSteps.length) * 100;

      statuses.push({ ...step, status: 'in_progress' });
      setProductionStatus([...statuses]);

      for (let p = Math.floor(startProgress); p <= endProgress; p += 2) {
        setProgress(p);
        await new Promise(resolve => setTimeout(resolve, step.duration / 50));
      }

      statuses[i].status = 'completed';
      setProductionStatus([...statuses]);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setProgress(100);

    try {
      const modules = await Module.filter({ status: 'Active' });
      for (const module of modules.slice(0, 3)) {
        await Module.update(module.id, {
          ...module,
          description: module.description + " [AUTONOMISÉ]"
        });
      }
      toast.success(`Production complétée: ${modules.slice(0, 3).length} modules autonomisés`);
    } catch (error) {
      toast.warning("Production complétée mais mise à jour modules échouée");
    }

    setIsProducing(false);
  };

  const completedSteps = productionStatus?.filter(s => s.status === 'completed').length || 0;

  return (
    <div className="space-y-6">
      <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2">
              <Factory className="w-5 h-5 text-orange-400" />
              Phase 4: Ligne de Production
            </span>
            <Button
              onClick={handleStartProduction}
              disabled={isProducing || !testResults}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isProducing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Production...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Démarrer Production
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {isProducing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-[var(--nea-text-secondary)]">
                Progression: {progress.toFixed(0)}% • Étape {completedSteps + 1}/{productionSteps.length}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {productionSteps.map((step, index) => {
              const stepStatus = productionStatus?.find(s => s.id === step.id);
              const isCompleted = stepStatus?.status === 'completed';
              const isInProgress = stepStatus?.status === 'in_progress';

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    isCompleted ? 'bg-green-500/10 border-green-500/30' :
                    isInProgress ? 'bg-blue-500/10 border-blue-500/30' :
                    'bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-subtle)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${
                        isCompleted ? 'bg-green-500/20' :
                        isInProgress ? 'bg-blue-500/20' :
                        'bg-gray-500/20'
                      }`}>
                        {isCompleted && <CheckCircle className="w-5 h-5 text-green-400" />}
                        {isInProgress && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
                        {!stepStatus && <Cog className="w-5 h-5 text-gray-400" />}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-white">{step.name}</h5>
                        <p className="text-xs text-[var(--nea-text-muted)]">
                          Durée estimée: {step.duration}ms
                        </p>
                      </div>
                    </div>
                    {isCompleted && (
                      <Badge className="bg-green-500/20 text-green-300 border-0">
                        Complété
                      </Badge>
                    )}
                    {isInProgress && (
                      <Badge className="bg-blue-500/20 text-blue-300 border-0">
                        En cours
                      </Badge>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {!isProducing && productionStatus && productionStatus.every(s => s.status === 'completed') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h4 className="text-lg font-bold text-white">Production Complétée avec Succès</h4>
                </div>
                <p className="text-sm text-[var(--nea-text-secondary)]">
                  Les modules autonomes sont maintenant prêts pour le déploiement et la formation du personnel.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}