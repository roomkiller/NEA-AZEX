import React, { useState } from "react";
import { Module } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, AlertTriangle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function FailureAnalysis({ onComplete }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failures, setFailures] = useState([]);
  const [nonAutonomous, setNonAutonomous] = useState([]);
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = "info") => {
    setLogs(prev => [...prev, { 
      message, 
      type, 
      timestamp: new Date().toLocaleTimeString() 
    }].slice(-50));
  };

  const analyzeModules = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    setFailures([]);
    setNonAutonomous([]);
    addLog("Démarrage analyse modules non autonomes", "phase");

    try {
      setProgress(20);
      addLog("Chargement modules système...", "info");
      const modules = await Module.list();

      setProgress(40);
      addLog(`${modules.length} modules chargés`, "info");
      
      const nonAutoModules = modules.filter(m => 
        m.autonomous_trigger !== true || m.status === "Disabled"
      );
      
      setNonAutonomous(nonAutoModules);
      addLog(`${nonAutoModules.length} modules non autonomes identifiés`, "warning");

      setProgress(60);
      addLog("Analyse points de défaillance...", "info");

      const identifiedFailures = [];

      // 1. Modules désactivés
      const disabledModules = modules.filter(m => m.status === "Disabled");
      if (disabledModules.length > 0) {
        identifiedFailures.push({
          type: "DÉSACTIVATION",
          severity: "CRITICAL",
          count: disabledModules.length,
          percentage: ((disabledModules.length / modules.length) * 100).toFixed(1),
          description: "Modules désactivés nécessitant réactivation autonome",
          impact: "Couverture surveillance réduite",
          root_cause: "Absence mécanisme auto-réparation",
          solution: "Implémenter watchdog + auto-restart"
        });
      }

      // 2. Modules sans trigger autonome
      const noTriggerModules = modules.filter(m => !m.autonomous_trigger);
      if (noTriggerModules.length > 0) {
        identifiedFailures.push({
          type: "DÉCLENCHEMENT MANUEL",
          severity: "HIGH",
          count: noTriggerModules.length,
          percentage: ((noTriggerModules.length / modules.length) * 100).toFixed(1),
          description: "Modules nécessitant intervention manuelle",
          impact: "Délais détection événements critiques",
          root_cause: "Absence scheduler autonome",
          solution: "Implémenter cron jobs + event-driven triggers"
        });
      }

      // 3. Modules sans métriques
      const noMetricsModules = modules.filter(m => !m.metrics || !m.metrics.accuracy);
      if (noMetricsModules.length > 0) {
        identifiedFailures.push({
          type: "ABSENCE MONITORING",
          severity: "MEDIUM",
          count: noMetricsModules.length,
          percentage: ((noMetricsModules.length / modules.length) * 100).toFixed(1),
          description: "Modules sans métriques de performance",
          impact: "Impossible détecter dégradations",
          root_cause: "Absence télémétrie embarquée",
          solution: "Implémenter instrumentation + health checks"
        });
      }

      // 4. Modules sans sources de données
      const noSourcesModules = modules.filter(m => !m.data_sources || m.data_sources.length === 0);
      if (noSourcesModules.length > 0) {
        identifiedFailures.push({
          type: "SOURCES MANQUANTES",
          severity: "HIGH",
          count: noSourcesModules.length,
          percentage: ((noSourcesModules.length / modules.length) * 100).toFixed(1),
          description: "Modules sans sources OSINT configurées",
          impact: "Incapacité collecter données",
          root_cause: "Configuration incomplète",
          solution: "Auto-découverte sources + configuration dynamique"
        });
      }

      // 5. Modules avec latence élevée
      const highLatencyModules = modules.filter(m => 
        m.metrics?.latency_ms && m.metrics.latency_ms > 1000
      );
      if (highLatencyModules.length > 0) {
        identifiedFailures.push({
          type: "PERFORMANCE DÉGRADÉE",
          severity: "MEDIUM",
          count: highLatencyModules.length,
          percentage: ((highLatencyModules.length / modules.length) * 100).toFixed(1),
          description: "Modules avec latence > 1s",
          impact: "Temps réponse insuffisant",
          root_cause: "Pipelines non optimisés",
          solution: "Caching + optimisation queries + parallélisation"
        });
      }

      setProgress(90);
      addLog(`${identifiedFailures.length} types de défaillances identifiés`, "warning");

      setProgress(100);
      addLog("Analyse terminée", "success");
      setFailures(identifiedFailures);

      if (onComplete) {
        onComplete({
          totalModules: modules.length,
          nonAutonomous: nonAutoModules.length,
          failures: identifiedFailures,
          criticalFailures: identifiedFailures.filter(f => f.severity === "CRITICAL").length
        });
      }

    } catch (error) {
      addLog(`Erreur: ${error.message}`, "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "CRITICAL": return "bg-red-500/10 text-red-400 border-red-500/30";
      case "HIGH": return "bg-orange-500/10 text-orange-400 border-orange-500/30";
      case "MEDIUM": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      default: return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
  };

  return (
    <div className="space-y-6">
      
      <Card className="bg-[#111827] border-[#374151]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-[#DC2626]" />
            Phase 1: Analyse des Défaillances
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={analyzeModules}
            disabled={isAnalyzing}
            className="bg-[#DC2626] hover:bg-[#DC2626]/90"
          >
            {isAnalyzing ? "Analyse en cours..." : "Lancer l'Analyse"}
          </Button>

          {isAnalyzing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2 bg-[#1F2937]" />
              <p className="text-sm text-[#9CA3AF]">{progress.toFixed(0)}%</p>
            </div>
          )}

          {failures.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-[#1F2937] border-[#374151]">
                  <CardContent className="p-4">
                    <p className="text-[#9CA3AF] text-xs mb-1">Modules Non Autonomes</p>
                    <p className="text-white text-2xl font-bold">{nonAutonomous.length}</p>
                  </CardContent>
                </Card>
                <Card className="bg-[#1F2937] border-red-500/30">
                  <CardContent className="p-4">
                    <p className="text-[#9CA3AF] text-xs mb-1">Défaillances Critiques</p>
                    <p className="text-red-400 text-2xl font-bold">
                      {failures.filter(f => f.severity === "CRITICAL").length}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-[#1F2937] border-orange-500/30">
                  <CardContent className="p-4">
                    <p className="text-[#9CA3AF] text-xs mb-1">Défaillances Majeures</p>
                    <p className="text-orange-400 text-2xl font-bold">
                      {failures.filter(f => f.severity === "HIGH").length}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
                  Points de Défaillance Identifiés
                </h3>
                {failures.map((failure, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="bg-[#1F2937] border-[#374151]">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-400" />
                            <h4 className="text-white font-semibold">{failure.type}</h4>
                          </div>
                          <Badge className={getSeverityColor(failure.severity)}>
                            {failure.severity}
                          </Badge>
                        </div>

                        <p className="text-[#9CA3AF] text-sm">{failure.description}</p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-[#6B7280]">Modules affectés</p>
                            <p className="text-white font-semibold">
                              {failure.count} ({failure.percentage}%)
                            </p>
                          </div>
                          <div>
                            <p className="text-[#6B7280]">Impact</p>
                            <p className="text-orange-400">{failure.impact}</p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#374151]">
                          <p className="text-[#6B7280] text-xs mb-1">Cause racine</p>
                          <p className="text-[#9CA3AF] text-sm">{failure.root_cause}</p>
                        </div>

                        <div className="pt-2 border-t border-[#374151]">
                          <p className="text-[#6B7280] text-xs mb-1">Solution recommandée</p>
                          <p className="text-[#10b981] text-sm">{failure.solution}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {logs.length > 0 && (
            <Card className="bg-[#0a0a0a] border-[#374151]">
              <CardHeader>
                <CardTitle className="text-white text-sm">Logs d'Analyse</CardTitle>
              </CardHeader>
              <CardContent className="max-h-64 overflow-y-auto space-y-1">
                {logs.map((log, idx) => (
                  <div key={idx} className="text-xs flex gap-2">
                    <span className="text-[#6B7280]">{log.timestamp}</span>
                    <span className={
                      log.type === "error" ? "text-red-400" :
                      log.type === "success" ? "text-green-400" :
                      log.type === "warning" ? "text-yellow-400" :
                      log.type === "phase" ? "text-[#DC2626]" :
                      "text-[#9CA3AF]"
                    }>{log.message}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

    </div>
  );
}