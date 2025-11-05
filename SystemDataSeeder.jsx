import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Database, CheckCircle, AlertTriangle, Loader2, Package, FileText, Activity, TrendingUp, Eye, Shield } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStaggerAnimation } from '../components/navigation/PageTransition';
import { toast } from 'sonner';

const DEMO_MODULES = [
    {"name": "QUADRA-1 : Surveillance Globale", "category": "SUPERVISION", "status": "Active", "description": "Module maître de supervision et orchestration de tous les systèmes NEA-AZEX. Coordination des 4 quadras principaux.", "version": "3.2.1", "last_audit": "2025-01-15T08:00:00Z"},
    {"name": "Géopolitique - Tensions Moyen-Orient", "category": "GÉOPOLITIQUE", "status": "Active", "description": "Surveillance des tensions géopolitiques au Moyen-Orient : Iran, Israël, Arabie Saoudite, conflits régionaux.", "version": "2.8.4", "last_audit": "2025-01-14T10:30:00Z"},
    {"name": "Géopolitique - Relations Sino-US", "category": "GÉOPOLITIQUE", "status": "Active", "description": "Analyse des relations entre Chine et États-Unis : commerce, Taiwan, mer de Chine méridionale, technologie.", "version": "2.7.2", "last_audit": "2025-01-13T14:20:00Z"},
    {"name": "Géopolitique - Conflit Ukraine", "category": "GÉOPOLITIQUE", "status": "Active", "description": "Monitoring du conflit Russie-Ukraine : mouvements militaires, diplomatie, sanctions, reconstruction.", "version": "3.1.0", "last_audit": "2025-01-15T06:00:00Z"},
    {"name": "Nucléaire - Prolifération Iran", "category": "NUCLÉAIRE", "status": "Active", "description": "Surveillance du programme nucléaire iranien et négociations JCPOA.", "version": "2.5.6", "last_audit": "2025-01-12T11:00:00Z"},
    {"name": "Nucléaire - Arsenaux Stratégiques", "category": "NUCLÉAIRE", "status": "Active", "description": "Monitoring des arsenaux nucléaires : US, Russie, Chine, France, UK, Inde, Pakistan, Corée du Nord, Israël.", "version": "2.9.1", "last_audit": "2025-01-14T08:30:00Z"},
    {"name": "Climat - Réchauffement Global", "category": "CLIMAT", "status": "Active", "description": "Analyse du réchauffement climatique : températures, CO2, événements extrêmes, fonte des glaces.", "version": "3.0.2", "last_audit": "2025-01-15T07:00:00Z"},
    {"name": "Climat - Catastrophes Naturelles", "category": "CLIMAT", "status": "Active", "description": "Prédiction et monitoring des ouragans, typhons, séismes, tsunamis, inondations.", "version": "2.8.7", "last_audit": "2025-01-14T09:00:00Z"},
    {"name": "Biologie - Pandémies Émergentes", "category": "BIOLOGIE", "status": "Active", "description": "Détection précoce de nouvelles maladies infectieuses et épidémies potentielles.", "version": "3.1.5", "last_audit": "2025-01-15T10:00:00Z"},
    {"name": "Cyber - Menaces APT", "category": "CYBERNÉTIQUE", "status": "Active", "description": "Détection des Advanced Persistent Threats et groupes de hackers étatiques.", "version": "3.2.4", "last_audit": "2025-01-15T12:00:00Z"},
    {"name": "Cyber - Infrastructure Critique", "category": "CYBERNÉTIQUE", "status": "Active", "description": "Protection des infrastructures critiques : énergie, eau, transport, santé.", "version": "3.0.9", "last_audit": "2025-01-14T16:00:00Z"},
    {"name": "Géopolitique - Détroit Taiwan", "category": "GÉOPOLITIQUE", "status": "Active", "description": "Surveillance de la situation du détroit de Taiwan et risques de conflit.", "version": "3.0.5", "last_audit": "2025-01-15T09:00:00Z"}
];

