
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Play, Plus, X, TrendingUp, AlertTriangle } from 'lucide-react';
import NeaCard from '../ui/NeaCard';
import NeaButton from '../ui/NeaButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import whatIfAnalysisService from '../ai/WhatIfAnalysisService';

export default function WhatIfAnalyzer({ scenarioId, scenario, onBranchCreated }) {
    const [hypothesis, setHypothesis] = useState('');
    const [branchName, setBranchName] = useState('');
    const [modifications, setModifications] = useState([]);
    const [currentMod, setCurrentMod] = useState({
        field: '',
        currentValue: '',
        newValue: '',
        reason: ''
    });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleAddModification = () => {
        if (!currentMod.field || !currentMod.newValue) {
            toast.error('Champ et nouvelle valeur requis');
            return;
        }

        setModifications([...modifications, { ...currentMod }]);
        setCurrentMod({ field: '', currentValue: '', newValue: '', reason: '' });
    };

    const handleRemoveModification = (index) => {
        setModifications(modifications.filter((_, i) => i !== index));
    };

    const handleAnalyze = async () => {
        if (!hypothesis || modifications.length === 0) {
            toast.error('Hypothèse et au moins une modification requis');
            return;
        }

        setIsAnalyzing(true);
        toast.loading('Analyse What-If en cours...', { id: 'what-if' });

        try {
            const result = await whatIfAnalysisService.analyzeWhatIf(scenarioId, {
                hypothesis,
                branchName: branchName || `What-If-${Date.now()}`,
                modifications
            });

            toast.success('Branche What-If créée!', { id: 'what-if' });
            
            // Reset form
            setHypothesis('');
            setBranchName('');
            setModifications([]);
            
            if (onBranchCreated) {
                onBranchCreated(result.branch);
            }
        } catch (error) {
            toast.error('Erreur lors de l\'analyse', { id: 'what-if' });
            console.error(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleLoadSuggestions = async () => {
        setShowSuggestions(true);
        toast.loading('Génération de suggestions...', { id: 'suggestions' });

        try {
            const suggestedWhatIfs = await whatIfAnalysisService.suggestWhatIfs(scenarioId);
            setSuggestions(suggestedWhatIfs || []);
            toast.success(`${suggestedWhatIfs?.length || 0} suggestions générées`, { id: 'suggestions' });
        } catch (error) {
            console.error('Error loading suggestions:', error);
            toast.error('Erreur lors de la génération', { id: 'suggestions' });
            setSuggestions([]);
        }
    };

    const handleApplySuggestion = (suggestion) => {
        if (!suggestion) return;
        
        setHypothesis(suggestion.hypothesis || '');
        setBranchName(suggestion.title || '');
        
        const mods = (suggestion.key_modifications || []).map(mod => ({
            field: mod.field || '',
            currentValue: '',
            newValue: mod.suggested_value || '',
            reason: mod.reason || ''
        }));
        
        setModifications(mods);
        setShowSuggestions(false);
        toast.success('Suggestion appliquée');
    };

    return (
        <div className="space-y-4">
            <NeaCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Lightbulb className="w-6 h-6 text-yellow-400" />
                    <div>
                        <h3 className="font-bold text-[var(--nea-text-title)]">
                            Analyse What-If par IA
                        </h3>
                        <p className="text-xs text-[var(--nea-text-secondary)]">
                            Explorez des scénarios alternatifs basés sur vos modifications
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* AI Suggestions */}
                    <div>
                        <NeaButton
                            variant="secondary"
                            onClick={handleLoadSuggestions}
                            className="w-full"
                        >
                            <Lightbulb className="w-4 h-4 mr-2" />
                            Obtenir des Suggestions IA
                        </NeaButton>
                    </div>

                    {showSuggestions && suggestions.length > 0 && (
                        <div className="space-y-2">
                            {suggestions.map((suggestion, idx) => (
                                <div
                                    key={idx}
                                    className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 cursor-pointer hover:bg-purple-500/20 transition-colors"
                                    onClick={() => handleApplySuggestion(suggestion)}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h5 className="text-sm font-semibold text-purple-400">
                                            {suggestion.title}
                                        </h5>
                                        <Badge className="bg-purple-500/20 text-purple-400 border-0 text-xs">
                                            {suggestion.strategic_relevance}/10
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-[var(--nea-text-secondary)] mb-2">
                                        {suggestion.hypothesis}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs">
                                        <TrendingUp className="w-3 h-3 text-green-400" />
                                        <span className="text-[var(--nea-text-secondary)]">
                                            {suggestion.key_modifications.length} modification(s)
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Hypothesis */}
                    <div>
                        <label className="text-sm font-semibold text-[var(--nea-text-primary)] mb-2 block">
                            Hypothèse What-If
                        </label>
                        <Textarea
                            placeholder="Ex: Et si la Chine intervenait militairement dès la phase 2..."
                            value={hypothesis}
                            onChange={(e) => setHypothesis(e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Branch Name */}
                    <div>
                        <label className="text-sm font-semibold text-[var(--nea-text-primary)] mb-2 block">
                            Nom de la Branche
                        </label>
                        <Input
                            placeholder="Ex: Intervention Chine"
                            value={branchName}
                            onChange={(e) => setBranchName(e.target.value)}
                        />
                    </div>

                    {/* Modifications */}
                    <div>
                        <label className="text-sm font-semibold text-[var(--nea-text-primary)] mb-2 block">
                            Modifications à Appliquer
                        </label>
                        
                        <div className="space-y-2 mb-3">
                            {modifications.map((mod, idx) => (
                                <div key={idx} className="p-3 rounded-lg bg-[var(--nea-bg-surface)] border border-[var(--nea-border-subtle)]">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-[var(--nea-text-primary)]">
                                                {mod.field}
                                            </p>
                                            <p className="text-xs text-[var(--nea-text-secondary)]">
                                                <span className="text-red-400 line-through">{mod.currentValue || 'N/A'}</span>
                                                {' → '}
                                                <span className="text-green-400">{mod.newValue}</span>
                                            </p>
                                            {mod.reason && (
                                                <p className="text-xs text-[var(--nea-text-secondary)] mt-1 italic">
                                                    {mod.reason}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleRemoveModification(idx)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                placeholder="Champ (ex: key_actors[0].role)"
                                value={currentMod.field}
                                onChange={(e) => setCurrentMod({ ...currentMod, field: e.target.value })}
                            />
                            <Input
                                placeholder="Nouvelle valeur"
                                value={currentMod.newValue}
                                onChange={(e) => setCurrentMod({ ...currentMod, newValue: e.target.value })}
                            />
                            <Input
                                placeholder="Valeur actuelle (optionnel)"
                                value={currentMod.currentValue}
                                onChange={(e) => setCurrentMod({ ...currentMod, currentValue: e.target.value })}
                            />
                            <Input
                                placeholder="Raison (optionnel)"
                                value={currentMod.reason}
                                onChange={(e) => setCurrentMod({ ...currentMod, reason: e.target.value })}
                            />
                        </div>
                        <NeaButton
                            variant="secondary"
                            onClick={handleAddModification}
                            className="w-full mt-2"
                            size="sm"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter Modification
                        </NeaButton>
                    </div>

                    {/* Analyze Button */}
                    <NeaButton
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !hypothesis || modifications.length === 0}
                        className="w-full"
                    >
                        {isAnalyzing ? (
                            <>
                                <AlertTriangle className="w-4 h-4 mr-2 animate-spin" />
                                Analyse en cours...
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 mr-2" />
                                Lancer l'Analyse What-If
                            </>
                        )}
                    </NeaButton>

                    {isAnalyzing && (
                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                            <div className="space-y-2 text-xs text-[var(--nea-text-secondary)]">
                                <p className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                    Analyse de l'impact des modifications...
                                </p>
                                <p className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                    Calcul des effets en cascade...
                                </p>
                                <p className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                    Génération du scénario alternatif...
                                </p>
                                <p className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                    Création de la branche de version...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </NeaCard>
        </div>
    );
}
