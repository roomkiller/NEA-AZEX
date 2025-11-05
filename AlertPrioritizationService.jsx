import { base44 } from '@/api/base44Client';

/**
 * SERVICE DE PRIORISATION D'ALERTES PAR IA
 * Analyse et priorise automatiquement les incidents de sécurité et signaux faibles
 * Utilise l'IA pour évaluer la criticité réelle basée sur le contexte
 */

class AlertPrioritizationService {
    constructor() {
        this.isRunning = false;
        this.processInterval = null;
    }

    /**
     * Démarre le service de priorisation
     */
    async startPrioritization(intervalMinutes = 10) {
        if (this.isRunning) {
            console.log('[AlertPrioritization] Already running');
            return;
        }

        this.isRunning = true;
        console.log('[AlertPrioritization] Starting service...');

        // Premier traitement immédiat
        await this.processAlerts();

        // Puis traitements périodiques
        this.processInterval = setInterval(() => {
            this.processAlerts();
        }, intervalMinutes * 60 * 1000);
    }

    /**
     * Arrête le service
     */
    stopPrioritization() {
        if (this.processInterval) {
            clearInterval(this.processInterval);
            this.processInterval = null;
        }
        this.isRunning = false;
        console.log('[AlertPrioritization] Service stopped');
    }

    /**
     * Traite et priorise toutes les alertes
     */
    async processAlerts() {
        console.log('[AlertPrioritization] Processing alerts...');

        try {
            await Promise.all([
                this.prioritizeSecurityIncidents(),
                this.prioritizeMediaSignals(),
                this.crossReferenceAlerts()
            ]);

            console.log('[AlertPrioritization] Processing completed');
        } catch (error) {
            console.error('[AlertPrioritization] Error:', error);
        }
    }

