import { base44 } from '@/api/base44Client';

/**
 * GÉNÉRATEUR AUTOMATIQUE DE RAPPORTS PAR IA
 * Crée des briefings intelligents en analysant prédictions, signaux et tendances
 * Génère des IntelligenceBrief complets avec analyse contextuelle
 */

class AutomatedReportGenerator {
    /**
     * Génère un rapport d'intelligence complet
     */
    async generateIntelligenceBrief(domain = 'All', timeframe = '24h') {
        console.log(`[ReportGenerator] Generating brief for domain: ${domain}, timeframe: ${timeframe}`);

        try {
            // 1. Collecter les données
            const data = await this.collectData(timeframe);

            // 2. Analyser avec l'IA
            const analysis = await this.analyzeWithAI(data, domain);

            // 3. Créer le briefing
            const brief = await this.createBrief(analysis, domain);

            console.log(`[ReportGenerator] Brief created: ${brief.id}`);
            return brief;

        } catch (error) {
            console.error('[ReportGenerator] Error generating brief:', error);
            throw error;
        }
    }

    /**
     * Collecte les données pertinentes
     */
    async collectData(timeframe) {
        const hoursBack = this.parseTimeframe(timeframe);
        const cutoffDate = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

        const [predictions, signals, trends, incidents] = await Promise.all([
            base44.entities.EventPrediction.list('-created_date', 50),
            base44.entities.MediaSignal.list('-detection_timestamp', 100),
            base44.entities.TrendAnalysis.list('-created_date', 30),
            base44.entities.SecurityIncident.list('-detected_timestamp', 50)
        ]);

        // Filtrer par date
        const recentPredictions = predictions.filter(p => 
            new Date(p.created_date) >= cutoffDate
        );
        const recentSignals = signals.filter(s => 
            new Date(s.detection_timestamp) >= cutoffDate
        );
        const recentIncidents = incidents.filter(i => 
            new Date(i.detected_timestamp) >= cutoffDate
        );

        return {
            predictions: recentPredictions,
            signals: recentSignals,
            trends,
            incidents: recentIncidents,
            timeframe,
            cutoffDate
        };
    }

