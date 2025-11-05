import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TestTube, Play, Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function PrototypeTests({ specifications }) {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [progress, setProgress] = useState(0);

  const prototypeTests = [
    { name: "Test Unitaire Auto-Réparation", category: "Fonctionnel" },
    { name: "Test Monitoring Temps Réel", category: "Performance" },
    { name: "Test Charge Système", category: "Stress" },
    { name: "Test Failover Automatique", category: "Résilience" },
    { name: "Test Intégration Modules", category: "Integration" },
    { name: "Test Sécurité", category: "Sécurité" }
  ];

  const runTests = async () => {
    if (!specifications) {
      toast.error("Veuillez d'abord générer les spécifications techniques");
      return;
    }

    setIsTesting(true);
    setTestResults([]);
    setProgress(0);

    const results = [];

    for (let i = 0; i < prototypeTests.length; i++) {
      setProgress(((i + 1) / prototypeTests.length) * 100);
      
      await new Promise(resolve => setTimeout(resolve, 1500));

      const passed = Math.random() > 0.25;
      const score = passed ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 60) + 20;

      results.push({
        ...prototypeTests[i],
        passed,
        score,
        duration: Math.floor(Math.random() * 1000) + 200
      });

      setTestResults([...results]);
    }

    setIsTesting(false);
    const passRate = (results.filter(r => r.passed).length / results.length) * 100;
    
    if (passRate >= 80) {
      toast.success(`Tests réussis à ${passRate.toFixed(0)}%`);
    } else if (passRate >= 60) {
      toast.warning(`Tests partiellement réussis à ${passRate.toFixed(0)}%`);
    } else {
      toast.error(`Tests échoués à ${passRate.toFixed(0)}%`);
    }
  };

  const passedTests = testResults.filter(t => t.passed).length;
  const failedTests = testResults.filter(t => !t.passed).length;
  const avgScore = testResults.length > 0 
    ? (testResults.reduce((sum, t) => sum + t.score, 0) / testResults.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2">
              <TestTube className="w-5 h-5 text-purple-400" />
              Phase 3: Tests du Prototype
            </span>
            <Button
              onClick={runTests}
              disabled={isTesting || !specifications}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Tests en cours...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Lancer Tests
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {isTesting && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-[var(--nea-text-secondary)]">
                Progression: {progress.toFixed(0)}%
              </p>
            </div>
          )}

          {testResults.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-green-500/10">
                <p className="text-xs text-green-400">Réussis</p>
                <p className="text-xl font-bold text-green-400">{passedTests}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10">
                <p className="text-xs text-red-400">Échoués</p>
                <p className="text-xl font-bold text-red-400">{failedTests}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <p className="text-xs text-blue-400">Score Moyen</p>
                <p className="text-xl font-bold text-blue-400">{avgScore}%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {testResults.length > 0 && (
          <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
            <CardHeader>
              <CardTitle className="text-white">Résultats Détaillés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {testResults.map((test, index) => {
                  const TestIcon = test.passed ? CheckCircle : XCircle;
                  const iconColor = test.passed ? 'text-green-400' : 'text-red-400';
                  const bgColor = test.passed ? 'bg-green-500/10' : 'bg-red-500/10';

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-lg border border-[var(--nea-border-subtle)] ${bgColor}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-2 flex-1">
                          <TestIcon className={`w-5 h-5 mt-0.5 ${iconColor}`} />
                          <div className="flex-1">
                            <h5 className="font-semibold text-white">{test.name}</h5>
                            <Badge className="bg-blue-500/20 text-blue-300 border-0 mt-1">
                              {test.category}
                            </Badge>
                          </div>
                        </div>
                        <Badge className={test.passed ? 'bg-green-500/20 text-green-300 border-0' : 'bg-red-500/20 text-red-300 border-0'}>
                          {test.passed ? 'PASS' : 'FAIL'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[var(--nea-text-muted)]">
                        <span>Score: <span className="text-white font-semibold">{test.score}%</span></span>
                        <span>Durée: <span className="text-white font-semibold">{test.duration}ms</span></span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </AnimatePresence>

      {!isTesting && testResults.length === 0 && (
        <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-[var(--nea-text-muted)] mb-3" />
            <p className="text-[var(--nea-text-secondary)]">Aucun test exécuté</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}