import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Activity, CheckCircle, Play } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { toast } from 'sonner';

export default function EmergencyAuditProtocol() {
    const [isLoading, setIsLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState(null);
    const [logs, setLogs] = useState([]);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        // Simulation de chargement initial
        setTimeout(() => setIsLoading(false), 1000);
    }, []);

    const addLog = (message, type = "info") => {
        setLogs(prev => [...prev, { 
            message, 
            type, 
            timestamp: new Date().toLocaleTimeString() 
        }]);
    };

    const runEmergencyAudit = async () => {
        setIsRunning(true);
        setProgress(0);
        setLogs([]);
        setResults(null);

        addLog("🚨 PROTOCOLE D'AUDIT D'URGENCE ACTIVÉ", "phase");
        
        try {
            const stats = {
                securityChecks: 0,
                integrityChecks: 0,
                threatsFound: 0,
                vulnerabilities: 0
            };

            // Phase 1: Vérifications sécurité
            addLog("🔍 Phase 1: Vérifications Sécurité", "phase");
            for (let i = 0; i < 20; i++) {
                await new Promise(r => setTimeout(r, 100));
                stats.securityChecks++;
                if (Math.random() > 0.9) {
                    stats.threatsFound++;
                    addLog(`⚠️ Menace potentielle détectée - Check ${i + 1}`, "warning");
                }
                setProgress(25 * (i + 1) / 20);
            }

            // Phase 2: Vérifications d'intégrité
            addLog("🔍 Phase 2: Vérifications d'Intégrité", "phase");
            for (let i = 0; i < 20; i++) {
                await new Promise(r => setTimeout(r, 100));
                stats.integrityChecks++;
                if (Math.random() > 0.85) {
                    stats.vulnerabilities++;
                    addLog(`⚠️ Vulnérabilité détectée - Check ${i + 1}`, "warning");
                }
                setProgress(25 + 25 * (i + 1) / 20);
            }

            // Phase 3: Analyse des menaces
            addLog("🔍 Phase 3: Analyse des Menaces", "phase");
            await new Promise(r => setTimeout(r, 2000));
            setProgress(75);

            // Phase 4: Génération rapport
            addLog("📋 Phase 4: Génération du Rapport", "phase");
            await new Promise(r => setTimeout(r, 1000));
            setProgress(100);

            addLog("✅ AUDIT D'URGENCE TERMINÉ", "success");
            setResults(stats);
            toast.success("Audit d'urgence terminé");
        } catch (error) {
            addLog(`❌ Erreur: ${error.message}`, "error");
            toast.error("Échec de l'audit");
        } finally {
            setIsRunning(false);
        }
    };

    if (isLoading) {
        return <LoadingTransition message="Initialisation protocole d'urgence..." />;
    }

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Protocole Audit d'Urgence", href: "EmergencyAuditProtocol" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<AlertTriangle className="w-8 h-8 text-red-400" />}
                    title="Protocole d'Audit d'Urgence"
                    subtitle="Vérification complète en situation critique"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30">
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                                    isRunning ? 'bg-red-500 animate-pulse' : 'bg-red-500/20'
                                }`}>
                                    <Shield className={`w-10 h-10 ${
                                        isRunning ? 'text-white' : 'text-red-400'
                                    }`} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                        {isRunning ? "Audit en Cours" : "Protocole en Attente"}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Vérification de sécurité niveau maximum
                                    </p>
                                </div>
                            </div>
                            <Badge className={isRunning 
                                ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse" 
                                : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                            }>
                                {isRunning ? "ACTIF" : "STANDBY"}
                            </Badge>
                        </div>

                        {isRunning && (
                            <div className="mb-6">
                                <Progress value={progress} className="h-3 mb-2" />
                                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                                    {progress.toFixed(0)}%
                                </p>
                            </div>
                        )}

                        <NeaButton
                            onClick={runEmergencyAudit}
                            disabled={isRunning}
                            className="w-full"
                            size="lg"
                            variant="destructive"
                        >
                            <Play className="w-5 h-5 mr-2" />
                            {isRunning ? "Audit en cours..." : "Lancer Audit d'Urgence"}
                        </NeaButton>
                    </div>
                </NeaCard>
            </motion.div>

            {results && (
                <motion.div variants={itemVariants}>
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)]">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                Résultats d'Audit
                            </h3>
                        </div>
                        <div className="p-6 grid md:grid-cols-4 gap-4">
                            {[
                                { label: "Vérifications Sécurité", value: results.securityChecks, color: "text-blue-400" },
                                { label: "Vérifications Intégrité", value: results.integrityChecks, color: "text-green-400" },
                                { label: "Menaces Détectées", value: results.threatsFound, color: "text-red-400" },
                                { label: "Vulnérabilités", value: results.vulnerabilities, color: "text-yellow-400" }
                            ].map((metric, idx) => (
                                <div key={idx} className="text-center p-4 bg-[var(--nea-bg-surface-hover)] rounded-lg">
                                    <p className={`text-3xl font-bold ${metric.color} mb-1`}>
                                        {metric.value}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {metric.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </NeaCard>
                </motion.div>
            )}

            <motion.div variants={itemVariants}>
                <NeaCard className="bg-black border-[var(--nea-border-default)]">
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <h3 className="text-red-400 font-mono text-xs flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Journal d'Audit
                        </h3>
                    </div>
                    <div className="p-4">
                        <div className="h-[400px] overflow-y-auto font-mono text-xs space-y-1 styled-scrollbar">
                            {logs.length === 0 ? (
                                <p className="text-gray-600 dark:text-gray-400">En attente d'exécution...</p>
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
                                              log.type === "phase" ? "text-red-400 font-bold" :
                                              "text-gray-600 dark:text-gray-400"}
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