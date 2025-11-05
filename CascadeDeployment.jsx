import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Rocket, Loader2, CheckCircle, AlertCircle, Server } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CascadeDeployment() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStage, setDeploymentStage] = useState(null);
  const [progress, setProgress] = useState(0);

  const deploymentStages = [
    { id: 1, name: "Préparation", description: "Configuration environnement" },
    { id: 2, name: "Compilation", description: "Build des composants" },
    { id: 3, name: "Tests Finaux", description: "Vérification pré-production" },
    { id: 4, name: "Déploiement", description: "Mise en production" },
    { id: 5, name: "Validation", description: "Tests post-déploiement" }
  ];

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentStage(null);
    setProgress(0);

    for (let i = 0; i < deploymentStages.length; i++) {
      const stage = deploymentStages[i];
      setDeploymentStage({ ...stage, status: 'in_progress' });
      
      const stageProgress = ((i + 1) / deploymentStages.length) * 100;
      
      for (let p = Math.floor(progress); p <= stageProgress; p += 5) {
        setProgress(p);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const success = Math.random() > 0.1;
      
      if (success) {
        setDeploymentStage({ ...stage, status: 'success' });
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        setDeploymentStage({ ...stage, status: 'failed' });
        toast.error(`Échec à l'étape: ${stage.name}`);
        setIsDeploying(false);
        return;
      }
    }

    setProgress(100);
    toast.success('Déploiement réussi!');
    setIsDeploying(false);
  };

  return (
    <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-orange-400" />
            Déploiement en Production
          </span>
          <Button
            onClick={handleDeploy}
            disabled={isDeploying}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isDeploying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Déploiement...
              </>
            ) : (
              <>
                <Server className="w-4 h-4 mr-2" />
                Déployer
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {isDeploying && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-[var(--nea-text-secondary)]">
              Progression globale: {progress.toFixed(0)}%
            </p>
          </div>
        )}

        <div className="space-y-3">
          {deploymentStages.map((stage, index) => {
            const isCurrentStage = deploymentStage?.id === stage.id;
            const isPastStage = deploymentStage && deploymentStage.id > stage.id;
            const isInProgress = isCurrentStage && deploymentStage?.status === 'in_progress';
            const isSuccess = (isCurrentStage && deploymentStage?.status === 'success') || isPastStage;
            const isFailed = isCurrentStage && deploymentStage?.status === 'failed';

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${
                  isSuccess ? 'bg-green-500/10 border-green-500/30' :
                  isFailed ? 'bg-red-500/10 border-red-500/30' :
                  isInProgress ? 'bg-blue-500/10 border-blue-500/30' :
                  'bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-subtle)]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${
                      isSuccess ? 'bg-green-500/20' :
                      isFailed ? 'bg-red-500/20' :
                      isInProgress ? 'bg-blue-500/20' :
                      'bg-gray-500/20'
                    }`}>
                      {isSuccess && <CheckCircle className="w-5 h-5 text-green-400" />}
                      {isFailed && <AlertCircle className="w-5 h-5 text-red-400" />}
                      {isInProgress && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
                      {!isCurrentStage && !isPastStage && (
                        <span className="w-5 h-5 flex items-center justify-center text-gray-400 font-bold">
                          {stage.id}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{stage.name}</h4>
                      <p className="text-sm text-[var(--nea-text-secondary)] mt-1">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                  {isSuccess && (
                    <Badge className="bg-green-500/20 text-green-300 border-0">
                      Complété
                    </Badge>
                  )}
                  {isFailed && (
                    <Badge className="bg-red-500/20 text-red-300 border-0">
                      Échoué
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

        <AnimatePresence>
          {!isDeploying && deploymentStage?.status === 'success' && progress === 100 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 rounded-lg bg-green-500/10 border border-green-500/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold text-white">Déploiement Réussi</h4>
              </div>
              <p className="text-sm text-[var(--nea-text-secondary)]">
                Le système de cascade est maintenant déployé en production et opérationnel.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}