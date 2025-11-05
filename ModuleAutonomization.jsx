import React, { useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Cpu, Play, Activity, CheckCircle } from "lucide-react";
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Progress } from "@/components/ui/progress";
import FailureAnalysis from "../components/autonomization/FailureAnalysis";
import TechnicalSpecs from "../components/autonomization/TechnicalSpecs";
import PrototypeTests from "../components/autonomization/PrototypeTests";
import ProductionLine from "../components/autonomization/ProductionLine";
import PersonnelTraining from "../components/autonomization/PersonnelTraining";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStaggerAnimation } from '../components/navigation/PageTransition';
import { toast } from 'sonner';

export default function ModuleAutonomization() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const { containerVariants, itemVariants } = useStaggerAnimation();

  const runAutonomization = async () => {
    setIsProcessing(true);
    setProgress(0);
    setResults(null);

    try {
      const phases = [
        "Analyse des échecs",
        "Définition spécifications",
        "Tests prototypes",
        "Ligne de production",
        "Formation personnel"
      ];

      const stats = { phasesCompleted: 0, totalPhases: phases.length };

      for (let i = 0; i < phases.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgress(((i + 1) / phases.length) * 100);
        stats.phasesCompleted++;
      }

      setResults(stats);
      toast.success("Autonomisation complète");
    } catch (error) {
      toast.error("Échec de l'autonomisation");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Breadcrumbs pages={[{ name: "Autonomisation des Modules", href: "ModuleAutonomization" }]} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <PageHeader 
          icon={<Cpu className="w-8 h-8 text-blue-400" />}
          title="Autonomisation des Modules"
          subtitle="Processus d'automatisation et d'indépendance opérationnelle"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <NeaCard>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Processus d'Autonomisation Complet
              </h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Lance le cycle complet d'autonomisation : analyse, spécifications, tests, 
              production et formation.
            </p>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} className="h-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {progress.toFixed(0)}%
                </p>
              </div>
            )}

            <NeaButton
              onClick={runAutonomization}
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              {isProcessing ? "Processus en cours..." : "Lancer Autonomisation"}
            </NeaButton>

            {results && (
              <NeaCard className="bg-[var(--nea-bg-surface-hover)] mt-4">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      Autonomisation Complète
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {results.phasesCompleted}/{results.totalPhases} phases terminées avec succès
                  </p>
                </div>
              </NeaCard>
            )}
          </div>
        </NeaCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="bg-[var(--nea-bg-surface)] border border-[var(--nea-border-default)]">
            <TabsTrigger value="analysis">Analyse</TabsTrigger>
            <TabsTrigger value="specs">Spécifications</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="training">Formation</TabsTrigger>
          </TabsList>
          <TabsContent value="analysis" className="mt-6">
            <FailureAnalysis />
          </TabsContent>
          <TabsContent value="specs" className="mt-6">
            <TechnicalSpecs />
          </TabsContent>
          <TabsContent value="tests" className="mt-6">
            <PrototypeTests />
          </TabsContent>
          <TabsContent value="production" className="mt-6">
            <ProductionLine />
          </TabsContent>
          <TabsContent value="training" className="mt-6">
            <PersonnelTraining />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}