const DEMO_DOCUMENTATION = [
    {"title": "Guide de Démarrage NEA-AZEX", "category": "Tutoriel", "content": "# Guide de Démarrage NEA-AZEX\n\n## Introduction\nBienvenue dans NEA-AZEX, le système d'intelligence stratégique de nouvelle génération.\n\n## Premières Étapes\n1. **Connectez-vous** avec vos identifiants\n2. **Sélectionnez votre interface** selon votre rôle\n3. **Explorez les tableaux de bord** disponibles\n4. **Configurez vos alertes** personnalisées\n\n## Navigation\nUtilisez le menu latéral pour accéder aux différentes sections du système.\n\n## Support\nEn cas de problème, contactez support@nea-azex.com", "version": "1.0.0", "access_level": "user"},
    {"title": "Architecture Technique NEA-AZEX", "category": "Architecture", "content": "# Architecture Technique NEA-AZEX\n\n## Vue d'Ensemble\nNEA-AZEX est construit sur une architecture modulaire distribuée.\n\n## Composants Principaux\n- **Quadra-1**: Supervision globale\n- **Modules spécialisés**: Géopolitique, Nucléaire, Climat, Biologie, Cyber\n- **System Nexus**: IA conversationnelle centrale\n- **Moteur de prédiction**: Analyse prédictive avancée\n\n## Sécurité\n- Chiffrement RSA-4096 bout-en-bout\n- Authentification multi-facteurs\n- Audit trail complet\n\n## Performance\n- Temps réel sur données critiques\n- Cache intelligent pour analyses complexes\n- Scaling horizontal automatique", "version": "2.1.0", "access_level": "developer"},
    {"title": "Module Géopolitique - Guide d'Utilisation", "category": "Module", "content": "# Module Géopolitique\n\n## Description\nAnalyse des tensions et dynamiques géopolitiques mondiales.\n\n## Zones Couvertes\n- Moyen-Orient\n- Relations Sino-US\n- Conflit Ukraine-Russie\n- Détroit de Taiwan\n- Sahel\n- Arctique\n\n## Sources de Données\n- Dépêches diplomatiques\n- Analyses think tanks\n- OSINT multi-sources\n- Satellites d'observation\n\n## Indicateurs Clés\n- Niveau de tension (0-100)\n- Probabilité de conflit\n- Impact économique potentiel", "version": "2.8.0", "related_module": "GÉOPOLITIQUE", "access_level": "user"}
];

const DEMO_PREDICTIONS = [
    {"event_name": "Escalade Tensions Iran-Israël", "event_type": "GÉOPOLITIQUE", "prediction_summary": "Augmentation probable des tensions suite aux récentes déclarations diplomatiques et mouvements militaires.", "probability_score": 78, "predicted_date": "2025-02-15T00:00:00Z", "confidence_level": "Élevé", "status": "Validé"},
    {"event_name": "Crise Énergétique Europe Hiver 2025", "event_type": "ÉCONOMIQUE", "prediction_summary": "Risque de pénurie énergétique en Europe centrale durant l'hiver 2025 suite aux perturbations d'approvisionnement.", "probability_score": 65, "predicted_date": "2025-12-01T00:00:00Z", "confidence_level": "Moyen", "status": "Analyse"},
    {"event_name": "Nouveau Variant Viral Détecté Asie du Sud-Est", "event_type": "SANITAIRE", "prediction_summary": "Signaux faibles indiquent l'émergence possible d'un nouveau variant viral dans la région.", "probability_score": 42, "predicted_date": "2025-03-20T00:00:00Z", "confidence_level": "Moyen", "status": "Détection"},
    {"event_name": "Cyberattaque Majeure Infrastructure Occidentale", "event_type": "SÉCURITAIRE", "prediction_summary": "Probabilité élevée d'une cyberattaque coordonnée visant les infrastructures critiques occidentales.", "probability_score": 82, "predicted_date": "2025-02-28T00:00:00Z", "confidence_level": "Élevé", "status": "Validé"}
];

const DEMO_SIGNALS = [
    {"signal_title": "Augmentation trafic Dark Web - Vente données médicales", "signal_type": "Dark_Web", "source_platform": "Dark Web Monitoring", "detection_timestamp": "2025-01-15T14:23:00Z", "content_summary": "Hausse de 340% des annonces de vente de dossiers médicaux volés sur forums underground.", "relevance_score": 87, "priority_level": "Élevé"},
    {"signal_title": "Discussions militaires anormales réseaux sociaux Iran", "signal_type": "Social_Media", "source_platform": "Twitter/X", "detection_timestamp": "2025-01-15T10:15:00Z", "content_summary": "Pic d'activité sur hashtags liés à la mobilisation militaire, géolocalisation Iran.", "relevance_score": 76, "priority_level": "Élevé"},
    {"signal_title": "Anomalie statistique achats céréales Russie", "signal_type": "Anomalie_Statistique", "source_platform": "Trading Platforms", "detection_timestamp": "2025-01-14T16:45:00Z", "content_summary": "Volume d'achat de céréales par entités russes 5x supérieur à la normale sur 7 jours.", "relevance_score": 68, "priority_level": "Moyen"}
];

