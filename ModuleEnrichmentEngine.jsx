import React, { useState } from "react";
import { Module } from "@/api/entities";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2, CheckCircle, AlertTriangle, Cpu } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ModuleEnrichmentEngine({ module }) {
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentResult, setEnrichmentResult] = useState(null);

  const handleEnrichModule = async () => {
    setIsEnriching(true);
    setEnrichmentResult(null);

    try {
      const prompt = `
Enrichis le module ${module.name} (catégorie: ${module.category}).
Description actuelle: ${module.description}

Fournis:
1. Une description améliorée et détaillée
2. Des recommandations d'amélioration
3. Des modules complémentaires suggérés
4. Une évaluation de la pertinence (0-100)
      `;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            enhanced_description: { type: "string" },
            recommendations: { type: "array", items: { type: "string" } },
            complementary_modules: { type: "array", items: { type: "string" } },
            relevance_score: { type: "number" }
          }
        }
      });

      setEnrichmentResult(response);

      await Module.update(module.id, {
        description: response.enhanced_description
      });

      toast.success("Module enrichi avec succès");
    } catch (error) {
      console.error("Erreur enrichissement:", error);
      toast.error("Échec de l'enrichissement");
    } finally {
      setIsEnriching(false);
    }
  };

  return (
    <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Sparkles className="w-5 h-5 text-purple-400" />
          Moteur d'Enrichissement IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--nea-text-secondary)]">
            Améliore automatiquement la description et génère des recommandations
          </p>
          <Button
            onClick={handleEnrichModule}
            disabled={isEnriching}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isEnriching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enrichissement...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Enrichir
              </>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {enrichmentResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 mt-4"
            >
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <h4 className="font-semibold text-white">Enrichissement Complété</h4>
                </div>
                <p className="text-sm text-[var(--nea-text-secondary)]">
                  Score de pertinence: <span className="text-white font-semibold">{enrichmentResult.relevance_score}/100</span>
                </p>
              </div>

              {enrichmentResult.recommendations && enrichmentResult.recommendations.length > 0 && (
                <div>
                  <h5 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    Recommandations
                  </h5>
                  <ul className="space-y-2">
                    {enrichmentResult.recommendations.map((rec, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-sm text-[var(--nea-text-secondary)] flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 flex-shrink-0" />
                        {rec}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {enrichmentResult.complementary_modules && enrichmentResult.complementary_modules.length > 0 && (
                <div>
                  <h5 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    Modules Complémentaires
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {enrichmentResult.complementary_modules.map((mod, index) => (
                      <Badge key={index} className="bg-blue-500/20 text-blue-300 border-0">
                        {mod}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}