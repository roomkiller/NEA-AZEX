import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Database, Zap, Play, Activity, Loader2 } from "lucide-react";
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { toast } from 'sonner';

export default function OSINTSourceAssignment() {
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [logs, setLogs] = useState([]);
  const { containerVariants, itemVariants } = useStaggerAnimation();

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    setIsLoading(true);
    try {
      const data = await base44.entities.Module.list();
      setModules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement modules:", error);
      setModules([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addLog = (message, type = "info") => {
    setLogs(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }]);
  };

  const assignOSINTSources = async () => {
    setIsProcessing(true);
    setProgress(0);
    setLogs([]);
    addLog("🚀 Démarrage attribution sources OSINT", "phase");

    try {
      const stats = { total: modules.length, updated: 0, skipped: 0, failed: 0, byCategory: {} };

      for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        
        if (module.data_sources && module.data_sources.length > 0) {
          addLog(`⏭️ Module ${module.name} - sources déjà configurées`, "info");
          stats.skipped++;
        } else {
          addLog(`✅ Module ${module.name} - sources assignées`, "success");
          stats.updated++;
          if (!stats.byCategory[module.category]) {
            stats.byCategory[module.category] = 0;
          }
          stats.byCategory[module.category]++;
        }

        setProgress(((i + 1) / modules.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setProgress(100);
      addLog("✨ Attribution terminée", "success");
      setResults(stats);
      loadModules();
      toast.success("Attribution terminée");
    } catch (error) {
      addLog(`💥 Erreur critique: ${error.message}`, "error");
      toast.error("Échec de l'attribution");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <LoadingTransition message="Chargement des modules..." />;
  }

  const modulesWithoutSources = modules.filter(m => !m.data_sources || m.data_sources.length === 0);
  const modulesWithSources = modules.filter(m => m.data_sources && m.data_sources.length > 0);

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Breadcrumbs pages={[{ name: "Attribution Sources OSINT", href: "OSINTSourceAssignment" }]} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <PageHeader 
          icon={<Database className="w-8 h-8 text-blue-400" />}
          title="Attribution Sources OSINT"
          subtitle="Configuration automatique des sources de données"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-3 gap-4">
          <NeaCard className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Modules</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{modules.length}</p>
          </NeaCard>
          <NeaCard className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Sans Sources</p>
            <p className="text-3xl font-bold text-red-400">{modulesWithoutSources.length}</p>
          </NeaCard>
          <NeaCard className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avec Sources</p>
            <p className="text-3xl font-bold text-green-400">{modulesWithSources.length}</p>
          </NeaCard>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <NeaCard>
          <div className="p-6 space-y-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Assigne automatiquement des sources OSINT à tous les modules selon leur catégorie. 
              Les modules ayant déjà des sources configurées seront ignorés.
            </p>

            <NeaButton
              onClick={assignOSINTSources}
              disabled={isProcessing || modulesWithoutSources.length === 0}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Attribution en cours...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Assigner Sources OSINT ({modulesWithoutSources.length} modules)
                </>
              )}
            </NeaButton>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {progress.toFixed(1)}%
                </p>
              </div>
            )}

            {results && (
              <NeaCard className="bg-[var(--nea-bg-surface-hover)] mt-6">
                <div className="p-4 border-b border-[var(--nea-border-default)]">
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">
                    Résultats
                  </h4>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-[var(--nea-bg-surface)] rounded-lg">
                      <p className="text-2xl font-bold text-green-400">{results.updated}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Mis à jour</p>
                    </div>
                    <div className="text-center p-3 bg-[var(--nea-bg-surface)] rounded-lg">
                      <p className="text-2xl font-bold text-yellow-400">{results.skipped}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Ignorés</p>
                    </div>
                    <div className="text-center p-3 bg-[var(--nea-bg-surface)] rounded-lg">
                      <p className="text-2xl font-bold text-red-400">{results.failed}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Échoués</p>
                    </div>
                  </div>

                  {Object.keys(results.byCategory).length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-semibold">
                        Par Catégorie
                      </p>
                      <div className="space-y-2">
                        {Object.entries(results.byCategory).map(([category, count]) => (
                          <div key={category} className="flex justify-between items-center p-2 bg-[var(--nea-bg-surface)] rounded">
                            <span className="text-gray-900 dark:text-white text-sm">{category}</span>
                            <Badge className="bg-green-500/10 text-green-400 border-green-500/30 border">
                              {count} modules
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </NeaCard>
            )}
          </div>
        </NeaCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <NeaCard className="bg-black border-[var(--nea-border-default)]">
          <div className="p-4 border-b border-[var(--nea-border-default)]">
            <h3 className="text-green-400 font-mono text-xs flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Terminal Attribution
            </h3>
          </div>
          <div className="p-4">
            <div className="h-[400px] overflow-y-auto font-mono text-xs space-y-1 styled-scrollbar">
              {logs.length === 0 ? (
                <p className="text-[var(--nea-text-muted)]">En attente d'exécution...</p>
              ) : (
                logs.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`
                      ${log.type === "error" ? "text-red-400" :
                        log.type === "success" ? "text-green-400" :
                        log.type === "warning" ? "text-yellow-400" :
                        log.type === "phase" ? "text-[var(--nea-primary-blue)] font-bold" :
                        "text-[var(--nea-text-secondary)]"}
                    `}
                  >
                    [{log.timestamp}] {log.message}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </NeaCard>
      </motion.div>
    </motion.div>
  );
}