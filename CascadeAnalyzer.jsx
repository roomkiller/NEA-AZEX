import React, { useState } from "react";
import { EventPrediction } from "@/api/entities";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Loader2, AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CascadeAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cascadeResults, setCascadeResults] = useState(null);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  const handleAnalyzeCascade = async () => {
    if (!selectedPrediction) {
      toast.error("Veuillez d'abord sélectionner une prédiction");
      return;
    }

    setIsAnalyzing(true);
    setCascadeResults(null);

    try {
      const prompt = `
Analyse en cascade pour l'événement: ${selectedPrediction.event_name}
Type: ${selectedPrediction.event_type}
Probabilité: ${selectedPrediction.probability_score}%

Fournis une analyse en cascade avec:
1. Conséquences de premier ordre (immédiates)
2. Conséquences de second ordre (à moyen terme)
3. Conséquences de troisième ordre (à long terme)
4. Points de rupture critiques
5. Stratégies d'atténuation possibles
      `;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            first_order: { type: "array", items: { type: "string" } },
            second_order: { type: "array", items: { type: "string" } },
            third_order: { type: "array", items: { type: "string" } },
            critical_points: { type: "array", items: { type: "string" } },
            mitigation_strategies: { type: "array", items: { type: "string" } },
            cascade_severity: { type: "number" }
          }
        }
      });

      setCascadeResults(response);
      toast.success("Analyse en cascade complétée");
    } catch (error) {
      console.error("Erreur analyse:", error);
      toast.error("Échec de l'analyse en cascade");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadPredictions = async () => {
    try {
      const predictions = await EventPrediction.list({ limit: 1 });
      if (predictions.length > 0) {
        setSelectedPrediction(predictions[0]);
      }
    } catch (error) {
      console.error("Erreur chargement prédictions:", error);
    }
  };

  React.useEffect(() => {
    loadPredictions();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            Analyseur de Cascade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedPrediction && (
            <div className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]">
              <h4 className="font-semibold text-white mb-2">{selectedPrediction.event_name}</h4>
              <p className="text-sm text-[var(--nea-text-secondary)]">{selectedPrediction.prediction_summary}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-blue-500/20 text-blue-300 border-0">
                  {selectedPrediction.event_type}
                </Badge>
                <Badge className="bg-green-500/20 text-green-300 border-0">
                  {selectedPrediction.probability_score}% probabilité
                </Badge>
              </div>
            </div>
          )}

          <Button
            onClick={handleAnalyzeCascade}
            disabled={isAnalyzing || !selectedPrediction}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <GitBranch className="w-4 h-4 mr-2" />
                Analyser la Cascade
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {cascadeResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Résultats de l'Analyse en Cascade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cascadeResults.cascade_severity !== undefined && (
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <p className="text-sm text-purple-300 mb-1">Sévérité de la Cascade</p>
                    <p className="text-3xl font-bold text-white">{(cascadeResults.cascade_severity * 100).toFixed(0)}/100</p>
                  </div>
                )}

                {cascadeResults.first_order && cascadeResults.first_order.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-red-400" />
                      Conséquences de Premier Ordre
                    </h5>
                    <ul className="space-y-2">
                      {cascadeResults.first_order.map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="text-sm text-[var(--nea-text-secondary)] flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {cascadeResults.second_order && cascadeResults.second_order.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-yellow-400" />
                      Conséquences de Second Ordre
                    </h5>
                    <ul className="space-y-2">
                      {cascadeResults.second_order.map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="text-sm text-[var(--nea-text-secondary)] flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 flex-shrink-0" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {cascadeResults.third_order && cascadeResults.third_order.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      Conséquences de Troisième Ordre
                    </h5>
                    <ul className="space-y-2">
                      {cascadeResults.third_order.map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="text-sm text-[var(--nea-text-secondary)] flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {cascadeResults.critical_points && cascadeResults.critical_points.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                      Points de Rupture Critiques
                    </h5>
                    <ul className="space-y-2">
                      {cascadeResults.critical_points.map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="text-sm text-[var(--nea-text-secondary)] flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {cascadeResults.mitigation_strategies && cascadeResults.mitigation_strategies.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Stratégies d'Atténuation
                    </h5>
                    <ul className="space-y-2">
                      {cascadeResults.mitigation_strategies.map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="text-sm text-[var(--nea-text-secondary)] flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}