
import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertTriangle, CheckCircle, Package, Search, Download, Upload, Database, Loader2, XCircle, Info, Shield, GitCompare, History } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { toast } from 'sonner';
import ModuleHealthDiagnostic from '../components/modules/ModuleHealthDiagnostic';
import ModuleRecoveryLog from '../components/modules/ModuleRecoveryLog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Modules de référence du système NEA-AZEX
const REFERENCE_MODULES = [
    {
        name: "QUADRA-GEOPOLITIQUE",
        category: "GÉOPOLITIQUE",
        version: "2.1.3",
        description: "Module d'analyse géopolitique avancée avec détection des zones de tension et prévision des conflits potentiels.",
        status: "Active",
        priority: 1,
        dependencies: ["NEA-SUPERVISION"]
    },
    {
        name: "QUADRA-NUCLEAIRE",
        category: "NUCLÉAIRE",
        version: "3.0.1",
        description: "Surveillance des installations nucléaires mondiales, détection d'anomalies et évaluation des risques radiologiques.",
        status: "Active",
        priority: 1,
        dependencies: ["NEA-SUPERVISION"]
    },
    {
        name: "QUADRA-CLIMAT",
        category: "CLIMAT",
        version: "2.4.0",
        description: "Analyse climatique en temps réel avec prévisions d'événements météorologiques extrêmes et impacts environnementaux.",
        status: "Active",
        priority: 2,
        dependencies: []
    },
    {
        name: "QUADRA-BIOLOGIE",
        category: "BIOLOGIE",
        version: "2.0.5",
        description: "Surveillance épidémiologique mondiale, détection précoce de menaces biologiques et analyse de pandémies potentielles.",
        status: "Active",
        priority: 1,
        dependencies: ["NEA-SUPERVISION"]
    },
    {
        name: "NEA-CYBERNETIC",
        category: "CYBERNÉTIQUE",
        version: "4.2.0",
        description: "Détection et analyse des cybermenaces, surveillance des infrastructures critiques et réponse aux incidents de sécurité.",
        status: "Active",
        priority: 1,
        dependencies: ["NEA-SUPERVISION"]
    },
    {
        name: "NEA-SUPERVISION",
        category: "SUPERVISION",
        version: "1.8.2",
        description: "Module de supervision centrale coordonnant l'ensemble des systèmes NEA-AZEX et assurant la cohérence opérationnelle.",
        status: "Active",
        priority: 0,
        dependencies: []
    },
    {
        name: "AZEX-PREDICTION",
        category: "GÉOPOLITIQUE",
        version: "3.1.0",
        description: "Moteur de prédiction événementielle utilisant l'IA pour anticiper les développements géopolitiques majeurs.",
        status: "Active",
        priority: 2,
        dependencies: ["QUADRA-GEOPOLITIQUE"]
    },
    {
        name: "AZEX-CORRELATION",
        category: "SUPERVISION",
        version: "2.5.1",
        description: "Analyse de corrélation multi-domaines identifiant les liens cachés entre événements apparemment distincts.",
        status: "Active",
        priority: 2,
        dependencies: ["NEA-SUPERVISION"]
    },
    {
        name: "SENTINEL-OSINT",
        category: "CYBERNÉTIQUE",
        version: "2.3.0",
        description: "Collecte et analyse de renseignements open source (OSINT) pour l'intelligence stratégique.",
        status: "Active",
        priority: 3,
        dependencies: ["NEA-CYBERNETIC"]
    },
    {
        name: "NEXUS-INTEGRATION",
        category: "SUPERVISION",
        version: "1.5.0",
        description: "Module d'intégration des flux de données multi-sources pour l'analyse centralisée.",
        status: "Active",
        priority: 2,
        dependencies: ["NEA-SUPERVISION"]
    }
];

