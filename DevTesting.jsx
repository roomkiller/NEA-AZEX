import React, { useState } from "react";
import { Module } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TestTube, CheckCircle, XCircle, AlertTriangle, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function DevTesting({ automation, onComplete }) {
  const [isTesting, setIsTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    processed: 0,
    total: 0,
    rate: 0
  });

  const addLog = (message, type = "info") => {
    setLogs(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }].slice(-100));
  };

  const runValidationTests = async () => {
    setIsTesting(true);
    setProgress(0);
    setLogs([]);
    addLog("🧪 Démarrage validation - Étape 4/5", "phase");

    const startTime = Date.now();

    try {
      const modules = await Module.list();
      const modulesWithSources = modules.filter(m => m.data_sources && m.data_sources.length > 0);
      
      addLog(`📊 ${modulesWithSources.length} modules à valider`, "info");

      const testResults = {
        totalModules: modulesWithSources.length,
        passed: 0,
        failed: 0,
        warnings: 0,
        validationDetails: [],
        performanceMetrics: {
          startTime,
          processingRate: 0
        }
      };

      setStats({ processed: 0, total: modulesWithSources.length, rate: 0 });
      setProgress(10);

      // Traitement par lots
      const BATCH_SIZE = 30;
      const batches = [];
      for (let i = 0; i < modulesWithSources.length; i += BATCH_SIZE) {
        batches.push(modulesWithSources.slice(i, i + BATCH_SIZE));
      }

      addLog(`🚀 Validation en ${batches.length} lots de ${BATCH_SIZE} modules`, "info");

      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];

        await Promise.all(batch.map(async (module) => {
          const validation = {
            module_id: module.id,
            module_name: module.name,
            category: module.category,
            tests: [],
            overall_status: "pass"
          };

          // Test 1: Format sources
          const formatTest = {
            test_name: "Format Sources",
            status: "pass",
            details: []
          };

          module.data_sources.forEach((source, idx) => {
            if (!source.name || !source.url || !source.type) {
              formatTest.status = "fail";
              formatTest.details.push(`Source ${idx + 1}: Champs manquants`);
              validation.overall_status = "fail";
            }
          });

          validation.tests.push(formatTest);

          // Test 2: Validation URLs
          const urlTest = {
            test_name: "Validation URLs",
            status: "pass",
            details: []
          };

          module.data_sources.forEach(source => {
            try {
              new URL(source.url);
            } catch (e) {
              if (!source.url.startsWith('internal://')) {
                urlTest.status = "fail";
                validation.overall_status = "fail";
              }
            }
          });

          validation.tests.push(urlTest);

          // Test 3: Schéma
          const schemaTest = {
            test_name: "Conformité Schéma",
            status: "pass",
            details: []
          };

          const requiredFields = ['name', 'url', 'type', 'update_frequency'];
          module.data_sources.forEach(source => {
            const missingFields = requiredFields.filter(field => !source[field]);
            if (missingFields.length > 0) {
              schemaTest.status = "warning";
              validation.overall_status = validation.overall_status === "fail" ? "fail" : "warning";
            }
          });

          validation.tests.push(schemaTest);

          testResults.validationDetails.push(validation);

          if (validation.overall_status === "pass") {
            testResults.passed++;
          } else if (validation.overall_status === "fail") {
            testResults.failed++;
          } else {
            testResults.warnings++;
          }
        }));

        const processedCount = (batchIndex + 1) * BATCH_SIZE;
        const currentRate = (processedCount / ((Date.now() - startTime) / 1000)).toFixed(1);

        setStats({
          processed: Math.min(processedCount, modulesWithSources.length),
          total: modulesWithSources.length,
          rate: currentRate
        });

        setProgress(10 + ((batchIndex + 1) / batches.length) * 85);
      }

      const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
      testResults.performanceMetrics.totalTime = totalTime;
      testResults.performanceMetrics.processingRate = (modulesWithSources.length / parseFloat(totalTime)).toFixed(1);

      setProgress(100);
      addLog(`✅ Validation terminée en ${totalTime}s`, "success");
      addLog(`📊 ${testResults.passed} OK, ${testResults.warnings} warnings, ${testResults.failed} échecs`, "info");

      setResults(testResults);
      
      setTimeout(() => {
        onComplete(testResults);
      }, 1000);

    } catch (error) {
      addLog(`❌ Erreur: ${error.message}`, "error");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#111827] border-[#374151]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TestTube className="w-5 h-5 text-[#DC2626]" />
            Étape 4: Validation Conformité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[#9CA3AF]">
            Tests automatisés de conformité des données (format, URLs, schéma).
          </p>

          {!results && (
            <Button
              onClick={runValidationTests}
              disabled={isTesting}
              className="w-full bg-[#DC2626] hover:bg-[#DC2626]/90"
              size="lg"
            >
              {isTesting ? (
                <>
                  <Activity className="w-5 h-5 mr-2 animate-spin" />
                  Validation en cours...
                </>
              ) : (
                <>
                  <TestTube className="w-5 h-5 mr-2" />
                  Lancer Validation
                </>
              )}
            </Button>
          )}

          {isTesting && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Progress value={progress} className="h-3" />
                <p className="text-center text-[#DC2626] font-bold">{progress.toFixed(0)}%</p>
              </div>

              <Card className="bg-[#1F2937]/50 border-[#374151]">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-[#9CA3AF] text-xs mb-1">Validés</p>
                      <p className="text-2xl font-bold text-[#10b981] font-mono">
                        {stats.processed}/{stats.total}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#9CA3AF] text-xs mb-1">Vitesse</p>
                      <p className="text-2xl font-bold text-[#06b6d4] font-mono">
                        {stats.rate}
                      </p>
                      <p className="text-[10px] text-[#9CA3AF]">modules/s</p>
                    </div>
                    <div>
                      <p className="text-[#9CA3AF] text-xs mb-1">Restant</p>
                      <p className="text-2xl font-bold text-[#f59e0b] font-mono">
                        {stats.total - stats.processed}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {results && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-[#10b981]/10 border-[#10b981]/30">
                  <CardContent className="p-4 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-[#10b981]" />
                    <div>
                      <p className="text-[#9CA3AF] text-xs">Réussis</p>
                      <p className="text-2xl font-bold text-[#10b981]">{results.passed}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-amber-500/10 border-amber-500/30">
                  <CardContent className="p-4 flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-400" />
                    <div>
                      <p className="text-[#9CA3AF] text-xs">Avertissements</p>
                      <p className="text-2xl font-bold text-amber-400">{results.warnings}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-red-500/10 border-red-500/30">
                  <CardContent className="p-4 flex items-center gap-3">
                    <XCircle className="w-6 h-6 text-red-400" />
                    <div>
                      <p className="text-[#9CA3AF] text-xs">Échecs</p>
                      <p className="text-2xl font-bold text-red-400">{results.failed}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {results.validationDetails.length > 0 && (
                <Card className="bg-[#1F2937] border-[#374151]">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Détails Validation (Échantillon)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                    {results.validationDetails.slice(0, 5).map((validation, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-3 bg-[#111827] rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white font-semibold text-sm">{validation.module_name}</p>
                          <Badge className={
                            validation.overall_status === "pass" ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30" :
                            validation.overall_status === "warning" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                            "bg-red-500/10 text-red-400 border-red-500/30"
                          }>
                            {validation.overall_status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          {validation.tests.map((test, tidx) => (
                            <div key={tidx} className="flex items-center gap-2 text-xs">
                              {test.status === "pass" ? (
                                <CheckCircle className="w-3 h-3 text-[#10b981]" />
                              ) : test.status === "warning" ? (
                                <AlertTriangle className="w-3 h-3 text-amber-400" />
                              ) : (
                                <XCircle className="w-3 h-3 text-red-400" />
                              )}
                              <span className="text-[#9CA3AF]">{test.test_name}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-black border-[#374151]">
        <CardHeader>
          <CardTitle className="text-[#10b981] font-mono text-xs">Logs Validation</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[200px] overflow-y-auto font-mono text-xs space-y-1">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className={`
                  ${log.type === "error" ? "text-red-400" :
                    log.type === "success" ? "text-[#10b981]" :
                    log.type === "warning" ? "text-amber-400" :
                    log.type === "phase" ? "text-[#DC2626] font-bold" :
                    "text-[#9CA3AF]"}
                `}
              >
                [{log.timestamp}] {log.message}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}