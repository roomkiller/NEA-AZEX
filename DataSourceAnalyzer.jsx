import React, { useState, useEffect, useCallback } from "react";
import { Module } from "@/api/entities";
import { DataSource } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, RefreshCw, Loader2, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function DataSourceAnalyzer() {
  const [modules, setModules] = useState([]);
  const [dataSources, setDataSources] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [modulesData, sourcesData] = await Promise.all([
        Module.list(),
        DataSource.list()
      ]);
      setModules(modulesData);
      setDataSources(sourcesData);
    } catch (error) {
      console.error("Erreur chargement données:", error);
      toast.error("Échec du chargement des données");
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const analyzeDataSources = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysis(null);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const activeSources = dataSources.filter(ds => ds.status === 'Active');
    const inactiveSources = dataSources.filter(ds => ds.status === 'Inactive');
    const errorSources = dataSources.filter(ds => ds.status === 'Error');

    const modulesWithSources = modules.filter(m => 
      dataSources.some(ds => ds.assigned_module_id === m.id)
    );
    const modulesWithoutSources = modules.filter(m => 
      !dataSources.some(ds => ds.assigned_module_id === m.id)
    );

    const recommendations = [];
    
    if (modulesWithoutSources.length > 0) {
      recommendations.push({
        type: 'warning',
        message: `${modulesWithoutSources.length} modules sans source de données`,
        action: 'Assigner des sources de données'
      });
    }

    if (errorSources.length > 0) {
      recommendations.push({
        type: 'error',
        message: `${errorSources.length} sources en erreur`,
        action: 'Vérifier la connectivité'
      });
    }

    if (inactiveSources.length > 0) {
      recommendations.push({
        type: 'info',
        message: `${inactiveSources.length} sources inactives`,
        action: 'Activer ou supprimer'
      });
    }

    setAnalysis({
      totalModules: modules.length,
      totalSources: dataSources.length,
      activeSources: activeSources.length,
      inactiveSources: inactiveSources.length,
      errorSources: errorSources.length,
      modulesWithSources: modulesWithSources.length,
      modulesWithoutSources: modulesWithoutSources.length,
      recommendations,
      coverage: modules.length > 0 ? (modulesWithSources.length / modules.length * 100).toFixed(1) : 0
    });

    setIsAnalyzing(false);
    toast.success("Analyse complétée");
  }, [modules, dataSources]);

  return (
    <div className="space-y-6">
      <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              Analyseur de Sources de Données
            </span>
            <div className="flex items-center gap-2">
              <Button onClick={loadData} size="sm" variant="outline">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                onClick={analyzeDataSources}
                disabled={isAnalyzing}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyse...
                  </>
                ) : (
                  "Analyser"
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)]">
              <p className="text-xs text-[var(--nea-text-secondary)]">Modules</p>
              <p className="text-xl font-bold text-white">{modules.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10">
              <p className="text-xs text-blue-400">Sources</p>
              <p className="text-xl font-bold text-blue-400">{dataSources.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10">
              <p className="text-xs text-green-400">Actives</p>
              <p className="text-xl font-bold text-green-400">
                {dataSources.filter(ds => ds.status === 'Active').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10">
              <p className="text-xs text-red-400">Erreurs</p>
              <p className="text-xl font-bold text-red-400">
                {dataSources.filter(ds => ds.status === 'Error').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
              <CardHeader>
                <CardTitle className="text-white">Résultats de l'Analyse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <p className="text-sm text-purple-300 mb-1">Couverture Globale</p>
                  <p className="text-3xl font-bold text-white">{analysis.coverage}%</p>
                  <p className="text-xs text-[var(--nea-text-muted)] mt-1">
                    {analysis.modulesWithSources}/{analysis.totalModules} modules connectés
                  </p>
                </div>

                {analysis.recommendations && analysis.recommendations.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-white mb-3">Recommandations</h5>
                    <div className="space-y-2">
                      {analysis.recommendations.map((rec, index) => {
                        const Icon = rec.type === 'error' ? XCircle : 
                                   rec.type === 'warning' ? AlertTriangle : 
                                   CheckCircle;
                        const iconColor = rec.type === 'error' ? 'text-red-400' : 
                                        rec.type === 'warning' ? 'text-yellow-400' : 
                                        'text-blue-400';
                        const bgColor = rec.type === 'error' ? 'bg-red-500/10' : 
                                      rec.type === 'warning' ? 'bg-yellow-500/10' : 
                                      'bg-blue-500/10';

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-lg ${bgColor} border border-[var(--nea-border-subtle)]`}
                          >
                            <div className="flex items-start gap-3">
                              <Icon className={`w-5 h-5 mt-0.5 ${iconColor}`} />
                              <div className="flex-1">
                                <p className="text-sm text-white font-semibold">{rec.message}</p>
                                <p className="text-xs text-[var(--nea-text-muted)] mt-1">
                                  Action recommandée: {rec.action}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}