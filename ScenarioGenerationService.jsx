import { base44 } from '@/api/base44Client';

/**
 * SERVICE DE GÉNÉRATION DE SCÉNARIOS PAR IA
 * Crée des simulations complexes multi-étapes basées sur:
 * - Tendances mondiales actuelles (recherche web)
 * - Menaces identifiées par l'IA (analyse système)
 * - Paramètres utilisateur personnalisés
 * 
 * Génère des narratifs détaillés avec acteurs, événements et effets en cascade
 */

class ScenarioGenerationService {
    /**
     * Génère un scénario complexe complet
     */
    async generateComplexScenario(userParams) {
        console.log('[ScenarioGenerator] Starting complex scenario generation...', userParams);

        try {
            // 1. Collecter les données système et externes
            const contextData = await this.gatherContextData(userParams);

            // 2. Analyser les menaces avec l'IA
            const threatAnalysis = await this.analyzeThreatLandscape(contextData, userParams);

            // 3. Construire le scénario multi-étapes
            const scenario = await this.buildMultiStageScenario(threatAnalysis, userParams, contextData);

            // 4. Générer les effets en cascade
            const cascadeEffects = await this.generateCascadeEffects(scenario, userParams);

            // 5. Créer l'entité Scenario complète
            const finalScenario = await this.createScenarioEntity(scenario, cascadeEffects, userParams);

            console.log('[ScenarioGenerator] Scenario created:', finalScenario.id);
            return finalScenario;

        } catch (error) {
            console.error('[ScenarioGenerator] Error:', error);
            throw error;
        }
    }

