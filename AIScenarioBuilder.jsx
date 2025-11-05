import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Play, Settings, Layers, Users, TrendingUp, Globe, Zap, AlertTriangle, Calendar } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue 
} from '@/components/ui/select';
import { useStaggerAnimation } from '../components/navigation/PageTransition';
import { toast } from 'sonner';
import scenarioGenerationService from '../components/ai/ScenarioGenerationService';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AIScenarioBuilder() {
    const { containerVariants, itemVariants } = useStaggerAnimation();
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);

    const [params, setParams] = useState({
        scenarioName: '',
        perspective: 'Multi-angle',
        duration: 90,
        detailLevel: 'Détaillé',
        startDate: new Date().toISOString().split('T')[0],
        
        // Facteurs configurables
        geopoliticalFactors: [],
        economicFactors: [],
        technologicalFactors: [],
        environmentalFactors: [],
        customFactors: [],
        
        // Paramètres avancés
        regions: [],
        sectors: [],
        includeVariants: true,
        includeCascadeAnalysis: true,
        includeMonitoringIndicators: true
    });

    const [currentInputs, setCurrentInputs] = useState({
        geopolitical: '',
        economic: '',
        technological: '',
        environmental: '',
        custom: '',
        region: '',
        sector: ''
    });

    const handleAddFactor = (type) => {
        const value = currentInputs[type]?.trim();
        if (!value) return;

        const key = `${type}Factors`;
        if (type === 'region' || type === 'sector') {
            const arrayKey = type === 'region' ? 'regions' : 'sectors';
            setParams(prev => ({
                ...prev,
                [arrayKey]: [...prev[arrayKey], value]
            }));
        } else {
            setParams(prev => ({
                ...prev,
                [key]: [...prev[key], value]
            }));
        }
        
        setCurrentInputs(prev => ({ ...prev, [type]: '' }));
    };

    const handleRemoveFactor = (type, index) => {
        const key = type === 'region' || type === 'sector' 
            ? (type === 'region' ? 'regions' : 'sectors')
            : `${type}Factors`;
            
        setParams(prev => ({
            ...prev,
            [key]: prev[key].filter((_, i) => i !== index)
        }));
    };

    const handleGenerate = async () => {
        if (!params.scenarioName) {
            toast.error('Le nom du scénario est requis');
            return;
        }

        setIsGenerating(true);
        toast.loading('Génération du scénario complexe en cours...', { id: 'scenario-gen' });

        try {
            const scenario = await scenarioGenerationService.generateComplexScenario(params);
            toast.success(`Scénario généré avec succès! ID: ${scenario.id}`, { id: 'scenario-gen' });
            
            // Rediriger vers ScenarioGenerator pour voir le résultat
            setTimeout(() => {
                navigate(createPageUrl('ScenarioGenerator'));
            }, 1500);
        } catch (error) {
            console.error('[AIScenarioBuilder] Error:', error);
            toast.error('Erreur lors de la génération du scénario', { id: 'scenario-gen' });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleQuickScenario = async (topic) => {
        setIsGenerating(true);
        toast.loading(`Génération scénario rapide: ${topic}...`, { id: 'quick-scenario' });

        try {
            const scenario = await scenarioGenerationService.generateQuickScenario(topic, 30);
            toast.success(`Scénario "${topic}" généré!`, { id: 'quick-scenario' });
            setTimeout(() => {
                navigate(createPageUrl('ScenarioGenerator'));
            }, 1500);
        } catch (error) {
            toast.error('Erreur lors de la génération', { id: 'quick-scenario' });
        } finally {
            setIsGenerating(false);
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
                    { name: "Générateur de Scénarios IA", href: "AIScenarioBuilder" }
                ]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<BrainCircuit className="w-8 h-8 text-purple-400" />}
                    title="Générateur de Scénarios IA"
                    subtitle="Construction de simulations complexes multi-étapes avec analyse prédictive"
                />
            </motion.div>

            {/* Quick Scenarios */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)] bg-cyan-500/5">
                        <h3 className="font-bold text-[var(--nea-text-title)] flex items-center gap-2">
                            <Zap className="w-5 h-5 text-cyan-400" />
                            Scénarios Rapides
                        </h3>
                        <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                            Génération instantanée basée sur les tendances actuelles
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-3 gap-3">
                            <NeaButton 
                                variant="secondary" 
                                onClick={() => handleQuickScenario('Conflit Iran-Israël')}
                                disabled={isGenerating}
                                className="w-full"
                            >
                                Conflit Moyen-Orient
                            </NeaButton>
                            <NeaButton 
                                variant="secondary"
                                onClick={() => handleQuickScenario('Crise énergétique Europe')}
                                disabled={isGenerating}
                                className="w-full"
                            >
                                Crise Énergétique
                            </NeaButton>
                            <NeaButton 
                                variant="secondary"
                                onClick={() => handleQuickScenario('Cyberattaque infrastructure')}
                                disabled={isGenerating}
                                className="w-full"
                            >
                                Cyberattaque Majeure
                            </NeaButton>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>

            {/* Configuration Form */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)] bg-purple-500/5">
                        <h3 className="font-bold text-[var(--nea-text-title)] flex items-center gap-2">
                            <Settings className="w-5 h-5 text-purple-400" />
                            Configuration du Scénario
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-[var(--nea-text-primary)] mb-2 block">
                                    Nom du Scénario *
                                </label>
                                <Input
                                    placeholder="Ex: Escalade nucléaire Asie 2025"
                                    value={params.scenarioName}
                                    onChange={(e) => setParams(prev => ({ ...prev, scenarioName: e.target.value }))}
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-[var(--nea-text-primary)] mb-2 block">
                                        Perspective
                                    </label>
                                    <Select
                                        value={params.perspective}
                                        onValueChange={(val) => setParams(prev => ({ ...prev, perspective: val }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Militaire">Militaire</SelectItem>
                                            <SelectItem value="Civile">Civile</SelectItem>
                                            <SelectItem value="Diplomatique">Diplomatique</SelectItem>
                                            <SelectItem value="Humanitaire">Humanitaire</SelectItem>
                                            <SelectItem value="Économique">Économique</SelectItem>
                                            <SelectItem value="Multi-angle">Multi-angle</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-[var(--nea-text-primary)] mb-2 block">
                                        Durée (jours)
                                    </label>
                                    <Input
                                        type="number"
                                        min="7"
                                        max="365"
                                        value={params.duration}
                                        onChange={(e) => setParams(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-[var(--nea-text-primary)] mb-2 block">
                                        Niveau de Détail
                                    </label>
                                    <Select
                                        value={params.detailLevel}
                                        onValueChange={(val) => setParams(prev => ({ ...prev, detailLevel: val }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Basique">Basique</SelectItem>
                                            <SelectItem value="Détaillé">Détaillé</SelectItem>
                                            <SelectItem value="Exhaustif">Exhaustif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Geopolitical Factors */}
                        <div>
                            <label className="text-sm font-semibold text-[var(--nea-text-primary)] mb-2 flex items-center gap-2">
                                <Globe className="w-4 h-4 text-blue-400" />
                                Facteurs Géopolitiques
                            </label>
                            <div className="flex gap-2 mb-2">
                                <Input
                                    placeholder="Ex: Tensions USA-Chine, Conflit Ukraine..."
                                    value={currentInputs.geopolitical}
                                    onChange={(e) => setCurrentInputs(prev => ({ ...prev, geopolitical: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddFactor('geopolitical')}
                                />
                                <NeaButton onClick={() => handleAddFactor('geopolitical')}>Ajouter</NeaButton>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {params.geopoliticalFactors.map((factor, idx) => (
                                    <Badge 
                                        key={idx}
                                        className="bg-blue-500/20 text-blue-400 border-0 cursor-pointer hover:bg-blue-500/30"
                                        onClick={() => handleRemoveFactor('geopolitical', idx)}
                                    >
                                        {factor} ×
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Economic Factors */}
                        <div>
                            <label className="text-sm font-semibold text-[var(--nea-text-primary)] mb-2 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-400" />
                                Facteurs Économiques
                            </label>
                            <div className="flex gap-2 mb-2">
                                <Input
                                    placeholder="Ex: Récession, Inflation, Rupture supply chain..."
                                    value={currentInputs.economic}
                                    onChange={(e) => setCurrentInputs(prev => ({ ...prev, economic: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddFactor('economic')}
                                />
                                <NeaButton onClick={() => handleAddFactor('economic')}>Ajouter</NeaButton>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {params.economicFactors.map((factor, idx) => (
                                    <Badge 
                                        key={idx}
                                        className="bg-green-500/20 text-green-400 border-0 cursor-pointer hover:bg-green-500/30"
                                        onClick={() => handleRemoveFactor('economic', idx)}
                                    >
                                        {factor} ×
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Technological Factors */}
                        <div>
                            <label className="text-sm font-semibold text-[var(--nea-text-primary)] mb-2 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-purple-400" />
                                Facteurs Technologiques
                            </label>
                            <div className="flex gap-2 mb-2">
                                <Input
                                    placeholder="Ex: IA générative, Quantum computing, 5G..."
                                    value={currentInputs.technological}
                                    onChange={(e) => setCurrentInputs(prev => ({ ...prev, technological: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddFactor('technological')}
                                />
                                <NeaButton onClick={() => handleAddFactor('technological')}>Ajouter</NeaButton>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {params.technologicalFactors.map((factor, idx) => (
                                    <Badge 
                                        key={idx}
                                        className="bg-purple-500/20 text-purple-400 border-0 cursor-pointer hover:bg-purple-500/30"
                                        onClick={() => handleRemoveFactor('technological', idx)}
                                    >
                                        {factor} ×
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Environmental Factors */}
                        <div>
                            <label className="text-sm font-semibold text-[var(--nea-text-primary)] mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                Facteurs Environnementaux
                            </label>
                            <div className="flex gap-2 mb-2">
                                <Input
                                    placeholder="Ex: Changement climatique, Sécheresse, Catastrophes..."
                                    value={currentInputs.environmental}
                                    onChange={(e) => setCurrentInputs(prev => ({ ...prev, environmental: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddFactor('environmental')}
                                />
                                <NeaButton onClick={() => handleAddFactor('environmental')}>Ajouter</NeaButton>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {params.environmentalFactors.map((factor, idx) => (
                                    <Badge 
                                        key={idx}
                                        className="bg-yellow-500/20 text-yellow-400 border-0 cursor-pointer hover:bg-yellow-500/30"
                                        onClick={() => handleRemoveFactor('environmental', idx)}
                                    >
                                        {factor} ×
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Custom Factors */}
                        <div>
                            <label className="text-sm font-semibold text-[var(--nea-text-primary)] mb-2 flex items-center gap-2">
                                <Layers className="w-4 h-4 text-cyan-400" />
                                Facteurs Personnalisés
                            </label>
                            <div className="flex gap-2 mb-2">
                                <Input
                                    placeholder="Ex: Élections présidentielles, Pandémie, Innovation..."
                                    value={currentInputs.custom}
                                    onChange={(e) => setCurrentInputs(prev => ({ ...prev, custom: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddFactor('custom')}
                                />
                                <NeaButton onClick={() => handleAddFactor('custom')}>Ajouter</NeaButton>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {params.customFactors.map((factor, idx) => (
                                    <Badge 
                                        key={idx}
                                        className="bg-cyan-500/20 text-cyan-400 border-0 cursor-pointer hover:bg-cyan-500/30"
                                        onClick={() => handleRemoveFactor('custom', idx)}
                                    >
                                        {factor} ×
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Geographic & Sectoral Focus */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-[var(--nea-text-primary)] mb-2 block">
                                    Régions Géographiques
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <Input
                                        placeholder="Ex: Moyen-Orient, Europe, Asie..."
                                        value={currentInputs.region}
                                        onChange={(e) => setCurrentInputs(prev => ({ ...prev, region: e.target.value }))}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddFactor('region')}
                                    />
                                    <NeaButton onClick={() => handleAddFactor('region')}>+</NeaButton>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {params.regions.map((region, idx) => (
                                        <Badge 
                                            key={idx}
                                            variant="outline"
                                            className="cursor-pointer"
                                            onClick={() => handleRemoveFactor('region', idx)}
                                        >
                                            {region} ×
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-[var(--nea-text-primary)] mb-2 block">
                                    Secteurs Concernés
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <Input
                                        placeholder="Ex: Défense, Énergie, Santé..."
                                        value={currentInputs.sector}
                                        onChange={(e) => setCurrentInputs(prev => ({ ...prev, sector: e.target.value }))}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddFactor('sector')}
                                    />
                                    <NeaButton onClick={() => handleAddFactor('sector')}>+</NeaButton>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {params.sectors.map((sector, idx) => (
                                        <Badge 
                                            key={idx}
                                            variant="outline"
                                            className="cursor-pointer"
                                            onClick={() => handleRemoveFactor('sector', idx)}
                                        >
                                            {sector} ×
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>

            {/* AI Capabilities */}
            <motion.div variants={itemVariants}>
                <NeaCard className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
                    <h4 className="font-semibold text-[var(--nea-text-title)] mb-4 flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-purple-400" />
                        Capacités IA du Générateur
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h5 className="text-sm font-semibold text-[var(--nea-text-primary)] mb-2">
                                Analyse Contextuelle
                            </h5>
                            <ul className="text-xs text-[var(--nea-text-secondary)] space-y-1">
                                <li>✓ Recherche web temps réel (actualités, géopolitique)</li>
                                <li>✓ Analyse prédictions système (EventPrediction)</li>
                                <li>✓ Intégration signaux OSINT (MediaSignal)</li>
                                <li>✓ Corrélation tendances (TrendAnalysis)</li>
                                <li>✓ Incidents sécurité (SecurityIncident)</li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-sm font-semibold text-[var(--nea-text-primary)] mb-2">
                                Génération Avancée
                            </h5>
                            <ul className="text-xs text-[var(--nea-text-secondary)] space-y-1">
                                <li>✓ Scénario en 5 phases chronologiques</li>
                                <li>✓ Acteurs clés avec motivations et capacités</li>
                                <li>✓ Effets en cascade multi-domaines</li>
                                <li>✓ Points de décision critiques</li>
                                <li>✓ 3 variantes alternatives (optimiste/pessimiste/surprise)</li>
                                <li>✓ Indicateurs de surveillance temps réel</li>
                            </ul>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>

            {/* Generate Button */}
            <motion.div variants={itemVariants}>
                <NeaCard className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-semibold text-[var(--nea-text-title)] mb-1">
                                Prêt à Générer
                            </h4>
                            <p className="text-sm text-[var(--nea-text-secondary)]">
                                Durée estimée: 30-60 secondes • Enrichissement IA + Recherche Web
                            </p>
                        </div>
                        <NeaButton
                            onClick={handleGenerate}
                            disabled={isGenerating || !params.scenarioName}
                            size="lg"
                        >
                            {isGenerating ? (
                                <>
                                    <Layers className="w-5 h-5 mr-2 animate-spin" />
                                    Génération en cours...
                                </>
                            ) : (
                                <>
                                    <Play className="w-5 h-5 mr-2" />
                                    Générer le Scénario
                                </>
                            )}
                        </NeaButton>
                    </div>

                    {isGenerating && (
                        <div className="mt-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                            <div className="space-y-2 text-xs text-[var(--nea-text-secondary)]">
                                <p className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                    Collecte des données système...
                                </p>
                                <p className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                    Recherche contexte mondial actuel...
                                </p>
                                <p className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                    Analyse du paysage des menaces...
                                </p>
                                <p className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                    Construction du scénario multi-phases...
                                </p>
                                <p className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                    Génération des effets en cascade...
                                </p>
                            </div>
                        </div>
                    )}
                </NeaCard>
            </motion.div>

            {/* Example Output Structure */}
            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)] bg-cyan-500/5">
                        <h3 className="font-bold text-[var(--nea-text-title)] flex items-center gap-2">
                            <Layers className="w-5 h-5 text-cyan-400" />
                            Structure du Scénario Généré
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                                <h5 className="text-sm font-semibold text-blue-400 mb-2">📋 Narratif Principal</h5>
                                <ul className="text-xs text-[var(--nea-text-secondary)] space-y-1">
                                    <li>• 5 phases chronologiques</li>
                                    <li>• Événements détaillés par phase</li>
                                    <li>• Actions des acteurs</li>
                                    <li>• Métriques d'impact</li>
                                </ul>
                            </div>

                            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                                <h5 className="text-sm font-semibold text-purple-400 mb-2">👥 Acteurs & Décisions</h5>
                                <ul className="text-xs text-[var(--nea-text-secondary)] space-y-1">
                                    <li>• Profils détaillés acteurs clés</li>
                                    <li>• Objectifs et motivations</li>
                                    <li>• Points de décision critiques</li>
                                    <li>• Alternatives et conséquences</li>
                                </ul>
                            </div>

                            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                                <h5 className="text-sm font-semibold text-green-400 mb-2">🔄 Effets en Cascade</h5>
                                <ul className="text-xs text-[var(--nea-text-secondary)] space-y-1">
                                    <li>• Chaînes d'effets domino</li>
                                    <li>• Propagation inter-domaines</li>
                                    <li>• Points de bascule (tipping points)</li>
                                    <li>• Options de mitigation</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-4 p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                            <h5 className="text-sm font-semibold text-orange-400 mb-2">🎯 Bonus: Variantes & Surveillance</h5>
                            <div className="grid md:grid-cols-2 gap-4 text-xs text-[var(--nea-text-secondary)]">
                                <ul className="space-y-1">
                                    <li>• 3 variantes alternatives (optimiste/pessimiste/surprise)</li>
                                    <li>• Analyse comparative des issues</li>
                                    <li>• Probabilités relatives</li>
                                </ul>
                                <ul className="space-y-1">
                                    <li>• Indicateurs de surveillance temps réel</li>
                                    <li>• Seuils d'alerte configurables</li>
                                    <li>• Sources de données recommandées</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>
        </motion.div>
    );
}