    /**
     * Analyse les données avec l'IA
     */
    async analyzeWithAI(data, domain) {
        const prompt = `Tu es un analyste en intelligence stratégique. Analyse ces données et crée un briefing complet.

## DONNÉES COLLECTÉES

### Prédictions d'événements (${data.predictions.length}):
${data.predictions.slice(0, 20).map(p => 
    `- ${p.event_name} (${p.event_type}): Probabilité ${p.probability_score}%, Confiance ${p.confidence_level}`
).join('\n')}

### Signaux faibles OSINT (${data.signals.length}):
${data.signals.slice(0, 30).map(s => 
    `- ${s.signal_title} (${s.signal_type}): Source ${s.source_platform}, Pertinence ${s.relevance_score}%`
).join('\n')}

### Tendances actuelles (${data.trends.length}):
${data.trends.slice(0, 15).map(t => 
    `- ${t.trend_name} (${t.domain}): Momentum ${t.momentum_score}, Croissance ${t.growth_rate}%`
).join('\n')}

### Incidents de sécurité (${data.incidents.length}):
${data.incidents.slice(0, 15).map(i => 
    `- ${i.incident_type}: Sévérité ${i.severity}, Score menace ${i.threat_score}`
).join('\n')}

## INSTRUCTIONS

${domain !== 'All' ? `Focus sur le domaine: ${domain}` : 'Analyse tous les domaines'}

Crée un briefing d'intelligence stratégique structuré incluant:

1. **Résumé exécutif** (2-3 phrases clés)
2. **Découvertes principales** (5-7 findings avec niveau de confiance et impact)
3. **Actions recommandées** (5 actions prioritaires avec timeframe et responsable suggéré)
4. **Évaluation des risques** (risque global, probabilité, score d'impact)
5. **Timeline** (développements attendus: immédiat, court terme 72h, moyen terme 30j, long terme)
6. **Focus géographique** (régions et pays concernés)

Utilise les données réelles fournies pour étayer ton analyse.`;

        const analysis = await base44.integrations.Core.InvokeLLM({
            prompt,
            add_context_from_internet: true, // Enrichir avec contexte externe
            response_json_schema: {
                type: "object",
                properties: {
                    executive_summary: { type: "string" },
                    key_findings: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                finding: { type: "string" },
                                confidence: { 
                                    type: "string",
                                    enum: ["Faible", "Moyen", "Élevé", "Confirmé"]
                                },
                                impact: {
                                    type: "string",
                                    enum: ["Mineur", "Modéré", "Majeur", "Critique"]
                                }
                            }
                        }
                    },
                    actionable_intelligence: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                action: { type: "string" },
                                timeframe: { type: "string" },
                                responsible: { type: "string" }
                            }
                        }
                    },
                    risk_assessment: {
                        type: "object",
                        properties: {
                            overall_risk: {
                                type: "string",
                                enum: ["Faible", "Modéré", "Élevé", "Critique"]
                            },
                            probability: { type: "number" },
                            impact_score: { type: "number" }
                        }
                    },
                    timeline: {
                        type: "object",
                        properties: {
                            immediate: { type: "array", items: { type: "string" } },
                            short_term_72h: { type: "array", items: { type: "string" } },
                            medium_term_30d: { type: "array", items: { type: "string" } },
                            long_term: { type: "array", items: { type: "string" } }
                        }
                    },
                    geographic_focus: {
                        type: "object",
                        properties: {
                            regions: { type: "array", items: { type: "string" } },
                            countries: { type: "array", items: { type: "string" } }
                        }
                    },
                    confidence_score: { type: "number" }
                }
            }
        });

        return analysis;
    }

    /**
     * Crée le briefing en base de données
     */
    async createBrief(analysis, domain) {
        const briefData = {
            brief_title: `Briefing Automatisé - ${domain} - ${new Date().toLocaleDateString('fr-FR')}`,
            domain: this.mapDomain(domain),
            priority_level: this.calculatePriority(analysis.risk_assessment),
            classification: "Restreint",
            executive_summary: analysis.executive_summary,
            key_findings: analysis.key_findings,
            actionable_intelligence: analysis.actionable_intelligence,
            risk_assessment: analysis.risk_assessment,
            geographic_focus: analysis.geographic_focus,
            timeline: analysis.timeline,
            confidence_score: analysis.confidence_score || 75,
            sources_count: 100,
            valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            next_update_scheduled: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };

        const brief = await base44.entities.IntelligenceBrief.create(briefData);
        return brief;
    }

    /**
     * Génère un rapport périodique automatique
     */
    async generatePeriodicReport(domain, period = 'daily') {
        const timeframes = {
            hourly: '1h',
            daily: '24h',
            weekly: '168h',
            monthly: '720h'
        };

        return await this.generateIntelligenceBrief(domain, timeframes[period] || '24h');
    }

    /**
     * Génère un rapport sur un sujet spécifique
     */
    async generateTopicReport(topic, includeWebSearch = true) {
        console.log(`[ReportGenerator] Generating topic report: ${topic}`);

        // Collecter données
        const data = await this.collectData('168h'); // 1 semaine

        // Analyser avec focus sur le sujet
        const prompt = `Crée un rapport d'intelligence détaillé sur: "${topic}"

Utilise ces données système:
- ${data.predictions.length} prédictions
- ${data.signals.length} signaux faibles
- ${data.trends.length} tendances
- ${data.incidents.length} incidents de sécurité

${includeWebSearch ? 'Enrichis avec des informations actuelles du web.' : ''}

Fournis une analyse complète avec découvertes, risques, et recommandations.`;

        const analysis = await base44.integrations.Core.InvokeLLM({
            prompt,
            add_context_from_internet: includeWebSearch,
            response_json_schema: {
                type: "object",
                properties: {
                    executive_summary: { type: "string" },
                    key_findings: { type: "array", items: { type: "object" } },
                    actionable_intelligence: { type: "array", items: { type: "object" } },
                    risk_assessment: { type: "object" },
                    timeline: { type: "object" },
                    geographic_focus: { type: "object" },
                    confidence_score: { type: "number" }
                }
            }
        });

        // Créer briefing
        return await this.createBrief(analysis, topic);
    }

    /**
     * Parse le timeframe en heures
     */
    parseTimeframe(timeframe) {
        const match = timeframe.match(/(\d+)(h|d|w)/);
        if (!match) return 24;

        const value = parseInt(match[1]);
        const unit = match[2];

        switch (unit) {
            case 'h': return value;
            case 'd': return value * 24;
            case 'w': return value * 24 * 7;
            default: return 24;
        }
    }

    /**
     * Mappe le domaine vers l'enum
     */
    mapDomain(domain) {
        const mapping = {
            'All': 'Militaire',
            'Military': 'Militaire',
            'Health': 'Santé_Publique',
            'Journalism': 'Journalisme',
            'Diplomacy': 'Diplomatie',
            'Finance': 'Finance',
            'Weather': 'Météorologie',
            'Cybersecurity': 'Cybersécurité',
            'Humanitarian': 'Humanitaire'
        };
        return mapping[domain] || 'Militaire';
    }

    /**
     * Calcule la priorité basée sur l'évaluation des risques
     */
    calculatePriority(riskAssessment) {
        if (!riskAssessment) return 'Routine';

        const risk = riskAssessment.overall_risk;
        const probability = riskAssessment.probability || 0;

        if (risk === 'Critique' || probability >= 90) return 'Critique';
        if (risk === 'Élevé' || probability >= 70) return 'Urgent';
        if (risk === 'Modéré' || probability >= 40) return 'Attention';
        return 'Routine';
    }
}

// Singleton
const automatedReportGenerator = new AutomatedReportGenerator();

export default automatedReportGenerator;