    /**
     * Collecte les données contextuelles (système + web)
     */
    async gatherContextData(userParams) {
        const { regions = [], sectors = [], timeframe = '30d' } = userParams;

        // Collecter données système
        const [predictions, signals, trends, incidents] = await Promise.all([
            base44.entities.EventPrediction.list('-probability_score', 50),
            base44.entities.MediaSignal.list('-detection_timestamp', 100),
            base44.entities.TrendAnalysis.list('-momentum_score', 50),
            base44.entities.SecurityIncident.list('-detected_timestamp', 50)
        ]);

        // Recherche web pour contexte actuel
        const webContext = await base44.integrations.Core.InvokeLLM({
            prompt: `Fournis un résumé détaillé de la situation mondiale actuelle concernant:

Régions: ${regions.join(', ') || 'Global'}
Secteurs: ${sectors.join(', ') || 'Tous secteurs'}

Inclus:
1. Tensions géopolitiques actuelles
2. Développements économiques majeurs
3. Avancées technologiques récentes
4. Menaces émergentes (sécurité, climat, santé)
5. Tendances sociales et politiques
6. Incidents significatifs récents

Fournis des données factuelles et à jour.`,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    geopolitical_tensions: { type: "array", items: { type: "string" } },
                    economic_developments: { type: "array", items: { type: "string" } },
                    technological_advances: { type: "array", items: { type: "string" } },
                    emerging_threats: { type: "array", items: { type: "string" } },
                    social_trends: { type: "array", items: { type: "string" } },
                    recent_incidents: { type: "array", items: { type: "string" } },
                    summary: { type: "string" }
                }
            }
        });

        return {
            systemData: { predictions, signals, trends, incidents },
            webContext,
            userParams
        };
    }

    /**
     * Analyse le paysage des menaces avec l'IA
     */
    async analyzeThreatLandscape(contextData, userParams) {
        const { systemData, webContext } = contextData;
        const { 
            geopoliticalFactors = [],
            economicFactors = [],
            technologicalFactors = [],
            environmentalFactors = [],
            customFactors = []
        } = userParams;

        const prompt = `Tu es un expert en prospective stratégique. Analyse ce contexte et identifie les menaces potentielles pour construire un scénario complexe.

## DONNÉES SYSTÈME
- ${systemData.predictions.length} prédictions d'événements
- ${systemData.signals.length} signaux faibles OSINT
- ${systemData.trends.length} tendances analysées
- ${systemData.incidents.length} incidents de sécurité

Top prédictions:
${systemData.predictions.slice(0, 10).map(p => `- ${p.event_name} (${p.event_type}): ${p.probability_score}%`).join('\n')}

Top signaux:
${systemData.signals.slice(0, 10).map(s => `- ${s.signal_title} (${s.signal_type})`).join('\n')}

Tendances majeures:
${systemData.trends.slice(0, 10).map(t => `- ${t.trend_name} (${t.domain}): momentum ${t.momentum_score}`).join('\n')}

## CONTEXTE MONDIAL ACTUEL
${webContext.summary}

Tensions géopolitiques: ${webContext.geopolitical_tensions.join(', ')}
Développements économiques: ${webContext.economic_developments.join(', ')}
Menaces émergentes: ${webContext.emerging_threats.join(', ')}

## PARAMÈTRES UTILISATEUR
Facteurs géopolitiques: ${geopoliticalFactors.join(', ') || 'Non spécifié'}
Facteurs économiques: ${economicFactors.join(', ') || 'Non spécifié'}
Facteurs technologiques: ${technologicalFactors.join(', ') || 'Non spécifié'}
Facteurs environnementaux: ${environmentalFactors.join(', ') || 'Non spécifié'}
Facteurs personnalisés: ${customFactors.join(', ') || 'Non spécifié'}

## MISSION
Identifie les menaces principales et leurs interconnexions pour construire un scénario crédible et complexe.`;

        const analysis = await base44.integrations.Core.InvokeLLM({
            prompt,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    primary_threats: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                threat_name: { type: "string" },
                                threat_type: { type: "string" },
                                probability: { type: "number" },
                                impact: { type: "string" },
                                triggers: { type: "array", items: { type: "string" } }
                            }
                        }
                    },
                    interconnections: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                from_threat: { type: "string" },
                                to_threat: { type: "string" },
                                mechanism: { type: "string" },
                                delay_days: { type: "number" }
                            }
                        }
                    },
                    scenario_premise: { type: "string" },
                    recommended_perspective: { 
                        type: "string",
                        enum: ["Militaire", "Civile", "Diplomatique", "Humanitaire", "Économique", "Multi-angle"]
                    },
                    credibility_score: { type: "number" }
                }
            }
        });

        return analysis;
    }

    /**
     * Construit le scénario multi-étapes
     */
    async buildMultiStageScenario(threatAnalysis, userParams, contextData) {
        const {
            scenarioName,
            perspective = threatAnalysis.recommended_perspective || 'Multi-angle',
            duration = 90,
            regions = [],
            detailLevel = 'Détaillé'
        } = userParams;

        const prompt = `Construis un scénario stratégique détaillé et réaliste basé sur cette analyse de menaces.

## MENACES IDENTIFIÉES
${JSON.stringify(threatAnalysis.primary_threats, null, 2)}

## INTERCONNEXIONS
${JSON.stringify(threatAnalysis.interconnections, null, 2)}

## PRÉMISSE
${threatAnalysis.scenario_premise}

## PARAMÈTRES
- Perspective: ${perspective}
- Durée: ${duration} jours
- Régions concernées: ${regions.join(', ') || 'Global'}
- Niveau de détail: ${detailLevel}

## MISSION
Crée un scénario narratif complexe en 5 phases chronologiques:

### PHASE 1: DÉCLENCHEMENT (Jours 1-${Math.floor(duration * 0.1)})
- Événement déclencheur
- Premiers signes et indicateurs
- Réactions immédiates des acteurs

### PHASE 2: ESCALADE (Jours ${Math.floor(duration * 0.1)}-${Math.floor(duration * 0.3)})
- Développements et complications
- Émergence de nouveaux acteurs
- Premières conséquences

### PHASE 3: POINT CRITIQUE (Jours ${Math.floor(duration * 0.3)}-${Math.floor(duration * 0.5)})
- Moment décisif
- Choix stratégiques majeurs
- Bifurcations possibles

### PHASE 4: RÉSOLUTION OU AGGRAVATION (Jours ${Math.floor(duration * 0.5)}-${Math.floor(duration * 0.8)})
- Tentatives de résolution
- Ou escalade vers crise majeure
- Interventions externes

### PHASE 5: DÉNOUEMENT (Jours ${Math.floor(duration * 0.8)}-${duration})
- Issue du scénario
- Conséquences à long terme
- Leçons apprises

Pour chaque phase, fournis:
- Événements détaillés
- Actions des acteurs clés
- Effets en cascade
- Métriques d'impact

Sois créatif mais réaliste. Utilise les données actuelles pour ancrer le scénario dans la réalité.`;

        const scenario = await base44.integrations.Core.InvokeLLM({
            prompt,
            add_context_from_internet: true,
            response_json_schema: {
                type: "object",
                properties: {
                    scenario_title: { type: "string" },
                    scenario_summary: { type: "string" },
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
                                actors_actions: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            actor: { type: "string" },
                                            action: { type: "string" },
                                            objective: { type: "string" }
                                        }
                                    }
                                },
                                cascade_effects: { type: "array", items: { type: "string" } },
                                impact_metrics: {
                                    type: "object",
                                    properties: {
                                        economic_impact: { type: "string" },
                                        humanitarian_impact: { type: "string" },
                                        geopolitical_impact: { type: "string" }
                                    }
                                }
                            }
                        }
                    },
                    key_actors: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                actor_name: { type: "string" },
                                actor_type: { 
                                    type: "string",
                                    enum: ["État", "Organisation Internationale", "Groupe Non-Étatique", "Corporation", "Acteur Individuel", "Coalition"]
                                },
                                role: { type: "string" },
                                objectives: { type: "array", items: { type: "string" } },
                                capabilities: { type: "array", items: { type: "string" } },
                                motivations: { type: "string" }
                            }
                        }
                    },
                    critical_decision_points: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                day: { type: "number" },
                                decision: { type: "string" },
                                decision_maker: { type: "string" },
                                option_a: { type: "string" },
                                option_b: { type: "string" },
                                consequence_a: { type: "string" },
                                consequence_b: { type: "string" }
                            }
                        }
                    },
                    overall_risk_assessment: {
                        type: "object",
                        properties: {
                            probability: { type: "string" },
                            impact: { type: "string" },
                            credibility_notes: { type: "string" }
                        }
                    }
                }
            }
        });

        return scenario;
    }

    /**
     * Génère les effets en cascade détaillés
     */
    async generateCascadeEffects(scenario, userParams) {
        const prompt = `Analyse ce scénario et identifie tous les effets en cascade (domino effects) entre les différents domaines.

SCÉNARIO: ${scenario.scenario_title}

PHASES:
${scenario.phases.map(p => `Phase ${p.phase_number}: ${p.phase_name}\n${p.description}`).join('\n\n')}

ACTEURS:
${scenario.key_actors.map(a => `- ${a.actor_name} (${a.actor_type}): ${a.role}`).join('\n')}

Identifie les effets en cascade dans tous les domaines:
- Géopolitique → Économique
- Économique → Social
- Technologique → Sécurité
- Environnemental → Humanitaire
- Etc.

Pour chaque effet:
1. Domaine source
2. Domaine affecté
3. Mécanisme de transmission
4. Délai de propagation
5. Intensité de l'impact
6. Mitigation possible`;

        const cascadeAnalysis = await base44.integrations.Core.InvokeLLM({
            prompt,
            add_context_from_internet: false, // Pas besoin de contexte externe ici
            response_json_schema: {
                type: "object",
                properties: {
                    cascade_chains: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                chain_id: { type: "number" },
                                trigger_event: { type: "string" },
                                trigger_domain: { type: "string" },
                                propagation_sequence: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            step: { type: "number" },
                                            affected_domain: { type: "string" },
                                            effect_description: { type: "string" },
                                            delay_days: { type: "number" },
                                            intensity: { 
                                                type: "string",
                                                enum: ["Faible", "Modéré", "Élevé", "Critique"]
                                            },
                                            mitigation_options: { type: "array", items: { type: "string" } }
                                        }
                                    }
                                },
                                total_impact_score: { type: "number" }
                            }
                        }
                    },
                    secondary_effects: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                effect_type: { type: "string" },
                                description: { type: "string" },
                                affected_populations: { type: "number" },
                                economic_cost_billions: { type: "number" }
                            }
                        }
                    },
                    tipping_points: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                day: { type: "number" },
                                description: { type: "string" },
                                threshold: { type: "string" },
                                if_exceeded: { type: "string" }
                            }
                        }
                    }
                }
            }
        });

        return cascadeAnalysis;
    }

    /**
     * Génère des alternatives et branches du scénario
     */
    async generateScenarioVariants(baseScenario, cascadeEffects) {
        const prompt = `Basé sur ce scénario principal, génère 3 variantes alternatives plausibles.

SCÉNARIO PRINCIPAL: ${baseScenario.scenario_title}
${baseScenario.scenario_summary}

Pour chaque variante:
1. Point de divergence (quel jour, quelle décision change)
2. Changement clé
3. Nouvelle trajectoire
4. Issue alternative
5. Probabilité relative (%)

Variantes à générer:
- Variante A: Meilleur scénario (optimiste)
- Variante B: Pire scénario (pessimiste)
- Variante C: Scénario surprise (événement inattendu)`;

        const variants = await base44.integrations.Core.InvokeLLM({
            prompt,
            response_json_schema: {
                type: "object",
                properties: {
                    variants: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                variant_name: { type: "string" },
                                variant_type: { 
                                    type: "string",
                                    enum: ["Optimiste", "Pessimiste", "Surprise"]
                                },
                                divergence_point: {
                                    type: "object",
                                    properties: {
                                        day: { type: "number" },
                                        phase: { type: "string" },
                                        critical_decision: { type: "string" }
                                    }
                                },
                                key_change: { type: "string" },
                                new_trajectory: { type: "string" },
                                alternative_outcome: { type: "string" },
                                probability_percentage: { type: "number" },
                                impact_comparison: { type: "string" }
                            }
                        }
                    }
                }
            }
        });

        return variants;
    }

    /**
     * Génère des indicateurs de surveillance pour le scénario
     */
    async generateMonitoringIndicators(scenario, cascadeEffects) {
        const prompt = `Pour ce scénario, identifie les indicateurs clés à surveiller pour détecter si le scénario se matérialise dans la réalité.

SCÉNARIO: ${scenario.scenario_title}

Fournis des indicateurs:
1. Précurseurs précoces (jours 1-7)
2. Indicateurs de confirmation (jours 8-30)
3. Signaux d'escalade (jours 30+)
4. Métriques quantitatives à surveiller
5. Sources de données recommandées

Pour chaque indicateur, spécifie:
- Nom de l'indicateur
- Type de donnée
- Seuil d'alerte
- Source de surveillance
- Fréquence de vérification recommandée`;

        const indicators = await base44.integrations.Core.InvokeLLM({
            prompt,
            response_json_schema: {
                type: "object",
                properties: {
                    early_warning_indicators: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                indicator_name: { type: "string" },
                                data_type: { type: "string" },
                                alert_threshold: { type: "string" },
                                data_source: { type: "string" },
                                check_frequency: { type: "string" },
                                current_value: { type: "string" }
                            }
                        }
                    },
                    confirmation_indicators: { type: "array", items: { type: "object" } },
                    escalation_indicators: { type: "array", items: { type: "object" } },
                    quantitative_metrics: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                metric_name: { type: "string" },
                                unit: { type: "string" },
                                baseline_value: { type: "number" },
                                alert_value: { type: "number" },
                                critical_value: { type: "number" }
                            }
                        }
                    }
                }
            }
        });

        return indicators;
    }

    /**
     * Crée l'entité Scenario complète
     */
    async createScenarioEntity(scenario, cascadeEffects, userParams) {
        const variants = await this.generateScenarioVariants(scenario, cascadeEffects);
        const indicators = await this.generateMonitoringIndicators(scenario, cascadeEffects);

        const scenarioData = {
            scenario_name: userParams.scenarioName || scenario.scenario_title,
            scenario_type: this.determineScenarioType(scenario),
            description: scenario.scenario_summary,
            perspective: userParams.perspective || scenario.recommended_perspective || 'Multi-angle',
            timeline: {
                start_date: userParams.startDate || new Date().toISOString().split('T')[0],
                duration_days: userParams.duration || 90,
                end_date: this.calculateEndDate(userParams.startDate, userParams.duration || 90)
            },
            generated_content: {
                text_analysis: this.formatTextAnalysis(scenario, cascadeEffects),
                strategic_brief: this.generateStrategicBrief(scenario, cascadeEffects, variants),
                action_points: this.extractActionPoints(scenario)
            },
            key_actors: scenario.key_actors || [],
            risk_assessment: {
                probability: this.mapProbability(scenario.overall_risk_assessment?.probability),
                impact: scenario.overall_risk_assessment?.impact || "Majeur",
                mitigation_strategies: this.extractMitigationStrategies(scenario, cascadeEffects)
            },
            status: 'Complété',
            generation_config: {
                include_cascade_analysis: true,
                include_variants: true,
                include_monitoring: true,
                detail_level: userParams.detailLevel || 'Détaillé',
                ai_enrichment: true,
                web_context_used: true
            },
            // Métadonnées étendues
            metadata: {
                phases: scenario.phases,
                cascade_chains: cascadeEffects.cascade_chains,
                secondary_effects: cascadeEffects.secondary_effects,
                tipping_points: cascadeEffects.tipping_points,
                variants: variants.variants,
                monitoring_indicators: indicators,
                generation_timestamp: new Date().toISOString(),
                credibility_score: scenario.credibility_score || 75,
                data_sources_used: this.getDataSourcesSummary(userParams)
            }
        };

        const createdScenario = await base44.entities.Scenario.create(scenarioData);
        return createdScenario;
    }

    /**
     * Génère un résumé stratégique
     */
    generateStrategicBrief(scenario, cascadeEffects, variants) {
        return `# ${scenario.scenario_title}

## Résumé Exécutif
${scenario.scenario_summary}

## Évaluation Globale
- **Crédibilité**: ${scenario.credibility_score || 75}/100
- **Probabilité**: ${scenario.overall_risk_assessment?.probability || 'Moyenne'}
- **Impact**: ${scenario.overall_risk_assessment?.impact || 'Majeur'}

## Phases du Scénario
${scenario.phases.map(p => `
### Phase ${p.phase_number}: ${p.phase_name} (${p.day_range})
${p.description}

**Événements clés:**
${p.key_events.map(e => `- ${e}`).join('\n')}
`).join('\n')}

## Effets en Cascade
${cascadeEffects.cascade_chains.length} chaînes d'effets identifiées

## Variantes Alternatives
${variants.variants.map(v => `
### ${v.variant_name} (${v.probability_percentage}%)
Point de divergence: Jour ${v.divergence_point.day}
${v.alternative_outcome}
`).join('\n')}

---
*Généré par IA le ${new Date().toLocaleString('fr-FR')}*`;
    }

    /**
     * Helpers
     */
    determineScenarioType(scenario) {
        // Logique pour déterminer le type dominant
        const types = scenario.key_actors?.map(a => a.actor_type) || [];
        if (types.includes('État')) return 'Géopolitique';
        if (scenario.scenario_title.toLowerCase().includes('cyber')) return 'Cybernétique';
        if (scenario.scenario_title.toLowerCase().includes('climat')) return 'Climatique';
        return 'Hybride';
    }

    formatTextAnalysis(scenario, cascadeEffects) {
        return JSON.stringify({
            scenario_overview: scenario.scenario_summary,
            phases: scenario.phases,
            cascade_analysis: cascadeEffects,
            credibility_assessment: scenario.credibility_score
        }, null, 2);
    }

    extractActionPoints(scenario) {
        const actionPoints = [];
        scenario.phases?.forEach(phase => {
            phase.actors_actions?.forEach(action => {
                actionPoints.push(`${action.actor}: ${action.action}`);
            });
        });
        return actionPoints.slice(0, 10); // Top 10
    }

    extractMitigationStrategies(scenario, cascadeEffects) {
        const strategies = [];
        cascadeEffects.cascade_chains?.forEach(chain => {
            chain.propagation_sequence?.forEach(step => {
                if (step.mitigation_options) {
                    strategies.push(...step.mitigation_options);
                }
            });
        });
        return [...new Set(strategies)].slice(0, 10); // Unique, top 10
    }

    mapProbability(prob) {
        if (!prob) return 'Moyenne';
        if (typeof prob === 'number') {
            if (prob >= 75) return 'Très élevée';
            if (prob >= 50) return 'Élevée';
            if (prob >= 25) return 'Moyenne';
            return 'Faible';
        }
        return prob;
    }

    calculateEndDate(startDate, durationDays) {
        const start = startDate ? new Date(startDate) : new Date();
        const end = new Date(start);
        end.setDate(end.getDate() + durationDays);
        return end.toISOString().split('T')[0];
    }

    getDataSourcesSummary(userParams) {
        return {
            system_predictions: true,
            system_signals: true,
            system_trends: true,
            web_research: true,
            user_parameters: Object.keys(userParams).length,
            enrichment_level: 'High'
        };
    }

    /**
     * Génère un scénario rapide (simplifié)
     */
    async generateQuickScenario(topic, duration = 30) {
        const userParams = {
            scenarioName: `Scénario Rapide: ${topic}`,
            duration,
            detailLevel: 'Basique',
            customFactors: [topic]
        };

        return await this.generateComplexScenario(userParams);
    }
}

// Singleton
const scenarioGenerationService = new ScenarioGenerationService();

export default scenarioGenerationService;