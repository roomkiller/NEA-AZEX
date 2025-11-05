import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Cpu, Loader2, CheckCircle, Code } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CascadeAlgorithm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [algorithmCode, setAlgorithmCode] = useState("");
  const [description, setDescription] = useState("");

  const handleGenerateAlgorithm = async () => {
    if (!description.trim()) {
      toast.error("Veuillez décrire l'algorithme souhaité");
      return;
    }

    setIsGenerating(true);
    setAlgorithmCode("");

    try {
      const prompt = `
Génère un algorithme de prédiction en cascade optimisé pour:
${description}

L'algorithme doit:
1. Être écrit en pseudo-code clair
2. Inclure la gestion des dépendances entre événements
3. Calculer les probabilités en cascade
4. Identifier les points de rupture
5. Être optimisé pour la performance

Fournis le pseudo-code et des explications détaillées.
      `;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            pseudocode: { type: "string" },
            explanation: { type: "string" },
            complexity: { type: "string" },
            key_features: { type: "array", items: { type: "string" } }
          }
        }
      });

      setAlgorithmCode(response);
      toast.success("Algorithme généré avec succès");
    } catch (error) {
      console.error("Erreur génération:", error);
      toast.error("Échec de la génération de l'algorithme");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Cpu className="w-5 h-5 text-purple-400" />
            Générateur d'Algorithme de Cascade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="description">Description de l'Algorithme</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le type d'algorithme de cascade que vous souhaitez générer..."
              className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1 h-32"
            />
          </div>

          <Button
            onClick={handleGenerateAlgorithm}
            disabled={isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Code className="w-4 h-4 mr-2" />
                Générer l'Algorithme
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {algorithmCode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Algorithme Généré
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {algorithmCode.pseudocode && (
                  <div>
                    <h5 className="text-sm font-semibold text-white mb-2">Pseudo-code</h5>
                    <pre className="bg-[var(--nea-bg-deep-space)] p-4 rounded-lg overflow-x-auto text-sm text-green-400 font-mono">
                      {algorithmCode.pseudocode}
                    </pre>
                  </div>
                )}

                {algorithmCode.explanation && (
                  <div>
                    <h5 className="text-sm font-semibold text-white mb-2">Explication</h5>
                    <p className="text-sm text-[var(--nea-text-secondary)]">
                      {algorithmCode.explanation}
                    </p>
                  </div>
                )}

                {algorithmCode.complexity && (
                  <div>
                    <h5 className="text-sm font-semibold text-white mb-2">Complexité</h5>
                    <p className="text-sm text-[var(--nea-text-secondary)]">
                      {algorithmCode.complexity}
                    </p>
                  </div>
                )}

                {algorithmCode.key_features && algorithmCode.key_features.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-white mb-2">Fonctionnalités Clés</h5>
                    <ul className="space-y-1">
                      {algorithmCode.key_features.map((feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="text-sm text-[var(--nea-text-secondary)] flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                          {feature}
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