export default function ModuleRecoverySystem() {
    const [existingModules, setExistingModules] = useState([]);
    const [missingModules, setMissingModules] = useState([]);
    const [conflictingModules, setConflictingModules] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedModules, setSelectedModules] = useState(new Set());
    const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [recoveryLogs, setRecoveryLogs] = useState([]);
    const [showDiagnostic, setShowDiagnostic] = useState(false);
    const [activeTab, setActiveTab] = useState('missing');
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        analyzeModules();
    }, []);

    const compareVersions = (v1, v2) => {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const p1 = parts1[i] || 0;
            const p2 = parts2[i] || 0;
            if (p1 > p2) return 1;
            if (p1 < p2) return -1;
        }
        return 0;
    };

    const addRecoveryLog = (type, message) => {
        setRecoveryLogs(prev => [{
            type,
            message,
            timestamp: new Date().toISOString()
        }, ...prev]);
    };

    const analyzeModules = async () => {
        setIsAnalyzing(true);
        setAnalysisComplete(false);
        try {
            const modules = await base44.entities.Module.list();
            setExistingModules(modules);

            // Identifier les modules manquants
            const existingNames = new Set(modules.map(m => m.name));
            const missing = REFERENCE_MODULES.filter(ref => !existingNames.has(ref.name));
            setMissingModules(missing);

            // Identifier les conflits de version
            const conflicts = [];
            modules.forEach(existingMod => {
                const refMod = REFERENCE_MODULES.find(ref => ref.name === existingMod.name);
                if (refMod && refMod.version !== existingMod.version) {
                    conflicts.push({
                        module: existingMod,
                        currentVersion: existingMod.version,
                        referenceVersion: refMod.version,
                        needsUpdate: compareVersions(refMod.version, existingMod.version) > 0
                    });
                }
            });
            setConflictingModules(conflicts);

            addRecoveryLog('success', `Analyse terminée: ${missing.length} module(s) manquant(s), ${conflicts.length} conflit(s) de version détecté(s)`);
            toast.success(`Analyse terminée: ${missing.length} manquant(s), ${conflicts.length} conflit(s)`);
            setAnalysisComplete(true);
        } catch (error) {
            console.error("Erreur analyse modules:", error);
            addRecoveryLog('error', `Échec de l'analyse: ${error.message}`);
            toast.error("Échec de l'analyse des modules");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSelectModule = (moduleName) => {
        const newSelected = new Set(selectedModules);
        if (newSelected.has(moduleName)) {
            newSelected.delete(moduleName);
        } else {
            newSelected.add(moduleName);
        }
        setSelectedModules(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedModules.size === filteredMissing.length) {
            setSelectedModules(new Set());
        } else {
            setSelectedModules(new Set(filteredMissing.map(m => m.name)));
        }
    };

    const handleSelectByPriority = (priority) => {
        const priorityModules = filteredMissing.filter(m => m.priority === priority);
        setSelectedModules(new Set(priorityModules.map(m => m.name)));
        toast.info(`${priorityModules.length} module(s) priorité ${priority} sélectionné(s)`);
    };

    const checkDependencies = (moduleName) => {
        const module = REFERENCE_MODULES.find(m => m.name === moduleName);
        if (!module || !module.dependencies || module.dependencies.length === 0) return { satisfied: true, missing: [] };

        const existingNames = new Set(existingModules.map(m => m.name));
        const missingDeps = module.dependencies.filter(dep => !existingNames.has(dep) && !selectedModules.has(dep));
        
        return {
            satisfied: missingDeps.length === 0,
            missing: missingDeps
        };
    };

    const validateRestoration = () => {
        const warnings = [];
        
        // Sort selected modules by priority to potentially reveal dependencies more gracefully
        const modulesToCheck = [...selectedModules].map(name => REFERENCE_MODULES.find(m => m.name === name));
        
        modulesToCheck.sort((a, b) => a.priority - b.priority);

        for (const module of modulesToCheck) {
            const depCheck = checkDependencies(module.name);
            if (!depCheck.satisfied) {
                warnings.push(`${module.name} nécessite: ${depCheck.missing.join(', ')}`);
            }
        }
        return warnings;
    };

    const handleRestoreModules = async () => {
        if (selectedModules.size === 0) {
            toast.error("Aucun module sélectionné");
            return;
        }

        // Valider les dépendances
        const warnings = validateRestoration();
        if (warnings.length > 0) {
            const proceed = window.confirm(
                `Avertissements de dépendances:\n${warnings.join('\n')}\n\nContinuer quand même?`
            );
            if (!proceed) {
                addRecoveryLog('info', 'Restauration annulée par l\'utilisateur (dépendances non satisfaites).');
                return;
            }
        }

        setIsRestoring(true);
        setRestoreDialogOpen(false);
        addRecoveryLog('info', `Début de la restauration de ${selectedModules.size} module(s)`);

        let successCount = 0;
        let failCount = 0;

        try {
            // Trier par priorité (0 = plus haute priorité)
            const modulesToRestore = REFERENCE_MODULES
                .filter(m => selectedModules.has(m.name))
                .sort((a, b) => a.priority - b.priority);
            
            // Restaurer séquentiellement pour gérer les dépendances
            for (const module of modulesToRestore) {
                try {
                    await base44.entities.Module.create({
                        name: module.name,
                        category: module.category,
                        version: module.version,
                        description: module.description,
                        status: module.status,
                        last_audit: new Date().toISOString()
                    });
                    
                    addRecoveryLog('success', `✓ ${module.name} v${module.version} restauré avec succès`);
                    successCount++;
                    
                    // Pause pour éviter surcharge ou simuler un processus plus lent
                    await new Promise(resolve => setTimeout(resolve, 200)); 
                } catch (error) {
                    addRecoveryLog('error', `✗ Échec restauration ${module.name}: ${error.message}`);
                    failCount++;
                }
            }

            if (successCount > 0) {
                toast.success(`${successCount} module(s) restauré(s) avec succès`);
            }
            if (failCount > 0) {
                toast.error(`${failCount} échec(s) de restauration`);
            }

            setSelectedModules(new Set());
            await analyzeModules(); // Re-analyze after restoration
        } catch (error) {
            console.error("Erreur restauration modules:", error);
            addRecoveryLog('error', `Erreur globale lors de la restauration: ${error.message}`);
            toast.error("Échec de la restauration des modules");
        } finally {
            setIsRestoring(false);
        }
    };

    const handleUpdateVersion = async (conflict) => {
        try {
            addRecoveryLog('info', `Tentative de mise à jour de ${conflict.module.name} de v${conflict.currentVersion} vers v${conflict.referenceVersion}`);
            await base44.entities.Module.update(conflict.module.id, {
                version: conflict.referenceVersion,
                last_audit: new Date().toISOString()
            });
            addRecoveryLog('success', `✓ ${conflict.module.name} mis à jour vers v${conflict.referenceVersion} avec succès`);
            toast.success(`Module ${conflict.module.name} mis à jour`);
            await analyzeModules(); // Re-analyze after update
        } catch (error) {
            addRecoveryLog('error', `✗ Échec mise à jour ${conflict.module.name}: ${error.message}`);
            toast.error("Échec de la mise à jour");
        }
    };

    const filteredMissing = useMemo(() => {
        if (!searchTerm) return missingModules;
        const term = searchTerm.toLowerCase();
        return missingModules.filter(m =>
            m.name.toLowerCase().includes(term) ||
            m.description.toLowerCase().includes(term) ||
            m.category.toLowerCase().includes(term)
        ).sort((a, b) => a.priority - b.priority); // Sort by priority
    }, [missingModules, searchTerm]);

    const stats = useMemo(() => ({
        total: REFERENCE_MODULES.length,
        existing: existingModules.length,
        missing: missingModules.length,
        conflicts: conflictingModules.length,
        selected: selectedModules.size,
        criticalMissing: missingModules.filter(m => m.priority === 0 || m.priority === 1).length
    }), [existingModules, missingModules, conflictingModules, selectedModules]);

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[
                    { name: "Système" },
                    { name: "Récupération de Modules", href: "ModuleRecoverySystem" }
                ]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Package className="w-8 h-8 text-purple-400" />}
                    title="Système de Récupération Avancée"
                    subtitle="Analyse, diagnostic et réintégration intelligente des modules NEA-AZEX"
                    actions={
                        <div className="flex gap-2">
                            <NeaButton
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowDiagnostic(!showDiagnostic)}
                            >
                                <Shield className="w-4 h-4 mr-2" />
                                Diagnostic
                            </NeaButton>
                            <NeaButton
                                variant="outline"
                                size="sm"
                                onClick={analyzeModules}
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                )}
                                Réanalyser
                            </NeaButton>
                            {selectedModules.size > 0 && (
                                <NeaButton
                                    size="sm"
                                    onClick={() => setRestoreDialogOpen(true)}
                                    disabled={isRestoring}
                                >
                                    {isRestoring ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Download className="w-4 h-4 mr-2" />
                                    )}
                                    Restaurer ({selectedModules.size})
                                </NeaButton>
                            )}
                        </div>
                    }
                />
            </motion.div>

            {/* Statistics Cards */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-6 gap-4">
                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Database className="w-5 h-5 text-blue-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Référence</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">Total système</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Présents</p>
                    </div>
                    <p className="text-3xl font-bold text-green-400">{stats.existing}</p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">Dans la base</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Manquants</p>
                    </div>
                    <p className="text-3xl font-bold text-red-400">{stats.missing}</p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">À restaurer</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <GitCompare className="w-5 h-5 text-yellow-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Conflits</p>
                    </div>
                    <p className="text-3xl font-bold text-yellow-400">{stats.conflicts}</p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">Versions</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-orange-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Critiques</p>
                    </div>
                    <p className="text-3xl font-bold text-orange-400">{stats.criticalMissing}</p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">Priorité haute</p>
                </NeaCard>

                <NeaCard className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Package className="w-5 h-5 text-purple-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sélectionnés</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-400">{stats.selected}</p>
                    <p className="text-xs text-[var(--nea-text-secondary)] mt-1">Pour restauration</p>
                </NeaCard>
            </motion.div>

            {/* Diagnostic Panel */}
            {showDiagnostic && (
                <motion.div variants={itemVariants}>
                    <ModuleHealthDiagnostic 
                        modules={existingModules}
                        referenceModules={REFERENCE_MODULES}
                        missingModules={missingModules}
                        conflictingModules={conflictingModules}
                    />
                </motion.div>
            )}

            {/* Main Tabs */}
            <motion.div variants={itemVariants}>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="missing">
                            Modules Manquants ({missingModules.length})
                        </TabsTrigger>
                        <TabsTrigger value="conflicts">
                            Conflits de Version ({conflictingModules.length})
                        </TabsTrigger>
                        <TabsTrigger value="logs">
                            Journal de Récupération ({recoveryLogs.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Missing Modules Tab */}
                    <TabsContent value="missing" className="space-y-4 mt-6">
                        {/* Success Banner */}
                        {analysisComplete && missingModules.length === 0 && (
                            <NeaCard className="p-4 bg-green-500/10 border-green-500/30">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-400" />
                                    <div>
                                        <h3 className="font-bold text-green-400 mb-1">Système Complet</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Tous les modules de référence sont présents dans le système. Aucune restauration nécessaire.
                                        </p>
                                    </div>
                                </div>
                            </NeaCard>
                        )}

                        {/* Search and Actions */}
                        {missingModules.length > 0 && (
                            <NeaCard className="p-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--nea-text-secondary)]" />
                                            <Input
                                                placeholder="Rechercher un module manquant..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                        <NeaButton
                                            variant="outline"
                                            onClick={handleSelectAll}
                                        >
                                            {selectedModules.size === filteredMissing.length ? 'Désélectionner tout' : 'Tout Sélectionner'}
                                        </NeaButton>
                                    </div>
                                    
                                    {/* Priority Filters */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm text-[var(--nea-text-secondary)]">Sélection rapide:</span>
                                        <NeaButton size="sm" variant="outline" onClick={() => handleSelectByPriority(0)}>
                                            <Shield className="w-3 h-3 mr-1" />
                                            Critiques (P0)
                                        </NeaButton>
                                        <NeaButton size="sm" variant="outline" onClick={() => handleSelectByPriority(1)}>
                                            Haute priorité (P1)
                                        </NeaButton>
                                        <NeaButton size="sm" variant="outline" onClick={() => handleSelectByPriority(2)}>
                                            Moyenne (P2)
                                        </NeaButton>
                                    </div>
                                </div>
                            </NeaCard>
                        )}

                        {/* Missing Modules List */}
                        {filteredMissing.length > 0 ? (
                            <NeaCard>
                                <div className="p-4 border-b border-[var(--nea-border-default)] bg-red-500/5">
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="w-6 h-6 text-red-400" />
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">
                                                Modules Manquants ({filteredMissing.length})
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Ces modules font partie de la configuration de référence NEA-AZEX
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-3">
                                    <AnimatePresence mode="popLayout">
                                        {filteredMissing.map((module, index) => {
                                            const isSelected = selectedModules.has(module.name);
                                            const depCheck = checkDependencies(module.name);
                                            const priorityColors = {
                                                0: 'text-red-400 bg-red-500/20',
                                                1: 'text-orange-400 bg-orange-500/20',
                                                2: 'text-yellow-400 bg-yellow-500/20',
                                                3: 'text-blue-400 bg-blue-500/20'
                                            };
                                            
                                            return (
                                                <motion.div
                                                    key={module.name}
                                                    layout
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ delay: index * 0.03 }}
                                                    onClick={() => handleSelectModule(module.name)}
                                                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                                                        isSelected
                                                            ? 'border-purple-500 bg-purple-500/10'
                                                            : 'border-[var(--nea-border-default)] bg-[var(--nea-bg-surface-hover)] hover:border-purple-500/50'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                                <h4 className="font-bold text-[var(--nea-text-title)]">
                                                                    {module.name}
                                                                </h4>
                                                                <Badge className="bg-red-500/20 text-red-400 border-0 text-xs">
                                                                    MANQUANT
                                                                </Badge>
                                                                <Badge className={`${priorityColors[module.priority]} border-0 text-xs`}>
                                                                    P{module.priority}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                                {module.description}
                                                            </p>
                                                            <div className="flex items-center gap-3 flex-wrap">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {module.category}
                                                                </Badge>
                                                                <Badge variant="outline" className="text-xs">
                                                                    v{module.version}
                                                                </Badge>
                                                                <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                                                                    {module.status}
                                                                </Badge>
                                                                {module.dependencies && module.dependencies.length > 0 && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {module.dependencies.length} dépendance(s)
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Dependency Warning */}
                                                            {!depCheck.satisfied && (
                                                                <div className="mt-3 p-2 rounded bg-yellow-500/10 border border-yellow-500/30">
                                                                    <p className="text-xs text-yellow-400 flex items-center gap-2">
                                                                        <AlertTriangle className="w-3 h-3" />
                                                                        Nécessite: {depCheck.missing.join(', ')}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            {isSelected ? (
                                                                <CheckCircle className="w-6 h-6 text-purple-400" />
                                                            ) : (
                                                                <XCircle className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>
                            </NeaCard>
                        ) : searchTerm && (
                            <NeaCard className="p-12 text-center">
                                <Search className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Aucun résultat
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Aucun module manquant ne correspond à votre recherche
                                </p>
                            </NeaCard>
                        )}
                    </TabsContent>

                    {/* Conflicts Tab */}
                    <TabsContent value="conflicts" className="space-y-4 mt-6">
                        {conflictingModules.length > 0 ? (
                            <NeaCard>
                                <div className="p-4 border-b border-[var(--nea-border-default)] bg-yellow-500/5">
                                    <div className="flex items-center gap-3">
                                        <GitCompare className="w-6 h-6 text-yellow-400" />
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">
                                                Conflits de Version ({conflictingModules.length})
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Ces modules ont une version différente de la référence
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-3">
                                    {conflictingModules.map((conflict, index) => (
                                        <motion.div
                                            key={conflict.module.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="p-4 rounded-lg border-2 border-yellow-500/30 bg-yellow-500/5"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-[var(--nea-text-title)] mb-2">
                                                        {conflict.module.name}
                                                    </h4>
                                                    <div className="flex items-center gap-4 mb-3">
                                                        <div>
                                                            <p className="text-xs text-[var(--nea-text-secondary)]">Version Actuelle</p>
                                                            <Badge variant="outline" className="text-xs mt-1">
                                                                v{conflict.currentVersion}
                                                            </Badge>
                                                        </div>
                                                        <GitCompare className="w-4 h-4 text-yellow-400" />
                                                        <div>
                                                            <p className="text-xs text-[var(--nea-text-secondary)]">Version Référence</p>
                                                            <Badge className="bg-green-500/20 text-green-400 border-0 text-xs mt-1">
                                                                v{conflict.referenceVersion}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    {conflict.needsUpdate && (
                                                        <p className="text-xs text-yellow-400">
                                                            ⚠ Mise à jour disponible
                                                        </p>
                                                    )}
                                                </div>
                                                <NeaButton
                                                    size="sm"
                                                    onClick={() => handleUpdateVersion(conflict)}
                                                    disabled={!conflict.needsUpdate}
                                                >
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Mettre à jour
                                                </NeaButton>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </NeaCard>
                        ) : (
                            <NeaCard className="p-12 text-center">
                                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Aucun conflit détecté
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Toutes les versions correspondent à la référence
                                </p>
                            </NeaCard>
                        )}
                    </TabsContent>

                    {/* Logs Tab */}
                    <TabsContent value="logs" className="mt-6">
                        <ModuleRecoveryLog logs={recoveryLogs} />
                    </TabsContent>
                </Tabs>
            </motion.div>

            {/* Existing Modules Summary */}
            {existingModules.length > 0 && (
                <motion.div variants={itemVariants}>
                    <NeaCard>
                        <div className="p-4 border-b border-[var(--nea-border-default)]">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-green-400" />
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">
                                        Modules Présents ({existingModules.length})
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Ces modules sont actuellement dans la base de données
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {existingModules.map((module, index) => (
                                    <motion.div
                                        key={module.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.02 }}
                                        className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)]"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                            <h4 className="font-semibold text-sm text-[var(--nea-text-title)] truncate">
                                                {module.name}
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                {module.category}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                v{module.version}
                                            </Badge>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </NeaCard>
                </motion.div>
            )}

            {/* Restore Confirmation Dialog */}
            <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
                <AlertDialogContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                            <Info className="w-5 h-5 text-purple-400" />
                            Confirmer la Restauration Intelligente
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                            <div className="space-y-3">
                                <p>
                                    Vous allez restaurer <strong className="text-purple-400">{selectedModules.size}</strong> module(s) dans le système NEA-AZEX.
                                </p>
                                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                                    <p className="text-sm font-semibold text-blue-400 mb-2">Processus de restauration:</p>
                                    <ul className="text-xs space-y-1">
                                        <li>✓ Tri par priorité et dépendances</li>
                                        <li>✓ Validation de l'intégrité</li>
                                        <li>✓ Installation séquentielle</li>
                                        <li>✓ Vérification post-installation</li>
                                    </ul>
                                </div>
                                <p className="text-xs">
                                    Les modules seront créés avec leur configuration de référence et seront immédiatement opérationnels.
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-[var(--nea-bg-surface-hover)] text-gray-900 dark:text-white">
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRestoreModules}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Restaurer les Modules
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
}