    /**
     * Priorise les incidents de sécurité
     */
    async prioritizeSecurityIncidents() {
        // Récupérer incidents récents non priorisés ou de priorité moyenne
        const incidents = await base44.entities.SecurityIncident.list('-detected_timestamp', 50);
        
        if (incidents.length === 0) return;

        // Grouper par lots pour analyse contextuelle
        const batches = this.chunkArray(incidents, 10);

        for (const batch of batches) {
            try {
                const analysis = await base44.integrations.Core.InvokeLLM({
                    prompt: `Tu es un expert en cybersécurité. Analyse ces incidents et évalue leur priorité RÉELLE basée sur:

1. Contexte de l'attaque
2. Sophistication technique
3. Impact potentiel
4. Urgence de réponse
5. Corrélation avec autres incidents

INCIDENTS:
${batch.map((inc, i) => `
${i+1}. Type: ${inc.incident_type}
   Sévérité actuelle: ${inc.severity}
   IP source: ${inc.source_ip}
   Cible: ${inc.target_entity}
   Vecteur: ${inc.attack_vector}
   Bloqué: ${inc.blocked}
   Score menace: ${inc.threat_score}
`).join('\n')}

Pour chaque incident, fournis:
- Priorité recalculée (1-5, 5=critique)
- Justification de la priorité
- Actions recommandées
- Délai de réponse suggéré`,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            incidents: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        incident_index: { type: "number" },
                                        recalculated_priority: { type: "number" },
                                        priority_justification: { type: "string" },
                                        recommended_actions: { type: "array", items: { type: "string" } },
                                        response_timeframe: { type: "string" },
                                        threat_category: { type: "string" }
                                    }
                                }
                            },
                            global_assessment: { type: "string" }
                        }
                    }
                });

                // Mettre à jour les incidents avec les nouvelles priorités
                if (analysis.incidents) {
                    for (const incidentAnalysis of analysis.incidents) {
                        const incident = batch[incidentAnalysis.incident_index - 1];
                        if (incident) {
                            await this.updateIncidentPriority(
                                incident,
                                incidentAnalysis
                            );
                        }
                    }
                }
            } catch (error) {
                console.error('[AlertPrioritization] Error prioritizing batch:', error);
            }
        }
    }

    /**
     * Priorise les signaux faibles
     */
    async prioritizeMediaSignals() {
        const signals = await base44.entities.MediaSignal.list('-detection_timestamp', 100);
        
        if (signals.length === 0) return;

        // Analyser par groupes thématiques
        const batches = this.chunkArray(signals, 20);

        for (const batch of batches) {
            try {
                const analysis = await base44.integrations.Core.InvokeLLM({
                    prompt: `Analyse ces signaux faibles OSINT et détermine leur priorité stratégique réelle:

SIGNAUX:
${batch.map((sig, i) => `
${i+1}. ${sig.signal_title}
   Type: ${sig.signal_type}
   Source: ${sig.source_platform}
   Pertinence actuelle: ${sig.relevance_score}%
   Priorité: ${sig.priority_level}
`).join('\n')}

Évalue pour chaque signal:
- Pertinence stratégique réelle (0-100)
- Niveau de priorité (Bas/Moyen/Élevé/Critique)
- Urgence d'analyse
- Corrélation avec événements actuels
- Potentiel de développement

Utilise le contexte mondial actuel pour affiner ton évaluation.`,
                    add_context_from_internet: true,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            signals: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        signal_index: { type: "number" },
                                        strategic_relevance: { type: "number" },
                                        priority_level: { 
                                            type: "string",
                                            enum: ["Bas", "Moyen", "Élevé", "Critique"]
                                        },
                                        analysis_urgency: { type: "string" },
                                        correlation_notes: { type: "string" }
                                    }
                                }
                            }
                        }
                    }
                });

                // Mettre à jour les signaux
                if (analysis.signals) {
                    for (const signalAnalysis of analysis.signals) {
                        const signal = batch[signalAnalysis.signal_index - 1];
                        if (signal) {
                            await this.updateSignalPriority(signal, signalAnalysis);
                        }
                    }
                }
            } catch (error) {
                console.error('[AlertPrioritization] Error prioritizing signals:', error);
            }
        }
    }

    /**
     * Effectue une analyse croisée des alertes
     */
    async crossReferenceAlerts() {
        const [incidents, signals, predictions] = await Promise.all([
            base44.entities.SecurityIncident.list('-detected_timestamp', 30),
            base44.entities.MediaSignal.list('-detection_timestamp', 50),
            base44.entities.EventPrediction.list('-created_date', 20)
        ]);

        if (incidents.length === 0 && signals.length === 0) return;

        try {
            const analysis = await base44.integrations.Core.InvokeLLM({
                prompt: `Effectue une analyse croisée de ces alertes pour identifier des patterns cachés:

INCIDENTS SÉCURITÉ (${incidents.length}):
${incidents.slice(0, 15).map(i => `- ${i.incident_type}: ${i.severity}, IP ${i.source_ip}`).join('\n')}

SIGNAUX FAIBLES (${signals.length}):
${signals.slice(0, 20).map(s => `- ${s.signal_title} (${s.signal_type})`).join('\n')}

PRÉDICTIONS (${predictions.length}):
${predictions.slice(0, 10).map(p => `- ${p.event_name}: ${p.probability_score}%`).join('\n')}

Identifie:
1. Corrélations entre incidents et signaux
2. Signaux précurseurs d'incidents
3. Patterns d'attaque complexes
4. Menaces émergentes
5. Alertes nécessitant escalade immédiate

Retourne les alertes critiques à remonter d'urgence.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        critical_correlations: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    correlation_type: { type: "string" },
                                    description: { type: "string" },
                                    severity: { type: "string" },
                                    immediate_action_required: { type: "boolean" },
                                    involved_alerts: { type: "array", items: { type: "string" } }
                                }
                            }
                        },
                        emerging_threats: { type: "array", items: { type: "string" } },
                        escalation_required: { type: "array", items: { type: "string" } }
                    }
                }
            });

            // Créer des notifications pour les corrélations critiques
            if (analysis.critical_correlations && analysis.critical_correlations.length > 0) {
                for (const correlation of analysis.critical_correlations) {
                    if (correlation.immediate_action_required) {
                        await this.createCriticalAlert(correlation);
                    }
                }
            }

        } catch (error) {
            console.error('[AlertPrioritization] Error in cross-reference:', error);
        }
    }

    /**
     * Met à jour la priorité d'un incident
     */
    async updateIncidentPriority(incident, analysis) {
        try {
            // Mapper priorité numérique vers sévérité
            const severityMap = {
                5: 'Critique',
                4: 'Élevé',
                3: 'Moyen',
                2: 'Faible',
                1: 'Info'
            };

            const newSeverity = severityMap[analysis.recalculated_priority] || incident.severity;
            const newThreatScore = analysis.recalculated_priority * 20;

            // Mettre à jour seulement si changement significatif
            if (newSeverity !== incident.severity || Math.abs(newThreatScore - incident.threat_score) > 10) {
                await base44.entities.SecurityIncident.update(incident.id, {
                    severity: newSeverity,
                    threat_score: newThreatScore,
                    notes: `${incident.notes || ''}\n\n[IA Prioritization] ${analysis.priority_justification}\nActions: ${analysis.recommended_actions.join(', ')}\nDélai: ${analysis.response_timeframe}`
                });

                console.log(`[AlertPrioritization] Updated incident ${incident.id}: ${incident.severity} -> ${newSeverity}`);
            }
        } catch (error) {
            console.error('[AlertPrioritization] Error updating incident:', error);
        }
    }

    /**
     * Met à jour la priorité d'un signal
     */
    async updateSignalPriority(signal, analysis) {
        try {
            if (analysis.priority_level !== signal.priority_level || 
                Math.abs(analysis.strategic_relevance - signal.relevance_score) > 15) {
                
                await base44.entities.MediaSignal.update(signal.id, {
                    priority_level: analysis.priority_level,
                    relevance_score: analysis.strategic_relevance,
                    content_summary: `${signal.content_summary}\n\n[IA Analysis] ${analysis.correlation_notes}`
                });

                console.log(`[AlertPrioritization] Updated signal ${signal.id}: ${signal.priority_level} -> ${analysis.priority_level}`);
            }
        } catch (error) {
            console.error('[AlertPrioritization] Error updating signal:', error);
        }
    }

    /**
     * Crée une alerte critique pour corrélation détectée
     */
    async createCriticalAlert(correlation) {
        try {
            const admins = await base44.entities.User.filter({ role: 'admin' });
            
            for (const admin of admins) {
                await base44.entities.UserNotification.create({
                    user_email: admin.email,
                    notification_type: 'Alert',
                    title: `🚨 Corrélation Critique Détectée`,
                    message: `Type: ${correlation.correlation_type}\n\n${correlation.description}\n\nSévérité: ${correlation.severity}\n\nAction immédiate requise!`,
                    priority: 'Urgent',
                    category: 'Security',
                    metadata: {
                        correlation_type: correlation.correlation_type,
                        involved_alerts: correlation.involved_alerts
                    }
                });
            }
        } catch (error) {
            console.error('[AlertPrioritization] Error creating critical alert:', error);
        }
    }

    /**
     * Divise un tableau en chunks
     */
    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    /**
     * Obtient le statut du service
     */
    getStatus() {
        return {
            isRunning: this.isRunning
        };
    }
}

// Singleton
const alertPrioritizationService = new AlertPrioritizationService();

export default alertPrioritizationService;