
import { base44 } from '@/api/base44Client';
import collaborativeScenarioService from './CollaborativeScenarioService';

/**
 * SERVICE D'ANALYSE WHAT-IF PAR IA
 * Génère des branches alternatives basées sur des modifications utilisateur
 * Explore les conséquences de changements dans les paramètres du scénario
 */

class WhatIfAnalysisService {
    /**
     * Génère une analyse what-if complète
     */
    async analyzeWhatIf(scenarioId, whatIfParams) {
        console.log('[WhatIfAnalysis] Starting analysis...', whatIfParams);

        try {
            // 1. Récupérer le scénario de base
            const baseScenario = await base44.entities.Scenario.filter(
                { id: scenarioId },
                null,
                1
            );

            if (!baseScenario || baseScenario.length === 0) {
                throw new Error('Scénario introuvable');
            }

            const scenario = baseScenario[0];

            // 2. Analyser l'impact des changements avec l'IA
            const impactAnalysis = await this.analyzeImpact(scenario, whatIfParams);

            // 3. Générer le scénario alternatif
            const alternativeScenario = await this.generateAlternative(
                scenario,
                whatIfParams,
                impactAnalysis
            );

            // 4. Créer une branche de version
            const branch = await collaborativeScenarioService.createVersion(
                scenarioId,
                alternativeScenario,
                {
                    changeType: 'Branch',
                    isBranch: true,
                    branchName: whatIfParams.branchName || 'What-If Analysis',
                    branchHypothesis: whatIfParams.hypothesis,
                    changeSummary: `What-if: ${whatIfParams.hypothesis}`,
                    commitMessage: `Created what-if branch: ${whatIfParams.modifications.length} modifications`
                }
            );

            console.log('[WhatIfAnalysis] Branch created:', branch.id);
            return {
                branch,
                impactAnalysis,
                alternativeScenario
            };

        } catch (error) {
            console.error('[WhatIfAnalysis] Error:', error);
            throw error;
        }
    }

