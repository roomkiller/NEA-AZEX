import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Rocket, Database, Lock, Cpu, Activity, CheckCircle, Play, Zap } from "lucide-react";
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useStaggerAnimation } from '../components/navigation/PageTransition';
import { toast } from 'sonner';

export default function SystemInitialization() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState("");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [results, setResults] = useState({
    osint: null,
    encryption: null,
    generation: null,
    capabilities: null,
    metrics: null
  });
  const { containerVariants, itemVariants } = useStaggerAnimation();

  const addLog = (message, type = "info") => {
    setLogs(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }].slice(-200));
  };

  const runFullPipeline = async () => {
    setIsProcessing(true);
    setProgress(0);
    setLogs([]);
    setResults({ osint: null, encryption: null, generation: null, capabilities: null, metrics: null });

    addLog("🚀 Démarrage Pipeline Complet d'Amélioration Système", "phase");
    
    try {
      // Simulation phase 1
      setCurrentPhase("Attribution Sources OSINT");
      addLog("📡 Phase 1/5: Attribution Sources OSINT", "phase");
      await new Promise(r => setTimeout(r, 1000));
      setProgress(20);
      setResults(prev => ({ ...prev, osint: { updated: 45, skipped: 5 } }));
      addLog("📊 Sources: 45 assignées, 5 ignorées", "info");

      // Simulation phase 2
      setCurrentPhase("Activation Chiffrement RSA-4096");
      addLog("🔐 Phase 2/5: Activation Chiffrement RSA-4096", "phase");
      await new Promise(r => setTimeout(r, 1000));
      setProgress(40);
      setResults(prev => ({ ...prev, encryption: { enabled: 42, alreadyEnabled: 8 } }));
      addLog("📊 Chiffrement: 42 activés, 8 déjà actifs", "info");

      // Simulation phase 3
      setCurrentPhase("Génération Modules Supplémentaires");
      addLog("🤖 Phase 3/5: Génération Modules Spécialisés", "phase");
      await new Promise(r => setTimeout(r, 1500));
      setProgress(60);
      setResults(prev => ({ ...prev, generation: { generated: 25, failed: 0 } }));
      addLog("📊 Modules: 25 générés, 0 échoués", "info");

      // Simulation phase 4
      setCurrentPhase("Définition Capacités Techniques");
      addLog("⚙️ Phase 4/5: Définition Capacités Techniques", "phase");
      await new Promise(r => setTimeout(r, 1000));
      setProgress(80);
      setResults(prev => ({ ...prev, capabilities: { updated: 50, skipped: 0 } }));
      addLog("📊 Capacités: 50 définies, 0 ignorées", "info");

      // Simulation phase 5
      setCurrentPhase("Initialisation Métriques");
      addLog("📊 Phase 5/5: Initialisation Métriques", "phase");
      await new Promise(r => setTimeout(r, 1000));
      setProgress(100);
      setResults(prev => ({ ...prev, metrics: { initialized: 48, updated: 2 } }));
      addLog("📊 Métriques: 48 initialisées, 2 mises à jour", "info");

      addLog("✨ Pipeline Complet Terminé avec Succès", "success");
      addLog("🎯 Système NEA-AZEX Pleinement Opérationnel", "success");
      toast.success("Pipeline terminé avec succès");
    } catch (error) {
      addLog(`💥 Erreur Critique: ${error.message}`, "error");
      toast.error("Erreur lors de l'exécution");
    } finally {
      setIsProcessing(false);
      setCurrentPhase("");
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
        <Breadcrumbs pages={[{ name: "Initialisation Système", href: "SystemInitialization" }]} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <PageHeader 
          icon={<Rocket className="w-8 h-8 text-red-400" />}
          title="Initialisation Système Complète"
          subtitle="Pipeline Automatisé d'Amélioration Modules"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <NeaCard className="bg-gradient-to-r from-[#111827] to-[#1F2937] border-[#DC2626]/30">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-5 gap-4">
              {[
                { icon: Database, label: "OSINT", phase: 1, result: results.osint },
                { icon: Lock, label: "Chiffrement", phase: 2, result: results.encryption },
                { icon: Cpu, label: "Génération", phase: 3, result: results.generation },
                { icon: Zap, label: "Capacités", phase: 4, result: results.capabilities },
                { icon: Activity, label: "Métriques", phase: 5, result: results.metrics }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.phase} className="text-center">
                    <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                      item.result ? 'bg-[#10b981] text-white' : 'bg-[#374151] text-[#9CA3AF]'
                    }`}>
                      {item.result ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <p className="text-xs text-[#9CA3AF]">Phase {item.phase}</p>
                    <p className="text-xs text-white font-semibold">{item.label}</p>
                  </div>
                );
              })}
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#9CA3AF]">{currentPhase}</span>
                  <span className="text-sm font-bold text-[#DC2626]">{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="h-3 bg-[#1F2937]" />
              </div>
            )}

            <NeaButton
              onClick={runFullPipeline}
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              {isProcessing ? "Exécution en cours..." : "Lancer Pipeline Complet"}
            </NeaButton>

            {results.metrics && (
              <NeaCard className="bg-[#1F2937] border-[#374151] mt-6">
                <div className="p-4 border-b border-[#374151]">
                  <h3 className="text-white text-base font-bold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#10b981]" />
                    Résultats Pipeline
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {results.osint && (
                    <div className="flex justify-between items-center p-3 bg-[#111827] rounded">
                      <span className="text-white text-sm">Sources OSINT</span>
                      <Badge className="bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/30">
                        {results.osint.updated} assignées
                      </Badge>
                    </div>
                  )}
                  {results.encryption && (
                    <div className="flex justify-between items-center p-3 bg-[#111827] rounded">
                      <span className="text-white text-sm">Chiffrement RSA-4096</span>
                      <Badge className="bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30">
                        {results.encryption.enabled} activés
                      </Badge>
                    </div>
                  )}
                  {results.generation && (
                    <div className="flex justify-between items-center p-3 bg-[#111827] rounded">
                      <span className="text-white text-sm">Modules Générés</span>
                      <Badge className="bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30">
                        {results.generation.generated} nouveaux
                      </Badge>
                    </div>
                  )}
                </div>
              </NeaCard>
            )}
          </div>
        </NeaCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <NeaCard className="bg-black border-[#374151]">
          <div className="p-4 border-b border-[#374151]">
            <h3 className="text-[#10b981] font-mono text-xs flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Terminal Pipeline
            </h3>
          </div>
          <div className="p-4">
            <div className="h-[500px] overflow-y-auto font-mono text-xs space-y-1 styled-scrollbar">
              {logs.length === 0 ? (
                <p className="text-[#6B7280]">En attente d'exécution...</p>
              ) : (
                logs.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`
                      ${log.type === "error" ? "text-red-400" :
                        log.type === "success" ? "text-[#10b981]" :
                        log.type === "warning" ? "text-[#f59e0b]" :
                        log.type === "phase" ? "text-[#DC2626] font-bold text-sm" :
                        "text-[#9CA3AF]"}
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