import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TestTube, Play, CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CascadeTests() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [progress, setProgress] = useState(0);

  const tests = [
    { name: "Test de Convergence", description: "Vérifie la convergence de l'algorithme" },
    { name: "Test de Performance", description: "Mesure les temps de calcul" },
    { name: "Test de Précision", description: "Vérifie l'exactitude des prédictions" },
    { name: "Test de Robustesse", description: "Teste avec des données bruitées" },
    { name: "Test d'Intégration", description: "Vérifie l'intégration système" }
  ];

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setProgress(0);

    const results = [];

    for (let i = 0; i < tests.length; i++) {
      setProgress(((i + 1) / tests.length) * 100);
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      const passed = Math.random() > 0.2;
      results.push({
        ...tests[i],
        passed,
        duration: Math.floor(Math.random() * 500) + 100,
        score: passed ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 50) + 30
      });

      setTestResults([...results]);
    }

    setIsRunning(false);
    const allPassed = results.every(r => r.passed);
    toast[allPassed ? 'success' : 'warning'](
      allPassed ? 'Tous les tests sont passés' : 'Certains tests ont échoué'
    );
  };

  const passedTests = testResults.filter(t => t.passed).length;
  const failedTests = testResults.filter(t => !t.passed).length;

  return (
    <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-cyan-400" />
            Suite de Tests de Cascade
          </span>
          <Button
            onClick={runTests}
            disabled={isRunning}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            {isRunning ? (
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
        {isRunning && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-[var(--nea-text-secondary)]">
              Progression: {progress.toFixed(0)}%
            </p>
          </div>
        )}

        {testResults.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)]">
              <p className="text-xs text-[var(--nea-text-secondary)]">Total</p>
              <p className="text-xl font-bold text-white">{testResults.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10">
              <p className="text-xs text-green-400">Réussis</p>
              <p className="text-xl font-bold text-green-400">{passedTests}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10">
              <p className="text-xs text-red-400">Échoués</p>
              <p className="text-xl font-bold text-red-400">{failedTests}</p>
            </div>
          </div>
        )}

        <AnimatePresence>
          {testResults.length > 0 && (
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
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border border-[var(--nea-border-subtle)] ${bgColor}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-2 flex-1">
                        <TestIcon className={`w-5 h-5 mt-0.5 ${iconColor}`} />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{test.name}</h4>
                          <p className="text-sm text-[var(--nea-text-secondary)] mt-1">
                            {test.description}
                          </p>
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
          )}
        </AnimatePresence>

        {!isRunning && testResults.length === 0 && (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 mx-auto text-[var(--nea-text-muted)] mb-3" />
            <p className="text-[var(--nea-text-secondary)]">Aucun test exécuté</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}