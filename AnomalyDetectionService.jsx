import { base44 } from '@/api/base44Client';

/**
 * SERVICE DE DÉTECTION D'ANOMALIES PAR IA
 * Analyse les flux de données en temps réel pour détecter des patterns anormaux
 * Utilise l'IA pour identifier des comportements inhabituels
 */

class AnomalyDetectionService {
    constructor() {
        this.isRunning = false;
        this.checkInterval = null;
        this.anomalyThreshold = 0.7; // Score minimum pour considérer comme anomalie
    }

    /**
     * Démarre la surveillance des anomalies
     */
    async startMonitoring(intervalMinutes = 15) {
        if (this.isRunning) {
            console.log('[AnomalyDetection] Already running');
            return;
        }

        this.isRunning = true;
        console.log('[AnomalyDetection] Starting monitoring...');

        // Premier check immédiat
        await this.performAnomalyCheck();

        // Puis checks périodiques
        this.checkInterval = setInterval(() => {
            this.performAnomalyCheck();
        }, intervalMinutes * 60 * 1000);
    }

    /**
     * Arrête la surveillance
     */
    stopMonitoring() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
        this.isRunning = false;
        console.log('[AnomalyDetection] Monitoring stopped');
    }

    /**
     * Effectue une vérification complète des anomalies
     */
    async performAnomalyCheck() {
        console.log('[AnomalyDetection] Performing anomaly check...');

        try {
            // Analyser les différents flux de données
            await Promise.all([
                this.checkPredictionAnomalies(),
                this.checkSignalAnomalies(),
                this.checkSecurityAnomalies(),
                this.checkTrendAnomalies()
            ]);

            console.log('[AnomalyDetection] Check completed');
        } catch (error) {
            console.error('[AnomalyDetection] Error during check:', error);
        }
    }

    /**
     * Détecte les anomalies dans les prédictions d'événements
     */
    async checkPredictionAnomalies() {
        const predictions = await base44.entities.EventPrediction.list('-created_date', 50);
        
        if (predictions.length < 10) return; // Pas assez de données

        // Analyser avec l'IA
        const analysis = await base44.integrations.Core.InvokeLLM({
            prompt: `Analyse ces prédictions d'événements et identifie les anomalies potentielles:

${predictions.map((p, i) => `${i+1}. ${p.event_name} - Type: ${p.event_type} - Probabilité: ${p.probability_score}% - Confiance: ${p.confidence_level}`).join('\n')}

Recherche:
- Pics soudains de probabilité
- Accumulation d'événements similaires
- Patterns inhabituels par type ou région
- Contradictions entre prédictions

Retourne une liste d'anomalies détectées avec leur score de gravité (0-100).`,
            response_json_schema: {
                type: "object",
                properties: {
                    anomalies: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                type: { type: "string" },
                                description: { type: "string" },
                                severity_score: { type: "number" },
                                affected_predictions: { type: "array", items: { type: "string" } },
                                recommendation: { type: "string" }
                            }
                        }
                    },
                    overall_risk_level: { type: "string" }
                }
            }
        });

        // Créer des notifications pour les anomalies graves
        if (analysis.anomalies && analysis.anomalies.length > 0) {
            for (const anomaly of analysis.anomalies) {
                if (anomaly.severity_score >= this.anomalyThreshold * 100) {
                    await this.createAnomalyAlert(
                        'Prediction',
                        anomaly.type,
                        anomaly.description,
                        anomaly.severity_score,
                        anomaly.recommendation
                    );
                }
            }
        }

        return analysis;
    }

    /**
     * Détecte les anomalies dans les signaux faibles
     */
    async checkSignalAnomalies() {
        const signals = await base44.entities.MediaSignal.list('-detection_timestamp', 100);
        
        if (signals.length < 20) return;

        const analysis = await base44.integrations.Core.InvokeLLM({
            prompt: `Analyse ces signaux faibles OSINT et détecte les anomalies:

${signals.slice(0, 50).map((s, i) => `${i+1}. ${s.signal_title} - Type: ${s.signal_type} - Source: ${s.source_platform} - Pertinence: ${s.relevance_score}%`).join('\n')}

Identifie:
- Augmentation soudaine de signaux sur un sujet
- Sources inhabituelles ou suspectes
- Patterns de coordination entre signaux
- Contenus contradictoires ou de désinformation
- Activité anormale sur certaines plateformes

Retourne les anomalies avec score de criticité.`,
            response_json_schema: {
                type: "object",
                properties: {
                    anomalies: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                pattern_type: { type: "string" },
                                description: { type: "string" },
                                criticality_score: { type: "number" },
                                affected_signals_count: { type: "number" },
                                potential_threat: { type: "string" },
                                action_required: { type: "string" }
                            }
                        }
                    }
                }
            }
        });

        if (analysis.anomalies) {
            for (const anomaly of analysis.anomalies) {
                if (anomaly.criticality_score >= this.anomalyThreshold * 100) {
                    await this.createAnomalyAlert(
                        'Signal',
                        anomaly.pattern_type,
                        anomaly.description,
                        anomaly.criticality_score,
                        anomaly.action_required
                    );
                }
            }
        }

        return analysis;
    }

    /**
     * Détecte les anomalies de sécurité
     */
    async checkSecurityAnomalies() {
        const incidents = await base44.entities.SecurityIncident.list('-detected_timestamp', 100);
        
        if (incidents.length < 5) return;

        // Analyser les patterns d'attaque
        const analysis = await base44.integrations.Core.InvokeLLM({
            prompt: `Analyse ces incidents de sécurité et détecte des anomalies ou patterns d'attaque:

${incidents.slice(0, 30).map((inc, i) => `${i+1}. ${inc.incident_type} - Sévérité: ${inc.severity} - IP: ${inc.source_ip} - Score menace: ${inc.threat_score}`).join('\n')}

Recherche:
- Attaques coordonnées (même IP, patterns temporels)
- Escalade soudaine d'attaques
- Nouvelles techniques d'attaque
- Cibles spécifiques répétées
- Changements dans les vecteurs d'attaque

Évalue le niveau de menace global.`,
            response_json_schema: {
                type: "object",
                properties: {
                    anomalies: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                attack_pattern: { type: "string" },
                                description: { type: "string" },
                                threat_level: { type: "number" },
                                coordinated_attack: { type: "boolean" },
                                recommended_defense: { type: "string" }
                            }
                        }
                    },
                    global_threat_assessment: { type: "string" }
                }
            }
        });

        if (analysis.anomalies) {
            for (const anomaly of analysis.anomalies) {
                if (anomaly.threat_level >= this.anomalyThreshold * 100) {
                    await this.createAnomalyAlert(
                        'Security',
                        anomaly.attack_pattern,
                        anomaly.description,
                        anomaly.threat_level,
                        anomaly.recommended_defense
                    );
                }
            }
        }

        return analysis;
    }

    /**
     * Détecte les anomalies dans les tendances
     */
    async checkTrendAnomalies() {
        const trends = await base44.entities.TrendAnalysis.list('-created_date', 50);
        
        if (trends.length < 10) return;

        const analysis = await base44.integrations.Core.InvokeLLM({
            prompt: `Analyse ces tendances et détecte des changements anormaux:

${trends.map((t, i) => `${i+1}. ${t.trend_name} - Domaine: ${t.domain} - Momentum: ${t.momentum_score} - Croissance: ${t.growth_rate}%`).join('\n')}

Identifie:
- Inversions soudaines de tendance
- Accélérations ou décélérations anormales
- Corrélations inhabituelles entre domaines
- Tendances contradictoires
- Émergence rapide de nouvelles tendances

Évalue l'impact potentiel.`,
            response_json_schema: {
                type: "object",
                properties: {
                    anomalies: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                trend_change: { type: "string" },
                                description: { type: "string" },
                                impact_score: { type: "number" },
                                affected_domains: { type: "array", items: { type: "string" } },
                                forecast: { type: "string" }
                            }
                        }
                    }
                }
            }
        });

        if (analysis.anomalies) {
            for (const anomaly of analysis.anomalies) {
                if (anomaly.impact_score >= this.anomalyThreshold * 100) {
                    await this.createAnomalyAlert(
                        'Trend',
                        anomaly.trend_change,
                        anomaly.description,
                        anomaly.impact_score,
                        anomaly.forecast
                    );
                }
            }
        }

        return analysis;
    }

    /**
     * Crée une alerte pour une anomalie détectée
     */
    async createAnomalyAlert(category, type, description, score, recommendation) {
        try {
            // Créer une notification utilisateur pour les admins
            const admins = await base44.entities.User.filter({ role: 'admin' });
            
            for (const admin of admins) {
                await base44.entities.UserNotification.create({
                    user_email: admin.email,
                    notification_type: score >= 80 ? 'Alert' : 'Warning',
                    title: `Anomalie détectée - ${category}: ${type}`,
                    message: `${description}\n\n📊 Score: ${score}/100\n💡 Recommandation: ${recommendation}`,
                    priority: score >= 80 ? 'Urgent' : score >= 60 ? 'High' : 'Medium',
                    category: category === 'Security' ? 'Security' : 'System',
                    metadata: {
                        anomaly_type: type,
                        detection_score: score,
                        detection_timestamp: new Date().toISOString()
                    }
                });
            }

            console.log(`[AnomalyDetection] Alert created: ${category} - ${type} (${score}/100)`);
        } catch (error) {
            console.error('[AnomalyDetection] Error creating alert:', error);
        }
    }

    /**
     * Obtient un rapport sur l'état de la surveillance
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            threshold: this.anomalyThreshold,
            lastCheck: this.lastCheckTime || null
        };
    }

    /**
     * Modifie le seuil de détection
     */
    setThreshold(threshold) {
        this.anomalyThreshold = Math.max(0, Math.min(1, threshold));
        console.log(`[AnomalyDetection] Threshold set to ${this.anomalyThreshold}`);
    }
}

// Singleton
const anomalyDetectionService = new AnomalyDetectionService();

export default anomalyDetectionService;