const DEMO_TRENDS = [
    {"trend_name": "Adoption IA Générative Entreprises", "domain": "Technologie", "momentum_score": 94, "growth_rate": 12.5, "analysis_period": {"start_date": "2024-10-01", "end_date": "2025-01-15"}, "status": "Active"},
    {"trend_name": "Tension Géopolitique Arctique", "domain": "Géopolitique", "momentum_score": 72, "growth_rate": 8.3, "analysis_period": {"start_date": "2024-11-01", "end_date": "2025-01-15"}, "status": "Active"},
    {"trend_name": "Migration Climatique Afrique Subsaharienne", "domain": "Société", "momentum_score": 65, "growth_rate": 5.7, "analysis_period": {"start_date": "2024-09-01", "end_date": "2025-01-15"}, "status": "Monitoring"}
];

const DEMO_INCIDENTS = [
    {"incident_type": "Tentative_Intrusion", "severity": "Élevé", "threat_score": 78, "detected_timestamp": "2025-01-15T13:45:23Z", "source_ip": "203.45.67.89", "source_geolocation": {"country": "China", "city": "Beijing"}, "target_entity": "User", "attack_vector": "SQL Injection Attempt", "blocked": true, "mitigation_action": "IP_Ban"},
    {"incident_type": "Brute_Force", "severity": "Moyen", "threat_score": 45, "detected_timestamp": "2025-01-15T09:12:15Z", "source_ip": "185.220.101.34", "source_geolocation": {"country": "Russia", "city": "Moscow"}, "target_entity": "Authentication", "attack_vector": "Password Brute Force", "blocked": true, "mitigation_action": "Rate_Limit"},
    {"incident_type": "Unauthorized_API_Call", "severity": "Critique", "threat_score": 92, "detected_timestamp": "2025-01-15T11:23:45Z", "source_ip": "94.142.241.111", "source_geolocation": {"country": "North Korea", "city": "Pyongyang"}, "target_entity": "Module", "attack_vector": "Token Manipulation", "blocked": true, "mitigation_action": "IP_Quarantine"}
];

const SEEDER_SECTIONS = [
    {
        id: 'modules',
        title: 'Modules Système',
        description: '12 modules de surveillance (QUADRA-1, Géopolitique, Nucléaire, Climat, Biologie, Cyber)',
        icon: Package,
        color: 'blue',
        count: DEMO_MODULES.length,
        data: DEMO_MODULES,
        entity: 'Module'
    },
    {
        id: 'documentation',
        title: 'Documentation',
        description: '3 documents (Guide démarrage, Architecture technique, Guide modules)',
        icon: FileText,
        color: 'purple',
        count: DEMO_DOCUMENTATION.length,
        data: DEMO_DOCUMENTATION,
        entity: 'Documentation'
    },
    {
        id: 'predictions',
        title: 'Prédictions d\'Événements',
        description: '4 prédictions majeures (Iran-Israël, Énergie Europe, Variant viral, Cyberattaque)',
        icon: TrendingUp,
        color: 'green',
        count: DEMO_PREDICTIONS.length,
        data: DEMO_PREDICTIONS,
        entity: 'EventPrediction'
    },
    {
        id: 'signals',
        title: 'Signaux Faibles',
        description: '3 signaux OSINT (Dark Web, Social Media, Anomalies statistiques)',
        icon: Eye,
        color: 'cyan',
        count: DEMO_SIGNALS.length,
        data: DEMO_SIGNALS,
        entity: 'MediaSignal'
    },
    {
        id: 'trends',
        title: 'Tendances',
        description: '3 tendances mondiales (IA, Arctique, Migration climatique)',
        icon: Activity,
        color: 'yellow',
        count: DEMO_TRENDS.length,
        data: DEMO_TRENDS,
        entity: 'TrendAnalysis'
    },
    {
        id: 'incidents',
        title: 'Incidents Sécurité',
        description: '3 incidents récents (Intrusion, Brute Force, API non autorisée)',
        icon: Shield,
        color: 'red',
        count: DEMO_INCIDENTS.length,
        data: DEMO_INCIDENTS,
        entity: 'SecurityIncident'
    }
];

