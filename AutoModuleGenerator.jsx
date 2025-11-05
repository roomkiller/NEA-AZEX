import React, { useState } from "react";
import { Module } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { Wand2, Loader2, Sparkles, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ['GÉOPOLITIQUE', 'NUCLÉAIRE', 'CLIMAT', 'BIOLOGIE', 'CYBERNÉTIQUE', 'SUPERVISION'];

export default function AutoModuleGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedModule, setGeneratedModule] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'GÉOPOLITIQUE',
    brief_description: ''
  });

  const handleGenerate = async () => {
    if (!formData.name || !formData.brief_description) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    setIsGenerating(true);
    setGeneratedModule(null);

    try {
      const prompt = `
Génère un module complet pour le système NEA-AZEX avec les informations suivantes:

Nom: ${formData.name}
Catégorie: ${formData.category}
Description brève: ${formData.brief_description}

Fournis:
1. Une description détaillée et technique
2. Des fonctionnalités clés (liste)
3. Des cas d'usage concrets (liste)
4. Une version suggérée (format: X.Y.Z)
5. Des recommandations d'intégration (liste)
      `;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            description: { type: "string" },
            key_features: { type: "array", items: { type: "string" } },
            use_cases: { type: "array", items: { type: "string" } },
            suggested_version: { type: "string" },
            integration_recommendations: { type: "array", items: { type: "string" } }
          }
        }
      });

      const newModule = await Module.create({
        name: formData.name,
        category: formData.category,
        description: response.description,
        version: response.suggested_version || "1.0.0",
        status: "Testing"
      });

      setGeneratedModule({ ...newModule, ...response });
      toast.success("Module généré avec succès");

      setFormData({ name: '', category: 'GÉOPOLITIQUE', brief_description: '' });
    } catch (error) {
      console.error("Erreur génération:", error);
      toast.error("Échec de la génération du module");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Wand2 className="w-5 h-5 text-purple-400" />
            Générateur Automatique de Modules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nom du Module *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Détecteur d'Anomalies Sismiques"
              className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat} className="text-white">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="brief_description">Description Brève *</Label>
            <Textarea
              id="brief_description"
              value={formData.brief_description}
              onChange={(e) => setFormData({ ...formData, brief_description: e.target.value })}
              placeholder="Décrivez brièvement ce que le module doit faire..."
              className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white mt-1 h-24"
            />
          </div>

          <Button
            onClick={handleGenerate}
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
                <Sparkles className="w-4 h-4 mr-2" />
                Générer le Module
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {generatedModule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Module Généré
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-1">{generatedModule.name}</h4>
                  <p className="text-sm text-[var(--nea-text-secondary)]">{generatedModule.description}</p>
                </div>

                {generatedModule.key_features && generatedModule.key_features.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-white mb-2">Fonctionnalités Clés</h5>
                    <ul className="space-y-1">
                      {generatedModule.key_features.map((feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="text-sm text-[var(--nea-text-secondary)] flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {generatedModule.use_cases && generatedModule.use_cases.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-white mb-2">Cas d'Usage</h5>
                    <ul className="space-y-1">
                      {generatedModule.use_cases.map((useCase, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="text-sm text-[var(--nea-text-secondary)] flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                          {useCase}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {generatedModule.integration_recommendations && generatedModule.integration_recommendations.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-white mb-2">Recommandations d'Intégration</h5>
                    <ul className="space-y-1">
                      {generatedModule.integration_recommendations.map((rec, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="text-sm text-[var(--nea-text-secondary)] flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                          {rec}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-3 border-t border-[var(--nea-border-default)] flex justify-between items-center">
                  <span className="text-sm text-[var(--nea-text-secondary)]">
                    Version: <span className="text-white font-semibold">{generatedModule.suggested_version}</span>
                  </span>
                  <span className="text-sm text-[var(--nea-text-secondary)]">
                    Statut: <span className="text-yellow-400 font-semibold">Testing</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}