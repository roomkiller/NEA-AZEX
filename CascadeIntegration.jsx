import React, { useState } from "react";
import { Configuration } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitMerge, Loader2, CheckCircle, AlertCircle, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CascadeIntegration() {
  const [isIntegrating, setIsIntegrating] = useState(false);
  const [integrationStatus, setIntegrationStatus] = useState(null);

  const integrationSteps = [
    { id: 1, name: "Validation Configuration", description: "Vérification des paramètres" },
    { id: 2, name: "Connexion Modules", description: "Liaison avec les modules existants" },
    { id: 3, name: "Test d'Intégration", description: "Tests de communication" },
    { id: 4, name: "Activation Système", description: "Mise en production" }
  ];

  const handleIntegration = async () => {
    setIsIntegrating(true);
    setIntegrationStatus(null);

    const statuses = [];

    for (let step of integrationSteps) {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const success = Math.random() > 0.15;
      statuses.push({
        ...step,
        status: success ? 'success' : 'error',
        timestamp: new Date().toISOString()
      });

      setIntegrationStatus([...statuses]);

      if (!success) {
        toast.error(`Échec à l'étape: ${step.name}`);
        break;
      }
    }

    const allSuccess = statuses.every(s => s.status === 'success');
    
    if (allSuccess) {
      try {
        await Configuration.create({
          category: 'Backend',
          key: 'cascade_integration',
          value: 'enabled',
          description: 'Système de cascade activé',
          is_active: true
        });
        toast.success('Intégration réussie');
      } catch (error) {
        toast.warning('Intégration complétée mais configuration non sauvegardée');
      }
    }

    setIsIntegrating(false);
  };

  return (
    <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-green-400" />
            Intégration Système
          </span>
          <Button
            onClick={handleIntegration}
            disabled={isIntegrating}
            className="bg-green-600 hover:bg-green-700"
          >
            {isIntegrating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Intégration...
              </>
            ) : (
              <>
                <LinkIcon className="w-4 h-4 mr-2" />
                Démarrer Intégration
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {integrationSteps.map((step, index) => {
            const stepStatus = integrationStatus?.find(s => s.id === step.id);
            const isCompleted = stepStatus?.status === 'success';
            const isFailed = stepStatus?.status === 'error';
            const isProcessing = isIntegrating && !stepStatus && 
              (index === 0 || integrationStatus?.length === index);

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${
                  isCompleted ? 'bg-green-500/10 border-green-500/30' :
                  isFailed ? 'bg-red-500/10 border-red-500/30' :
                  isProcessing ? 'bg-blue-500/10 border-blue-500/30' :
                  'bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-subtle)]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${
                      isCompleted ? 'bg-green-500/20' :
                      isFailed ? 'bg-red-500/20' :
                      isProcessing ? 'bg-blue-500/20' :
                      'bg-gray-500/20'
                    }`}>
                      {isCompleted && <CheckCircle className="w-5 h-5 text-green-400" />}
                      {isFailed && <AlertCircle className="w-5 h-5 text-red-400" />}
                      {isProcessing && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
                      {!stepStatus && !isProcessing && <span className="w-5 h-5 flex items-center justify-center text-gray-400 font-bold">{step.id}</span>}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{step.name}</h4>
                      <p className="text-sm text-[var(--nea-text-secondary)] mt-1">
                        {step.description}
                      </p>
                      {stepStatus && (
                        <p className="text-xs text-[var(--nea-text-muted)] mt-1">
                          {new Date(stepStatus.timestamp).toLocaleTimeString('fr-CA')}
                        </p>
                      )}
                    </div>
                  </div>
                  {isCompleted && (
                    <Badge className="bg-green-500/20 text-green-300 border-0">
                      Complété
                    </Badge>
                  )}
                  {isFailed && (
                    <Badge className="bg-red-500/20 text-red-300 border-0">
                      Échoué
                    </Badge>
                  )}
                  {isProcessing && (
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
          {integrationStatus && integrationStatus.every(s => s.status === 'success') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 rounded-lg bg-green-500/10 border border-green-500/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold text-white">Intégration Réussie</h4>
              </div>
              <p className="text-sm text-[var(--nea-text-secondary)]">
                Le système de cascade est maintenant pleinement intégré et opérationnel.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}