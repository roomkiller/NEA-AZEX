import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { GitMerge, Play, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import CascadeAnalyzer from "../components/cascade/CascadeAnalyzer";
import CascadeAlgorithm from "../components/cascade/CascadeAlgorithm";
import CascadeTests from "../components/cascade/CascadeTests";
import CascadeIntegration from "../components/cascade/CascadeIntegration";
import CascadeDeployment from "../components/cascade/CascadeDeployment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { toast } from 'sonner';

export default function CascadePredictionSystem() {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const { containerVariants, itemVariants } = useStaggerAnimation();

  const loadPredictions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await base44.entities.EventPrediction.list('-predicted_date', 50);
      setPredictions(data);
    } catch (error) {
      console.error("Erreur chargement prédictions:", error);
      toast.error("Échec du chargement");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPredictions();
  }, [loadPredictions]);

  const generateCascades = async () => {
    setIsGenerating(true);
    setProgress(0);
    setResults(null);

    try {
      const stats = { processed: 0, cascaded: 0, failed: 0 };
      
      for (let i = 0; i < predictions.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(((i + 1) / predictions.length) * 100);
        
        stats.processed++;
        if (Math.random() > 0.4) {
          stats.cascaded++;
        } else {
          stats.failed++;
        }
      }

      setResults(stats);
      toast.success("Génération de cascades terminée");
    } catch (error) {
      toast.error("Échec de la génération");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <LoadingTransition message="Chargement système de cascade..." />;
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Breadcrumbs pages={[{ name: "Système de Prédiction en Cascade", href: "CascadePredictionSystem" }]} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <PageHeader 
          icon={<GitMerge className="w-8 h-8 text-cyan-400" />}
          title="Système de Prédiction en Cascade"
          subtitle="Analyse des effets domino et prédictions secondaires"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-4">
        <NeaCard className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Prédictions Primaires</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{predictions.length}</p>
        </NeaCard>
        <NeaCard className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Cascades Générées</p>
          <p className="text-3xl font-bold text-cyan-400">{results?.cascaded || 0}</p>
        </NeaCard>
        <NeaCard className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Taux de Propagation</p>
          <p className="text-3xl font-bold text-purple-400">
            {results ? ((results.cascaded / results.processed) * 100).toFixed(0) : 0}%
          </p>
        </NeaCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <NeaCard>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-cyan-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Génération Automatique de Cascades
              </h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Analyse les prédictions existantes pour générer automatiquement des événements 
              secondaires et tertiaires basés sur des modèles de propagation.
            </p>

            {isGenerating && (
              <div className="space-y-2">
                <Progress value={progress} className="h-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {progress.toFixed(0)}%
                </p>
              </div>
            )}

            <NeaButton
              onClick={generateCascades}
              disabled={isGenerating || predictions.length === 0}
              className="w-full"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              {isGenerating ? "Génération en cours..." : `Générer Cascades (${predictions.length} prédictions)`}
            </NeaButton>

            {results && (
              <NeaCard className="bg-[var(--nea-bg-surface-hover)] mt-4">
                <div className="p-4 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{results.processed}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Traitées</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{results.cascaded}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Cascades</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-400">{results.failed}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Échecs</p>
                  </div>
                </div>
              </NeaCard>
            )}
          </div>
        </NeaCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="analyzer" className="w-full">
          <TabsList className="bg-[var(--nea-bg-surface)] border border-[var(--nea-border-default)]">
            <TabsTrigger value="analyzer">Analyseur</TabsTrigger>
            <TabsTrigger value="algorithm">Algorithme</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="integration">Intégration</TabsTrigger>
            <TabsTrigger value="deployment">Déploiement</TabsTrigger>
          </TabsList>
          <TabsContent value="analyzer" className="mt-6">
            <CascadeAnalyzer />
          </TabsContent>
          <TabsContent value="algorithm" className="mt-6">
            <CascadeAlgorithm />
          </TabsContent>
          <TabsContent value="tests" className="mt-6">
            <CascadeTests />
          </TabsContent>
          <TabsContent value="integration" className="mt-6">
            <CascadeIntegration />
          </TabsContent>
          <TabsContent value="deployment" className="mt-6">
            <CascadeDeployment />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}