export default function SystemDataSeeder() {
    const [loading, setLoading] = useState({});
    const [success, setSuccess] = useState({});
    const [errors, setErrors] = useState({});
    const { containerVariants, itemVariants } = useStaggerAnimation();

    const handleSeed = async (section) => {
        setLoading(prev => ({ ...prev, [section.id]: true }));
        setErrors(prev => ({ ...prev, [section.id]: null }));

        try {
            // Créer tous les enregistrements
            const results = await Promise.all(
                section.data.map(item => base44.entities[section.entity].create(item))
            );

            setSuccess(prev => ({ ...prev, [section.id]: true }));
            toast.success(`${section.title} peuplés avec succès`, {
                description: `${results.length} enregistrements créés`
            });
        } catch (error) {
            console.error(`Erreur peuplement ${section.title}:`, error);
            setErrors(prev => ({ ...prev, [section.id]: error.message }));
            toast.error(`Échec du peuplement`, {
                description: error.message
            });
        } finally {
            setLoading(prev => ({ ...prev, [section.id]: false }));
        }
    };

    const handleSeedAll = async () => {
        for (const section of SEEDER_SECTIONS) {
            if (!success[section.id]) {
                await handleSeed(section);
                // Attendre 500ms entre chaque section pour éviter le rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    };

    const totalSeeded = Object.values(success).filter(Boolean).length;
    const progressPercentage = (totalSeeded / SEEDER_SECTIONS.length) * 100;

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Initialisation Données", href: "SystemDataSeeder" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Database className="w-8 h-8 text-blue-400" />}
                    title="Initialisation Données de Démonstration"
                    subtitle="Peuplez rapidement le système avec des données réalistes"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
                    <div className="flex items-start gap-4">
                        <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-[var(--nea-text-title)] mb-2">
                                ⚠️ Page Réservée aux Administrateurs
                            </h3>
                            <p className="text-[var(--nea-text-secondary)] mb-4">
                                Cette page permet de peupler rapidement le système avec des données de démonstration réalistes. 
                                Les données insérées sont fictives mais cohérentes avec le domaine d'activité de NEA-AZEX.
                            </p>
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="text-sm text-[var(--nea-text-primary)] font-semibold mb-2">
                                        Progression: {totalSeeded} / {SEEDER_SECTIONS.length} sections complétées
                                    </p>
                                    <Progress value={progressPercentage} className="h-2 w-64" />
                                </div>
                                <NeaButton
                                    onClick={handleSeedAll}
                                    disabled={totalSeeded === SEEDER_SECTIONS.length}
                                    className="ml-auto"
                                >
                                    {totalSeeded === SEEDER_SECTIONS.length ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Tout Peuplé
                                        </>
                                    ) : (
                                        <>
                                            <Database className="w-4 h-4 mr-2" />
                                            Peupler Tout
                                        </>
                                    )}
                                </NeaButton>
                            </div>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
                {SEEDER_SECTIONS.map((section, index) => {
                    const Icon = section.icon;
                    const isLoading = loading[section.id];
                    const isSuccess = success[section.id];
                    const error = errors[section.id];

                    return (
                        <motion.div
                            key={section.id}
                            variants={itemVariants}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <NeaCard className={`p-6 transition-all ${
                                isSuccess ? 'border-green-500/50 bg-green-500/5' : 
                                error ? 'border-red-500/50 bg-red-500/5' : 
                                `border-${section.color}-500/30`
                            }`}>
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`p-3 rounded-lg bg-${section.color}-500/20`}>
                                        <Icon className={`w-6 h-6 text-${section.color}-400`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-bold text-[var(--nea-text-title)]">
                                                {section.title}
                                            </h3>
                                            {isSuccess && (
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                            )}
                                        </div>
                                        <p className="text-sm text-[var(--nea-text-secondary)] mb-3">
                                            {section.description}
                                        </p>
                                        <Badge className={`bg-${section.color}-500/20 text-${section.color}-400 border-0`}>
                                            {section.count} enregistrements
                                        </Badge>
                                    </div>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                        <p className="text-sm text-red-400">{error}</p>
                                    </div>
                                )}

                                <NeaButton
                                    onClick={() => handleSeed(section)}
                                    disabled={isLoading || isSuccess}
                                    variant={isSuccess ? 'success' : 'primary'}
                                    className="w-full"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Peuplement en cours...
                                        </>
                                    ) : isSuccess ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Peuplé avec succès
                                        </>
                                    ) : (
                                        <>
                                            <Database className="w-4 h-4 mr-2" />
                                            Peupler {section.title}
                                        </>
                                    )}
                                </NeaButton>
                            </NeaCard>
                        </motion.div>
                    );
                })}
            </div>

            <motion.div variants={itemVariants}>
                <NeaCard className="p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-500/20">
                    <div className="flex items-start gap-4">
                        <Database className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-lg font-bold text-[var(--nea-text-title)] mb-2">
                                📊 Données Créées
                            </h3>
                            <p className="text-sm text-[var(--nea-text-secondary)] leading-relaxed">
                                Les données de démonstration incluent des modules système opérationnels, 
                                de la documentation technique, des prédictions d'événements géopolitiques, 
                                des signaux faibles OSINT, des tendances mondiales et des incidents de sécurité simulés.
                                Toutes ces données sont cohérentes et interconnectées pour simuler un environnement réaliste.
                            </p>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>
        </motion.div>
    );
}