    /**
     * Analyse l'impact des modifications proposées
     */
    async analyzeImpact(baseScenario, whatIfParams) {
        const { modifications, hypothesis } = whatIfParams;

        const prompt = `Tu es un expert en analyse de scénarios stratégiques. Analyse l'impact de ces modifications sur le scénario.

## SCÉNARIO DE BASE
Titre: ${baseScenario.scenario_name}
Type: ${baseScenario.scenario_type}
Perspective: ${baseScenario.perspective}

Description: ${baseScenario.description}

Phases actuelles:
${baseScenario.metadata?.phases?.map(p => `Phase ${p.phase_number}: ${p.phase_name} - ${p.description}`).join('\n') || 'Non disponible'}

## HYPOTHÈSE WHAT-IF
${hypothesis}

## MODIFICATIONS PROPOSÉES
${modifications.map((mod, i) => `
${i+1}. Champ: ${mod.field}
   Valeur actuelle: ${mod.currentValue}
   Nouvelle valeur: ${mod.newValue}
   Raison: ${mod.reason || 'Non spécifié'}
`).join('\n')}

## MISSION
Analyse l'impact de ces modifications:

1. **Impact Direct**: Quels éléments du scénario sont directement affectés?
2. **Effets en Cascade**: Quelles conséquences secondaires et tertiaires?
3. **Changements de Timeline**: La chronologie est-elle affectée?
4. **Modification des Acteurs**: Les comportements des acteurs changent-ils?
5. **Nouveau Niveau de Risque**: Probabilité et impact changent-ils?
6. **Nouvelles Opportunités/Menaces**: Qu'est-ce qui émerge?

Sois détaillé et analytique.`;

        const analysis = await base44.integrations.Core.InvokeLLM({
            prompt,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    direct_impacts: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                affected_element: { type: "string" },
                                original_state: { type: "string" },
                                new_state: { type: "string" },
                                impact_severity: {
                                    type: "string",
                                    enum: ["Mineur", "Modéré", "Majeur", "Critique"]
                                }
                            }
                        }
                    },
                    cascade_effects: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                effect_description: { type: "string" },
                                affected_phase: { type: "number" },
                                delay_days: { type: "number" },
                                probability: { type: "number" }
                            }
                        }
                    },
                    timeline_changes: {
                        type: "object",
                        properties: {
                            phases_affected: { type: "array", items: { type: "number" } },
                            duration_change_days: { type: "number" },
                            critical_dates_shifted: { type: "boolean" },
                            new_tipping_points: { type: "array", items: { type: "string" } }
                        }
                    },
                    actor_behavior_changes: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                actor_name: { type: "string" },
                                original_strategy: { type: "string" },
                                new_strategy: { type: "string" },
                                motivation_shift: { type: "string" }
                            }
                        }
                    },
                    risk_recalculation: {
                        type: "object",
                        properties: {
                            original_probability: { type: "string" },
                            new_probability: { type: "string" },
                            original_impact: { type: "string" },
                            new_impact: { type: "string" },
                            risk_trend: {
                                type: "string",
                                enum: ["Increased", "Decreased", "Stable"]
                            },
                            justification: { type: "string" }
                        }
                    },
                    new_opportunities: { type: "array", items: { type: "string" } },
                    new_threats: { type: "array", items: { type: "string" } },
                    overall_assessment: { type: "string" },
                    recommended_next_modifications: {
                        type: "array",
                        items: { type: "string" }
                    }
                }
            }
        });

        return analysis;
    }

    /**
     * Génère le scénario alternatif basé sur les modifications
     */
    async generateAlternative(baseScenario, whatIfParams, impactAnalysis) {
        const { modifications } = whatIfParams;

        // Appliquer les modifications au scénario
        let modifiedScenario = { ...baseScenario };

        for (const mod of modifications) {
            if (mod.field.includes('.')) {
                // Champ imbriqué
                const parts = mod.field.split('.');
                let current = modifiedScenario;
                
                for (let i = 0; i < parts.length - 1; i++) {
                    if (!current[parts[i]]) current[parts[i]] = {};
                    current = current[parts[i]];
                }
                
                current[parts[parts.length - 1]] = mod.newValue;
            } else {
                modifiedScenario[mod.field] = mod.newValue;
            }
        }

        // Regénérer les phases avec l'IA si nécessaire
        if (impactAnalysis.timeline_changes?.critical_dates_shifted) {
            const newPhases = await this.regeneratePhases(
                modifiedScenario,
                impactAnalysis
            );
            
            if (modifiedScenario.metadata) {
                modifiedScenario.metadata.phases = newPhases;
            }
        }

        // Mettre à jour les acteurs si comportements changés
        if (impactAnalysis.actor_behavior_changes?.length > 0) {
            const updatedActors = await this.updateActorBehaviors(
                modifiedScenario.key_actors || [],
                impactAnalysis.actor_behavior_changes
            );
            modifiedScenario.key_actors = updatedActors;
        }

        // Mettre à jour l'évaluation des risques
        if (impactAnalysis.risk_recalculation) {
            modifiedScenario.risk_assessment = {
                ...modifiedScenario.risk_assessment,
                probability: impactAnalysis.risk_recalculation.new_probability,
                impact: impactAnalysis.risk_recalculation.new_impact
            };
        }

        // Ajouter les nouvelles opportunités/menaces dans metadata
        if (!modifiedScenario.metadata) modifiedScenario.metadata = {};
        modifiedScenario.metadata.what_if_analysis = {
            hypothesis: whatIfParams.hypothesis,
            modifications_applied: modifications,
            impact_analysis: impactAnalysis,
            generated_at: new Date().toISOString()
        };

        return modifiedScenario;
    }

    /**
     * Regénère les phases impactées
     */
    async regeneratePhases(scenario, impactAnalysis) {
        const prompt = `Regénère les phases de ce scénario en tenant compte de ces impacts.

SCÉNARIO: ${scenario.scenario_name}
TYPE: ${scenario.scenario_type}

PHASES ORIGINALES:
${scenario.metadata?.phases?.map(p => `Phase ${p.phase_number}: ${p.phase_name}\n${p.description}`).join('\n\n')}

IMPACTS À INTÉGRER:
${JSON.stringify(impactAnalysis.timeline_changes, null, 2)}
${JSON.stringify(impactAnalysis.cascade_effects, null, 2)}

Adapte les phases existantes pour refléter ces changements. Conserve la structure en 5 phases mais ajuste le contenu.`;

        const newPhases = await base44.integrations.Core.InvokeLLM({
            prompt,
            response_json_schema: {
                type: "object",
                properties: {
                    phases: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                phase_number: { type: "number" },
                                phase_name: { type: "string" },
                                day_range: { type: "string" },
                                description: { type: "string" },
                                key_events: { type: "array", items: { type: "string" } },
                                actors_actions: { type: "array", items: { type: "object" } },
                                cascade_effects: { type: "array", items: { type: "string" } },
                                impact_metrics: { type: "object" }
                            }
                        }
                    }
                }
            }
        });

        return newPhases.phases;
    }

    /**
     * Met à jour les comportements des acteurs
     */
    async updateActorBehaviors(originalActors, behaviorChanges) {
        const updatedActors = [...originalActors];

        for (const change of behaviorChanges) {
            const actorIndex = updatedActors.findIndex(a => 
                a.actor_name === change.actor_name
            );

            if (actorIndex !== -1) {
                updatedActors[actorIndex] = {
                    ...updatedActors[actorIndex],
                    motivations: change.motivation_shift,
                    role: change.new_strategy
                };
            }
        }

        return updatedActors;
    }

    /**
     * Génère des suggestions de what-if
     */
    async suggestWhatIfs(scenarioId) {
        const scenario = await base44.entities.Scenario.filter(
            { id: scenarioId },
            null,
            1
        );

        if (!scenario || scenario.length === 0) {
            throw new Error('Scénario introuvable');
        }

        const scenarioData = scenario[0];

        const prompt = `Analyse ce scénario et suggère 5 hypothèses "what-if" intéressantes à explorer.

SCÉNARIO: ${scenarioData.scenario_name}
TYPE: ${scenarioData.scenario_type}
DESCRIPTION: ${scenarioData.description}

ACTEURS: ${scenarioData.key_actors?.map(a => a.actor_name).join(', ') || 'N/A'}

PHASES: ${scenarioData.metadata?.phases?.length || 0} phases définies

Pour chaque hypothèse what-if, fournis:
1. Titre accrocheur
2. Description de l'hypothèse
3. Modification(s) clé(s) à appliquer
4. Impact attendu (probabilité et sévérité)
5. Pertinence stratégique (score 1-10)

Sois créatif et stratégiquement pertinent.`;

        const suggestions = await base44.integrations.Core.InvokeLLM({
            prompt,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    suggestions: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                hypothesis: { type: "string" },
                                key_modifications: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            field: { type: "string" },
                                            suggested_value: { type: "string" },
                                            reason: { type: "string" }
                                        }
                                    }
                                },
                                expected_impact: {
                                    type: "object",
                                    properties: {
                                        probability_shift: { type: "string" },
                                        severity_shift: { type: "string" },
                                        description: { type: "string" }
                                    }
                                },
                                strategic_relevance: { type: "number" }
                            }
                        }
                    }
                }
            }
        });

        return suggestions.suggestions || [];
    }

    /**
     * Compare plusieurs branches what-if
     */
    async compareBranches(scenarioId, branchIds) {
        const branches = await Promise.all(
            branchIds.map(id => 
                base44.entities.ScenarioVersion.filter({ id }, null, 1)
            )
        );

        const validBranches = branches
            .filter(b => b && b.length > 0)
            .map(b => b[0]);

        const prompt = `Compare ces différentes branches what-if du même scénario et fournis une analyse comparative.

BRANCHES À COMPARER:
${validBranches.map((branch, i) => `
Branche ${i+1}: ${branch.branch_name}
Hypothèse: ${branch.branch_hypothesis}
Changements: ${branch.change_summary}
`).join('\n')}

Fournis:
1. Tableau comparatif des issues
2. Avantages/inconvénients de chaque branche
3. Scénario le plus probable
4. Scénario le plus dangereux
5. Scénario avec meilleures opportunités
6. Recommandation stratégique`;

        const comparison = await base44.integrations.Core.InvokeLLM({
            prompt,
            response_json_schema: {
                type: "object",
                properties: {
                    comparative_table: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                branch_name: { type: "string" },
                                outcome: { type: "string" },
                                probability: { type: "number" },
                                risk_level: { type: "string" },
                                opportunities: { type: "number" },
                                threats: { type: "number" }
                            }
                        }
                    },
                    pros_cons: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                branch_name: { type: "string" },
                                pros: { type: "array", items: { type: "string" } },
                                cons: { type: "array", items: { type: "string" } }
                            }
                        }
                    },
                    most_likely: {
                        type: "object",
                        properties: {
                            branch_name: { type: "string" },
                            justification: { type: "string" }
                        }
                    },
                    most_dangerous: {
                        type: "object",
                        properties: {
                            branch_name: { type: "string" },
                            justification: { type: "string" }
                        }
                    },
                    best_opportunities: {
                        type: "object",
                        properties: {
                            branch_name: { type: "string" },
                            justification: { type: "string" }
                        }
                    },
                    strategic_recommendation: { type: "string" }
                }
            }
        });

        return comparison;
    }

    /**
     * Génère des micro-variations sur une branche
     */
    async generateMicroVariations(branchVersionId, focusArea) {
        const branch = await base44.entities.ScenarioVersion.filter(
            { id: branchVersionId },
            null,
            1
        );

        if (!branch || branch.length === 0) {
            throw new Error('Branche introuvable');
        }

        const prompt = `Génère 3 micro-variations de cette branche what-if en te concentrant sur: ${focusArea}

BRANCHE: ${branch[0].branch_name}
HYPOTHÈSE: ${branch[0].branch_hypothesis}

Pour chaque micro-variation:
- Un ajustement mineur mais significatif
- L'impact sur le déroulement
- La probabilité de cette variation
- L'intérêt stratégique

Focus: ${focusArea}`;

        const microVariations = await base44.integrations.Core.InvokeLLM({
            prompt,
            response_json_schema: {
                type: "object",
                properties: {
                    variations: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                variation_name: { type: "string" },
                                adjustment: { type: "string" },
                                impact: { type: "string" },
                                probability: { type: "number" },
                                strategic_interest: { type: "string" }
                            }
                        }
                    }
                }
            }
        });

        return microVariations.variations;
    }
}

// Singleton
const whatIfAnalysisService = new WhatIfAnalysisService();

export default whatIfAnalysisService;
