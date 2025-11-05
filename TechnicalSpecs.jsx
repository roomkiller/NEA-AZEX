import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { Cpu, Loader2, CheckCircle, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function TechnicalSpecs({ failureAnalysis }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [specifications, setSpecifications] = useState(null);

  const handleGenerateSpecs = async () => {
    if (!failureAnalysis || failureAnalysis.failures.length === 0) {
      toast.error("Veuillez d'abord effectuer une analyse des défaillances");
      return;
    }

    setIsGenerating(true);
    setSpecifications(null);

    try {
      const prompt = `
Génère des spécifications techniques détaillées pour autonomiser les modules NEA-AZEX.

Défaillances identifiées:
${failureAnalysis.failures.map((f, i) => `${i + 1}. ${f.type}: ${f.description} (${f.count} modules affectés)`).join('\n')}

Modules non autonomes: ${failureAnalysis.nonAutonomous} sur ${failureAnalysis.totalModules}
Défaillances critiques: ${failureAnalysis.criticalFailures}

Fournis:
1. Architecture système recommandée
2. Composants techniques requis
3. Protocoles d'auto-réparation
4. Mécanismes de monitoring
5. Stratégies de déploiement
6. Métriques de succès
      `;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            architecture: { type: "object", properties: {
              description: { type: "string" },
              components: { type: "array", items: { type: "string" } }
            }},
            technical_components: { type: "array", items: { type: "object", properties: {
              name: { type: "string" },
              purpose: { type: "string" },
              implementation: { type: "string" }
            }}},
            self_repair_protocols: { type: "array", items: { type: "string" } },
            monitoring_mechanisms: { type: "array", items: { type: "string" } },
            deployment_strategy: { type: "string" },
            success_metrics: { type: "array", items: { type: "string" } }
          }
        }
      });

      setSpecifications(response);
      toast.success("Spécifications générées avec succès");
    } catch (error) {
      console.error("Erreur génération spécifications:", error);
      toast.error("Échec de la génération des spécifications");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Phase 2: Spécifications Techniques
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[var(--nea-text-secondary)]">
            Génération automatique des spécifications pour l'autonomisation des modules
          </p>

          <Button
            onClick={handleGenerateSpecs}
            disabled={isGenerating || !failureAnalysis}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Générer Spécifications
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {specifications && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {specifications.architecture && (
              <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Architecture Système
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-[var(--nea-text-secondary)]">
                    {specifications.architecture.description}
                  </p>
                  {specifications.architecture.components && (
                    <div>
                      <h5 className="text-sm font-semibold text-white mb-2">Composants Architecturaux</h5>
                      <ul className="space-y-1">
                        {specifications.architecture.components.map((comp, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="text-sm text-[var(--nea-text-secondary)] flex items-start gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                            {comp}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {specifications.technical_components && specifications.technical_components.length > 0 && (
              <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                <CardHeader>
                  <CardTitle className="text-white">Composants Techniques Requis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {specifications.technical_components.map((comp, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
                      >
                        <h5 className="font-semibold text-white mb-1">{comp.name}</h5>
                        <p className="text-sm text-[var(--nea-text-secondary)] mb-2">{comp.purpose}</p>
                        <Badge className="bg-blue-500/20 text-blue-300 border-0">
                          {comp.implementation}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {specifications.self_repair_protocols && specifications.self_repair_protocols.length > 0 && (
              <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                <CardHeader>
                  <CardTitle className="text-white">Protocoles d'Auto-Réparation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {specifications.self_repair_protocols.map((protocol, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="text-sm text-[var(--nea-text-secondary)] flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                        {protocol}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {specifications.monitoring_mechanisms && specifications.monitoring_mechanisms.length > 0 && (
              <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                <CardHeader>
                  <CardTitle className="text-white">Mécanismes de Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {specifications.monitoring_mechanisms.map((mechanism, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="text-sm text-[var(--nea-text-secondary)] flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 flex-shrink-0" />
                        {mechanism}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {specifications.deployment_strategy && (
              <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                <CardHeader>
                  <CardTitle className="text-white">Stratégie de Déploiement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--nea-text-secondary)]">
                    {specifications.deployment_strategy}
                  </p>
                </CardContent>
              </Card>
            )}

            {specifications.success_metrics && specifications.success_metrics.length > 0 && (
              <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                <CardHeader>
                  <CardTitle className="text-white">Métriques de Succès</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {specifications.success_metrics.map((metric, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="text-sm text-[var(--nea-text-secondary)] flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                        {metric}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Exporter les Spécifications
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}