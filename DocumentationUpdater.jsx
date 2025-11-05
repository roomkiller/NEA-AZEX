import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";
import { FileText, Loader2, CheckCircle, Download } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function DocumentationUpdater({ analysis }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [documentation, setDocumentation] = useState("");
  const [customNotes, setCustomNotes] = useState("");

  const generateDocumentation = async () => {
    if (!analysis) {
      toast.error("Veuillez d'abord effectuer une analyse");
      return;
    }

    setIsGenerating(true);
    setDocumentation("");

    try {
      const prompt = `
Génère une documentation technique complète pour les sources de données NEA-AZEX.

Résultats de l'analyse:
- Total modules: ${analysis.totalModules}
- Total sources: ${analysis.totalSources}
- Sources actives: ${analysis.activeSources}
- Sources inactives: ${analysis.inactiveSources}
- Sources en erreur: ${analysis.errorSources}
- Couverture: ${analysis.coverage}%

${customNotes ? `Notes supplémentaires: ${customNotes}` : ''}

Fournis:
1. Vue d'ensemble du système
2. Architecture des sources de données
3. Protocoles de connexion
4. Procédures de maintenance
5. Troubleshooting commun
6. Bonnes pratiques
      `;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            overview: { type: "string" },
            architecture: { type: "string" },
            connection_protocols: { type: "array", items: { type: "string" } },
            maintenance_procedures: { type: "array", items: { type: "string" } },
            troubleshooting: { type: "array", items: { type: "object", properties: {
              issue: { type: "string" },
              solution: { type: "string" }
            }}},
            best_practices: { type: "array", items: { type: "string" } }
          }
        }
      });

      setDocumentation(response);
      toast.success("Documentation générée avec succès");
    } catch (error) {
      console.error("Erreur génération documentation:", error);
      toast.error("Échec de la génération");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="w-5 h-5 text-blue-400" />
            Générateur de Documentation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notes">Notes Supplémentaires (optionnel)</Label>
            <Textarea
              id="notes"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Ajoutez des notes ou contexte supplémentaire..."
              className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1 h-24"
            />
          </div>

          <Button
            onClick={generateDocumentation}
            disabled={isGenerating || !analysis}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Générer Documentation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {documentation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {documentation.overview && (
              <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Vue d'Ensemble
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--nea-text-secondary)]">
                    {documentation.overview}
                  </p>
                </CardContent>
              </Card>
            )}

            {documentation.architecture && (
              <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                <CardHeader>
                  <CardTitle className="text-white">Architecture</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--nea-text-secondary)]">
                    {documentation.architecture}
                  </p>
                </CardContent>
              </Card>
            )}

            {documentation.connection_protocols && documentation.connection_protocols.length > 0 && (
              <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                <CardHeader>
                  <CardTitle className="text-white">Protocoles de Connexion</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {documentation.connection_protocols.map((protocol, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="text-sm text-[var(--nea-text-secondary)] flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                        {protocol}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {documentation.maintenance_procedures && documentation.maintenance_procedures.length > 0 && (
              <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                <CardHeader>
                  <CardTitle className="text-white">Procédures de Maintenance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {documentation.maintenance_procedures.map((procedure, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="text-sm text-[var(--nea-text-secondary)] flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                        {procedure}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {documentation.troubleshooting && documentation.troubleshooting.length > 0 && (
              <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                <CardHeader>
                  <CardTitle className="text-white">Troubleshooting</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documentation.troubleshooting.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
                      >
                        <p className="text-sm font-semibold text-white mb-1">
                          Problème: {item.issue}
                        </p>
                        <p className="text-sm text-[var(--nea-text-secondary)]">
                          Solution: {item.solution}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {documentation.best_practices && documentation.best_practices.length > 0 && (
              <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                <CardHeader>
                  <CardTitle className="text-white">Bonnes Pratiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {documentation.best_practices.map((practice, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="text-sm text-[var(--nea-text-secondary)] flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                        {practice}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Exporter la Documentation
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}