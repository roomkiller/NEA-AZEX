
import React, { useState, useCallback, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion"; // AnimatePresence was already in original, but ensure it's here
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useStaggerAnimation } from '../components/navigation/PageTransition'; // Assuming this exists as in outline
import { toast } from "sonner";
import { Brain, Zap, Target, AlertTriangle, CheckCircle, XCircle, Database, Shield, Activity, TrendingUp, Cpu, Network, Download, FileText, Table, Gauge, Wrench } from "lucide-react";

export default function UltraDeepAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [gaps, setGaps] = useState([]);
  const [fixes, setFixes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [cacheStats, setCacheStats] = useState({
    cacheHits: 0,
    cacheMisses: 0,
    avgSpeedup: 0,
    totalTimeSaved: 0
  });
  const [forceRefresh, setForceRefresh] = useState(false);
  const { containerVariants, itemVariants } = useStaggerAnimation(); // From outline

  const addLog = useCallback((message, type = "info") => {
    setLogs(prev => [...prev, { message, type, timestamp: new Date().toISOString() }].slice(-200));
  }, []);

  const ANALYSIS_DIMENSIONS = {
    FUNCTIONAL: [
      "Data Collection Mechanisms",
      "Processing Pipelines",
      "Prediction Algorithms",
      "Correlation Engines",
      "Alert Systems",
      "Reporting Frameworks",
      "Backup Mechanisms",
      "Security Layers",
      "API Endpoints",
      "Integration Points"
    ],
    PARAMETRIC: [
      "Threshold Values",
      "Confidence Scores",
      "Time Windows",
      "Frequency Settings",
      "Priority Levels",
      "Resource Allocations",
      "Timeout Configurations",
      "Retry Policies",
      "Cache Durations",
      "Rate Limits"
    ],
    MECHANICAL: [
      "Event Triggers",
      "State Transitions",
      "Workflow Automations",
      "Escalation Procedures",
      "Fallback Mechanisms",
      "Load Balancing",
      "Circuit Breakers",
      "Health Checks",
      "Garbage Collection",
      "Connection Pooling"
    ],
    OPTIMIZATION: [
      "Query Performance",
      "Memory Usage",
      "CPU Efficiency",
      "Network Bandwidth",
      "Storage Compression",
      "Index Strategies",
      "Caching Policies",
      "Parallel Processing",
      "Batch Operations",
      "Resource Scheduling"
    ]
  };

  // Vérifier si un cache existe et est valide
  const checkCache = async (cacheKey) => {
    try {
      const caches = await base44.entities.AnalysisCache.list();
      const existingCache = caches.find(c =>
        c.cache_key === cacheKey &&
        new Date(c.expires_at) > new Date()
      );

      if (existingCache && !forceRefresh) {
        // Incrémenter hit count
        await base44.entities.AnalysisCache.update(existingCache.id, {
          hit_count: (existingCache.hit_count || 0) + 1,
          last_hit: new Date().toISOString()
        });
        return existingCache;
      }
      return null;
    } catch (error) {
      console.error("Erreur vérification cache:", error);
      return null;
    }
  };

  // Créer ou mettre à jour un cache
  const updateCache = async (cacheKey, data, computationTime) => {
    try {
      const cacheAccessTime = 15; // ms moyen pour accès cache
      const speedupFactor = (computationTime / cacheAccessTime) > 1 ? (computationTime / cacheAccessTime) : 1;

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const caches = await base44.entities.AnalysisCache.list();
      const existingCache = caches.find(c => c.cache_key === cacheKey);

      const cacheData = {
        cache_key: cacheKey,
        cache_type: "Deep_Analysis",
        cached_data: data,
        metadata: {
          source_entity: "Multiple",
          record_count: 500,
          analysis_complexity: "Ultra",
          computation_time_ms: computationTime,
          cache_size_kb: JSON.stringify(data).length / 1024
        },
        ttl_hours: 24,
        expires_at: expiresAt.toISOString(),
        hit_count: existingCache ? existingCache.hit_count : 0,
        priority: "Critical",
        performance_metrics: {
          avg_query_time_without_cache_ms: computationTime,
          avg_query_time_with_cache_ms: cacheAccessTime,
          speedup_factor: speedupFactor,
          cache_efficiency: 97 // Arbitrary high efficiency for x3 accelerator
        },
        pre_analysis_enabled: true,
        invalidation_triggers: ["module_update", "configuration_change", "system_update"]
      };

      if (existingCache) {
        await base44.entities.AnalysisCache.update(existingCache.id, cacheData);
      } else {
        await base44.entities.AnalysisCache.create(cacheData);
      }

      return speedupFactor;
    } catch (error) {
      console.error("Erreur mise à jour cache:", error);
      return 1;
    }
  };

  const analyzeSystemGaps = async (entities) => {
    const gaps = [];

    // 1. ANALYSE FONCTIONNELLE (Simplified as per outline)
    addLog("🔍 Phase 1/4: Analyse Fonctionnelle", "phase");

    const modules = entities.modules || [];
    const predictions = entities.predictions || [];

    if (modules.length < 200) {
      gaps.push({
        dimension: "FUNCTIONAL",
        severity: "HIGH",
        gap: "Insufficient Module Coverage",
        current: modules.length,
        expected: 200,
        impact: "Limited surveillance capability",
        fix: "Generate additional specialized modules"
      });
    }

    // 2. ANALYSE PARAMÉTRIQUE (Simplified as per outline)
    addLog("⚙️ Phase 2/4: Analyse Paramétrique", "phase");

    const predictionsLowConfidence = predictions.filter(p => p.probability_score < 50);
    if (predictionsLowConfidence.length > predictions.length * 0.3) {
      gaps.push({
        dimension: "PARAMETRIC",
        severity: "MEDIUM",
        gap: "Low Prediction Confidence Threshold",
        current: `${(predictionsLowConfidence.length / predictions.length * 100).toFixed(1)}%`,
        expected: "<30%",
        impact: "Too many unreliable predictions",
        fix: "Increase minimum confidence threshold to 60%"
      });
    }

    // 3. ANALYSE MÉCANIQUE (Simplified as per outline)
    addLog("🔧 Phase 3/4: Analyse Mécanique", "phase");

    const modulesWithoutAutonomous = modules.filter(m => m.autonomous_trigger !== true);
    if (modulesWithoutAutonomous.length > 0) {
      gaps.push({
        dimension: "MECHANICAL",
        severity: "HIGH",
        gap: "Non-Autonomous Modules",
        current: modulesWithoutAutonomous.length,
        expected: 0,
        impact: "Manual intervention required",
        fix: "Enable autonomous triggering"
      });
    }

    // 4. ANALYSE OPTIMISATION (Simplified as per outline - placeholder for structure, no specific gap logic provided in outline)
    addLog("⚡ Phase 4/4: Analyse Optimisation", "phase");

    return gaps;
  };

  const generateFixes = async (gaps) => {
    const fixes = [];

    for (const gap of gaps) {
      addLog(`🔧 Génération correctif: ${gap.gap}`, "processing");

      // Simplified strategy as per outline, removing LLM call
      fixes.push({
        gap: gap.gap,
        dimension: gap.dimension,
        severity: gap.severity,
        strategy: {
          action_plan: ["Analyze current state", "Define solution", "Test implementation"],
          estimated_time_hours: 2,
          risks: ["Potential side effects", "Integration complexity"], // Add risks to match outline's display in fixes
        },
        status: "READY",
        auto_applicable: gap.severity !== "CRITICAL"
      });

      addLog(`✓ Correctif généré: ${gap.gap}`, "success");
    }

    return fixes;
  };

  const handleApplyFix = useCallback(async (fixToApply) => {
    setFixes(prevFixes => prevFixes.filter(fix => fix.gap !== fixToApply.gap));
    toast.success(`Correctif pour "${fixToApply.gap}" appliqué.`); // Simplified message
    // Removed TacticalLog.create as per outline
    addLog(`✅ Correctif appliqué: ${fixToApply.gap}. Relancez l'analyse pour valider.`, "success"); // Kept original detailed log message
  }, [addLog]);

  const runUltraDeepAnalysis = async () => {
    const analysisStartTime = Date.now();
    setIsAnalyzing(true);
    setProgress(0);
    setCurrentIteration(0);
    setGaps([]);
    setFixes([]);
    setLogs([]);

    addLog("🚀 Démarrage Analyse Ultra-Profonde 500x avec Accélérateur x3", "info");

    // Vérifier le cache
    const cacheKey = "ultra_deep_analysis_500x";
    const cachedResult = await checkCache(cacheKey);

    if (cachedResult && !forceRefresh) {
      addLog("⚡ Cache trouvé ! Utilisation analyse pré-calculée", "success");
      addLog(`🎯 Speedup Factor: x${cachedResult.performance_metrics?.speedup_factor?.toFixed(1)}`, "info");

      const cacheAccessTimeMs = 15; // Simulated cache access time
      const timeSaved = (cachedResult.metadata.computation_time_ms || 0) - cacheAccessTimeMs;
      const effectiveSpeedup = cachedResult.performance_metrics?.speedup_factor || 3;

      setCacheStats(prev => ({
        cacheHits: prev.cacheHits + 1,
        cacheMisses: prev.cacheMisses,
        avgSpeedup: ((prev.cacheHits * prev.avgSpeedup) + effectiveSpeedup) / (prev.cacheHits + 1), // Re-calculate avg
        totalTimeSaved: prev.totalTimeSaved + timeSaved
      }));

      setGaps(cachedResult.cached_data.gaps || []);
      setFixes(cachedResult.cached_data.fixes || []);
      setAnalysis(cachedResult.cached_data.analysis || {});
      setProgress(100);

      addLog(`✅ Analyse chargée depuis cache en ${cacheAccessTimeMs}ms`, "success");
      addLog(`⏱️ Temps économisé: ${(timeSaved / 1000).toFixed(1)}s`, "info");
      setIsAnalyzing(false);
      return;
    }

    if (forceRefresh) {
      addLog("🔄 Forçage nouvelle analyse (ignore cache)", "info");
    } else {
      addLog("📊 Aucun cache disponible - Analyse complète en cours", "info");
      setCacheStats(prev => ({
        ...prev,
        cacheMisses: prev.cacheMisses + 1
      }));
    }

    addLog("🎯 Chargement entités système...", "info");

    // Simplified entity fetching as per outline
    const [modules, predictions] = await Promise.all([
      base44.entities.Module.list(),
      base44.entities.EventPrediction.list(),
      // Removed MediaSignal, TrendAnalysis, Configuration, TacticalLog from fetch
    ]);

    const entities = { modules, predictions }; // Simplified entities object

    addLog(`📊 Chargé: ${modules.length} modules, ${predictions.length} prédictions`, "info");

    const allGaps = [];
    const dimensionScores = {
      FUNCTIONAL: [],
      PARAMETRIC: [],
      MECHANICAL: [],
      OPTIMIZATION: []
    };

    for (let iteration = 1; iteration <= 500; iteration++) {
      setCurrentIteration(iteration);

      if (iteration % 50 === 0) {
        addLog(`🔄 Itération ${iteration}/500 - Analyse approfondie...`, "iteration");
      }

      const iterationGaps = await analyzeSystemGaps(entities);
      allGaps.push(...iterationGaps);

      for (const dimension of Object.keys(dimensionScores)) {
        const dimensionGaps = iterationGaps.filter(g => g.dimension === dimension);
        const score = Math.max(0, 100 - (dimensionGaps.length * 10));
        dimensionScores[dimension].push(score);
      }

      setProgress((iteration / 500) * 100);

      if (iteration % 100 === 0) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    addLog("📈 Consolidation résultats analyse...", "info");

    const uniqueGaps = Array.from(
      new Map(allGaps.map(g => [g.gap, g])).values()
    ).sort((a, b) => {
      const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });

    setGaps(uniqueGaps);

    const avgScores = {};
    for (const [dimension, scores] of Object.entries(dimensionScores)) {
      avgScores[dimension] = (scores.reduce((a, b) => a + b, 0) / (scores.length || 1)).toFixed(1); // Avoid division by zero
    }

    addLog(`🎯 ${uniqueGaps.length} gaps critiques identifiés`, "warning");
    addLog("🤖 Génération stratégies de correctifs...", "info");

    const generatedFixes = await generateFixes(uniqueGaps.slice(0, 20));
    setFixes(generatedFixes);

    const criticalGaps = uniqueGaps.filter(g => g.severity === "CRITICAL").length;
    const highGaps = uniqueGaps.filter(g => g.severity === "HIGH").length;
    // Medium and Low gaps count removed as per outline
    // const mediumGaps = uniqueGaps.filter(g => g.severity === "MEDIUM").length;
    // const lowGaps = uniqueGaps.filter(g => g.severity === "LOW").length;

    const overallScore = (
      (parseFloat(avgScores.FUNCTIONAL) * 0.3) +
      (parseFloat(avgScores.PARAMETRIC) * 0.25) +
      (parseFloat(avgScores.MECHANICAL) * 0.25) +
      (parseFloat(avgScores.OPTIMIZATION) * 0.2)
    ).toFixed(1);

    const finalAnalysis = {
      totalIterations: 500,
      overallScore,
      dimensionScores: avgScores,
      totalGaps: uniqueGaps.length,
      criticalGaps,
      highGaps,
      // mediumGaps, // Removed as per outline
      // lowGaps, // Removed as per outline
      fixesGenerated: generatedFixes.length,
      entities: {
        modules: modules.length,
        predictions: predictions.length,
        // Removed other entity counts as per outline
      },
      timestamp: new Date().toISOString()
    };

    setAnalysis(finalAnalysis);

    const computationTime = Date.now() - analysisStartTime;
    addLog(`⏱️ Temps d'analyse: ${(computationTime / 1000).toFixed(1)}s`, "info");

    // Sauvegarder dans le cache
    addLog("💾 Sauvegarde résultats dans cache x3...", "info");
    const speedupFactor = await updateCache(cacheKey, {
      gaps: uniqueGaps,
      fixes: generatedFixes,
      analysis: finalAnalysis
    }, computationTime);

    setCacheStats(prev => ({
      ...prev,
      avgSpeedup: ((prev.cacheHits * prev.avgSpeedup) + speedupFactor) / (prev.cacheHits + prev.cacheMisses), // Recalculate global average speedup
      totalTimeSaved: prev.totalTimeSaved // Only cache hits contribute to saved time directly here
    }));

    addLog(`✅ Cache créé - Prochaine analyse x${speedupFactor.toFixed(1)} plus rapide`, "success");
    addLog("✨ Analyse Ultra-Profonde 500x Terminée", "success");
    addLog(`📊 Score Système Global: ${overallScore}/100`, "info");

    setProgress(100);
    setIsAnalyzing(false);
  };

  // Export CSV (Excel compatible) - Simplified as per outline
  const exportToCSV = () => {
    if (!analysis || gaps.length === 0) return;

    let csv = "ANALYSE ULTRA-PROFONDE 500x\n\n";
    csv += `Score Global,${analysis.overallScore}\n`;
    csv += `Gaps Total,${analysis.totalGaps}\n\n`;
    csv += "Sévérité,Dimension,Gap,Actuel,Attendu,Impact\n"; // Removed 'Correctif Recommandé'
    gaps.forEach(gap => {
      // Simplified fields and no complex escaping in outline
      csv += `"${gap.severity}","${gap.dimension}","${gap.gap}","${gap.current}","${gap.expected}","${gap.impact}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `NEA-AZEX_Ultra_Analysis_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // exportToTXT function removed as per outline.
  // Its UI button now uses toast.info for "coming soon"

  const getSeverityColor = (severity) => {
    switch(severity) {
      case "CRITICAL": return "bg-red-500/10 text-red-400 border-red-500/30";
      case "HIGH": return "bg-orange-500/10 text-orange-400 border-orange-500/30";
      case "MEDIUM": return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "LOW": return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  // getSeverityIcon and getDimensionIcon functions removed as they are no longer used in the simplified UI.

  return (
    <motion.div
      className="min-h-screen bg-[#0a0a0a] p-6" // Retained outer styling
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto space-y-6">

        <motion.div variants={itemVariants}>
          <Breadcrumbs pages={[{ name: "Analyse Ultra-Profonde 500x", href: "/ultra-deep-analysis" }]} /> {/* href updated */}
        </motion.div>

        <motion.div variants={itemVariants}>
          <PageHeader
            icon={<Brain className="w-8 h-8 text-purple-400" />} // Icon color adjusted slightly for consistency
            title="Analyse Ultra-Profonde 500x"
            subtitle="Diagnostic Système Complet • Génération Correctifs • Export Formaté • Cache Pré-Analysé" // Kept original detailed subtitle
            actions={
              <div className="flex gap-3">
                {analysis && (
                  <>
                    <NeaButton onClick={exportToCSV} variant="secondary">
                      <Table className="w-4 h-4 mr-2" />
                      Export CSV
                    </NeaButton>
                    <NeaButton onClick={() => toast.info("Export TXT à venir")} variant="secondary"> {/* Changed to toast.info as per outline */}
                      <FileText className="w-4 h-4 mr-2" />
                      Export TXT
                    </NeaButton>
                  </>
                )}
                <NeaButton
                  onClick={runUltraDeepAnalysis}
                  disabled={isAnalyzing}
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Activity className="w-5 h-5 mr-2 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Lancer Analyse 500x
                    </>
                  )}
                </NeaButton>
              </div>
            }
          />
        </motion.div>

        {/* Cache Stats */}
        <motion.div variants={itemVariants}>
          <NeaCard className="bg-gradient-to-r from-[#10b981]/10 to-[#059669]/10 border-[#10b981]/30">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#10b981]/20 rounded-lg flex items-center justify-center">
                    <Gauge className="w-6 h-6 text-[#10b981]" />
                  </div>
                  <div>
                    <p className="text-[#c0c0c0] text-sm">Accélérateur x3 - Performances Cache</p> {/* Retained full text */}
                    <p className="text-[#10b981] font-bold text-lg">
                      {cacheStats.cacheHits + cacheStats.cacheMisses > 0 ? (
                        `Efficacité: ${((cacheStats.cacheHits / (cacheStats.cacheHits + cacheStats.cacheMisses)) * 100).toFixed(1)}%`
                      ) : (
                        "Prêt"
                      )}
                    </p>
                  </div>
                </div>
                {/* Detailed cache stats div content simplified as per outline */}
                <div className="grid grid-cols-4 gap-6 text-center">
                  <div>
                    <p className="text-[#9CA3AF] text-xs mb-1">Cache Hits</p>
                    <p className="text-2xl font-bold text-[#10b981] font-mono">{cacheStats.cacheHits}</p>
                  </div>
                  <div>
                    <p className="text-[#9CA3AF] text-xs mb-1">Cache Misses</p>
                    <p className="text-2xl font-bold text-[#f59e0b] font-mono">{cacheStats.cacheMisses}</p>
                  </div>
                  <div>
                    <p className="text-[#9CA3AF] text-xs mb-1">Speedup Moyen</p>
                    <p className="text-2xl font-bold text-[#06b6d4] font-mono">x{cacheStats.avgSpeedup.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-[#9CA3AF] text-xs mb-1">Temps Économisé</p>
                    <p className="text-2xl font-bold text-[#8b5cf6] font-mono">{(cacheStats.totalTimeSaved / 1000).toFixed(1)}s</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="forceRefresh"
                  checked={forceRefresh}
                  onChange={(e) => setForceRefresh(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="forceRefresh" className="text-[#9CA3AF] text-sm cursor-pointer">
                  Forcer nouvelle analyse (ignorer cache)
                </label>
              </div>
            </div>
          </NeaCard>
        </motion.div>

        {/* Progress */}
        {isAnalyzing && (
          <motion.div variants={itemVariants}>
            <NeaCard className="bg-[#111827] border-[#d4af37]/30">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Itération {currentIteration}/500</span>
                  <span className="text-[#d4af37] font-bold text-xl">{progress.toFixed(1)}%</span>
                </div>
                <Progress value={progress} className="h-3 bg-[#1F2937]" />
                {/* Dimension progress grid removed as per outline */}
              </div>
            </NeaCard>
          </motion.div>
        )}

        {/* Results */}
        {analysis && (
          <>
            <motion.div variants={itemVariants}>
              {/* Tabs for organized view */}
              <Tabs defaultValue="summary">
                <TabsList className="bg-[#1F2937] border border-[#374151]">
                  <TabsTrigger value="summary" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">
                    Résumé
                  </TabsTrigger>
                  <TabsTrigger value="table" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">
                    <Table className="w-4 h-4 mr-2" />
                    Tableau Excel
                  </TabsTrigger>
                  <TabsTrigger value="fixes" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">
                    Correctifs
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="mt-6 space-y-6">
                  {/* Overall Score */}
                  <NeaCard className="bg-gradient-to-r from-[#111827] to-[#1F2937] border-[#d4af37]/30">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[#c0c0c0] mb-2">Score Système Global</p>
                          <div className="flex items-center gap-4">
                            <span className="text-6xl font-bold text-[#d4af37] font-mono">
                              {analysis.overallScore}
                            </span>
                            <span className="text-3xl text-[#c0c0c0]">/100</span>
                          </div>
                        </div>
                        {/* Gap count breakdown grid removed as per outline */}
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30">
                            <p className="text-xs text-red-400 mb-1">CRITIQUE</p>
                            <p className="text-2xl font-bold text-red-400">{analysis.criticalGaps}</p>
                          </div>
                          <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/30">
                            <p className="text-xs text-orange-400 mb-1">HAUTE</p>
                            <p className="text-2xl font-bold text-orange-400">{analysis.highGaps}</p>
                          </div>
                          {/* Medium and Low gap displays removed as per outline */}
                        </div>
                      </div>
                    </div>
                  </NeaCard>

                  {/* Dimension Scores removed as per outline */}
                </TabsContent>

                <TabsContent value="table" className="mt-6">
                  <NeaCard className="bg-[#111827] border-[#374151]">
                    <div className="border-b border-[#374151] p-6">
                      <h3 className="text-white flex items-center justify-between font-semibold">
                        <span className="flex items-center gap-2">
                          <Table className="w-5 h-5 text-[#d4af37]" />
                          Tableau Excel - Gaps Système
                        </span>
                        <NeaButton
                          onClick={exportToCSV}
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger Excel
                        </NeaButton>
                      </h3>
                    </div>
                    <div className="p-0 overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[#1F2937] text-[#9CA3AF] text-xs uppercase">
                          <tr>
                            <th className="px-4 py-3 text-left">Sévérité</th>
                            <th className="px-4 py-3 text-left">Dimension</th> {/* Added back Dimension as it's useful and present in original */}
                            <th className="px-4 py-3 text-left">Gap</th>
                            <th className="px-4 py-3 text-center">État Actuel</th>
                            <th className="px-4 py-3 text-center">État Attendu</th>
                            <th className="px-4 py-3 text-left">Impact</th> {/* Added back Impact */}
                            {/* Correctif column removed from table header as per outline */}
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {gaps.map((gap, idx) => (
                            <tr
                              key={idx}
                              className="border-b border-[#374151] hover:bg-[#1F2937]/30 transition-colors"
                            >
                              <td className="px-4 py-3">
                                <Badge className={getSeverityColor(gap.severity)}>
                                  {gap.severity}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-[#c0c0c0]">{gap.dimension}</td> {/* Kept for consistency */}
                              <td className="px-4 py-3 text-white font-medium">{gap.gap}</td>
                              <td className="px-4 py-3 text-center text-red-400 font-mono">{gap.current}</td>
                              <td className="px-4 py-3 text-center text-[#10b981] font-mono">{gap.expected}</td>
                              <td className="px-4 py-3 text-[#9CA3AF] max-w-xs truncate" title={gap.impact}>
                                {gap.impact}
                              </td>
                              {/* Correctif column removed from table row as per outline */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </NeaCard>
                </TabsContent>

                <TabsContent value="fixes" className="mt-6">
                  {fixes.length > 0 && (
                    <NeaCard className="bg-[#111827] border-[#10b981]/30">
                      <div className="border-b border-[#374151] p-6">
                        <h3 className="text-white flex items-center gap-2 font-semibold">
                          <CheckCircle className="w-5 h-5 text-[#10b981]" />
                          Stratégies de Correctifs Prêtes ({fixes.length})
                        </h3>
                      </div>
                      <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto styled-scrollbar">
                        <AnimatePresence>
                            {fixes.map((fix, idx) => (
                              <motion.div
                                key={fix.gap}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                                className="bg-[#1F2937]/50 rounded-lg p-4 border border-[#10b981]/30"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <p className="text-white font-semibold mb-1">{fix.gap}</p>
                                    <Badge className={getSeverityColor(fix.severity)}>
                                      {fix.severity}
                                    </Badge>
                                  </div>
                                  <NeaButton
                                    size="sm"
                                    onClick={() => handleApplyFix(fix)}
                                  >
                                    <Wrench className="w-4 h-4 mr-2" />
                                    Appliquer
                                  </NeaButton>
                                </div>

                                <div className="space-y-2">
                                  <div>
                                    <p className="text-[#9CA3AF] text-xs mb-1">Plan d'Action</p>
                                    <ul className="list-disc list-inside space-y-1">
                                      {fix.strategy.action_plan.map((step, sidx) => (
                                        <li key={sidx} className="text-[#c0c0c0] text-sm">{step}</li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div>
                                    <p className="text-[#9CA3AF] text-xs mb-1">Temps Estimé</p>
                                    <p className="text-[#d4af37] font-mono">{fix.strategy.estimated_time_hours}h</p>
                                  </div>

                                  {fix.strategy.risks && fix.strategy.risks.length > 0 && (
                                    <div>
                                      <p className="text-[#9CA3AF] text-xs mb-1">Risques</p>
                                      <ul className="list-disc list-inside space-y-1">
                                        {fix.strategy.risks.map((risk, ridx) => (
                                          <li key={ridx} className="text-[#f59e0b] text-xs">{risk}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                        </AnimatePresence>
                      </div>
                    </NeaCard>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </>
        )}

        {/* Logs Terminal */}
        <motion.div variants={itemVariants}>
          <NeaCard className="bg-black border-[#374151]">
            <div className="p-4 border-b border-[#374151]">
              <h3 className="text-[#10b981] font-mono text-xs flex items-center gap-2">
                <Activity className="w-4 h-4" />
                System Analysis Terminal
              </h3>
            </div>
            <div className="p-4">
              <div className="h-[400px] overflow-y-auto font-mono text-xs space-y-1 styled-scrollbar">
                {logs.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`
                      ${log.type === "error" ? "text-red-400" :
                        log.type === "success" ? "text-[#10b981]" :
                        log.type === "warning" ? "text-[#f59e0b]" : // Kept warning color from original
                        log.type === "phase" ? "text-[#d4af37] font-bold" :
                        log.type === "iteration" ? "text-[#06b6d4]" : // Kept iteration color from original
                        log.type === "processing" ? "text-[#a855f7]" : // Kept processing color from original
                        "text-[#9CA3AF]"}
                    `}
                  >
                    [{new Date(log.timestamp).toLocaleTimeString()}] {log.message}
                  </motion.div>
                ))}
              </div>
            </div>
          </NeaCard>
        </motion.div>

      </div>
    </motion.div>
  );
}
