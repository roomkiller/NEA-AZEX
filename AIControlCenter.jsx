
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Activity, FileText, AlertTriangle, Play, Square, Settings, RefreshCw, Zap } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStaggerAnimation } from '../components/navigation/PageTransition';
import { toast } from 'sonner';
import anomalyDetectionService from '../components/ai/AnomalyDetectionService';
import automatedReportGenerator from '../components/ai/AutomatedReportGenerator';
import alertPrioritizationService from '../components/ai/AlertPrioritizationService';

export default function AIControlCenter() {
    const [anomalyStatus, setAnomalyStatus] = useState({ isRunning: false });
    const [prioritizationStatus, setPrioritizationStatus] = useState({ isRunning: false });
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        updateStatuses();
        const interval = setInterval(updateStatuses, 5000);
        return () => clearInterval(interval);
    }, []);

    const updateStatuses = () => {
        setAnomalyStatus(anomalyDetectionService.getStatus());
        setPrioritizationStatus(alertPrioritizationService.getStatus());
    };

    const handleStartAnomalyDetection = () => {
        anomalyDetectionService.startMonitoring(15);
        toast.success('Détection d\'anomalies activée');
        updateStatuses();
    };

    const handleStopAnomalyDetection = () => {
        anomalyDetectionService.stopMonitoring();
        toast.info('Détection d\'anomalies désactivée');
        updateStatuses();
    };

    const handleStartPrioritization = () => {
        alertPrioritizationService.startPrioritization(10);
        toast.success('Priorisation d\'alertes activée');
        updateStatuses();
    };

    const handleStopPrioritization = () => {
        alertPrioritizationService.stopPrioritization();
        toast.info('Priorisation d\'alertes désactivée');
        updateStatuses();
    };

    const handleGenerateReport = async (domain) => {
        setIsGeneratingReport(true);
        toast.loading('Génération du rapport en cours...', { id: 'report-gen' });
        
        try {
            const brief = await automatedReportGenerator.generateIntelligenceBrief(domain, '24h');
            toast.success(`Rapport généré avec succès! ID: ${brief.id}`, { id: 'report-gen' });
        } catch (error) {
            toast.error('Erreur lors de la génération du rapport', { id: 'report-gen' });
            console.error(error);
        } finally {
            setIsGeneratingReport(false);
        }
    };

    const handleManualAnomalyCheck = async () => {
        toast.loading('Analyse des anomalies en cours...', { id: 'anomaly-check' });
        try {
            await anomalyDetectionService.performAnomalyCheck();
            toast.success('Analyse terminée - Vérifiez vos notifications', { id: 'anomaly-check' });
            updateStatuses();
        } catch (error) {
            console.error('Error in anomaly check:', error);
            toast.error('Erreur lors de l\'analyse', { id: 'anomaly-check' });
        }
    };

    const handleManualPrioritization = async () => {
        toast.loading('Priorisation des alertes en cours...', { id: 'prioritization' });
        try {
            await alertPrioritizationService.processAlerts();
            toast.success('Priorisation terminée', { id: 'prioritization' });
            updateStatuses();
        } catch (error) {
            console.error('Error in manual prioritization:', error);
            toast.error('Erreur lors de la priorisation', { id: 'prioritization' });
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
                <Breadcrumbs pages={[
                    { name: "IA" },
                    { name: "Centre de Contrôle IA", href: "AIControlCenter" }
                ]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<BrainCircuit className="w-8 h-8 text-purple-400" />}
                    title="Centre de Contrôle IA"
                    subtitle="Gestion des systèmes d'intelligence artificielle NEA-AZEX"
                />
            </motion.div>

            {/* Status Overview */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-4">
                <NeaCard className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
                    <div className="flex items-center gap-3 mb-3">
                        <Activity className="w-5 h-5 text-purple-400" />
                        <p className="text-sm text-[var(--nea-text-secondary)]">Détection Anomalies</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <Badge className={`border-0 ${anomalyStatus.isRunning ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            {anomalyStatus.isRunning ? 'ACTIF' : 'INACTIF'}
                        </Badge>
                        {anomalyStatus.isRunning && (
                            <div className="flex items-center gap-2 text-green-400">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-xs">Surveillance</span>
                            </div>
                        )}
                    </div>
                </NeaCard>

                <NeaCard className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
                    <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle className="w-5 h-5 text-blue-400" />
                        <p className="text-sm text-[var(--nea-text-secondary)]">Priorisation Alertes</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <Badge className={`border-0 ${prioritizationStatus.isRunning ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            {prioritizationStatus.isRunning ? 'ACTIF' : 'INACTIF'}
                        </Badge>
                        {prioritizationStatus.isRunning && (
                            <div className="flex items-center gap-2 text-green-400">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-xs">Traitement</span>
                            </div>
                        )}
                    </div>
                </NeaCard>

                <NeaCard className="p-4 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/30">
                    <div className="flex items-center gap-3 mb-3">
                        <FileText className="w-5 h-5 text-cyan-400" />
                        <p className="text-sm text-[var(--nea-text-secondary)]">Rapports Auto</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <Badge className="border-0 bg-green-500/20 text-green-400">
                            DISPONIBLE
                        </Badge>
                        {isGeneratingReport && (
                            <div className="flex items-center gap-2 text-cyan-400">
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                <span className="text-xs">Génération...</span>
                            </div>
                        )}
                    </div>
                </NeaCard>
            </motion.div>

            {/* Anomaly Detection Control */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)] bg-purple-500/5">
                        <div className="flex items-center gap-3">
                            <Activity className="w-6 h-6 text-purple-400" />
                            <div>
                                <h3 className="text-lg font-bold text-[var(--nea-text-title)]">
                                    Détection d'Anomalies par IA
                                </h3>
                                <p className="text-xs text-[var(--nea-text-secondary)]">
                                    Surveillance intelligente des flux de données (prédictions, signaux, sécurité)
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <h4 className="font-semibold text-[var(--nea-text-primary)] mb-2">Fonctionnalités</h4>
                                <ul className="space-y-2 text-sm text-[var(--nea-text-secondary)]">
                                    <li className="flex items-start gap-2">
                                        <Zap className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                        Analyse en temps réel des prédictions d'événements
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Zap className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                        Détection de patterns anormaux dans les signaux OSINT
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Zap className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                        Identification d'attaques coordonnées (sécurité)
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Zap className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                        Alertes automatiques pour anomalies critiques
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-[var(--nea-text-primary)] mb-2">Paramètres</h4>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-[var(--nea-text-secondary)]">Seuil de détection</span>
                                            <span className="text-[var(--nea-text-primary)]">70%</span>
                                        </div>
                                        <Progress value={70} className="h-2" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-[var(--nea-text-secondary)]">Fréquence de vérification</span>
                                            <span className="text-[var(--nea-text-primary)]">15 min</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {!anomalyStatus.isRunning ? (
                                <NeaButton onClick={handleStartAnomalyDetection}>
                                    <Play className="w-4 h-4 mr-2" />
                                    Démarrer la surveillance
                                </NeaButton>
                            ) : (
                                <NeaButton variant="destructive" onClick={handleStopAnomalyDetection}>
                                    <Square className="w-4 h-4 mr-2" />
                                    Arrêter la surveillance
                                </NeaButton>
                            )}
                            <NeaButton variant="secondary" onClick={handleManualAnomalyCheck}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Analyse manuelle
                            </NeaButton>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>

            {/* Report Generator Control */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)] bg-cyan-500/5">
                        <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-cyan-400" />
                            <div>
                                <h3 className="text-lg font-bold text-[var(--nea-text-title)]">
                                    Générateur Automatique de Rapports
                                </h3>
                                <p className="text-xs text-[var(--nea-text-secondary)]">
                                    Création de briefings d'intelligence enrichis par IA
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="mb-6">
                            <h4 className="font-semibold text-[var(--nea-text-primary)] mb-3">Génération de Rapport</h4>
                            <p className="text-sm text-[var(--nea-text-secondary)] mb-4">
                                L'IA analyse automatiquement les prédictions, signaux faibles, tendances et incidents pour créer
                                un briefing d'intelligence complet avec contexte externe (recherche web).
                            </p>
                            <div className="grid md:grid-cols-3 gap-3">
                                <NeaButton 
                                    onClick={() => handleGenerateReport('All')}
                                    disabled={isGeneratingReport}
                                    className="w-full"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Rapport Global
                                </NeaButton>
                                <NeaButton 
                                    variant="secondary"
                                    onClick={() => handleGenerateReport('Military')}
                                    disabled={isGeneratingReport}
                                    className="w-full"
                                >
                                    Militaire
                                </NeaButton>
                                <NeaButton 
                                    variant="secondary"
                                    onClick={() => handleGenerateReport('Finance')}
                                    disabled={isGeneratingReport}
                                    className="w-full"
                                >
                                    Finance
                                </NeaButton>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                            <h5 className="text-sm font-semibold text-blue-400 mb-2">💡 Contenu du Rapport</h5>
                            <ul className="text-xs text-[var(--nea-text-secondary)] space-y-1">
                                <li>• Résumé exécutif avec découvertes principales</li>
                                <li>• Actions recommandées avec timeframe</li>
                                <li>• Évaluation des risques (probabilité + impact)</li>
                                <li>• Timeline des développements attendus</li>
                                <li>• Focus géographique et contexte mondial</li>
                            </ul>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>

            {/* Alert Prioritization Control */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)] bg-blue-500/5">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-blue-400" />
                            <div>
                                <h3 className="text-lg font-bold text-[var(--nea-text-title)]">
                                    Priorisation Intelligente d'Alertes
                                </h3>
                                <p className="text-xs text-[var(--nea-text-secondary)]">
                                    Réévaluation contextuelle des incidents de sécurité et signaux faibles
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <h4 className="font-semibold text-[var(--nea-text-primary)] mb-2">Capacités d'Analyse</h4>
                                <ul className="space-y-2 text-sm text-[var(--nea-text-secondary)]">
                                    <li className="flex items-start gap-2">
                                        <Zap className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                        Réévaluation contextuelle des incidents de sécurité
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Zap className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                        Priorisation des signaux OSINT par pertinence stratégique
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Zap className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                        Analyse croisée : corrélation incidents ↔ signaux ↔ prédictions
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Zap className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                        Détection de menaces émergentes complexes
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-[var(--nea-text-primary)] mb-2">Actions Automatiques</h4>
                                <ul className="space-y-2 text-sm text-[var(--nea-text-secondary)]">
                                    <li>• Mise à jour des scores de sévérité</li>
                                    <li>• Recalcul des niveaux de priorité</li>
                                    <li>• Ajout de recommandations d'action</li>
                                    <li>• Création d'alertes critiques pour corrélations</li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {!prioritizationStatus.isRunning ? (
                                <NeaButton onClick={handleStartPrioritization}>
                                    <Play className="w-4 h-4 mr-2" />
                                    Activer la priorisation auto
                                </NeaButton>
                            ) : (
                                <NeaButton variant="destructive" onClick={handleStopPrioritization}>
                                    <Square className="w-4 h-4 mr-2" />
                                    Désactiver
                                </NeaButton>
                            )}
                            <NeaButton variant="secondary" onClick={handleManualPrioritization}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Prioriser maintenant
                            </NeaButton>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>
        </motion.div>
    );
}
